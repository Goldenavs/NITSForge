// src/pages/History.tsx
import { motion, type Variants } from 'framer-motion';
import { History as HistoryIcon, Download, Filter } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { HistoryRow } from '../components/history/HistoryRow';

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

// Deep Mock Data matching PhilNITS FE complexity
const MOCK_HISTORY_LOGS = [
  {
    id: 'FE-NET-042',
    date: 'Today, 14:22',
    category: 'Networking & Communication',
    mode: 'Daily Challenge',
    text: 'In IPv4 addressing, which of the following perfectly describes the primary function of a Subnet Mask?',
    options: {
      A: 'It converts private IP addresses into globally routable public addresses.',
      B: 'It separates the IP address into a network portion and a host portion.',
      C: 'It resolves a human-readable domain name into an IP address.',
      D: 'It dynamically assigns IP addresses to newly connected client devices.'
    },
    userAnswer: 'D',
    correctAnswer: 'B',
    isCorrect: false,
    explanation: 'A subnet mask is a 32-bit number that masks an IP address, and divides the IP address into network address and host address. DHCP handles dynamic assignment (Option D).',
    trend: [false, false]
  },
  {
    id: 'FE-DB-014',
    date: 'Yesterday, 09:15',
    category: 'Databases',
    mode: 'Topic Drill',
    text: 'Which normal form (NF) ensures that there are no transitive dependencies of non-prime attributes on the primary key?',
    options: {
      A: 'First Normal Form (1NF)',
      B: 'Second Normal Form (2NF)',
      C: 'Third Normal Form (3NF)',
      D: 'Boyce-Codd Normal Form (BCNF)'
    },
    userAnswer: 'C',
    correctAnswer: 'C',
    isCorrect: true,
    explanation: '3NF dictates that every non-prime attribute is non-transitively dependent on every candidate key. 2NF only deals with partial dependencies.',
    trend: [false, true, true]
  },
  {
    id: 'FE-OS-088',
    date: 'May 20, 18:40',
    category: 'Operating Systems',
    mode: 'Exam Simulation',
    text: 'What is the primary consequence of a system entering a "thrashing" state?',
    options: {
      A: 'The CPU spends more time paging data than executing application code.',
      B: 'The operating system kernel crashes due to a null pointer exception.',
      C: 'The hard drive physical read/write head becomes damaged.',
      D: 'The system successfully prevents a deadlocked process from executing.'
    },
    userAnswer: 'A',
    correctAnswer: 'A',
    isCorrect: true,
    explanation: 'Thrashing occurs when a computer\'s virtual memory resources are overused, leading to a constant state of paging and page faults, severely degrading performance.',
    trend: [true]
  }
];

export default function History() {
  return (
    <div className="flex flex-col gap-8 sm:gap-10 w-full max-w-5xl mx-auto pb-24 px-1 sm:px-0 pt-4">
      
      {/* 1. HEADER & CONTROLS */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="flex flex-col items-start justify-center">
          <Badge className="mb-3 bg-surface-2/60 backdrop-blur-sm text-text-muted border-borderline font-orbitron tracking-widest uppercase text-[10px] leading-none pt-1.5 pb-1 flex items-center gap-2">
            <HistoryIcon className="w-3 h-3 text-primary -mt-0.5" /> Performance Log
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-text-main font-display tracking-tight leading-none mb-3 pt-1">
            Answer <span className="text-primary">History.</span>
          </h1>
          <p className="text-sm sm:text-base text-text-muted max-w-xl leading-relaxed">
            Review your tactical performance. Analyze past mistakes, read official explanations, or deploy Forge AI for a deep dive into any concept.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <Button variant="outline" className="flex-1 md:flex-initial font-orbitron text-[10px] tracking-widest border-borderline text-text-main leading-none pt-2.5 pb-2">
            <Filter className="w-3.5 h-3.5 mr-2 -mt-0.5" /> Filter
          </Button>
          {/* CSV Export strictly required by documentation */}
          <Button variant="outline" className="flex-1 md:flex-initial font-orbitron text-[10px] tracking-widest border-primary/40 text-primary hover:bg-primary/10 leading-none pt-2.5 pb-2">
            <Download className="w-3.5 h-3.5 mr-2 -mt-0.5" /> Export CSV
          </Button>
        </div>
      </motion.div>

      {/* 2. THE HISTORY LOG LIST */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="flex flex-col gap-3 mt-2"
      >
        {MOCK_HISTORY_LOGS.map((log) => (
          <motion.div key={log.id} variants={fadeUpVariant}>
            <HistoryRow log={log} />
          </motion.div>
        ))}
        
        {/* Load More Button */}
        <motion.div variants={fadeUpVariant} className="flex justify-center mt-6">
          <Button variant="ghost" className="font-orbitron text-[10px] uppercase tracking-widest text-text-muted hover:text-primary leading-none pt-2.5 pb-2">
            Load Older Records
          </Button>
        </motion.div>
      </motion.div>

    </div>
  );
}