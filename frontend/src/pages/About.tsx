import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Trophy, Code } from 'lucide-react';
import { AboutHero } from '../components/about/AboutHero';
import { PillarCard } from '../components/about/PillarCard';

export const AboutPage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      exit={{ opacity: 0 }}
      variants={containerVariants}
      className="max-w-6xl mx-auto px-4 py-8 pb-20"
    >
      <AboutHero />

      {/* The Three Pillars Section */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <PillarCard 
          icon={<ShieldCheck className="w-8 h-8" />}
          title="Accuracy-First Bank"
          description="A curated, fact-based question bank aligned to the official JITEC syllabus. The AI never serves as the source of truth for exam content."
        />
        <PillarCard 
          icon={<Cpu className="w-8 h-8" />}
          title="AI-Enhanced Study"
          description="Powered entirely by Google Gemini. Use Flash for rapid concept explanations and Pro for your conversational study companion, Forge."
        />
        <PillarCard 
          icon={<Trophy className="w-8 h-8" />}
          title="Gamified Progression"
          description="Turn studying into an engaging loop. Earn XP, maintain streaks, unlock badges, and compete with classmates on the leaderboard."
        />
      </motion.div>

      {/* Team / Creator Section */}
      <motion.div 
        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
        className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-sm"
      >
        <div className="bg-[var(--color-surface-2)] px-8 py-6 border-b border-[var(--color-border)]">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">The Team Behind the Forge</h2>
          <p className="text-[var(--color-text-muted)] mt-1">Built with passion at Cebu Institute of Technology - University (CIT-U).</p>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wider mb-4">Project Lead</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white text-xl font-bold shadow-md">
                JN
              </div>
              <div>
                <h4 className="text-lg font-bold text-[var(--color-text-primary)]">John Michael A. Nave</h4>
                <p className="text-[var(--color-text-muted)] text-sm">Project Manager & Full-Stack Developer</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wider mb-4">Team D4rkbyte</h3>
            <ul className="space-y-3">
              {[
                "James Andrew S. Ologuin", 
                "John Zachary N. Gillana", 
                "John Peter D. Pestaño", 
                "Jordan A. Cabandon"
              ].map((member, index) => (
                <li key={index} className="flex items-center gap-3 text-[var(--color-text-primary)] font-medium">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-border)]"></div>
                  {member}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="bg-[var(--color-surface-2)] px-8 py-4 flex justify-between items-center border-t border-[var(--color-border)]">
          <span className="text-sm text-[var(--color-text-muted)] font-medium">Version 1.0.0</span>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors"
          >
            <Code className="w-5 h-5" />
            View Source
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AboutPage;