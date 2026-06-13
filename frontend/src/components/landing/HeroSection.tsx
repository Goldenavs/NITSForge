// src/components/landing/HeroSection.tsx
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export function HeroSection() {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-[90vh] flex flex-col justify-center px-6 lg:px-16 py-20 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary opacity-5 blur-[120px] pointer-events-none rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl z-10"
      >
        <div className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-orbitron text-xs font-bold tracking-wider mb-6">
          V2.0 Core Engine Active
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight tracking-tighter mb-6 text-text-main">
          Master the PhilNITS FE.<br />
          <span className="text-primary italic pr-2">Without the burnout.</span>
        </h1>
        
        <p className="text-lg text-text-muted max-w-xl mb-10 leading-relaxed">
          The most advanced, AI-driven preparation platform for the Philippine National IT Standards exam. Practice intelligently, track your mastery, and let Forge guide your learning.
        </p>

        {/* Placeholder for Hand-drawn Banner */}
        <div className="relative w-full aspect-[21/9] md:aspect-[3/1] bg-surface-2 border-2 border-dashed border-borderline rounded-2xl flex items-center justify-center mb-12 group overflow-hidden">
          <div className="text-center">
            <p className="text-text-muted font-orbitron font-bold tracking-widest text-sm mb-2 group-hover:text-primary transition-colors">
              [ HAND-DRAWN BANNER PLACEHOLDER ]
            </p>
            <p className="text-xs text-text-muted opacity-60">
              Recommended Size: 1200x400 px or 1920x1080 px
            </p>
          </div>
        </div>

        <button 
          onClick={() => scrollTo('features')}
          className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors animate-bounce"
        >
          <span className="text-sm font-medium uppercase tracking-widest">Scroll to explore</span>
          <ArrowDown className="w-4 h-4" />
        </button>
      </motion.div>
    </section>
  );
}
