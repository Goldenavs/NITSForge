// src/components/landing/LandingNavbar.tsx
export function LandingNavbar() {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-borderline px-6 py-4 flex items-center justify-between">
      <button
        onClick={() => scrollTo('hero')}
        className="font-display font-bold text-xl tracking-tight text-text-main hover:text-primary transition-colors"
      >
        NITSForge<span className="text-primary">.</span>
      </button>

      <div className="hidden md:flex items-center gap-6">
        <button onClick={() => scrollTo('features')} className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">
          Features
        </button>
        <button onClick={() => scrollTo('core-engine')} className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">
          Core Engine
        </button>
        <button onClick={() => scrollTo('faqs')} className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">
          FAQs
        </button>
        <button onClick={() => scrollTo('footer')} className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">
          More
        </button>
      </div>

      {/* Mobile Menu Placeholder - we keep it simple for now, can expand later */}
      <div className="md:hidden">
        <button className="text-text-muted hover:text-text-main p-2">
          {/* Hamburger Icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
