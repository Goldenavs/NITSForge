import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export interface AnswerHistoryRecord {
  answer_id: string;
  session_id: string;
  user_id: string;
  answered_at: string;
  session_mode: string;
  question_id: string;
  question_category: string;
  question_text: string;
  question_options: Record<string, string>;
  correct_answer: string;
  explanation: string;
  user_answer: string | null;
  is_correct: boolean;
}

export function useHistory() {
  const [data, setData] = useState<AnswerHistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 50;

  const fetchHistory = async (pageNumber: number, append: boolean = false) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const start = pageNumber * PAGE_SIZE;
      const end = start + PAGE_SIZE - 1;

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: records, error: dbError } = await supabase
        .from('user_answer_history')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('answered_at', thirtyDaysAgo.toISOString())
        .order('answered_at', { ascending: false })
        .range(start, end);

      if (dbError) throw dbError;

      if (records) {
        if (append) {
          setData(prev => [...prev, ...records]);
        } else {
          setData(records);
        }
        
        setHasMore(records.length === PAGE_SIZE);
      }
    } catch (err: any) {
      console.error("Failed to load history:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(0, false);
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchHistory(nextPage, true);
  };

  return { data, isLoading, error, loadMore, hasMore };
}
