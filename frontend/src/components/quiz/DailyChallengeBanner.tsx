import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, ShieldAlert, Play, Clock } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface DailyChallengeBannerProps {
  isCompleted: boolean;
  onStart: () => void;
}

export function DailyChallengeBanner({ isCompleted, onStart }: DailyChallengeBannerProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();

      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (val: number) => val.toString().padStart(2, '0');

  const bgIconClass = isCompleted ? "bg-green-500/10 border-green-500/30" : "bg-orange-500/10 border-orange-500/30";

  return (
    <Card className={`relative w-full overflow-hidden bg-surface/85 backdrop-blur-sm transition-all duration-300 shadow-sm border border-borderline/60 hover:border-primary/40 group`}>
      {/* Shine Effect */}
      <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] z-20 pointer-events-none group-hover:animate-[shineOneWay_1s_ease-out_forwards]" />
      
      <CardContent className="p-6 md:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
        
        {/* Left Side: Content */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1">
          <div className={`w-14 h-14 shrink-0 rounded-2xl border ${bgIconClass} ${isCompleted ? 'text-green-500' : 'text-orange-500'} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
            <Flame className="w-7 h-7" strokeWidth={1.5} />
          </div>

          <div className="flex flex-col">
            <h3 className="text-2xl font-display font-bold text-text-main mb-2 leading-tight group-hover:text-primary transition-colors flex items-center gap-3">
              Daily Challenge
              <div className="hidden sm:flex flex-wrap gap-2">
                <Badge className="bg-surface-2/80 text-text-muted border-borderline/50 font-orbitron text-[9px] tracking-wider uppercase">Daily</Badge>
                <Badge className="bg-surface-2/80 text-text-muted border-borderline/50 font-orbitron text-[9px] tracking-wider uppercase">Adaptive</Badge>
                <Badge className="bg-surface-2/80 text-text-muted border-borderline/50 font-orbitron text-[9px] tracking-wider uppercase">2x XP</Badge>
              </div>
            </h3>
            <p className="text-sm text-text-muted max-w-2xl leading-relaxed">
              {isCompleted 
                ? "You have successfully completed today's challenge. Return tomorrow for a new sequence!" 
                : "A high-stakes adaptive sequence. Complete this to secure your streak and earn double experience points."}
            </p>
          </div>
        </div>

        {/* Right Side: Timer & Action */}
        <div className="flex flex-col items-start lg:items-end w-full lg:w-auto shrink-0 border-t lg:border-t-0 lg:border-l border-borderline/50 pt-6 lg:pt-0 lg:pl-8">
          <div className="flex flex-col items-start lg:items-end mb-4">
            <span className="text-[10px] font-orbitron text-text-muted tracking-widest uppercase font-bold mb-2">
              {isCompleted ? 'Next sequence in' : 'Time remaining'}
            </span>
            <div className="flex items-center gap-2 font-orbitron font-bold text-xl text-text-main">
              <Clock className={`w-4 h-4 ${isCompleted ? 'text-green-500' : 'text-orange-500'} mr-1`} />
              <span>{formatTime(timeLeft.hours)}</span>
              <span className="text-primary/70">:</span>
              <span>{formatTime(timeLeft.minutes)}</span>
              <span className="text-primary/70">:</span>
              <span className={isCompleted ? 'text-green-500' : 'text-orange-500'}>{formatTime(timeLeft.seconds)}</span>
            </div>
          </div>

          {isCompleted ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500">
              <ShieldAlert className="w-4 h-4" />
              <span className="font-display font-bold text-sm tracking-wide">Protocol Complete</span>
            </div>
          ) : (
            <Button
              variant="primary"
              onClick={onStart}
              className="w-full lg:w-auto font-orbitron uppercase tracking-widest text-xs py-3 px-6 bg-orange-600 hover:bg-orange-500 text-white border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)]"
            >
              <Play className="w-4 h-4 mr-2" fill="currentColor" /> Initiate Sequence
            </Button>
          )}
        </div>

      </CardContent>

      {/* Ambient Glow */}
      <div className={`absolute -right-8 -top-8 w-64 h-64 ${isCompleted ? 'bg-green-500' : 'bg-orange-500'} opacity-[0.03] blur-3xl rounded-full pointer-events-none group-hover:opacity-10 transition-opacity duration-500`} />
    </Card>
  );
}
