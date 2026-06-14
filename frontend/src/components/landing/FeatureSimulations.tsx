import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Trophy } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { useLeaderboard } from '../../hooks/useLeaderboard';

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const CrossIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

// --- 1. Mock Exam Simulation ---
const MOCK_QUESTIONS = [
  {
    q: "Which of the following is the time complexity of a binary search algorithm in the worst case?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
    answer: 2
  },
  {
    q: "In Object-Oriented Programming, what concept restricts direct access to some of an object's components?",
    options: ["Polymorphism", "Inheritance", "Encapsulation", "Abstraction"],
    answer: 2
  },
  {
    q: "Which protocol is used to securely transfer files over the internet?",
    options: ["HTTP", "SFTP", "SMTP", "SNMP"],
    answer: 1
  }
];

export function MockExamSimulation() {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const question = MOCK_QUESTIONS[qIndex];

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        setQIndex((prev) => (prev + 1) % MOCK_QUESTIONS.length);
        setSelected(null);
        setIsSubmitted(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  return (
    <div className="flex-1 w-full flex flex-col bg-surface rounded-xl p-4 shadow-inner border border-borderline/50 relative overflow-hidden">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Mock Question</span>
        <span className="text-xs font-orbitron text-primary">{qIndex + 1}/{MOCK_QUESTIONS.length}</span>
      </div>

      <p className="text-sm text-text-main mb-4 font-medium leading-relaxed">{question.q}</p>

      <div className="flex-1 space-y-2 mb-4">
        {question.options.map((opt, i) => {
          let stateClass = "border-borderline/50 hover:border-primary/50 text-text-muted";
          if (selected === i && !isSubmitted) stateClass = "border-primary bg-primary/10 text-primary";
          if (isSubmitted && i === question.answer) stateClass = "border-green-500 bg-green-500/10 text-green-500";
          if (isSubmitted && selected === i && i !== question.answer) stateClass = "border-red-500 bg-red-500/10 text-red-500";

          return (
            <button
              key={i}
              onClick={() => !isSubmitted && setSelected(i)}
              disabled={isSubmitted}
              className={`w-full text-left px-3 py-2 text-xs rounded-lg border transition-all duration-200 ${stateClass}`}
            >
              <div className="flex justify-between items-center gap-2">
                <span>{opt}</span>
                {isSubmitted && i === question.answer && <CheckIcon className="w-4 h-4 text-green-500 shrink-0" />}
                {isSubmitted && selected === i && i !== question.answer && <CrossIcon className="w-4 h-4 text-red-500 shrink-0" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-auto">
        <button
          onClick={() => setIsSubmitted(true)}
          disabled={selected === null || isSubmitted}
          className={`w-full py-2 font-bold text-xs rounded-lg transition-all duration-300 ${isSubmitted ? 'bg-surface-2 text-text-muted cursor-not-allowed' : 'bg-primary text-background hover:bg-accent disabled:opacity-50'}`}
        >
          {isSubmitted ? 'Cool! Try more...' : 'Submit Answer'}
        </button>
      </div>
    </div>
  );
}

// --- 2. Deep Analytics Simulation ---
const INITIAL_RADAR_FIXED = [
  { subject: 'Hardware', A: 40, fullMark: 100 },
  { subject: 'Software', A: 70, fullMark: 100 },
  { subject: 'Math', A: 50, fullMark: 100 },
  { subject: 'Network', A: 30, fullMark: 100 },
  { subject: 'Security', A: 85, fullMark: 100 },
  { subject: 'Strategy', A: 60, fullMark: 100 },
];

export function DeepAnalyticsSimulation() {
  const [data, setData] = useState(INITIAL_RADAR_FIXED);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => prev.map(item => ({
        ...item,
        A: Math.max(10, Math.min(100, item.A + (Math.random() * 80 - 40)))
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 w-full flex items-center justify-center bg-surface rounded-xl p-2 shadow-inner border border-borderline/50 min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="60%" data={data}>
          <PolarGrid stroke="var(--color-borderline)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} />
          <Radar name="Mastery" dataKey="A" stroke="var(--color-accent)" fill="var(--color-primary)" fillOpacity={0.4} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

// --- 3. Forge AI Simulation ---
const SCRIPT = [
  { sender: 'ai', text: "Hello! I'm Forge, your AI companion. How can I help you prepare?", delay: 1000 },
  { sender: 'user', text: "When is the next PhilNITS FE exam?", delay: 3500 },
  { sender: 'ai', text: "The FE exam is typically held twice a year, in April and October. Are you studying for the next one?", delay: 6500 },
  { sender: 'user', text: "Yes, but I'm struggling with Algorithms.", delay: 9500 },
  { sender: 'ai', text: "I can help with that! Let's start by breaking down Binary Search. Ready?", delay: 12500 }
];

export function ForgeAISimulation() {
  const [messages, setMessages] = useState<{ sender: string, text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    let timeouts: ReturnType<typeof setTimeout>[] = [];

    const runScript = () => {
      setMessages([]);
      setIsTyping(false);

      SCRIPT.forEach((msg) => {
        // Show typing indicator 1.5s before AI messages
        if (msg.sender === 'ai') {
          timeouts.push(setTimeout(() => setIsTyping(true), msg.delay - 1500));
        }

        // Show typing indicator 1s before user messages (simulating user typing)
        if (msg.sender === 'user') {
          // We won't show the visual typing indicator for the user, but we could. 
          // Let's just append the message directly for the user.
        }

        timeouts.push(setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, { sender: msg.sender, text: msg.text }]);
        }, msg.delay));
      });

      // Loop after script finishes
      timeouts.push(setTimeout(() => {
        runScript();
      }, SCRIPT[SCRIPT.length - 1].delay + 5000));
    };

    runScript();

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col bg-surface rounded-xl shadow-inner border border-borderline/50 overflow-hidden relative group">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-borderline/50 bg-surface-2/50 backdrop-blur-md">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-lg">
            <Bot className="w-4 h-4" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-surface rounded-full">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
          </div>
        </div>
        <div>
          <h4 className="text-xs font-bold text-text-main leading-none">Forge AI</h4>
          <span className="text-[10px] text-primary font-medium">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`flex gap-3 max-w-[90%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center shadow-md ${msg.sender === 'user' ? 'bg-surface-2 border border-borderline' : 'bg-primary text-white'}`}>
                {msg.sender === 'user' ? <User className="w-3 h-3 text-text-muted" /> : <Bot className="w-3 h-3" />}
              </div>
              <div className={`px-3 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${msg.sender === 'user'
                ? 'bg-surface-2 border border-borderline text-text-main rounded-tr-sm'
                : 'bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-text-main rounded-tl-sm'
                }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex gap-3 max-w-[90%]"
            >
              <div className="w-6 h-6 shrink-0 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                <Bot className="w-3 h-3" />
              </div>
              <div className="px-3 py-3 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-tl-sm flex items-center gap-1.5 shadow-sm">
                <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Gradient fade at bottom to hide scrolling cutoffs */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
    </div>
  );
}

// --- 4. Gamified Learning Simulation ---
export function GamifiedLearningSimulation() {
  const { data, isLoading } = useLeaderboard('all-time');

  if (isLoading) {
    return <div className="w-full h-full flex items-center justify-center bg-surface rounded-xl border border-borderline/50"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  // Use top 3 from DB, fallback to mocks if empty
  const topUsers = data?.slice(0, 3).length === 3 ? data.slice(0, 3) : [
    { display_name: "Alice", total_xp: 15400 },
    { display_name: "Bob", total_xp: 14200 },
    { display_name: "Charlie", total_xp: 13900 }
  ];

  return (
    <div className="flex-1 w-full flex flex-col bg-surface rounded-xl p-4 shadow-inner border border-borderline/50 min-h-[250px]">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Top Forgers</span>
      </div>

      <div className="flex-1 flex items-end justify-center gap-2 px-4 pb-2">
        {/* 2nd Place */}
        <div className="flex flex-col items-center w-1/3 z-10">
          <div className="text-[10px] text-text-muted mb-1 truncate w-full text-center">{topUsers[1]?.display_name}</div>
          <div className="w-full bg-surface-2 rounded-t-md border border-borderline border-b-0 h-16 flex items-center justify-center text-xs font-orbitron font-bold text-text-muted">
            2
          </div>
        </div>
        {/* 1st Place */}
        <div className="flex flex-col items-center w-1/3 z-20">
          <Trophy className="w-5 h-5 text-amber-500 mb-1" />
          <div className="text-[10px] text-primary font-bold mb-1 truncate w-full text-center">{topUsers[0]?.display_name}</div>
          <div className="w-full bg-primary/20 rounded-t-md border border-primary/40 border-b-0 h-24 flex items-center justify-center text-sm font-orbitron font-bold text-primary">
            1
          </div>
        </div>
        {/* 3rd Place */}
        <div className="flex flex-col items-center w-1/3 z-10">
          <div className="text-[10px] text-text-muted mb-1 truncate w-full text-center">{topUsers[2]?.display_name}</div>
          <div className="w-full bg-surface-2 rounded-t-md border border-borderline border-b-0 h-12 flex items-center justify-center text-xs font-orbitron font-bold text-text-muted">
            3
          </div>
        </div>
      </div>
    </div>
  );
}
