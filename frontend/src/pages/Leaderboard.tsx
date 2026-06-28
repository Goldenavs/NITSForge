// src/pages/Leaderboard.tsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Trophy, ArrowDown, ArrowUp, Navigation, ChevronDown } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PodiumProfile } from '../components/leaderboard/PodiumProfile';
import { CompetitorRow } from '../components/leaderboard/CompetitorRow';
import { UserProfileModal } from '../components/leaderboard/UserProfileModal';
import { GuestLockScreen } from '../components/auth/GuestLockScreen';

import { useAuth } from '../store/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useLeaderboard, type LeaderboardEntry } from '../hooks/useLeaderboard';

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 24 } }
};

const viewportConfig = { once: true, margin: "-50px" };

export default function Leaderboard() {
  const { user } = useAuth();
  
  if (!user) {
    return <GuestLockScreen featureName="Global Leaderboard" />;
  }

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

  // Handle dropdown state
  const [isScopeDropdownOpen, setIsScopeDropdownOpen] = useState(false);

  // Handle selected user for Modal
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null);

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

      </motion.div>

      {/* FILTER CONTROLS */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-8 w-full mt-4 mb-12 sm:mb-16"
      >
        {/* Row 1: Timeframe (Equally sized, longer horizontally) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-3xl">
          <button
            onClick={() => setTimeframe('all-time')}
            className={`relative flex-1 w-full py-4 sm:py-5 rounded-2xl transition-all duration-300 flex items-center justify-center border ${
              timeframe === 'all-time'
                ? 'bg-primary/10 border-primary text-primary shadow-[0_0_20px_rgba(var(--color-primary),0.25)]'
                : 'bg-surface-2/40 border-borderline/50 text-text-muted hover:border-text-muted/50 hover:bg-surface-2/60'
            }`}
          >
            <span className={`font-orbitron font-bold tracking-widest uppercase text-base sm:text-xl ${timeframe === 'all-time' ? 'drop-shadow-[0_0_8px_rgba(var(--color-primary),0.8)]' : ''}`}>
              All Time
            </span>
          </button>

          <button
            onClick={() => setTimeframe('weekly')}
            className={`relative flex-1 w-full py-4 sm:py-5 rounded-2xl transition-all duration-300 flex items-center justify-center border ${
              timeframe === 'weekly'
                ? 'bg-accent/10 border-accent text-accent shadow-[0_0_20px_rgba(var(--color-accent),0.25)]'
                : 'bg-surface-2/40 border-borderline/50 text-text-muted hover:border-text-muted/50 hover:bg-surface-2/60'
            }`}
          >
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Timer on the left */}
              <div className="flex flex-col items-end border-r border-borderline/50 pr-4 sm:pr-6">
                <span className="text-[8px] sm:text-[10px] font-orbitron uppercase tracking-widest text-text-muted leading-none mb-1.5">Resets In</span>
                <span className={`text-xs sm:text-sm font-bold font-orbitron leading-none ${timeframe === 'weekly' ? 'text-accent drop-shadow-[0_0_5px_rgba(var(--color-accent),0.5)]' : 'text-text-main'}`}>
                  {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
                </span>
              </div>
              
              {/* Weekly Text */}
              <span className={`font-orbitron font-bold tracking-widest uppercase text-base sm:text-xl ${timeframe === 'weekly' ? 'drop-shadow-[0_0_8px_rgba(var(--color-accent),0.8)]' : ''}`}>
                Weekly
              </span>
            </div>
          </button>
        </div>

        {/* Row 2: Custom Scope Dropdown */}
        <div className="relative flex justify-center w-full max-w-sm">
           <div 
             className="w-full flex items-center justify-between bg-surface-2/50 border border-borderline/80 text-text-main py-4 px-6 rounded-xl font-body text-sm sm:text-base outline-none hover:border-primary/50 hover:bg-surface-2/80 transition-all cursor-pointer shadow-sm group"
             onClick={() => setIsScopeDropdownOpen(!isScopeDropdownOpen)}
           >
              <span className="font-medium">
                {scope === 'global' ? 'Global' : scope === 'course' ? `Course - ${profile?.course}` : `Year Level - ${profile?.year_level}`}
              </span>
              <ChevronDown className={`w-5 h-5 text-text-muted group-hover:text-primary transition-transform duration-300 ${isScopeDropdownOpen ? 'rotate-180 text-primary' : ''}`} />
           </div>

           <AnimatePresence>
             {isScopeDropdownOpen && (
               <motion.div
                 initial={{ opacity: 0, y: -10, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: -10, scale: 0.95 }}
                 transition={{ duration: 0.2 }}
                 className="absolute top-[calc(100%+8px)] left-0 right-0 bg-surface-2 border border-borderline rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col"
               >
                 {[
                   { id: 'global', label: 'Global' },
                   { id: 'course', label: profile?.course ? `Course - ${profile.course}` : 'Course (Requires Profile Setup)', disabled: !profile?.course },
                   { id: 'yearLevel', label: profile?.year_level ? `Year Level - ${profile.year_level}` : 'Year Level (Requires Profile Setup)', disabled: !profile?.year_level }
                 ].map((opt) => (
                   <button
                     key={opt.id}
                     disabled={opt.disabled}
                     onClick={() => {
                       setScope(opt.id as any);
                       setIsScopeDropdownOpen(false);
                     }}
                     className={`text-left px-6 py-4 font-body text-sm sm:text-base transition-colors ${
                       scope === opt.id ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary' : 'text-text-main hover:bg-surface-3 border-l-4 border-transparent disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent'
                     }`}
                   >
                     {opt.label}
                   </button>
                 ))}
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </motion.div>

      {/* 2. THE PODIUM */}
      <motion.div
        key={`podium-${scope}-${timeframe}`}
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
        key={`gauntlet-${scope}-${timeframe}`}
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

      <UserProfileModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
      />
    </div>
  );
}