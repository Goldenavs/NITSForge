import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '../../store/useQuizStore';
import { Map, ChevronRight, ChevronLeft, CheckCircle, XCircle, CircleDashed } from 'lucide-react';

export function QuizSidebar() {
  const { questions, currentIndex, selectedAnswers, mode, jumpToQuestion } = useQuizStore();
  const [isCollapsed, setIsCollapsed] = useState(true);

  if (questions.length === 0) return null;

  const isInfinite = mode === 'zen' || mode === 'survival';
  let maxVisible = questions.length;

  if (isInfinite) {
    let highestAnswered = -1;
    questions.forEach((q, idx) => {
      if (selectedAnswers[q.id]) {
        highestAnswered = Math.max(highestAnswered, idx);
      }
    });
    maxVisible = Math.max(currentIndex, highestAnswered) + 1;
    maxVisible = Math.min(maxVisible, questions.length);
  }

  const visibleQuestions = questions.slice(0, maxVisible);

  const getStatusColor = (questionId: string, index: number, isCorrectOption: string) => {
    const isCurrent = index === currentIndex;
    const answer = selectedAnswers[questionId];

    if (mode === 'simulation') {
      if (isCurrent) return 'border-primary ring-2 ring-primary/50 bg-primary/20 text-primary scale-110 shadow-[0_0_15px_rgba(var(--color-primary),0.3)]';
      if (answer) return 'bg-accent/20 border-accent/40 text-accent';
      return 'bg-surface-2/40 border-borderline/50 text-text-muted hover:bg-surface-2/80 hover:border-primary/40';
    } else {
      if (isCurrent) return 'border-primary ring-2 ring-primary/50 bg-primary/20 text-primary scale-110 shadow-[0_0_15px_rgba(var(--color-primary),0.3)]';
      if (!answer) return 'bg-surface-2/40 border-borderline/50 text-text-muted hover:bg-surface-2/80 hover:border-primary/40';
      if (answer === isCorrectOption) return 'bg-green-500/20 border-green-500/40 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]';
      return 'bg-red-500/20 border-red-500/40 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
    }
  };

  const getStatusIcon = (questionId: string, isCorrectOption: string) => {
    const answer = selectedAnswers[questionId];
    if (mode === 'simulation') {
      if (answer) return <CheckCircle className="w-3 h-3" />;
      return <CircleDashed className="w-3 h-3" />;
    } else {
      if (!answer) return <CircleDashed className="w-3 h-3" />;
      if (answer === isCorrectOption) return <CheckCircle className="w-3 h-3" />;
      return <XCircle className="w-3 h-3" />;
    }
  };

  // Fixed positioned Drawer Wrapper
  return (
    <>
      {/* Overlay for mobile when open */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCollapsed(true)}
            className="fixed inset-0 bg-background/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={`fixed top-0 left-0 h-screen bg-surface/80 backdrop-blur-3xl border-r border-borderline/60 z-50 shadow-[20px_0_40px_rgba(0,0,0,0.1)] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isCollapsed ? '-translate-x-full lg:-translate-x-[calc(100%-1rem)]' : 'translate-x-0'} w-full sm:w-[380px] flex flex-col`}>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute top-24 -right-5 w-10 h-10 bg-surface border border-borderline/80 rounded-full flex items-center justify-center text-text-muted hover:text-primary hover:scale-110 hover:shadow-[0_0_15px_rgba(var(--color-primary),0.3)] transition-all z-50 cursor-pointer ${isCollapsed ? 'translate-x-full lg:translate-x-0' : ''}`}
          aria-label={isCollapsed ? "Expand Navigation Map" : "Collapse Navigation Map"}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5 ml-0.5" /> : <ChevronLeft className="w-5 h-5 mr-0.5" />}
        </button>

        {/* Content Wrapper */}
        <div className={`w-full h-full p-6 sm:p-8 flex flex-col transition-opacity duration-300 ${isCollapsed ? 'opacity-0 lg:invisible' : 'opacity-100 visible'}`}>

          {/* Header */}
          <div className="mb-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Map className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-text-main leading-tight">Navigation Grid</h3>
              <p className="text-xs text-text-muted mt-0.5">
                {mode === 'simulation'
                  ? 'Draft answers freely.'
                  : 'Review past items.'}
              </p>
            </div>
          </div>

          {/* Grid Area */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {visibleQuestions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => {
                    jumpToQuestion(idx);
                    if (window.innerWidth < 1024) setIsCollapsed(true); // Close on mobile
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`
                    group relative aspect-square rounded-xl flex flex-col items-center justify-center font-orbitron transition-all duration-300 border
                    ${getStatusColor(q.id, idx, q.correct_answer)}
                  `}
                >
                  <span className="text-sm sm:text-base font-bold mb-1">{idx + 1}</span>
                  <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                    {getStatusIcon(q.id, q.correct_answer)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Legend Box */}
          <div className="mt-6 pt-6 border-t border-borderline/50">
            <div className="bg-surface-2/40 rounded-xl p-4 border border-borderline/30 grid grid-cols-2 gap-y-3 gap-x-2 text-[10px] text-text-muted font-orbitron tracking-wider">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--color-primary),0.5)]" /> Current
              </div>
              {mode === 'simulation' ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_8px_rgba(var(--color-accent),0.4)]" /> Drafted
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-surface-2 border border-borderline" /> Unanswered
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" /> Correct
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" /> Incorrect
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
