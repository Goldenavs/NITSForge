import React from 'react';
import { motion } from 'framer-motion';

interface ProfileRankCardProps {
  level: number;
  title: string;
  currentXp: number;
  nextLevelXp: number;
}

export const ProfileRankCard: React.FC<ProfileRankCardProps> = ({ level, title, currentXp, nextLevelXp }) => {
  const progressPercentage = Math.min((currentXp / nextLevelXp) * 100, 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm flex flex-col md:flex-row items-center gap-6"
    >
      <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-[var(--color-surface-2)] border-4 border-[var(--color-primary)] shadow-inner relative overflow-hidden">
        {/* Subtle background glow for the rank icon */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-transparent opacity-20"></div>
        <span className="relative z-10 text-3xl font-bold text-[var(--color-primary)]">{level}</span>
      </div>
      
      <div className="flex-grow w-full">
        <div className="flex justify-between items-end mb-3">
          <div>
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">{title}</h3>
            <p className="text-sm text-[var(--color-text-muted)] font-medium">Rank Level {level}</p>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-[var(--color-text-primary)]">{currentXp.toLocaleString()}</span>
            <span className="text-sm text-[var(--color-text-muted)]"> / {nextLevelXp.toLocaleString()} XP</span>
          </div>
        </div>
        
        {/* Animated XP Bar */}
        <div className="h-2.5 rounded-full bg-[var(--color-surface-2)] overflow-hidden border border-[var(--color-border)] shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className="h-full rounded-full bg-[var(--color-xp)] relative"
          >
            {/* Shimmer effect inside the XP bar */}
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};