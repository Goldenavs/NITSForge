// src/components/history/FilterModal.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, Target, Hash } from 'lucide-react';
import { Button } from '../ui/Button';

export const MODES = [
  { id: 'practice', label: 'PRACTICE' },
  { id: 'zen', label: 'ZEN' },
  { id: 'survival', label: 'SURVIVAL' },
  { id: 'simulation', label: 'SIMULATION' },
  { id: 'ai-generated', label: 'FORGE AI' },
  { id: 'quick', label: 'QUICK' },
  { id: 'topic', label: 'TOPIC' },
  { id: 'date', label: 'DATE' },
  { id: 'missed', label: 'MISSED' },
  { id: 'speed', label: 'SPEED' },
  { id: 'sandbox', label: 'SANDBOX' },
  { id: 'daily-challenge', label: 'DAILY CHALLENGE' }
];

export type AccuracyFilter = 'all' | 'correct' | 'incorrect';
export type SessionLengthFilter = 'all' | '<10' | '10-30' | '>30';

export interface FilterState {
  modes: string[];
  accuracy: AccuracyFilter;
  sessionLength: SessionLengthFilter;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
}

export function FilterModal({ isOpen, onClose, currentFilters, onApplyFilters }: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters);

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(currentFilters);
    }
  }, [isOpen, currentFilters]);

  if (!isOpen) return null;

  const toggleMode = (modeId: string) => {
    setLocalFilters(prev => ({
      ...prev,
      modes: prev.modes.includes(modeId)
        ? prev.modes.filter(m => m !== modeId)
        : [...prev.modes, modeId]
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClearAll = () => {
    setLocalFilters({
      modes: [],
      accuracy: 'all',
      sessionLength: 'all'
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-surface border border-borderline rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-borderline flex items-center justify-between bg-surface-2/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Filter className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-text-main">Advanced Filters</h2>
                <p className="text-xs text-text-muted font-body">Refine your tactical history analysis</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-main transition-colors p-2 hover:bg-surface-2 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-8">
            
            {/* Modes Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-text-muted" />
                <h3 className="font-orbitron font-bold text-sm tracking-widest uppercase text-text-main">Game Modes</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {MODES.map((mode) => {
                  const isSelected = localFilters.modes.includes(mode.id);
                  return (
                    <button
                      key={mode.id}
                      onClick={() => toggleMode(mode.id)}
                      className={`px-4 py-2 rounded-xl border text-xs font-orbitron font-bold tracking-wider uppercase transition-all duration-300 ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(var(--color-primary),0.2)] scale-105'
                          : 'border-borderline/50 bg-surface-2 text-text-muted hover:border-text-muted/40 hover:bg-surface'
                      }`}
                    >
                      {mode.label}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Accuracy Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-text-muted" />
                <h3 className="font-orbitron font-bold text-sm tracking-widest uppercase text-text-main">Accuracy</h3>
              </div>
              <div className="flex gap-2 p-1 bg-surface-2 rounded-xl border border-borderline">
                {(['all', 'correct', 'incorrect'] as AccuracyFilter[]).map((acc) => (
                  <button
                    key={acc}
                    onClick={() => setLocalFilters(prev => ({ ...prev, accuracy: acc }))}
                    className={`flex-1 py-2 rounded-lg text-xs font-orbitron font-bold tracking-wider uppercase transition-all ${
                      localFilters.accuracy === acc
                        ? 'bg-surface shadow-md text-text-main'
                        : 'text-text-muted hover:text-text-main'
                    }`}
                  >
                    {acc}
                  </button>
                ))}
              </div>
            </section>

            {/* Session Length Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Hash className="w-4 h-4 text-text-muted" />
                <h3 className="font-orbitron font-bold text-sm tracking-widest uppercase text-text-main">Session Length (Questions)</h3>
              </div>
              <div className="flex gap-2 p-1 bg-surface-2 rounded-xl border border-borderline">
                {(['all', '<10', '10-30', '>30'] as SessionLengthFilter[]).map((len) => (
                  <button
                    key={len}
                    onClick={() => setLocalFilters(prev => ({ ...prev, sessionLength: len }))}
                    className={`flex-1 py-2 rounded-lg text-xs font-orbitron font-bold tracking-wider uppercase transition-all ${
                      localFilters.sessionLength === len
                        ? 'bg-surface shadow-md text-text-main'
                        : 'text-text-muted hover:text-text-main'
                    }`}
                  >
                    {len === 'all' ? 'Any' : len}
                  </button>
                ))}
              </div>
            </section>

          </div>

          {/* Footer */}
          <div className="p-6 border-t border-borderline bg-surface-2/30 flex justify-between items-center">
            <button
              onClick={handleClearAll}
              className="text-xs font-orbitron font-bold tracking-widest text-text-muted hover:text-red-400 transition-colors uppercase px-4 py-2"
            >
              Clear All
            </button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="font-orbitron tracking-widest">
                Cancel
              </Button>
              <Button onClick={handleApply} className="font-orbitron tracking-widest">
                Apply Filters
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
