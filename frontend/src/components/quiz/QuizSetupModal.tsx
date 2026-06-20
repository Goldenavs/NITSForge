// src/components/quiz/QuizSetupModal.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers, Calendar, Box, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

// Copying topics from Topics.tsx to decouple
const PHILNITS_CATEGORIES = [
  { id: 'math', title: 'Basic Theory of Information' },
  { id: 'arch', title: 'Computer Architecture' },
  { id: 'os', title: 'Operating Systems' },
  { id: 'ds', title: 'Data Structures & Algorithms' },
  { id: 'db', title: 'Databases' },
  { id: 'net', title: 'Networking & Communication' },
  { id: 'sec', title: 'Information Security' },
  { id: 'se', title: 'Software Engineering & Development' },
  { id: 'strat', title: 'Strategy' },
  { id: 'mgmt', title: 'Management' },
];

const PAST_EXAM_DATES = [
  "October 2025 (latest)", "April 2025", "October 2024", "April 2024",
  "October 2023", "April 2023", "October 2022", "April 2022",
  "Q2 2021", "Q4 2021", "October 2020", "Q2 2020",
  "October 2019", "April 2019", "October 2018", "March 2018",
  "October 2017", "April 2017", "October 2016", "April 2016",
  "October 2015", "May 2015", "October 2014", "April 2014",
  "October 2013", "April 2013", "October 2012", "April 2012",
  "October 2011", "April 2011", "October 2010", "April 2010"
];

interface QuizSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  configType: 'topic' | 'date' | 'sandbox' | 'ai-sandbox' | null;
  onStart: (config: any) => void;
}

