// src/pages/TopicDetail.tsx
import { motion, type Variants } from 'framer-motion';
import { Globe, ChevronLeft, Target, Cpu, Clock, History } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/dashboard/StatCard';
import { ConceptCard } from '../components/topics/ConceptCard';

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

// Mock Data for "Networking & Communication"
const TOPIC_DATA = {
  id: 'net',
  title: 'Networking & Communication',
  mastery: 45,
  questionsAnswered: 89,
  timeSpent: '04h 12m',
  concepts: [
    {
      title: "OSI Reference Model",
      summary: "The 7-layer theoretical framework used to understand and standardize network communication functions.",
      isMastered: true,
      keyPoints: [
        "Layer 1-3 (Physical, Data Link, Network) handle media and routing.",
        "Layer 4 (Transport) handles reliability (TCP/UDP).",
        "Layer 5-7 (Session, Presentation, Application) handle host-level data formatting and user interfaces."
      ]
    },
    {
      title: "IPv4 & Subnetting",
      summary: "The division of an IP network into multiple logical network segments for security and efficiency.",
      isMastered: false,
      keyPoints: [
        "A /24 CIDR mask equals 255.255.255.0 and provides 254 usable host addresses.",
        "The Network Address is the first IP in the range; the Broadcast Address is the last.",
        "Subnetting borrows bits from the host portion to create network subnets."
      ]
    },
    {
      title: "Routing Protocols",
      summary: "Algorithms used by routers to dynamically determine the most efficient path for data packets.",
      isMastered: false,
      keyPoints: [
        "Distance Vector (e.g., RIP) determines paths by hop count.",
        "Link-State (e.g., OSPF) maps the entire network topology for faster convergence.",
        "BGP is an exterior gateway protocol used to route traffic across the global internet."
      ]
    }
  ]
};

export default function TopicDetail() {
  const {  } = useParams(); // In production, use this to fetch actual topic data

  return (
    <div className="flex flex-col gap-8 sm:gap-10 w-full max-w-5xl mx-auto pb-24 px-1 sm:px-0 pt-4">
      
      {/* 1. NAVIGATION & HEADER */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        className="flex flex-col items-start justify-center"
      >
        <Link to="/learning" className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-orbitron text-xs font-bold uppercase tracking-widest mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Hub
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between w-full gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
              <Globe className="w-8 h-8 text-rose-500" />
            </div>
            <div>
              <Badge className="mb-2 bg-surface-2/60 backdrop-blur-sm text-text-muted border-borderline font-orbitron tracking-widest uppercase text-[10px] leading-none pt-1 pb-0.5">
                Category Detail
              </Badge>
              {/* FIX: leading-none pt-1 for typography alignment */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-main font-display tracking-tight leading-none pt-1">
                {TOPIC_DATA.title}
              </h1>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-initial font-orbitron text-[10px] tracking-widest border-accent/40 text-accent hover:bg-accent/10 leading-none pt-2.5 pb-2">
              <Cpu className="w-3.5 h-3.5 mr-2 -mt-0.5" /> AI Sandbox
            </Button>
            <Button variant="primary" className="flex-1 sm:flex-initial font-orbitron text-[10px] tracking-widest leading-none pt-2.5 pb-2 bg-rose-600 hover:bg-rose-700 text-white border-none shadow-[0_0_20px_rgba(225,29,72,0.3)]">
              <Target className="w-3.5 h-3.5 mr-2 -mt-0.5" /> Start Drill
            </Button>
          </div>
        </div>
      </motion.div>

      {/* 2. STATS ROW */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <motion.div variants={fadeUpVariant} className="h-full">
          <StatCard 
            title="Category Mastery" 
            value={`${TOPIC_DATA.mastery}%`}
            subtitle="Needs Improvement"
            icon={Target} 
            colorClass="text-rose-500 border-rose-500/30" 
          />
        </motion.div>
        <motion.div variants={fadeUpVariant} className="h-full">
          <StatCard 
            title="Items Cleared" 
            value={TOPIC_DATA.questionsAnswered} 
            subtitle="Across all sessions"
            icon={History} 
            colorClass="text-blue-500 border-blue-500/30" 
          />
        </motion.div>
        <motion.div variants={fadeUpVariant} className="h-full">
          <StatCard 
            title="Time Dedicated" 
            value={TOPIC_DATA.timeSpent} 
            subtitle="Active drilling time"
            icon={Clock} 
            colorClass="text-emerald-500 border-emerald-500/30" 
          />
        </motion.div>
      </motion.div>

      {/* 3. CONCEPT CARDS LIST */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="flex flex-col gap-4 mt-4"
      >
        <motion.div variants={fadeUpVariant}>
          <h2 className="text-xl font-display font-bold text-text-main mb-2">Core Concepts</h2>
          <p className="text-sm text-text-muted mb-4">Expand these cards for quick, high-yield syllabus reviews before starting a drill.</p>
        </motion.div>

        {TOPIC_DATA.concepts.map((concept, idx) => (
          <motion.div key={idx} variants={fadeUpVariant}>
            <ConceptCard {...concept} />
          </motion.div>
        ))}
      </motion.div>

    </div>
  );
}