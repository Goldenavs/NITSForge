// src/pages/QuizSession.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { QuizHeader } from '../components/quiz/QuizHeader';
import { QuestionCard } from '../components/quiz/QuestionCard';
import { ForgeFAB } from '../components/forge/ForgeFAB';
import { QuizSidebar } from '../components/quiz/QuizSidebar';
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
    mode,
    lives,
    aiAllowed,
    abandonQuiz,
    selectedAnswers,
    previousQuestion
  } = useQuizStore();

  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode') || 'practice';

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const hasInitialized = useRef(status !== 'idle');
  const submitButtonRef = useRef<HTMLDivElement>(null);

  // Snap to top when resuming or starting a quiz
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-scroll to Submit button when an option is selected
  useEffect(() => {
    if (selectedOption && !isSubmitted) {
      setTimeout(() => {
        submitButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end', });
      }, 100);
    }
  }, [selectedOption, isSubmitted]);

  // Synchronize local UI state with the global store when navigating questions
  useEffect(() => {
    if (questions.length === 0) return;
    const currentQId = questions[currentIndex]?.id;
    if (!currentQId) return;

    const storedAnswer = selectedAnswers[currentQId];
    if (storedAnswer) {
      setSelectedOption(storedAnswer);
      if (mode !== 'simulation') setIsSubmitted(true);
      else setIsSubmitted(false); // In simulation, everything is a draft until Finish Exam
    } else {
      setSelectedOption(null);
      setIsSubmitted(false);
    }
  }, [currentIndex, questions, selectedAnswers, mode]);

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

  // Dynamic Loading Messages
  const loadingMessages = [
    "Initializing Neural Link...",
    "Synthesizing Scenarios...",
    "Calibrating Difficulty...",
    "Retrieving Context...",
    "Compiling Sandbox..."
  ];
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === 'loading' && mode === 'ai-generated') {
      interval = setInterval(() => {
        setLoadingMsgIdx(prev => (prev + 1) % loadingMessages.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [status, mode]);

  // Safeguard while loading
  if (status === 'loading' || status === 'idle') {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center pt-8 pb-24 px-4 text-center">
        {mode === 'ai-generated' && <Sparkles className="w-12 h-12 text-primary animate-pulse mb-6" />}
        <p className={`text-xl text-primary font-orbitron tracking-widest animate-pulse ${mode === 'ai-generated' ? 'mb-2' : ''}`}>
          {mode === 'ai-generated' ? loadingMessages[loadingMsgIdx] : "Initializing Neural Link..."}
        </p>
        {mode === 'ai-generated' && (
          <p className="text-text-muted text-sm max-w-sm mb-8">
            This usually takes 10-15 seconds depending on server load.
          </p>
        )}
        <Button
          variant="outline"
          onClick={() => {
            abandonQuiz();
            navigate('/quiz');
          }}
          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
        >
          Cancel Initialization
        </Button>
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

  const isGameOver = mode === 'survival' && lives === 0;

  return (
    <div className="relative min-h-screen w-full flex flex-col lg:flex-row">
      <QuizSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col pt-8 pb-24 px-4 md:px-8 max-w-4xl mx-auto transition-all duration-500">
        {/* Dynamic Header */}
        <QuizHeader
          currentQuestion={currentIndex + 1}
          totalQuestions={questions.length}
          modeLabel={mode === 'simulation' ? "Exam Simulation" : mode === 'quick' ? "Quick Quiz" : mode === 'missed' ? "Missed Questions" : mode === 'daily-challenge' ? "Daily Challenge" : mode === 'zen' ? "Zen Mode" : mode === 'sandbox' ? "Sandbox Mode" : mode === 'survival' ? "Survival Mode" : "Practice Mode"}
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
              onSelect={(opt) => {
                if (!isSubmitted) {
                  setSelectedOption(opt);
                  if (mode === 'simulation') {
                    answerQuestion(currentQ.id, opt as 'A' | 'B' | 'C' | 'D');
                  }
                }
              }}
              isSubmitted={isSubmitted}
              hideExplanation={mode === 'simulation'} // Simulation mode hides explanations
              aiAllowed={aiAllowed ?? true} // Pass to hide Forge Explain button
            />

            {/* Bottom Action Bar */}
            <div className="mt-8 flex justify-between items-center w-full">
              <div className="flex-1">
                {currentIndex > 0 && mode !== 'survival' && (
                  <Button
                    variant="outline"
                    onClick={() => { previousQuestion(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="border-borderline/50 text-text-muted hover:bg-surface/50"
                  >
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex-none">
                {(!isSubmitted && mode !== 'simulation') ? (
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
                    variant={isGameOver ? "outline" : "primary"}
                    onClick={handleNext}
                    className={`font-orbitron tracking-widest px-8 py-3 transition-colors ${isGameOver ? 'border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white' : ''
                      }`}
                  >
                    {isGameOver ? 'Exit Arena' : currentIndex === questions.length - 1 ? 'Finish Exam' : 'Next Question'} <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>

            {/* Invisible Spacer for Auto-scroll Margin */}
            <div ref={submitButtonRef} className="h-6 sm:h-10" />
          </motion.div>
        </AnimatePresence>
      </div>

      {(mode !== 'simulation' && aiAllowed !== false) && <ForgeFAB context={currentQ} />}
    </div>
  );
}