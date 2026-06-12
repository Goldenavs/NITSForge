// src/pages/DailyChallenge.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { motion, type Variants } from 'framer-motion';
import { Trophy, Flame, Zap } from 'lucide-react';
import { DailyHeader } from '../components/gamification/DailyHeader';
import { CountdownCard } from '../components/gamification/CountdownCard';
import { RewardCard } from '../components/gamification/RewardCard';

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 24 } }
};

const viewportConfig = { once: true, margin: "-50px" };

export default function DailyChallenge() {
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('last_daily_challenge_date')
        .eq('id', session.user.id)
        .single();

      if (!error && data?.last_daily_challenge_date) {
        const today = new Date().toISOString().split('T')[0];
        if (data.last_daily_challenge_date === today) {
          setIsCompleted(true);
        }
      }
    };
    checkStatus();
  }, []);

  return (
    <div className="flex flex-col gap-8 sm:gap-10 w-full max-w-4xl mx-auto pb-24 px-1 sm:px-0 pt-4">
      
      <DailyHeader fadeUpVariant={fadeUpVariant} />

      <CountdownCard 
        isCompleted={isCompleted} 
        viewportConfig={viewportConfig} 
        fadeUpVariant={fadeUpVariant} 
      />

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mt-2"
      >
        <RewardCard 
          title="Double XP" 
          description="Earn 2x the standard experience points for every correct answer in this session."
          icon={Trophy}
          iconColorClass="text-amber-500" // Kept specific for "Gold/XP" mental model
          bgIconClass="bg-amber-500/10"
          hoverBorderClass="hover:border-amber-500/40"
          fadeUpVariant={fadeUpVariant}
        />
        <RewardCard 
          title="Streak Repair" 
          description="Completing the challenge instantly restores your streak if you missed yesterday."
          icon={Flame}
          iconColorClass="text-primary" // Dynamic theme color
          bgIconClass="bg-primary/10"
          hoverBorderClass="hover:border-primary/40"
          fadeUpVariant={fadeUpVariant}
        />
        <RewardCard 
          title="Adaptive Focus" 
          description="Questions are specifically targeted at topics where your accuracy is below 70%."
          icon={Zap}
          iconColorClass="text-accent" // Dynamic theme color
          bgIconClass="bg-accent/10"
          hoverBorderClass="hover:border-accent/40"
          fadeUpVariant={fadeUpVariant}
        />
      </motion.div>

    </div>
  );
}