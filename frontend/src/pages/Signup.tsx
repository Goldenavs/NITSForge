// src/pages/Signup.tsx
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import InteractiveBackground from '../components/ui/InteractiveBackground';

export default function Signup() {
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth & route to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 animate-page-entry py-12">
      <InteractiveBackground />

      <Card className="w-full max-w-md relative z-10 shadow-2xl shadow-black/5">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl">Join NITSForge</CardTitle>
          <p className="text-text-muted mt-2 text-sm">Create an account to save your progress and compete on the leaderboards.</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSignup} className="flex flex-col gap-4 mt-4">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-main ml-1">Display Name</label>
              <input 
                type="text" 
                placeholder="e.g. John Doe" 
                className="w-full bg-surface-2 border border-borderline rounded-xl px-4 py-3 text-text-main placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-main ml-1">Email</label>
              <input 
                type="email" 
                placeholder="engineer@nitsforge.com" 
                className="w-full bg-surface-2 border border-borderline rounded-xl px-4 py-3 text-text-main placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-main ml-1">Password</label>
              <input 
                type="password" 
                placeholder="Create a strong password" 
                className="w-full bg-surface-2 border border-borderline rounded-xl px-4 py-3 text-text-main placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full mt-4">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Already have an account? <Link to="/login" className="text-primary hover:underline font-semibold">Log in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}