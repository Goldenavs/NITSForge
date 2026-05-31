// src/components/quiz/QuizHeader.tsx
import { motion } from 'framer-motion';
import { X, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge';

interface QuizHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  mode: string;
}

export function QuizHeader({ currentQuestion, totalQuestions, mode }: QuizHeaderProps) {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="w-full flex flex-col gap-4 mb-8">
      <div className="flex items-center justify-between">
        
        {/* Mode & Progress Indicator */}
        <div className="flex items-center gap-3">
          <Badge className="bg-surface-2/80 text-text-muted border-borderline font-orbitron uppercase tracking-widest text-[10px]">
            {mode}
          </Badge>
          <div className="flex items-baseline gap-1 font-orbitron">
            <span className="text-2xl font-bold text-text-main leading-none">{currentQuestion}</span>
            <span className="text-sm font-bold text-text-muted leading-none">/ {totalQuestions}</span>
          </div>
        </div>

        {/* Right Controls: Timer & Exit */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-text-muted bg-surface-2/50 px-3 py-1.5 rounded-lg border border-borderline/50">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-orbitron text-xs font-bold tracking-wider">00:42:15</span>
          </div>
          <Link 
            to="/quiz" 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-2/60 backdrop-blur-sm border border-borderline text-text-muted hover:text-red-500 hover:border-red-500/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Animated Progress Bar */}
      <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden border border-borderline/50">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="h-full bg-primary rounded-full relative"
        >
          {/* Shine effect on progress bar */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shine_2s_infinite]" />
        </motion.div>
      </div>
    </div>
  );
}