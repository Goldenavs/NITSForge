// src/pages/Settings.tsx
import { motion, type Variants } from 'framer-motion';
import { Monitor, Palette, Sparkles, Moon, Sun } from 'lucide-react';
import { useTheme } from '../store/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function Settings() {
  const { theme, setTheme, bgMode, setBgMode } = useTheme();

  // Reordered and typed for Light/Dark categorization
  const themes = [
    // --- DARK THEMES ---
    { id: 'obsidian', name: 'Obsidian', desc: 'High contrast black & gold', color: 'bg-amber-500', type: 'dark' },
    { id: 'midnight', name: 'Midnight', desc: 'Deep navy & electric blue', color: 'bg-blue-500', type: 'dark' },
    { id: 'forest', name: 'Forest', desc: 'Deep woods brown & vivid green', color: 'bg-green-500', type: 'dark' },
    // --- LIGHT THEMES ---
    { id: 'ember', name: 'Ember', desc: 'Warm orange & gray', color: 'bg-orange-500', type: 'light' },
    { id: 'sakura', name: 'Sakura', desc: 'Light pink & off-white', color: 'bg-pink-500', type: 'light' },
    { id: 'arctic', name: 'Arctic', desc: 'Clean white & ice blue', color: 'bg-cyan-500', type: 'light' },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-8 w-full max-w-4xl mx-auto pb-24 px-4 sm:px-8 pt-4"
    >
      <motion.div variants={itemVariants} className="flex flex-col items-start">
        <Badge className="mb-3 bg-surface-2/60 text-text-muted border-borderline font-orbitron tracking-widest uppercase text-[10px]">
          Configuration
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-bold text-text-main font-display tracking-tight leading-none">
          System <span className="text-primary">Settings.</span>
        </h1>
      </motion.div>

      {/* Visuals & Performance Settings */}
      <motion.div variants={itemVariants}>
        <Card className="bg-surface/85 backdrop-blur-md border border-borderline/60 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-borderline/30 pb-4">
            <CardTitle className="font-display font-bold text-xl flex items-center gap-2">
              <Monitor className="w-5 h-5 text-primary" /> Visuals & Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-text-main font-display font-bold mb-1 flex items-center gap-2">
                  Interactive Background <Sparkles className="w-4 h-4 text-accent" />
                </p>
                <p className="text-sm text-text-muted leading-relaxed max-w-2xl">
                  Adjust the visual fidelity of the background. Lower settings save battery and improve performance, while higher settings add more physics, speed, and particle effects.
                </p>
              </div>
              
              {/* 4-Step Slider */}
              <div className="relative flex items-center w-full max-w-xl bg-surface-2/40 border border-borderline/50 rounded-2xl p-1.5 overflow-hidden">
                {[
                  { val: 0, label: 'Performance' },
                  { val: 1, label: 'Static' },
                  { val: 2, label: 'Standard' },
                  { val: 3, label: 'Overclocked' }
                ].map((mode) => {
                  const isActive = bgMode === mode.val;
                  return (
                    <button
                      key={mode.val}
                      onClick={() => setBgMode(mode.val as any)}
                      className={`relative flex-1 py-2.5 text-xs sm:text-sm font-bold tracking-wide rounded-xl transition-colors z-10 ${isActive ? 'text-surface' : 'text-text-muted hover:text-text-main'}`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="bgModeActiveIndicator"
                          className="absolute inset-0 bg-primary rounded-xl shadow-md -z-10"
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        />
                      )}
                      {mode.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Theme Selector */}
      <motion.div variants={itemVariants}>
        <Card className="bg-surface/85 backdrop-blur-md border border-borderline/60 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-borderline/30 pb-4">
            <CardTitle className="font-display font-bold text-xl flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" /> Global Theme
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={`relative flex flex-col items-start p-4 rounded-xl border-2 transition-all duration-300 text-left overflow-hidden group ${
                    theme === t.id 
                      ? 'border-primary bg-primary/5 shadow-md scale-[1.02]' 
                      : 'border-borderline/50 bg-surface-2/30 hover:border-text-muted/30'
                  }`}
                >
                  {/* Theme Mode Indicator Badge */}
                  <div className={`absolute top-3 right-3 flex items-center justify-center w-6 h-6 rounded-full border transition-colors ${
                    theme === t.id ? 'bg-primary text-surface border-primary' : 'bg-surface border-borderline text-text-muted group-hover:text-text-main'
                  }`}>
                    {t.type === 'dark' ? <Moon size={12} strokeWidth={2.5} /> : <Sun size={12} strokeWidth={2.5} />}
                  </div>

                  <div className="flex items-center gap-3 mb-2 pr-8">
                    <span className={`w-4 h-4 rounded-full ${t.color} shadow-sm shrink-0`} />
                    <span className="font-display font-bold text-text-main truncate">{t.name}</span>
                  </div>
                  <span className="text-xs text-text-muted font-body pr-2">{t.desc}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

    </motion.div>
  );
}