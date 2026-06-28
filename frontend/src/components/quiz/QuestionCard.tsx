// src/components/quiz/QuestionCard.tsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Sparkles, CheckCircle2, XCircle, Calendar, Loader2, Tag } from 'lucide-react';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { supabase } from '../../services/supabase';

const TAG_COLORS = [
  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'bg-pink-500/10 text-pink-400 border-pink-500/20',
  'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'bg-rose-500/10 text-rose-400 border-rose-500/20',
  'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  'bg-teal-500/10 text-teal-400 border-teal-500/20'
];

const getTagStyle = (tag: string) => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
};

interface QuestionCardProps {
  question: {
    text: string;
    options: { A: string; B: string; C: string; D: string };
    category: string;
    correct_answer: string;
    explanation: string;
    difficulty?: string;
    exam_period?: string;
    source?: string;
    tags?: string[];
  };
  selectedOption: string | null;
  onSelect: (option: string) => void;
  isSubmitted: boolean;
  hideExplanation?: boolean;
  aiAllowed?: boolean;
}

export function QuestionCard({ question, selectedOption, onSelect, isSubmitted, hideExplanation = false, aiAllowed = true }: QuestionCardProps) {
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  const explanationRef = useRef<HTMLDivElement>(null);
  const aiExplanationRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to standard explanation on submit
  useEffect(() => {
    if (isSubmitted && !hideExplanation && question.explanation) {
      setTimeout(() => {
        explanationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }, [isSubmitted, hideExplanation, question.explanation]);

  // Auto-scroll to AI explanation when it finishes loading
  useEffect(() => {
    if (aiExplanation && !isAiLoading && isExplanationOpen) {
      setTimeout(() => {
        aiExplanationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }, [aiExplanation, isAiLoading, isExplanationOpen]);

  const handleExplainThis = async () => {
    setIsExplanationOpen(true);
    if (aiExplanation || isAiLoading) return;

    setIsAiLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      // Construct dynamic API URL (handle dev vs prod proxy)
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/ai/explain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          questionText: question.text,
          options: question.options,
          correctAnswer: question.correct_answer,
          userAnswer: selectedOption
        })
      });

      if (!response.ok) {
        if (response.status === 503 || response.status === 500) {
          throw new Error('503 Service Unavailable');
        }
        throw new Error('Failed to fetch explanation');
      }
      const data = await response.json();
      setAiExplanation(data.explanation);
    } catch (err: any) {
      console.error(err);
      const isUnavailable = err.message?.includes('503') || err.message?.includes('Unavailable');
      setAiExplanation(`⚠️ **Forge AI is currently unreachable${isUnavailable ? ' due to high demand' : ''}.**\n\nPlease try again later, or review the standard answer key above.`);
    } finally {
      setIsAiLoading(false);
    }
  };

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
        <div className="flex flex-col mb-8 gap-3">
          
          {/* Row 1: Category & Difficulty (+ Bookmark) */}
          <div className="flex items-start sm:items-center justify-between w-full">
            <Badge variant="custom" className="bg-primary/10 text-primary border border-primary/20 font-orbitron tracking-widest uppercase text-[10px] sm:text-xs font-bold">
              {question.category || 'Uncategorized'}
            </Badge>
            <div className="flex items-center gap-3">
              <Badge variant="custom" className={`border font-orbitron tracking-widest uppercase text-[10px] sm:text-xs font-bold ${question.difficulty === 'hard' ? 'bg-red-500/10 text-red-500 border-red-500/20' : question.difficulty === 'easy' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                {question.difficulty || 'Medium'}
              </Badge>
              <button className="text-text-muted hover:text-accent transition-colors shrink-0">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Row 2: Date */}
          <div className="flex w-full">
            <Badge variant="custom" className="bg-surface-2/60 text-text-muted border border-borderline font-orbitron tracking-widest uppercase text-[9px] sm:text-[10px] flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {question.exam_period || 'Mock Data'}
            </Badge>
          </div>

          {/* Row 3: Tags */}
          {question.tags && question.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {question.tags.map((tag, idx) => (
                <Badge variant="custom" key={idx} className={`${getTagStyle(tag)} border font-orbitron tracking-widest uppercase text-[9px] sm:text-[10px] flex items-center gap-1`}>
                  <Tag className="w-3 h-3" /> {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Main Question Area */}
        <div className="mb-8 font-medium text-lg md:text-xl text-text-main leading-relaxed">
          <MarkdownRenderer>{question.text}</MarkdownRenderer>
        </div>

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

        {/* Standard Explanation (Automatically Visible after submission) */}
        {isSubmitted && !hideExplanation && question.explanation && (
          <motion.div 
            ref={explanationRef}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-xl bg-surface-2/30 border border-borderline flex flex-col items-start"
          >
            <h3 className="font-orbitron font-bold text-primary mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Official Explanation
            </h3>
            <div className="text-text-main/90 text-sm leading-relaxed">
              <MarkdownRenderer>{question.explanation}</MarkdownRenderer>
            </div>
          </motion.div>
        )}

        {/* AI Explain This Section */}
        {isSubmitted && !hideExplanation && aiAllowed && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-surface-2/50 border border-borderline flex flex-col items-start gap-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-display font-bold text-sm text-text-main leading-none mb-1">Need clarification?</p>
                  <p className="text-xs text-text-muted">Deploy Gemini Flash for a quick, structured breakdown.</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={handleExplainThis}
                disabled={isAiLoading}
                className="w-full sm:w-auto font-orbitron text-[10px] tracking-wider border-accent/30 text-accent hover:bg-accent/10"
              >
                {isAiLoading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
                ) : (
                  'Explain This'
                )}
              </Button>
            </div>

            <AnimatePresence>
              {isExplanationOpen && (
                <motion.div
                  ref={aiExplanationRef}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden w-full"
                >
                  <div className="pt-4 border-t border-borderline/50 mt-2 text-text-main/90 text-sm leading-relaxed">
                    {isAiLoading ? (
                      <div className="flex items-center gap-2 text-primary animate-pulse">
                        <Loader2 className="w-4 h-4 animate-spin" /> Forging explanation...
                      </div>
                    ) : (
                      <MarkdownRenderer>{aiExplanation || "No explanation generated."}</MarkdownRenderer>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

      </CardContent>
    </Card>
  );
}