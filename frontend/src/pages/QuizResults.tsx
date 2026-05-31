// src/pages/QuizResults.tsx
import { motion, type Variants } from 'framer-motion';
import { Target, Trophy, Clock, ArrowRight, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/dashboard/StatCard';
import { AISummaryCard } from '../components/quiz/AISummaryCard';
import { Card, CardContent } from '../components/ui/Card';

// Framer Motion Orchestration
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 24 } }
};

const viewportConfig = { once: true, margin: "-50px" };

export default function QuizResults() {
  return (
    <div className="flex flex-col gap-8 sm:gap-10 w-full max-w-4xl mx-auto pb-24 px-1 sm:px-0 pt-4">
      
      {/* 1. HEADER SECTION */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        className="flex flex-col items-center justify-center text-center mt-4"
      >
        <Badge className="mb-4 bg-surface-2/60 backdrop-blur-sm text-text-muted border-borderline font-orbitron tracking-widest uppercase text-[10px]">
          Session Terminated
        </Badge>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-main font-display tracking-tight leading-none mb-4">
          Simulation <span className="text-primary">Complete.</span>
        </h1>
        <p className="text-sm sm:text-base text-text-muted max-w-lg leading-relaxed">
          Your performance data has been logged to the Forge servers. XP and streak multipliers have been applied.
        </p>
      </motion.div>

      {/* 2. CORE METRICS ROW */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <motion.div variants={fadeUpVariant} className="h-full">
          <StatCard 
            title="Accuracy" 
            value="80%" 
            subtitle="16 / 20 Correct"
            icon={Target} 
            colorClass="text-primary border-primary/30" 
          />
        </motion.div>
        <motion.div variants={fadeUpVariant} className="h-full">
          <StatCard 
            title="XP Earned" 
            value="+125" 
            subtitle="Includes streak bonus"
            icon={Trophy} 
            colorClass="text-amber-500 border-amber-500/30" 
          />
        </motion.div>
        <motion.div variants={fadeUpVariant} className="h-full">
          <StatCard 
            title="Time Spent" 
            value="14:22" 
            subtitle="Avg. 43s per question"
            icon={Clock} 
            colorClass="text-blue-500 border-blue-500/30" 
          />
        </motion.div>
      </motion.div>

      {/* 3. AI DEBRIEF */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={fadeUpVariant}
      >
        <AISummaryCard />
      </motion.div>

      {/* 4. QUICK REVIEW LOG */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={fadeUpVariant}
      >
        <Card className="bg-surface/85 backdrop-blur-sm border border-borderline/60 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-borderline/50 flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-text-main leading-none">Session Log</h3>
            <Link to="/history" className="text-xs font-orbitron text-primary hover:text-primary-dark transition-colors uppercase tracking-widest">
              View Full History →
            </Link>
          </div>
          <CardContent className="p-0">
            {/* Mock Log Items */}
            {[
              { id: 'Q1', text: 'Which scheduling algorithm prevents starvation?', correct: true },
              { id: 'Q2', text: 'In IPv4 addressing, which describes a Subnet Mask?', correct: false },
              { id: 'Q3', text: 'What is the primary key constraint in an RDBMS?', correct: true },
            ].map((q, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 sm:p-6 border-b border-borderline/30 last:border-0 hover:bg-surface-2/30 transition-colors">
                <div className="mt-1 shrink-0">
                  {q.correct ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-orbitron font-bold text-text-muted mb-1 block">{q.id}</span>
                  <p className="text-sm font-body text-text-main line-clamp-2">{q.text}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* 5. ACTION BUTTONS */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={fadeUpVariant}
        className="flex flex-col sm:flex-row gap-4 pt-4"
      >
        <Button variant="outline" className="flex-1 font-orbitron tracking-widest py-4 bg-surface/50 backdrop-blur-sm">
          <RotateCcw className="w-4 h-4 mr-2" /> Retry Missed
        </Button>
        <Link to="/quiz" className="flex-1 block">
          <Button variant="primary" className="w-full font-orbitron tracking-widest py-4">
            Return to Hub <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </motion.div>

    </div>
  );
}