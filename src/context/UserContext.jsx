import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from './AuthContext';
import * as firestoreService from '../services/firestoreService';
import { analytics } from '../utils/analytics';
import { checkAchievements } from '../utils/achievements';

const UserContext = createContext(null);

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

export const UserProvider = ({ children }) => {
    const { user: authUser, firestoreEnabled } = useAuth();
    const [user, setUser] = useLocalStorage('koza-user', DEFAULT_USER);
    const [isSyncing, setIsSyncing] = useState(false);
    const [cloudSynced, setCloudSynced] = useState(false);

    // We need a way to notify UI about level ups without coupling to UIContext directly here
    // For now, we'll expose a callback registry or simple event emitter pattern if needed,
    // but typically the UI component (App/Layout) observes UserContext and triggers toast.
    // However, to keep it simple and compatible with existing logic, we might need to accept a 'notify' callback prop
    // OR just handle state updates here and let a separate effect in AppContext bridge them.
    // DECISION: UserContext manages User state. Side effects like "Show Toast" should be handled by the consumer or a bridge.
    // BUT, for the "awardXP" function, it's convenient to trigger the notification immediately.
    // To solve this cleanly, we will NOT import UIContext here. We will expose `latestEvent` state.
    const [lastUserEvent, setLastUserEvent] = useState(null); // { type: 'levelup' | 'xp', ...data }

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

    // Sync with Firestore
    useEffect(() => {
        if (!authUser || !firestoreEnabled || cloudSynced) return;

        const syncData = async () => {
            setIsSyncing(true);
            try {
                console.log('🔄 User: Syncing data with cloud...');
                // Note: We only sync USER data here. Stories are in StoryContext.
                // However, the original code synced everything together.
                // We'll proceed with user-only sync here.

                // We might need to split the syncLocalToCloud function if it handles both.
                // For now, let's assume we can just sync/fetch user profile.
                const cloudProfile = await firestoreService.getUserProfile(authUser.uid);

                if (cloudProfile) {
                    setUser(prev => ({ ...prev, ...cloudProfile }));
                    setCloudSynced(true);
                } else {
                    // First time? Create/Update.
                    await firestoreService.updateUserProfile(authUser.uid, user);
                    setCloudSynced(true);
                }
            } catch (error) {
                console.error('User Sync error:', error);
            } finally {
                setIsSyncing(false);
            }
        };

        syncData();
    }, [authUser, firestoreEnabled]);

    // Real-time Updates
    useEffect(() => {
        if (!authUser || !firestoreEnabled || !cloudSynced) return;
        const unsubscribe = firestoreService.subscribeToProfile(authUser.uid, (data) => {
            setUser(prev => ({ ...prev, ...data }));
        });
        return () => unsubscribe();
    }, [authUser, firestoreEnabled, cloudSynced]);

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

            // Check achievements
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
                updatedUser.achievements = [...updatedUser.achievements, ...newAchievements.map(a => a.id)];
                setLastUserEvent({ type: 'achievement', achievements: newAchievements });
                newAchievements.forEach(a => analytics.track('achievement_unlocked', { achievementId: a.id }));
            }

            if (leveledUp) {
                setLastUserEvent({ type: 'levelup', level: updatedUser.level });
            } else {
                setLastUserEvent({ type: 'xp', amount, reason });
            }

            return updatedUser;
        });

        // Sync trigger
        if (authUser && firestoreEnabled && cloudSynced) {
            // Debounce logic would be better, but keeping it simple
            setTimeout(() => {
                firestoreService.updateUserProfile(authUser.uid, {
                    xp: user.xp + amount, // Note: this might be stale if strict mode double invokes, ideally use ref or trust the effect sync
                    totalXP: user.totalXP + amount
                }).catch(e => console.error(e));
            }, 100);
        }

    }, [authUser, firestoreEnabled, cloudSynced, user]);

    const value = {
        user,
        setUser,
        awardXP,
        isSyncing,
        cloudSynced,
        lastUserEvent,     // Expose this for UIContext to listen to
        setLastUserEvent   // Allow clearing
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within UserProvider');
    return context;
};
