import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Sparkles } from 'lucide-react';

interface PlannerSetupProps {
  generationsLeft: number;
  onGenerate: (date: string, hours: number) => void;
}

export const PlannerSetup: React.FC<PlannerSetupProps> = ({ generationsLeft, onGenerate }) => {
  const [examDate, setExamDate] = useState('');
  const [hours, setHours] = useState(2);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm relative overflow-hidden"
    >
      {/* Dynamic Background Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--color-primary)] opacity-5 rounded-full blur-3xl"></div>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-[var(--color-surface-2)] text-[var(--color-primary)]">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Exam Target</h2>
          <p className="text-sm text-[var(--color-text-muted)]">Set your parameters to generate a plan.</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-bold text-[var(--color-text-primary)] mb-2">Target Exam Date</label>
          <div className="relative">
            <input 
              type="date" 
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--color-text-primary)] mb-2">Daily Study Hours</label>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[var(--color-text-muted)]" />
            <input 
              type="range" 
              min="1" max="8" 
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="flex-grow accent-[var(--color-primary)]"
            />
            <span className="font-bold text-[var(--color-text-primary)] w-12 text-right">{hours} hrs</span>
          </div>
        </div>
      </div>

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onGenerate(examDate, hours)}
        disabled={generationsLeft <= 0 || !examDate}
        className="w-full bg-[var(--color-primary)] text-white rounded-xl px-5 py-3 font-semibold flex items-center justify-center gap-2 hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        <Sparkles className="w-5 h-5" />
        Generate AI Study Plan
      </motion.button>
      
      <p className="text-center text-xs text-[var(--color-text-muted)] mt-4 font-medium">
        {generationsLeft} of 3 AI plan generations remaining.
      </p>
    </motion.div>
  );
};