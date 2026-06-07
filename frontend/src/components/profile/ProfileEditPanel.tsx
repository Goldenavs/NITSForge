import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Save, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import type { UserProfile } from '../../hooks/useProfile';
import { Button } from '../ui/Button';
import { uploadProfileImage } from '../../services/storage';

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

const PRESET_BANNERS = [
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
  'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=800&q=80'
];

const PRESET_FRAMES = [
  { id: 'none', name: 'None', class: '' },
  { id: 'neon', name: 'Neon Pulse', class: 'ring-4 ring-primary shadow-[0_0_15px_rgba(var(--color-primary),0.8)] animate-pulse' },
  { id: 'gold', name: 'Golden Vanguard', class: 'ring-4 ring-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)]' },
  { id: 'circuit', name: 'Circuit Board', class: 'border-[6px] border-dashed border-accent' }
];

interface ProfileEditPanelProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updates: Partial<UserProfile>) => Promise<void>;
}

export const ProfileEditPanel: React.FC<ProfileEditPanelProps> = ({ isOpen, onClose, profile, onSave }) => {
  const [displayName, setDisplayName] = useState(profile.display_name || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [course, setCourse] = useState(profile.course || '');
  const [yearLevel, setYearLevel] = useState(profile.year_level?.toString() || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || PRESET_AVATARS[0]);
  const [bannerUrl, setBannerUrl] = useState(profile.banner_url || '');
  const [avatarFrame, setAvatarFrame] = useState(profile.avatar_frame || 'none');
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<'info' | 'avatar' | 'banner' | 'frames'>('info');
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave({
      display_name: displayName,
      bio,
      course,
      year_level: yearLevel ? parseInt(yearLevel) : null,
      avatar_url: avatarUrl,
      banner_url: bannerUrl,
      avatar_frame: avatarFrame,
    });
    setLoading(false);
    onClose();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'avatars' | 'banners') => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const url = await uploadProfileImage(file, type, profile.id);
      if (type === 'avatars') setAvatarUrl(url);
      if (type === 'banners') setBannerUrl(url);
    } catch (err) {
      console.error(err);
      alert('Failed to upload image. Make sure you created the bucket in Supabase!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0, y: -20 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0, y: -20, transition: { duration: 0.2 } }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full bg-gradient-to-b from-surface to-surface-2 border border-borderline rounded-b-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden z-0 -mt-6 pt-6 relative"
        >
          {/* Subtle inner glow for depth */}
          <div className="absolute inset-0 bg-primary/5 pointer-events-none mix-blend-overlay"></div>

          <div className="p-6 md:p-8 relative z-10">
            <div className="flex items-center justify-center border-b border-borderline pb-4 mb-6">
              <div className="flex flex-wrap gap-4 md:gap-8 w-full justify-center">
                <button 
                  onClick={() => setActiveTab('info')}
                  className={`font-orbitron tracking-widest text-sm pb-4 -mb-[17px] border-b-2 transition-colors whitespace-nowrap ${activeTab === 'info' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-main'}`}
                >
                  Basic Info
                </button>
                <button 
                  onClick={() => setActiveTab('avatar')}
                  className={`font-orbitron tracking-widest text-sm pb-4 -mb-[17px] border-b-2 transition-colors whitespace-nowrap ${activeTab === 'avatar' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-main'}`}
                >
                  Avatar
                </button>
                <button 
                  onClick={() => setActiveTab('banner')}
                  className={`font-orbitron tracking-widest text-sm pb-4 -mb-[17px] border-b-2 transition-colors whitespace-nowrap ${activeTab === 'banner' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-main'}`}
                >
                  Banner
                </button>
                <button 
                  onClick={() => setActiveTab('frames')}
                  className={`font-orbitron tracking-widest text-sm pb-4 -mb-[17px] border-b-2 transition-colors whitespace-nowrap ${activeTab === 'frames' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-main'}`}
                >
                  Frames
                </button>
              </div>
            </div>

            <form id="edit-profile-form" onSubmit={handleSubmit} className="min-h-[250px]">
              
              {activeTab === 'info' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 grid md:grid-cols-2 gap-x-6">
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-text-muted">Display Name</label>
                    <input 
                      type="text" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                      className="w-full mt-1.5 px-4 py-2.5 bg-background border border-borderline/80 shadow-inner rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-text-main font-medium"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-text-muted">Bio</label>
                    <textarea 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder="Tell us about your IT journey..."
                      className="w-full mt-1.5 px-4 py-2.5 bg-background border border-borderline/80 shadow-inner rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none text-text-main font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-text-muted">Course / Major</label>
                    <input 
                      type="text" 
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      placeholder="BS Computer Science"
                      className="w-full mt-1.5 px-4 py-2.5 bg-background border border-borderline/80 shadow-inner rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-text-main font-medium"
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
                      className="w-full mt-1.5 px-4 py-2.5 bg-background border border-borderline/80 shadow-inner rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-text-main font-medium"
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === 'avatar' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="flex items-center gap-6">
                    <img src={avatarUrl} alt="Avatar Preview" className="w-24 h-24 rounded-full border-4 border-surface shadow-md bg-surface object-cover" />
                    <div>
                      <input type="file" accept="image/png, image/jpeg" className="hidden" ref={avatarInputRef} onChange={(e) => handleFileUpload(e, 'avatars')} />
                      <Button type="button" onClick={() => avatarInputRef.current?.click()} disabled={loading} className="gap-2">
                        <Upload className="w-4 h-4" /> Upload Custom Image
                      </Button>
                      <p className="text-xs text-text-muted mt-2">Recommended: 256x256 PNG or JPG.</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-borderline">
                    <p className="text-sm font-semibold text-text-muted mb-3">Or choose a preset avatar:</p>
                    <div className="flex flex-wrap gap-3">
                      {PRESET_AVATARS.map((url, idx) => (
                        <div key={idx} onClick={() => setAvatarUrl(url)} className="relative cursor-pointer group">
                          <img 
                            src={url} 
                            className={`w-14 h-14 rounded-full transition-all hover:scale-110 bg-surface ${avatarUrl === url ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface-2 scale-110' : 'opacity-70 hover:opacity-100'}`}
                          />
                          {avatarUrl === url && (
                            <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-0.5 shadow-sm">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'banner' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="flex flex-col gap-4">
                    {bannerUrl ? (
                      <div className="relative w-full h-32 rounded-xl overflow-hidden border-2 border-primary shadow-sm">
                        <img src={bannerUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                      </div>
                    ) : (
                      <div className="w-full h-32 rounded-xl border-2 border-dashed border-borderline flex items-center justify-center bg-surface">
                        <p className="text-text-muted font-medium flex items-center gap-2"><ImageIcon className="w-5 h-5"/> No banner selected</p>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4">
                      <input type="file" accept="image/png, image/jpeg" className="hidden" ref={bannerInputRef} onChange={(e) => handleFileUpload(e, 'banners')} />
                      <Button type="button" onClick={() => bannerInputRef.current?.click()} disabled={loading} className="gap-2">
                        <Upload className="w-4 h-4" /> Upload Custom Banner
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => setBannerUrl('')} disabled={!bannerUrl}>
                        Remove Banner
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-borderline">
                    <p className="text-sm font-semibold text-text-muted mb-3">Or choose a preset banner:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {PRESET_BANNERS.map((url, idx) => (
                        <div key={idx} onClick={() => setBannerUrl(url)} className={`relative h-20 rounded-lg cursor-pointer overflow-hidden transition-all ${bannerUrl === url ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface-2' : 'opacity-70 hover:opacity-100'}`}>
                          <img src={url} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'frames' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="flex flex-col items-center gap-6 pb-6 border-b border-borderline">
                    <p className="text-sm font-semibold text-text-muted">Live Preview</p>
                    <div className="relative">
                      <img 
                        src={avatarUrl} 
                        alt="Avatar Preview" 
                        className={`w-32 h-32 rounded-full object-cover bg-surface transition-all duration-300 ${PRESET_FRAMES.find(f => f.id === avatarFrame)?.class || ''}`} 
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-text-muted mb-4">Choose a Frame:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {PRESET_FRAMES.map((frame) => (
                        <div 
                          key={frame.id} 
                          onClick={() => setAvatarFrame(frame.id)} 
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-4 ${avatarFrame === frame.id ? 'border-primary bg-primary/10' : 'border-borderline hover:border-primary/50'}`}
                        >
                          <div className={`w-16 h-16 rounded-full bg-surface-2 ${frame.class}`}></div>
                          <span className="text-sm font-medium text-center">{frame.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

            </form>

            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-borderline">
              <Button form="edit-profile-form" type="submit" disabled={loading} className="gap-2 px-6">
                <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
