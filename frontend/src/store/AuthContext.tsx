// src/store/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isGuest: boolean;                  // New: Track guest state
  loginAsGuest: () => void;          // New: Function to trigger guest mode
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  user: null, 
  loading: true,
  isGuest: false,
  loginAsGuest: () => {},
  signOut: async () => {} 
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  const syncGuestSessions = async (userId: string) => {
    try {
      const rawGuestSessions = localStorage.getItem('nitsforge_guest_sessions');
      if (!rawGuestSessions) return;
      
      const guestSessions = JSON.parse(rawGuestSessions);
      if (!Array.isArray(guestSessions) || guestSessions.length === 0) return;

      console.log('Migrating guest sessions to Supabase for user:', userId);

      for (const sessionObj of guestSessions) {
        const { questions, selectedAnswers, finalScore, completedAt } = sessionObj;
        
        const accuracyRate = questions.length > 0 ? (finalScore / questions.length) * 100 : 0;
        const { data: sessionData, error: sessionError } = await supabase
          .from('quiz_sessions')
          .insert({
            user_id: userId,
            mode: 'standard',
            total_questions: questions.length,
            correct_answers: finalScore,
            accuracy_rate: accuracyRate,
            xp_earned: finalScore * 10,
            completed_at: completedAt || new Date().toISOString()
          })
          .select('id')
          .single();

        if (sessionError) {
          console.error('Error saving migrated quiz session:', sessionError);
          continue;
        }

        const sessionId = sessionData.id;
        const answerInserts = questions.map((q: any) => ({
          session_id: sessionId,
          user_id: userId,
          question_id: q.id,
          selected_answer: selectedAnswers[q.id] || null,
          is_correct: selectedAnswers[q.id] === q.correct_answer,
        }));

        if (answerInserts.length > 0) {
          const { error: answersError } = await supabase
            .from('session_answers')
            .insert(answerInserts);

          if (answersError) {
            console.error('Error saving migrated session answers:', answersError);
          }
        }
      }

      localStorage.removeItem('nitsforge_guest_sessions');
      console.log('Guest sessions migrated successfully.');
    } catch (err) {
      console.error('Migration failed:', err);
    }
  };

  useEffect(() => {
    // 1. Check for an existing guest session in localStorage on mount
    const guestFlag = localStorage.getItem('nitsforge_guest_session') === 'true';
    if (guestFlag) setIsGuest(true);

    // 2. Check active Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        syncGuestSessions(session.user.id);
      }
    });

    // 3. Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        syncGuestSessions(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Set the guest flag locally and in state
  const loginAsGuest = () => {
    localStorage.setItem('nitsforge_guest_session', 'true');
    setIsGuest(true);
  };

  const signOut = async () => {
    // 1. Wipe the guest session if it exists
    localStorage.removeItem('nitsforge_guest_session');
    setIsGuest(false);
    
    // 2. Clear Supabase session
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, isGuest, loginAsGuest, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);