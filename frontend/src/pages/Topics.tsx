import { useState, useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Binary, Cpu, Layers, Code2, Database, Globe, ShieldCheck, TerminalSquare, Briefcase, LineChart } from 'lucide-react';
import { TopicCard } from '../components/topics/TopicCard';
import { ExamMaterialCard } from '../components/learning/ExamMaterialCard';
import { PdfViewerModal } from '../components/learning/PdfViewerModal';
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

const PAST_EXAMS = [
  { id: 'oct_2025', title: 'October 2025', qUrl: '/materials/october_2025_questions.pdf', aUrl: '/materials/october_2025_answers.pdf' },
  { id: 'apr_2025', title: 'April 2025', qUrl: '/materials/april_2025_questions.pdf', aUrl: '/materials/april_2025_answers.pdf' },
  { id: 'oct_2024', title: 'October 2024', qUrl: '/materials/october_2024_questions.pdf', aUrl: '/materials/october_2024_answers.pdf' },
  { id: 'apr_2024', title: 'April 2024', qUrl: '/materials/april_2024_questions.pdf', aUrl: '/materials/april_2024_answers.pdf' },
  { id: 'oct_2023', title: 'October 2023', qUrl: '/materials/october_2023_questions.pdf', aUrl: '/materials/october_2023_answers.pdf' },
  { id: 'apr_2023', title: 'April 2023', qUrl: '/materials/april_2023_questions.pdf', aUrl: '/materials/april_2023_answers.pdf' },
  { id: 'oct_2022', title: 'October 2022', qUrl: '/materials/october_2022_questions.pdf', aUrl: '/materials/october_2022_answers.pdf' },
  { id: 'apr_2022', title: 'April 2022', qUrl: '/materials/april_2022_questions.pdf', aUrl: '/materials/april_2022_answers.pdf' },
  { id: 'oct_2021', title: 'October 2021', qUrl: '/materials/october_2021_questions.pdf', aUrl: '/materials/october_2021_answers.pdf' },
  { id: 'apr_2021', title: 'April 2021', qUrl: '/materials/april_2021_questions.pdf', aUrl: '/materials/april_2021_answers.pdf' },
  { id: 'oct_2020', title: 'October 2020', qUrl: '/materials/october_2020_questions.pdf', aUrl: '/materials/october_2020_answers.pdf' },
  { id: 'apr_2020', title: 'April 2020', qUrl: '/materials/april_2020_questions.pdf', aUrl: '/materials/april_2020_answers.pdf' },
  { id: 'oct_2019', title: 'October 2019', qUrl: '/materials/october_2019_questions.pdf', aUrl: '/materials/october_2019_answers.pdf' },
  { id: 'apr_2019', title: 'April 2019', qUrl: '/materials/april_2019_questions.pdf', aUrl: '/materials/april_2019_answers.pdf' },
  { id: 'oct_2018', title: 'October 2018', qUrl: '/materials/october_2018_questions.pdf', aUrl: '/materials/october_2018_answers.pdf' },
  { id: 'apr_2018', title: 'April 2018', qUrl: '/materials/april_2018_questions.pdf', aUrl: '/materials/april_2018_answers.pdf' },
  { id: 'oct_2017', title: 'October 2017', qUrl: '/materials/october_2017_questions.pdf', aUrl: '/materials/october_2017_answers.pdf' },
  { id: 'apr_2017', title: 'April 2017', qUrl: '/materials/april_2017_questions.pdf', aUrl: '/materials/april_2017_answers.pdf' },
  { id: 'oct_2016', title: 'October 2016', qUrl: '/materials/october_2016_questions.pdf', aUrl: '/materials/october_2016_answers.pdf' },
  { id: 'apr_2016', title: 'April 2016', qUrl: '/materials/april_2016_questions.pdf', aUrl: '/materials/april_2016_answers.pdf' },
  { id: 'oct_2015', title: 'October 2015', qUrl: '/materials/october_2015_questions.pdf', aUrl: '/materials/october_2015_answers.pdf' },
  { id: 'apr_2015', title: 'April 2015', qUrl: '/materials/april_2015_questions.pdf', aUrl: '/materials/april_2015_answers.pdf' },
  { id: 'oct_2014', title: 'October 2014', qUrl: '/materials/october_2014_questions.pdf', aUrl: '/materials/october_2014_answers.pdf' },
  { id: 'apr_2014', title: 'April 2014', qUrl: '/materials/april_2014_questions.pdf', aUrl: '' },
  { id: 'oct_2013', title: 'October 2013', qUrl: '/materials/october_2013_questions.pdf', aUrl: '/materials/october_2013_answers.pdf' },
  { id: 'apr_2013', title: 'April 2013', qUrl: '/materials/april_2013_questions.pdf', aUrl: '/materials/april_2013_answers.pdf' },
  { id: 'oct_2012', title: 'October 2012', qUrl: '/materials/october_2012_questions.pdf', aUrl: '/materials/october_2012_answers.pdf' },
  { id: 'apr_2012', title: 'April 2012', qUrl: '/materials/april_2012_questions.pdf', aUrl: '/materials/april_2012_answers.pdf' },
  { id: 'oct_2011', title: 'October 2011', qUrl: '/materials/october_2011_questions.pdf', aUrl: '/materials/october_2011_answers.pdf' },
  { id: 'apr_2011', title: 'April 2011', qUrl: '/materials/april_2011_questions.pdf', aUrl: '/materials/april_2011_answers.pdf' },
  { id: 'oct_2010', title: 'October 2010', qUrl: '/materials/october_2010_questions.pdf', aUrl: '/materials/october_2010_answers.pdf' },
  { id: 'apr_2010', title: 'April 2010', qUrl: '/materials/april_2010_questions.pdf', aUrl: '/materials/april_2010_answers.pdf' },
];

