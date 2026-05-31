// src/pages/Leaderboard.tsx
import { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { PodiumProfile } from '../components/leaderboard/PodiumProfile';
import { CompetitorRow } from '../components/leaderboard/CompetitorRow';

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 24 } }
};

const viewportConfig = { once: true, margin: "-50px" };

const LEADERBOARD_DATA = [
  { id: 1, name: 'James Andrew S. Ologuin', level: 45, xp: 24500, streak: 14, rank: 1, isCurrentUser: false },
  { id: 2, name: 'John Zachary N. Gillana', level: 44, xp: 23150, streak: 12, rank: 2, isCurrentUser: false },
  { id: 3, name: 'John Michael A. Nave', level: 42, xp: 21840, streak: 21, rank: 3, isCurrentUser: true },
  { id: 4, name: 'John Peter D. Pestaño', level: 39, xp: 19200, streak: 8, rank: 4, isCurrentUser: false },
  { id: 5, name: 'Jordan A. Cabandon', level: 38, xp: 18450, streak: 5, rank: 5, isCurrentUser: false },
  { id: 6, name: 'K. Dela Cruz', level: 35, xp: 15200, streak: 3, rank: 6, isCurrentUser: false },
  { id: 7, name: 'M. Santos', level: 32, xp: 13400, streak: 1, rank: 7, isCurrentUser: false },
  { id: 8, name: 'A. Villanueva', level: 28, xp: 11100, streak: 0, rank: 8, isCurrentUser: false },
];

export default function Leaderboard() {
  const [timeLeft, setTimeLeft] = useState({ days: 4, hours: 12, minutes: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59 };
        return { ...prev };
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const topThree = LEADERBOARD_DATA.slice(0, 3);
  const remainingRanks = LEADERBOARD_DATA.slice(3);
  const podiumOrder = [topThree[1], topThree[0], topThree[2]];

  return (
    <div className="flex flex-col gap-8 sm:gap-10 w-full max-w-5xl mx-auto pb-24 px-1 sm:px-0 pt-4">
      
      {/* 1. HEADER & SEASON INFO */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="flex flex-col items-start justify-center">
          <Badge className="mb-3 bg-surface-2/60 backdrop-blur-sm text-text-muted border-borderline font-orbitron tracking-widest uppercase text-[10px] leading-none pt-1.5 pb-1 flex items-center gap-2">
            <Trophy className="w-3 h-3 text-amber-400 -mt-0.5" /> Specialist Division
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-text-main font-display tracking-tight leading-none mb-3 pt-1">
            Global <span className="text-primary">Rankings.</span>
          </h1>
          <p className="text-sm sm:text-base text-text-muted max-w-xl leading-relaxed">
            Compete against top engineering candidates. Earn XP through drills and daily challenges to climb the division ladder before the weekly reset.
          </p>
        </div>

        {/* Season Timer */}
        <div className="flex items-center gap-4 bg-surface/85 backdrop-blur-md border border-borderline/60 rounded-2xl p-4 sm:p-5 shrink-0 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
          <div className="flex flex-col items-start">
            <p className="text-[9px] font-orbitron uppercase tracking-widest text-text-muted leading-none mb-2 pt-0.5">Season Ends In</p>
            <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold font-orbitron text-text-main leading-none pt-1">
              <span className="text-accent">{timeLeft.days}</span><span className="text-xs text-text-muted">d</span>
              <span className="text-accent">{timeLeft.hours}</span><span className="text-xs text-text-muted">h</span>
              <span className="text-accent">{timeLeft.minutes}</span><span className="text-xs text-text-muted">m</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. THE PODIUM */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex items-end justify-center gap-2 sm:gap-4 lg:gap-6 mt-8 sm:mt-12 mb-8 h-[280px] sm:h-[320px]"
      >
        {podiumOrder.map((user) => user && (
          <PodiumProfile key={user.id} user={user} fadeUpVariant={fadeUpVariant} />
        ))}
      </motion.div>

      {/* 3. THE GAUNTLET */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="flex flex-col gap-3"
      >
        <div className="flex items-center justify-between px-4 pb-2 border-b border-borderline/50 mb-2">
          <span className="text-[10px] font-orbitron text-text-muted uppercase tracking-widest font-bold">Rank / Candidate</span>
          <span className="text-[10px] font-orbitron text-text-muted uppercase tracking-widest font-bold">Experience</span>
        </div>

        {remainingRanks.map((user) => (
          <CompetitorRow key={user.id} user={user} fadeUpVariant={fadeUpVariant} />
        ))}
      </motion.div>
      
    </div>
  );
}