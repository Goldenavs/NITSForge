import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export interface TopicMastery {
  category: string;
  total_db_count: number;
  attempted_count: number;
  correct_count: number;
}

export function useTopicsData() {
  const [topicsData, setTopicsData] = useState<Record<string, TopicMastery>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMastery() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // If guest mode, just return empty/zeros or we can mock it
        if (!session?.user || localStorage.getItem('nitsforge_guest_session') === 'true') {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase.rpc('get_topic_mastery', {
          user_uuid: session.user.id
        });

        if (error) {
          console.error("Error fetching topic mastery:", error);
          setIsLoading(false);
          return;
        }

        if (data) {
          const formatted: Record<string, TopicMastery> = {};
          data.forEach((item: any) => {
            formatted[item.category] = {
              category: item.category,
              total_db_count: Number(item.total_db_count),
              attempted_count: Number(item.attempted_count),
              correct_count: Number(item.correct_count)
            };
          });
          setTopicsData(formatted);
        }
      } catch (err) {
        console.error("Unexpected error fetching topic data", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMastery();
  }, []);

  return { topicsData, isLoading };
}
