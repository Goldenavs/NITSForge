import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export interface DashboardStats {
  profile: {
    display_name: string;
    rank_level: number;
    total_xp: number;
    current_streak: number;
    longest_streak: number;
  };
  overview: {
    total_questions_answered: number;
    overall_accuracy: number;
  };
  accuracy_trends: { session: string; score: number }[];
  category_radar: { subject: string; A: number; fullMark: 100 }[];
  insights: {
    strongest_category: string | null;
    weakest_category: string | null;
  };
}

export function useDashboardStats() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setIsLoading(false);
          return;
        }

        const { data: stats, error: rpcError } = await supabase.rpc('get_dashboard_stats', {
          p_user_id: session.user.id
        });

        if (rpcError) throw rpcError;

        setData(stats as DashboardStats);
      } catch (err: any) {
        console.error("Failed to load dashboard stats:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { data, isLoading, error };
}
