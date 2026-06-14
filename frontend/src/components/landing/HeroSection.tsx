// src/components/landing/HeroSection.tsx
import { useState, useEffect, useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useTheme } from '../../store/ThemeContext';

// Added HackerText for the glitch effect on the name
const HackerText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState(text);
  const ref = useRef(null);

  // Trigger only once when it comes into view to prevent annoying re-triggers
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) {
      setDisplayText(text);
      return;
    }

    let iteration = 0;
    // Use lowercase and numbers to minimize character width variance
    const letters = "abcdefghijklmnopqrstuvwxyz0123456789";

    // Dynamically calculate speed so it always finishes in ~600ms (20 steps @ 30ms)
    const stepSize = Math.max(1, text.length / 100);

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            // Preserve the actual character if we've iterated past it
            if (index < iteration) return text[index];
            // CRITICAL: Preserve spaces so word wrapping doesn't break and cause bouncing!
            if (char === " ") return " ";
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("")
      );

      if (iteration >= text.length) clearInterval(interval);
      iteration += stepSize;
    }, 30);

    return () => clearInterval(interval);
  }, [isInView, text]);

  return (
    <span ref={ref}>
      {displayText}
    </span>
  );
};

export function HeroSection() {
  const { theme, setTheme } = useTheme();
  const isDarkTheme = ['midnight', 'forest', 'obsidian'].includes(theme);
  const bannerSrc = isDarkTheme ? '/NITSForge-landinghero-light.png' : '/NITSForge-landinghero-dark.png';

  const THEMES = [
    // Light Themes
    { id: 'ember', primary: '#F97316', bg: '#F9F7F4' },
    { id: 'sakura', primary: '#DB2777', bg: '#FFF1F2' },
    { id: 'arctic', primary: '#0EA5E9', bg: '#F0F9FF' },
    // Dark Themes
    { id: 'midnight', primary: '#3B82F6', bg: '#0F172A' },
    { id: 'forest', primary: '#22C55E', bg: '#1C1917' },
    { id: 'obsidian', primary: '#F59E0B', bg: '#000000' },
  ] as const;

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const bannerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20, delay: 0.2 } }
  };

  return (
    <section id="hero" className="relative min-h-[90vh] flex flex-col justify-center items-center px-6 lg:px-16 py-20 overflow-hidden text-center">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary opacity-5 blur-[120px] pointer-events-none rounded-full" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-100px" }}
        variants={containerVariants}
        className="max-w-5xl z-10 flex flex-col items-center"
      >
        <motion.div variants={itemVariants} className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-orbitron text-xs font-bold tracking-wider mb-6">
          V0.1 Pre-Alpha
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-4xl lg:text-7xl font-display font-bold leading-tight tracking-tighter mb-6 text-text-main">
          Master the PhilNITS Exams.
          <br />
          <span className="text-primary italic">Without the burnout.</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-lg text-text-muted max-w-xl mb-12 leading-relaxed h-[160px] sm:h-[120px] lg:h-[90px]">
          <HackerText text="The most advanced, AI-driven preparation platform for the Philippine National IT Standards exam. Practice intelligently, track your mastery, and let Forge guide your learning." />
        </motion.p>

        {/* Dynamic Banner */}
        <motion.div
          variants={bannerVariants}
          className="relative w-full max-w-4xl rounded-2xl flex items-center justify-center mb-16 group overflow-hidden transition-transform duration-700 hover:scale-[1.02] cursor-pointer"
          onClick={() => scrollTo('features')}
        >
          <img
            src={bannerSrc}
            alt="NITSForge Hero Banner"
            className="w-full h-auto object-contain relative z-10"
          />
          {/* Shine effect overlay */}
          <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden rounded-2xl">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine w-1/2 h-full skew-x-12" />
          </div>
        </motion.div>

        {/* Theme Selector Dock */}
        <motion.div variants={itemVariants} className="flex gap-5 sm:gap-8 items-center justify-center mb-16 p-3 sm:p-4 rounded-full bg-surface-2/40 backdrop-blur-xl border border-borderline shadow-xl">
          {THEMES.map((t) => {
            const isActive = theme === t.id;
            return (
              <motion.button
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full cursor-pointer focus:outline-none transition-all duration-300
                  ${isActive ? 'ring-2 ring-offset-4 ring-primary ring-offset-surface shadow-lg scale-110' : 'ring-1 ring-borderline/50 hover:ring-primary/50 shadow-md'}
                `}
                style={{ background: `linear-gradient(135deg, ${t.bg} 0%, ${t.bg} 50%, ${t.primary} 50%, ${t.primary} 100%)` }}
                aria-label={`Select ${t.id} theme`}
                title={t.id.charAt(0).toUpperCase() + t.id.slice(1)}
              />
            );
          })}
        </motion.div>

        <motion.button
          variants={itemVariants}
          onClick={() => scrollTo('features')}
          className="flex flex-col items-center gap-2 text-text-muted hover:text-primary transition-colors animate-bounce"
        >
          <span className="text-sm font-medium uppercase tracking-widest">Scroll to explore</span>
          <ArrowDown className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </section>
  );
}
