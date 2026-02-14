import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, query, orderBy, onSnapshot, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

// Remove the initialize function as we now import db directly
// export const initializeFirestore = (app) => { ... } is no longer needed

// ==================== USER PROFILE ====================

export const getUserProfile = async (userId) => {
    if (!db) throw new Error('Firestore not initialized');

    try {
        const docRef = doc(db, 'users', userId, 'data', 'profile');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
};

export const createUserProfile = async (userId, profileData) => {
    if (!db) throw new Error('Firestore not initialized');

    try {
        const docRef = doc(db, 'users', userId, 'data', 'profile');
        const data = {
            ...profileData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        await setDoc(docRef, data);
        return data;
    } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
    }
};

export const updateUserProfile = async (userId, updates) => {
    if (!db) throw new Error('Firestore not initialized');

    try {
        const docRef = doc(db, 'users', userId, 'data', 'profile');
        const data = {
            ...updates,
            updatedAt: serverTimestamp()
        };

        await updateDoc(docRef, data);
        return data;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

// ==================== STORIES ====================

export const getUserStories = async (userId) => {
    if (!db) throw new Error('Firestore not initialized');

    try {
        const storiesRef = collection(db, 'users', userId, 'stories');
        const q = query(storiesRef, orderBy('createdAt', 'desc'));

        return new Promise((resolve, reject) => {
            const unsubscribe = onSnapshot(q,
                (snapshot) => {
                    const stories = [];
                    snapshot.forEach((doc) => {
                        stories.push({ id: doc.id, ...doc.data() });
                    });
                    unsubscribe();
                    resolve(stories);
                },
                (error) => {
                    unsubscribe();
                    reject(error);
                }
            );
        });
    } catch (error) {
        console.error('Error getting user stories:', error);
        throw error;
    }
};

export const saveStory = async (userId, story) => {
    if (!db) throw new Error('Firestore not initialized');

    try {
        const storyId = story.id || Date.now().toString();
        const docRef = doc(db, 'users', userId, 'stories', storyId);

        const data = {
            ...story,
            id: storyId,
            createdAt: story.createdAt || serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        await setDoc(docRef, data);
        return { ...data, id: storyId };
    } catch (error) {
        console.error('Error saving story:', error);
        throw error;
    }
};

export const deleteStory = async (userId, storyId) => {
    if (!db) throw new Error('Firestore not initialized');

    try {
        const docRef = doc(db, 'users', userId, 'stories', storyId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error('Error deleting story:', error);
        throw error;
    }
};

// ==================== REAL-TIME SYNC ====================

export const subscribeToProfile = (userId, callback) => {
    if (!db) {
        console.warn('Firestore not initialized, skipping subscription');
        return () => { };
    }

    try {
        const docRef = doc(db, 'users', userId, 'data', 'profile');

        const unsubscribe = onSnapshot(docRef,
            (doc) => {
                if (doc.exists()) {
                    callback(doc.data());
                }
            },
            (error) => {
                console.error('Error in profile subscription:', error);
            }
        );

        return unsubscribe;
    } catch (error) {
        console.error('Error subscribing to profile:', error);
        return () => { };
    }
};

export const subscribeToStories = (userId, callback) => {
    if (!db) {
        console.warn('Firestore not initialized, skipping subscription');
        return () => { };
    }

    try {
        const storiesRef = collection(db, 'users', userId, 'stories');
        const q = query(storiesRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const stories = [];
                snapshot.forEach((doc) => {
                    stories.push({ id: doc.id, ...doc.data() });
                });
                callback(stories);
            },
            (error) => {
                console.error('Error in stories subscription:', error);
            }
        );

        return unsubscribe;
    } catch (error) {
        console.error('Error subscribing to stories:', error);
        return () => { };
    }
};

// ==================== BATCH OPERATIONS ====================

export const batchSaveStories = async (userId, stories) => {
    if (!db) throw new Error('Firestore not initialized');

    try {
        const batch = writeBatch(db);

        stories.forEach((story) => {
            const storyId = story.id || Date.now().toString() + Math.random();
            const docRef = doc(db, 'users', userId, 'stories', storyId);

            batch.set(docRef, {
                ...story,
                id: storyId,
                createdAt: story.createdAt || serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        });

        await batch.commit();
        console.log(`✅ Batch saved ${stories.length} stories`);
    } catch (error) {
        console.error('Error batch saving stories:', error);
        throw error;
    }
};

// ==================== SYNC HELPERS ====================

export const syncLocalToCloud = async (userId, localData) => {
    if (!db) {
        console.warn('Firestore not initialized, skipping cloud sync');
        return;
    }

    try {
        // Check if cloud profile exists
        const cloudProfile = await getUserProfile(userId);

        if (!cloudProfile) {
            // First time sign in - migrate local data to cloud
            console.log('📤 Migrating local data to cloud...');

            // Create profile
            await createUserProfile(userId, {
                xp: localData.user.xp,
                level: localData.user.level,
                nextLevelXp: localData.user.nextLevelXp,
                totalXP: localData.user.totalXP || localData.user.xp,
                storiesCreated: localData.user.storiesCreated || 0,
                gamesCreated: localData.user.gamesCreated || 0,
                storiesRead: localData.user.storiesRead || 0,
                gamesPlayed: localData.user.gamesPlayed || 0,
                dailyStreak: localData.user.dailyStreak || 0,
                lastVisit: localData.user.lastVisit || new Date().toISOString(),
                title: localData.user.title,
                achievements: localData.user.achievements || [],
                badges: localData.user.badges || []
            });

            // Batch save stories
            if (localData.stories && localData.stories.length > 0) {
                await batchSaveStories(userId, localData.stories);
            }

            console.log('✅ Migration complete');
            return { migrated: true };
        } else {
            // Merge logic - cloud data takes precedence
            console.log('🔄 Cloud data exists, using cloud version');
            return { migrated: false, cloudData: cloudProfile };
        }
    } catch (error) {
        console.error('Error syncing to cloud:', error);
        throw error;
    }
};
