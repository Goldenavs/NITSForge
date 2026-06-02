// src/pages/LandingPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Mail, Lock, ArrowRight, User, Eye, EyeOff, Target, Trophy, Sparkles, Zap, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import InteractiveBackground from '../components/ui/InteractiveBackground';

// IMPORTANT: Make sure this path points to where you created your supabase client!
import { supabase } from '../services/supabase'; 

// NITSForge Onboarding Steps for the Carousel
const onboardingSteps = [
  {
    icon: <Target className="w-8 h-8 text-primary" />,
    title: "The Real Deal.",
    subtitle: "Full-length mock exams that perfectly mirror the pressure and structure of the actual PhilNITS FE."
  },
  {
    icon: <Zap className="w-8 h-8 text-accent" />,
    title: "Deep Analytics.",
    subtitle: "Radar charts and performance metrics pinpoint exactly what you need to review before test day."
  },
  {
    icon: <Sparkles className="w-8 h-8 text-amber-500" />,
    title: "Forge AI Companion.",
    subtitle: "Stuck on an algorithm? Forge breaks down questions and explains incorrect answers in real-time."
  },
  {
    icon: <Trophy className="w-8 h-8 text-green-500" />,
    title: "Level Up.",
    subtitle: "Earn XP, build streaks, and unlock badges as you study. Consistency is finally rewarded."
  }
];

