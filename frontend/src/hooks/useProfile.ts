// src/hooks/useProfile.ts
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../store/AuthContext';
import { calculateLevel, getNextLevelXp, getRankTitle } from '../utils/ranking';

export interface UserProfile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  course: string | null;
  year_level: number | null;
  banner_url: string | null;
  avatar_frame: string | null;
  total_xp: number;
  rank_level: number;
  current_streak: number;
  longest_streak: number;
  last_study_date: string | null;
  streak_freezes_available: number;
  // Derived fields
  calculatedLevel: number;
  rankTitle: string;
  nextLevelXp: number;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        const calculatedLevel = calculateLevel(data.total_xp || 0);
        const nextLevelXp = getNextLevelXp(calculatedLevel);
        const rankTitle = getRankTitle(calculatedLevel);

        setProfile({
          ...data,
          calculatedLevel,
          rankTitle,
          nextLevelXp,
        });
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    
    // Optimistic UI update
    const previousProfile = profile;
    setProfile((prev) => prev ? { ...prev, ...updates } : null);

    try {
      // Remove derived fields before sending to Supabase
      const { calculatedLevel, rankTitle, nextLevelXp, ...dbUpdates } = updates as any;
      
      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', user.id);

      if (error) throw error;
      
      // Re-fetch to ensure sync
      await fetchProfile();
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setProfile(previousProfile); // rollback
      throw err;
    }
  };

  return { profile, loading, error, updateProfile, fetchProfile };
};
