import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from 'firebase/auth';
import { FIREBASE_CONFIG } from '../config';
import { googleAnalytics } from '../utils/googleAnalytics';
import { initializeFirestore } from '../services/firestoreService';

const AuthContext = createContext(null);

// Initialize Firebase
let app = null;
let auth = null;
let provider = null;
let firestore = null;

const initializeFirebase = () => {
    if (!FIREBASE_CONFIG.apiKey) {
        console.warn('Firebase not configured. Authentication will be disabled.');
        return false;
    }

    try {
        app = initializeApp(FIREBASE_CONFIG);
        auth = getAuth(app);
        provider = new GoogleAuthProvider();
        firestore = initializeFirestore(app);
        return true;
    } catch (error) {
        console.error('Firebase initialization failed:', error);
        return false;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [firebaseEnabled, setFirebaseEnabled] = useState(false);

    useEffect(() => {
        const enabled = initializeFirebase();
        setFirebaseEnabled(enabled);

        if (!enabled) {
            setLoading(false);
            return;
        }

        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                const userData = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL
                };
                setUser(userData);

                // Track user properties in GA
                googleAnalytics.setUserProperties({
                    user_id: firebaseUser.uid,
                    user_email: firebaseUser.email
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        if (!firebaseEnabled) {
            console.error('Firebase is not enabled');
            return { success: false, error: 'Authentication not configured' };
        }

        try {
            const result = await signInWithPopup(auth, provider);

            // Track sign in event
            googleAnalytics.trackEvent('user', 'sign_in', 'google');

            return { success: true, user: result.user };
        } catch (error) {
            console.error('Sign in failed:', error);
            return { success: false, error: error.message };
        }
    };

    const signOut = async () => {
        if (!firebaseEnabled) return;

        try {
            await firebaseSignOut(auth);

            // Track sign out event
            googleAnalytics.trackEvent('user', 'sign_out', 'manual');

            return { success: true };
        } catch (error) {
            console.error('Sign out failed:', error);
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        loading,
        firebaseEnabled,
        firestoreEnabled: !!firestore,
        signInWithGoogle,
        signOut
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
