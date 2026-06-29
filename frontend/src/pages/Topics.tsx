import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Binary, Cpu, Layers, Code2, Database, Globe, ShieldCheck, TerminalSquare, Briefcase, LineChart } from 'lucide-react';
import { TopicCard } from '../components/topics/TopicCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useTopicsData } from '../hooks/useTopicsData';

// Motion Orchestration (TypeScript safe)
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 24 } }
};

const viewportConfig = { once: true, margin: "-50px" };

// The 10 PhilNITS FE Syllabus Categories
const PHILNITS_CATEGORIES = [
  { id: 'math', title: 'Basic Theory of Information', icon: Binary, color: 'text-blue-500 border-blue-500/30' },
  { id: 'arch', title: 'Computer Architecture', icon: Cpu, color: 'text-emerald-500 border-emerald-500/30' },
  { id: 'os', title: 'Operating Systems', icon: Layers, color: 'text-indigo-500 border-indigo-500/30' },
  { id: 'ds', title: 'Data Structures & Algorithms', icon: Code2, color: 'text-amber-500 border-amber-500/30' },
  { id: 'db', title: 'Databases', icon: Database, color: 'text-cyan-500 border-cyan-500/30' },
  { id: 'net', title: 'Networking & Communication', icon: Globe, color: 'text-rose-500 border-rose-500/30' },
  { id: 'sec', title: 'Information Security', icon: ShieldCheck, color: 'text-purple-500 border-purple-500/30' },
  { id: 'se', title: 'Software Engineering & Development', icon: TerminalSquare, color: 'text-fuchsia-500 border-fuchsia-500/30' },
  { id: 'strat', title: 'Strategy', icon: LineChart, color: 'text-teal-500 border-teal-500/30' },
  { id: 'mgmt', title: 'Management', icon: Briefcase, color: 'text-orange-500 border-orange-500/30' },
];

export default function Topics() {
  const { topicsData, isLoading } = useTopicsData();

  // Calculate global stats
  const totalDbCount = Object.values(topicsData).reduce((sum, t) => sum + t.total_db_count, 0);
  const totalAttempted = Object.values(topicsData).reduce((sum, t) => sum + t.attempted_count, 0);
  const totalCorrect = Object.values(topicsData).reduce((sum, t) => sum + t.correct_count, 0);

  const globalCompletion = totalDbCount > 0 ? Math.round((totalAttempted / totalDbCount) * 100) : 0;
  const globalAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pb-24 px-1 sm:px-0 pt-4">
      
      {/* 1. HERO SECTION */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="flex flex-col items-start justify-center">
          <Badge className="mb-3 bg-surface-2/60 backdrop-blur-sm text-text-muted border-borderline font-orbitron tracking-widest uppercase text-[10px]">
            Syllabus Explorer
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-text-main font-display tracking-tight leading-none mb-3">
            Core <span className="text-primary">Topics.</span>
          </h1>
          <p className="text-sm sm:text-base text-text-muted max-w-2xl leading-relaxed">
            Master the official PhilNITS FE syllabus. Drill into specific categories, track your accuracy, and conquer weak points.
          </p>
        </div>

        {/* Global Progress Overview */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-4 text-sm font-orbitron font-bold uppercase tracking-widest text-text-muted mb-1">
            <span className="flex flex-col items-end">
              <span className="text-[10px]">Total Completion</span>
              <span className="text-xl text-text-main">{globalCompletion}%</span>
            </span>
            <div className="w-px h-8 bg-borderline" />
            <span className="flex flex-col items-end">
              <span className="text-[10px]">Global Accuracy</span>
              <span className="text-xl text-primary">{globalAccuracy}%</span>
            </span>
          </div>
        </div>
      </motion.div>

      {/* 2. SYLLABUS GRID */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="w-full mt-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6">
          {PHILNITS_CATEGORIES.map((category) => {
            const data = topicsData[category.id] || { 
              total_db_count: 0, 
              attempted_count: 0, 
              correct_count: 0 
            };
            
            return (
              <motion.div key={category.id} variants={fadeUpVariant} className="h-full">
                <TopicCard 
                  id={category.id}
                  title={category.title}
                  icon={category.icon}
                  colorClass={category.color}
                  totalDbCount={data.total_db_count}
                  attemptedCount={data.attempted_count}
                  correctCount={data.correct_count}
                />
              </motion.div>
            );
          })}

          {/* AI Sandbox Upsell Card */}
          <motion.div variants={fadeUpVariant} className="h-full">
            <div className="h-full flex flex-col items-center justify-center text-center p-6 rounded-2xl border-2 border-dashed border-borderline/80 bg-surface-2/20 hover:bg-surface-2/40 hover:border-accent/40 transition-colors group">
              <div className="w-12 h-12 mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                <Cpu className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-sm font-bold font-display text-text-main mb-2">Need a wild card?</h3>
              <p className="text-xs text-text-muted mb-4">Combine multiple categories into a custom AI-generated scenario.</p>
              <Button variant="outline" size="sm" className="font-orbitron text-[10px] tracking-widest border-accent/40 text-accent group-hover:bg-accent/10 w-full">
                Launch Sandbox
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}