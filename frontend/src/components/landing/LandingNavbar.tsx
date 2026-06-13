// src/components/landing/LandingNavbar.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';

const AnimatedLink = ({ 
  title, 
  id, 
  isActive,
  onClick 
}: { 
  title: string; 
  id: string; 
  isActive?: boolean;
  onClick: (id: string) => void; 
}) => {
  return (
    <button 
      onClick={() => onClick(id)}
      className="font-orbitron relative overflow-hidden group cursor-pointer text-[10px] xl:text-xs font-bold uppercase tracking-widest text-text-muted block shrink-0"
    >
      <span className={`block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isActive ? '-translate-y-full text-primary' : 'group-hover:-translate-y-full text-text-main'}`}>
        {title}
      </span>
      <span className={`absolute inset-0 block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] text-primary ${isActive ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'}`}>
        {title}
      </span>
    </button>
  );
};

export function LandingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const isScrollingRef = useRef(false);

  // Scroll logic for scroll spy
  useEffect(() => {
    const container = window.innerWidth >= 1024 
      ? document.getElementById('right-scroll') 
      : document.getElementById('main-scroll');

    if (!container) return;

    const handleScroll = () => {
      if (isScrollingRef.current) return; // Prevent flickering during programmatic scroll
      
      const sections = ['hero', 'features', 'core-engine', 'faqs', 'footer'];
      const containerTop = container.getBoundingClientRect().top;
      
      for (const id of [...sections].reverse()) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the element's top is less than half the container's height, it's considered active
          if (rect.top - containerTop < container.clientHeight * 0.4) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger once on mount
    handleScroll();
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    setActiveSection(id);
    isScrollingRef.current = true;
    
    const element = document.getElementById(id);
    if (element) {
      const container = window.innerWidth >= 1024 
        ? document.getElementById('right-scroll') 
        : document.getElementById('main-scroll');
        
      if (container) {
        const top = element.getBoundingClientRect().top + container.scrollTop;
        container.scrollTo({ top, behavior: 'smooth' });
        
        // Unlock scroll spy after smooth scroll completes (~800ms)
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 800);
      } else {
        isScrollingRef.current = false;
      }
    } else {
      isScrollingRef.current = false;
    }
  };

  const links = [
    { name: 'Features', id: 'features' },
    { name: 'Core Engine', id: 'core-engine' },
    { name: 'FAQs', id: 'faqs' }
  ];

  return (
    <motion.nav 
      initial={{ y: -120 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", bounce: 0, duration: 2.7 }}
      className="sticky top-0 w-full z-50 flex flex-col items-center px-4 md:px-6 py-4 sm:py-6 pointer-events-none"
    >
      <div className="w-full max-w-7xl relative pointer-events-none">
        
        <div className="w-full flex items-center justify-between lg:justify-evenly pointer-events-auto bg-surface/80 backdrop-blur-2xl border border-borderline rounded-full px-6 sm:px-10 py-2.5 sm:py-3 shadow-lg shadow-black/5 transition-all duration-500 hover:border-text-muted/30 hover:shadow-xl">
          
          <button 
            onClick={() => scrollTo('hero')}
            className="font-orbitron relative overflow-hidden text-base sm:text-lg font-black tracking-tighter uppercase group grid shrink-0"
          >
            <span className={`col-start-1 row-start-1 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${activeSection === 'hero' ? '-translate-y-full text-text-main' : 'group-hover:-translate-y-full text-text-main'}`}>
              NITS<span className="text-primary">Forge</span>
            </span>
            <span className={`col-start-1 row-start-1 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] text-primary ${activeSection === 'hero' ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'}`}>
              Over<span className="text-text-main">View</span>
            </span>
          </button>

          <div className="hidden lg:contents">
            {links.map((link) => (
              <AnimatedLink 
                key={link.id} 
                title={link.name} 
                id={link.id} 
                isActive={activeSection === link.id}
                onClick={scrollTo}
              />
            ))}
          </div>

          <div className="flex items-center shrink-0 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center p-2 text-text-muted hover:text-primary transition-colors pointer-events-auto shrink-0 bg-surface-2 rounded-full border border-borderline"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Main Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
              className="absolute top-full mt-4 left-0 w-full pointer-events-auto lg:hidden"
            >
              <div className="bg-surface/95 backdrop-blur-3xl border border-borderline rounded-[2rem] p-6 flex flex-col gap-5 shadow-2xl">
                {links.map((link) => (
                  <div key={link.id} className="border-b border-borderline/50 pb-4 last:border-0 last:pb-0">
                    <AnimatedLink 
                      title={link.name} 
                      id={link.id} 
                      isActive={activeSection === link.id}
                      onClick={scrollTo}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.nav>
  );
}
