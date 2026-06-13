// src/components/landing/FooterSection.tsx
import { Mail } from 'lucide-react';

const GithubIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export function FooterSection() {
  const scrollToTop = () => {
    const element = document.getElementById('hero');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="footer" className="bg-surface-2/50 border-t border-borderline py-12 px-6 lg:px-16 mt-12">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex flex-col items-center md:items-start">
          <button 
            onClick={scrollToTop}
            className="font-display font-bold text-xl tracking-tight text-text-main hover:text-primary transition-colors mb-2"
          >
            NITSForge<span className="text-primary">.</span>
          </button>
          <p className="text-xs text-text-muted">
            The ultimate open-source PhilNITS FE prep platform.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <a href="https://github.com/Goldenavs/NITSForge" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-surface border border-borderline text-text-muted hover:text-text-main hover:border-primary transition-all">
            <GithubIcon />
          </a>
          <button className="p-2 rounded-full bg-surface border border-borderline text-text-muted hover:text-text-main hover:border-primary transition-all">
            <TwitterIcon />
          </button>
          <button className="p-2 rounded-full bg-surface border border-borderline text-text-muted hover:text-text-main hover:border-primary transition-all">
            <Mail className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto mt-8 pt-8 border-t border-borderline/50 text-center text-xs text-text-muted/60 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© 2026 NITSForge. All rights reserved.</p>
        <p>Built for the Philippine IT community.</p>
      </div>
    </footer>
  );
}
