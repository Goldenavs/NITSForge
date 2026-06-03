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

  useEffect(() => {
    // 1. Check for an existing guest session in localStorage on mount
    const guestFlag = localStorage.getItem('nitsforge_guest_session') === 'true';
    if (guestFlag) setIsGuest(true);

    // 2. Check active Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 3. Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
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