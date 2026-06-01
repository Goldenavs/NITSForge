import React from 'react';
import { motion } from 'framer-motion';

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface FeaturedBadgesProps {
  badges: Badge[];
}

export const FeaturedBadges: React.FC<FeaturedBadgesProps> = ({ badges }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Featured Achievements</h3>
        <button className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors">
          Edit
        </button>
      </div>
      
      {badges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {badges.map((badge, index) => (
            <motion.div 
              key={badge.id} 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + (index * 0.1), type: "spring" }}
              whileHover={{ scale: 1.03, y: -2 }}
              className="rounded-2xl bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)] p-4 flex flex-col items-center text-center shadow-sm cursor-pointer transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--color-surface)] shadow-sm flex items-center justify-center mb-3 border border-[var(--color-border)]">
                <span className="text-3xl">{badge.icon}</span>
              </div>
              <h4 className="font-bold text-[var(--color-text-primary)] text-sm mb-1">{badge.name}</h4>
              <p className="text-xs text-[var(--color-text-muted)]">{badge.description}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-[var(--color-text-muted)] border-2 border-dashed border-[var(--color-border)] rounded-xl">
          <p>No badges featured yet. Keep studying to unlock achievements!</p>
        </div>
      )}
    </motion.div>
  );
};