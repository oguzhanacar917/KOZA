import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ACHIEVEMENTS, getAchievementProgress } from '../utils/achievements';
import { Trash2, BookOpen, Gamepad2, Award, TrendingUp, Lock, Star, Zap } from 'lucide-react';
import CocoonStage from '../components/cocoon/CocoonStage';
import MilestoneNotification from '../components/cocoon/MilestoneNotification';
import { getOzToNextStage } from '../utils/cocoon/stageCalculator';
import GalaxyCard from '../components/galaxy/GalaxyCard';
import GalaxyButton from '../components/galaxy/GalaxyButton';
import GalaxyStat from '../components/galaxy/GalaxyStat';
import GalaxyProgress from '../components/galaxy/GalaxyProgress';
import GalaxyGrid from '../components/galaxy/GalaxyGrid';
import { GalaxyList, GalaxyListItem } from '../components/galaxy/GalaxyList';
import GalaxyBadge from '../components/galaxy/GalaxyBadge';
import GalaxyContainer from '../components/galaxy/GalaxyContainer';

const ProfileTab = () => {
    const { user, savedStories, deleteStory, setCurrentView } = useApp();
    const [previousOz, setPreviousOz] = useState(user.totalXP);
    const prevOzRef = useRef(user.totalXP);

    const progressPercent = (user.xp / user.nextLevelXp) * 100;
    const ozToNextStage = getOzToNextStage(user.totalXP);

    // Track ÖZ changes for milestone notifications
    useEffect(() => {
        if (user.totalXP !== prevOzRef.current) {
            setPreviousOz(prevOzRef.current);
            prevOzRef.current = user.totalXP;
        }
    }, [user.totalXP]);

    // Get unlocked and locked achievements
    const unlockedAchievements = ACHIEVEMENTS.filter(a => user.achievements?.includes(a.id));
    const lockedAchievements = ACHIEVEMENTS.filter(a => !user.achievements?.includes(a.id));

    const stats = {
        storiesCreated: user.storiesCreated || 0,
        gamesCreated: user.gamesCreated || 0,
        level: user.level,
        totalXP: user.totalXP || user.xp,
        dailyStreak: user.dailyStreak || 0
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 pb-32">
            {/* Milestone Notifications */}
            <MilestoneNotification previousOz={previousOz} currentOz={user.totalXP} />

            {/* Cocoon Transformation Display */}
            <GalaxyCard className="mb-6" title="Dönüşüm Yolculuğun" subtitle="Her ÖZ ile kelebeğe yaklaşıyorsun" emoji="🦋">

                {/* Cocoon Display */}
                <div style={{ minHeight: '600px', position: 'relative' }}>
                    <CocoonStage totalOz={user.totalXP} />
                </div>

                {/* ÖZ Progress Info */}
                <div className="mt-8 text-center">
                    <div className="inline-flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-full border border-primary-500/20">
                        <div>
                            <p className="text-sm text-neutral-500">Toplam ÖZ</p>
                            <p className="text-2xl font-bold text-primary-600">{user.totalXP}</p>
                        </div>
                        {ozToNextStage > 0 && (
                            <>
                                <div className="w-px h-8 bg-neutral-700" />
                                <div>
                                    <p className="text-sm text-neutral-500">Sonraki Aşamaya</p>
                                    <p className="text-xl font-semibold text-neutral-700">{ozToNextStage} ÖZ</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </GalaxyCard>

            {/* Stats Card */}
            <GalaxyCard className="mb-6" title={user.level.toString()} subtitle={user.title} emoji="📈">
                <div className="flex items-center justify-between mb-6 -mt-4">
                    <div className="text-right">
                        <p className="text-sm text-neutral-400 mb-1">İlerleme</p>
                        <p className="text-2xl font-semibold text-primary-600">
                            {user.xp} / {user.nextLevelXp} ÖZ
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-3 bg-white/40 rounded-full overflow-hidden mb-6 border border-white/60 shadow-inner">
                    <div
                        className="h-full bg-gradient-to-r from-primary-500 to-purple-600 transition-all duration-500 shadow-[0_0_10px_rgba(147,51,234,0.2)]"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>

                {/* Activity Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-white/40 rounded-xl border border-white/60">
                        <div className="text-2xl font-bold mb-1 text-neutral-900">{stats.storiesCreated}</div>
                        <div className="text-sm text-neutral-500">Hikaye</div>
                    </div>
                    <div className="p-4 bg-white/40 rounded-xl border border-white/60">
                        <div className="text-2xl font-bold mb-1 text-neutral-900">{stats.gamesCreated}</div>
                        <div className="text-sm text-neutral-500">Oyun</div>
                    </div>
                    <div className="p-4 bg-white/40 rounded-xl border border-white/60">
                        <div className="text-2xl font-bold mb-1 text-neutral-900">{stats.totalXP}</div>
                        <div className="text-sm text-neutral-500">Toplam ÖZ</div>
                    </div>
                    <div className="p-4 bg-white/40 rounded-xl border border-white/60">
                        <div className="text-2xl font-bold mb-1 text-neutral-900">{stats.dailyStreak}</div>
                        <div className="text-sm text-neutral-500">Gün Serisi</div>
                    </div>
                </div>
            </GalaxyCard>

            {/* Achievements */}
            <GalaxyCard className="mb-6" title="Başarılar" subtitle={`(${unlockedAchievements.length} / ${ACHIEVEMENTS.length})`} emoji="🏆">

                {/* Unlocked Achievements */}
                {unlockedAchievements.length > 0 && (
                    <div className="mb-6">
                        <p className="text-sm font-medium text-neutral-500 mb-3">Kazanıldı</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {unlockedAchievements.map(achievement => (
                                <div
                                    key={achievement.id}
                                    className="p-4 rounded-xl border border-primary-500/30 bg-primary-500/5 backdrop-blur-sm"
                                >
                                    <div className="text-3xl mb-2">{achievement.icon}</div>
                                    <p className="font-semibold text-sm mb-1 text-neutral-900">{achievement.name}</p>
                                    <p className="text-xs text-neutral-500 mb-2 line-clamp-2">{achievement.description}</p>
                                    <p className="text-xs font-medium text-primary-600">+{achievement.xp} ÖZ</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Locked Achievements */}
                {lockedAchievements.length > 0 && (
                    <div>
                        <p className="text-sm font-medium text-neutral-500 mb-3">Kilitli</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {lockedAchievements.map(achievement => {
                                const progress = getAchievementProgress(achievement.id, stats);
                                return (
                                    <div
                                        key={achievement.id}
                                        className="p-4 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden"
                                    >
                                        <div className="absolute inset-y-0 left-0 bg-primary-500 opacity-10" style={{ width: `${progress}%` }} />
                                        <div className="relative">
                                            <div className="text-3xl mb-2 opacity-30 grayscale">{achievement.icon}</div>
                                            <p className="font-semibold text-sm mb-1 flex items-center gap-1 text-neutral-300">
                                                <Lock size={12} />
                                                {achievement.name}
                                            </p>
                                            <p className="text-xs text-neutral-500 mb-2 line-clamp-2">{achievement.description}</p>
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs font-medium text-neutral-500">+{achievement.xp} ÖZ</p>
                                                <p className="text-xs font-medium text-primary-400">{Math.round(progress)}%</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </GalaxyCard>

            {/* Saved Stories */}
            <GalaxyCard title="Hikayelerim" subtitle={`(${savedStories.length})`} emoji="📚">

                {savedStories.length === 0 ? (
                    <div className="text-center py-12 opacity-60">
                        <BookOpen size={48} className="mx-auto mb-4 text-neutral-400" />
                        <p className="text-neutral-500 font-medium">Henüz bir hikaye oluşturmadın.</p>
                    </div>
                ) : (
                    <GalaxyList>
                        {savedStories.map(story => (
                            <GalaxyListItem
                                key={story.id}
                                icon={story.type === 'story' ? BookOpen : Gamepad2}
                                title={story.title}
                                subtitle={
                                    <span className="flex items-center gap-2">
                                        <span>{new Date(story.createdAt).toLocaleDateString('tr-TR')}</span>
                                        <span className="w-1 h-1 rounded-full bg-neutral-400" />
                                        <span className="truncate max-w-[200px]">{story.content}</span>
                                    </span>
                                }
                                onClick={() => setCurrentView({ type: story.type, data: story })}
                                action={
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteStory(story.id);
                                        }}
                                        className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                }
                            />
                        ))}
                    </GalaxyList>
                )}
            </GalaxyCard>
        </div>
    );
};

export default ProfileTab;
