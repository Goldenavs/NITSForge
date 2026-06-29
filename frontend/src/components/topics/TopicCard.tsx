// src/components/topics/TopicCard.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Crosshair } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface TopicCardProps {
  id: string;
  title: string;
  mastery: number; 
  questionCount: number;
  icon: any;
  colorClass: string;
}

export function TopicCard({ id, title, mastery, questionCount, icon: Icon, colorClass }: TopicCardProps) {
  const statusColor = mastery >= 85 ? 'text-green-500' : mastery >= 50 ? 'text-amber-500' : 'text-red-500';
  const barColor = mastery >= 85 ? 'bg-green-500' : mastery >= 50 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <Card className="group relative h-full overflow-hidden bg-surface/85 backdrop-blur-md border border-borderline/60 hover:border-primary/40 transition-all duration-300 shadow-sm flex flex-col">
      <CardContent className="p-6 pt-7 flex flex-col flex-1">
        
        {/* Header: Icon & Mastery Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl border ${colorClass} bg-surface-2/60 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shrink-0 mt-0.5`}>
            <Icon className="w-5 h-5" strokeWidth={2} />
          </div>
          
          {/* FIX: leading-none and pt-1 to center the Orbitron text inside the badge */}
          <Badge className={`bg-surface-2/80 font-orbitron text-[10px] tracking-widest uppercase border border-borderline/50 ${statusColor} leading-none pt-1.5 pb-1`}>
            {mastery}% Mastery
          </Badge>
        </div>

        {/* Text Content */}
        {/* FIX: leading-none and pt-1 for Montserrat display font */}
        <h3 className="text-lg font-display font-bold text-text-main leading-none pt-1 mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-xs text-text-muted font-body mb-6 flex items-center">
          {/* FIX: specific top padding for Orbitron number */}
          <strong className="font-orbitron leading-none pt-0.5 mr-1">{questionCount}</strong> questions answered
        </p>

        {/* Bottom Section: Progress Bar & Hover Actions */}
        <div className="mt-auto relative">
          
          <div className="group-hover:opacity-0 transition-opacity duration-300 absolute inset-0 flex flex-col justify-end pb-1 pointer-events-none">
            <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${mastery}%` }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.2 }}
                className={`h-full ${barColor} rounded-full`}
              />
            </div>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 translate-y-2 group-hover:translate-y-0 relative z-10">
            <Link to={`/quiz/setup?mode=drill&topic=${id}`} className="flex-1">
              {/* FIX: pt-2.5 pb-2 to perfectly center Orbitron text in buttons */}
              <button className="w-full flex items-center justify-center gap-2 pt-2.5 pb-2 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-surface transition-colors font-orbitron text-[10px] uppercase tracking-widest font-bold leading-none">
                <Crosshair className="w-3 h-3 -mt-0.5" /> Drill
              </button>
            </Link>
            <Link to={`/learning/${id}`} className="shrink-0">
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