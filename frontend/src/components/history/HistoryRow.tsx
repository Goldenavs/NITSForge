// src/components/history/HistoryRow.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronDown, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface HistoryRowProps {
  log: {
    id: string;
    date: string;
    category: string;
    mode: string;
    text: string;
    options: { A: string; B: string; C: string; D: string };
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
    trend: boolean[]; // Array of past results, e.g., [true, false, true]
  };
}

export function HistoryRow({ log }: HistoryRowProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Helper for option styling
  const getOptionStyle = (key: string) => {
    if (key === log.correctAnswer) return 'bg-green-500/10 border-green-500/40 text-green-600 dark:text-green-400';
    if (key === log.userAnswer && !log.isCorrect) return 'bg-red-500/10 border-red-500/40 text-red-600 dark:text-red-400';
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
            {log.isCorrect ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1.5">
              <span className="text-[10px] font-orbitron font-bold text-text-muted tracking-widest uppercase leading-none pt-0.5">
                {log.id}
              </span>
              <span className="text-[10px] text-text-muted/60 font-body hidden sm:inline-block">• {log.date}</span>
            </div>
            {/* Truncated question text */}
            <h4 className={`font-body text-sm sm:text-base leading-snug line-clamp-1 transition-colors ${isOpen ? 'text-text-main' : 'text-text-muted group-hover:text-text-main'}`}>
              {log.text}
            </h4>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
          <Badge className="bg-surface-2 text-text-muted border-borderline/50 font-orbitron text-[9px] uppercase tracking-widest leading-none pt-1 pb-0.5">
            {log.mode}
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
              
              {/* Question & Trend */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <p className="text-text-main font-body leading-relaxed flex-1">
                  {log.text}
                </p>
                <div className="shrink-0 flex flex-col items-start sm:items-end">
                  <span className="text-[9px] font-orbitron text-text-muted uppercase tracking-widest font-bold mb-1.5 leading-none pt-0.5">Historical Trend</span>
                  <div className="flex items-center gap-1">
                    {log.trend.map((isCor, idx) => (
                      <div key={idx} className={`w-3 h-3 rounded-sm ${isCor ? 'bg-green-500' : 'bg-red-500'}`} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {Object.entries(log.options).map(([key, value]) => (
                  <div key={key} className={`flex items-center p-3 rounded-xl border ${getOptionStyle(key)}`}>
                    <div className={`w-6 h-6 rounded flex items-center justify-center font-orbitron font-bold text-xs shrink-0 mr-3 leading-none pt-0.5
                      ${key === log.correctAnswer ? 'bg-green-500 text-surface' : key === log.userAnswer && !log.isCorrect ? 'bg-red-500 text-surface' : 'bg-surface-2 text-text-muted'}`}
                    >
                      {key}
                    </div>
                    <span className="font-body text-sm flex-1">{value}</span>
                  </div>
                ))}
              </div>

              {/* Explanation & AI Actions */}
              <div className="flex flex-col lg:flex-row gap-4 p-4 rounded-xl bg-surface-2/40 border border-borderline/50">
                <div className="flex-1">
                  <span className="text-[10px] font-orbitron text-text-main uppercase tracking-widest font-bold mb-2 block leading-none pt-0.5">Official Explanation</span>
                  <p className="text-xs sm:text-sm text-text-muted font-body leading-relaxed">
                    {log.explanation}
                  </p>
                </div>
                <div className="shrink-0 flex items-center lg:items-end lg:justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-borderline/50 lg:pl-4 lg:border-l">
                  <Button variant="outline" size="sm" className="w-full lg:w-auto font-orbitron text-[10px] tracking-widest border-accent/40 text-accent hover:bg-accent/10 leading-none pt-2.5 pb-2">
                    <Sparkles className="w-3 h-3 mr-2 -mt-0.5" /> Explain This
                  </Button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </Card>
  );
}