// src/components/landing/LandingNavbar.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const AnimatedLink = ({ 
  title, 
  id, 
  onClick 
}: { 
  title: string; 
  id: string; 
  onClick: (id: string) => void; 
}) => {
  return (
    <button 
      onClick={() => onClick(id)}
      className="font-orbitron relative overflow-hidden group cursor-pointer text-[10px] xl:text-xs font-bold uppercase tracking-widest text-text-muted block shrink-0"
    >
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full text-text-main">
        {title}
      </span>
      <span className="absolute inset-0 block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] text-primary translate-y-full group-hover:translate-y-0">
        {title}
      </span>
    </button>
  );
};

export function LandingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  // Scroll detection logic
  useEffect(() => {
    // Determine the scroll container based on screen size (matches our layout logic)
    const container = window.innerWidth >= 1024 
      ? document.getElementById('right-scroll') 
      : document.getElementById('main-scroll');

    if (!container) return;

    const handleScroll = () => {
      const currentScrollY = container.scrollTop;
      const diff = currentScrollY - lastScrollY.current;

      if (currentScrollY < 50) {
        setIsHidden(false);
      } else if (diff > 10) {
        // Scrolling down
        if (!isMobileMenuOpen) setIsHidden(true);
      } else if (diff < -10) {
        // Scrolling up
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      // Offset scrolling slightly to account for the sticky navbar
      const container = window.innerWidth >= 1024 
        ? document.getElementById('right-scroll') 
        : document.getElementById('main-scroll');
        
      if (container) {
        const top = element.getBoundingClientRect().top + container.scrollTop - 100;
        container.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: isHidden ? -150 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-6 z-50 mx-6 lg:mx-10 mt-6 rounded-2xl bg-surface/80 backdrop-blur-xl border border-borderline px-6 py-4 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
      >
        <button 
          onClick={() => scrollTo('hero')} 
          className="font-display font-bold text-xl tracking-tight text-text-main hover:text-primary transition-colors flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-surface font-bold text-lg group-hover:scale-105 transition-transform shadow-md">
            F
          </div>
          <span>NITSForge<span className="text-primary">.</span></span>
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <AnimatedLink title="Features" id="features" onClick={scrollTo} />
          <AnimatedLink title="Core Engine" id="core-engine" onClick={scrollTo} />
          <AnimatedLink title="FAQs" id="faqs" onClick={scrollTo} />
          <AnimatedLink title="More" id="footer" onClick={scrollTo} />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 rounded-full bg-surface-2 border border-borderline flex items-center justify-center text-text-main hover:text-primary transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="md:hidden sticky top-[96px] z-40 mx-6 mt-2 rounded-2xl bg-surface/95 backdrop-blur-xl border border-borderline p-4 shadow-2xl flex flex-col gap-2"
          >
            {[
              { title: 'Features', id: 'features' },
              { title: 'Core Engine', id: 'core-engine' },
              { title: 'FAQs', id: 'faqs' },
              { title: 'More', id: 'footer' }
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-surface-2 text-text-main hover:text-primary font-medium transition-colors"
              >
                {link.title}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
