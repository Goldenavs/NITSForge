import { motion, type Variants } from 'framer-motion';
import { Globe, ChevronLeft, Target, Cpu, History, Binary, Layers, Code2, Database, ShieldCheck, TerminalSquare, Briefcase, LineChart, CheckCircle2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/dashboard/StatCard';
import { useTopicsData } from '../hooks/useTopicsData';

// Motion Orchestration
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 24 } }
};

const viewportConfig = { once: true, margin: "-50px" };

// The 10 PhilNITS FE Syllabus Categories (Duplicated for standalone lookup)
const PHILNITS_CATEGORIES = [
  { id: 'math', title: 'Basic Theory of Information', icon: Binary, color: 'text-blue-500 border-blue-500/30', bgClass: 'bg-blue-500/10' },
  { id: 'arch', title: 'Computer Architecture', icon: Cpu, color: 'text-emerald-500 border-emerald-500/30', bgClass: 'bg-emerald-500/10' },
  { id: 'os', title: 'Operating Systems', icon: Layers, color: 'text-indigo-500 border-indigo-500/30', bgClass: 'bg-indigo-500/10' },
  { id: 'ds', title: 'Data Structures & Algorithms', icon: Code2, color: 'text-amber-500 border-amber-500/30', bgClass: 'bg-amber-500/10' },
  { id: 'db', title: 'Databases', icon: Database, color: 'text-cyan-500 border-cyan-500/30', bgClass: 'bg-cyan-500/10' },
  { id: 'net', title: 'Networking & Communication', icon: Globe, color: 'text-rose-500 border-rose-500/30', bgClass: 'bg-rose-500/10' },
  { id: 'sec', title: 'Information Security', icon: ShieldCheck, color: 'text-purple-500 border-purple-500/30', bgClass: 'bg-purple-500/10' },
  { id: 'se', title: 'Software Engineering & Development', icon: TerminalSquare, color: 'text-fuchsia-500 border-fuchsia-500/30', bgClass: 'bg-fuchsia-500/10' },
  { id: 'strat', title: 'Strategy', icon: LineChart, color: 'text-teal-500 border-teal-500/30', bgClass: 'bg-teal-500/10' },
  { id: 'mgmt', title: 'Management', icon: Briefcase, color: 'text-orange-500 border-orange-500/30', bgClass: 'bg-orange-500/10' },
];

export default function TopicDetail() {
  const { category: categoryId } = useParams<{ category: string }>();
  const { topicsData } = useTopicsData();

  const categoryMeta = PHILNITS_CATEGORIES.find(c => c.id === categoryId);
  const data = topicsData[categoryId || ''] || { total_db_count: 0, attempted_count: 0, correct_count: 0 };

  const completionPct = data.total_db_count > 0 ? Math.round((data.attempted_count / data.total_db_count) * 100) : 0;
  const accuracyPct = data.attempted_count > 0 ? Math.round((data.correct_count / data.attempted_count) * 100) : 0;

  if (!categoryMeta) return <div className="p-8 text-center text-text-muted">Topic not found</div>;
  const Icon = categoryMeta.icon;

  return (
    <div className="flex flex-col gap-8 sm:gap-10 w-full max-w-5xl mx-auto pb-24 px-1 sm:px-0 pt-4">

      {/* 1. NAVIGATION & HEADER */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        className="flex flex-col items-start justify-center"
      >
        <Link to="/topics" className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-orbitron text-xs font-bold uppercase tracking-widest mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Hub
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between w-full gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl ${categoryMeta.bgClass} border ${categoryMeta.color} flex items-center justify-center shrink-0`}>
              <Icon className={`w-8 h-8 ${categoryMeta.color.split(' ')[0]}`} />
            </div>
            <div>
              <Badge className="mb-2 bg-surface-2/60 backdrop-blur-sm text-text-muted border-borderline font-orbitron tracking-widest uppercase text-[10px] leading-none pt-1 pb-0.5">
                Category Detail
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-main font-display tracking-tight leading-none pt-1">
                {categoryMeta.title}
              </h1>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-initial font-orbitron text-[10px] tracking-widest border-accent/40 text-accent hover:bg-accent/10 leading-none pt-2.5 pb-2">
              <Cpu className="w-3.5 h-3.5 mr-2 -mt-0.5" /> AI Sandbox
            </Button>
            <Link to={`/quiz/setup?mode=drill&topic=${categoryId}`}>
              <Button variant="primary" className={`w-full font-orbitron text-[10px] tracking-widest leading-none pt-2.5 pb-2 ${categoryMeta.bgClass.replace('/10', '/80')} hover:opacity-80 text-white border-none`}>
                <Target className="w-3.5 h-3.5 mr-2 -mt-0.5" /> Start Drill
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 2. STATS ROW */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <motion.div variants={fadeUpVariant} className="h-full">
          <StatCard
            title="Category Accuracy"
            value={`${accuracyPct}%`}
            subtitle={accuracyPct >= 85 ? "Mastered" : accuracyPct >= 50 ? "Proficient" : "Needs Improvement"}
            icon={Target}
            colorClass={accuracyPct >= 85 ? "text-green-500 border-green-500/30" : accuracyPct >= 50 ? "text-amber-500 border-amber-500/30" : "text-rose-500 border-rose-500/30"}
          />
        </motion.div>
        <motion.div variants={fadeUpVariant} className="h-full">
          <StatCard
            title="Questions Attempted"
            value={data.attempted_count}
            subtitle={`Out of ${data.total_db_count} available`}
            icon={History}
            colorClass="text-blue-500 border-blue-500/30"
          />
        </motion.div>
        <motion.div variants={fadeUpVariant} className="h-full">
          <StatCard
            title="Total Completion"
            value={`${completionPct}%`}
            subtitle="Of category syllabus"
            icon={CheckCircle2}
            colorClass="text-emerald-500 border-emerald-500/30"
          />
        </motion.div>
      </motion.div>

      {/* 3. CONCEPT CARDS LIST */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="flex flex-col gap-4 mt-4"
      >
        <motion.div variants={fadeUpVariant}>
          <h2 className="text-xl font-display font-bold text-text-main mb-2">Core Concepts</h2>
          <p className="text-sm text-text-muted mb-4">Expand these cards for quick, high-yield syllabus reviews before starting a drill.</p>
        </motion.div>
        {/* Placeholder for when concepts are wired up from the DB */}
        {/* 
        {concepts.map((concept, idx) => (
          <motion.div key={idx} variants={fadeUpVariant}>
            <ConceptCard {...concept} />
          </motion.div>
        ))}
        */}
      </motion.div>

    </div>
  );
}