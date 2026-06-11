import { ProfileRankCard } from '../components/profile/ProfileRankCard';
import { ProfileStatsGrid } from '../components/profile/ProfileStatsGrid';
import { BadgesShowcase, type Badge } from '../components/profile/BadgesShowcase';
import { useProfile } from '../hooks/useProfile';
import { ProfileEditPanel } from '../components/profile/ProfileEditPanel';
import { useAuth } from '../store/AuthContext';
import { motion } from 'framer-motion';
import { UserIcon, Edit3 } from 'lucide-react';
import { useState } from 'react';

const PRESET_FRAMES = [
  { id: 'none', name: 'None', class: '' },
  { id: 'neon', name: 'Neon Pulse', class: 'ring-4 ring-primary shadow-[0_0_15px_rgba(var(--color-primary),0.8)] animate-pulse' },
  { id: 'gold', name: 'Golden Vanguard', class: 'ring-4 ring-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)]' },
  { id: 'circuit', name: 'Circuit Board', class: 'border-[6px] border-dashed border-accent' }
];

export const ProfilePage: React.FC = () => {
  useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Gamification Mock Data
  const mockBadges: Badge[] = [
    { id: '1', name: 'First Blood', icon: '🔥', description: 'You took your very first quiz and survived. The forging has begun.', requirement: 'Complete 1 Quiz.', unlocked: true, rarity: 'common' },
    { id: '2', name: 'Streak Initiate', icon: '⚡', description: 'Kept the fire burning for 3 consecutive days. Consistency is key.', requirement: 'Maintain a 3-day streak.', unlocked: true, rarity: 'rare' },
    { id: '3', name: 'Flawless Victory', icon: '👑', description: 'A perfect score! Not a single mistake was made. You are a true scholar.', requirement: 'Score 100% on any quiz with 10+ questions.', unlocked: true, rarity: 'epic' },
    { id: '4', name: 'Marathon Scholar', icon: '⏱️', description: 'Studied for over 2 hours in a single session without breaking a sweat.', requirement: 'Complete a 2-hour study session.', unlocked: false, rarity: 'rare' },
    { id: '5', name: 'Knowledge Hoarder', icon: '📚', description: 'You have gathered an immense amount of knowledge across multiple subjects.', requirement: 'Complete 50 quizzes across 3 different topics.', unlocked: false, rarity: 'epic' },
    { id: '6', name: 'The Anomaly', icon: '🌌', description: 'You found a hidden secret or broke the curve. Legend says you are not human.', requirement: '??? (Hidden Requirement)', unlocked: false, rarity: 'legendary' },
    { id: '7', name: 'Early Bird', icon: '🌅', description: 'The early bird catches the worm. You study while others sleep.', requirement: 'Complete a quiz before 6:00 AM.', unlocked: true, rarity: 'common' },
    { id: '8', name: 'Night Owl', icon: '🦉', description: 'The night is your domain. The stars guide your knowledge.', requirement: 'Complete a quiz after midnight.', unlocked: false, rarity: 'common' },
  ];

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
        className="relative z-10 rounded-3xl p-[2px] bg-gradient-to-br from-primary via-accent to-primary bg-[length:400%_400%] animate-gradient-xy shadow-lg overflow-hidden"
      >
        <div className="bg-surface relative flex flex-col h-full w-full rounded-[22px] overflow-hidden">
          {/* The Banner Area */}
          <div className="relative h-48 md:h-64 w-full bg-surface-2 overflow-hidden">
            {profile.banner_url ? (
              <img src={profile.banner_url} alt="Profile Banner" className="w-full h-full object-cover" />
            ) : (
              <>
                {/* Background glow effect - toned down for performance */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-xl opacity-30 mix-blend-overlay"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-xl rounded-full pointer-events-none"></div>
              </>
            )}
            {/* Bottom Vignette to ensure contrast for the text below */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
          </div>

          {/* Content overlaid on the banner */}
          <div className="relative z-10 px-6 md:px-8 pb-8 pt-0 -mt-16 md:-mt-24 flex flex-col md:flex-row items-start md:items-end gap-6">
            {/* Avatar Area */}
            <div className="relative flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative rounded-full shadow-xl bg-black"
              >
                <img
                  src={profile.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'}
                  alt={profile.display_name}
                  className={`w-28 h-28 md:w-36 md:h-36 rounded-full object-cover transition-all ${profile.avatar_frame && profile.avatar_frame !== 'none' ? PRESET_FRAMES.find(f => f.id === profile.avatar_frame)?.class : 'border-[6px] border-black bg-black'}`}
                />
              </motion.div>
            </div>

            {/* Text Area (Frosted Glass Container for better contrast) */}
            <div className="flex-grow backdrop-blur-md bg-background/40 p-4 md:p-6 rounded-2xl border border-borderline/50 shadow-sm self-stretch flex flex-col justify-center mt-4 md:mt-0">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white font-display tracking-tight drop-shadow-md">
                {profile.display_name}
              </h1>
              <p className="text-lg text-primary font-bold mt-1 drop-shadow-sm">
                {profile.year_level ? `${profile.year_level} Year` : 'Student'} • {profile.course || 'IT / CS'}
              </p>
              <p className="mt-3 text-white/90 max-w-2xl text-base leading-relaxed drop-shadow-sm">
                {profile.bio || "No bio yet. Click the edit button to tell us about your journey!"}
              </p>
            </div>

            {/* Action Area */}
            <div className="flex gap-3 mt-4 md:mt-0 self-stretch md:self-end md:pb-6">
              <motion.button
                onClick={() => setIsEditModalOpen(!isEditModalOpen)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`border ${isEditModalOpen ? 'border-primary bg-primary text-white shadow-primary/30' : 'border-primary/50 text-primary bg-surface shadow-sm'} rounded-xl px-6 py-3 md:py-4 flex items-center justify-center gap-2 transition-all font-bold shadow-lg hover:shadow-xl w-full md:w-auto h-full font-display`}
              >
                <Edit3 className="w-5 h-5" />
                {isEditModalOpen ? 'Close Panel' : 'Edit Profile'}
              </motion.button>
            </div>
          </div>

          {/* Edit Panel (Slides down below the header, now inside the border) */}
          <ProfileEditPanel
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            profile={profile}
            onSave={updateProfile}
          />
        </div>
      </motion.div>

      {/* Progression Components */}
      <div className="space-y-6 pt-4">
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

        {/* Pokemon Gym Style Badges Showcase */}
        <BadgesShowcase badges={mockBadges} />
      </div>
    </motion.div>
  );
};

export default ProfilePage;