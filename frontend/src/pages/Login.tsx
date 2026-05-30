// src/pages/Login.tsx
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import InteractiveBackground from '../components/ui/InteractiveBackground';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect Supabase Auth here later
    // For now, immediately route the user to the dashboard to test the flow
    navigate('/dashboard');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 animate-page-entry">
      <InteractiveBackground />

      <Card className="w-full max-w-md relative z-10 shadow-2xl shadow-black/5">
        <CardHeader className="text-center pb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-surface font-bold text-2xl mx-auto mb-4 shadow-sm shadow-primary/20">
            F
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <p className="text-text-muted mt-2 text-sm">Enter your credentials to access the forge.</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-4">
            
            {/* Native Glassmorphic Inputs */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-main ml-1">Email</label>
              <input 
                type="email" 
                placeholder="engineer@nitsforge.com" 
                className="w-full bg-surface-2 border border-borderline rounded-xl px-4 py-3 text-text-main placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-text-main">Password</label>
                <Link to="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</Link>
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-surface-2 border border-borderline rounded-xl px-4 py-3 text-text-main placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full mt-2">
              Sign In
            </Button>
          </form>

          {/* Social Auth Separator */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-borderline"></div></div>
            <div className="relative flex justify-center text-xs"><span className="bg-surface px-2 text-text-muted font-medium">OR CONTINUE WITH</span></div>
          </div>

          <Button variant="secondary" className="w-full gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google
          </Button>

          <p className="text-center text-sm text-text-muted mt-6">
            Don't have an account? <Link to="/signup" className="text-primary hover:underline font-semibold">Sign up</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}