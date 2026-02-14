import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from './AuthContext';
import { useUser } from './UserContext'; // We might need to update user stats on story save
import * as firestoreService from '../services/firestoreService';
import { analytics } from '../utils/analytics';

const StoryContext = createContext(null);

const COMMUNITY_WORKS = [
    // TODO: Connect to 'community' collection in Firestore
    // {
    //     id: 1,
    //     title: "Sessiz Çığlığın Dönüşümü",
    //     ...
    // }
];

export const StoryProvider = ({ children }) => {
    const { user: authUser, firestoreEnabled } = useAuth();
    const { setUser } = useUser(); // To update stats

    const [savedStories, setSavedStories] = useLocalStorage('koza-stories', []);
    const [activeStory, setActiveStory] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null); // Moved analysis here as it relates to story creation

    // Sync Stories
    useEffect(() => {
        if (!authUser || !firestoreEnabled) return;

        const loadStories = async () => {
            try {
                const cloudStories = await firestoreService.getUserStories(authUser.uid);
                // Simple merge strategy: Cloud wins or we just check length
                if (cloudStories && cloudStories.length > 0) {
                    setSavedStories(cloudStories);
                }
            } catch (error) {
                console.error("Story load error", error);
            }
        };

        loadStories();

        // Subscribe
        const unsubscribe = firestoreService.subscribeToStories(authUser.uid, (data) => {
            setSavedStories(prev => {
                if (JSON.stringify(prev) !== JSON.stringify(data)) {
                    return data;
                }
                return prev;
            });
        });
        return () => unsubscribe();
    }, [authUser, firestoreEnabled, setSavedStories]);

    const saveStory = useCallback(async (story) => {
        const newStory = {
            id: Date.now(),
            ...story,
            createdAt: new Date().toISOString()
        };

        setSavedStories(prev => [newStory, ...prev].slice(0, 50));

        // Track
        const eventType = story.type === 'story' ? 'story_created' : 'game_created';
        analytics.track(eventType, { title: story.title });

        // Update User Stats
        setUser(prev => ({
            ...prev,
            storiesCreated: story.type === 'story' ? prev.storiesCreated + 1 : prev.storiesCreated,
            gamesCreated: story.type === 'game' ? prev.gamesCreated + 1 : prev.gamesCreated
        }));

        // Cloud
        if (authUser && firestoreEnabled) {
            try {
                await firestoreService.saveStory(authUser.uid, newStory);
            } catch (e) {
                console.error("Save story failed", e);
            }
        }
    }, [authUser, firestoreEnabled, setUser, setSavedStories]);

    const deleteStory = useCallback(async (id) => {
        setSavedStories(prev => prev.filter(s => s.id !== id));
        if (authUser && firestoreEnabled) {
            try {
                await firestoreService.deleteStory(authUser.uid, id);
            } catch (e) {
                console.error("Delete story failed", e);
            }
        }
    }, [authUser, firestoreEnabled, setSavedStories]);

    const value = {
        savedStories,
        activeStory,
        setActiveStory,
        isProcessing,
        setIsProcessing,
        analysisResult,
        setAnalysisResult,
        communityWorks: COMMUNITY_WORKS,
        saveStory,
        deleteStory
    };

    return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
};

export const useStory = () => {
    const context = useContext(StoryContext);
    if (!context) throw new Error('useStory must be used within StoryProvider');
    return context;
};
