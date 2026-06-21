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
      <div className="relative mb-4 flex flex-col items-center group">
        <div className={`absolute -top-6 ${isFirst ? 'scale-125 -top-8' : ''}`}>
          <Icon className={`w-6 h-6 ${iconColor} drop-shadow-[0_0_10px_rgba(currentColor,0.5)]`} />
        </div>
        <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 ${colorClass} flex items-center justify-center bg-surface backdrop-blur-md shadow-lg overflow-hidden`}>
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.display_name} className="w-full h-full object-cover" />
          ) : (
            <span className={`font-display font-bold text-xl sm:text-3xl ${iconColor} leading-none pt-1`}>
              {user.display_name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        {user.isCurrentUser && (
          <Badge className="absolute -bottom-2 bg-primary text-surface border-none font-orbitron text-[8px] uppercase tracking-widest px-2 py-0.5 shadow-md">You</Badge>
        )}
      </div>

      {/* The Pedestal Base */}
      <div className={`w-full ${heightClass} ${colorClass} backdrop-blur-md rounded-t-2xl border flex flex-col items-center justify-start p-4 relative overflow-hidden`}>
        <div className={`absolute top-0 left-0 w-full h-1 ${glowClass} shadow-[0_0_20px_currentColor]`} />
        <div className={`absolute inset-0 ${glowClass} opacity-[0.03] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white to-transparent`} />
        
        <h3 className="font-display font-bold text-text-main text-center text-sm sm:text-base line-clamp-1 mb-1 relative z-10 pt-1 leading-none">
          {user.display_name.split(' ')[0]}
        </h3>
        <p className="text-[10px] font-orbitron text-text-muted tracking-widest uppercase mb-4 relative z-10">Lvl {user.rank_level}</p>
        
        <div className="mt-auto relative z-10 flex flex-col items-center">
          <span className={`font-orbitron font-bold text-xl sm:text-2xl ${iconColor} leading-none pt-1`}>
            {user.display_xp.toLocaleString()}
          </span>
          <span className="text-[9px] font-orbitron text-text-muted tracking-widest uppercase">XP</span>
        </div>
      </div>
    </motion.div>
  );
}