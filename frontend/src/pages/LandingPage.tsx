// src/pages/LandingPage.tsx
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="p-4 md:p-8 animate-fade-in flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-5xl font-bold text-text-main mb-2 font-display">NITSForge</h1>   
      <p className="text-lg text-text-muted mb-8">Forge your path to the FE.</p>     
      <Link 
        to="/dashboard" 
        className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow hover:bg-primary-dark transition-colors"
      >
        Go to App (Guest Mode)
      </Link>
    </div>
  );
}