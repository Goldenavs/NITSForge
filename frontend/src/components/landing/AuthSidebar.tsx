// src/components/landing/AuthSidebar.tsx
import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Mail, Lock, ArrowRight, User, Eye, EyeOff, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';
import { useNavigate } from 'react-router-dom';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const GithubIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

export function AuthSidebar() {
  const navigate = useNavigate();
  const { loginAsGuest } = useAuth();
  const { theme } = useTheme();

  const [isLogin, setIsLogin] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isDarkTheme = ['midnight', 'forest', 'obsidian'].includes(theme);
  const logoSrc = isDarkTheme ? '/NITSForge-banner-light.png' : '/NITSForge-banner-dark.png';

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // App State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isLogin) {
      if (password.length < 6) {
        setErrorMsg("Password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match! Please check again.");
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.session) {
          navigate('/dashboard');
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: email.split('@')[0],
            }
          }
        });

        if (error) throw error;

        if (data.session) {
          navigate('/dashboard');
        } else {
          alert("Account created! Please check your email to verify your account.");
          setIsLogin(true);
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
    loginAsGuest();
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
    <div className={`relative min-h-screen lg:h-screen lg:sticky top-0 bg-surface/50 backdrop-blur-3xl border-b lg:border-b-0 lg:border-r border-borderline z-30 shadow-[20px_0_40px_rgba(0,0,0,0.05)] shrink-0 flex flex-col justify-center transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isCollapsed ? 'w-full lg:w-[2%]' : 'w-full lg:w-[30%]'
      }`}>

      {/* Desktop Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 bg-surface border border-borderline rounded-full items-center justify-center text-text-muted hover:text-primary hover:scale-110 hover:shadow-lg transition-all z-50 cursor-pointer"
        aria-label={isCollapsed ? "Expand Authentication Panel" : "Collapse Authentication Panel"}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Content Mask */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`w-full h-full py-8 lg:py-0 flex flex-col justify-center transition-opacity duration-300 ${isCollapsed ? 'lg:opacity-0 lg:invisible' : 'opacity-100 visible'}`}>
          <div className="w-full lg:w-[30vw] min-w-[320px] px-6 lg:px-10 mx-auto flex flex-col justify-center h-full">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="relative z-10 w-full max-w-sm mx-auto"
            >
              {/* Logo Section */}
              <motion.div variants={itemVariants} className="flex justify-center mb-4">
                <img
                  src={logoSrc}
                  alt="NITSForge"
                  className="w-full max-w-[200px] h-auto object-contain"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="mb-4">
                <h2 className="text-3xl font-display font-bold tracking-tight mb-1">
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
                    className="mb-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p>{errorMsg}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Social Logins */}
              <motion.div variants={itemVariants} className="flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => handleOAuth('github')}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-surface-2 border border-borderline rounded-xl hover:border-primary/50 hover:bg-background transition-all text-sm font-medium"
                >
                  <GithubIcon /> GitHub
                </button>
                <button
                  type="button"
                  onClick={() => handleOAuth('google')}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-surface-2 border border-borderline rounded-xl hover:border-primary/50 hover:bg-background transition-all text-sm font-medium"
                >
                  <GoogleIcon /> Google
                </button>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center gap-4 mb-4">
                <div className="h-px flex-1 bg-borderline"></div>
                <span className="text-xs text-text-muted font-medium uppercase tracking-wider">Or</span>
                <div className="h-px flex-1 bg-borderline"></div>
              </motion.div>

              {/* Core Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
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
                      className="w-full pl-11 pr-4 py-2.5 bg-surface-2 border border-borderline rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm text-text-main placeholder-text-muted/50"
                    />
                  </div>
                </motion.div>

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
                      className="w-full pl-11 pr-12 py-2.5 bg-surface-2 border border-borderline rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm text-text-main placeholder-text-muted/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  {/* Password Strength Meter (Only on Registration) */}
                  <AnimatePresence>
                    {!isLogin && password && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-1.5 space-y-1.5 overflow-hidden"
                      >
                        <div className="flex gap-1 h-1.5">
                          {[1, 2, 3, 4].map((level) => {
                            let score = 0;
                            if (password.length > 5) score += 1;
                            if (password.length > 7) score += 1;
                            if (/[A-Z]/.test(password) || /[0-9]/.test(password)) score += 1;
                            if (/[^A-Za-z0-9]/.test(password)) score += 1;
                            const strength = Math.min(score, 4);
                            
                            let bgClass = "bg-borderline/50";
                            if (strength >= level) {
                              if (strength <= 1) bgClass = "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]";
                              else if (strength === 2) bgClass = "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]";
                              else if (strength === 3) bgClass = "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.4)]";
                              else bgClass = "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]";
                            }
                            return (
                              <div key={level} className={`flex-1 rounded-full transition-all duration-300 ${bgClass}`} />
                            )
                          })}
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-text-muted/60 font-body">Min 6 chars</span>
                          <span className="text-text-muted font-orbitron font-bold tracking-widest uppercase">
                            {(() => {
                              let score = 0;
                              if (password.length > 5) score += 1;
                              if (password.length > 7) score += 1;
                              if (/[A-Z]/.test(password) || /[0-9]/.test(password)) score += 1;
                              if (/[^A-Za-z0-9]/.test(password)) score += 1;
                              const strength = Math.min(score, 4);
                              if (strength <= 1) return <span className="text-red-400">Weak</span>;
                              if (strength === 2) return <span className="text-yellow-400">Fair</span>;
                              if (strength === 3) return <span className="text-blue-400">Good</span>;
                              return <span className="text-green-400">Strong</span>;
                            })()}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

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
                          className="w-full pl-11 pr-12 py-2.5 bg-surface-2 border border-borderline rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm text-text-main placeholder-text-muted/50"
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

              <motion.div variants={itemVariants} className="mt-4 flex flex-col items-center gap-3">
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
                  className="text-sm font-medium flex items-center gap-2 text-text-muted hover:text-primary transition-colors px-4 py-1.5 rounded-lg hover:bg-surface-2"
                >
                  <User className="w-4 h-4" /> Skip & Continue as Guest
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
