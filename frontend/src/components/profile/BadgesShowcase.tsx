import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Lock, Trophy, Star } from 'lucide-react';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  requirement: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

interface BadgesShowcaseProps {
  badges: Badge[];
}

const RARITY_COLORS = {
  common: 'from-gray-400 to-gray-500 shadow-gray-400/20',
  rare: 'from-blue-400 to-blue-600 shadow-blue-500/30',
  epic: 'from-purple-400 to-purple-600 shadow-purple-500/30',
  legendary: 'from-yellow-400 to-yellow-600 shadow-yellow-500/40',
};

export const BadgesShowcase: React.FC<BadgesShowcaseProps> = ({ badges }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  // Pick top 3 unlocked badges to showcase (or first 3 if not enough unlocked)
  const unlockedBadges = badges.filter(b => b.unlocked);
  const majorBadges = unlockedBadges.length >= 3 
    ? unlockedBadges.slice(0, 3) 
    : [...unlockedBadges, ...badges.filter(b => !b.unlocked)].slice(0, 3);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-3xl border border-borderline bg-surface/80 backdrop-blur-sm shadow-lg overflow-hidden"
    >
      {/* Top Section - Major Badges Showcase */}
      <div className="p-6 md:p-8 relative overflow-hidden">
        {/* Subtle background effects reduced for performance */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-2xl rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 blur-xl rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div>
            <h3 className="text-2xl font-orbitron font-bold text-text-main flex items-center gap-3">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Gym Badges
            </h3>
            <p className="text-sm text-text-muted mt-1">
              {unlockedBadges.length} / {badges.length} Badges Unlocked
            </p>
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-surface-2 text-primary font-bold hover:bg-primary hover:text-white transition-colors duration-300 shadow-sm"
          >
            {isExpanded ? 'Hide All Badges' : 'View All Badges'}
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* 3 Major Badges Display */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto">
          {majorBadges.map((badge, idx) => (
            <motion.div 
              key={badge.id}
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => setSelectedBadge(badge)}
              className={`flex flex-col items-center gap-3 cursor-pointer group`}
            >
              <div className={`
                relative w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center text-4xl md:text-5xl shadow-lg transition-all duration-300
                ${badge.unlocked 
                  ? `bg-gradient-to-br ${RARITY_COLORS[badge.rarity || 'common']} border-4 border-white/20 group-hover:shadow-[0_0_25px_rgba(var(--color-primary),0.5)]` 
                  : 'bg-surface-2 border-4 border-borderline grayscale opacity-60'}
              `}>
                <span className="drop-shadow-md z-10">{badge.icon}</span>
                {!badge.unlocked && <Lock className="absolute inset-0 m-auto text-text-muted/50 w-8 h-8" />}
                
                {/* Shine effect for unlocked badges */}
                {badge.unlocked && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rotate-45"></div>
                )}
              </div>
              <p className={`font-orbitron font-bold text-center text-xs md:text-sm ${badge.unlocked ? 'text-text-main group-hover:text-primary transition-colors' : 'text-text-muted'}`}>
                {badge.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Expanded All Badges Section (Accordion) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="border-t border-borderline bg-surface/50"
          >
            <div className="p-6 md:p-8">
              <h4 className="font-orbitron font-bold text-text-main mb-6 text-lg">Badge Collection</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {badges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedBadge(badge)}
                    className={`flex flex-col items-center gap-2 cursor-pointer p-3 rounded-2xl transition-all ${selectedBadge?.id === badge.id ? 'bg-surface-2 ring-2 ring-primary' : 'hover:bg-surface-2/50'}`}
                  >
                    <div className={`
                      w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm
                      ${badge.unlocked 
                        ? `bg-gradient-to-br ${RARITY_COLORS[badge.rarity || 'common']} border-2 border-white/20` 
                        : 'bg-background border-2 border-borderline grayscale opacity-40'}
                    `}>
                      {badge.icon}
                    </div>
                    <p className={`text-xs text-center font-bold ${badge.unlocked ? 'text-text-main' : 'text-text-muted'}`}>
                      {badge.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Badge Info Panel (Tooltip / Detail Box) */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md bg-surface/95 backdrop-blur-xl border border-borderline shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-3xl p-6"
          >
            <button 
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-main transition-colors"
            >
              ✕
            </button>
            <div className="flex gap-5 items-center mb-4">
              <div className={`
                w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg shrink-0
                ${selectedBadge.unlocked 
                  ? `bg-gradient-to-br ${RARITY_COLORS[selectedBadge.rarity || 'common']} border-2 border-white/20` 
                  : 'bg-surface-2 border-2 border-borderline grayscale opacity-50'}
              `}>
                {selectedBadge.icon}
              </div>
              <div>
                <h4 className="font-orbitron font-bold text-xl text-text-main mb-1">
                  {selectedBadge.name}
                </h4>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${selectedBadge.unlocked ? 'bg-primary/10 text-primary' : 'bg-gray-500/10 text-gray-500'}`}>
                  {selectedBadge.unlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>
            </div>
            
            <div className="space-y-3 bg-surface-2/50 rounded-2xl p-4">
              <p className="text-sm text-text-main leading-relaxed">
                {selectedBadge.description}
              </p>
              <div className="pt-3 border-t border-borderline/50">
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Star className="w-3 h-3" /> Requirement
                </p>
                <p className="text-sm font-medium text-text-main">
                  {selectedBadge.requirement}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay to close tooltip by clicking outside */}
      {selectedBadge && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setSelectedBadge(null)}
        />
      )}
    </motion.div>
  );
};
