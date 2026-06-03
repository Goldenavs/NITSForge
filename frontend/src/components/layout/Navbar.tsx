// src/components/layout/Navbar.tsx
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../store/AuthContext'; // Import Auth

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

// Modified to be a standard Button instead of a Link for the Dropdown Toggle
const AnimatedActionButton = ({ 
  icon: Icon, 
  isActive,
  onClick 
}: { 
  icon: any; 
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button 
      onClick={onClick}
      className={`group relative overflow-hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all duration-300 shrink-0 pointer-events-auto ${
        isActive ? 'bg-text-main text-primary scale-105 shadow-md' : 'bg-surface-2 text-text-main border border-borderline hover:scale-105'
      }`}
    >
      <span className={`absolute inset-0 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] origin-center ${
        isActive ? 'bg-text-main scale-100' : 'bg-text-main scale-0 group-hover:scale-100'
      }`}></span>
      
      <Icon className={`relative z-10 w-4 h-4 sm:w-4 sm:h-4 transition-colors duration-300 ${
        isActive ? 'text-primary' : 'group-hover:text-surface'
      }`} />
    </button>
  );
};

export default function Navbar() {
  const location = useLocation();
  const { signOut } = useAuth(); // Extract signOut method
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // New dropdown state

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.user-menu-container') && isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  // --- HEADROOM PATTERN LOGIC ---
  const [isHidden, setIsHidden] = useState(false);
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    const diff = latest - previous;
    
    if (latest < 50) {
      setIsHidden(false);
      lastScrollY.current = latest;
      return;
    }

    if (Math.abs(diff) < 10) return;

    if (isMobileMenuOpen || isUserMenuOpen) {
      setIsHidden(false);
      lastScrollY.current = latest;
      return;
    }

    if (diff > 0) setIsHidden(true);
    else setIsHidden(false);

    lastScrollY.current = latest;
  });

  const links = [
    { name: 'Quiz', path: '/quiz' },
    { name: 'Topics', path: '/topics' },
    { name: 'Challenge', path: '/daily' },
    { name: 'Planner', path: '/planner' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'History', path: '/history' },
    { name: 'Bookmarks', path: '/bookmarks' },
  ];

  return (
    <motion.nav 
      variants={{ visible: { y: 0 }, hidden: { y: -120 } }}
      initial="visible"
      animate={isHidden ? "hidden" : "visible"}
      transition={{ type: "spring", bounce: 0, duration: 2.7 }}
      className="fixed top-0 left-0 w-full z-50 flex flex-col items-center px-4 md:px-6 py-4 sm:py-6 pointer-events-none"
    >
      <div className="w-full max-w-7xl relative pointer-events-none">
        
        <div className="w-full flex items-center justify-between pointer-events-auto bg-surface/80 backdrop-blur-2xl border border-borderline rounded-full px-4 sm:px-6 py-2.5 sm:py-3 shadow-lg shadow-black/5 transition-all duration-500 hover:border-text-muted/30 hover:shadow-xl">
          
          <Link 
            to="/dashboard"
            onClick={() => { setIsMobileMenuOpen(false); setIsUserMenuOpen(false); }}
            className="font-orbitron relative overflow-hidden text-base sm:text-lg font-black tracking-tighter uppercase group grid shrink-0"
          >
            <span className={`col-start-1 row-start-1 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${location.pathname === '/dashboard' ? '-translate-y-full text-text-main' : 'group-hover:-translate-y-full text-text-main'}`}>
              NITS<span className="text-primary">Forge</span>
            </span>
            <span className={`col-start-1 row-start-1 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] text-primary ${location.pathname === '/dashboard' ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'}`}>
              Dash<span className="text-text-main">Board</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-4 xl:gap-8">
            {links.map((link) => (
              <AnimatedLink 
                key={link.name} 
                title={link.name} 
                path={link.path} 
                isActive={location.pathname === link.path} 
                onClick={() => { setIsMobileMenuOpen(false); setIsUserMenuOpen(false); }}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* The New User Menu Dropdown Container */}
            <div className="relative user-menu-container">
              <AnimatedActionButton 
                icon={User} 
                isActive={isUserMenuOpen || location.pathname === '/profile' || location.pathname === '/settings'}
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen);
                  setIsMobileMenuOpen(false);
                }}
              />

              {/* Dropdown Panel */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.76, 0, 0.24, 1] }}
                    className="absolute top-full right-0 mt-4 w-56 bg-surface/95 backdrop-blur-3xl border border-borderline rounded-[2rem] p-6 shadow-2xl pointer-events-auto flex flex-col gap-5 origin-top-right"
                  >
                    <div className="border-b border-borderline/50 pb-4">
                      <Link 
                        to="/profile" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 font-orbitron text-[10px] xl:text-xs font-bold uppercase tracking-widest text-text-muted hover:text-primary transition-colors group"
                      >
                        <User size={16} className="group-hover:scale-110 transition-transform duration-300" /> 
                        Profile
                      </Link>
                    </div>
                    
                    <div className="border-b border-borderline/50 pb-4">
                      <Link 
                        to="/settings" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 font-orbitron text-[10px] xl:text-xs font-bold uppercase tracking-widest text-text-muted hover:text-primary transition-colors group"
                      >
                        <SettingsIcon size={16} className="group-hover:scale-110 transition-transform duration-300" /> 
                        Settings
                      </Link>
                    </div>
                    
                    <div>
                      <button 
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          signOut();
                        }}
                        className="flex items-center gap-3 font-orbitron text-[10px] xl:text-xs font-bold uppercase tracking-widest text-text-muted hover:text-red-500 transition-colors w-full text-left group"
                      >
                        <LogOut size={16} className="group-hover:scale-110 transition-transform duration-300 text-red-500 hover:bg-red-500/10" /> 
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsUserMenuOpen(false);
              }}
              className="lg:hidden flex items-center justify-center p-2 text-text-muted hover:text-primary transition-colors pointer-events-auto shrink-0 bg-surface-2 rounded-full border border-borderline"
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