// src/pages/LandingPage.tsx
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ArrowRight, User } from 'lucide-react';
import InteractiveBackground from '../components/ui/InteractiveBackground';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden animate-page-entry">
      {/* Background Engine */}
      <InteractiveBackground />

      {/* Main Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
        <Badge variant="warning" className="mb-6 px-4 py-1 text-sm shadow-sm">
          v1.0.0 Pre-Release
        </Badge>
        
        <h1 className="text-5xl md:text-7xl font-bold text-text-main font-display tracking-tight leading-tight mb-6">
          Forge your path to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">FE Exam.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl leading-relaxed">
          The ultimate AI-powered reviewer for Filipino IT students. Master the PhilNITS Fundamental IT Engineer examination with curated questions, adaptive learning, and gamified progress.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link to="/signup" className="w-full sm:w-auto">
            <Button size="lg" className="w-full gap-2 text-lg px-8">
              Get Started <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full gap-2 text-lg px-8 shadow-sm">
              <User className="w-5 h-5" /> Guest Mode
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-sm text-text-muted">
          Already have an account? <Link to="/login" className="text-primary hover:text-primary-dark font-semibold underline underline-offset-4 transition-colors">Log in here</Link>.
        </p>
      </div>
    </div>
  );
}