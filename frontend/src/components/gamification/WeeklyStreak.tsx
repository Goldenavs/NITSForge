// src/components/gamification/WeeklyStreak.tsx
import { motion } from 'framer-motion';
import { Flame, Check } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

interface DayStatus {
  day: string;
  status: 'completed' | 'current' | 'upcoming' | 'missed';
}

const mockWeekData: DayStatus[] = [
  { day: 'Mon', status: 'completed' },
  { day: 'Tue', status: 'completed' },
  { day: 'Wed', status: 'completed' },
  { day: 'Thu', status: 'current' },
  { day: 'Fri', status: 'upcoming' },
  { day: 'Sat', status: 'upcoming' },
  { day: 'Sun', status: 'upcoming' },
];

export function WeeklyStreak() {
  return (
    <Card className="bg-surface/85 backdrop-blur-md border border-borderline/60 shadow-sm overflow-hidden relative">
      {/* Ambient Glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-32 bg-orange-500/5 blur-3xl pointer-events-none" />
      
      <CardContent className="p-6 sm:p-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="font-display font-bold text-xl text-text-main flex items-center gap-2 leading-none pt-1">
              Active Streak <Flame className="w-5 h-5 text-orange-500" />
            </h3>
            <p className="text-sm text-text-muted mt-2">Complete today's protocol to extend your chain to 4 days.</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-3xl font-orbitron font-bold text-orange-500 leading-none shadow-orange-500/20 drop-shadow-md">
              12
            </span>
            <span className="text-[10px] font-orbitron uppercase tracking-widest text-text-muted font-bold mt-1">
              Total Days
            </span>
          </div>
        </div>

        {/* The 7-Day Visualizer */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {mockWeekData.map((d, i) => {
            const isCompleted = d.status === 'completed';
            const isCurrent = d.status === 'current';
            
            return (
              <div key={i} className="flex flex-col items-center gap-3 flex-1">
                <div className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                  isCompleted ? 'bg-orange-500/20 border-2 border-orange-500/50' :
                  isCurrent ? 'bg-surface-2 border-2 border-primary border-dashed animate-pulse' :
                  'bg-surface-2/50 border border-borderline/50'
                }`}>
                  {isCompleted && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: i * 0.1 }}
                    >
                      <Check className="w-5 h-5 text-orange-500" strokeWidth={3} />
                    </motion.div>
                  )}
                  {isCurrent && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <span className={`text-[10px] sm:text-xs font-orbitron uppercase tracking-widest font-bold ${
                  isCompleted ? 'text-orange-500' : isCurrent ? 'text-primary' : 'text-text-muted/50'
                }`}>
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}