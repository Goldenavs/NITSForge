// src/components/gamification/RewardCard.tsx
import { motion, type Variants } from 'framer-motion';
import { Card } from '../ui/Card';

interface RewardCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  iconColorClass: string;
  bgIconClass: string;
  hoverBorderClass: string;
  fadeUpVariant: Variants;
}

export function RewardCard({ 
  title, 
  description, 
  icon: Icon, 
  iconColorClass, 
  bgIconClass, 
  hoverBorderClass, 
  fadeUpVariant 
}: RewardCardProps) {
  return (
    <motion.div variants={fadeUpVariant} className="h-full">
      <Card className={`h-full bg-surface/85 backdrop-blur-md border border-borderline/60 flex flex-col items-center text-center p-6 transition-colors duration-300 ${hoverBorderClass}`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${bgIconClass}`}>
          <Icon className={`w-5 h-5 ${iconColorClass}`} />
        </div>
        <h3 className="font-display font-bold text-text-main leading-none pt-1 mb-2">{title}</h3>
        <p className="text-xs text-text-muted font-body leading-relaxed">{description}</p>
      </Card>
    </motion.div>
  );
}