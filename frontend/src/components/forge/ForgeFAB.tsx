// src/components/forge/ForgeFAB.tsx
import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { ForgeChatDrawer } from './ForgeChatDrawer';

interface ForgeFABProps {
  context?: any;
}

export function ForgeFAB({ context }: ForgeFABProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const handleOpenForge = () => setIsDrawerOpen(true);
    window.addEventListener('open-forge', handleOpenForge);
    return () => window.removeEventListener('open-forge', handleOpenForge);
  }, []);

  return (
    <>
      <button 
        onClick={() => setIsDrawerOpen(true)}
        className="fixed bottom-6 right-6 z-40 group flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-primary opacity-20 blur-xl rounded-full group-hover:opacity-40 transition-opacity duration-300" />
        <div className="relative w-14 h-14 bg-surface/90 backdrop-blur-md border-2 border-primary/50 rounded-2xl shadow-xl shadow-black/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 group-hover:border-primary">
          <Sparkles className="w-6 h-6 text-primary animate-pulse" />
        </div>
        
        {/* Tooltip */}
        <div className="absolute right-full mr-4 bg-surface-2/90 backdrop-blur-sm border border-borderline px-3 py-1.5 rounded-lg text-xs font-orbitron font-bold tracking-wider text-text-main opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap">
          Ask Forge AI
        </div>
      </button>

      <ForgeChatDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        context={context} 
      />
    </>
  );
}