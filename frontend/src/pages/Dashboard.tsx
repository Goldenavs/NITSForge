// src/pages/Dashboard.tsx
import { motion } from 'framer-motion';
import { Flame, Trophy, Target, BookOpen, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/dashboard/StatCard';
import { AIWeeklyReport } from '../components/dashboard/AIWeeklyReport';
import { AccuracyChart, CategoryRadar } from '../components/dashboard/DashboardCharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

// 1. Group Stagger Orchestrator (Used for rows with multiple items like StatCards)
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// 2. Individual Item Animation (Spring Physics)
const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring" as const, stiffness: 250, damping: 24 } 
  }
};

// 3. Shared Viewport Config (Triggers when element is 50px into the screen, only fires once)
const viewportConfig = { once: true, margin: "-50px" };

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 sm:gap-8 w-full max-w-7xl mx-auto pb-24 px-1 sm:px-0 overflow-y-visible pt-4">
      
      {/* 1. WELCOME HEADER - Animates instantly on load */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div className="flex flex-col items-start justify-center">
          <Badge className="mb-2 bg-surface-2/60 backdrop-blur-sm text-text-muted border-borderline font-orbitron tracking-widest uppercase text-[10px]">
            Level 4: Specialist
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-main font-display tracking-tight leading-none pt-1">
            Welcome back, <span className="text-primary">Engineer.</span>
          </h1>
          <p className="text-sm sm:text-base text-text-muted mt-2 font-body flex items-center h-5">
            Your PhilNITS FE Exam is in&nbsp;<strong className="text-text-main font-orbitron font-bold text-base sm:text-lg text-primary leading-none pt-0.5">42</strong>&nbsp;days.
          </p>
        </div>
        <div className="flex gap-2.5 sm:gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-initial font-orbitron text-[11px] tracking-wide py-2.5">Topic Drill</Button>
          <Button variant="primary" className="flex-1 sm:flex-initial font-orbitron text-[11px] tracking-wide py-2.5">Start Simulation</Button>
        </div>
      </motion.div>

      {/* 2. OVERVIEW STATS ROW - Cascades when scrolled into view */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={fadeUpVariant}>
          <StatCard title="Total XP" value="4,250" subtitle="1,250 to next level" icon={Trophy} trend="up" trendValue="+350" colorClass="text-amber-500 border-amber-500/20" />
        </motion.div>
        <motion.div variants={fadeUpVariant}>
          <StatCard title="Overall Accuracy" value="78%" subtitle="Target: 85% for Exam Ready" icon={Target} trend="up" trendValue="+2.4%" colorClass="text-primary border-primary/20" />
        </motion.div>
        <motion.div variants={fadeUpVariant}>
          <StatCard title="Current Streak" value="12" subtitle="Days active" icon={Flame} trend="neutral" trendValue="Saved" colorClass="text-orange-500 border-orange-500/20" />
        </motion.div>
        <motion.div variants={fadeUpVariant}>
          <StatCard title="Questions Answered" value="842" subtitle="Across 11 categories" icon={BookOpen} colorClass="text-blue-500 border-blue-500/20" />
        </motion.div>
      </motion.div>

      {/* 3. AI WEEKLY REPORT - Slides up on scroll */}
      <motion.div 
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        <AIWeeklyReport />
      </motion.div>

      {/* 4. MAIN VISUALIZATION GRID */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <motion.div variants={fadeUpVariant} className="lg:col-span-2 min-w-0">
          <AccuracyChart />
        </motion.div>
        <motion.div variants={fadeUpVariant} className="min-w-0">
          <CategoryRadar />
        </motion.div>
      </motion.div>

      {/* 5. INSIGHTS & ACTIONS PANEL */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <motion.div variants={fadeUpVariant}>
          <Card className="border-red-500/20 bg-red-500/5 backdrop-blur-md h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-red-500 flex items-center gap-2 font-display font-bold text-lg leading-none">
                <AlertTriangle className="w-5 h-5 shrink-0" /> Priority Focus
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-between h-[calc(100%-3rem)]">
              <div>
                <p className="text-text-main font-bold font-display text-sm mb-1">Networking & Communication</p>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-4">Your accuracy in this category has dropped to 45% over the last 3 sessions. Subnetting questions are causing the most errors.</p>
              </div>
              <Button variant="danger" size="sm" className="w-fit font-orbitron text-[10px] tracking-wider py-2">Run Targeted Drill</Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeUpVariant}>
          <Card className="border-green-500/20 bg-green-500/5 backdrop-blur-md h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-500 flex items-center gap-2 font-display font-bold text-lg leading-none">
                <Trophy className="w-5 h-5 shrink-0" /> Strongest Area
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-between h-[calc(100%-3rem)]">
              <div>
                <p className="text-text-main font-bold font-display text-sm mb-1">Data Structures</p>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-4">You are consistently scoring above 90% in this category. You are effectively exam-ready for these topics.</p>
              </div>
              <Button variant="outline" size="sm" className="w-fit font-orbitron text-[10px] tracking-wider py-2 border-green-500/30 text-green-600 dark:text-green-400">View Concept Cards</Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

    </div>
  );
}