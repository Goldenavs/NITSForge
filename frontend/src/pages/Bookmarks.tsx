// src/pages/Bookmarks.tsx
import { motion, type Variants } from 'framer-motion';
import { Bookmark, Plus, Search } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { BookmarkFolderCard } from '../components/bookmarks/BookmarkFolderCard';
import { BookmarkRow } from '../components/bookmarks/BookmarkRow';

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

// Mock Data: Collections
const MOCK_FOLDERS = [
  { id: 'math-formulas', title: 'Math & Formulas', count: 24, colorClass: 'text-blue-500', bgClass: 'bg-blue-500/10' },
  { id: 'networking-traps', title: 'Networking Traps', count: 12, colorClass: 'text-rose-500', bgClass: 'bg-rose-500/10' },
  { id: 'exam-eve', title: 'Exam Eve Review', count: 5, colorClass: 'text-amber-500', bgClass: 'bg-amber-500/10' },
  { id: 'data-structs', title: 'Tricky Data Structs', count: 18, colorClass: 'text-emerald-500', bgClass: 'bg-emerald-500/10' },
];

// Mock Data: Uncategorized / Recent Bookmarks
const MOCK_RECENT_BOOKMARKS = [
  {
    id: 'FE-SE-102',
    category: 'Software Engineering',
    dateAdded: '2 days ago',
    text: 'Which of the following best describes the primary goal of the Agile methodology compared to the Waterfall model?',
    options: {
      A: 'To eliminate all software bugs before release through rigorous documentation.',
      B: 'To deliver working software incrementally and adapt to changing requirements.',
      C: 'To ensure strict adherence to a pre-defined budget and timeline.',
      D: 'To minimize communication between developers and stakeholders.'
    },
    correctAnswer: 'B',
    explanation: 'Agile prioritizes iterative development, flexibility, and customer collaboration over rigid planning and comprehensive documentation.'
  },
  {
    id: 'FE-SEC-045',
    category: 'Information Security',
    dateAdded: '1 week ago',
    text: 'What is the main difference between Symmetric and Asymmetric encryption algorithms?',
    options: {
      A: 'Symmetric encryption is only used for data at rest, while Asymmetric is for data in transit.',
      B: 'Symmetric uses a single key for both encryption and decryption; Asymmetric uses a public/private key pair.',
      C: 'Symmetric encryption cannot be broken by brute force; Asymmetric can.',
      D: 'Symmetric uses the RSA algorithm; Asymmetric uses AES.'
    },
    correctAnswer: 'B',
    explanation: 'Symmetric encryption relies on a shared secret key (like AES). Asymmetric relies on a mathematically linked public and private key pair (like RSA).'
  }
];

export default function Bookmarks() {
  return (
    <div className="flex flex-col gap-8 sm:gap-10 w-full max-w-5xl mx-auto pb-24 px-1 sm:px-0 pt-4">
      
      {/* 1. HEADER SECTION */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="flex flex-col items-start justify-center">
          <Badge className="mb-3 bg-surface-2/60 backdrop-blur-sm text-text-muted border-borderline font-orbitron tracking-widest uppercase text-[10px] leading-none pt-1.5 pb-1 flex items-center gap-2">
            <Bookmark className="w-3 h-3 text-primary -mt-0.5" /> Knowledge Vault
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-text-main font-display tracking-tight leading-none mb-3 pt-1">
            Saved <span className="text-primary">Concepts.</span>
          </h1>
          <p className="text-sm sm:text-base text-text-muted max-w-xl leading-relaxed">
            Organize tricky questions and core axioms into custom collections for focused review before exam day.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search bookmarks..." 
              className="w-full bg-surface-2/60 border border-borderline text-text-main text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
      </motion.div>

      {/* 2. COLLECTIONS GRID */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-bold text-text-main leading-none pt-1">Your Collections</h2>
          <Button variant="ghost" size="sm" className="font-orbitron text-[10px] uppercase tracking-widest text-primary hover:bg-primary/10 leading-none pt-2.5 pb-2">
            <Plus className="w-3.5 h-3.5 mr-1.5 -mt-0.5" /> New Folder
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_FOLDERS.map((folder) => (
            <BookmarkFolderCard key={folder.id} folder={folder} fadeUpVariant={fadeUpVariant} />
          ))}
        </div>
      </motion.div>

      {/* 3. RECENT / UNCATEGORIZED LIST */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="flex flex-col gap-3 mt-4"
      >
        <div className="flex items-center justify-between border-b border-borderline/50 pb-2 mb-2 mt-4">
          <h2 className="text-xl font-display font-bold text-text-main leading-none pt-1">Recent Saves</h2>
        </div>

        {MOCK_RECENT_BOOKMARKS.map((item) => (
          <BookmarkRow key={item.id} item={item} fadeUpVariant={fadeUpVariant} />
        ))}
        
      </motion.div>

    </div>
  );
}