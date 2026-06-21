import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import type { GroupedDate, GroupedAttempt } from '../../utils/historyGrouping';
import { HistoryRow } from './HistoryRow';
import { Calendar, Target, CheckCircle2, ChevronDown } from 'lucide-react';

interface HistoryTimelineProps {
  groupedData: GroupedDate[];
  sessionStats?: Record<string, { total: number, score: number }>;
}

export function HistoryTimeline({ groupedData, sessionStats }: HistoryTimelineProps) {
  const groupsWithIndices = useMemo(() => {
    return groupedData.reduce((acc, group) => {
      const startIndex = acc.length > 0 
        ? acc[acc.length - 1].startIndex + acc[acc.length - 1].attempts.length 
        : 0;
      acc.push({ ...group, startIndex });
      return acc;
    }, [] as Array<GroupedDate & { startIndex: number }>);
  }, [groupedData]);

  return (
    <div className="relative w-full py-8">
      {/* Central Line */}
      <div className="absolute left-[16px] md:left-1/2 top-0 bottom-0 w-px bg-borderline/80 md:-translate-x-1/2"></div>

      <div className="flex flex-col gap-16 relative z-10">
        {groupsWithIndices.map((dateGroup) => (
          <DateNode
            key={dateGroup.dateStr}
            dateGroup={dateGroup}
            startIndex={dateGroup.startIndex}
            sessionStats={sessionStats}
          />
        ))}
      </div>
    </div>
  );
}

function DateNode({ dateGroup, startIndex, sessionStats }: { dateGroup: GroupedDate; startIndex: number; sessionStats?: Record<string, { total: number, score: number }> }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="relative">

      {/* Centered Clickable Date Badge */}
      <div className="flex justify-start md:justify-center mb-10 sticky top-[140px] z-20 pl-4 md:pl-0">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`bg-surface/95 backdrop-blur-md border shadow-[0_0_15px_rgba(var(--color-primary),0.15)] rounded-full px-6 py-2.5 flex items-center gap-3 transition-colors hover:border-primary ${isExpanded ? 'border-primary/50' : 'border-borderline'}`}
        >
          <Calendar className="w-4 h-4 text-primary" />
          <span className="font-orbitron font-bold text-sm tracking-widest text-primary uppercase">
            {dateGroup.dateStr}
          </span>
          <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Expandable Attempts Container */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-8 md:gap-12 pb-4">
              {dateGroup.attempts.map((attempt, idx) => {
                const isLeft = (startIndex + idx) % 2 === 0;
                return (
                  <AttemptNode
                    key={attempt.session_id}
                    attempt={attempt}
                    isLeft={isLeft}
                    sessionStats={sessionStats}
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function AttemptNode({ attempt, isLeft, sessionStats }: { attempt: GroupedAttempt; isLeft: boolean; sessionStats?: Record<string, { total: number, score: number }> }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const timeStr = new Date(attempt.answered_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  
  const stats = sessionStats?.[attempt.session_id];
  const score = stats ? stats.score : attempt.questions.filter(q => q.is_correct).length;
  const total = stats ? stats.total : attempt.questions.length;
  const accuracy = Math.round((score / total) * 100) || 0;

  return (
    <div className={`relative flex items-start md:items-center ${isLeft ? 'md:flex-row-reverse' : 'md:flex-row'} w-full`}>

      {/* Spacer for desktop to push to one side */}
      <div className="hidden md:block md:w-1/2" />

      {/* Node Marker on the Line */}
      <div className="absolute left-[16px] md:left-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary -translate-x-1/2 mt-6 md:mt-0 shadow-[0_0_15px_rgba(var(--color-primary),0.6)] z-10" />

      {/* Content Box */}
      <div className={`w-full md:w-1/2 pl-[40px] pr-0 md:px-12 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
        <motion.div
          layout
          className={`bg-surface-2/40 border border-borderline/50 rounded-2xl overflow-hidden transition-all duration-300 group shadow-lg ${isExpanded ? 'border-primary/50 bg-surface-2/80 shadow-[0_0_30px_rgba(var(--color-primary),0.1)]' : 'hover:border-primary/40'}`}
        >
          {/* Header Info - Clickable Area */}
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-4 sm:p-5 cursor-pointer flex flex-col items-center justify-center text-center gap-3"
          >
            <div className="flex flex-col md:flex-row items-center gap-3">
              <span className="font-orbitron font-bold text-lg text-text-main capitalize">
                {attempt.session_mode.replace('-', ' ')} Mode
              </span>
              <span className="text-xs text-text-muted font-mono bg-background/80 px-2.5 py-1 rounded-md border border-borderline/30">
                {timeStr}
              </span>
            </div>

            <div className="flex items-center justify-center flex-wrap gap-4 text-sm text-text-muted">
              <div className="flex items-center gap-1.5 bg-background/50 px-3 py-1.5 rounded-lg border border-borderline/30">
                <Target className="w-3.5 h-3.5 text-primary" />
                <span className="font-bold text-text-main">{total}</span> items
              </div>
              <div className="flex items-center gap-1.5 bg-background/50 px-3 py-1.5 rounded-lg border border-borderline/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                <span className="font-bold text-green-400">{accuracy}%</span> acc
              </div>

              <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${isExpanded ? 'bg-primary text-background' : 'bg-background border border-borderline group-hover:border-primary/50 text-text-muted group-hover:text-primary'}`}>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
              </div>
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
                <div className="flex flex-col gap-3 px-2 pb-4 sm:px-4 sm:pb-5 text-left border-t border-borderline/30 bg-background/30 pt-4">
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
