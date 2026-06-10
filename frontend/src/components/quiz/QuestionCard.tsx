// src/components/quiz/QuestionCard.tsx
import { motion } from 'framer-motion';
import { Bookmark, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

interface QuestionCardProps {
  question: {
    text: string;
    options: { A: string; B: string; C: string; D: string };
    category: string;
    correct_answer: string; // <-- Added this
    explanation: string;    // <-- Added this
  };
  selectedOption: string | null;
  onSelect: (option: string) => void;
  isSubmitted: boolean;
  hideExplanation?: boolean;
}

export function QuestionCard({ question, selectedOption, onSelect, isSubmitted, hideExplanation = false }: QuestionCardProps) {
  // Use the dynamic correct answer from the data
  const correctAnswer = question.correct_answer; 

  const getOptionStyles = (key: string) => {
    if (!isSubmitted) {
      return selectedOption === key 
        ? 'border-primary bg-primary/10 text-primary scale-[1.02]' 
        : 'border-borderline/60 bg-surface-2/40 text-text-main hover:border-primary/40 hover:bg-surface-2/80';
    }

    if (key === correctAnswer) {
      return 'border-green-500 bg-green-500/10 text-green-600 dark:text-green-400 scale-[1.02]';
    }
    if (selectedOption === key && key !== correctAnswer) {
      return 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400';
    }
    return 'border-borderline/30 bg-surface-2/20 text-text-muted opacity-60';
  };

  return (
    <Card className="bg-surface/85 backdrop-blur-md border border-borderline/60 shadow-lg relative overflow-hidden">
      <CardContent className="p-6 md:p-8 flex flex-col">
        
        {/* Top Actions */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-bold font-orbitron tracking-widest text-text-muted uppercase">
            {question.category}
          </span>
          <button className="text-text-muted hover:text-accent transition-colors">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>

        {/* Question Text */}
        <h2 className="text-xl md:text-2xl font-body font-medium text-text-main leading-relaxed mb-8 whitespace-pre-wrap">
          {question.text}
        </h2>

        {/* Options Grid */}
        <div className="flex flex-col gap-3 mb-8">
          {Object.entries(question.options).map(([key, value]) => (
            <button
              key={key}
              disabled={isSubmitted}
              onClick={() => onSelect(key)}
              className={`w-full flex items-center p-4 rounded-xl border-2 transition-all duration-300 text-left ${getOptionStyles(key)}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-orbitron font-bold shrink-0 mr-4 
                ${isSubmitted && key === correctAnswer ? 'bg-green-500/20 text-green-600' : 
                  isSubmitted && selectedOption === key ? 'bg-red-500/20 text-red-600' : 
                  selectedOption === key ? 'bg-primary text-surface' : 'bg-surface-2 text-text-muted'}`}
              >
                {key}
              </div>
              <span className="font-body text-sm md:text-base flex-1">{value}</span>
              
              {/* Result Icons */}
              {isSubmitted && key === correctAnswer && <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 ml-2" />}
              {isSubmitted && selectedOption === key && key !== correctAnswer && <XCircle className="w-6 h-6 text-red-500 shrink-0 ml-2" />}
            </button>
          ))}
        </div>

        {/* Explain This Button (Only visible after submission, unless hidden by mode) */}
        {isSubmitted && !hideExplanation && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-surface-2/50 border border-borderline flex flex-col items-start gap-4"
          >
            {/* Added the actual explanation from the data to display here! */}
            <p className="text-sm text-text-main leading-relaxed border-b border-borderline/50 pb-4 w-full whitespace-pre-wrap">
              {question.explanation}
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-display font-bold text-sm text-text-main leading-none mb-1">Need more clarification?</p>
                  <p className="text-xs text-text-muted">Deploy Gemini Flash for a deeper breakdown.</p>
                </div>
              </div>
              <Button variant="outline" className="w-full sm:w-auto font-orbitron text-[10px] tracking-wider border-accent/30 text-accent hover:bg-accent/10">
                Explain This
              </Button>
            </div>
          </motion.div>
        )}

      </CardContent>
    </Card>
  );
}