export default function Topics() {
  // Calculate global mastery
  const totalQuestions = PHILNITS_CATEGORIES.reduce((acc, cat) => acc + cat.count, 0);
  const avgMastery = Math.round(PHILNITS_CATEGORIES.reduce((acc, cat) => acc + cat.mastery, 0) / 10);

  const [selectedExam, setSelectedExam] = useState<{ id: string; title: string; qUrl: string; aUrl: string; } | null>(null);

  // Group PAST_EXAMS by year
  const groupedExams = useMemo(() => {
    return PAST_EXAMS.reduce((acc, exam) => {
      // Assuming title is "Month Year" (e.g. "October 2025")
      const year = exam.title.split(' ')[1];
      if (!acc[year]) acc[year] = [];
      acc[year].push(exam);
      return acc;
    }, {} as Record<string, typeof PAST_EXAMS>);
  }, []);

  // Get years sorted descending
  const sortedYears = useMemo(() => {
    return Object.keys(groupedExams).sort((a, b) => parseInt(b) - parseInt(a));
  }, [groupedExams]);

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
      </motion.div>

      {/* 3. PAST EXAMINATIONS LIBRARY */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="w-full mt-10"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-display font-bold text-text-main">Historical Archives</h2>
            <p className="text-text-muted text-sm mt-1">Review official PhilNITS FE examination papers from 2010 to 2025.</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-10">
          {sortedYears.map((year) => (
            <div key={year} className="flex flex-col gap-4">
              <h3 className="font-orbitron text-xl font-bold text-text-main flex items-center gap-3">
                {year}
                <div className="h-px flex-1 bg-borderline/50" />
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {groupedExams[year].map((exam) => (
                  <motion.div key={exam.id} variants={fadeUpVariant} className="h-full">
                    <ExamMaterialCard 
                      title={exam.title} 
                      onClick={() => setSelectedExam(exam)} 
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <PdfViewerModal 
        isOpen={!!selectedExam} 
        onClose={() => setSelectedExam(null)} 
        exam={selectedExam} 
      />
    </div>
  );
}