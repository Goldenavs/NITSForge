// src/pages/QuizResults.tsx
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { Target, Trophy, Clock, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/dashboard/StatCard';
import { AISummaryCard } from '../components/quiz/AISummaryCard';
import { Card, CardContent } from '../components/ui/Card';
import { useQuizStore } from '../store/useQuizStore';
import { useState } from 'react';

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
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAllLogs, setShowAllLogs] = useState(false);

  // Pull our data from the Zustand state machine
  const { questions, score, xpEarned, selectedAnswers, resetQuiz, status, mode, timeSpent } = useQuizStore();

  // If a user navigates here directly without taking a quiz, bounce them back to the hub
  useEffect(() => {
    // Snap to the top of the screen when entering results
    window.scrollTo(0, 0);

    if (questions.length === 0 || status !== 'finished') {
      navigate('/quiz');
    }
  }, [questions, status, navigate]);

  if (questions.length === 0) return null; // Prevent flicker while redirecting

  // -------------------------
  // DYNAMIC METRICS CALCULATION
  // -------------------------
  const total = questions.length;
  const accuracy = Math.round((score / total) * 100) || 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const avgTimePerQuestion = total > 0 ? Math.round(timeSpent / total) : 0;

  const handleReturnToHub = () => {
    resetQuiz(); // Clear the store so it's fresh for the next session
    navigate('/quiz');
  };

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
          {mode === 'practice' ? (
            "Practice session complete. Your performance here is not permanently logged, so feel free to experiment!"
          ) : mode === 'sandbox' ? (
            "Sandbox configuration terminated. This isolated session has not been permanently logged."
          ) : mode === 'ai-generated' ? (
            "AI Sandbox terminated. These AI-generated questions provided an experimental challenge, but your stats here are purely for practice and remain unlogged."
          ) : (
            "Your performance data has been logged to the Forge servers. XP and streak multipliers have been applied."
          )}
        </p>
      </motion.div>

      {/* 2. CORE METRICS ROW */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className={`grid grid-cols-1 ${mode === 'practice' || mode === 'sandbox' || mode === 'ai-generated' ? 'sm:grid-cols-2' : 'sm:grid-cols-3'} gap-4`}
      >
        <motion.div variants={fadeUpVariant} className="h-full">
          <StatCard
            title="Accuracy"
            value={`${accuracy}%`}
            subtitle={`${score} / ${total} Correct`}
            icon={Target}
            colorClass="text-primary border-primary/30"
          />
        </motion.div>
        {/* Only show XP if not in practice/sandbox/ai mode */}
        {mode !== 'practice' && mode !== 'sandbox' && mode !== 'ai-generated' && (
          <motion.div variants={fadeUpVariant} className="h-full">
            <StatCard
              title="XP Earned"
              value={`+${xpEarned}`}
              subtitle="Includes completion bonus"
              icon={Trophy}
              colorClass="text-amber-500 border-amber-500/30"
            />
          </motion.div>
        )}
        <motion.div variants={fadeUpVariant} className="h-full">
          <StatCard
            title="Time Spent"
            value={formatTime(timeSpent)}
            subtitle={`Avg. ${avgTimePerQuestion}s per question`}
            icon={Clock}
            colorClass="text-blue-500 border-blue-500/30"
          />
        </motion.div>
      </motion.div>

      {/* 3. AI DEBRIEF (Remains unchanged/mocked for now) */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={fadeUpVariant}
      >
        <AISummaryCard />
      </motion.div>

      {/* 4. ACTION BUTTONS (Moved up) */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={fadeUpVariant}
        className="flex pt-4"
      >
        <Button
          variant="primary"
          onClick={handleReturnToHub}
          className="w-full font-orbitron tracking-widest py-4"
        >
          Return to Hub <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>

      {/* 5. DYNAMIC SESSION LOG */}
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
            {(showAllLogs ? questions : questions.slice(-3)).map((q) => {
              const userAnswer = selectedAnswers[q.id];
              const isCorrect = userAnswer === q.correct_answer;
              const isExpanded = expandedId === q.id;

              return (
                <div
                  key={q.id}
                  className={`border-b border-borderline/30 last:border-0 transition-colors cursor-pointer ${isExpanded ? 'bg-surface-2/40' : 'hover:bg-surface-2/20'}`}
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                >
                  <div className="flex items-start gap-4 p-4 sm:p-6">
                    <div className="mt-1 shrink-0">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-orbitron font-bold text-text-muted block">
                          {q.id}
                        </span>
                        {!isCorrect && userAnswer && (
                          <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">
                            Your Answer: {userAnswer}
                          </span>
                        )}
                        {isCorrect && (
                          <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded">
                            Correct
                          </span>
                        )}
                        {!userAnswer && (
                          <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                            Unanswered
                          </span>
                        )}
                      </div>
                      <p className={`text-sm font-body text-text-main ${!isExpanded && 'line-clamp-2'}`}>{q.text}</p>
                    </div>
                  </div>

                  {/* Expanded View for Reviewing */}
                  {isExpanded && (
                    <div className="px-4 sm:px-6 pb-6 pt-2 pl-14 animate-in slide-in-from-top-2 duration-300">
                      <div className="flex flex-col gap-2 mb-4">
                        {Object.entries(q.options).map(([key, value]) => {
                          const isUserChoice = key === userAnswer;
                          const isCorrectChoice = key === q.correct_answer;

                          let bgStyle = 'bg-surface border-borderline/50';
                          let textStyle = 'text-text-muted';

                          if (isCorrectChoice) {
                            bgStyle = 'bg-green-500/10 border-green-500/50';
                            textStyle = 'text-green-500 font-medium';
                          } else if (isUserChoice && !isCorrectChoice) {
                            bgStyle = 'bg-red-500/10 border-red-500/50';
                            textStyle = 'text-red-500 font-medium';
                          }

                          return (
                            <div key={key} className={`flex items-center p-3 rounded-lg border ${bgStyle}`}>
                              <span className={`font-orbitron font-bold w-6 shrink-0 ${textStyle}`}>{key}</span>
                              <span className={`text-sm ${textStyle}`}>{value}</span>
                              {isCorrectChoice && <CheckCircle2 className="w-4 h-4 ml-auto text-green-500 shrink-0" />}
                              {isUserChoice && !isCorrectChoice && <XCircle className="w-4 h-4 ml-auto text-red-500 shrink-0" />}
                            </div>
                          );
                        })}
                      </div>
                      <div className="p-4 rounded-xl bg-surface border border-borderline/50">
                        <span className="text-xs font-orbitron font-bold text-primary uppercase tracking-wider mb-2 block">Explanation</span>
                        <p className="text-sm text-text-main whitespace-pre-wrap">{q.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {!showAllLogs && questions.length > 3 && (
              <div className="p-4 flex justify-center bg-surface-2/20">
                <Button
                  variant="outline"
                  onClick={() => setShowAllLogs(true)}
                  className="font-orbitron text-xs tracking-widest text-text-muted hover:text-text-main border-borderline/50"
                >
                  Show All {questions.length} Questions
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

    </div>
  );
}