import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '../../store/useQuizStore';
import { Map, ChevronRight, ChevronLeft, CheckCircle, XCircle, CircleDashed } from 'lucide-react';

export function QuizSidebar() {
  const { questions, currentIndex, selectedAnswers, mode, jumpToQuestion } = useQuizStore();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [highestVisited, setHighestVisited] = useState(0);

  useEffect(() => {
    if (currentIndex > highestVisited) {
      setHighestVisited(currentIndex);
    }
  }, [currentIndex, highestVisited]);

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
    maxVisible = Math.max(highestVisited, currentIndex, highestAnswered) + 1;
    maxVisible = Math.min(maxVisible, questions.length);
  }

  const visibleQuestions = questions.slice(0, maxVisible);

  const getStatusColor = (questionId: string, index: number, isCorrectOption: string) => {
    const isCurrent = index === currentIndex;
    const answer = selectedAnswers[questionId];

    if (mode === 'simulation') {
      if (isCurrent) return 'border-primary ring-2 ring-primary/50 bg-primary/20 text-primary scale-105 shadow-[0_0_15px_rgba(var(--color-primary),0.3)]';
      if (answer) return 'bg-accent/20 border-accent/40 text-accent';
      return 'bg-surface-2/40 border-borderline/50 text-text-muted hover:bg-surface-2/80 hover:border-primary/40 hover:scale-105';
    } else {
      if (isCurrent) return 'border-primary ring-2 ring-primary/50 bg-primary/20 text-primary scale-105 shadow-[0_0_15px_rgba(var(--color-primary),0.3)]';
      if (!answer) return 'bg-surface-2/40 border-borderline/50 text-text-muted hover:bg-surface-2/80 hover:border-primary/40 hover:scale-105';
      if (answer === isCorrectOption) return 'bg-green-500/20 border-green-500/40 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)] hover:scale-105';
      return 'bg-red-500/20 border-red-500/40 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)] hover:scale-105';
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

  return (
    <>
      {/* Mobile Overlay Backdrop */}
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

      {/* Desktop Flex Spacer (Invisible, pushes layout) */}
      <div className={`hidden lg:block shrink-0 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isCollapsed ? 'w-[2vw]' : 'w-[25vw]'}`} />

      {/* Actual Fixed Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 lg:z-[60]
        bg-surface/90 lg:bg-surface/50 backdrop-blur-3xl 
        border-r border-borderline shadow-[20px_0_40px_rgba(0,0,0,0.05)] 
        flex flex-col justify-center 
        transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] 
        ${isCollapsed 
          ? '-translate-x-full lg:translate-x-0 lg:w-[2vw]' 
          : 'w-[85%] sm:w-[380px] lg:w-[25vw]'
        }
      `}>

      {/* Desktop Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 bg-surface border border-borderline rounded-full items-center justify-center text-text-muted hover:text-primary hover:scale-110 hover:shadow-lg transition-all z-50 cursor-pointer"
        aria-label={isCollapsed ? "Expand Navigation Panel" : "Collapse Navigation Panel"}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Mobile Toggle Button (Floating) */}
      <div className="lg:hidden absolute top-4 right-4 z-50">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-10 h-10 rounded-full bg-surface border border-borderline flex items-center justify-center text-text-muted hover:text-primary transition-all shadow-lg ${!isCollapsed ? 'bg-primary/10 border-primary/30 text-primary' : ''}`}
        >
          {isCollapsed ? <Map className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Content Mask */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`w-full h-full py-20 lg:py-12 flex flex-col transition-opacity duration-300 ${isCollapsed ? 'lg:opacity-0 lg:invisible' : 'opacity-100 visible'}`}>
          <div className="w-full lg:w-[25vw] min-w-[320px] px-6 lg:px-8 mx-auto flex flex-col h-full">
            
            {/* Header */}
            <div className="mb-6 flex items-center gap-4 shrink-0">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(var(--color-primary),0.15)]">
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
            <div className="flex-1 overflow-y-auto px-2 py-2 custom-scrollbar">
              <div className="grid grid-cols-5 gap-2">
                {visibleQuestions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      jumpToQuestion(idx);
                      if (window.innerWidth < 1024) setIsCollapsed(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`
                      group relative aspect-square rounded-lg flex flex-col items-center justify-center font-orbitron transition-all duration-300 border
                      ${getStatusColor(q.id, idx, q.correct_answer)}
                    `}
                  >
                    <span className="text-xs font-bold leading-none mb-1">{idx + 1}</span>
                    <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                      {getStatusIcon(q.id, q.correct_answer)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Legend Box */}
            <div className="mt-6 pt-6 border-t border-borderline/50 shrink-0">
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
      </div>
      </div>
    </>
  );
}
