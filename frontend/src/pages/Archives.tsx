import { useState, useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Search, Filter, Archive } from 'lucide-react';
import { ExamMaterialCard } from '../components/learning/ExamMaterialCard';
import { PdfViewerModal } from '../components/learning/PdfViewerModal';
import { Badge } from '../components/ui/Badge';

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

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 24 } }
};

export default function Archives() {
  const [selectedExam, setSelectedExam] = useState<{ id: string; title: string; qUrl: string; aUrl: string; } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter exams based on search query
  const filteredExams = useMemo(() => {
    return PAST_EXAMS.filter(exam => 
      exam.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Group filtered exams by year
  const groupedExams = useMemo(() => {
    return filteredExams.reduce((acc, exam) => {
      const year = exam.title.split(' ')[1];
      if (!acc[year]) acc[year] = [];
      acc[year].push(exam);
      return acc;
    }, {} as Record<string, typeof PAST_EXAMS>);
  }, [filteredExams]);

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
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="flex flex-col items-start justify-center">
          <Badge className="mb-3 bg-surface-2/60 backdrop-blur-sm text-text-muted border-borderline font-orbitron tracking-widest uppercase text-[10px] flex items-center gap-2 pt-1.5 pb-1">
            <Archive className="w-3 h-3 text-primary -mt-0.5" /> Historical Archives
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-text-main font-display tracking-tight leading-none mb-3 pt-1">
            Past <span className="text-primary">Examinations.</span>
          </h1>
          <p className="text-sm sm:text-base text-text-muted max-w-2xl leading-relaxed">
            Review official PhilNITS FE examination papers from 2010 to 2025. 
            Source: <a href="https://itpec.org/pastexamqa/ip.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">itpec.org</a>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search by year or season..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-2/60 border border-borderline text-text-main text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-borderline bg-surface-2 hover:bg-surface-3 transition-colors text-text-muted hover:text-text-main">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* 2. THE ARCHIVES GRID */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"
      >
        {sortedYears.map((year) => (
          <motion.div 
            key={year} 
            variants={fadeUpVariant} 
            className="flex flex-col gap-4 p-5 rounded-2xl border-2 border-dashed border-borderline/80 bg-surface-2/10 relative"
          >
            {/* Year Badge */}
            <div className="absolute -top-3.5 left-5 px-3 py-1 bg-surface-1 border border-borderline/80 rounded-full">
              <span className="text-sm font-orbitron font-bold text-text-main tracking-widest">{year}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 h-full">
              {groupedExams[year].map((exam) => (
                <ExamMaterialCard 
                  key={exam.id}
                  title={exam.title} 
                  onClick={() => setSelectedExam(exam)} 
                />
              ))}
            </div>
          </motion.div>
        ))}

        {sortedYears.length === 0 && (
          <div className="col-span-full text-center py-12 text-text-muted bg-surface-2/20 rounded-xl border border-borderline/30">
            No exams found matching "{searchQuery}".
          </div>
        )}
      </motion.div>

      <PdfViewerModal 
        isOpen={!!selectedExam} 
        onClose={() => setSelectedExam(null)} 
        exam={selectedExam} 
      />
    </div>
  );
}
