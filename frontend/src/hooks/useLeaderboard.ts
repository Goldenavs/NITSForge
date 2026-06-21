import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  rank_level: number;
  total_xp: number;
  weekly_xp?: number;
  course?: string | null;
  year_level?: number | null;
  bio?: string | null;
  banner_url?: string | null;
  avatar_frame?: string | null;
  current_streak?: number;
}

export function useLeaderboard(
  timeframe: 'all-time' | 'weekly' = 'all-time',
  scope: 'global' | 'course' | 'yearLevel' = 'global',
  userCourse?: string | null,
  userYearLevel?: number | null
) {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      setIsLoading(true);
      setError(null);

      try {
        if (timeframe === 'all-time') {
          // RPC call for all-time to bypass RLS (since profiles table only allows reading own profile)
          const rpcParams: Record<string, any> = {};
          if (scope === 'course' && userCourse) {
            rpcParams.p_course = userCourse;
          } else if (scope === 'yearLevel' && userYearLevel) {
            rpcParams.p_year_level = userYearLevel;
          }

          const { data: allTimeData, error: dbError } = await supabase.rpc('get_all_time_leaderboard', rpcParams);
          if (dbError) throw dbError;
          setData(allTimeData as unknown as LeaderboardEntry[]);
        } else {
          // RPC call for weekly
          const rpcParams: Record<string, any> = {};
          if (scope === 'course' && userCourse) {
            rpcParams.p_course = userCourse;
          } else if (scope === 'yearLevel' && userYearLevel) {
            rpcParams.p_year_level = userYearLevel;
          }

          const { data: weeklyData, error: rpcError } = await supabase.rpc('get_weekly_leaderboard', rpcParams);

          if (rpcError) throw rpcError;
          setData(weeklyData as LeaderboardEntry[]);
        }
      } catch (err: any) {
        console.error("Failed to load leaderboard:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeaderboard();
  }, [timeframe, scope, userCourse, userYearLevel]);

  return { data, isLoading, error };
}
