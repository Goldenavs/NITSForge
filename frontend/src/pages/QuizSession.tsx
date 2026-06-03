// src/pages/QuizSession.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    nextQuestion 
  } = useQuizStore();

  // Local state for the current question's UI flow
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Auto-start or redirect
  useEffect(() => {
    if (status === 'idle') {
      startQuiz();
    } else if (status === 'finished') {
      navigate('/quiz/results/mock-session-123'); 
    }
  }, [status, startQuiz, navigate]);

  // Safeguard while loading
  if (status !== 'in-progress' || questions.length === 0) return null;

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
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col pt-8 pb-24 px-4 md:px-8 max-w-4xl mx-auto">
      
      {/* Dynamic Header */}
      <QuizHeader 
        currentQuestion={currentIndex + 1} 
        totalQuestions={questions.length} 
        mode="Practice Mode" 
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

      <ForgeFAB />
    </div>
  );
}