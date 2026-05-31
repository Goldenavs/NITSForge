// src/pages/QuizSession.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { QuizHeader } from '../components/quiz/QuizHeader';
import { QuestionCard } from '../components/quiz/QuestionCard';
import { ForgeFAB } from '../components/forge/ForgeFAB';
import { useNavigate } from 'react-router-dom';

// Mock Data representing a PhilNITS FE Syllabus Question
const mockQuestion = {
  id: 'FE-NET-042',
  category: 'Networking & Communication',
  text: 'In IPv4 addressing, which of the following perfectly describes the primary function of a Subnet Mask?',
  options: {
    A: 'It converts private IP addresses into globally routable public addresses.',
    B: 'It separates the IP address into a network portion and a host portion.',
    C: 'It resolves a human-readable domain name into an IP address.',
    D: 'It dynamically assigns IP addresses to newly connected client devices.'
  }
};

export default function QuizSession() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedOption) return;
    setIsSubmitted(true);
  };

  const handleNext = () => {
    // Reset state for next question (mocked)
    navigate('/quiz/results/mock-session-123');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col pt-8 pb-24 px-4 md:px-8 max-w-4xl mx-auto">
      
      <QuizHeader currentQuestion={4} totalQuestions={80} mode="Practice Mode" />

      <AnimatePresence mode="wait">
        <motion.div
          key="q4" // In production, this would be the actual question ID
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full"
        >
          <QuestionCard 
            question={mockQuestion}
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
                Next Question <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <ForgeFAB />
    </div>
  );
}