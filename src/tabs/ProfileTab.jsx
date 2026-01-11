import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ACHIEVEMENTS, getAchievementProgress } from '../utils/achievements';
import { Trash2, BookOpen, Gamepad2, Lock } from 'lucide-react';
import CocoonStage from '../components/cocoon/CocoonStage';
import MilestoneNotification from '../components/cocoon/MilestoneNotification';
import { getOzToNextStage } from '../utils/cocoon/stageCalculator';

// Legacy Galaxy Components (to be kept until fully replaced if complex logic exists)
import GalaxyCard from '../components/galaxy/GalaxyCard';

// New Atomic Imports
import {
    GalaxyStack,
    GalaxyBox,
    GalaxyGrid,
    GalaxyFlex,
    GalaxyDivider
} from '../components/galaxy/GalaxyLayout';

import {
    GalaxyHeading,
    GalaxyText,
    GalaxyList,
    GalaxyListItem
} from '../components/galaxy/GalaxyTypography';

import {
    GalaxyStatGroup,
    GalaxyStat,
    GalaxyStatLabel,
    GalaxyStatNumber,
    GalaxyStatHelpText,
    GalaxyTag,
    GalaxyEmptyState
} from '../components/galaxy/GalaxyDataDisplay';

import { GalaxyCircularProgress, GalaxyCircularProgressLabel } from '../components/galaxy/GalaxyFeedback';

