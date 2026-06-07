import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Edit3, User as UserIcon } from 'lucide-react';
import { ProfileRankCard } from '../components/profile/ProfileRankCard';
import { ProfileStatsGrid } from '../components/profile/ProfileStatsGrid';
import { FeaturedBadges } from '../components/profile/FeaturedBadges';
import { useProfile } from '../hooks/useProfile';
import { ProfileEditModal } from '../components/profile/ProfileEditModal';
import { useAuth } from '../store/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center h-64 text-text-muted">
        <UserIcon className="w-16 h-16 mb-4 opacity-50" />
        <h2 className="text-xl font-display font-bold">Profile Not Found</h2>
        <p className="mt-2 text-sm">Please log in or try refreshing the page.</p>
      </div>
    );
  }

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
        className="rounded-3xl border border-borderline bg-surface/80 backdrop-blur-xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden group"
      >
        {/* Dynamic theme-compliant background accent */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/30 transition-colors duration-700"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-accent/30 transition-colors duration-700"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
          <div className="relative">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative rounded-full p-1 bg-gradient-to-tr from-primary to-accent"
            >
              <img 
                src={profile.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'} 
                alt={profile.display_name} 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-surface shadow-xl bg-surface-2 object-cover"
              />
            </motion.div>
            <motion.button 
              onClick={() => setIsEditModalOpen(true)}
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-1 right-1 p-2.5 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors ring-4 ring-surface"
            >
              <Edit3 className="w-4 h-4" />
            </motion.button>
          </div>
          
          <div className="flex-grow">
            <h1 className="text-3xl md:text-4xl font-extrabold text-text-main font-display tracking-tight drop-shadow-sm">
              {profile.display_name}
            </h1>
            <p className="text-lg text-primary font-semibold mt-1">
              {profile.year_level ? `${profile.year_level} Year` : 'Student'} • {profile.course || 'IT / CS'}
            </p>
            <p className="mt-4 text-text-muted max-w-2xl text-base leading-relaxed">
              {profile.bio || "No bio yet. Click the edit button to tell us about your journey!"}
            </p>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0 self-start md:self-center">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="border border-borderline text-text-main bg-surface-2 rounded-xl px-5 py-2.5 flex items-center gap-2 hover:bg-surface transition-colors font-medium shadow-sm hover:shadow-md"
            >
              <Settings className="w-4 h-4 text-text-muted" />
              Settings
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Progression Components */}
      <ProfileRankCard 
        level={profile.calculatedLevel} 
        title={profile.rankTitle} 
        currentXp={profile.total_xp} 
        nextLevelXp={profile.nextLevelXp} 
      />

      <ProfileStatsGrid 
        totalXp={profile.total_xp}
        currentStreak={profile.current_streak}
        longestStreak={profile.longest_streak}
        streakFreezes={profile.streak_freezes_available}
      />

      {/* Mock Badges for now - can be connected to user_badges table later */}
      <FeaturedBadges badges={[
        { id: '1', name: 'First Step', icon: '📚', description: 'Joined NITSForge.' },
      ]} />
      
      {/* Edit Modal */}
      <ProfileEditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onSave={updateProfile}
      />
    </motion.div>
  );
};

export default ProfilePage;