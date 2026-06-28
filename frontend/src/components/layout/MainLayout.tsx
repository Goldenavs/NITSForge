// src/components/layout/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import InteractiveBackground from '../ui/InteractiveBackground';
import { ForgeFAB } from '../forge/ForgeFAB';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background text-text-main font-body selection:bg-primary/20 relative">
      
      {/* Global Background for the App */}
      <InteractiveBackground />
      
      {/* The Floating Pill Navigation */}
      <Navbar />

      {/* Main Content Area */}
      {/* pt-32 adds padding to the top so content isn't covered by the floating navbar */}
      {/* src/components/layout/MainLayout.tsx */}
      {/* Remove h-screen and overflow-y-auto. Let the window handle the scroll naturally. */}
      <main className="relative w-full min-h-screen pt-32 pb-16 px-4 md:px-8">
        <Outlet />
      </main>
      
      {/* Global AI Assistant */}
      <ForgeFAB />
    </div>
  );
}