export function QuizSetupModal({ isOpen, onClose, configType, onStart }: QuizSetupModalProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [sandboxAmount, setSandboxAmount] = useState(30);
  const [sandboxTime, setSandboxTime] = useState(30); // 0 = None
  const [sandboxAI, setSandboxAI] = useState(true);
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedTopics([]);
      setSelectedDates([]);
      setSandboxAmount(30);
      setSandboxTime(30);
      setSandboxAI(true);
      setAiDifficulty('medium');
    }
  }, [isOpen]);

  const toggleTopic = (id: string) => {
    setSelectedTopics(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const toggleDate = (date: string) => {
    setSelectedDates(prev => prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]);
  };

  const handleStart = () => {
    let config: any = {};
    if (configType === 'topic') {
      config = { topics: selectedTopics, questionCount: 30 };
    } else if (configType === 'date') {
      config = { dates: selectedDates, questionCount: 30 };
    } else if (configType === 'sandbox') {
      config = {
        questionCount: sandboxAmount,
        timerMinutes: sandboxTime === 0 ? null : sandboxTime,
        aiAllowed: sandboxAI,
        topics: selectedTopics.length > 0 ? selectedTopics : null,
        dates: selectedDates.length > 0 ? selectedDates : null
      };
    } else if (configType === 'ai-sandbox') {
      config = {
        mode: 'ai-generated',
        questionCount: sandboxAmount, // reuse amount
        aiDifficulty,
        topics: selectedTopics.length > 0 ? selectedTopics : null
      };
    }
    onStart(config);
    onClose();
  };

  if (!isOpen) return null;

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
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className="relative w-full max-w-2xl bg-surface border border-borderline/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-borderline/50 bg-surface-2/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                {configType === 'topic' && <Layers className="w-5 h-5" />}
                {configType === 'date' && <Calendar className="w-5 h-5" />}
                {configType === 'sandbox' && <Box className="w-5 h-5" />}
                {configType === 'ai-sandbox' && <Sparkles className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-xl font-bold font-display text-text-main leading-tight">
                  {configType === 'topic' && 'Select Drill Topics'}
                  {configType === 'date' && 'Select Exam Dates'}
                  {configType === 'sandbox' && 'Configure Sandbox'}
                  {configType === 'ai-sandbox' && 'AI-Sandbox Mode'}
                </h2>
                <p className="text-xs text-text-muted font-orbitron tracking-widest uppercase">
                  Custom Parameter Setup
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-text-muted hover:text-text-main transition-colors p-2 rounded-lg hover:bg-surface-2">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">

            {/* SANDBOX EXCLUSIVE CONTROLS */}
            {configType === 'sandbox' && (
              <div className="mb-8 space-y-6">
                <div>
                  <label className="text-sm font-bold text-text-main font-orbitron block mb-2">Question Amount</label>
                  <div className="relative flex items-center w-full bg-surface-2/40 border border-borderline/50 rounded-2xl p-1 overflow-hidden">
                    {[10, 30, 50, 80, 100].map((amount) => {
                      const isActive = sandboxAmount === amount;
                      return (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setSandboxAmount(amount)}
                          className={`relative flex-1 py-2 text-xs font-bold tracking-wide rounded-xl transition-colors z-10 flex items-center justify-center text-center ${isActive ? 'text-surface' : 'text-text-muted hover:text-text-main'}`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="sandboxAmountActiveIndicator"
                              className="absolute inset-0 bg-primary rounded-xl shadow-md -z-10"
                              transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            />
                          )}
                          {amount} Qs
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-text-main font-orbitron block mb-2">Time Limit</label>
                  <div className="relative flex items-center w-full bg-surface-2/40 border border-borderline/50 rounded-2xl p-1 overflow-hidden">
                    {[
                      { val: 0, label: 'Untimed' },
                      { val: 15, label: '15 Min' },
                      { val: 30, label: '30 Min' },
                      { val: 60, label: '60 Min' },
                      { val: 90, label: '90 Min' }
                    ].map((timeOption) => {
                      const isActive = sandboxTime === timeOption.val;
                      return (
                        <button
                          key={timeOption.val}
                          type="button"
                          onClick={() => setSandboxTime(timeOption.val)}
                          className={`relative flex-1 py-2 text-[10px] sm:text-xs font-bold tracking-wide rounded-xl transition-colors z-10 flex items-center justify-center text-center ${isActive ? 'text-surface' : 'text-text-muted hover:text-text-main'}`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="sandboxTimeActiveIndicator"
                              className="absolute inset-0 bg-primary rounded-xl shadow-md -z-10"
                              transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            />
                          )}
                          {timeOption.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-borderline/50 bg-surface-2/30">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-sm font-bold text-text-main">Allow AI Assist</p>
                      <p className="text-xs text-text-muted">Enables Forge AI explanations during quiz</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSandboxAI(!sandboxAI)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${sandboxAI ? 'bg-accent' : 'bg-surface-2 border border-borderline'}`}
                  >
                    <motion.div
                      className="w-5 h-5 rounded-full bg-white absolute top-0.5 shadow-sm"
                      animate={{ left: sandboxAI ? '26px' : '2px' }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* AI-SANDBOX EXCLUSIVE CONTROLS */}
            {configType === 'ai-sandbox' && (
              <div className="mb-8 space-y-6">
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex gap-4 items-start">
                  <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-600 dark:text-amber-400 font-display mb-1">AI-Generated Content</p>
                    <p className="text-xs text-amber-600/80 dark:text-amber-400/80 leading-relaxed">
                      Deploy Gemini 2.5 Flash to synthesize novel practice scenarios on demand.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-text-main font-orbitron block mb-2">Simulation Difficulty</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'easy', label: 'Easy', color: 'bg-green-500/10 text-green-500 border-green-500' },
                      { id: 'medium', label: 'Medium', color: 'bg-amber-500/10 text-amber-500 border-amber-500' },
                      { id: 'hard', label: 'Hard', color: 'bg-red-500/10 text-red-500 border-red-500' }
                    ].map(diff => (
                      <button
                        key={diff.id}
                        onClick={() => setAiDifficulty(diff.id as any)}
                        className={`flex-1 py-3 px-2 rounded-xl border-2 font-display font-bold text-sm transition-all ${
                          aiDifficulty === diff.id ? diff.color + ' scale-[1.02]' : 'border-borderline/50 text-text-muted hover:border-borderline bg-surface-2/40'
                        }`}
                      >
                        {diff.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-text-main font-orbitron block mb-2">Item Count</label>
                  <div className="relative flex items-center w-full bg-surface-2/40 border border-borderline/50 rounded-2xl p-1 overflow-hidden">
                    {[5, 10, 15, 20].map((amount) => {
                      const isActive = sandboxAmount === amount;
                      return (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setSandboxAmount(amount)}
                          className={`relative flex-1 py-2 text-xs font-bold tracking-wide rounded-xl transition-colors z-10 flex items-center justify-center text-center ${isActive ? 'text-surface' : 'text-text-muted hover:text-text-main'}`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="aiAmountActiveIndicator"
                              className="absolute inset-0 bg-primary rounded-xl shadow-md -z-10"
                              transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            />
                          )}
                          {amount} Qs
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TOPIC SELECTOR */}
            {(configType === 'topic' || configType === 'sandbox' || configType === 'ai-sandbox') && (
              <div className="mb-8">
                {(configType === 'sandbox' || configType === 'ai-sandbox') && <h3 className="text-sm font-bold text-text-main font-orbitron mb-3 flex items-center gap-2"><Layers className="w-4 h-4" /> Filter by Topic (Optional)</h3>}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {PHILNITS_CATEGORIES.map(topic => (
                    <button
                      key={topic.id}
                      onClick={() => toggleTopic(topic.id)}
                      className={`text-left p-3 rounded-xl border text-xs transition-all ${selectedTopics.includes(topic.id)
                          ? 'border-primary bg-primary/10 text-primary font-bold shadow-[0_0_10px_rgba(var(--color-primary),0.2)]'
                          : 'border-borderline bg-surface-2/50 text-text-muted hover:border-borderline/80 hover:text-text-main'
                        }`}
                    >
                      {topic.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* DATE SELECTOR */}
            {(configType === 'date' || configType === 'sandbox') && (
              <div>
                {configType === 'sandbox' && <h3 className="text-sm font-bold text-text-main font-orbitron mb-3 flex items-center gap-2"><Calendar className="w-4 h-4" /> Filter by Date (Optional)</h3>}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {PAST_EXAM_DATES.map(date => (
                    <button
                      key={date}
                      onClick={() => toggleDate(date)}
                      className={`text-center py-2 px-1 rounded-lg border text-xs transition-all ${selectedDates.includes(date)
                          ? 'border-primary bg-primary/10 text-primary font-bold shadow-[0_0_10px_rgba(var(--color-primary),0.2)]'
                          : 'border-borderline bg-surface-2/50 text-text-muted hover:border-borderline/80 hover:text-text-main'
                        }`}
                    >
                      {date.replace(" (latest)", "")}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="p-6 border-t border-borderline/50 bg-surface-2/30 flex justify-between items-center">
            <p className="text-xs text-text-muted">
              {configType === 'topic' && `${selectedTopics.length} topics selected`}
              {configType === 'date' && `${selectedDates.length} dates selected`}
              {configType === 'sandbox' && `Sandbox configuration ready`}
              {configType === 'ai-sandbox' && `AI Sandbox ready`}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="border-borderline/50 text-text-muted">
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleStart}
                disabled={(configType === 'topic' && selectedTopics.length === 0) || (configType === 'date' && selectedDates.length === 0)}
                className="disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(var(--color-primary),0.3)]"
              >
                Launch Protocol
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
