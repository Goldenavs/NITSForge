import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

interface StudyDay {
  id: string;
  dateLabel: string;
  topics: string[];
  isCompleted: boolean;
}

interface StudyPlanListProps {
  days: StudyDay[];
  onToggleDay: (id: string) => void;
}

export const StudyPlanList: React.FC<StudyPlanListProps> = ({ days, onToggleDay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4"
    >
      {days.map((day, index) => (
        <motion.div 
          key={day.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 * index }}
          className={`rounded-2xl border p-5 flex items-start gap-4 cursor-pointer transition-colors shadow-sm ${
            day.isCompleted 
              ? 'border-[var(--color-border)] bg-[var(--color-surface-2)] opacity-70' 
              : 'border-[var(--color-primary)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]'
          }`}
          onClick={() => onToggleDay(day.id)}
        >
          <motion.div 
            whileTap={{ scale: 0.8 }}
            className={`mt-1 flex-shrink-0 ${day.isCompleted ? 'text-[var(--color-success)]' : 'text-[var(--color-border)] hover:text-[var(--color-primary)]'}`}
          >
            {day.isCompleted ? <CheckCircle2 className="w-7 h-7" /> : <Circle className="w-7 h-7" />}
          </motion.div>
          
          <div className="flex-grow">
            <h4 className={`text-lg font-bold mb-2 ${day.isCompleted ? 'text-[var(--color-text-muted)] line-through' : 'text-[var(--color-text-primary)]'}`}>
              {day.dateLabel}
            </h4>
            <div className="flex flex-wrap gap-2">
              {day.topics.map(topic => (
                <span 
                  key={topic} 
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    day.isCompleted 
                      ? 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]' 
                      : 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-sm'
                  }`}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};