// Custom Social SVGs
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GithubIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Auto-detect if user came from the /signup route to show the correct form instantly
  const [isLogin, setIsLogin] = useState(location.pathname !== '/signup');
  const [step, setStep] = useState(0);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // App State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-play the onboarding choreography every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % onboardingSteps.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // --- SUPABASE AUTH LOGIC ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null); // Clear previous errors

    if (!isLogin && password !== confirmPassword) {
      setErrorMsg("Passwords do not match! Please check again.");
      return;
    }
    
    setLoading(true);
    
    try {
      if (isLogin) {
        // 1. Log In Existing User
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        if (data.session) {
          navigate('/dashboard');
        }
      } else {
        // 2. Sign Up New User
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: email.split('@')[0], // Give them a default display name based on email
            }
          }
        });

        if (error) throw error;
        
        // Supabase often requires email verification before providing a session
        if (data.session) {
          navigate('/dashboard');
        } else {
          alert("Account created! Please check your email to verify your account.");
          setIsLogin(true); // Switch to login view for when they return
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleGuestLogin = () => {
    navigate('/dashboard');
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };
  
  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-y-auto overflow-x-hidden bg-background text-text-main font-body selection:bg-primary/20 relative">
      
      {/* GLOBAL BACKGROUND - Renders behind everything */}
      <InteractiveBackground />
      
      {/* =========================================
        LEFT COLUMN: THE AUTHENTICATION SIDEBAR
        ========================================= */}
      <div className="w-full lg:w-[480px] lg:h-screen lg:sticky top-0 flex flex-col justify-center px-6 py-16 lg:py-0 bg-surface/80 backdrop-blur-2xl border-b lg:border-b-0 lg:border-r border-borderline z-20 shadow-[20px_0_40px_rgba(0,0,0,0.05)] transition-colors duration-500 shrink-0">
        
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={containerVariants}
          className="relative z-10 w-full max-w-sm mx-auto"
        >
          {/* Logo Section */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-10">
            <div className="relative group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-surface font-bold text-xl relative z-10">
                F
              </div>
              <div className="absolute inset-0 bg-primary blur-xl opacity-40 group-hover:opacity-80 transition-opacity duration-500" />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              NITSForge<span className="text-primary">.</span>
            </h1>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-3xl font-display font-bold tracking-tight mb-2">
              {isLogin ? 'Welcome back' : 'Join the Forge'}
            </h2>
            <p className="text-text-muted text-sm">
              {isLogin ? 'Enter your credentials to access your dashboard.' : 'Sign up to start your PhilNITS FE mastery journey.'}
            </p>
          </motion.div>

          {/* Error Display */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>{errorMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Social Logins */}
          <motion.div variants={itemVariants} className="flex gap-3 mb-6">
            <button 
              type="button" 
              onClick={() => handleOAuth('github')}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-surface-2 border border-borderline rounded-xl hover:border-primary/50 hover:bg-background transition-all text-sm font-medium"
            >
              <GithubIcon /> GitHub
            </button>
            <button 
              type="button" 
              onClick={() => handleOAuth('google')}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-surface-2 border border-borderline rounded-xl hover:border-primary/50 hover:bg-background transition-all text-sm font-medium"
            >
              <GoogleIcon /> Google
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-borderline"></div>
            <span className="text-xs text-text-muted font-medium uppercase tracking-wider">Or continue with email</span>
            <div className="h-px flex-1 bg-borderline"></div>
          </motion.div>

          {/* Core Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="engineer@nitsforge.com"
                  className="w-full pl-11 pr-4 py-3 bg-surface-2 border border-borderline rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm text-text-main placeholder-text-muted/50"
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-surface-2 border border-borderline rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm text-text-main placeholder-text-muted/50"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            {/* Confirm Password Field (Animated entry for Signup only) */}
            <AnimatePresence>
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="space-y-1.5 overflow-hidden"
                >
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider ml-1">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                    <input 
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required={!isLogin}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-12 py-3 bg-surface-2 border border-borderline rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm text-text-main placeholder-text-muted/50"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="pt-2">
              <Button
                disabled={loading}
                type="submit"
                size="lg"
                className="w-full relative overflow-hidden group"
              >
                <div className="absolute inset-0 w-1/4 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? 'Processing...' : (isLogin ? 'Access Dashboard' : 'Initialize Account')} <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </motion.div>
          </form>

          {/* Footer Actions */}
          <motion.div variants={itemVariants} className="mt-8 flex flex-col items-center gap-4">
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setPassword('');
                setConfirmPassword('');
                setErrorMsg(null);
              }}
              className="text-sm text-text-muted hover:text-text-main transition-colors"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="text-primary font-semibold hover:underline">{isLogin ? 'Sign up' : 'Log in'}</span>
            </button>

            <button
              onClick={handleGuestLogin}
              className="text-sm font-medium flex items-center gap-2 text-text-muted hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-surface-2"
            >
              <User className="w-4 h-4" /> Skip & Continue as Guest
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* =========================================
        RIGHT COLUMN: THE IMMERSIVE CHOREOGRAPHY
        ========================================= */}
      <div className="flex-1 relative flex items-center justify-center p-8 lg:p-12 overflow-hidden min-h-screen lg:min-h-0 z-10">
        
        <div className="w-full max-w-2xl relative z-10">
          
          {/* Dynamic Floating Content Card */}
          <div className="relative w-full aspect-[4/3] sm:aspect-video rounded-3xl border border-borderline bg-surface/30 backdrop-blur-md shadow-2xl overflow-hidden mb-12 flex items-center justify-center">
            
            {/* Fake macOS Window Dots */}
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-center flex flex-col items-center px-6"
              >
                <div className="p-5 rounded-2xl bg-surface-2 border border-borderline shadow-[0_0_30px_rgba(var(--color-primary),0.1)] mb-6">
                  {onboardingSteps[step].icon}
                </div>
                <h3 className="font-display text-3xl sm:text-4xl font-bold mb-4 text-text-main">
                  {onboardingSteps[step].title}
                </h3>
                <p className="text-base sm:text-lg text-text-muted max-w-md mx-auto leading-relaxed">
                  {onboardingSteps[step].subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-3">
            {onboardingSteps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === step ? 'w-12 bg-primary shadow-[0_0_10px_rgba(var(--color-primary),0.5)]' : 'w-3 bg-borderline hover:bg-text-muted'
                }`}
              />
            ))}
          </div>

        </div>
      </div>
      
    </div>
  );
}