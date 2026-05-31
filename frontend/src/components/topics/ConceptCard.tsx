// src/components/topics/ConceptCard.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle2, ChevronDown } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface ConceptCardProps {
  title: string;
  summary: string;
  keyPoints: string[];
  isMastered?: boolean;
}

export function ConceptCard({ title, summary, keyPoints, isMastered }: ConceptCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card 
      onClick={() => setIsOpen(!isOpen)}
      className="bg-surface/85 backdrop-blur-md border border-borderline/60 hover:border-primary/40 transition-all duration-300 shadow-sm cursor-pointer overflow-hidden group"
    >
      <div className="p-5 sm:p-6 flex flex-col relative z-10">
        
        {/* Header Row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
              <BookOpen className="w-4 h-4" />
            </div>
            {/* FIX: leading-none pt-1 for typography alignment */}
            <h3 className="text-lg font-display font-bold text-text-main leading-none pt-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {isMastered && (
              <Badge className="bg-green-500/10 text-green-600 border-green-500/20 font-orbitron text-[9px] tracking-widest uppercase leading-none pt-1 pb-0.5 hidden sm:flex">
                Mastered
              </Badge>
            )}
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown className="w-5 h-5 text-text-muted group-hover:text-text-main transition-colors" />
            </motion.div>
          </div>
        </div>

        {/* Short Summary */}
        <p className="text-sm text-text-muted font-body leading-relaxed pr-6">
          {summary}
        </p>

        {/* Expandable Content (Framer Motion Height Animation) */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="overflow-hidden"
            >
              <div className="pt-5 mt-4 border-t border-borderline/50">
                <p className="text-[10px] font-orbitron uppercase tracking-widest text-text-muted mb-3 font-bold leading-none">
                  Core Axioms
                </p>
                <ul className="flex flex-col gap-3">
                  {keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm font-body text-text-main leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </Card>
  );
}