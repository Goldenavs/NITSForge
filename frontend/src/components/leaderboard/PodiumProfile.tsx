// src/components/leaderboard/PodiumProfile.tsx
import { motion, type Variants } from 'framer-motion';
import { Crown, Medal } from 'lucide-react';
import { Badge } from '../ui/Badge';

import type { LeaderboardEntry } from '../../hooks/useLeaderboard';

interface PodiumProfileProps {
  user: LeaderboardEntry & { rank: number; isCurrentUser: boolean; display_xp: number };
  fadeUpVariant: Variants;
  onClick: () => void;
}

export function PodiumProfile({ user, fadeUpVariant, onClick }: PodiumProfileProps) {
  const isFirst = user.rank === 1;
  const isSecond = user.rank === 2;
  
  const heightClass = isFirst ? 'h-[220px] sm:h-[260px]' : isSecond ? 'h-[180px] sm:h-[220px]' : 'h-[150px] sm:h-[190px]';
  const colorClass = isFirst ? 'border-yellow-400 bg-yellow-400/10' : isSecond ? 'border-slate-300 bg-slate-300/10' : 'border-orange-500 bg-orange-500/10';
  const glowClass = isFirst ? 'bg-yellow-400' : isSecond ? 'bg-slate-300' : 'bg-orange-500';
  const Icon = isFirst ? Crown : Medal;
  const iconColor = isFirst ? 'text-yellow-400' : isSecond ? 'text-slate-300' : 'text-orange-500';

  return (
    <motion.div 
      variants={fadeUpVariant} 
      onClick={onClick}
      className={`relative flex flex-col items-center w-full max-w-[200px] cursor-pointer hover:-translate-y-2 transition-transform duration-300 ${user.isCurrentUser ? 'scale-105 z-10' : ''}`}
    >
      
      {/* Avatar Container */}
      <div className="relative mb-6 flex flex-col items-center group">
        
        {/* Floating Animated Icon */}
        <motion.div 
          animate={{ y: [0, -8, 0], rotate: isFirst ? [0, -5, 5, 0] : 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute -top-8 ${isFirst ? 'scale-150 -top-10' : 'scale-110'}`}
        >
          <Icon className={`w-8 h-8 ${iconColor} drop-shadow-[0_0_15px_rgba(currentColor,0.8)]`} />
        </motion.div>

        {/* Glowing Pulsing Ring */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute inset-0 rounded-full ${colorClass} blur-md -z-10`}
        />

        <div className={`w-16 h-16 sm:w-24 sm:h-24 rounded-full border-4 ${colorClass} flex items-center justify-center bg-surface backdrop-blur-md shadow-2xl overflow-hidden relative z-10 group-hover:border-opacity-100 transition-colors duration-300`}>
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.display_name} className="w-full h-full object-cover" />
          ) : (
            <span className={`font-display font-bold text-2xl sm:text-4xl ${iconColor} leading-none pt-1`}>
              {user.display_name.charAt(0).toUpperCase()}
            </span>
          )}
          
          {/* Shine Sweep Effect */}
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '100%', opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 z-20"
          />
        </div>

        {user.isCurrentUser && (
          <Badge className="absolute -bottom-3 bg-primary text-surface border-none font-orbitron text-[9px] uppercase tracking-widest px-3 py-1 shadow-[0_0_15px_rgba(var(--color-primary),0.6)] z-20">You</Badge>
        )}
      </div>

      {/* The Pedestal Base */}
      <div className={`w-full ${heightClass} ${colorClass} backdrop-blur-lg rounded-t-3xl border-t border-l border-r flex flex-col items-center justify-start p-5 relative overflow-hidden group-hover:brightness-110 transition-all duration-300 shadow-[0_-5px_25px_rgba(currentColor,0.15)]`}>
        {/* Animated Top Glow */}
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-0 left-0 w-full h-1.5 ${glowClass} shadow-[0_0_25px_currentColor]`} 
        />
        
        {/* Moving Gradient Background */}
        <div className={`absolute inset-0 ${glowClass} opacity-[0.08] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent`} />
        
        <h3 className="font-display font-bold text-text-main text-center text-sm sm:text-lg line-clamp-1 mb-1 relative z-10 pt-2 leading-none drop-shadow-md">
          {user.display_name.split(' ')[0]}
        </h3>
        <p className="text-[10px] font-orbitron text-text-muted/80 tracking-widest uppercase mb-4 relative z-10 font-medium">Lvl {user.rank_level}</p>
        
        <div className="mt-auto relative z-10 flex flex-col items-center">
          <span className={`font-orbitron font-bold text-2xl sm:text-4xl ${iconColor} leading-none pt-1 drop-shadow-[0_0_10px_rgba(currentColor,0.3)]`}>
            {user.display_xp.toLocaleString()}
          </span>
          <span className="text-[10px] sm:text-xs font-orbitron text-text-muted/70 tracking-widest uppercase mt-1 font-bold">XP</span>
        </div>
      </div>
    </motion.div>
  );
}