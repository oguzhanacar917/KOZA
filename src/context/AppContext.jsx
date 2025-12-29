import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { analytics } from '../utils/analytics';
import { checkAchievements } from '../utils/achievements';
import { useAuth } from './AuthContext';
import * as firestoreService from '../services/firestoreService';

const AppContext = createContext(null);

const DEFAULT_USER = {
    xp: 850,
    level: 1,
    nextLevelXp: 1000,
    storiesRead: 3,
    gamesPlayed: 1,
    storiesCreated: 0,
    gamesCreated: 0,
    totalXP: 850,
    dailyStreak: 0,
    lastVisit: null,
    title: "Empati Çırağı",
    badges: [
        { id: 1, name: "İlk Adım", unlocked: true },
        { id: 2, name: "Hikaye Anlatıcısı", unlocked: false },
        { id: 3, name: "Topluluk Yıldızı", unlocked: false },
    ],
    achievements: []
};

const COMMUNITY_WORKS = [
    {
        id: 1,
        title: "Sessiz Çığlığın Dönüşümü",
        author: "Elif Demir",
        type: "story",
        category: "Akran Zorbalığı",
        views: "1.2k",
        likes: 450,
        preview: "Okul koridorlarındaki sessiz mücadelenin, güçlü bir dayanışma hikâyesine dönüşümü."
    },
    {
        id: 2,
        title: "Siber Kalkan: İlk Seviye",
        author: "Can Yılmaz",
        type: "game",
        category: "Siber Zorbalık",
        views: "3.5k",
        likes: 890,
        preview: "Dijital dünyadaki kalkanını oluştur ve topluluğu siber zorbalara karşı koru."
    },
    {
        id: 3,
        title: "Mavi Ekranın Ardındaki Güç",
        author: "Umut Can Belgin",
        type: "story",
        category: "Siber Zorbalık",
        views: "980",
        likes: 310,
        preview: "Dışlanmanın, empati yoluyla nasıl iyileştirici bir güce dönüştüğünün günlüğü."
    },
    {
        id: 4,
        title: "Empati Labirenti",
        author: "Selin Yıldız",
        type: "game",
        category: "Duygusal Zeka",
        views: "2.1k",
        likes: 560,
        preview: "Doğru seçimleri yap, labirentten çık ve arkadaşlık bağlarını yeniden inşa et."
    }
];

