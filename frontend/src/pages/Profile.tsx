import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Edit3 } from 'lucide-react';
import { ProfileRankCard } from '../components/profile/ProfileRankCard';
import { ProfileStatsGrid } from '../components/profile/ProfileStatsGrid';
import { FeaturedBadges } from '../components/profile/FeaturedBadges';

export const ProfilePage: React.FC = () => {
  // Mock Data - To be replaced with Zustand/Supabase hooks
  const userProfile = {
    displayName: "John Michael A. Nave",
    course: "BS Computer Engineering",
    yearLevel: 3,
    bio: "Project Manager & Full-Stack Developer. Forging my path to the FE!",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    totalXp: 8450,
    rankLevel: 5,
    rankTitle: "Engineer",
    nextLevelXp: 13000,
    currentStreak: 12,
    longestStreak: 14,
    streakFreezesAvailable: 1,
    featuredBadges: [
      { id: '1', name: 'Week Warrior', icon: '🔥', description: 'Maintained a 7-day study streak.' },
      { id: '2', name: 'Sharpshooter', icon: '⭐', description: 'Achieved 90%+ accuracy in a session.' },
      { id: '3', name: 'First Step', icon: '📚', description: 'Answered your first FE question.' },
    ]
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto space-y-6 pb-12"
    >
      
      {/* Header Section */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8 shadow-sm relative overflow-hidden"
      >
        {/* Dynamic theme-compliant background accent */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] opacity-10"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <motion.img 
              whileHover={{ scale: 1.05 }}
              src={userProfile.avatarUrl} 
              alt={userProfile.displayName} 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[var(--color-surface)] shadow-md bg-[var(--color-surface-2)] cursor-pointer"
            />
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-0 right-0 p-2 bg-[var(--color-primary)] text-white rounded-full shadow-lg hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </motion.button>
          </div>
          
          <div className="flex-grow">
            <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] font-display tracking-tight">
              {userProfile.displayName}
            </h1>
            <p className="text-lg text-[var(--color-text-muted)] font-medium mt-1">
              {userProfile.yearLevel}rd Year • {userProfile.course}
            </p>
            <p className="mt-3 text-[var(--color-text-primary)] max-w-2xl">
              {userProfile.bio}
            </p>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0 self-start md:self-center">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="border border-[var(--color-border)] text-[var(--color-text-primary)] bg-[var(--color-surface)] rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-[var(--color-surface-2)] transition-colors font-medium shadow-sm"
            >
              <Settings className="w-4 h-4 text-[var(--color-text-muted)]" />
              Settings
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Progression Components */}
      <ProfileRankCard 
        level={userProfile.rankLevel} 
        title={userProfile.rankTitle} 
        currentXp={userProfile.totalXp} 
        nextLevelXp={userProfile.nextLevelXp} 
      />

      <ProfileStatsGrid 
        totalXp={userProfile.totalXp}
        currentStreak={userProfile.currentStreak}
        longestStreak={userProfile.longestStreak}
        streakFreezes={userProfile.streakFreezesAvailable}
      />

      <FeaturedBadges badges={userProfile.featuredBadges} />
      
    </motion.div>
  );
};

export default ProfilePage;