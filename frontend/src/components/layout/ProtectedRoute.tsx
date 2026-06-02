import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { Loader2 } from 'lucide-react'; // Optional: for the loading spinner

export const ProtectedRoute: React.FC = () => {
  const { session, loading } = useAuth();

  // Show a loading screen while Supabase checks the session
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[var(--color-bg)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  // If no session exists, boot them back to the landing page
  if (!session) {
    return <Navigate to="/" replace />;
  }

  // If they are logged in, render the child routes (like /dashboard)
  return <Outlet />;
};