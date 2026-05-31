// src/components/gamification/DailyHeader.tsx
import { motion, type Variants } from 'framer-motion';
import { Flame } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface DailyHeaderProps {
  fadeUpVariant: Variants;
}

export function DailyHeader({ fadeUpVariant }: DailyHeaderProps) {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeUpVariant}
      className="flex flex-col items-center justify-center text-center mt-4"
    >
      <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(var(--color-primary),0.2)]">
        <Flame className="w-8 h-8 text-primary" />
      </div>
      
      <Badge className="mb-4 bg-surface-2/60 backdrop-blur-sm text-text-muted border-borderline font-orbitron tracking-widest uppercase text-[10px] leading-none pt-1.5 pb-1">
        High-Stakes Protocol
      </Badge>
      
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-main font-display tracking-tight leading-none mb-4 pt-1">
        Daily <span className="text-primary">Challenge.</span>
      </h1>
      
      {/* FIX: Corrected to 10 questions per the documentation */}
      <p className="text-sm sm:text-base text-text-muted max-w-xl leading-relaxed">
        One attempt. 10 curated questions spanning all PhilNITS FE topics. Succeed to earn massive XP multipliers and protect your streak.
      </p>
    </motion.div>
  );
}