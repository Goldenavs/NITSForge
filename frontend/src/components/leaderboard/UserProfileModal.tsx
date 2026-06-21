import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Flame, Target, BookOpen, GraduationCap } from 'lucide-react';
import { supabase } from '../../services/supabase';
import type { LeaderboardEntry } from '../../hooks/useLeaderboard';
import { CategoryRadar } from '../dashboard/DashboardCharts';
import { Badge } from '../ui/Badge';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: LeaderboardEntry | null;
}

export function UserProfileModal({ isOpen, onClose, user }: UserProfileModalProps) {
  const [stats, setStats] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      if (isOpen && user?.user_id) {
        setIsLoadingStats(true);
        try {
          const { data, error } = await supabase.rpc('get_dashboard_stats', { p_user_id: user.user_id });
          if (!error && data) {
            setStats(data);
          }
        } catch (err) {
          console.error("Failed to fetch user stats", err);
        } finally {
          setIsLoadingStats(false);
        }
      } else {
        setStats(null);
      }
    }
    fetchStats();
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-surface/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-2xl bg-surface border border-borderline rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Banner */}
          <div className="relative h-32 sm:h-48 w-full bg-gradient-to-r from-primary/40 to-accent/40 shrink-0">
            {user.banner_url && (
              <img src={user.banner_url} alt="Banner" className="w-full h-full object-cover opacity-80" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
          </div>

          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden p-6 sm:p-8 pt-0 -mt-12 sm:-mt-16">
            {/* Header / Avatar */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-end relative z-10">
              <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-full border-4 border-surface bg-surface-2 overflow-hidden shadow-xl flex items-center justify-center">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.display_name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-display font-bold text-4xl sm:text-5xl text-primary leading-none pt-2">
                    {user.display_name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-text-main leading-tight">
                  {user.display_name}
                </h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    Lvl {user.rank_level}
                  </Badge>
                  {user.course && (
                    <span className="flex items-center gap-1 text-xs font-orbitron text-text-muted tracking-wide uppercase">
                      <BookOpen className="w-3 h-3" /> {user.course}
                    </span>
                  )}
                  {user.year_level && (
                    <span className="flex items-center gap-1 text-xs font-orbitron text-text-muted tracking-wide uppercase">
                      <GraduationCap className="w-3 h-3" /> Yr {user.year_level}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="mt-6 text-sm text-text-muted text-center sm:text-left leading-relaxed">
                "{user.bio}"
              </div>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              <div className="bg-surface-2/40 border border-borderline rounded-xl p-4 flex flex-col items-center justify-center">
                <Trophy className="w-5 h-5 text-yellow-400 mb-2" />
                <span className="text-xl font-orbitron font-bold text-text-main">{user.total_xp.toLocaleString()}</span>
                <span className="text-[9px] uppercase tracking-widest text-text-muted font-bold">Total XP</span>
              </div>
              <div className="bg-surface-2/40 border border-borderline rounded-xl p-4 flex flex-col items-center justify-center">
                <Flame className="w-5 h-5 text-orange-500 mb-2" />
                <span className="text-xl font-orbitron font-bold text-text-main">{user.current_streak || 0}</span>
                <span className="text-[9px] uppercase tracking-widest text-text-muted font-bold">Curr Streak</span>
              </div>
              <div className="bg-surface-2/40 border border-borderline rounded-xl p-4 flex flex-col items-center justify-center">
                <Target className="w-5 h-5 text-emerald-500 mb-2" />
                <span className="text-xl font-orbitron font-bold text-text-main">
                  {stats?.overview?.overall_accuracy ? `${stats.overview.overall_accuracy}%` : '-'}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-text-muted font-bold">Overall Acc</span>
              </div>
              <div className="bg-surface-2/40 border border-borderline rounded-xl p-4 flex flex-col items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-500 mb-2" />
                <span className="text-xl font-orbitron font-bold text-text-main">
                  {stats?.overview?.total_questions_answered?.toLocaleString() || '-'}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-text-muted font-bold">Answered</span>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="mt-8 flex-1 min-h-[350px] relative rounded-xl overflow-hidden border border-borderline bg-surface-2/20">
              {isLoadingStats ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted gap-3">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="font-orbitron text-xs tracking-widest uppercase">Fetching Diagnostics...</span>
                </div>
              ) : stats?.category_radar ? (
                <div className="w-full h-full transform scale-90 sm:scale-100 origin-center">
                  <CategoryRadar data={stats.category_radar} />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-text-muted font-orbitron text-xs tracking-widest uppercase">
                  No Data Available
                </div>
              )}
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
