// src/components/layout/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';

export function ProtectedRoute() {
  const { user, isGuest, loading } = useAuth();
  const location = useLocation();

  // Show nothing (or a cool orbitron spinner) while checking auth status
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-bg-color">
        <div className="text-primary font-orbitron animate-pulse">Loading Forge...</div>
      </div>
    );
  }

  // The Gatekeeper: If you aren't a Supabase user AND you aren't a guest, kick to Landing
  if (!user && !isGuest) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Otherwise, render the nested routes (Dashboard, Quiz, etc.)
  return <Outlet />;
}