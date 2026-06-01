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
      hidden: { opacity: 0, scale: 0.9 },
      show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
    }}
    className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm flex items-center gap-4 hover:border-[var(--color-primary)] transition-colors cursor-default"
  >
    <div className="p-3 rounded-xl bg-[var(--color-surface-2)] text-[var(--color-primary)]">
      {icon}
    </div>
    <div>
      <p className="text-sm text-[var(--color-text-muted)] font-medium">{label}</p>
      <p className="text-xl font-bold text-[var(--color-text-primary)]">{value}</p>
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