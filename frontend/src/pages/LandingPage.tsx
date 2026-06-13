// src/pages/LandingPage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext'; 
import InteractiveBackground from '../components/ui/InteractiveBackground';

import { AuthSidebar } from '../components/landing/AuthSidebar';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { CoreEngineSection } from '../components/landing/CoreEngineSection';
import { FAQSection } from '../components/landing/FAQSection';
import { FooterSection } from '../components/landing/FooterSection';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  
  useEffect(() => {
    if (user || isGuest) {
      navigate('/dashboard');
    }
  }, [user, isGuest, navigate]);

  return (
    <div id="main-scroll" className="flex flex-col lg:flex-row h-screen w-screen bg-background text-text-main font-body selection:bg-primary/20 relative overflow-y-auto lg:overflow-hidden">
      
      {/* GLOBAL BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <InteractiveBackground />
      </div>
      
      {/* LEFT COLUMN: AUTH SIDEBAR */}
      <AuthSidebar />

      {/* RIGHT COLUMN: SCROLLABLE LANDING PAGE */}
      <div id="right-scroll" className="flex-1 lg:h-screen lg:overflow-y-auto scroll-smooth relative z-10 flex flex-col p-4 lg:p-0">
        <LandingNavbar />
        
        <main className="flex-1">
          <HeroSection />
          <FeaturesSection />
          <CoreEngineSection />
          <FAQSection />
        </main>
        
        <FooterSection />
      </div>
    </div>
  );
}