export const AppProvider = ({ children }) => {
    const { user: authUser, firestoreEnabled } = useAuth();
    const [user, setUser] = useLocalStorage('koza-user', DEFAULT_USER);
    const [savedStories, setSavedStories] = useLocalStorage('koza-stories', []);
    const [activeStory, setActiveStory] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentView, setCurrentView] = useState(null);
    const [activeTab, setActiveTab] = useState('create');
    const [notification, setNotification] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [toasts, setToasts] = useState([]);
    const [showOnboarding, setShowOnboarding] = useState(
        !localStorage.getItem('koza-onboarding-complete')
    );
    const [isSyncing, setIsSyncing] = useState(false);
    const [cloudSynced, setCloudSynced] = useState(false);

    // Track daily streak
    useEffect(() => {
        const today = new Date().toDateString();
        const lastVisit = user.lastVisit;

        if (lastVisit !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();

            setUser(prev => ({
                ...prev,
                lastVisit: today,
                dailyStreak: lastVisit === yesterdayStr ? prev.dailyStreak + 1 : 1
            }));
        }
    }, []);

    // Sync with Firestore when user signs in
    useEffect(() => {
        if (!authUser || !firestoreEnabled || cloudSynced) return;

        const syncData = async () => {
            setIsSyncing(true);
            try {
                console.log('🔄 Syncing data with cloud...');

                const localData = {
                    user,
                    stories: savedStories
                };

                const result = await firestoreService.syncLocalToCloud(authUser.uid, localData);

                if (result.migrated) {
                    addToast('success', 'Data Synced', 'Your data has been backed up to the cloud');
                } else if (result.cloudData) {
                    // Load cloud data
                    setUser(result.cloudData);

                    // Load cloud stories
                    const cloudStories = await firestoreService.getUserStories(authUser.uid);
                    setSavedStories(cloudStories);

                    addToast('success', 'Data Loaded', 'Your data has been loaded from the cloud');
                }

                setCloudSynced(true);
            } catch (error) {
                console.error('Sync error:', error);
                addToast('error', 'Sync Failed', 'Could not sync with cloud. Using local data.');
            } finally {
                setIsSyncing(false);
            }
        };

        syncData();
    }, [authUser, firestoreEnabled]);

    // Subscribe to real-time updates
    useEffect(() => {
        if (!authUser || !firestoreEnabled || !cloudSynced) return;

        console.log('👂 Subscribing to real-time updates...');

        const unsubscribeProfile = firestoreService.subscribeToProfile(
            authUser.uid,
            (cloudProfile) => {
                console.log('📥 Profile updated from cloud');
                setUser(prev => ({ ...prev, ...cloudProfile }));
            }
        );

        const unsubscribeStories = firestoreService.subscribeToStories(
            authUser.uid,
            (cloudStories) => {
                console.log('📥 Stories updated from cloud');
                setSavedStories(cloudStories);
            }
        );

        return () => {
            unsubscribeProfile();
            unsubscribeStories();
        };
    }, [authUser, firestoreEnabled, cloudSynced]);

    const addToast = useCallback((type, title, message) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, title, message }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const awardXP = useCallback((amount, reason) => {
        analytics.track('xp_awarded', { amount, reason });

        setUser(prev => {
            const newXP = prev.xp + amount;
            const newTotalXP = prev.totalXP + amount;
            const leveledUp = newXP >= prev.nextLevelXp;

            const updatedUser = leveledUp ? {
                ...prev,
                xp: newXP - prev.nextLevelXp,
                level: prev.level + 1,
                nextLevelXp: Math.floor(prev.nextLevelXp * 1.5),
                totalXP: newTotalXP
            } : {
                ...prev,
                xp: newXP,
                totalXP: newTotalXP
            };

            // Check for new achievements
            const newAchievements = checkAchievements(
                {
                    storiesCreated: updatedUser.storiesCreated,
                    gamesCreated: updatedUser.gamesCreated,
                    level: updatedUser.level,
                    totalXP: updatedUser.totalXP,
                    dailyStreak: updatedUser.dailyStreak
                },
                updatedUser.achievements
            );

            if (newAchievements.length > 0) {
                newAchievements.forEach(achievement => {
                    addToast('success', 'Başarı Kazanıldı!', `${achievement.icon} ${achievement.name}`);
                    analytics.track('achievement_unlocked', { achievementId: achievement.id });
                });
                updatedUser.achievements = [...updatedUser.achievements, ...newAchievements.map(a => a.id)];
            }

            if (leveledUp) {
                setNotification({
                    type: 'levelup',
                    title: 'Seviye Atladın!',
                    message: `Yeni seviye: ${updatedUser.level}`
                });
            } else {
                setNotification({
                    type: 'xp',
                    title: `+${amount} XP`,
                    message: reason
                });
            }

            setTimeout(() => setNotification(null), 3000);
            return updatedUser;
        });

        // Sync to cloud if authenticated
        if (authUser && firestoreEnabled && cloudSynced) {
            setTimeout(async () => {
                try {
                    await firestoreService.updateUserProfile(authUser.uid, {
                        xp: user.xp,
                        level: user.level,
                        nextLevelXp: user.nextLevelXp,
                        totalXP: user.totalXP
                    });
                } catch (error) {
                    console.error('Failed to sync XP to cloud:', error);
                }
            }, 100);
        }
    }, [setUser, addToast, authUser, firestoreEnabled, cloudSynced, user]);

    const saveStory = useCallback(async (story) => {
        const newStory = {
            id: Date.now(),
            ...story,
            createdAt: new Date().toISOString()
        };
        setSavedStories(prev => [newStory, ...prev].slice(0, 50));

        // Track story creation
        const eventType = story.type === 'story' ? 'story_created' : 'game_created';
        analytics.track(eventType, { title: story.title });

        // Update user stats
        setUser(prev => ({
            ...prev,
            storiesCreated: story.type === 'story' ? prev.storiesCreated + 1 : prev.storiesCreated,
            gamesCreated: story.type === 'game' ? prev.gamesCreated + 1 : prev.gamesCreated
        }));

        // Sync to cloud if authenticated
        if (authUser && firestoreEnabled && cloudSynced) {
            try {
                await firestoreService.saveStory(authUser.uid, newStory);
                console.log('✅ Story saved to cloud');
            } catch (error) {
                console.error('Failed to save story to cloud:', error);
                addToast('error', 'Sync Failed', 'Story saved locally but not synced to cloud');
            }
        }
    }, [setSavedStories, setUser, authUser, firestoreEnabled, cloudSynced, addToast]);

    const deleteStory = useCallback(async (id) => {
        setSavedStories(prev => prev.filter(s => s.id !== id));

        // Delete from cloud if authenticated
        if (authUser && firestoreEnabled && cloudSynced) {
            try {
                await firestoreService.deleteStory(authUser.uid, id);
                console.log('✅ Story deleted from cloud');
            } catch (error) {
                console.error('Failed to delete story from cloud:', error);
            }
        }
    }, [setSavedStories, authUser, firestoreEnabled, cloudSynced]);

    const value = {
        user,
        setUser,
        savedStories,
        activeStory,
        setActiveStory,
        isProcessing,
        setIsProcessing,
        currentView,
        setCurrentView,
        activeTab,
        setActiveTab,
        notification,
        analysisResult,
        setAnalysisResult,
        communityWorks: COMMUNITY_WORKS,
        awardXP,
        saveStory,
        deleteStory,
        toasts,
        addToast,
        showOnboarding,
        setShowOnboarding
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
};
