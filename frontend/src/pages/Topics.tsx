// src/pages/Topics.tsx
import { motion, type Variants } from 'framer-motion';
import { Binary, Cpu, Layers, Code2, Database, Globe, ShieldCheck, TerminalSquare, Briefcase, LineChart } from 'lucide-react';
import { TopicCard } from '../components/topics/TopicCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

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
  { id: 'math', title: 'Basic Theory of Information', mastery: 92, count: 145, icon: Binary, color: 'text-blue-500 border-blue-500/30' },
  { id: 'arch', title: 'Computer Architecture', mastery: 78, count: 82, icon: Cpu, color: 'text-emerald-500 border-emerald-500/30' },
  { id: 'os', title: 'Operating Systems', mastery: 64, count: 56, icon: Layers, color: 'text-indigo-500 border-indigo-500/30' },
  { id: 'ds', title: 'Data Structures & Algorithms', mastery: 88, count: 210, icon: Code2, color: 'text-amber-500 border-amber-500/30' },
  { id: 'db', title: 'Databases', mastery: 95, count: 120, icon: Database, color: 'text-cyan-500 border-cyan-500/30' },
  { id: 'net', title: 'Networking & Communication', mastery: 45, count: 89, icon: Globe, color: 'text-rose-500 border-rose-500/30' },
  { id: 'sec', title: 'Information Security', mastery: 71, count: 64, icon: ShieldCheck, color: 'text-purple-500 border-purple-500/30' },
  { id: 'se', title: 'Software Engineering & Development', mastery: 82, count: 95, icon: TerminalSquare, color: 'text-fuchsia-500 border-fuchsia-500/30' },
  { id: 'strat', title: 'Strategy', mastery: 40, count: 261, icon: LineChart, color: 'text-teal-500 border-teal-500/30' },
  { id: 'mgmt', title: 'Management', mastery: 58, count: 582, icon: Briefcase, color: 'text-orange-500 border-orange-500/30' },
];

export default function Topics() {
  // Calculate global mastery
  const totalQuestions = PHILNITS_CATEGORIES.reduce((acc, cat) => acc + cat.count, 0);
  const avgMastery = Math.round(PHILNITS_CATEGORIES.reduce((acc, cat) => acc + cat.mastery, 0) / 10);

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pb-24 px-1 sm:px-0 pt-4">
      
      {/* 1. HEADER SECTION */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
      >
        <div className="flex flex-col items-start justify-center">
          <Badge className="mb-3 bg-surface-2/60 backdrop-blur-sm text-text-muted border-borderline font-orbitron tracking-widest uppercase text-[10px]">
            Knowledge Repository
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-text-main font-display tracking-tight leading-none mb-3">
            Learning <span className="text-primary">Hub.</span>
          </h1>
          <p className="text-sm sm:text-base text-text-muted max-w-2xl leading-relaxed">
            Access official PhilNITS FE examination materials, answer keys, and focused drill sessions grouped by core syllabus categories.
          </p>
        </div>

        {/* Global Stats Overview */}
        <div className="flex items-center gap-4 bg-surface/85 backdrop-blur-md border border-borderline/60 rounded-2xl p-4 shrink-0 shadow-sm">
          <div>
            <p className="text-[10px] font-orbitron uppercase tracking-widest text-text-muted mb-1">Global Accuracy</p>
            <p className="text-2xl font-bold font-orbitron text-text-main leading-none">{avgMastery}%</p>
          </div>
          <div className="w-px h-10 bg-borderline/50 mx-2" />
          <div>
            <p className="text-[10px] font-orbitron uppercase tracking-widest text-text-muted mb-1">Items Cleared</p>
            <p className="text-2xl font-bold font-orbitron text-text-main leading-none">{totalQuestions}</p>
          </div>
        </div>
      </motion.div>

      {/* 2. THE MASTER GRID */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
      >
        {PHILNITS_CATEGORIES.map((category) => (
          <motion.div key={category.id} variants={fadeUpVariant} className="h-full">
            <TopicCard questionCount={0} colorClass={''} {...category} />
          </motion.div>
        ))}

        {/* AI Sandbox Upsell Card (Fills the 12th slot perfectly in a 3 or 4 col grid) */}
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

      </motion.div>
    </div>
  );
}