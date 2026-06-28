// src/pages/Dashboard.tsx
import { motion } from 'framer-motion';
import { Flame, Trophy, Target, BookOpen, AlertTriangle, Save, UserPlus, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/dashboard/StatCard';
import { AIWeeklyReport } from '../components/dashboard/AIWeeklyReport';
import { AccuracyChart, CategoryRadar } from '../components/dashboard/DashboardCharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useAuth } from '../store/AuthContext';
import { useForgeStore } from '../store/useForgeStore';

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
  const { user } = useAuth();
  const { guestXp, guestQuizzesTaken } = useForgeStore();
  const { data, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && user) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-text-muted">
        <AlertTriangle className="w-6 h-6 mr-2" /> Failed to load dashboard data.
      </div>
    );
  }

  const profile = user ? data?.profile : {
    total_xp: guestXp,
    rank_level: Math.floor(guestXp / 1000) + 1,
    current_streak: 0,
    display_name: 'Guest Explorer'
  };

  const overview = user ? data?.overview : {
    overall_accuracy: 0,
    total_questions_answered: guestQuizzesTaken
  };

  const { 
    accuracy_trends = [], 
    category_radar = [], 
    insights 
  } = data || {};

  // Rank Names
  const rankNames = ['Apprentice', 'Technician', 'Analyst', 'Specialist', 'Engineer', 'Senior Engineer', 'Architect', 'FE Master'];
  const currentRankName = rankNames[(profile?.rank_level || 1) - 1];

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
            Level {profile?.rank_level || 1}: {currentRankName}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-text-main">
            {user ? `Welcome back, ${profile?.display_name || 'User'}.` : 'Guest Sandbox'}
          </h1>
          <p className="text-text-muted mt-2 max-w-xl">
            {user ? 'Monitor your learning metrics and recent operations.' : 'You are playing locally. Your progress is temporary until you create an account.'}
          </p>
        </div>
        <div className="flex gap-2.5 sm:gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none border-borderline text-text-muted hover:text-text-main hover:bg-surface-2 hidden md:flex items-center justify-center">
            View Analytics
          </Button>
          <Button variant="primary" className="flex-1 sm:flex-none flex items-center justify-center">
            Take Quiz <Target className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>

      {!user && (
        <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={viewportConfig} className="mb-8">
          <div className="w-full relative overflow-hidden rounded-xl border border-primary/40 bg-primary/10 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]">
            <div className="flex items-start md:items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Save className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-text-main mb-1">Save Your Progress</h3>
                <p className="text-sm text-text-muted">
                  You've earned <strong className="text-primary">{guestXp} XP</strong>! Create a free account now to save it permanently, unlock the daily challenge, and climb the global leaderboards.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('nitsforge_guest_session');
                window.location.href = '/?signup=true';
              }}
              className="w-full md:w-auto whitespace-nowrap bg-primary text-background font-orbitron font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)] flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Create Account
            </button>
          </div>
        </motion.div>
      )}

      {/* 2. OVERVIEW STATS ROW - Cascades when scrolled into view */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={fadeUpVariant}>
          <StatCard title="Total XP" value={profile?.total_xp?.toString() || '0'} subtitle="Keep forging!" icon={Trophy} colorClass="text-amber-500 border-amber-500/20" />
        </motion.div>
        <motion.div variants={fadeUpVariant}>
          <StatCard title="Overall Accuracy" value={`${overview?.overall_accuracy || 0}%`} subtitle="Target: 85% for Exam Ready" icon={Target} colorClass="text-primary border-primary/20" />
        </motion.div>
        <motion.div variants={fadeUpVariant}>
          <StatCard title="Current Streak" value={profile?.current_streak?.toString() || '0'} subtitle="Days active" icon={Flame} colorClass="text-orange-500 border-orange-500/20" />
        </motion.div>
        <motion.div variants={fadeUpVariant}>
          <StatCard title="Questions Answered" value={overview?.total_questions_answered?.toString() || '0'} subtitle="Across all categories" icon={BookOpen} colorClass="text-blue-500 border-blue-500/20" />
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
          <AccuracyChart data={accuracy_trends} />
        </motion.div>
        <motion.div variants={fadeUpVariant} className="min-w-0">
          <CategoryRadar data={category_radar} />
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
                <p className="text-text-main font-bold font-display text-sm mb-1">{insights?.weakest_category || 'Keep Playing'}</p>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-4">This is currently your weakest area based on your answer history. Running a targeted drill can help.</p>
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
                <p className="text-text-main font-bold font-display text-sm mb-1">{insights?.strongest_category || 'Keep Playing'}</p>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-4">You are consistently scoring highest in this category. You are effectively exam-ready for these topics.</p>
              </div>
              <Button variant="outline" size="sm" className="w-fit font-orbitron text-[10px] tracking-wider py-2 border-green-500/30 text-green-600 dark:text-green-400">View Concept Cards</Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

    </div>
  );
}