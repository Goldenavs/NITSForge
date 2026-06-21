// src/components/history/FilterModal.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, Target, Hash } from 'lucide-react';
import { Button } from '../ui/Button';

export const MODES = [
  { id: 'practice', label: 'Practice' },
  { id: 'zen', label: 'Zen' },
  { id: 'survival', label: 'Survival' },
  { id: 'simulation', label: 'Simulation' },
  { id: 'ai-generated', label: 'Forge AI' },
  { id: 'quick', label: 'Quick' },
  { id: 'topic', label: 'Topic' },
  { id: 'date', label: 'Date' },
  { id: 'missed', label: 'Missed' },
  { id: 'speed', label: 'Speed' },
  { id: 'sandbox', label: 'Sandbox' },
  { id: 'daily-challenge', label: 'Daily Challenge' }
];

export const CATEGORIES = [
  { id: 'math', label: 'Basic Theory' },
  { id: 'arch', label: 'Computer Architecture' },
  { id: 'os', label: 'Operating Systems' },
  { id: 'ds', label: 'Data Structures' },
  { id: 'db', label: 'Databases' },
  { id: 'net', label: 'Networking' },
  { id: 'sec', label: 'Information Security' },
  { id: 'se', label: 'Software Engineering' },
  { id: 'strat', label: 'Strategy' },
  { id: 'mgmt', label: 'Management' }
];

export type AccuracyFilter = 'all' | 'correct' | 'incorrect';
export type SessionLengthFilter = 'all' | '<10' | '10-30' | '>30';
export type TimeFilter = 'all' | 'AM' | 'PM';

export interface FilterState {
  modes: string[];
  categories: string[];
  accuracy: AccuracyFilter;
  sessionLength: SessionLengthFilter;
  timeOfDay: TimeFilter;
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

  const toggleCategory = (catId: string) => {
    setLocalFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(catId)
        ? prev.categories.filter(c => c !== catId)
        : [...prev.categories, catId]
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClearAll = () => {
    setLocalFilters({
      modes: [],
      categories: [],
      accuracy: 'all',
      sessionLength: 'all',
      timeOfDay: 'all'
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
                      className={`px-3 py-2 rounded-lg border text-xs font-body transition-all duration-300 ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary font-medium shadow-[0_0_10px_rgba(var(--color-primary),0.2)] scale-[1.02]'
                          : 'border-borderline/50 bg-surface-2/50 text-text-muted hover:border-text-muted/40 hover:bg-surface-2'
                      }`}
                    >
                      {mode.label}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Categories Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-text-muted" />
                <h3 className="font-orbitron font-bold text-sm tracking-widest uppercase text-text-main">Categories</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = localFilters.categories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-3 py-2 rounded-lg border text-xs font-body transition-all duration-300 ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary font-medium shadow-[0_0_10px_rgba(var(--color-primary),0.2)] scale-[1.02]'
                          : 'border-borderline/50 bg-surface-2/50 text-text-muted hover:border-text-muted/40 hover:bg-surface-2'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Segmented Controls Wrapper */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Accuracy Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-text-muted" />
                  <h3 className="font-orbitron font-bold text-sm tracking-widest uppercase text-text-main">Accuracy</h3>
                </div>
                <div className="relative flex items-center w-full bg-surface-2/40 border border-borderline/50 rounded-2xl p-1 overflow-hidden">
                  {(['all', 'correct', 'incorrect'] as AccuracyFilter[]).map((acc) => {
                    const isActive = localFilters.accuracy === acc;
                    return (
                      <button
                        key={acc}
                        onClick={() => setLocalFilters(prev => ({ ...prev, accuracy: acc }))}
                        className={`relative flex-1 py-2 text-xs font-body capitalize transition-colors z-10 flex items-center justify-center text-center ${
                          isActive ? 'text-surface font-medium' : 'text-text-muted hover:text-text-main'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="accuracyIndicator"
                            className="absolute inset-0 bg-primary rounded-xl shadow-md -z-10"
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          />
                        )}
                        {acc}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Session Length Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Hash className="w-4 h-4 text-text-muted" />
                  <h3 className="font-orbitron font-bold text-sm tracking-widest uppercase text-text-main">Questions</h3>
                </div>
                <div className="relative flex items-center w-full bg-surface-2/40 border border-borderline/50 rounded-2xl p-1 overflow-hidden">
                  {(['all', '<10', '10-30', '>30'] as SessionLengthFilter[]).map((len) => {
                    const isActive = localFilters.sessionLength === len;
                    return (
                      <button
                        key={len}
                        onClick={() => setLocalFilters(prev => ({ ...prev, sessionLength: len }))}
                        className={`relative flex-1 py-2 text-xs font-body transition-colors z-10 flex items-center justify-center text-center ${
                          isActive ? 'text-surface font-medium' : 'text-text-muted hover:text-text-main'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="sessionLengthIndicator"
                            className="absolute inset-0 bg-primary rounded-xl shadow-md -z-10"
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          />
                        )}
                        {len === 'all' ? 'Any' : len}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Time Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-4 h-4 text-text-muted" />
                  <h3 className="font-orbitron font-bold text-sm tracking-widest uppercase text-text-main">Time</h3>
                </div>
                <div className="relative flex items-center w-full bg-surface-2/40 border border-borderline/50 rounded-2xl p-1 overflow-hidden">
                  {(['all', 'AM', 'PM'] as TimeFilter[]).map((time) => {
                    const isActive = localFilters.timeOfDay === time;
                    return (
                      <button
                        key={time}
                        onClick={() => setLocalFilters(prev => ({ ...prev, timeOfDay: time }))}
                        className={`relative flex-1 py-2 text-xs font-body transition-colors z-10 flex items-center justify-center text-center ${
                          isActive ? 'text-surface font-medium' : 'text-text-muted hover:text-text-main'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="timeOfDayIndicator"
                            className="absolute inset-0 bg-primary rounded-xl shadow-md -z-10"
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          />
                        )}
                        {time === 'all' ? 'Any' : time}
                      </button>
                    );
                  })}
                </div>
              </section>

            </div>

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
