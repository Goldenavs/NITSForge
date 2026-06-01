import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const AboutHero: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-3xl mx-auto mb-16 relative"
    >
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--color-primary)] opacity-10 rounded-full blur-[80px] pointer-events-none"></div>
      
      <motion.div 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, type: "spring" }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-primary)] text-sm font-bold mb-6"
      >
        <Sparkles className="w-4 h-4" />
        <span>Powered by Google Gemini</span>
      </motion.div>
      
      <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--color-text-primary)] font-display tracking-tight mb-6">
        Forge your path to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]">FE.</span>
      </h1>
      
      <p className="text-lg md:text-xl text-[var(--color-text-muted)] leading-relaxed">
        NITSForge is a full-featured, AI-powered reviewer designed to help Filipino IT students prepare for the Philippine National IT Standards (PhilNITS) Fundamental IT Engineer Examination.
      </p>
    </motion.div>
  );
};