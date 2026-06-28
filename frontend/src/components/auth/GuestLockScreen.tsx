import { Lock } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

interface GuestLockScreenProps {
  featureName: string;
}

export function GuestLockScreen({ featureName }: GuestLockScreenProps) {
  const handleSignUpClick = () => {
    localStorage.removeItem('nitsforge_guest_session');
    window.location.href = '/?signup=true';
  };

  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-surface-2/80 backdrop-blur-xl border border-borderline relative overflow-hidden group shadow-lg">
        {/* Shimmer Effect */}
        <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] z-20 pointer-events-none group-hover:animate-[shineOneWay_1s_ease-out_forwards]" />
        
        <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-surface border border-borderline shadow-sm flex items-center justify-center mb-6 text-primary group-hover:scale-105 transition-transform duration-300 group-hover:rotate-3 group-hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]">
            <Lock className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-display font-bold text-text-main mb-3">
            {featureName} Locked
          </h2>
          
          <p className="text-text-muted mb-8 leading-relaxed max-w-sm">
            You are currently playing as a Guest. To track your history, compete on global leaderboards, and save your hard-earned XP permanently, you'll need to create an account.
          </p>

          <Button 
            variant="primary" 
            onClick={handleSignUpClick}
            className="w-full font-orbitron tracking-widest uppercase py-4 group-hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] transition-all duration-300"
          >
            Create Free Account
          </Button>
          
          <p className="mt-4 text-xs text-text-muted/60">
            It takes less than 30 seconds.
          </p>
        </CardContent>

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary opacity-[0.03] blur-3xl rounded-full pointer-events-none transition-opacity duration-500 group-hover:opacity-10" />
      </Card>
    </div>
  );
}
