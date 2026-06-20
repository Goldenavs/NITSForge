import { useQuizStore } from '../../store/useQuizStore';

export function QuizSidebar() {
  const { questions, currentIndex, selectedAnswers, mode, jumpToQuestion } = useQuizStore();

  if (questions.length === 0) return null;

  // For infinite/sudden-death modes, only show questions up to what they've reached
  const isInfinite = mode === 'zen' || mode === 'survival';
  
  // Calculate max index reached by checking highest answered index, but since we can't skip forward,
  // it's effectively just bounded by the current index + 1 or the amount of answered questions.
  // We'll just find the highest index that has an answer, and show up to max(currentIndex, highestAnsweredIndex) + 1
  let maxVisible = questions.length;
  if (isInfinite) {
    let highestAnswered = -1;
    questions.forEach((q, idx) => {
      if (selectedAnswers[q.id]) {
        highestAnswered = Math.max(highestAnswered, idx);
      }
    });
    maxVisible = Math.max(currentIndex, highestAnswered) + 1;
    // Cap at questions.length just in case
    maxVisible = Math.min(maxVisible, questions.length);
  }

  const visibleQuestions = questions.slice(0, maxVisible);

  const getStatusColor = (questionId: string, index: number, isCorrectOption: string) => {
    const isCurrent = index === currentIndex;
    const answer = selectedAnswers[questionId];

    if (mode === 'simulation') {
      // Simulation mode doesn't reveal correctness until the end
      if (isCurrent) return 'border-primary ring-2 ring-primary/50 bg-primary/20 text-primary';
      if (answer) return 'bg-accent/20 border-accent/40 text-accent'; // Drafted
      return 'bg-surface-2/40 border-borderline/50 text-text-muted hover:bg-surface-2/80 hover:border-primary/40';
    } else {
      // Standard modes
      if (isCurrent) return 'border-primary ring-2 ring-primary/50 bg-primary/20 text-primary';
      if (!answer) return 'bg-surface-2/40 border-borderline/50 text-text-muted hover:bg-surface-2/80 hover:border-primary/40';
      if (answer === isCorrectOption) return 'bg-green-500/20 border-green-500/40 text-green-500';
      return 'bg-red-500/20 border-red-500/40 text-red-500';
    }
  };

  return (
    <div className="w-full h-full bg-surface/80 backdrop-blur-md border border-borderline/60 rounded-2xl shadow-lg p-4 flex flex-col">
      <div className="mb-4">
        <h3 className="font-display font-bold text-lg text-text-main">Navigation Map</h3>
        <p className="text-xs text-text-muted mt-1">
          {mode === 'simulation' 
            ? 'Jump freely. Answers are drafted until final submission.' 
            : 'Select a previous question to review.'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="grid grid-cols-5 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {visibleQuestions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => {
                // In survival mode, prevent jumping backward because it's sudden death?
                // The user said: "in zen mode and survival mode... sidebar should show only the attempted questions".
                // They didn't explicitly forbid jumping back. Let's allow review, but no changes.
                jumpToQuestion(idx);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`
                h-10 rounded-lg flex items-center justify-center font-orbitron text-xs font-bold transition-all duration-300 border
                ${getStatusColor(q.id, idx, q.correct_answer)}
              `}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-borderline/50 grid grid-cols-2 gap-2 text-[10px] text-text-muted font-orbitron tracking-wider">
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /> Current</div>
        {mode === 'simulation' ? (
          <>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-accent" /> Drafted</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-surface-2" /> Unanswered</div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /> Correct</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /> Incorrect</div>
          </>
        )}
      </div>
    </div>
  );
}
