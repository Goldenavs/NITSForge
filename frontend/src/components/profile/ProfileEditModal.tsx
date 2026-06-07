import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Save } from 'lucide-react';
import type { UserProfile } from '../../hooks/useProfile';
import { Button } from '../ui/Button';

// 10 Preset Avatars
const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=NITSForge1',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=NITSForge2',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=NITSForge3',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=NITSForge4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=NITSForge5',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Robot1',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Robot2',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Smile1',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Smile2',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Pixel1',
];

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updates: Partial<UserProfile>) => Promise<void>;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose, profile, onSave }) => {
  const [displayName, setDisplayName] = useState(profile.display_name || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [course, setCourse] = useState(profile.course || '');
  const [yearLevel, setYearLevel] = useState(profile.year_level?.toString() || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || PRESET_AVATARS[0]);
  const [loading, setLoading] = useState(false);

  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave({
      display_name: displayName,
      bio,
      course,
      year_level: yearLevel ? parseInt(yearLevel) : null,
      avatar_url: avatarUrl,
    });
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-surface border border-borderline rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-borderline bg-surface-2/50">
            <h2 className="text-xl font-display font-bold">Edit Profile</h2>
            <button onClick={onClose} className="p-2 hover:bg-surface rounded-full transition-colors">
              <X className="w-5 h-5 text-text-muted hover:text-text-main" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar">
            <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-6">
              
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-surface shadow-md bg-surface-2 object-cover" />
                  <button 
                    type="button"
                    onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                  >
                    <Upload className="w-6 h-6" />
                  </button>
                </div>
                
                {showAvatarPicker && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="w-full bg-surface-2 p-4 rounded-xl border border-borderline"
                  >
                    <p className="text-sm font-medium mb-3 text-text-muted">Choose an Avatar</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {PRESET_AVATARS.map((url, idx) => (
                        <img 
                          key={idx}
                          src={url} 
                          onClick={() => setAvatarUrl(url)}
                          className={`w-12 h-12 rounded-full cursor-pointer transition-all hover:scale-110 ${avatarUrl === url ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface' : 'opacity-70 hover:opacity-100'}`}
                        />
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-borderline">
                      <label className="text-xs font-semibold text-text-muted uppercase mb-2 block">Or paste custom image URL</label>
                      <input 
                        type="url" 
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://example.com/my-avatar.jpg"
                        className="w-full px-3 py-2 bg-background border border-borderline rounded-lg text-sm focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Text Fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-text-muted">Display Name</label>
                  <input 
                    type="text" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="w-full mt-1 px-4 py-2 bg-surface-2 border border-borderline rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all text-text-main"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-text-muted">Bio</label>
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    placeholder="Tell us about your IT journey..."
                    className="w-full mt-1 px-4 py-2 bg-surface-2 border border-borderline rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all resize-none text-text-main"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-text-muted">Course / Major</label>
                    <input 
                      type="text" 
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      placeholder="BS Computer Science"
                      className="w-full mt-1 px-4 py-2 bg-surface-2 border border-borderline rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all text-text-main"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-text-muted">Year Level</label>
                    <input 
                      type="number" 
                      value={yearLevel}
                      onChange={(e) => setYearLevel(e.target.value)}
                      min="1"
                      max="10"
                      placeholder="3"
                      className="w-full mt-1 px-4 py-2 bg-surface-2 border border-borderline rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all text-text-main"
                    />
                  </div>
                </div>
              </div>

            </form>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-borderline bg-surface-2/50 flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button form="edit-profile-form" type="submit" disabled={loading} className="gap-2">
              <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
