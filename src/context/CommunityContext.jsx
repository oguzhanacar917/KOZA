'use client';
import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { community } from '../services/mastodonService';
import { mastodonStream } from '../services/mastodonStream';

const CommunityContext = createContext(null);

const initialState = {
    // Auth
    mastodonUser: null,
    authLoading: true,
    authError: null,

    // Timeline
    posts: [],
    timelineLoading: false,
    timelineError: null,
    hasMore: true,
    nextMaxId: null,
    timelineType: 'public', // 'public' | 'home'

    // Notifications
    notifications: [],
    unreadCount: 0,
    notifLoading: false,

    // Search
    searchResults: null,
    searchLoading: false,

    // UI
    activePost: null, // post being viewed (for thread)
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, mastodonUser: action.user, authLoading: false, authError: null };
        case 'AUTH_ERROR':
            return { ...state, authLoading: false, authError: action.error };
        case 'AUTH_LOADING':
            return { ...state, authLoading: true };

        case 'TIMELINE_LOADING':
            return { ...state, timelineLoading: true, timelineError: null };
        case 'TIMELINE_LOADED':
            return {
                ...state,
                timelineLoading: false,
                posts: action.replace ? action.posts : [...state.posts, ...action.posts],
                nextMaxId: action.nextMaxId,
                hasMore: action.posts.length > 0,
            };
        case 'TIMELINE_ERROR':
            return { ...state, timelineLoading: false, timelineError: action.error };
        case 'PREPEND_POST':
            return { ...state, posts: [action.post, ...state.posts] };
        case 'UPDATE_POST':
            return {
                ...state,
                posts: state.posts.map(p => p.id === action.post.id ? action.post : p),
            };
        case 'SET_TIMELINE_TYPE':
            return { ...state, timelineType: action.timelineType, posts: [], nextMaxId: null, hasMore: true };

        case 'NOTIFICATIONS_LOADED':
            return {
                ...state,
                notifLoading: false,
                notifications: action.notifications,
                unreadCount: action.notifications.length,
            };
        case 'NOTIFICATIONS_CLEARED':
            return { ...state, notifications: [], unreadCount: 0 };

        case 'SEARCH_LOADING':
            return { ...state, searchLoading: true };
        case 'SEARCH_DONE':
            return { ...state, searchLoading: false, searchResults: action.results };
        case 'SEARCH_CLEAR':
            return { ...state, searchResults: null, searchLoading: false };

        case 'SET_ACTIVE_POST':
            return { ...state, activePost: action.post };

        default:
            return state;
    }
}

export const CommunityProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const loadingRef = useRef(false);

    // ─── Auth ───────────────────────────────────────────────────────────────
    useEffect(() => {
        community.getMe().then(({ user }) => {
            dispatch({ type: 'SET_USER', user });
        }).catch(() => {
            dispatch({ type: 'AUTH_ERROR', error: 'Session check failed' });
        });
    }, []);

    // ─── Real-time Streaming ────────────────────────────────────────────────
    useEffect(() => {
        const stream = state.timelineType === 'home' ? 'user' : 'public';
        mastodonStream.connect(stream);

        const offUpdate = mastodonStream.on('update', (rawPost) => {
            if (!rawPost) return;
            const normalizedPost = {
                id: rawPost.id,
                content: rawPost.content,
                author: rawPost.account?.display_name || rawPost.account?.username || '',
                authorUsername: rawPost.account?.username || '',
                authorAvatar: rawPost.account?.avatar || '',
                authorId: rawPost.account?.id || '',
                createdAt: rawPost.created_at,
                likesCount: rawPost.favourites_count || 0,
                boostsCount: rawPost.reblogs_count || 0,
                repliesCount: rawPost.replies_count || 0,
                media: (rawPost.media_attachments || []).map(m => ({
                    id: m.id, type: m.type, url: m.url, previewUrl: m.preview_url
                })),
                isLiked: false,
                isBoosted: false,
            };
            dispatch({ type: 'PREPEND_POST', post: normalizedPost });
        });

        return () => {
            offUpdate();
            mastodonStream.disconnect();
        };
    }, [state.timelineType]);

    // ─── Actions ────────────────────────────────────────────────────────────
    const loadTimeline = useCallback(async ({ replace = false } = {}) => {
        if (loadingRef.current) return;
        loadingRef.current = true;
        dispatch({ type: 'TIMELINE_LOADING' });

        try {
            const maxId = replace ? undefined : state.nextMaxId;
            const { posts, nextMaxId } = await community.getTimeline({
                type: state.timelineType,
                maxId,
            });
            dispatch({ type: 'TIMELINE_LOADED', posts, nextMaxId, replace });
        } catch (err) {
            dispatch({ type: 'TIMELINE_ERROR', error: err.message });
        } finally {
            loadingRef.current = false;
        }
    }, [state.timelineType, state.nextMaxId]);

    const createPost = useCallback(async (postData) => {
        const { post } = await community.createPost(postData);
        dispatch({ type: 'PREPEND_POST', post });
        return post;
    }, []);

    const toggleLike = useCallback(async (postId, isCurrentlyLiked) => {
        const fn = isCurrentlyLiked ? community.unlikePost : community.likePost;
        const { post } = await fn(postId);
        dispatch({ type: 'UPDATE_POST', post });
    }, []);

    const toggleBoost = useCallback(async (postId, isCurrentlyBoosted) => {
        const fn = isCurrentlyBoosted ? community.unboostPost : community.boostPost;
        const { post } = await fn(postId);
        dispatch({ type: 'UPDATE_POST', post });
    }, []);

    const loadNotifications = useCallback(async () => {
        dispatch({ type: 'TIMELINE_LOADING' });
        const { notifications } = await community.getNotifications();
        dispatch({ type: 'NOTIFICATIONS_LOADED', notifications });
    }, []);

    const clearNotifications = useCallback(async () => {
        await community.clearNotifications();
        dispatch({ type: 'NOTIFICATIONS_CLEARED' });
    }, []);

    const searchContent = useCallback(async ({ q, type }) => {
        if (!q) { dispatch({ type: 'SEARCH_CLEAR' }); return; }
        dispatch({ type: 'SEARCH_LOADING' });
        const results = await community.search({ q, type });
        dispatch({ type: 'SEARCH_DONE', results });
    }, []);

    const setTimelineType = useCallback((timelineType) => {
        dispatch({ type: 'SET_TIMELINE_TYPE', timelineType });
    }, []);

    const logout = useCallback(async () => {
        await community.logout();
        dispatch({ type: 'SET_USER', user: null });
    }, []);

    const value = {
        ...state,
        loadTimeline,
        createPost,
        toggleLike,
        toggleBoost,
        loadNotifications,
        clearNotifications,
        searchContent,
        setTimelineType,
        logout,
        dispatch,
    };

    return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
};

export const useCommunity = () => {
    const ctx = useContext(CommunityContext);
    if (!ctx) throw new Error('useCommunity must be used within CommunityProvider');
    return ctx;
};
