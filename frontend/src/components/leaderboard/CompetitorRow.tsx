// src/components/leaderboard/CompetitorRow.tsx
import { motion, type Variants } from 'framer-motion';
import { Flame, ArrowUp } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface CompetitorRowProps {
  user: {
    id: number;
    name: string;
    level: number;
    xp: number;
    streak: number;
    rank: number;
    isCurrentUser: boolean;
  };
  fadeUpVariant: Variants;
}

export function CompetitorRow({ user, fadeUpVariant }: CompetitorRowProps) {
  return (
    <motion.div variants={fadeUpVariant}>
      <Card className={`overflow-hidden transition-all duration-300 group ${
        user.isCurrentUser 
          ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(var(--color-primary),0.15)]' 
          : 'bg-surface/60 backdrop-blur-sm border-borderline/60 hover:bg-surface/90 hover:border-text-muted/40'
      }`}>
        <CardContent className="p-3 sm:p-4 flex items-center justify-between">
          
          <div className="flex items-center gap-4 sm:gap-6">
            <div className={`w-8 font-orbitron font-bold text-lg text-center leading-none pt-1 ${user.isCurrentUser ? 'text-primary' : 'text-text-muted'}`}>
              #{user.rank}
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`hidden sm:flex w-10 h-10 rounded-full border items-center justify-center font-display font-bold text-lg leading-none pt-1 ${
                user.isCurrentUser ? 'border-primary text-primary bg-primary/10' : 'border-borderline/80 text-text-main bg-surface-2'
              }`}>
                {user.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-display font-bold text-sm sm:text-base leading-none pt-1 ${user.isCurrentUser ? 'text-primary' : 'text-text-main'}`}>
                    {user.name}
                  </h4>
                  {user.isCurrentUser && (
                    <Badge className="bg-primary/20 text-primary border-none font-orbitron text-[8px] uppercase tracking-widest px-2 py-0.5 ml-1 hidden sm:flex leading-none pt-1">You</Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[10px] font-orbitron text-text-muted tracking-widest uppercase font-bold">
                  <span>Lvl {user.level}</span>
                  {user.streak > 2 && (
                    <span className="flex items-center gap-1 text-orange-500">
                      <Flame className="w-3 h-3 -mt-0.5" /> {user.streak} Streak
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {user.isCurrentUser && (
              <div className="hidden md:flex items-center gap-1 text-green-500 font-orbitron text-[10px] tracking-widest font-bold">
                <ArrowUp className="w-3 h-3" /> +420 XP Today
              </div>
            )}
            <div className="flex flex-col items-end">
              <span className={`font-orbitron font-bold text-base sm:text-lg leading-none pt-1 ${user.isCurrentUser ? 'text-text-main' : 'text-text-muted'}`}>
                {user.xp.toLocaleString()}
              </span>
              <span className="text-[9px] font-orbitron text-text-muted/70 tracking-widest uppercase">XP</span>
            </div>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
}