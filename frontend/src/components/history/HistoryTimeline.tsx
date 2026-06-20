import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { GroupedDate, GroupedAttempt } from '../../utils/historyGrouping';
import { HistoryRow } from './HistoryRow';
import { Calendar, Target, CheckCircle2, ChevronDown } from 'lucide-react';

interface HistoryTimelineProps {
  groupedData: GroupedDate[];
}

export function HistoryTimeline({ groupedData }: HistoryTimelineProps) {
  let globalAttemptIndex = 0; // Use this to alternate left/right across all attempts

  return (
    <div className="relative w-full py-8">
      {/* Central Line */}
      <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-px bg-borderline/80 md:-translate-x-1/2"></div>

      <div className="flex flex-col gap-16 relative z-10">
        {groupedData.map((dateGroup) => (
          <div key={dateGroup.dateStr} className="relative">

            {/* Centered Date Badge */}
            <div className="flex justify-start md:justify-center mb-10 sticky top-[140px] z-20 pl-4 md:pl-0">
              <div className="bg-surface/95 backdrop-blur-md border border-primary/30 shadow-[0_0_15px_rgba(var(--color-primary),0.15)] rounded-full px-6 py-2.5 flex items-center gap-3">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="font-orbitron font-bold text-sm tracking-widest text-primary uppercase">
                  {dateGroup.dateStr}
                </span>
              </div>
            </div>

            {/* Attempts under this date */}
            <div className="flex flex-col gap-8 md:gap-12">
              {dateGroup.attempts.map((attempt) => {
                const isLeft = globalAttemptIndex % 2 === 0;
                globalAttemptIndex++;

                return (
                  <AttemptNode
                    key={attempt.session_id}
                    attempt={attempt}
                    isLeft={isLeft}
                  />
                );
              })}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

function AttemptNode({ attempt, isLeft }: { attempt: GroupedAttempt; isLeft: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const timeStr = new Date(attempt.answered_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const score = attempt.questions.filter(q => q.is_correct).length;
  const total = attempt.questions.length;
  const accuracy = Math.round((score / total) * 100) || 0;

  return (
    <div className={`relative flex items-start md:items-center ${isLeft ? 'md:flex-row-reverse' : 'md:flex-row'} w-full`}>

      {/* Spacer for desktop to push to one side */}
      <div className="hidden md:block md:w-1/2" />

      {/* Node Marker on the Line */}
      <div className="absolute left-[28px] md:left-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary -translate-x-1/2 mt-6 md:mt-0 shadow-[0_0_15px_rgba(var(--color-primary),0.6)] z-10" />

      {/* Content Box */}
      <div className={`w-full md:w-1/2 pl-[60px] pr-4 md:px-12 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
        <motion.div
          layout
          className={`bg-surface-2/40 border border-borderline/50 rounded-2xl p-5 hover:border-primary/40 transition-all duration-300 cursor-pointer group shadow-lg ${isExpanded ? 'border-primary/50 bg-surface-2/80 shadow-[0_0_30px_rgba(var(--color-primary),0.1)]' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Header Info */}
          <div className={`flex flex-col md:flex-row items-start md:items-center gap-3 mb-3 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
            <span className="font-orbitron font-bold text-lg text-text-main capitalize">
              {attempt.session_mode} Session
            </span>
            <span className="text-xs text-text-muted font-mono bg-background/80 px-2.5 py-1 rounded-md border border-borderline/30">
              {timeStr}
            </span>
          </div>

          <div className={`flex items-center gap-5 text-sm text-text-muted ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
            <div className="flex items-center gap-1.5 bg-background/50 px-3 py-1.5 rounded-lg border border-borderline/30">
              <Target className="w-3.5 h-3.5 text-primary" />
              <span className="font-bold text-text-main">{total}</span> items
            </div>
            <div className="flex items-center gap-1.5 bg-background/50 px-3 py-1.5 rounded-lg border border-borderline/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              <span className="font-bold text-green-400">{accuracy}%</span> acc
            </div>

            <div className={`ml-auto md:ml-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${isExpanded ? 'bg-primary text-background' : 'bg-background border border-borderline group-hover:border-primary/50 text-text-muted group-hover:text-primary'}`}>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Expandable Questions List */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                {/* 
                  Using text-left to override the parent's text alignment (since right-side boxes are text-right on desktop)
                  This ensures HistoryRow always aligns its contents naturally to the left.
                */}
                <div className="flex flex-col gap-3 pt-6 mt-4 border-t border-borderline/50 text-left">
                  {attempt.questions.map((q, idx) => (
                    <motion.div
                      key={q.answer_id}
                      initial={{ opacity: 0, x: isLeft ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <HistoryRow log={q} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </div>
  );
}
