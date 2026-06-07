import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Star, Zap, Shield } from 'lucide-react'; 

interface StatProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatItem: React.FC<StatProps> = ({ label, value, icon }) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, scale: 0.9, y: 10 },
      show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    }}
    className="rounded-3xl border border-borderline bg-surface/80 backdrop-blur-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-center gap-4 hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group"
  >
    <div className="flex items-center gap-4">
      <div className="p-3.5 rounded-2xl bg-surface-2 text-primary shadow-inner group-hover:bg-primary group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <div>
        <p className="text-xs text-text-muted font-bold uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-extrabold text-text-main font-display drop-shadow-sm tracking-tight mt-1">{value}</p>
      </div>
    </div>
  </motion.div>
);

interface ProfileStatsGridProps {
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  streakFreezes: number;
}

export const ProfileStatsGrid: React.FC<ProfileStatsGridProps> = ({ totalXp, currentStreak, longestStreak, streakFreezes }) => {
  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={{
        show: {
          transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
      }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <StatItem label="Total XP" value={totalXp.toLocaleString()} icon={<Star className="w-6 h-6" />} />
      <StatItem label="Current Streak" value={`${currentStreak} Days`} icon={<Flame className="w-6 h-6" />} />
      <StatItem label="Longest Streak" value={`${longestStreak} Days`} icon={<Zap className="w-6 h-6" />} />
      <StatItem label="Streak Freezes" value={streakFreezes} icon={<Shield className="w-6 h-6" />} />
    </motion.div>
  );
};