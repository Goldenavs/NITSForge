import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlannerSetup } from '../components/planner/PlannerSetup';
import { StudyPlanList } from '../components/planner/StudyPlanList';
import { BookOpen } from 'lucide-react';

export const PlannerPage: React.FC = () => {
  // Mock State - Will be replaced by Zustand + Supabase backend logic
  const [generationsLeft, setGenerationsLeft] = useState(2);
  const [planDays, setPlanDays] = useState([
    { id: '1', dateLabel: 'Day 1 (Today)', topics: ['Data Structures', 'Algorithms'], isCompleted: true },
    { id: '2', dateLabel: 'Day 2 (Tomorrow)', topics: ['Operating Systems', 'Networking'], isCompleted: false },
    { id: '3', dateLabel: 'Day 3', topics: ['Information Security', 'Databases'], isCompleted: false },
    { id: '4', dateLabel: 'Day 4', topics: ['Project Management', 'System Strategy'], isCompleted: false },
  ]);

  const handleGenerate = (date: string, hours: number) => {
    console.log("Calling Gemini Pro Proxy...", { date, hours });
    setGenerationsLeft(prev => prev - 1);
    // In real app, trigger TanStack Query mutation here
  };

  const toggleDay = (id: string) => {
    setPlanDays(prev => prev.map(day => 
      day.id === id ? { ...day, isCompleted: !day.isCompleted } : day
    ));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto space-y-6 pb-12"
    >
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl text-white shadow-sm">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] font-display tracking-tight">AI Study Planner</h1>
          <p className="text-[var(--color-text-muted)] font-medium mt-1">Let Forge map out your path to the FE.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Setup & Info */}
        <div className="space-y-6 lg:col-span-1">
          <PlannerSetup generationsLeft={generationsLeft} onGenerate={handleGenerate} />
          
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5">
            <h4 className="font-bold text-[var(--color-text-primary)] mb-2 text-sm">How it works</h4>
            <ul className="text-sm text-[var(--color-text-muted)] space-y-2 list-disc list-inside">
              <li>Forge analyzes your weak categories from the dashboard.</li>
              <li>A custom roadmap is generated using Gemini 2.5 Pro.</li>
              <li>Check off days to earn bonus XP!</li>
            </ul>
          </div>
        </div>

        {/* Right Column: The Interactive Plan */}
        <div className="lg:col-span-2">
          {planDays.length > 0 ? (
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Your Forge Roadmap</h3>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1">Complete your assigned topics to stay on track.</p>
                </div>
                <span className="px-3 py-1 bg-[var(--color-surface-2)] text-[var(--color-primary)] rounded-full text-xs font-bold border border-[var(--color-border)]">
                  {planDays.filter(d => d.isCompleted).length} / {planDays.length} Days
                </span>
              </div>
              <StudyPlanList days={planDays} onToggleDay={toggleDay} />
            </div>
          ) : (
             <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-[var(--color-border)] rounded-2xl p-12 text-center text-[var(--color-text-muted)]">
                <BookOpen className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-lg font-medium">No active plan.</p>
                <p className="text-sm mt-1">Set your target date to generate your roadmap.</p>
             </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PlannerPage;