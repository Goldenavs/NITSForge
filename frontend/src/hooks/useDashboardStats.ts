import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../store/AuthContext';

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
  const { isGuest } = useAuth();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        if (isGuest) {
          setData({
            profile: {
              display_name: 'Guest User',
              rank_level: 1,
              total_xp: 0,
              current_streak: 0,
              longest_streak: 0,
            },
            overview: {
              total_questions_answered: 0,
              overall_accuracy: 0,
            },
            accuracy_trends: [
              { session: 'Start', score: 0 }
            ],
            category_radar: [
              { subject: 'Math', A: 0, fullMark: 100 },
              { subject: 'Science', A: 0, fullMark: 100 },
              { subject: 'Electronics', A: 0, fullMark: 100 },
              { subject: 'Computing', A: 0, fullMark: 100 }
            ],
            insights: {
              strongest_category: 'N/A',
              weakest_category: 'N/A'
            }
          });
          setIsLoading(false);
          return;
        }

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
