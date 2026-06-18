// src/pages/QuizSession.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { QuizHeader } from '../components/quiz/QuizHeader';
import { QuestionCard } from '../components/quiz/QuestionCard';
import { ForgeFAB } from '../components/forge/ForgeFAB';
import { useQuizStore } from '../store/useQuizStore';

export default function QuizSession() {
  const navigate = useNavigate();
  
  // Pull in our state machine
  const { 
    status, 
    questions, 
    currentIndex, 
    startQuiz, 
    answerQuestion, 
    nextQuestion,
    tick,
    mode
  } = useQuizStore();

  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode') || 'practice';

  // Local state for the current question's UI flow
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const hasInitialized = useRef(status !== 'idle');

  // Auto-start or redirect
  useEffect(() => {
    if (status === 'idle' && !hasInitialized.current) {
      hasInitialized.current = true;
      startQuiz(modeParam);
    } else if (status === 'finished') {
      navigate('/quiz/results/mock-session-123'); 
    }
  }, [status, startQuiz, navigate, modeParam]);

  // Timer Tick Interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === 'in-progress') {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, tick]);

  // Safeguard while loading
  if (status === 'loading' || status === 'idle') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center pt-8 pb-24 px-4">
        <p className="text-xl text-primary font-orbitron tracking-widest animate-pulse">Initializing Neural Link...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center pt-8 pb-24 px-4 text-center">
        <h2 className="text-2xl text-red-500 font-display font-bold mb-4">No Questions Found</h2>
        <p className="text-text-muted mb-8 max-w-md">The selected mode or topic configuration yielded no questions. Please try different settings or check your database.</p>
        <Button variant="primary" onClick={() => navigate('/quiz/hub')}>Return to Hub</Button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  const handleSubmit = () => {
    if (!selectedOption) return;
    setIsSubmitted(true);
    answerQuestion(currentQ.id, selectedOption as 'A' | 'B' | 'C' | 'D');
  };

  const handleNext = () => {
    // Reset local UI state for the next question
    setIsSubmitted(false);
    setSelectedOption(null);
    nextQuestion(); // Move the Zustand store forward
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col pt-8 pb-24 px-4 md:px-8 max-w-4xl mx-auto">
      
      {/* Dynamic Header */}
      <QuizHeader 
        currentQuestion={currentIndex + 1} 
        totalQuestions={questions.length} 
        mode={mode === 'simulation' ? "Exam Simulation" : mode === 'quick' ? "Quick Quiz" : mode === 'missed' ? "Missed Questions" : mode === 'daily-challenge' ? "Daily Challenge" : mode === 'zen' ? "Zen Mode" : "Practice Mode"} 
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ.id} // Animate when question ID changes
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full"
        >
          <QuestionCard 
            question={currentQ}
            selectedOption={selectedOption}
            onSelect={(opt) => !isSubmitted && setSelectedOption(opt)}
            isSubmitted={isSubmitted}
            hideExplanation={mode === 'simulation'} // Simulation mode hides explanations
          />

          {/* Bottom Action Bar */}
          <div className="mt-8 flex justify-end">
            {!isSubmitted ? (
              <Button 
                variant="primary" 
                disabled={!selectedOption}
                onClick={handleSubmit}
                className="font-orbitron tracking-widest px-8 py-3"
              >
                Submit Answer
              </Button>
            ) : (
              <Button 
                variant="primary" 
                onClick={handleNext}
                className="font-orbitron tracking-widest px-8 py-3"
              >
                {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'} <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {mode !== 'simulation' && <ForgeFAB context={currentQ} />}
    </div>
  );
}