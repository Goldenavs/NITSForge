// src/components/layout/Navbar.tsx
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Settings as SettingsIcon } from 'lucide-react';

const AnimatedLink = ({ 
  title, 
  path, 
  isActive, 
  onClick 
}: { 
  title: string; 
  path: string; 
  isActive: boolean;
  onClick: () => void; 
}) => {
  return (
    <Link 
      to={path} 
      onClick={onClick}
      className="font-orbitron relative overflow-hidden group cursor-pointer text-[10px] xl:text-xs font-bold uppercase tracking-widest text-text-muted block shrink-0"
    >
      <span className={`block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isActive ? '-translate-y-full text-primary' : 'group-hover:-translate-y-full text-text-main'}`}>
        {title}
      </span>
      <span className={`absolute inset-0 block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] text-primary ${isActive ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'}`}>
        {title}
      </span>
    </Link>
  );
};

// Reusable Icon Button with the expansion hover effect
const AnimatedIconButton = ({ 
  path, 
  icon: Icon, 
  isActive,
  onClick 
}: { 
  path: string; 
  icon: any; 
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <Link 
      to={path}
      onClick={onClick}
      className={`group relative overflow-hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all duration-300 shrink-0 ${
        isActive ? 'bg-text-main text-primary scale-105 shadow-md' : 'bg-surface-2 text-text-main border border-borderline hover:scale-105'
      }`}
    >
      {/* The expanding background circle */}
      <span className={`absolute inset-0 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] origin-center ${
        isActive ? 'bg-text-main scale-100' : 'bg-text-main scale-0 group-hover:scale-100'
      }`}></span>
      
      {/* The Icon */}
      <Icon className={`relative z-10 w-4 h-4 sm:w-4 sm:h-4 transition-colors duration-300 ${
        isActive ? 'text-primary' : 'group-hover:text-surface'
      }`} />
    </Link>
  );
};

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- HEADROOM PATTERN LOGIC ---
  const [isHidden, setIsHidden] = useState(false);
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    const diff = latest - previous;
    
    // 1. Always show navbar near the very top of the page (within 50px)
    if (latest < 50) {
      setIsHidden(false);
      lastScrollY.current = latest;
      return;
    }

    // 2. Ignore micro-scrolls beneath a 10px threshold to prevent jitter
    if (Math.abs(diff) < 10) return;

    // 3. If mobile dropdown is open, NEVER hide the navbar container
    if (isMobileMenuOpen) {
      setIsHidden(false);
      lastScrollY.current = latest;
      return;
    }

    if (diff > 0) {
      // Scrolling Down -> Hide Navbar smoothly
      setIsHidden(true);
    } else {
      // Scrolling Up -> Instantly reveal Navbar
      setIsHidden(false);
    }

    lastScrollY.current = latest;
  });

  // The comprehensive NITSForge routing map
  const links = [
    { name: 'Quiz Hub', path: '/quiz' },
    { name: 'Topics', path: '/topics' },
    { name: 'Daily Challenge', path: '/daily' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'History', path: '/history' },
    { name: 'Bookmarks', path: '/bookmarks' },
  ];

  return (
    <motion.nav 
      // Bind visibility state to GPU-accelerated transforms
      variants={{
        visible: { y: 0 },
        hidden: { y: -120 } // Translates it clean out of view (adjust if pill gets clipped)
      }}
      initial="visible"
      animate={isHidden ? "hidden" : "visible"}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 w-full z-50 flex flex-col items-center px-4 md:px-6 py-4 sm:py-6 pointer-events-none"
    >
      <div className="w-full max-w-7xl relative pointer-events-none">
        
        {/* Main Navbar Pill */}
        <div className="w-full flex items-center justify-between pointer-events-auto bg-surface/80 backdrop-blur-2xl border border-borderline rounded-full px-4 sm:px-6 py-2.5 sm:py-3 shadow-lg shadow-black/5 transition-all duration-500 hover:border-text-muted/30 hover:shadow-xl">
          
          {/* Logo Section (Links to Dashboard) */}
          <Link 
            to="/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            // 👇 1. Changed 'block' to 'grid'
            className="font-orbitron relative overflow-hidden text-base sm:text-lg font-black tracking-tighter uppercase group grid shrink-0"
          >
            {/* 👇 2. Changed 'block' to 'col-start-1 row-start-1' */}
            <span className={`col-start-1 row-start-1 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${location.pathname === '/dashboard' ? '-translate-y-full text-text-main' : 'group-hover:-translate-y-full text-text-main'}`}>
              NITS<span className="text-primary">Forge</span>
            </span>
            
            {/* 👇 3. Removed 'absolute inset-0 block' and used 'col-start-1 row-start-1' */}
            <span className={`col-start-1 row-start-1 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] text-primary ${location.pathname === '/dashboard' ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'}`}>
              Dash<span className="text-text-main">Board</span>
            </span>
          </Link>

          {/* Desktop Links (Hidden on screens smaller than lg to prevent crowding) */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-8">
            {links.map((link) => (
              <AnimatedLink 
                key={link.name} 
                title={link.name} 
                path={link.path} 
                isActive={location.pathname === link.path} 
                onClick={() => setIsMobileMenuOpen(false)}
              />
            ))}
          </div>

          {/* Right Controls Container */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Settings Icon Button */}
            <AnimatedIconButton 
              path="/settings" 
              icon={SettingsIcon} 
              isActive={location.pathname === '/settings'}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Profile Icon Button */}
            <AnimatedIconButton 
              path="/profile" 
              icon={User} 
              isActive={location.pathname === '/profile'}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu Toggle Button (Visible only < lg) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center justify-center p-2 text-text-muted hover:text-primary transition-colors pointer-events-auto shrink-0 bg-surface-2 rounded-full border border-borderline"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
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
                  <div key={link.name} className="border-b border-borderline/50 pb-4 last:border-0 last:pb-0">
                    <AnimatedLink 
                      title={link.name} 
                      path={link.path} 
                      isActive={location.pathname === link.path} 
                      onClick={() => setIsMobileMenuOpen(false)}
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