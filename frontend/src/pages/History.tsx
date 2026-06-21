// src/pages/History.tsx
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { History as HistoryIcon, Download } from 'lucide-react';
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

import { useMemo, useState } from 'react';
import { groupHistoryByDateAndAttempt } from '../utils/historyGrouping';
import { HistoryTimeline } from '../components/history/HistoryTimeline';

export default function History() {
  const { data: logs, isLoading, loadMore, hasMore } = useHistory();
  const [filterMode, setFilterMode] = useState<string>('all');

  const groupedData = useMemo(() => {
    let filteredLogs = logs;
    if (filterMode !== 'all') {
      filteredLogs = logs.filter(log => log.session_mode === filterMode);
    }
    return groupHistoryByDateAndAttempt(filteredLogs);
  }, [logs, filterMode]);

  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const handleExportCSV = (mode: 'last-30-days' | 'last-50') => {
    if (!logs || logs.length === 0) return;

    let logsToExport = logs;
    if (mode === 'last-50') {
      logsToExport = logs.slice(0, 50);
    } else if (mode === 'last-30-days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      logsToExport = logs.filter(l => new Date(l.answered_at) >= thirtyDaysAgo);
    }

    if (logsToExport.length === 0) {
      alert("No logs match this criteria to export.");
      return;
    }

    const headers = [
      "Session ID",
      "Mode",
      "Date",
      "Time",
      "Question ID",
      "Category",
      "Correct Answer",
      "User Answer",
      "Is Correct"
    ];

    const rows = logsToExport.map(log => {
      const date = new Date(log.answered_at);
      return [
        log.session_id,
        log.session_mode,
        date.toLocaleDateString(),
        date.toLocaleTimeString(),
        log.question_id,
        `"${(log.question_category || '').replace(/"/g, '""')}"`,
        log.correct_answer,
        log.user_answer || "N/A",
        log.is_correct ? "Yes" : "No"
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `nitsforge_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-8 sm:gap-10 w-full max-w-7xl mx-auto pb-24 px-1 sm:px-0 pt-4">

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

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="flex-1 md:flex-initial font-orbitron text-[10px] tracking-widest border border-borderline bg-background text-text-main leading-none py-2 px-3 rounded-md outline-none cursor-pointer"
          >
            <option value="all">ALL MODES</option>
            <option value="practice">PRACTICE</option>
            <option value="zen">ZEN</option>
            <option value="survival">SURVIVAL</option>
            <option value="simulation">SIMULATION</option>
            <option value="ai-generated">FORGE AI</option>
            <option value="quick">QUICK</option>
            <option value="topic">TOPIC</option>
            <option value="date">DATE</option>
            <option value="missed">MISSED</option>
            <option value="speed">SPEED</option>
            <option value="sandbox">SANDBOX</option>
            <option value="daily-challenge">DAILY CHALLENGE</option>
          </select>

          {/* CSV Export Dropdown strictly required by documentation */}
          <div className="relative flex-1 md:flex-initial">
            <Button 
              variant="outline" 
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              disabled={!logs || logs.length === 0}
              className="w-full font-orbitron text-[10px] tracking-widest border-primary/40 text-primary hover:bg-primary/10 leading-none pt-2.5 pb-2"
            >
              <Download className="w-3.5 h-3.5 mr-2 -mt-0.5" /> Export CSV
            </Button>

            <AnimatePresence>
              {isExportMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-surface-2 border border-borderline rounded-lg shadow-xl overflow-hidden z-50 flex flex-col"
                >
                  <button onClick={() => { handleExportCSV('last-30-days'); setIsExportMenuOpen(false); }} className="px-4 py-3 text-left text-xs font-orbitron tracking-wider hover:bg-surface text-text-main transition-colors border-b border-borderline/50">
                    Last 30 Days
                  </button>
                  <button onClick={() => { handleExportCSV('last-50'); setIsExportMenuOpen(false); }} className="px-4 py-3 text-left text-xs font-orbitron tracking-wider hover:bg-surface text-text-main transition-colors">
                    Last 50 Questions
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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