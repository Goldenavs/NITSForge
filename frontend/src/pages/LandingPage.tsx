import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="p-4 md:p-8 animate-fade-in flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <h1 className="text-4xl font-bold text-slate-900 mb-2">NITSForge</h1>
      <p className="text-lg text-slate-600 mb-8">Forge your path to the FE.</p>
      
      {/* Temporary Link for testing routing */}
      <Link 
        to="/dashboard" 
        className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow hover:bg-orange-600 transition-colors"
      >
        Go to App (Guest Mode)
      </Link>
    </div>
  );
}