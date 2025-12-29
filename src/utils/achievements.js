/**
 * Achievement system
 */

export const ACHIEVEMENTS = [
    {
        id: 'first_story',
        name: 'İlk Hikaye',
        description: 'İlk hikayeni oluştur',
        icon: '📖',
        xp: 100,
        condition: (stats) => stats.storiesCreated >= 1
    },
    {
        id: 'story_master',
        name: 'Hikaye Ustası',
        description: '10 hikaye oluştur',
        icon: '✨',
        xp: 500,
        condition: (stats) => stats.storiesCreated >= 10
    },
    {
        id: 'first_game',
        name: 'İlk Oyun',
        description: 'İlk oyununu oluştur',
        icon: '🎮',
        xp: 100,
        condition: (stats) => stats.gamesCreated >= 1
    },
    {
        id: 'game_master',
        name: 'Oyun Ustası',
        description: '10 oyun oluştur',
        icon: '🏆',
        xp: 500,
        condition: (stats) => stats.gamesCreated >= 10
    },
    {
        id: 'level_5',
        name: 'Yükselen Yıldız',
        description: 'Seviye 5\'e ulaş',
        icon: '⭐',
        xp: 200,
        condition: (stats) => stats.level >= 5
    },
    {
        id: 'level_10',
        name: 'Dönüşüm Şampiyonu',
        description: 'Seviye 10\'a ulaş',
        icon: '🌟',
        xp: 500,
        condition: (stats) => stats.level >= 10
    },
    {
        id: 'xp_1000',
        name: 'XP Avcısı',
        description: 'Toplam 1000 XP kazan',
        icon: '💎',
        xp: 250,
        condition: (stats) => stats.totalXP >= 1000
    },
    {
        id: 'daily_streak_7',
        name: 'Kararlı Kullanıcı',
        description: '7 gün üst üste giriş yap',
        icon: '🔥',
        xp: 300,
        condition: (stats) => stats.dailyStreak >= 7
    }
];

export const checkAchievements = (stats, unlockedAchievements = []) => {
    const newAchievements = [];

    for (const achievement of ACHIEVEMENTS) {
        if (!unlockedAchievements.includes(achievement.id) && achievement.condition(stats)) {
            newAchievements.push(achievement);
        }
    }

    return newAchievements;
};

export const getAchievementProgress = (achievementId, stats) => {
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) return 0;

    // Calculate progress based on achievement type
    if (achievementId.includes('story')) {
        const target = achievementId === 'first_story' ? 1 : 10;
        return Math.min((stats.storiesCreated / target) * 100, 100);
    }

    if (achievementId.includes('game')) {
        const target = achievementId === 'first_game' ? 1 : 10;
        return Math.min((stats.gamesCreated / target) * 100, 100);
    }

    if (achievementId.includes('level')) {
        const target = parseInt(achievementId.split('_')[1]);
        return Math.min((stats.level / target) * 100, 100);
    }

    if (achievementId.includes('xp')) {
        const target = parseInt(achievementId.split('_')[1]);
        return Math.min((stats.totalXP / target) * 100, 100);
    }

    if (achievementId.includes('streak')) {
        const target = parseInt(achievementId.split('_')[2]);
        return Math.min((stats.dailyStreak / target) * 100, 100);
    }

    return 0;
};
