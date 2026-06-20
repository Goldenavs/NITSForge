// src/components/quiz/QuizHeader.tsx
import { motion } from 'framer-motion';
import { X, Clock, Heart } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useQuizStore } from '../../store/useQuizStore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface QuizHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  modeLabel: string;
}

export function QuizHeader({ currentQuestion, totalQuestions, modeLabel }: QuizHeaderProps) {
  const { timeRemaining, abandonQuiz, mode, lives } = useQuizStore();
  const progressPercentage = (currentQuestion / totalQuestions) * 100;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

  const handleAbandon = () => {
    abandonQuiz();
    navigate('/quiz');
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex flex-col gap-4 mb-8">
      <div className="flex items-center justify-between">

        {/* Mode & Progress Indicator */}
        <div className="flex items-center gap-3">
          <Badge className="bg-surface-2/80 text-text-muted border-borderline font-orbitron uppercase tracking-widest text-[10px]">
            {modeLabel}
          </Badge>
          <div className="flex items-baseline gap-1 font-orbitron">
            <span className="text-2xl font-bold text-text-main leading-none">{currentQuestion}</span>
            {mode !== 'zen' && mode !== 'survival' && (
              <span className="text-sm font-bold text-text-muted leading-none">/ {totalQuestions}</span>
            )}
          </div>
        </div>

        {/* Right Controls: Timer, Lives, & Exit */}
        <div className="flex items-center gap-4">
          {mode === 'survival' && lives !== null && (
            <div className="flex items-center gap-1.5 bg-surface-2/80 px-3 py-1.5 rounded-lg border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
              {[1, 2, 3].map(i => (
                <Heart 
                  key={i} 
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${i <= lives ? 'fill-red-500 text-red-500 animate-pulse' : 'text-surface-2 fill-background/50'}`} 
                />
              ))}
            </div>
          )}
          {timeRemaining !== null && (
            <div className="flex items-center gap-2 text-text-main bg-surface-2/80 px-3 py-1.5 rounded-lg border border-primary/50 shadow-[0_0_10px_rgba(var(--color-primary),0.2)]">
              <Clock className={`w-4 h-4 ${timeRemaining < 300 ? 'text-red-500 animate-pulse' : 'text-primary'}`} />
              <span className={`font-orbitron text-xs md:text-sm font-bold tracking-wider ${timeRemaining < 300 ? 'text-red-500' : ''}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
          <button
            onClick={() => (mode === 'zen' || mode === 'practice' || mode === 'sandbox') ? handleAbandon() : setShowConfirmModal(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-2/60 backdrop-blur-sm border border-borderline text-text-muted hover:text-red-500 hover:border-red-500/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Animated Progress Bar (Hidden in Zen/Survival Mode) */}
      {mode !== 'zen' && mode !== 'survival' && (
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
      )}

      {/* Confirm Abandon Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-borderline p-6 rounded-xl shadow-2xl max-w-sm w-full"
          >
            <h3 className="text-xl font-bold text-text-main font-display mb-2">Abandon Quiz?</h3>
            <p className="text-sm text-text-muted mb-6 leading-relaxed">
              Are you sure you want to exit? Your progress will <strong className="text-red-500">not be saved</strong> and no XP or accuracy stats will be recorded.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
              <Button variant="primary" className="bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500 hover:text-white" onClick={handleAbandon}>
                End Session
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}