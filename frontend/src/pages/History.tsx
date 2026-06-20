// src/pages/History.tsx
import { motion, type Variants } from 'framer-motion';
import { History as HistoryIcon, Download, Filter } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';


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

import { useHistory } from '../hooks/useHistory';
import { Loader2 } from 'lucide-react';

import { useMemo } from 'react';
import { groupHistoryByDateAndAttempt } from '../utils/historyGrouping';
import { HistoryTimeline } from '../components/history/HistoryTimeline';

export default function History() {
  const { data: logs, isLoading, loadMore, hasMore } = useHistory();

  const groupedData = useMemo(() => {
    return groupHistoryByDateAndAttempt(logs);
  }, [logs]);

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
        animate="visible"
        viewport={viewportConfig}
        className="flex flex-col gap-3 mt-2"
      >
        {groupedData.length > 0 && (
          <HistoryTimeline groupedData={groupedData} />
        )}

        {groupedData.length === 0 && !isLoading && (
          <div className="text-center py-12 text-text-muted bg-surface-2/20 rounded-xl border border-borderline/30">
            No history found for the last 30 days. Start taking quizzes to see your performance logs!
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <motion.div variants={fadeUpVariant} className="flex justify-center mt-6">
            <Button
              variant="ghost"
              onClick={loadMore}
              disabled={isLoading}
              className="font-orbitron text-[10px] uppercase tracking-widest text-text-muted hover:text-primary leading-none pt-2.5 pb-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load Older Records'}
            </Button>
          </motion.div>
        )}
      </motion.div>

    </div>
  );
}