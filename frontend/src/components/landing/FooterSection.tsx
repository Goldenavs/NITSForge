const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <circle cx="12" cy="10" r="3" />
    <path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
  </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../store/ThemeContext';

type LegalDoc = 'Terms of Service' | 'Privacy Policy' | 'Cookie Policy' | null;

const legalContent = {
  'Terms of Service': "Welcome to NITSForge. By using this platform, you agree to these Terms of Service. This platform is built as an open-source educational tool. You agree not to misuse the content, disrupt the services, or attempt to exploit any vulnerabilities in the system. The platform is provided 'as is' without warranties of any kind. We reserve the right to modify or terminate the service at any time.",
  'Privacy Policy': "We value your privacy. Your data (such as mock exam results, progress, and analytics) is stored securely in our database solely to provide you with personalized learning experiences. We do not sell your personal data to third parties. If you wish to have your data completely removed, you can delete your account at any time from your settings.",
  'Cookie Policy': "NITSForge uses minimal cookies strictly necessary for the platform to function properly. We use cookies to save your theme preferences, keep you securely logged in, and remember your session state. We do not use third-party tracking or advertising cookies."
};

export function FooterSection() {
  const { theme } = useTheme();
  const [activeDoc, setActiveDoc] = useState<LegalDoc>(null);
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setModalRoot(document.getElementById('landing-modal-root'));
  }, []);

  const scrollToTop = () => {
    const element = document.getElementById('hero');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isDarkTheme = ['midnight', 'obsidian', 'forest'].includes(theme);
  // Light image for dark theme, dark image for light theme
  const logoSrc = isDarkTheme ? '/NITSForge-full-light.png' : '/NITSForge-full-dark.png';

  return (
    <footer id="footer" className="bg-surface-2/30 py-6 mt-12 border-t border-borderline">
      <div className="max-w-5xl mx-auto px-6 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Brand & Text (Left) */}
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          <button
            onClick={scrollToTop}
            className="hover:scale-105 transition-transform duration-300 focus:outline-none flex-shrink-0"
          >
            <img src={logoSrc} alt="NITSForge Logo" className="w-12 h-12 object-contain" />
          </button>

          <div className="h-8 w-px bg-borderline hidden md:block"></div>

          <div className="flex flex-col">
            <p className="text-xs text-text-muted max-w-xs leading-snug">
              The ultimate open-source PhilNITS FE prep platform. <br className="hidden md:block" />Built for the Philippine IT community.
            </p>
            <p className="text-[10px] text-text-muted/60 mt-1">
              © 2026 NITSForge. All rights reserved.
            </p>
          </div>
        </div>

        {/* Socials & Journal (Right) */}
        <div className="flex items-center gap-3">

          {/* Dev Journal Icon */}
          <a
            href="https://goldenavs-dev-journal.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white hover:shadow-[0_0_15px_-3px_var(--color-primary)] transition-all duration-300 hover:-translate-y-1 relative group"
            aria-label="Dev Journal"
          >
            <UserIcon className="w-4 h-4" />
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-surface border border-borderline text-[10px] font-bold text-text-main rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
              Meet the Dev
            </span>
          </a>

          <div className="h-6 w-px bg-borderline mx-1"></div>

          <a
            href="https://github.com/Goldenavs"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full bg-surface border border-borderline text-text-muted hover:text-text-main hover:border-primary hover:shadow-[0_0_15px_-3px_var(--color-primary)] transition-all duration-300 hover:-translate-y-1"
            aria-label="GitHub"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <a
            href="https://www.facebook.com/jmnavsss"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full bg-surface border border-borderline text-text-muted hover:text-[#1877F2] hover:border-[#1877F2] hover:shadow-[0_0_15px_-3px_#1877F2] transition-all duration-300 hover:-translate-y-1"
            aria-label="Facebook"
          >
            <FacebookIcon className="w-4 h-4" />
          </a>
          <a
            href="https://www.instagram.com/jmnavsss"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full bg-surface border border-borderline text-text-muted hover:text-[#E4405F] hover:border-[#E4405F] hover:shadow-[0_0_15px_-3px_#E4405F] transition-all duration-300 hover:-translate-y-1"
            aria-label="Instagram"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Legal & Community Note */}
      <div className="max-w-5xl mx-auto px-6 lg:px-16 mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Legal Links */}
        <div className="flex items-center gap-4 text-[10px] font-medium text-text-muted/50">
          {(['Terms of Service', 'Privacy Policy', 'Cookie Policy'] as LegalDoc[]).map(doc => (
            <button 
              key={doc!} 
              onClick={() => setActiveDoc(doc)}
              className="hover:text-primary transition-colors focus:outline-none"
            >
              {doc}
            </button>
          ))}
        </div>

        {/* Community Note */}
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-text-muted/50 hover:text-text-muted transition-colors">
          <span>Built with passion for the</span>
          <span className="inline-flex items-center justify-center w-3 h-3 rounded-full overflow-hidden opacity-80">
            {/* Simple Philippine Flag representation */}
            <svg viewBox="0 0 64 64" className="w-full h-full">
              <rect width="64" height="32" fill="#0038A8" />
              <rect y="32" width="64" height="32" fill="#CE1126" />
              <polygon points="0,0 32,32 0,64" fill="#FFFFFF" />
              <circle cx="10" cy="32" r="3" fill="#FCD116" />
            </svg>
          </span>
          <span>IT community.</span>
        </div>
      </div>

      {/* Legal Modal */}
      {modalRoot && createPortal(
        <AnimatePresence>
          {activeDoc && (
            <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center p-4 pointer-events-auto">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setActiveDoc(null)}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm cursor-pointer"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-surface border border-borderline rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]"
              >
                <div className="p-6 border-b border-borderline flex items-center justify-between bg-surface-2/30">
                  <h3 className="text-xl font-display font-bold text-text-main">{activeDoc}</h3>
                  <button 
                    onClick={() => setActiveDoc(null)} 
                    className="p-2 text-text-muted hover:text-primary transition-colors rounded-lg bg-surface hover:bg-primary/10 border border-transparent hover:border-primary/20"
                  >
                    <CloseIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 text-sm text-text-muted leading-relaxed overflow-y-auto">
                  <p>{legalContent[activeDoc]}</p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        modalRoot
      )}
    </footer>
  );
}
