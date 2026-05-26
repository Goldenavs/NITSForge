// src/pages/Settings.tsx
import { useTheme } from '../store/ThemeContext';
import { Palette, Check } from 'lucide-react';

export default function Settings() {
  const { theme, setTheme } = useTheme();

  // Theme configuration with explicit hex codes for the preview bubbles
  const themes = [
    { id: 'ember', name: 'Ember Forge', previewBg: '#F97316' },
    { id: 'midnight', name: 'Midnight', previewBg: '#3B82F6' },
    { id: 'forest', name: 'Forest', previewBg: '#166534' },
    { id: 'sakura', name: 'Sakura', previewBg: '#DB2777' },
    { id: 'obsidian', name: 'Obsidian', previewBg: '#F59E0B' },
    { id: 'arctic', name: 'Arctic', previewBg: '#0EA5E9' },
  ] as const;

  return (
    <div className="animate-page-entry max-w-4xl mx-auto w-full">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-main font-display tracking-tight">Settings</h1>
        <p className="text-text-muted mt-2">Manage your app preferences and appearance.</p>
      </div>

      {/* Appearance & Theming Card */}
      <section className="bg-surface/80 backdrop-blur-sm border border-borderline rounded-2xl p-6 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg transition-colors duration-300">
            <Palette className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-main font-display">Appearance</h2>
            <p className="text-sm text-text-muted">Customize the UI theme across the entire application.</p>
          </div>
        </div>

        {/* Theme Grid Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {themes.map((t) => {
            const isActive = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                className={`relative flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left ${
                  isActive 
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/50 shadow-sm shadow-primary/10' 
                    : 'border-borderline hover:border-text-muted hover:bg-surface-2'
                }`}
              >
                {/* Color Swatch Preview */}
                <div 
                  className="w-6 h-6 rounded-full shadow-sm flex-shrink-0 border border-black/10 dark:border-white/10" 
                  style={{ backgroundColor: t.previewBg }}
                />
                
                {/* Theme Name */}
                <span className={`font-medium transition-colors ${isActive ? 'text-primary' : 'text-text-main'}`}>
                  {t.name}
                </span>

                {/* Active Checkmark Indicator */}
                {isActive && (
                  <Check className="w-4 h-4 text-primary absolute right-4 animate-in fade-in zoom-in duration-200" strokeWidth={3} />
                )}
              </button>
            );
          })}
        </div>
      </section>

    </div>
  );
}