const ProfileTab = () => {
    const { user, savedStories, deleteStory, setCurrentView } = useApp();
    const [previousOz, setPreviousOz] = useState(user.totalXP);
    const prevOzRef = useRef(user.totalXP);

    const progressPercent = (user.xp / user.nextLevelXp) * 100;
    const ozToNextStage = getOzToNextStage(user.totalXP);

    useEffect(() => {
        if (user.totalXP !== prevOzRef.current) {
            setPreviousOz(prevOzRef.current);
            prevOzRef.current = user.totalXP;
        }
    }, [user.totalXP]);

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
        <GalaxyBox className="max-w-6xl mx-auto px-4 py-8 pb-32">
            <MilestoneNotification previousOz={previousOz} currentOz={user.totalXP} />

            <GalaxyStack spacing={6}>
                {/* Cocoon Transformation Display */}
                <GalaxyCard title="Dönüşüm Yolculuğun" subtitle="Her ÖZ ile kelebeğe yaklaşıyorsun" emoji="🦋">
                    <GalaxyBox style={{ minHeight: '600px', position: 'relative' }}>
                        <CocoonStage totalOz={user.totalXP} />
                    </GalaxyBox>

                    <GalaxyFlex justify="center" className="mt-8">
                        <GalaxyFlex align="center" gap={6} className="px-8 py-4 bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-full border border-primary-500/20 backdrop-blur-sm">
                            <GalaxyStat className="items-center">
                                <GalaxyStatLabel>Toplam ÖZ</GalaxyStatLabel>
                                <GalaxyStatNumber gradient>{user.totalXP}</GalaxyStatNumber>
                            </GalaxyStat>

                            {ozToNextStage > 0 && (
                                <>
                                    <GalaxyDivider orientation="vertical" className="h-10 border-neutral-700" />
                                    <GalaxyStat className="items-center">
                                        <GalaxyStatLabel>Sonraki Aşamaya</GalaxyStatLabel>
                                        <GalaxyStatNumber className="!text-xl !text-neutral-700">{ozToNextStage} ÖZ</GalaxyStatNumber>
                                    </GalaxyStat>
                                </>
                            )}
                        </GalaxyFlex>
                    </GalaxyFlex>
                </GalaxyCard>

                {/* Stats Card */}
                <GalaxyCard title={user.level.toString()} subtitle={user.title} emoji="📈">
                    <GalaxyFlex justify="space-between" align="center" className="mb-6 -mt-4">
                        <GalaxyBox className="ml-auto text-right">
                            <GalaxyText size="sm" className="text-neutral-400 mb-1">İlerleme</GalaxyText>
                            <GalaxyText size="2xl" className="font-semibold text-primary-600">
                                {user.xp} / {user.nextLevelXp} ÖZ
                            </GalaxyText>
                        </GalaxyBox>
                    </GalaxyFlex>

                    {/* Custom Linear Progress (using div for now as GalaxyProgressCircle is circular) */}
                    <div className="h-3 bg-white/40 rounded-full overflow-hidden mb-8 border border-white/60 shadow-inner">
                        <div
                            className="h-full bg-gradient-to-r from-primary-500 to-purple-600 transition-all duration-500 shadow-[0_0_10px_rgba(147,51,234,0.2)]"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>

                    <GalaxyStatGroup>
                        <GalaxyStat className="p-4 bg-white/40 rounded-xl border border-white/60 text-center">
                            <GalaxyStatNumber className="!text-2xl text-neutral-900">{stats.storiesCreated}</GalaxyStatNumber>
                            <GalaxyStatLabel>Hikaye</GalaxyStatLabel>
                        </GalaxyStat>
                        <GalaxyStat className="p-4 bg-white/40 rounded-xl border border-white/60 text-center">
                            <GalaxyStatNumber className="!text-2xl text-neutral-900">{stats.gamesCreated}</GalaxyStatNumber>
                            <GalaxyStatLabel>Oyun</GalaxyStatLabel>
                        </GalaxyStat>
                        <GalaxyStat className="p-4 bg-white/40 rounded-xl border border-white/60 text-center">
                            <GalaxyStatNumber className="!text-2xl text-neutral-900">{stats.totalXP}</GalaxyStatNumber>
                            <GalaxyStatLabel>Toplam ÖZ</GalaxyStatLabel>
                        </GalaxyStat>
                        <GalaxyStat className="p-4 bg-white/40 rounded-xl border border-white/60 text-center">
                            <GalaxyStatNumber className="!text-2xl text-neutral-900">{stats.dailyStreak}</GalaxyStatNumber>
                            <GalaxyStatLabel>Gün Serisi</GalaxyStatLabel>
                        </GalaxyStat>
                    </GalaxyStatGroup>
                </GalaxyCard>

                {/* Achievements */}
                <GalaxyCard title="Başarılar" subtitle={`(${unlockedAchievements.length} / ${ACHIEVEMENTS.length})`} emoji="🏆">
                    {/* Unlocked */}
                    {unlockedAchievements.length > 0 && (
                        <GalaxyBox className="mb-8">
                            <GalaxyText size="sm" className="font-medium text-neutral-500 mb-3">Kazanıldı</GalaxyText>
                            <GalaxyGrid templateColumns="repeat(auto-fill, minmax(140px, 1fr))" gap={3}>
                                {unlockedAchievements.map(achievement => (
                                    <GalaxyBox
                                        key={achievement.id}
                                        className="p-4 rounded-xl border border-primary-500/30 bg-primary-500/5 backdrop-blur-sm"
                                    >
                                        <div className="text-3xl mb-2">{achievement.icon}</div>
                                        <GalaxyText className="font-semibold text-sm mb-1 text-neutral-900">{achievement.name}</GalaxyText>
                                        <GalaxyText className="text-xs text-neutral-500 mb-2 line-clamp-2">{achievement.description}</GalaxyText>
                                        <GalaxyText className="text-xs font-medium text-primary-600">+{achievement.xp} ÖZ</GalaxyText>
                                    </GalaxyBox>
                                ))}
                            </GalaxyGrid>
                        </GalaxyBox>
                    )}

                    {/* Locked */}
                    {lockedAchievements.length > 0 && (
                        <GalaxyBox>
                            <GalaxyText size="sm" className="font-medium text-neutral-500 mb-3">Kilitli</GalaxyText>
                            <GalaxyGrid templateColumns="repeat(auto-fill, minmax(140px, 1fr))" gap={3}>
                                {lockedAchievements.map(achievement => {
                                    const progress = getAchievementProgress(achievement.id, stats);
                                    return (
                                        <GalaxyBox
                                            key={achievement.id}
                                            className="p-4 rounded-xl border border-white/10 bg-neutral-100 relative overflow-hidden"
                                        >
                                            <div className="absolute inset-y-0 left-0 bg-primary-500 opacity-10" style={{ width: `${progress}%` }} />
                                            <div className="relative">
                                                <div className="text-3xl mb-2 opacity-30 grayscale">{achievement.icon}</div>
                                                <GalaxyText className="font-semibold text-sm mb-1 flex items-center gap-1 text-neutral-700">
                                                    <Lock size={12} />
                                                    {achievement.name}
                                                </GalaxyText>
                                                <GalaxyText className="text-xs text-neutral-500 mb-2 line-clamp-2">{achievement.description}</GalaxyText>
                                                <GalaxyFlex justify="space-between">
                                                    <GalaxyText className="text-xs font-medium text-neutral-500">+{achievement.xp} ÖZ</GalaxyText>
                                                    <GalaxyText className="text-xs font-medium text-primary-400">{Math.round(progress)}%</GalaxyText>
                                                </GalaxyFlex>
                                            </div>
                                        </GalaxyBox>
                                    );
                                })}
                            </GalaxyGrid>
                        </GalaxyBox>
                    )}
                </GalaxyCard>

                {/* Saved Stories */}
                <GalaxyCard title="Hikayelerim" subtitle={`(${savedStories.length})`} emoji="📚">
                    {savedStories.length === 0 ? (
                        <GalaxyEmptyState
                            icon={BookOpen}
                            title="Hikaye Yok"
                            description="Henüz bir hikaye oluşturmadın."
                            className="bg-transparent border-none py-12"
                        />
                    ) : (
                        <GalaxyList spacing={3}>
                            {savedStories.map(story => (
                                <GalaxyListItem
                                    key={story.id}
                                    className="p-4 rounded-xl bg-neutral-100 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
                                    onClick={() => setCurrentView({ type: story.type, data: story })}
                                >
                                    <GalaxyFlex justify="space-between" align="center">
                                        <GalaxyFlex align="center" gap={4}>
                                            <div className="p-2 rounded-lg bg-white/10 text-primary-400">
                                                {story.type === 'story' ? <BookOpen size={20} /> : <Gamepad2 size={20} />}
                                            </div>
                                            <div>
                                                <GalaxyText className="font-medium text-neutral-600 group-hover:text-primary-400 transition-colors">
                                                    {story.title}
                                                </GalaxyText>
                                                <GalaxyFlex align="center" gap={2} className="text-xs text-neutral-500 mt-1">
                                                    <span>{new Date(story.createdAt).toLocaleDateString('tr-TR')}</span>
                                                    <span className="w-1 h-1 rounded-full bg-neutral-600" />
                                                    <span className="truncate max-w-[200px]">{story.content}</span>
                                                </GalaxyFlex>
                                            </div>
                                        </GalaxyFlex>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteStory(story.id);
                                            }}
                                            className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </GalaxyFlex>
                                </GalaxyListItem>
                            ))}
                        </GalaxyList>
                    )}
                </GalaxyCard>
            </GalaxyStack>
        </GalaxyBox>
    );
};

export default ProfileTab;

