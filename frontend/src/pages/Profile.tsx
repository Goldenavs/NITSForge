// src/pages/Profile.tsx
import { motion, type Variants } from 'framer-motion';
import { User, Flame, Zap, Trophy, Edit3, MapPin, Code2, Users, Shield, Target, Award } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
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

// Deep Mock Data
const MOCK_PROFILE = {
  name: "John Michael A. Nave",
  title: "Frontend Developer",
  institution: "CIT-U",
  level: 42,
  xp: 21840,
  nextLevelXp: 25000,
  streak: 21,
  rank: 3,
  division: "Specialist Division",
  squad: "Team D4rkbyte",
  squadMembers: [
    { name: "James Andrew S. Ologuin", role: "Backend Architect" },
    { name: "John Zachary N. Gillana", role: "Systems Engineer" },
    { name: "John Peter D. Pestaño", role: "Security Lead" },
    { name: "Jordan A. Cabandon", role: "QA/DevOps" }
  ],
  badges: [
    { id: 'b1', name: 'First Blood', desc: 'Completed first drill session.', icon: Target, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
    { id: 'b2', name: 'Sharpshooter', desc: 'Achieved 100% accuracy in a 15-item quiz.', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    { id: 'b3', name: 'Night Owl', desc: 'Completed a Daily Challenge past midnight.', icon: Flame, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
    { id: 'b4', name: 'Ironclad', desc: 'Maintained a 14-day study streak.', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  ]
};

export default function Profile() {
  const xpProgress = (MOCK_PROFILE.xp / MOCK_PROFILE.nextLevelXp) * 100;

  return (
    <div className="flex flex-col gap-8 sm:gap-10 w-full max-w-5xl mx-auto pb-24 px-1 sm:px-0 pt-4">
      
      {/* 1. PLAYER CARD HEADER */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
      >
        <Card className="relative overflow-hidden bg-surface/85 backdrop-blur-md border border-borderline/60 shadow-lg">
          {/* Ambient Header Glow */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/20 via-accent/10 to-transparent opacity-50" />
          
          <CardContent className="p-6 sm:p-10 relative z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8">
              
              {/* Avatar Frame */}
              <div className="relative group">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-2 border-primary bg-surface-2 flex items-center justify-center shadow-[0_0_30px_rgba(var(--color-primary),0.2)] overflow-hidden">
                  <User className="w-12 h-12 text-primary opacity-50" />
                </div>
                <button className="absolute -bottom-3 -right-3 w-10 h-10 rounded-xl bg-surface border border-borderline text-text-muted hover:text-primary hover:border-primary transition-colors flex items-center justify-center shadow-lg">
                  <Edit3 className="w-4 h-4" />
                </button>
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-surface border-none font-orbitron text-[10px] tracking-widest uppercase px-3 py-1 shadow-md leading-none pt-1.5 pb-1">
                  Lvl {MOCK_PROFILE.level}
                </Badge>
              </div>

              {/* Player Info */}
              <div className="flex flex-col items-center sm:items-start flex-1 text-center sm:text-left mt-4 sm:mt-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl sm:text-4xl font-display font-bold text-text-main leading-none pt-1">
                    {MOCK_PROFILE.name}
                  </h1>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 mb-4">
                  <span className="flex items-center text-xs sm:text-sm text-text-muted font-body">
                    <Code2 className="w-4 h-4 mr-1.5 opacity-70" /> {MOCK_PROFILE.title}
                  </span>
                  <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-borderline" />
                  <span className="flex items-center text-xs sm:text-sm text-text-muted font-body">
                    <MapPin className="w-4 h-4 mr-1.5 opacity-70" /> {MOCK_PROFILE.institution}
                  </span>
                </div>
                
                {/* XP Progress Bar */}
                <div className="w-full max-w-md">
                  <div className="flex justify-between text-[10px] font-orbitron font-bold text-text-muted uppercase tracking-widest mb-2 leading-none pt-0.5">
                    <span>{MOCK_PROFILE.xp.toLocaleString()} XP</span>
                    <span>{MOCK_PROFILE.nextLevelXp.toLocaleString()} XP</span>
                  </div>
                  <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${xpProgress}%` }}
                      transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    />
                  </div>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 2. CORE STATS ROW */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={fadeUpVariant}>
          <Card className="bg-surface/85 backdrop-blur-md border border-borderline/60 p-5 flex flex-col items-center sm:items-start hover:border-primary/40 transition-colors">
            <Trophy className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-orbitron font-bold text-2xl text-text-main leading-none pt-1 mb-1">Rank #{MOCK_PROFILE.rank}</h3>
            <p className="text-[10px] font-orbitron text-text-muted uppercase tracking-widest font-bold leading-none pt-0.5">{MOCK_PROFILE.division}</p>
          </Card>
        </motion.div>
        <motion.div variants={fadeUpVariant}>
          <Card className="bg-surface/85 backdrop-blur-md border border-borderline/60 p-5 flex flex-col items-center sm:items-start hover:border-orange-500/40 transition-colors">
            <Flame className="w-6 h-6 text-orange-500 mb-3" />
            <h3 className="font-orbitron font-bold text-2xl text-text-main leading-none pt-1 mb-1">{MOCK_PROFILE.streak} Days</h3>
            <p className="text-[10px] font-orbitron text-text-muted uppercase tracking-widest font-bold leading-none pt-0.5">Active Streak</p>
          </Card>
        </motion.div>
        <motion.div variants={fadeUpVariant}>
          <Card className="bg-surface/85 backdrop-blur-md border border-borderline/60 p-5 flex flex-col items-center sm:items-start hover:border-accent/40 transition-colors">
            <Target className="w-6 h-6 text-accent mb-3" />
            <h3 className="font-orbitron font-bold text-2xl text-text-main leading-none pt-1 mb-1">78%</h3>
            <p className="text-[10px] font-orbitron text-text-muted uppercase tracking-widest font-bold leading-none pt-0.5">Global Accuracy</p>
          </Card>
        </motion.div>
        <motion.div variants={fadeUpVariant}>
          <Card className="bg-surface/85 backdrop-blur-md border border-borderline/60 p-5 flex flex-col items-center sm:items-start hover:border-emerald-500/40 transition-colors">
            <Award className="w-6 h-6 text-emerald-500 mb-3" />
            <h3 className="font-orbitron font-bold text-2xl text-text-main leading-none pt-1 mb-1">{MOCK_PROFILE.badges.length}</h3>
            <p className="text-[10px] font-orbitron text-text-muted uppercase tracking-widest font-bold leading-none pt-0.5">Badges Earned</p>
          </Card>
        </motion.div>
      </motion.div>

      {/* 3. SPLIT CONTENT: BADGES & SQUAD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Achievements / Badges */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center justify-between border-b border-borderline/50 pb-2 mb-2">
            <h2 className="text-xl font-display font-bold text-text-main leading-none pt-1">Achievements</h2>
            <Button variant="ghost" size="sm" className="font-orbitron text-[10px] uppercase tracking-widest text-primary hover:bg-primary/10 leading-none pt-2.5 pb-2">
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MOCK_PROFILE.badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <motion.div key={badge.id} variants={fadeUpVariant}>
                  <Card className={`h-full p-4 bg-surface/60 backdrop-blur-sm border ${badge.border} flex items-start gap-4 hover:bg-surface transition-colors group`}>
                    <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${badge.bg}`}>
                      <Icon className={`w-5 h-5 ${badge.color} transition-transform duration-300 group-hover:scale-110`} />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-text-main leading-none pt-1 mb-1.5">{badge.name}</h4>
                      <p className="text-[10px] font-body text-text-muted leading-relaxed pr-2">{badge.desc}</p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Squad / Team Segment */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center justify-between border-b border-borderline/50 pb-2 mb-2">
            <h2 className="text-xl font-display font-bold text-text-main leading-none pt-1 flex items-center gap-2">
              <Users className="w-5 h-5 text-text-muted" /> Active Squad
            </h2>
            <Badge className="bg-primary/10 text-primary border-primary/30 font-orbitron text-[9px] uppercase tracking-widest leading-none pt-1.5 pb-1">
              {MOCK_PROFILE.squad}
            </Badge>
          </div>

          <div className="flex flex-col gap-3">
            {MOCK_PROFILE.squadMembers.map((member, idx) => (
              <motion.div key={idx} variants={fadeUpVariant}>
                <Card className="p-3 sm:p-4 bg-surface/60 backdrop-blur-sm border border-borderline/60 flex items-center justify-between hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-2 border border-borderline flex items-center justify-center font-display font-bold text-text-muted leading-none pt-1">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-text-main leading-none pt-1 mb-1">{member.name}</h4>
                      <p className="text-[10px] font-orbitron text-text-muted uppercase tracking-widest font-bold leading-none pt-0.5">{member.role}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="hidden sm:flex font-orbitron text-[9px] uppercase tracking-widest text-text-muted hover:text-primary leading-none pt-2 pb-1.5">
                    View Profile
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}