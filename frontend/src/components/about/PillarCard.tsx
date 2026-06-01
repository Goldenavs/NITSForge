import React from 'react';
import { motion } from 'framer-motion';

interface PillarCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const PillarCard: React.FC<PillarCardProps> = ({ title, description, icon }) => {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
      }}
      whileHover={{ y: -5, borderColor: 'var(--color-primary)' }}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-sm flex flex-col items-center text-center transition-colors duration-300"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] shadow-sm mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">{title}</h3>
      <p className="text-[var(--color-text-muted)] leading-relaxed">{description}</p>
    </motion.div>
  );
};