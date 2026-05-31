// src/pages/DailyChallenge.tsx
import { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Flame, Trophy, Zap, Play, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

// Motion Orchestration
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 24 } }
};

const viewportConfig = { once: true, margin: "-50px" };

export default function DailyChallenge() {
  // Mock Countdown Timer Logic
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 }; // Reset mock
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (val: number) => val.toString().padStart(2, '0');

  // Mock State: Has the user completed today's challenge?
  const isCompleted = false; 

  return (
    <div className="flex flex-col gap-8 sm:gap-10 w-full max-w-4xl mx-auto pb-24 px-1 sm:px-0 pt-4">
      
      {/* 1. HEADER SECTION */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        className="flex flex-col items-center justify-center text-center mt-4"
      >
        <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(249,115,22,0.2)]">
          <Flame className="w-8 h-8 text-orange-500" />
        </div>
        
        <Badge className="mb-4 bg-surface-2/60 backdrop-blur-sm text-text-muted border-borderline font-orbitron tracking-widest uppercase text-[10px] leading-none pt-1.5 pb-1">
          High-Stakes Protocol
        </Badge>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-main font-display tracking-tight leading-none mb-4 pt-1">
          Daily <span className="text-orange-500">Challenge.</span>
        </h1>
        
        <p className="text-sm sm:text-base text-text-muted max-w-xl leading-relaxed">
          One attempt. Five advanced questions curated from your weakest topics. Succeed to earn massive XP multipliers and protect your streak.
        </p>
      </motion.div>

      {/* 2. THE MAIN EVENT CARD */}
      <motion.div 
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        <Card className={`relative overflow-hidden bg-surface/85 backdrop-blur-md border shadow-xl ${isCompleted ? 'border-green-500/40' : 'border-orange-500/40'}`}>
          {/* Glowing Edge */}
          <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${isCompleted ? 'from-green-400 to-emerald-600' : 'from-orange-400 to-rose-600'}`} />
          
          <CardContent className="p-8 sm:p-10 flex flex-col items-center text-center relative z-10">
            
            {/* Live Countdown Timer */}
            <div className="flex flex-col items-center mb-8">
              <p className="text-[10px] font-orbitron uppercase tracking-widest text-text-muted mb-3 font-bold leading-none pt-1">
                {isCompleted ? 'Next Challenge In' : 'Time Remaining'}
              </p>
              <div className="flex items-center gap-2 sm:gap-4 font-orbitron font-bold text-3xl sm:text-5xl text-text-main leading-none pt-2">
                <div className="flex flex-col items-center">
                  <span className="bg-surface-2/80 border border-borderline/50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl">{formatTime(timeLeft.hours)}</span>
                  <span className="text-[9px] text-text-muted mt-2 tracking-widest uppercase">HRS</span>
                </div>
                <span className="text-orange-500 pb-5">:</span>
                <div className="flex flex-col items-center">
                  <span className="bg-surface-2/80 border border-borderline/50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl">{formatTime(timeLeft.minutes)}</span>
                  <span className="text-[9px] text-text-muted mt-2 tracking-widest uppercase">MIN</span>
                </div>
                <span className="text-orange-500 pb-5">:</span>
                <div className="flex flex-col items-center">
                  <span className="bg-surface-2/80 border border-borderline/50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-orange-500">{formatTime(timeLeft.seconds)}</span>
                  <span className="text-[9px] text-orange-500/70 mt-2 tracking-widest uppercase">SEC</span>
                </div>
              </div>
            </div>

            {/* Action Area */}
            {isCompleted ? (
              <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400">
                <ShieldAlert className="w-5 h-5" />
                <span className="font-display font-bold text-sm">Protocol Complete. Streak Secured.</span>
              </div>
            ) : (
              <Link to="/quiz/session?mode=daily" className="w-full sm:w-auto">
                <Button 
                  variant="primary" 
                  className="w-full sm:w-auto px-10 py-5 text-lg font-orbitron tracking-widest bg-orange-600 hover:bg-orange-700 text-white border-none shadow-[0_0_25px_rgba(234,88,12,0.4)] hover:shadow-[0_0_35px_rgba(234,88,12,0.6)] hover:scale-105 transition-all duration-300 leading-none pt-6 pb-5"
                >
                  <Play className="w-5 h-5 mr-3 -mt-1" fill="currentColor" /> Initiate Sequence
                </Button>
              </Link>
            )}

          </CardContent>

          {/* Ambient Glow */}
          <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] blur-3xl pointer-events-none ${isCompleted ? 'bg-green-500' : 'bg-orange-500'}`} />
        </Card>
      </motion.div>

      {/* 3. REWARDS BREAKDOWN */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mt-2"
      >
        <motion.div variants={fadeUpVariant} className="h-full">
          <Card className="h-full bg-surface/85 backdrop-blur-md border border-borderline/60 flex flex-col items-center text-center p-6 hover:border-amber-500/40 transition-colors">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="font-display font-bold text-text-main leading-none pt-1 mb-2">Double XP</h3>
            <p className="text-xs text-text-muted font-body leading-relaxed">Earn 2x the standard experience points for every correct answer in this session.</p>
          </Card>
        </motion.div>

        <motion.div variants={fadeUpVariant} className="h-full">
          <Card className="h-full bg-surface/85 backdrop-blur-md border border-borderline/60 flex flex-col items-center text-center p-6 hover:border-orange-500/40 transition-colors">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="font-display font-bold text-text-main leading-none pt-1 mb-2">Streak Repair</h3>
            <p className="text-xs text-text-muted font-body leading-relaxed">Completing the challenge instantly restores your streak if you missed yesterday.</p>
          </Card>
        </motion.div>

        <motion.div variants={fadeUpVariant} className="h-full">
          <Card className="h-full bg-surface/85 backdrop-blur-md border border-borderline/60 flex flex-col items-center text-center p-6 hover:border-accent/40 transition-colors">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-display font-bold text-text-main leading-none pt-1 mb-2">Adaptive Focus</h3>
            <p className="text-xs text-text-muted font-body leading-relaxed">Questions are specifically targeted at topics where your accuracy is below 70%.</p>
          </Card>
        </motion.div>
      </motion.div>

    </div>
  );
}