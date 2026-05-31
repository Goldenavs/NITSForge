// src/components/layout/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import InteractiveBackground from '../ui/InteractiveBackground';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background text-text-main font-body selection:bg-primary/20 relative">
      
      {/* Global Background for the App */}
      <InteractiveBackground />
      
      {/* The Floating Pill Navigation */}
      <Navbar />

      {/* Main Content Area */}
      {/* pt-32 adds padding to the top so content isn't covered by the floating navbar */}
      <main className="h-screen w-screen overflow-y-auto overflow-x-hidden relative z-10 pt-32 pb-16 px-4 md:px-8">
        <Outlet />
      </main>
      
    </div>
  );
}