// src/components/leaderboard/CompetitorRow.tsx
import { motion, type Variants } from 'framer-motion';
import { Flame, ArrowUp } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

import type { LeaderboardEntry } from '../../hooks/useLeaderboard';

interface CompetitorRowProps {
  user: LeaderboardEntry & { rank: number; isCurrentUser: boolean; display_xp: number };
  fadeUpVariant: Variants;
  onClick: () => void;
}

export function CompetitorRow({ user, fadeUpVariant, onClick }: CompetitorRowProps) {
  return (
    <motion.div variants={fadeUpVariant} className="relative group">
      {user.isCurrentUser && (
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30 rounded-2xl blur-sm -z-10"
        />
      )}
      
      <Card
        onClick={onClick}
        className={`cursor-pointer overflow-hidden transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 relative z-10 ${user.isCurrentUser
            ? 'bg-surface/90 backdrop-blur-xl border-primary/50 shadow-[0_0_25px_rgba(var(--color-primary),0.2)]'
            : 'bg-surface/60 backdrop-blur-sm border-borderline/60 hover:bg-surface/95 hover:border-text-muted/60 hover:shadow-xl'
          }`}
      >
        {user.isCurrentUser && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '100%', opacity: [0, 0.2, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 z-0 pointer-events-none"
          />
        )}
        
        <CardContent className="p-3 sm:p-4 flex items-center justify-between relative z-10">

          <div className="flex items-center gap-4 sm:gap-6">
            <div className={`w-8 font-orbitron font-bold text-xl text-center leading-none pt-1 ${user.isCurrentUser ? 'text-primary drop-shadow-[0_0_8px_rgba(var(--color-primary),0.5)]' : 'text-text-muted/80 group-hover:text-text-main transition-colors'}`}>
              #{user.rank}
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`hidden sm:flex w-12 h-12 rounded-full border-2 items-center justify-center font-display font-bold text-xl leading-none pt-1 overflow-hidden transition-all duration-300 ${user.isCurrentUser ? 'border-primary text-primary bg-primary/10 shadow-[0_0_15px_rgba(var(--color-primary),0.4)]' : 'border-borderline/80 text-text-main bg-surface-2 group-hover:border-text-muted/50'
                }`}>
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.display_name} className="w-full h-full object-cover" />
                ) : (
                  user.display_name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-display font-bold text-sm sm:text-lg leading-none pt-1 transition-colors ${user.isCurrentUser ? 'text-primary drop-shadow-[0_0_5px_rgba(var(--color-primary),0.3)]' : 'text-text-main group-hover:text-primary/90'}`}>
                    {user.display_name}
                  </h4>
                  {user.isCurrentUser && (
                    <Badge className="bg-primary text-surface border-none font-orbitron text-[8px] uppercase tracking-widest px-2 py-0.5 ml-1 hidden sm:flex leading-none pt-1 shadow-[0_0_10px_rgba(var(--color-primary),0.5)]">You</Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[10px] sm:text-xs font-orbitron text-text-muted tracking-widest uppercase font-bold">
                  <span className="group-hover:text-text-main transition-colors">Lvl {user.rank_level}</span>
                  {(user.current_streak || 0) > 2 && (
                    <span className="flex items-center gap-1 text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.4)]">
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                        <Flame className="w-3.5 h-3.5 -mt-0.5" />
                      </motion.div>
                      {user.current_streak} Streak
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {user.isCurrentUser && (
              <motion.div 
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="hidden md:flex items-center gap-1 text-green-500 font-orbitron text-[10px] sm:text-xs tracking-widest font-bold bg-green-500/10 px-2 py-1 rounded-full border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]"
              >
                <ArrowUp className="w-3 h-3" /> +420 XP Today
              </motion.div>
            )}
            <div className="flex flex-col items-end">
              <span className={`font-orbitron font-bold text-lg sm:text-2xl leading-none pt-1 transition-colors ${user.isCurrentUser ? 'text-primary drop-shadow-[0_0_8px_rgba(var(--color-primary),0.4)]' : 'text-text-main group-hover:text-primary/90'}`}>
                {user.display_xp.toLocaleString()}
              </span>
              <span className="text-[9px] sm:text-[10px] font-orbitron text-text-muted/70 tracking-widest uppercase font-bold">XP</span>
            </div>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
}