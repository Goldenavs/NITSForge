import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  rank_level: number;
  total_xp?: number;
  weekly_xp?: number;
}

export function useLeaderboard(timeframe: 'all-time' | 'weekly' = 'all-time') {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      setIsLoading(true);
      setError(null);

      try {
        if (timeframe === 'all-time') {
          // Standard Supabase query for all-time
          const { data: allTimeData, error: dbError } = await supabase
            .from('profiles')
            .select('id as user_id, display_name, avatar_url, rank_level, total_xp')
            .order('total_xp', { ascending: false })
            .limit(50);

          if (dbError) throw dbError;
          setData(allTimeData as unknown as LeaderboardEntry[]);
        } else {
          // RPC call for weekly
          const { data: weeklyData, error: rpcError } = await supabase.rpc('get_weekly_leaderboard');

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
  }, [timeframe]);

  return { data, isLoading, error };
}
