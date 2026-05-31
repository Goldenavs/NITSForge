// src/components/gamification/CountdownCard.tsx
import { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Play, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';

interface CountdownCardProps {
  isCompleted: boolean;
  viewportConfig: { once: boolean; margin: string };
  fadeUpVariant: Variants;
}

export function CountdownCard({ isCompleted, viewportConfig, fadeUpVariant }: CountdownCardProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 }; 
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (val: number) => val.toString().padStart(2, '0');

  // We keep Green for success states as that is a universal UI pattern, 
  // but use the dynamic Theme colors for the active state.
  return (
    <motion.div 
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      <Card className={`relative overflow-hidden bg-surface/85 backdrop-blur-md shadow-xl border ${isCompleted ? 'border-green-500/40' : 'border-primary/40'}`}>
        
        {/* Dynamic Theme Gradient Edge */}
        <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${isCompleted ? 'from-green-400 to-emerald-600' : 'from-primary to-accent'}`} />
        
        <CardContent className="p-8 sm:p-10 flex flex-col items-center text-center relative z-10">
          <div className="flex flex-col items-center mb-8">
            <p className="text-[10px] font-orbitron uppercase tracking-widest text-text-muted mb-3 font-bold leading-none pt-1">
              {isCompleted ? 'Next Challenge In' : 'Time Remaining'}
            </p>
            <div className="flex items-center gap-2 sm:gap-4 font-orbitron font-bold text-3xl sm:text-5xl text-text-main leading-none pt-2">
              <div className="flex flex-col items-center">
                <span className="bg-surface-2/80 border border-borderline/50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl">{formatTime(timeLeft.hours)}</span>
                <span className="text-[9px] text-text-muted mt-2 tracking-widest uppercase">HRS</span>
              </div>
              <span className="text-primary pb-5">:</span>
              <div className="flex flex-col items-center">
                <span className="bg-surface-2/80 border border-borderline/50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl">{formatTime(timeLeft.minutes)}</span>
                <span className="text-[9px] text-text-muted mt-2 tracking-widest uppercase">MIN</span>
              </div>
              <span className="text-primary pb-5">:</span>
              <div className="flex flex-col items-center">
                <span className="bg-surface-2/80 border border-borderline/50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-primary">{formatTime(timeLeft.seconds)}</span>
                <span className="text-[9px] text-primary/70 mt-2 tracking-widest uppercase">SEC</span>
              </div>
            </div>
          </div>

          {isCompleted ? (
            <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400">
              <ShieldAlert className="w-5 h-5" />
              <span className="font-display font-bold text-sm">Protocol Complete. Streak Secured.</span>
            </div>
          ) : (
            <Link to="/quiz/session?mode=daily" className="w-full sm:w-auto">
              <Button 
                variant="primary" 
                className="w-full sm:w-auto px-10 py-5 text-lg font-orbitron tracking-widest shadow-[0_0_25px_rgba(var(--color-primary),0.4)] hover:shadow-[0_0_35px_rgba(var(--color-primary),0.6)] hover:scale-105 transition-all duration-300 leading-none pt-6 pb-5"
              >
                <Play className="w-5 h-5 mr-3 -mt-1" fill="currentColor" /> Initiate Sequence
              </Button>
            </Link>
          )}
        </CardContent>

        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] blur-3xl pointer-events-none ${isCompleted ? 'bg-green-500' : 'bg-primary'}`} />
      </Card>
    </motion.div>
  );
}