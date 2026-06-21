// src/components/history/HistoryRow.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronDown, Sparkles, Loader2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

import type { AnswerHistoryRecord } from '../../hooks/useHistory';
import { explainQuestion } from '../../services/ai';
import ReactMarkdown from 'react-markdown';

interface HistoryRowProps {
  log: AnswerHistoryRecord;
}

export function HistoryRow({ log }: HistoryRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // AI State
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleExplain = async () => {
    if (aiExplanation) return; // already loaded
    setIsAiLoading(true);
    setAiError(null);
    try {
      const result = await explainQuestion({
        questionText: log.question_text,
        options: log.question_options,
        correctAnswer: log.correct_answer,
        userAnswer: log.user_answer
      });
      setAiExplanation(result);
    } catch (err: any) {
      setAiError(err.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Helper for option styling
  const getOptionStyle = (key: string) => {
    if (key === log.correct_answer) return 'bg-green-500/10 border-green-500/40 text-green-600 dark:text-green-400';
    if (key === log.user_answer && !log.is_correct) return 'bg-red-500/10 border-red-500/40 text-red-600 dark:text-red-400';
    return 'bg-surface-2/40 border-borderline/30 text-text-muted';
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 ${isOpen ? 'border-primary/40 shadow-md' : 'border-borderline/60 hover:border-text-muted/40'}`}>
      
      {/* ALWAYS VISIBLE: Collapsed Header Row */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer group bg-surface/60 backdrop-blur-sm hover:bg-surface"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="shrink-0 mt-0.5">
            {log.is_correct ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-1.5">
              <span className="text-[10px] font-orbitron font-bold text-text-muted tracking-widest uppercase leading-snug pt-0.5">
                {log.question_category}
              </span>
              <span className="text-[10px] text-text-muted/60 font-body hidden sm:inline-block shrink-0 whitespace-nowrap pt-0.5">• {new Date(log.answered_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
            </div>
            {/* Truncated question text - Hides when expanded */}
            {!isOpen && (
              <div className="font-body text-sm sm:text-base leading-snug line-clamp-1 transition-colors text-text-muted group-hover:text-text-main prose prose-invert max-w-none prose-p:m-0 prose-headings:m-0 prose-pre:m-0 prose-pre:p-0 prose-pre:bg-transparent">
                <ReactMarkdown 
                  components={{ p: 'span', pre: 'span', code: 'span', h1: 'span', h2: 'span', h3: 'span' }}
                >
                  {log.question_text}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
          <Badge className="bg-surface-2 text-text-muted border-borderline/50 font-orbitron text-[9px] uppercase tracking-widest leading-none pt-1 pb-0.5">
            {log.session_mode.replace('-', ' ')}
          </Badge>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="w-5 h-5 text-text-muted group-hover:text-text-main transition-colors" />
          </motion.div>
        </div>
      </div>

      {/* EXPANDABLE DETAIL VIEW */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
            className="overflow-hidden bg-surface"
          >
            <div className="p-4 sm:p-6 border-t border-borderline/50">
              
              {/* Question */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div className="text-text-main font-body leading-relaxed flex-1 prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-surface-2 prose-pre:border prose-pre:border-borderline prose-code:text-primary">
                  <ReactMarkdown>{log.question_text}</ReactMarkdown>
                </div>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {Object.entries(log.question_options || {}).map(([key, value]) => (
                  <div key={key} className={`flex items-center p-3 rounded-xl border ${getOptionStyle(key)}`}>
                    <div className={`w-6 h-6 rounded flex items-center justify-center font-orbitron font-bold text-xs shrink-0 mr-3 leading-none pt-0.5
                      ${key === log.correct_answer ? 'bg-green-500 text-surface' : key === log.user_answer && !log.is_correct ? 'bg-red-500 text-surface' : 'bg-surface-2 text-text-muted'}`}
                    >
                      {key}
                    </div>
                    <span className="font-body text-sm flex-1">{value as string}</span>
                  </div>
                ))}
              </div>

              {/* Explanation & AI Actions */}
              <div className="flex flex-col gap-4 p-4 rounded-xl bg-surface-2/40 border border-borderline/50">
                <div>
                  <span className="text-[10px] font-orbitron text-text-main uppercase tracking-widest font-bold mb-2 block leading-none pt-0.5">Official Explanation</span>
                  <div className="text-xs sm:text-sm text-text-muted font-body leading-relaxed prose prose-invert max-w-none">
                    <ReactMarkdown>{log.explanation}</ReactMarkdown>
                  </div>
                </div>
                <div className="pt-3 border-t border-borderline/50 flex justify-end">
                  <Button 
                    onClick={handleExplain}
                    disabled={isAiLoading}
                    variant="outline" size="sm" className="w-full sm:w-auto font-orbitron text-[10px] tracking-widest border-accent/40 text-accent hover:bg-accent/10 leading-none pt-2.5 pb-2">
                    {isAiLoading ? <Loader2 className="w-3 h-3 mr-2 animate-spin -mt-0.5" /> : <Sparkles className="w-3 h-3 mr-2 -mt-0.5" />}
                    {isAiLoading ? 'Analyzing...' : 'Explain This'}
                  </Button>
                </div>
              </div>

              {/* AI Explanation Inline Expansion */}
              <AnimatePresence>
                {(aiExplanation || isAiLoading || aiError) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 sm:p-5 rounded-xl bg-accent/5 border border-accent/20 relative">
                      <div className="absolute top-0 left-0 w-1 h-full bg-accent rounded-l-xl opacity-50"></div>
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <span className="text-xs font-orbitron font-bold text-accent tracking-widest uppercase leading-none pt-0.5">Forge AI Analysis</span>
                      </div>
                      
                      {isAiLoading && (
                        <div className="flex flex-col gap-2 animate-pulse">
                          <div className="h-3 bg-surface-2/60 rounded w-3/4"></div>
                          <div className="h-3 bg-surface-2/60 rounded w-full"></div>
                          <div className="h-3 bg-surface-2/60 rounded w-5/6"></div>
                        </div>
                      )}

                      {aiError && (
                        <div className="text-red-400 text-sm font-body">
                          {aiError}
                        </div>
                      )}

                      {aiExplanation && !isAiLoading && (
                        <div className="text-sm text-text-main font-body leading-relaxed prose prose-invert max-w-none">
                          <ReactMarkdown>{aiExplanation}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </Card>
  );
}