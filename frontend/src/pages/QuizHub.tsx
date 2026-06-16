// src/pages/QuizHub.tsx
import { motion } from 'framer-motion';
import { 
  Target, Timer, Zap, BookOpen, RotateCcw, Sparkles, ChevronRight,
  Book, Layers, Calendar, Flame, Shield, Box
} from 'lucide-react';
import { QuizModeCard } from '../components/quiz/QuizModeCard';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Link, useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/useQuizStore';
import { useState } from 'react';
import { Button } from '../components/ui/Button';

// 1. Group Stagger Orchestrator
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

const viewportConfig = { once: true, margin: "-50px" };

const SectionHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <motion.div variants={fadeUpVariant} className="mb-6 mt-14">
    <h2 className="text-2xl font-bold text-text-main font-display">{title}</h2>
    <p className="text-sm text-text-muted mt-1">{subtitle}</p>
  </motion.div>
);

export default function QuizHub() {
  const { status, abandonQuiz, mode, startQuiz } = useQuizStore();
  const navigate = useNavigate();
  const [showActiveModal, setShowActiveModal] = useState(false);
  const [pendingQuiz, setPendingQuiz] = useState<{ mode: string, config?: any } | null>(null);

  const handleStartQuiz = (targetMode: string, config?: any) => {
    // If the mode is 'ai', we might want to navigate to the specialized /quiz/ai page
    // but the user wants to polish modes later. We will just use the standard session page 
    // for all standard modes, except the AI Sandbox link which has its own custom banner.
    
    if (status === 'in-progress') {
      // Auto-resume if clicking the same mode card
      if (targetMode === mode) {
        navigate(`/quiz/session?mode=${mode}`);
        return;
      }

      setPendingQuiz({ mode: targetMode, config });
      setShowActiveModal(true);
    } else {
      // Start immediately and navigate
      startQuiz(targetMode, config);
      navigate(`/quiz/session?mode=${targetMode}`);
    }
  };

  const handleAbandonAndContinue = () => {
    abandonQuiz();
    setShowActiveModal(false);
    if (pendingQuiz) {
      startQuiz(pendingQuiz.mode, pendingQuiz.config);
      navigate(`/quiz/session?mode=${pendingQuiz.mode}`);
    }
  };

  const handleResume = () => {
    setShowActiveModal(false);
    navigate(`/quiz/session?mode=${mode}`);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto pb-24 px-1 sm:px-0 pt-4">
      
      {/* HEADER SECTION */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        className="flex flex-col items-start justify-center"
      >
        <Badge className="mb-3 bg-surface-2/60 backdrop-blur-sm text-text-muted border-borderline font-orbitron tracking-widest uppercase text-[10px]">
          Training Modules
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-main font-display tracking-tight leading-none pt-1 mb-3">
          Select <span className="text-primary">Simulation.</span>
        </h1>
        <p className="text-sm sm:text-base text-text-muted max-w-2xl leading-relaxed">
          Choose your protocol. Stick to the curated, fact-based PhilNITS syllabus, or venture into the AI-generated sandbox for limitless variations.
        </p>
      </motion.div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" viewport={viewportConfig}>
        
        {/* CATEGORY 1: LEARNING */}
        <SectionHeader 
          title="Learning Area" 
          subtitle="Explore questions at your own pace without the pressure of timers or stats." 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          <motion.div variants={fadeUpVariant} className="h-full">
            <QuizModeCard 
              title="Review Mode"
              description="A zen-like sandbox with infinite questions. No progress bar, no stats, just pure learning. Exit anytime."
              icon={Book}
              tags={['Infinite', 'Zen Mode', 'AI Assist']}
              colorClass="text-emerald-500 border-emerald-500/30"
              configType="none"
              onStart={() => handleStartQuiz('review')}
              actionText="Enter Zen Mode"
            />
          </motion.div>
          <motion.div variants={fadeUpVariant} className="h-full">
            <QuizModeCard 
              title="Practice Mode"
              description="Master the facts. Explanations are revealed instantly, and the Forge AI is available for guidance."
              icon={Target}
              tags={['Untimed', 'AI Assist']}
              colorClass="text-primary border-primary/30"
              isPopular={true}
              configType="count"
              onStart={(config) => handleStartQuiz('practice', config)}
            />
          </motion.div>
        </div>

        {/* CATEGORY 2: ASSESSMENT */}
        <SectionHeader 
          title="Assessment Center" 
          subtitle="Evaluate your knowledge with focused constraints and analytics." 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          <motion.div variants={fadeUpVariant} className="h-full">
            <QuizModeCard 
              title="Quick Quiz"
              description="Short on time? Run a rapid-fire sequence of randomized questions across all 11 topics."
              icon={Zap}
              tags={['Standard Timer', 'Randomized']}
              colorClass="text-blue-500 border-blue-500/30"
              configType="count"
              onStart={(config) => handleStartQuiz('quick', config)}
            />
          </motion.div>
          <motion.div variants={fadeUpVariant} className="h-full">
            <QuizModeCard 
              title="Topic Drill"
              description="Focus your training on specific syllabus categories. Target your weakest areas identified in the Dashboard."
              icon={Layers}
              tags={['Targeted', '30 Items']}
              colorClass="text-amber-500 border-amber-500/30"
              configType="topic"
              onStart={(config) => handleStartQuiz('topic', config)}
              actionText="Select Topics & Start"
            />
          </motion.div>
          <motion.div variants={fadeUpVariant} className="h-full">
            <QuizModeCard 
              title="Date Mode"
              description="Filter the assessment by specific past PhilNITS exam dates."
              icon={Calendar}
              tags={['Historical', '30 Items']}
              colorClass="text-indigo-500 border-indigo-500/30"
              configType="date"
              onStart={(config) => handleStartQuiz('date', config)}
              actionText="Select Dates & Start"
            />
          </motion.div>
          <motion.div variants={fadeUpVariant} className="h-full">
            <QuizModeCard 
              title="Missed Questions"
              description="Redeem your past mistakes. A spaced repetition session built entirely from questions you previously answered incorrectly."
              icon={RotateCcw}
              tags={['Adaptive', 'Spaced Repetition']}
              colorClass="text-rose-400 border-rose-400/30"
              configType="none"
              onStart={() => handleStartQuiz('missed')}
              actionText="Redeem Mistakes"
            />
          </motion.div>
        </div>

        {/* CATEGORY 3: CHALLENGE */}
        <SectionHeader 
          title="Challenge Arena" 
          subtitle="High pressure, high stakes. Push your limits." 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          <motion.div variants={fadeUpVariant} className="h-full">
            <QuizModeCard 
              title="Exam Simulation"
              description="The ultimate test. 100 questions, 150 minutes. No AI, no abandon option. Mirrors the actual PhilNITS FE AM section."
              icon={Timer}
              tags={['150 Mins', '100 Items', 'Strict']}
              colorClass="text-red-600 border-red-600/40"
              configType="none"
              onStart={() => handleStartQuiz('simulation')}
              actionText="Begin Exam"
            />
          </motion.div>
          <motion.div variants={fadeUpVariant} className="h-full">
            <QuizModeCard 
              title="Speed Mode"
              description="Time is tight. 30 seconds per question. Think fast, act faster."
              icon={Flame}
              tags={['Aggressive Timer']}
              colorClass="text-orange-500 border-orange-500/30"
              configType="count"
              onStart={(config) => handleStartQuiz('speed', config)}
            />
          </motion.div>
          <motion.div variants={fadeUpVariant} className="h-full">
            <QuizModeCard 
              title="Survival Mode"
              description="You have exactly 3 lives. One wrong answer costs a life. How far can you go?"
              icon={Shield}
              tags={['3 Lives', 'Sudden Death']}
              colorClass="text-purple-500 border-purple-500/30"
              configType="none"
              onStart={() => handleStartQuiz('survival')}
              actionText="Enter Arena"
            />
          </motion.div>
        </div>

        {/* CATEGORY 4: SANDBOX */}
        <SectionHeader 
          title="Sandbox" 
          subtitle="Customize every parameter or let the AI take the wheel." 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          <motion.div variants={fadeUpVariant} className="h-full">
            <QuizModeCard 
              title="Sandbox Mode"
              description="Create your own custom quiz rules. Adjust length, timers, and topics. Does not affect stats."
              icon={Box}
              tags={['Customizable', 'No Stats']}
              colorClass="text-cyan-500 border-cyan-500/30"
              configType="count"
              onStart={(config) => handleStartQuiz('sandbox', config)}
              actionText="Launch Sandbox"
            />
          </motion.div>
          
          <motion.div variants={fadeUpVariant} className="h-full lg:col-span-2">
            <Link 
              to="/quiz/ai" 
              className="block group h-full"
              onClick={(e) => {
                if (status === 'in-progress') {
                  e.preventDefault();
                  setPendingQuiz({ mode: 'ai-generated' });
                  setShowActiveModal(true);
                }
              }}
            >
              <Card className="relative h-full overflow-hidden bg-surface/85 backdrop-blur-md border border-accent/40 group-hover:border-accent transition-colors duration-500 shadow-lg flex flex-col justify-center">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary via-accent to-primary background-animate" />
                
                <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
                  <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-12">
                    <Sparkles className="w-7 h-7 text-accent" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display font-bold text-xl sm:text-2xl text-text-main group-hover:text-accent transition-colors pt-1 leading-none">
                        AI-Generated Mode
                      </h3>
                      <Badge className="bg-accent/20 text-accent border-accent/30 font-orbitron tracking-widest text-[9px] uppercase">Experimental</Badge>
                    </div>
                    <p className="text-sm sm:text-base text-text-muted leading-relaxed max-w-3xl">
                      Deploy Gemini 1.5 Flash to synthesize novel practice scenarios on demand. Select any topic and difficulty. 
                      <span className="block mt-1 text-xs opacity-70 italic">Note: These are AI-generated supplemental questions and do not affect your official accuracy stats.</span>
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center justify-center w-full md:w-auto mt-4 md:mt-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-2 border border-borderline group-hover:bg-accent group-hover:text-surface transition-colors duration-300">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
                
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-accent opacity-[0.04] blur-2xl pointer-events-none group-hover:opacity-[0.08] transition-opacity duration-700" />
              </Card>
            </Link>
          </motion.div>
        </div>

      </motion.div>

      {/* Active Session Modal */}
      {showActiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-background/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-borderline p-6 rounded-xl shadow-2xl max-w-sm w-full"
          >
            <h3 className="text-xl font-bold text-text-main font-display mb-2">Active Quiz Detected</h3>
            <p className="text-sm text-text-muted mb-6 leading-relaxed">
              You currently have an active <strong className="text-primary capitalize">{mode}</strong> session in progress. What would you like to do?
            </p>
            <div className="flex flex-col gap-3">
              <Button variant="primary" onClick={handleResume} className="w-full justify-center">
                Resume Active Quiz
              </Button>
              <Button variant="outline" className="w-full text-red-500 hover:bg-red-500 hover:text-white border-red-500/30" onClick={handleAbandonAndContinue}>
                Discard & Start New
              </Button>
            </div>
            <div className="mt-4 text-center">
              <button className="text-xs text-text-muted hover:text-text-main" onClick={() => setShowActiveModal(false)}>
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}