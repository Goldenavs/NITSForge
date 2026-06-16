// src/components/quiz/QuizSetupModal.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers, Calendar, Box, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Button } from '../ui/Button';

// Copying topics from Topics.tsx to decouple
const PHILNITS_CATEGORIES = [
  { id: 'math', title: 'Basic Theory of Information' },
  { id: 'arch', title: 'Computer Architecture' },
  { id: 'os', title: 'Operating Systems' },
  { id: 'ds', title: 'Data Structures & Algorithms' },
  { id: 'db', title: 'Databases' },
  { id: 'net', title: 'Networking & Comm.' },
  { id: 'sec', title: 'Information Security' },
  { id: 'se', title: 'Software Engineering' },
  { id: 'pm', title: 'Project Management' },
  { id: 'strat', title: 'System Strategy' },
  { id: 'legal', title: 'Corporate & Legal Affairs' },
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
  configType: 'topic' | 'date' | 'sandbox' | null;
  onStart: (config: any) => void;
}

export function QuizSetupModal({ isOpen, onClose, configType, onStart }: QuizSetupModalProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [sandboxAmount, setSandboxAmount] = useState(30);
  const [sandboxTime, setSandboxTime] = useState(30); // 0 = None
  const [sandboxAI, setSandboxAI] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedTopics([]);
      setSelectedDates([]);
      setSandboxAmount(30);
      setSandboxTime(30);
      setSandboxAI(false);
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
              </div>
              <div>
                <h2 className="text-xl font-bold font-display text-text-main leading-tight">
                  {configType === 'topic' && 'Select Drill Topics'}
                  {configType === 'date' && 'Select Exam Dates'}
                  {configType === 'sandbox' && 'Configure Sandbox'}
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
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-text-main font-orbitron">Question Amount</label>
                    <span className="text-sm text-primary font-bold">{sandboxAmount} Qs</span>
                  </div>
                  <input 
                    type="range" min="10" max="100" step="10" 
                    value={sandboxAmount} onChange={(e) => setSandboxAmount(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-text-main font-orbitron">Time Limit</label>
                    <span className="text-sm text-primary font-bold">{sandboxTime === 0 ? 'None (Untimed)' : `${sandboxTime} Mins`}</span>
                  </div>
                  <input 
                    type="range" min="0" max="180" step="10" 
                    value={sandboxTime} onChange={(e) => setSandboxTime(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
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

            {/* TOPIC SELECTOR */}
            {(configType === 'topic' || configType === 'sandbox') && (
              <div className="mb-8">
                {configType === 'sandbox' && <h3 className="text-sm font-bold text-text-main font-orbitron mb-3 flex items-center gap-2"><Layers className="w-4 h-4"/> Filter by Topic (Optional)</h3>}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {PHILNITS_CATEGORIES.map(topic => (
                    <button
                      key={topic.id}
                      onClick={() => toggleTopic(topic.id)}
                      className={`text-left p-3 rounded-xl border text-xs transition-all ${
                        selectedTopics.includes(topic.id) 
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
                {configType === 'sandbox' && <h3 className="text-sm font-bold text-text-main font-orbitron mb-3 flex items-center gap-2"><Calendar className="w-4 h-4"/> Filter by Date (Optional)</h3>}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {PAST_EXAM_DATES.map(date => (
                    <button
                      key={date}
                      onClick={() => toggleDate(date)}
                      className={`text-center py-2 px-1 rounded-lg border text-xs transition-all ${
                        selectedDates.includes(date) 
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
