import React from 'react';
import { useApp } from '../context/AppContext';
import { ACHIEVEMENTS, getAchievementProgress } from '../utils/achievements';
import { Trash2, BookOpen, Gamepad2, Award, TrendingUp, Lock } from 'lucide-react';

const ProfileTab = () => {
    const { user, savedStories, deleteStory, setCurrentView } = useApp();

    const progressPercent = (user.xp / user.nextLevelXp) * 100;

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
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Stats Card */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-sm text-neutral-600 mb-1">Seviye</p>
                        <h2 className="text-4xl font-bold">{user.level}</h2>
                        <p className="text-sm text-neutral-600 mt-1">{user.title}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-neutral-600 mb-1">İlerleme</p>
                        <p className="text-2xl font-semibold text-primary-600">
                            {user.xp} / {user.nextLevelXp} XP
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-3 bg-neutral-100 rounded-full overflow-hidden mb-6">
                    <div
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>

                {/* Activity Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-neutral-50 rounded-lg">
                        <div className="text-2xl font-bold mb-1">{stats.storiesCreated}</div>
                        <div className="text-sm text-neutral-600">Hikaye</div>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-lg">
                        <div className="text-2xl font-bold mb-1">{stats.gamesCreated}</div>
                        <div className="text-sm text-neutral-600">Oyun</div>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-lg">
                        <div className="text-2xl font-bold mb-1">{stats.totalXP}</div>
                        <div className="text-sm text-neutral-600">Toplam XP</div>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-lg">
                        <div className="text-2xl font-bold mb-1">{stats.dailyStreak}</div>
                        <div className="text-sm text-neutral-600">Gün Serisi</div>
                    </div>
                </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Award size={20} className="text-primary-600" />
                    <h3 className="font-semibold">Başarılar</h3>
                    <span className="text-sm text-neutral-500">
                        ({unlockedAchievements.length} / {ACHIEVEMENTS.length})
                    </span>
                </div>

                {/* Unlocked Achievements */}
                {unlockedAchievements.length > 0 && (
                    <div className="mb-6">
                        <p className="text-sm font-medium text-neutral-600 mb-3">Kazanıldı</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {unlockedAchievements.map(achievement => (
                                <div
                                    key={achievement.id}
                                    className="p-4 rounded-lg border border-primary-200 bg-primary-50"
                                >
                                    <div className="text-3xl mb-2">{achievement.icon}</div>
                                    <p className="font-semibold text-sm mb-1">{achievement.name}</p>
                                    <p className="text-xs text-neutral-600 mb-2">{achievement.description}</p>
                                    <p className="text-xs font-medium text-primary-600">+{achievement.xp} XP</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Locked Achievements */}
                {lockedAchievements.length > 0 && (
                    <div>
                        <p className="text-sm font-medium text-neutral-600 mb-3">Kilitli</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {lockedAchievements.map(achievement => {
                                const progress = getAchievementProgress(achievement.id, stats);
                                return (
                                    <div
                                        key={achievement.id}
                                        className="p-4 rounded-lg border border-neutral-200 bg-neutral-50 relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-primary-100 opacity-20" style={{ width: `${progress}%` }} />
                                        <div className="relative">
                                            <div className="text-3xl mb-2 opacity-50">{achievement.icon}</div>
                                            <p className="font-semibold text-sm mb-1 flex items-center gap-1">
                                                <Lock size={12} />
                                                {achievement.name}
                                            </p>
                                            <p className="text-xs text-neutral-600 mb-2">{achievement.description}</p>
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs font-medium text-neutral-500">+{achievement.xp} XP</p>
                                                <p className="text-xs font-medium text-primary-600">{Math.round(progress)}%</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Saved Stories */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={20} className="text-primary-600" />
                    <h3 className="font-semibold">Hikayelerim</h3>
                    <span className="text-sm text-neutral-500">({savedStories.length})</span>
                </div>

                {savedStories.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen size={48} className="mx-auto mb-4 text-neutral-300" />
                        <p className="text-neutral-600 mb-4">Henüz hikaye oluşturmadın</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {savedStories.map(story => (
                            <div
                                key={story.id}
                                className="flex items-start gap-4 p-4 border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors"
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${story.type === 'story' ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-800'
                                    }`}>
                                    {story.type === 'story' ? <BookOpen size={20} /> : <Gamepad2 size={20} />}
                                </div>
                                <button
                                    onClick={() => setCurrentView({ type: story.type, data: story })}
                                    className="flex-1 text-left"
                                >
                                    <h4 className="font-semibold mb-1 hover:text-primary-600 transition-colors">
                                        {story.title}
                                    </h4>
                                    <p className="text-sm text-neutral-600 line-clamp-2 mb-1">
                                        {story.content}
                                    </p>
                                    <p className="text-xs text-neutral-400">
                                        {new Date(story.createdAt).toLocaleDateString('tr-TR')}
                                    </p>
                                </button>
                                <button
                                    onClick={() => deleteStory(story.id)}
                                    className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileTab;
