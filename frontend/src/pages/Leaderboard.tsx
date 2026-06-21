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

import { useRef } from 'react';
import { useAuth } from '../store/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useLeaderboard, LeaderboardEntry } from '../hooks/useLeaderboard';
import { ArrowDown, ArrowUp, Navigation, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';

  const { user } = useAuth();
  const { profile } = useProfile();
  
  const [timeframe, setTimeframe] = useState<'all-time' | 'weekly'>('all-time');
  const [scope, setScope] = useState<'global' | 'course' | 'yearLevel'>('global');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  
  const { data: rawData, isLoading } = useLeaderboard(timeframe, scope, profile?.course, profile?.year_level);
  
  const currentUserRef = useRef<HTMLDivElement>(null);

  // Process data to include rank and current user flag, and handle XP based on timeframe
  const processedData = (rawData || []).map((entry, index) => ({
    ...entry,
    rank: index + 1,
    isCurrentUser: entry.user_id === user?.id,
    display_xp: timeframe === 'weekly' ? (entry.weekly_xp || 0) : entry.total_xp
  }));

  const topThree = processedData.slice(0, 3);
  let remainingRanks = processedData.slice(3);

  // Apply sorting to remaining ranks
  if (sortOrder === 'asc') {
    remainingRanks = [...remainingRanks].reverse();
  }

  // Handle selected user for Modal
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const scrollToMe = () => {
    if (currentUserRef.current) {
      currentUserRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const isCurrentUserInTop3 = topThree.some(u => u.isCurrentUser);
  const isCurrentUserInRemaining = remainingRanks.some(u => u.isCurrentUser);
  const showGoToMeBtn = !isCurrentUserInTop3 && isCurrentUserInRemaining;

  const podiumOrder = topThree.length === 3 ? [topThree[1], topThree[0], topThree[2]] : topThree;

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
            {scope === 'global' ? 'Global' : scope === 'course' ? 'Course' : 'Year Level'} <span className="text-primary">Rankings.</span>
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

      {/* FILTER CONTROLS */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-center gap-4 w-full bg-surface-2/30 p-2 rounded-2xl border border-borderline/50"
      >
        <div className="relative flex items-center w-full sm:w-1/2 bg-surface-2/40 border border-borderline/50 rounded-xl p-1 overflow-hidden">
          {(['all-time', 'weekly'] as const).map((tf) => {
            const isActive = timeframe === tf;
            return (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`relative flex-1 py-2 text-xs font-body capitalize transition-colors z-10 flex items-center justify-center text-center ${
                  isActive ? 'text-surface font-medium' : 'text-text-muted hover:text-text-main'
                }`}
              >
                {isActive && (
                  <motion.div layoutId="timeframeIndicator" className="absolute inset-0 bg-primary rounded-lg shadow-md -z-10" transition={{ type: "spring", stiffness: 300, damping: 25 }} />
                )}
                {tf.replace('-', ' ')}
              </button>
            );
          })}
        </div>

        <div className="relative flex items-center w-full sm:w-1/2 bg-surface-2/40 border border-borderline/50 rounded-xl p-1 overflow-hidden">
          {[
            { id: 'global', label: 'Global' },
            { id: 'course', label: profile?.course ? `${profile.course}` : 'Course' },
            { id: 'yearLevel', label: profile?.year_level ? `Year ${profile.year_level}` : 'Year Level' }
          ].map((sc) => {
            const isActive = scope === sc.id;
            return (
              <button
                key={sc.id}
                disabled={sc.id !== 'global' && (!profile?.course && sc.id === 'course' || !profile?.year_level && sc.id === 'yearLevel')}
                onClick={() => setScope(sc.id as any)}
                className={`relative flex-1 py-2 text-xs font-body transition-colors z-10 flex items-center justify-center text-center ${
                  isActive ? 'text-surface font-medium' : 'text-text-muted hover:text-text-main disabled:opacity-30 disabled:cursor-not-allowed'
                }`}
                title={sc.id !== 'global' ? 'Requires profile setup' : ''}
              >
                {isActive && (
                  <motion.div layoutId="scopeIndicator" className="absolute inset-0 bg-primary rounded-lg shadow-md -z-10" transition={{ type: "spring", stiffness: 300, damping: 25 }} />
                )}
                {sc.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* 2. THE PODIUM */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex items-end justify-center gap-2 sm:gap-4 lg:gap-6 mt-4 sm:mt-8 mb-8 h-[280px] sm:h-[320px]"
      >
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-full text-text-muted font-orbitron tracking-widest text-sm">
            CALCULATING RANKS...
          </div>
        ) : topThree.length === 0 ? (
          <div className="flex items-center justify-center w-full h-full text-text-muted font-orbitron tracking-widest text-sm">
            NO PLAYERS FOUND
          </div>
        ) : (
          podiumOrder.map((user) => user && (
            <PodiumProfile key={user.user_id} user={user} fadeUpVariant={fadeUpVariant} onClick={() => setSelectedUser(user)} />
          ))
        )}
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
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-orbitron text-text-muted uppercase tracking-widest font-bold hidden sm:inline">Experience</span>
            <Button 
              variant="ghost" 
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="p-1 h-auto text-text-muted hover:text-text-main"
            >
              {sortOrder === 'desc' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {remainingRanks.map((user) => (
          <div key={user.user_id} ref={user.isCurrentUser ? currentUserRef : null}>
            <CompetitorRow user={user} fadeUpVariant={fadeUpVariant} onClick={() => setSelectedUser(user)} />
          </div>
        ))}
      </motion.div>

      {/* FAB: Go to me */}
      <AnimatePresence>
        {showGoToMeBtn && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="fixed bottom-24 right-6 z-40"
          >
            <Button 
              onClick={scrollToMe}
              className="shadow-xl bg-primary hover:bg-primary/90 text-surface rounded-full px-4 py-3 flex items-center gap-2"
            >
              <Navigation className="w-4 h-4 fill-surface" />
              <span className="font-orbitron font-bold text-[10px] tracking-widest uppercase">Go to Me</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* <UserProfileModal 
        isOpen={!!selectedUser} 
        onClose={() => setSelectedUser(null)} 
        user={selectedUser} 
      /> */}
    </div>
  );
}