// src/components/topics/TopicCard.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Crosshair, Target } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface TopicCardProps {
  id: string;
  title: string;
  totalDbCount: number;
  attemptedCount: number;
  correctCount: number;
  icon: any;
  colorClass: string;
}

export function TopicCard({ id, title, totalDbCount, attemptedCount, correctCount, icon: Icon, colorClass }: TopicCardProps) {
  const completionPct = totalDbCount > 0 ? Math.round((attemptedCount / totalDbCount) * 100) : 0;
  const accuracyPct = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
  
  const statusColor = accuracyPct >= 85 ? 'text-green-500' : accuracyPct >= 50 ? 'text-amber-500' : 'text-red-500';
  const barColor = accuracyPct >= 85 ? 'bg-green-500' : accuracyPct >= 50 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <Card className="group relative h-full overflow-hidden bg-surface/85 backdrop-blur-md border border-borderline/60 hover:border-primary/40 transition-all duration-300 shadow-sm flex flex-col">
      <CardContent className="p-6 pt-7 flex flex-col flex-1">
        
        {/* Header: Icon & Accuracy Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl border ${colorClass} bg-surface-2/60 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shrink-0 mt-0.5`}>
            <Icon className="w-5 h-5" strokeWidth={2} />
          </div>
          
          <Badge className={`bg-surface-2/80 font-orbitron text-[10px] tracking-widest uppercase border border-borderline/50 ${statusColor} leading-none pt-1.5 pb-1 flex items-center gap-1.5`}>
            <Target className="w-3 h-3 -mt-0.5" />
            {accuracyPct}% Accuracy
          </Badge>
        </div>

        {/* Text Content */}
        <h3 className="text-lg font-display font-bold text-text-main leading-none pt-1 mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <div className="flex flex-col gap-1 mb-5">
          <p className="text-xs text-text-muted font-body flex items-center justify-between">
            <span>Attempted:</span>
            <strong className="font-orbitron leading-none pt-0.5">{attemptedCount} / {totalDbCount}</strong>
          </p>
          <p className="text-xs text-text-muted font-body flex items-center justify-between">
            <span>Mastered:</span>
            <strong className="font-orbitron leading-none pt-0.5 text-primary">{correctCount}</strong>
          </p>
        </div>

        {/* Bottom Section: Progress Bars & Hover Actions */}
        <div className="mt-auto relative">
          
          <div className="group-hover:opacity-0 transition-opacity duration-300 absolute inset-0 flex flex-col justify-end pb-0 pointer-events-none gap-2">
            {/* Completion Bar */}
            <div className="w-full flex items-center gap-2">
              <span className="text-[9px] font-orbitron uppercase text-text-muted w-16 text-right">Completion</span>
              <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${completionPct}%` }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.1 }}
                  className="h-full bg-primary/50 rounded-full"
                />
              </div>
            </div>
            
            {/* Accuracy Bar */}
            <div className="w-full flex items-center gap-2">
              <span className="text-[9px] font-orbitron uppercase text-text-muted w-16 text-right">Accuracy</span>
              <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${accuracyPct}%` }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.3 }}
                  className={`h-full ${barColor} rounded-full`}
                />
              </div>
            </div>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 translate-y-2 group-hover:translate-y-0 relative z-10 pt-2">
            <Link to={`/quiz/setup?mode=drill&topic=${id}`} className="flex-1">
              <button className="w-full flex items-center justify-center gap-2 pt-2.5 pb-2 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-surface transition-colors font-orbitron text-[10px] uppercase tracking-widest font-bold leading-none">
                <Crosshair className="w-3 h-3 -mt-0.5" /> Drill
              </button>
            </Link>
            <Link to={`/topics/${id}`} className="shrink-0">
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-2 text-text-muted border border-borderline hover:border-text-muted hover:text-text-main transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

        </div>

      </CardContent>
      
      <div className={`absolute -right-8 -bottom-8 w-32 h-32 ${colorClass.split(' ')[0]} opacity-[0.02] blur-2xl rounded-full pointer-events-none group-hover:opacity-10 transition-opacity duration-500`} />
    </Card>
  );
}