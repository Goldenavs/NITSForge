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
      className="rounded-3xl border border-borderline bg-surface/80 backdrop-blur-xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-center gap-6 md:gap-8 relative overflow-hidden group hover:border-primary/50 transition-colors"
    >
      <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-full bg-surface-2 border-[6px] border-primary shadow-[0_0_20px_rgba(var(--color-primary),0.3)] relative overflow-hidden transition-transform duration-500 group-hover:scale-105">
        {/* Subtle background glow for the rank icon */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-transparent opacity-20"></div>
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white opacity-10 rotate-45 group-hover:translate-x-[200%] transition-transform duration-1000"></div>
        <span className="relative z-10 text-4xl md:text-5xl font-extrabold text-primary font-display">{level}</span>
      </div>
      
      <div className="flex-grow w-full">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-3xl font-extrabold text-text-main font-display tracking-tight drop-shadow-sm">{title}</h3>
            <p className="text-sm text-text-muted font-medium uppercase tracking-wider mt-1">Level {level} Rank</p>
          </div>
          <div className="text-right flex flex-col">
            <span className="text-xl font-bold text-text-main drop-shadow-sm">{currentXp.toLocaleString()} <span className="text-sm font-medium text-text-muted">XP</span></span>
            <span className="text-xs text-text-muted font-medium mt-1">{nextLevelXp.toLocaleString()} XP to Next Rank</span>
          </div>
        </div>
        
        {/* Animated XP Bar */}
        <div className="h-3.5 rounded-full bg-surface-2 overflow-hidden border border-borderline shadow-inner relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className="h-full rounded-full bg-xp relative shadow-[0_0_10px_rgba(var(--color-xp),0.8)]"
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