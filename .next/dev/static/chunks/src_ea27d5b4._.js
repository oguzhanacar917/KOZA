(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/services/mastodonService.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "community",
    ()=>community
]);
/**
 * Client-side Mastodon service — communicates with the Koza API proxy layer.
 * Never exposes the Mastodon access token directly.
 */ const BASE = '';
async function apiFetch(path, options = {}) {
    const res = await fetch(path, {
        headers: {
            'Content-Type': 'application/json'
        },
        ...options
    });
    if (!res.ok) {
        const err = await res.json().catch(()=>({
                error: res.statusText
            }));
        throw new Error(err.error || `Request failed: ${res.status}`);
    }
    return res.json();
}
const community = {
    // Returns { user } from cookie session
    getMe: ()=>apiFetch('/api/auth/me'),
    loginUrl: ()=>'/api/auth/login',
    logout: ()=>apiFetch('/api/auth/logout', {
            method: 'POST'
        }),
    // ─── Timeline ──────────────────────────────────────────────────────────
    getTimeline: ({ type = 'public', maxId, limit = 20 } = {})=>{
        const qs = new URLSearchParams({
            type,
            limit
        });
        if (maxId) qs.set('max_id', maxId);
        return apiFetch(`/api/community/timeline?${qs.toString()}`);
    },
    // ─── Posts ─────────────────────────────────────────────────────────────
    createPost: ({ content, inReplyToId, mediaIds, spoilerText, visibility })=>apiFetch('/api/community/post', {
            method: 'POST',
            body: JSON.stringify({
                content,
                inReplyToId,
                mediaIds,
                spoilerText,
                visibility
            })
        }),
    likePost: (id)=>apiFetch(`/api/community/post/${id}/like`, {
            method: 'POST'
        }),
    unlikePost: (id)=>apiFetch(`/api/community/post/${id}/like`, {
            method: 'DELETE'
        }),
    boostPost: (id)=>apiFetch(`/api/community/post/${id}/boost`, {
            method: 'POST'
        }),
    unboostPost: (id)=>apiFetch(`/api/community/post/${id}/boost`, {
            method: 'DELETE'
        }),
    getPostContext: (id)=>apiFetch(`/api/community/post/${id}/context`),
    // ─── Users ─────────────────────────────────────────────────────────────
    getUser: (id)=>apiFetch(`/api/community/user/${id}`),
    getUserPosts: ({ id, maxId, limit = 20 } = {})=>{
        const qs = new URLSearchParams({
            view: 'posts',
            limit
        });
        if (maxId) qs.set('max_id', maxId);
        return apiFetch(`/api/community/user/${id}?${qs.toString()}`);
    },
    followUser: (id)=>apiFetch(`/api/community/user/${id}/follow`, {
            method: 'POST'
        }),
    unfollowUser: (id)=>apiFetch(`/api/community/user/${id}/follow`, {
            method: 'DELETE'
        }),
    // ─── Notifications ─────────────────────────────────────────────────────
    getNotifications: ({ maxId, limit = 20 } = {})=>{
        const qs = new URLSearchParams({
            limit
        });
        if (maxId) qs.set('max_id', maxId);
        return apiFetch(`/api/community/notifications?${qs.toString()}`);
    },
    clearNotifications: ()=>apiFetch('/api/community/notifications', {
            method: 'POST'
        }),
    // ─── Search ────────────────────────────────────────────────────────────
    search: ({ q, type = 'all', limit = 20 } = {})=>{
        const qs = new URLSearchParams({
            q,
            type,
            limit
        });
        return apiFetch(`/api/community/search?${qs.toString()}`);
    },
    // ─── Media ─────────────────────────────────────────────────────────────
    uploadMedia: async (file)=>{
        const form = new FormData();
        form.append('file', file);
        const res = await fetch('/api/community/media', {
            method: 'POST',
            body: form
        });
        if (!res.ok) {
            const err = await res.json().catch(()=>({}));
            throw new Error(err.error || 'Media upload failed');
        }
        return res.json();
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/mastodonStream.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MastodonStream",
    ()=>MastodonStream,
    "mastodonStream",
    ()=>mastodonStream
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use client';
/**
 * Mastodon WebSocket Streaming Client
 * Connects to the Mastodon streaming API and allows subscribing to events.
 */ const MASTODON_WS_URL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_MASTODON_WS_URL || '';
class MastodonStream {
    constructor(){
        this.ws = null;
        this.listeners = {};
        this.reconnectTimer = null;
        this.connected = false;
    }
    connect(stream = 'public') {
        if (!MASTODON_WS_URL) {
            console.warn('[MastodonStream] NEXT_PUBLIC_MASTODON_WS_URL not set. Real-time streaming disabled.');
            return;
        }
        const url = `${MASTODON_WS_URL}/api/v1/streaming?stream=${stream}`;
        try {
            this.ws = new WebSocket(url);
            this.ws.onopen = ()=>{
                this.connected = true;
                console.log('[MastodonStream] Connected:', stream);
                this._emit('connected');
            };
            this.ws.onmessage = (event)=>{
                try {
                    const data = JSON.parse(event.data);
                    this._emit(data.event, data.payload ? JSON.parse(data.payload) : null);
                } catch (e) {
                // ignore parse errors
                }
            };
            this.ws.onerror = (err)=>{
                console.error('[MastodonStream] Error:', err);
                this._emit('error', err);
            };
            this.ws.onclose = ()=>{
                this.connected = false;
                this._emit('disconnected');
                // Auto-reconnect after 5s
                this.reconnectTimer = setTimeout(()=>this.connect(stream), 5000);
            };
        } catch (err) {
            console.error('[MastodonStream] Failed to connect:', err);
        }
    }
    disconnect() {
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.connected = false;
    }
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
        return ()=>this.off(event, callback);
    }
    off(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter((cb)=>cb !== callback);
    }
    _emit(event, data) {
        (this.listeners[event] || []).forEach((cb)=>{
            try {
                cb(data);
            } catch (e) {}
        });
    }
}
const mastodonStream = new MastodonStream();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/context/CommunityContext.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CommunityProvider",
    ()=>CommunityProvider,
    "useCommunity",
    ()=>useCommunity
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mastodonService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/mastodonService.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mastodonStream$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/mastodonStream.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
const CommunityContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
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
    timelineType: 'public',
    // Notifications
    notifications: [],
    unreadCount: 0,
    notifLoading: false,
    // Search
    searchResults: null,
    searchLoading: false,
    // UI
    activePost: null
};
function reducer(state, action) {
    switch(action.type){
        case 'SET_USER':
            return {
                ...state,
                mastodonUser: action.user,
                authLoading: false,
                authError: null
            };
        case 'AUTH_ERROR':
            return {
                ...state,
                authLoading: false,
                authError: action.error
            };
        case 'AUTH_LOADING':
            return {
                ...state,
                authLoading: true
            };
        case 'TIMELINE_LOADING':
            return {
                ...state,
                timelineLoading: true,
                timelineError: null
            };
        case 'TIMELINE_LOADED':
            return {
                ...state,
                timelineLoading: false,
                posts: action.replace ? action.posts : [
                    ...state.posts,
                    ...action.posts
                ],
                nextMaxId: action.nextMaxId,
                hasMore: action.posts.length > 0
            };
        case 'TIMELINE_ERROR':
            return {
                ...state,
                timelineLoading: false,
                timelineError: action.error
            };
        case 'PREPEND_POST':
            return {
                ...state,
                posts: [
                    action.post,
                    ...state.posts
                ]
            };
        case 'UPDATE_POST':
            return {
                ...state,
                posts: state.posts.map((p)=>p.id === action.post.id ? action.post : p)
            };
        case 'SET_TIMELINE_TYPE':
            return {
                ...state,
                timelineType: action.timelineType,
                posts: [],
                nextMaxId: null,
                hasMore: true
            };
        case 'NOTIFICATIONS_LOADED':
            return {
                ...state,
                notifLoading: false,
                notifications: action.notifications,
                unreadCount: action.notifications.length
            };
        case 'NOTIFICATIONS_CLEARED':
            return {
                ...state,
                notifications: [],
                unreadCount: 0
            };
        case 'SEARCH_LOADING':
            return {
                ...state,
                searchLoading: true
            };
        case 'SEARCH_DONE':
            return {
                ...state,
                searchLoading: false,
                searchResults: action.results
            };
        case 'SEARCH_CLEAR':
            return {
                ...state,
                searchResults: null,
                searchLoading: false
            };
        case 'SET_ACTIVE_POST':
            return {
                ...state,
                activePost: action.post
            };
        default:
            return state;
    }
}
const CommunityProvider = ({ children })=>{
    _s();
    const [state, dispatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducer"])(reducer, initialState);
    const loadingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // ─── Auth ───────────────────────────────────────────────────────────────
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CommunityProvider.useEffect": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mastodonService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["community"].getMe().then({
                "CommunityProvider.useEffect": ({ user })=>{
                    dispatch({
                        type: 'SET_USER',
                        user
                    });
                }
            }["CommunityProvider.useEffect"]).catch({
                "CommunityProvider.useEffect": ()=>{
                    dispatch({
                        type: 'AUTH_ERROR',
                        error: 'Session check failed'
                    });
                }
            }["CommunityProvider.useEffect"]);
        }
    }["CommunityProvider.useEffect"], []);
    // ─── Real-time Streaming ────────────────────────────────────────────────
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CommunityProvider.useEffect": ()=>{
            const stream = state.timelineType === 'home' ? 'user' : 'public';
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mastodonStream$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mastodonStream"].connect(stream);
            const offUpdate = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mastodonStream$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mastodonStream"].on('update', {
                "CommunityProvider.useEffect.offUpdate": (rawPost)=>{
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
                        media: (rawPost.media_attachments || []).map({
                            "CommunityProvider.useEffect.offUpdate": (m)=>({
                                    id: m.id,
                                    type: m.type,
                                    url: m.url,
                                    previewUrl: m.preview_url
                                })
                        }["CommunityProvider.useEffect.offUpdate"]),
                        isLiked: false,
                        isBoosted: false
                    };
                    dispatch({
                        type: 'PREPEND_POST',
                        post: normalizedPost
                    });
                }
            }["CommunityProvider.useEffect.offUpdate"]);
            return ({
                "CommunityProvider.useEffect": ()=>{
                    offUpdate();
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mastodonStream$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mastodonStream"].disconnect();
                }
            })["CommunityProvider.useEffect"];
        }
    }["CommunityProvider.useEffect"], [
        state.timelineType
    ]);
    // ─── Actions ────────────────────────────────────────────────────────────
    const loadTimeline = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CommunityProvider.useCallback[loadTimeline]": async ({ replace = false } = {})=>{
            if (loadingRef.current) return;
            loadingRef.current = true;
            dispatch({
                type: 'TIMELINE_LOADING'
            });
            try {
                const maxId = replace ? undefined : state.nextMaxId;
                const { posts, nextMaxId } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mastodonService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["community"].getTimeline({
                    type: state.timelineType,
                    maxId
                });
                dispatch({
                    type: 'TIMELINE_LOADED',
                    posts,
                    nextMaxId,
                    replace
                });
            } catch (err) {
                dispatch({
                    type: 'TIMELINE_ERROR',
                    error: err.message
                });
            } finally{
                loadingRef.current = false;
            }
        }
    }["CommunityProvider.useCallback[loadTimeline]"], [
        state.timelineType,
        state.nextMaxId
    ]);
    const createPost = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CommunityProvider.useCallback[createPost]": async (postData)=>{
            const { post } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mastodonService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["community"].createPost(postData);
            dispatch({
                type: 'PREPEND_POST',
                post
            });
            return post;
        }
    }["CommunityProvider.useCallback[createPost]"], []);
    const toggleLike = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CommunityProvider.useCallback[toggleLike]": async (postId, isCurrentlyLiked)=>{
            const fn = isCurrentlyLiked ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mastodonService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["community"].unlikePost : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mastodonService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["community"].likePost;
            const { post } = await fn(postId);
            dispatch({
                type: 'UPDATE_POST',
                post
            });
        }
    }["CommunityProvider.useCallback[toggleLike]"], []);
    const toggleBoost = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CommunityProvider.useCallback[toggleBoost]": async (postId, isCurrentlyBoosted)=>{
            const fn = isCurrentlyBoosted ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mastodonService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["community"].unboostPost : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mastodonService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["community"].boostPost;
            const { post } = await fn(postId);
            dispatch({
                type: 'UPDATE_POST',
                post
            });
        }
    }["CommunityProvider.useCallback[toggleBoost]"], []);
    const loadNotifications = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CommunityProvider.useCallback[loadNotifications]": async ()=>{
            dispatch({
                type: 'TIMELINE_LOADING'
            });
            const { notifications } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mastodonService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["community"].getNotifications();
            dispatch({
                type: 'NOTIFICATIONS_LOADED',
                notifications
            });
        }
    }["CommunityProvider.useCallback[loadNotifications]"], []);
    const clearNotifications = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CommunityProvider.useCallback[clearNotifications]": async ()=>{
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mastodonService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["community"].clearNotifications();
            dispatch({
                type: 'NOTIFICATIONS_CLEARED'
            });
        }
    }["CommunityProvider.useCallback[clearNotifications]"], []);
    const searchContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CommunityProvider.useCallback[searchContent]": async ({ q, type })=>{
            if (!q) {
                dispatch({
                    type: 'SEARCH_CLEAR'
                });
                return;
            }
            dispatch({
                type: 'SEARCH_LOADING'
            });
            const results = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mastodonService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["community"].search({
                q,
                type
            });
            dispatch({
                type: 'SEARCH_DONE',
                results
            });
        }
    }["CommunityProvider.useCallback[searchContent]"], []);
    const setTimelineType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CommunityProvider.useCallback[setTimelineType]": (timelineType)=>{
            dispatch({
                type: 'SET_TIMELINE_TYPE',
                timelineType
            });
        }
    }["CommunityProvider.useCallback[setTimelineType]"], []);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CommunityProvider.useCallback[logout]": async ()=>{
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mastodonService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["community"].logout();
            dispatch({
                type: 'SET_USER',
                user: null
            });
        }
    }["CommunityProvider.useCallback[logout]"], []);
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
        dispatch
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CommunityContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/CommunityContext.jsx",
        lineNumber: 216,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CommunityProvider, "S9JF4MGiFv58gk1zSNw7gGu16W0=");
_c = CommunityProvider;
const useCommunity = ()=>{
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(CommunityContext);
    if (!ctx) throw new Error('useCommunity must be used within CommunityProvider');
    return ctx;
};
_s1(useCommunity, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "CommunityProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/community/PostCard.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/repeat-2.js [app-client] (ecmascript) <export default as Repeat2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-client] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/repeat.js [app-client] (ecmascript) <export default as Repeat>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CommunityContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/CommunityContext.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
// Strip HTML from Mastodon content (posted as HTML)
function stripHtml(html) {
    if ("TURBOPACK compile-time truthy", 1) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }
    //TURBOPACK unreachable
    ;
}
// Format relative time
function relativeTime(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'şimdi';
    if (mins < 60) return `${mins}d`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}sa`;
    const days = Math.floor(hrs / 24);
    return `${days}g`;
}
const PostCard = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(({ post, showThread = false, onReply })=>{
    _s();
    const { mastodonUser, toggleLike, toggleBoost, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CommunityContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCommunity"])();
    const [actionLoading, setActionLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleLike = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PostCard.useCallback[handleLike]": async (e)=>{
            e.stopPropagation();
            if (!mastodonUser || actionLoading) return;
            setActionLoading('like');
            try {
                await toggleLike(post.id, post.isLiked);
            } finally{
                setActionLoading(null);
            }
        }
    }["PostCard.useCallback[handleLike]"], [
        mastodonUser,
        post,
        toggleLike,
        actionLoading
    ]);
    const handleBoost = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PostCard.useCallback[handleBoost]": async (e)=>{
            e.stopPropagation();
            if (!mastodonUser || actionLoading) return;
            setActionLoading('boost');
            try {
                await toggleBoost(post.id, post.isBoosted);
            } finally{
                setActionLoading(null);
            }
        }
    }["PostCard.useCallback[handleBoost]"], [
        mastodonUser,
        post,
        toggleBoost,
        actionLoading
    ]);
    const handleCardClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PostCard.useCallback[handleCardClick]": ()=>{
            dispatch({
                type: 'SET_ACTIVE_POST',
                post
            });
        }
    }["PostCard.useCallback[handleCardClick]"], [
        dispatch,
        post
    ]);
    const text = stripHtml(post.content);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: `post-card ${showThread ? 'post-card--thread' : ''}`,
        onClick: !showThread ? handleCardClick : undefined,
        children: [
            post.isBoostedPost && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "post-card__boost-label",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat$3e$__["Repeat"], {
                        size: 13
                    }, void 0, false, {
                        fileName: "[project]/src/components/community/PostCard.jsx",
                        lineNumber: 59,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            post.boostedBy,
                            " paylaştı"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/community/PostCard.jsx",
                        lineNumber: 60,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/community/PostCard.jsx",
                lineNumber: 58,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "post-card__body",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "post-card__avatar-col",
                        children: [
                            post.authorAvatar ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: post.authorAvatar,
                                alt: post.authorUsername,
                                className: "post-card__avatar",
                                loading: "lazy"
                            }, void 0, false, {
                                fileName: "[project]/src/components/community/PostCard.jsx",
                                lineNumber: 67,
                                columnNumber: 27
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "post-card__avatar post-card__avatar--placeholder",
                                children: (post.author || '?')[0]
                            }, void 0, false, {
                                fileName: "[project]/src/components/community/PostCard.jsx",
                                lineNumber: 68,
                                columnNumber: 27
                            }, ("TURBOPACK compile-time value", void 0)),
                            showThread && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "post-card__thread-line"
                            }, void 0, false, {
                                fileName: "[project]/src/components/community/PostCard.jsx",
                                lineNumber: 70,
                                columnNumber: 36
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/community/PostCard.jsx",
                        lineNumber: 65,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "post-card__content",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "post-card__header",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "post-card__author",
                                        children: post.author
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/community/PostCard.jsx",
                                        lineNumber: 75,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "post-card__username",
                                        children: [
                                            "@",
                                            post.authorUsername
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/community/PostCard.jsx",
                                        lineNumber: 76,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "post-card__dot",
                                        children: "·"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/community/PostCard.jsx",
                                        lineNumber: 77,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "post-card__time",
                                        children: relativeTime(post.createdAt)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/community/PostCard.jsx",
                                        lineNumber: 78,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/community/PostCard.jsx",
                                lineNumber: 74,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            post.spoilerText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "post-card__spoiler",
                                children: post.spoilerText
                            }, void 0, false, {
                                fileName: "[project]/src/components/community/PostCard.jsx",
                                lineNumber: 82,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "post-card__text",
                                children: text
                            }, void 0, false, {
                                fileName: "[project]/src/components/community/PostCard.jsx",
                                lineNumber: 85,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            post.media?.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `post-card__media post-card__media--${Math.min(post.media.length, 4)}`,
                                children: post.media.map((m)=>m.type === 'image' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: m.previewUrl || m.url,
                                        alt: "media",
                                        className: "post-card__media-img",
                                        loading: "lazy"
                                    }, m.id, false, {
                                        fileName: "[project]/src/components/community/PostCard.jsx",
                                        lineNumber: 91,
                                        columnNumber: 39
                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                        src: m.url,
                                        controls: true,
                                        className: "post-card__media-img"
                                    }, m.id, false, {
                                        fileName: "[project]/src/components/community/PostCard.jsx",
                                        lineNumber: 92,
                                        columnNumber: 39
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/src/components/community/PostCard.jsx",
                                lineNumber: 88,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "post-card__actions",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "post-card__action post-card__action--reply",
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            onReply && onReply(post);
                                        },
                                        "aria-label": "Yanıtla",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                                size: 16
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/community/PostCard.jsx",
                                                lineNumber: 103,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            post.repliesCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: post.repliesCount
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/community/PostCard.jsx",
                                                lineNumber: 104,
                                                columnNumber: 55
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/community/PostCard.jsx",
                                        lineNumber: 98,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: `post-card__action post-card__action--boost ${post.isBoosted ? 'post-card__action--active-boost' : ''} ${actionLoading === 'boost' ? 'post-card__action--loading' : ''}`,
                                        onClick: handleBoost,
                                        disabled: !mastodonUser,
                                        "aria-label": "Paylaş",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat2$3e$__["Repeat2"], {
                                                size: 16
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/community/PostCard.jsx",
                                                lineNumber: 113,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            post.boostsCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: post.boostsCount
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/community/PostCard.jsx",
                                                lineNumber: 114,
                                                columnNumber: 54
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/community/PostCard.jsx",
                                        lineNumber: 107,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: `post-card__action post-card__action--like ${post.isLiked ? 'post-card__action--active-like' : ''} ${actionLoading === 'like' ? 'post-card__action--loading' : ''}`,
                                        onClick: handleLike,
                                        disabled: !mastodonUser,
                                        "aria-label": "Beğen",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                                size: 16,
                                                fill: post.isLiked ? 'currentColor' : 'none'
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/community/PostCard.jsx",
                                                lineNumber: 123,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            post.likesCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: post.likesCount
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/community/PostCard.jsx",
                                                lineNumber: 124,
                                                columnNumber: 53
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/community/PostCard.jsx",
                                        lineNumber: 117,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/community/PostCard.jsx",
                                lineNumber: 97,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/community/PostCard.jsx",
                        lineNumber: 73,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/community/PostCard.jsx",
                lineNumber: 64,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/community/PostCard.jsx",
        lineNumber: 56,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
}, "klFP7yBkCUUYqqQ/wlgN9sM4wOs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CommunityContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCommunity"]
    ];
})), "klFP7yBkCUUYqqQ/wlgN9sM4wOs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CommunityContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCommunity"]
    ];
});
_c1 = PostCard;
PostCard.displayName = 'PostCard';
const __TURBOPACK__default__export__ = PostCard;
var _c, _c1;
__turbopack_context__.k.register(_c, "PostCard$memo");
__turbopack_context__.k.register(_c1, "PostCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/community/SkeletonPost.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
;
;
const SkeletonPost = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "skeleton-post",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "skeleton-avatar"
            }, void 0, false, {
                fileName: "[project]/src/components/community/SkeletonPost.jsx",
                lineNumber: 6,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "skeleton-content",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "skeleton-line",
                        style: {
                            width: '40%',
                            height: '13px'
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/community/SkeletonPost.jsx",
                        lineNumber: 8,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "skeleton-line",
                        style: {
                            width: '100%',
                            height: '14px'
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/community/SkeletonPost.jsx",
                        lineNumber: 9,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "skeleton-line",
                        style: {
                            width: '85%',
                            height: '14px'
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/community/SkeletonPost.jsx",
                        lineNumber: 10,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "skeleton-line",
                        style: {
                            width: '60%',
                            height: '14px'
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/community/SkeletonPost.jsx",
                        lineNumber: 11,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/community/SkeletonPost.jsx",
                lineNumber: 7,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/community/SkeletonPost.jsx",
        lineNumber: 5,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c = SkeletonPost;
const __TURBOPACK__default__export__ = SkeletonPost;
var _c;
__turbopack_context__.k.register(_c, "SkeletonPost");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/community/TimelineFeed.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CommunityContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/CommunityContext.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$community$2f$PostCard$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/community/PostCard.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$community$2f$SkeletonPost$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/community/SkeletonPost.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const TimelineFeed = ({ onReply })=>{
    _s();
    const { posts, timelineLoading, timelineError, hasMore, loadTimeline } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CommunityContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCommunity"])();
    const sentinelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const observerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Initial load
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TimelineFeed.useEffect": ()=>{
            loadTimeline({
                replace: true
            });
        }
    }["TimelineFeed.useEffect"], []);
    // Infinite scroll using IntersectionObserver
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TimelineFeed.useEffect": ()=>{
            if (observerRef.current) observerRef.current.disconnect();
            observerRef.current = new IntersectionObserver({
                "TimelineFeed.useEffect": (entries)=>{
                    const entry = entries[0];
                    if (entry.isIntersecting && hasMore && !timelineLoading) {
                        loadTimeline();
                    }
                }
            }["TimelineFeed.useEffect"], {
                rootMargin: '300px'
            });
            if (sentinelRef.current) {
                observerRef.current.observe(sentinelRef.current);
            }
            return ({
                "TimelineFeed.useEffect": ()=>observerRef.current?.disconnect()
            })["TimelineFeed.useEffect"];
        }
    }["TimelineFeed.useEffect"], [
        hasMore,
        timelineLoading,
        loadTimeline
    ]);
    if (posts.length === 0 && timelineLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: Array.from({
                length: 5
            }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$community$2f$SkeletonPost$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, i, false, {
                    fileName: "[project]/src/components/community/TimelineFeed.jsx",
                    lineNumber: 41,
                    columnNumber: 54
                }, ("TURBOPACK compile-time value", void 0)))
        }, void 0, false, {
            fileName: "[project]/src/components/community/TimelineFeed.jsx",
            lineNumber: 40,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0));
    }
    if (timelineError) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "community-error",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: [
                        "⚠️ Akış yüklenemedi: ",
                        timelineError
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/community/TimelineFeed.jsx",
                    lineNumber: 49,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>loadTimeline({
                            replace: true
                        }),
                    children: "Tekrar Dene"
                }, void 0, false, {
                    fileName: "[project]/src/components/community/TimelineFeed.jsx",
                    lineNumber: 50,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/community/TimelineFeed.jsx",
            lineNumber: 48,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "timeline-feed",
        children: [
            posts.map((post)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$community$2f$PostCard$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    post: post,
                    onReply: onReply
                }, post.id, false, {
                    fileName: "[project]/src/components/community/TimelineFeed.jsx",
                    lineNumber: 58,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: sentinelRef,
                className: "timeline-sentinel"
            }, void 0, false, {
                fileName: "[project]/src/components/community/TimelineFeed.jsx",
                lineNumber: 62,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            timelineLoading && posts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '12px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$community$2f$SkeletonPost$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/components/community/TimelineFeed.jsx",
                        lineNumber: 66,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$community$2f$SkeletonPost$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/components/community/TimelineFeed.jsx",
                        lineNumber: 67,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/community/TimelineFeed.jsx",
                lineNumber: 65,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0)),
            !hasMore && posts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "timeline-end",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: "🌟 Tüm gönderiler yüklendi"
                }, void 0, false, {
                    fileName: "[project]/src/components/community/TimelineFeed.jsx",
                    lineNumber: 73,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/community/TimelineFeed.jsx",
                lineNumber: 72,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/community/TimelineFeed.jsx",
        lineNumber: 56,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(TimelineFeed, "dC9IHSmB/JaF+lt4CqxSW5uiLhA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CommunityContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCommunity"]
    ];
});
_c = TimelineFeed;
const __TURBOPACK__default__export__ = TimelineFeed;
var _c;
__turbopack_context__.k.register(_c, "TimelineFeed");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/community/PostComposer.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CommunityContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/CommunityContext.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mastodonService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/mastodonService.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const MAX_CHARS = 500;
const PostComposer = ({ inReplyToId = null, replyingTo = null, onSuccess })=>{
    _s();
    const { mastodonUser, createPost } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CommunityContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCommunity"])();
    const [content, setContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [mediaList, setMediaList] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]); // [{id, previewUrl}]
    const [uploading, setUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fileRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const charsLeft = MAX_CHARS - content.length;
    const isOverLimit = charsLeft < 0;
    const canSubmit = content.trim().length > 0 && !isOverLimit && !submitting && !uploading;
    const handleImageSelect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PostComposer.useCallback[handleImageSelect]": async (e)=>{
            const files = Array.from(e.target.files);
            if (!files.length) return;
            setUploading(true);
            setError(null);
            try {
                const uploads = await Promise.all(files.slice(0, 4 - mediaList.length).map({
                    "PostComposer.useCallback[handleImageSelect]": (f)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mastodonService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["community"].uploadMedia(f)
                }["PostComposer.useCallback[handleImageSelect]"]));
                setMediaList({
                    "PostComposer.useCallback[handleImageSelect]": (prev)=>[
                            ...prev,
                            ...uploads
                        ]
                }["PostComposer.useCallback[handleImageSelect]"]);
            } catch (err) {
                setError('Görsel yüklenemedi: ' + err.message);
            } finally{
                setUploading(false);
                if (fileRef.current) fileRef.current.value = '';
            }
        }
    }["PostComposer.useCallback[handleImageSelect]"], [
        mediaList.length
    ]);
    const removeMedia = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PostComposer.useCallback[removeMedia]": (id)=>{
            setMediaList({
                "PostComposer.useCallback[removeMedia]": (prev)=>prev.filter({
                        "PostComposer.useCallback[removeMedia]": (m)=>m.id !== id
                    }["PostComposer.useCallback[removeMedia]"])
            }["PostComposer.useCallback[removeMedia]"]);
        }
    }["PostComposer.useCallback[removeMedia]"], []);
    const handleSubmit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PostComposer.useCallback[handleSubmit]": async (e)=>{
            e.preventDefault();
            if (!canSubmit) return;
            setSubmitting(true);
            setError(null);
            try {
                const post = await createPost({
                    content,
                    inReplyToId: inReplyToId || undefined,
                    mediaIds: mediaList.map({
                        "PostComposer.useCallback[handleSubmit]": (m)=>m.id
                    }["PostComposer.useCallback[handleSubmit]"])
                });
                setContent('');
                setMediaList([]);
                onSuccess?.(post);
            } catch (err) {
                setError('Gönderi oluşturulamadı: ' + err.message);
            } finally{
                setSubmitting(false);
            }
        }
    }["PostComposer.useCallback[handleSubmit]"], [
        canSubmit,
        content,
        inReplyToId,
        mediaList,
        createPost,
        onSuccess
    ]);
    if (!mastodonUser) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        className: "post-composer",
        onSubmit: handleSubmit,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "post-composer__row",
            children: [
                mastodonUser.avatar ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: mastodonUser.avatar,
                    alt: mastodonUser.username,
                    className: "post-composer__avatar"
                }, void 0, false, {
                    fileName: "[project]/src/components/community/PostComposer.jsx",
                    lineNumber: 72,
                    columnNumber: 23
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "post-composer__avatar post-composer__avatar--placeholder",
                    children: (mastodonUser.displayName || '?')[0]
                }, void 0, false, {
                    fileName: "[project]/src/components/community/PostComposer.jsx",
                    lineNumber: 73,
                    columnNumber: 23
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "post-composer__main",
                    children: [
                        replyingTo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "post-composer__replying-to",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        "@",
                                        replyingTo
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/community/PostComposer.jsx",
                                    lineNumber: 78,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                " kişisine yanıt veriyorsunuz"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/community/PostComposer.jsx",
                            lineNumber: 77,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                            className: "post-composer__textarea",
                            value: content,
                            onChange: (e)=>setContent(e.target.value),
                            placeholder: inReplyToId ? 'Yanıtınızı yazın...' : 'Topluluğa bir şeyler paylaşın...',
                            rows: 3,
                            disabled: submitting
                        }, void 0, false, {
                            fileName: "[project]/src/components/community/PostComposer.jsx",
                            lineNumber: 81,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        mediaList.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "post-composer__media-preview",
                            children: mediaList.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "post-composer__media-item",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: m.previewUrl || m.url,
                                            alt: "upload preview"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/community/PostComposer.jsx",
                                            lineNumber: 94,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "post-composer__media-remove",
                                            onClick: ()=>removeMedia(m.id),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                size: 12
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/community/PostComposer.jsx",
                                                lineNumber: 96,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/community/PostComposer.jsx",
                                            lineNumber: 95,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, m.id, true, {
                                    fileName: "[project]/src/components/community/PostComposer.jsx",
                                    lineNumber: 93,
                                    columnNumber: 33
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/src/components/community/PostComposer.jsx",
                            lineNumber: 91,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "post-composer__error",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                    size: 14
                                }, void 0, false, {
                                    fileName: "[project]/src/components/community/PostComposer.jsx",
                                    lineNumber: 105,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: error
                                }, void 0, false, {
                                    fileName: "[project]/src/components/community/PostComposer.jsx",
                                    lineNumber: 106,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/community/PostComposer.jsx",
                            lineNumber: 104,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "post-composer__toolbar",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "post-composer__actions",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            ref: fileRef,
                                            type: "file",
                                            accept: "image/*,video/*",
                                            multiple: true,
                                            className: "sr-only",
                                            onChange: handleImageSelect,
                                            id: "composer-file"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/community/PostComposer.jsx",
                                            lineNumber: 112,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "composer-file",
                                            className: "post-composer__icon-btn",
                                            title: "Görsel ekle",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/community/PostComposer.jsx",
                                                lineNumber: 114,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/community/PostComposer.jsx",
                                            lineNumber: 113,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/community/PostComposer.jsx",
                                    lineNumber: 111,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "post-composer__right",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `post-composer__counter ${charsLeft < 20 ? 'post-composer__counter--warning' : ''} ${isOverLimit ? 'post-composer__counter--error' : ''}`,
                                            children: charsLeft
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/community/PostComposer.jsx",
                                            lineNumber: 118,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            className: "post-composer__submit",
                                            disabled: !canSubmit,
                                            children: submitting ? '...' : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                        size: 15
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/community/PostComposer.jsx",
                                                        lineNumber: 122,
                                                        columnNumber: 57
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " Paylaş"
                                                ]
                                            }, void 0, true)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/community/PostComposer.jsx",
                                            lineNumber: 121,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/community/PostComposer.jsx",
                                    lineNumber: 117,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/community/PostComposer.jsx",
                            lineNumber: 110,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/community/PostComposer.jsx",
                    lineNumber: 75,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/community/PostComposer.jsx",
            lineNumber: 70,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/community/PostComposer.jsx",
        lineNumber: 69,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(PostComposer, "TUBgCq+SBBzS8+CH7D9rqiJiF5U=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CommunityContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCommunity"]
    ];
});
_c = PostComposer;
const __TURBOPACK__default__export__ = PostComposer;
var _c;
__turbopack_context__.k.register(_c, "PostComposer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/community/NotificationPanel.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/repeat-2.js [app-client] (ecmascript) <export default as Repeat2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-plus.js [app-client] (ecmascript) <export default as UserPlus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$at$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AtSign$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/at-sign.js [app-client] (ecmascript) <export default as AtSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CommunityContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/CommunityContext.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const ICONS = {
    favourite: {
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"],
        color: '#e11d48',
        label: 'gönderinizi beğendi'
    },
    reblog: {
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat2$3e$__["Repeat2"],
        color: '#059669',
        label: 'gönderinizi paylaştı'
    },
    follow: {
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlus$3e$__["UserPlus"],
        color: '#7c3aed',
        label: 'sizi takip etmeye başladı'
    },
    mention: {
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$at$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AtSign$3e$__["AtSign"],
        color: '#0ea5e9',
        label: 'sizi bahsetti'
    }
};
function relativeTime(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'şimdi';
    if (mins < 60) return `${mins}d`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}sa`;
    return `${Math.floor(hrs / 24)}g`;
}
const NotificationPanel = ({ onClose })=>{
    _s();
    const { notifications, notifLoading, unreadCount, loadNotifications, clearNotifications } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CommunityContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCommunity"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotificationPanel.useEffect": ()=>{
            loadNotifications();
        }
    }["NotificationPanel.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "notif-panel",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "notif-panel__header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "notif-panel__title",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/src/components/community/NotificationPanel.jsx",
                                lineNumber: 35,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Bildirimler"
                            }, void 0, false, {
                                fileName: "[project]/src/components/community/NotificationPanel.jsx",
                                lineNumber: 36,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "notif-panel__badge",
                                children: unreadCount
                            }, void 0, false, {
                                fileName: "[project]/src/components/community/NotificationPanel.jsx",
                                lineNumber: 37,
                                columnNumber: 41
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/community/NotificationPanel.jsx",
                        lineNumber: 34,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "notif-panel__actions",
                        children: [
                            notifications.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "notif-panel__clear",
                                onClick: clearNotifications,
                                children: "Tümünü Temizle"
                            }, void 0, false, {
                                fileName: "[project]/src/components/community/NotificationPanel.jsx",
                                lineNumber: 41,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "notif-panel__close",
                                onClick: onClose,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 16
                                }, void 0, false, {
                                    fileName: "[project]/src/components/community/NotificationPanel.jsx",
                                    lineNumber: 43,
                                    columnNumber: 78
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/community/NotificationPanel.jsx",
                                lineNumber: 43,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/community/NotificationPanel.jsx",
                        lineNumber: 39,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/community/NotificationPanel.jsx",
                lineNumber: 33,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "notif-panel__list",
                children: [
                    notifLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "notif-panel__empty",
                        children: "Yükleniyor..."
                    }, void 0, false, {
                        fileName: "[project]/src/components/community/NotificationPanel.jsx",
                        lineNumber: 48,
                        columnNumber: 34
                    }, ("TURBOPACK compile-time value", void 0)),
                    !notifLoading && notifications.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "notif-panel__empty",
                        children: "Henüz bildiriminiz yok."
                    }, void 0, false, {
                        fileName: "[project]/src/components/community/NotificationPanel.jsx",
                        lineNumber: 50,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    notifications.map((n)=>{
                        const meta = ICONS[n.type] || {
                            Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"],
                            color: '#94a3b8',
                            label: n.type
                        };
                        const { Icon, color, label } = meta;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "notif-item",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "notif-item__icon",
                                    style: {
                                        color,
                                        background: color + '18'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/community/NotificationPanel.jsx",
                                        lineNumber: 58,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/community/NotificationPanel.jsx",
                                    lineNumber: 57,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "notif-item__content",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "notif-item__row",
                                            children: [
                                                n.account?.avatar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: n.account.avatar,
                                                    className: "notif-item__avatar",
                                                    alt: n.account.username
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/community/NotificationPanel.jsx",
                                                    lineNumber: 63,
                                                    columnNumber: 41
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "notif-item__actor",
                                                    children: n.account?.displayName
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/community/NotificationPanel.jsx",
                                                    lineNumber: 65,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "notif-item__label",
                                                    children: label
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/community/NotificationPanel.jsx",
                                                    lineNumber: 66,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "notif-item__time",
                                                    children: relativeTime(n.createdAt)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/community/NotificationPanel.jsx",
                                                    lineNumber: 67,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/community/NotificationPanel.jsx",
                                            lineNumber: 61,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        n.post?.content && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "notif-item__excerpt",
                                            dangerouslySetInnerHTML: {
                                                __html: n.post.content
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/community/NotificationPanel.jsx",
                                            lineNumber: 70,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/community/NotificationPanel.jsx",
                                    lineNumber: 60,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, n.id, true, {
                            fileName: "[project]/src/components/community/NotificationPanel.jsx",
                            lineNumber: 56,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0));
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/community/NotificationPanel.jsx",
                lineNumber: 47,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/community/NotificationPanel.jsx",
        lineNumber: 32,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(NotificationPanel, "U2OxW8RnfS2tku59OMO4XgTknZ4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CommunityContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCommunity"]
    ];
});
_c = NotificationPanel;
const __TURBOPACK__default__export__ = NotificationPanel;
var _c;
__turbopack_context__.k.register(_c, "NotificationPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/community/CommunityLoginPrompt.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/globe.js [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mastodonService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/mastodonService.js [app-client] (ecmascript)");
'use client';
;
;
;
;
;
const CommunityLoginPrompt = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "login-prompt",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "login-prompt__icon",
                children: "🌐"
            }, void 0, false, {
                fileName: "[project]/src/components/community/CommunityLoginPrompt.jsx",
                lineNumber: 10,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "login-prompt__title",
                children: "Koza Topluluğuna Katılın"
            }, void 0, false, {
                fileName: "[project]/src/components/community/CommunityLoginPrompt.jsx",
                lineNumber: 11,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "login-prompt__desc",
                children: "Hikaye paylaşın, başkalarından ilham alın ve büyüyen bir empati topluluğunun parçası olun."
            }, void 0, false, {
                fileName: "[project]/src/components/community/CommunityLoginPrompt.jsx",
                lineNumber: 12,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "login-prompt__features",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "login-prompt__feature",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/src/components/community/CommunityLoginPrompt.jsx",
                                lineNumber: 17,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Federated & açık platform"
                            }, void 0, false, {
                                fileName: "[project]/src/components/community/CommunityLoginPrompt.jsx",
                                lineNumber: 18,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/community/CommunityLoginPrompt.jsx",
                        lineNumber: 16,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "login-prompt__feature",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/src/components/community/CommunityLoginPrompt.jsx",
                                lineNumber: 21,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Gerçek insanlar, gerçek hikayeler"
                            }, void 0, false, {
                                fileName: "[project]/src/components/community/CommunityLoginPrompt.jsx",
                                lineNumber: 22,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/community/CommunityLoginPrompt.jsx",
                        lineNumber: 20,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/community/CommunityLoginPrompt.jsx",
                lineNumber: 15,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mastodonService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["community"].loginUrl(),
                className: "login-prompt__btn",
                children: "✨ Toplulukla Bağlan"
            }, void 0, false, {
                fileName: "[project]/src/components/community/CommunityLoginPrompt.jsx",
                lineNumber: 25,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "login-prompt__note",
                children: "Mastodon hesabınızla güvenli OAuth bağlantısı."
            }, void 0, false, {
                fileName: "[project]/src/components/community/CommunityLoginPrompt.jsx",
                lineNumber: 28,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/community/CommunityLoginPrompt.jsx",
        lineNumber: 9,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_c = CommunityLoginPrompt;
const __TURBOPACK__default__export__ = CommunityLoginPrompt;
var _c;
__turbopack_context__.k.register(_c, "CommunityLoginPrompt");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/views/CommunityView.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$earth$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/earth.js [app-client] (ecmascript) <export default as Globe2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CommunityContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/CommunityContext.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$community$2f$TimelineFeed$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/community/TimelineFeed.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$community$2f$PostComposer$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/community/PostComposer.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$community$2f$NotificationPanel$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/community/NotificationPanel.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$community$2f$CommunityLoginPrompt$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/community/CommunityLoginPrompt.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
// ─── Search Box ──────────────────────────────────────────────────────────────
const SearchBox = ()=>{
    _s();
    const { searchContent, searchResults, searchLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CommunityContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCommunity"])();
    const [q, setQ] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const handleSearch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SearchBox.useCallback[handleSearch]": (e)=>{
            e.preventDefault();
            searchContent({
                q
            });
        }
    }["SearchBox.useCallback[handleSearch]"], [
        q,
        searchContent
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleSearch,
        className: "community-search",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            className: "community-search__input",
            value: q,
            onChange: (e)=>setQ(e.target.value),
            placeholder: "🔍 Ara..."
        }, void 0, false, {
            fileName: "[project]/src/views/CommunityView.jsx",
            lineNumber: 23,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/views/CommunityView.jsx",
        lineNumber: 22,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(SearchBox, "y3kAgP+ofwOkb3b9FlbwX312Yis=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CommunityContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCommunity"]
    ];
});
_c = SearchBox;
// ─── Left Sidebar ─────────────────────────────────────────────────────────────
const LeftSidebar = ({ onNotif, notifOpen })=>{
    _s1();
    const { mastodonUser, timelineType, setTimelineType, logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CommunityContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCommunity"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "community-sidebar community-sidebar--left",
        children: [
            mastodonUser && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "community-profile-card",
                children: [
                    mastodonUser.avatar ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: mastodonUser.avatar,
                        alt: mastodonUser.username,
                        className: "community-profile-card__avatar"
                    }, void 0, false, {
                        fileName: "[project]/src/views/CommunityView.jsx",
                        lineNumber: 42,
                        columnNumber: 27
                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "community-profile-card__avatar community-profile-card__avatar--placeholder",
                        children: (mastodonUser.displayName || '?')[0]
                    }, void 0, false, {
                        fileName: "[project]/src/views/CommunityView.jsx",
                        lineNumber: 43,
                        columnNumber: 27
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "community-profile-card__info",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "community-profile-card__name",
                                children: mastodonUser.displayName
                            }, void 0, false, {
                                fileName: "[project]/src/views/CommunityView.jsx",
                                lineNumber: 46,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "community-profile-card__username",
                                children: [
                                    "@",
                                    mastodonUser.username
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/views/CommunityView.jsx",
                                lineNumber: 47,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/views/CommunityView.jsx",
                        lineNumber: 45,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "community-profile-card__stats",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: mastodonUser.postsCount ?? '—'
                                    }, void 0, false, {
                                        fileName: "[project]/src/views/CommunityView.jsx",
                                        lineNumber: 50,
                                        columnNumber: 31
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    " gönderi"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/views/CommunityView.jsx",
                                lineNumber: 50,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: mastodonUser.followersCount ?? '—'
                                    }, void 0, false, {
                                        fileName: "[project]/src/views/CommunityView.jsx",
                                        lineNumber: 51,
                                        columnNumber: 31
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    " takipçi"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/views/CommunityView.jsx",
                                lineNumber: 51,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/views/CommunityView.jsx",
                        lineNumber: 49,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/views/CommunityView.jsx",
                lineNumber: 40,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "community-nav",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `community-nav__item ${timelineType === 'public' ? 'community-nav__item--active' : ''}`,
                        onClick: ()=>setTimelineType('public'),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$earth$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe2$3e$__["Globe2"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/src/views/CommunityView.jsx",
                                lineNumber: 61,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            " Keşfet"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/views/CommunityView.jsx",
                        lineNumber: 57,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    mastodonUser && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `community-nav__item ${timelineType === 'home' ? 'community-nav__item--active' : ''}`,
                        onClick: ()=>setTimelineType('home'),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/src/views/CommunityView.jsx",
                                lineNumber: 68,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            " Ana Akış"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/views/CommunityView.jsx",
                        lineNumber: 64,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `community-nav__item ${notifOpen ? 'community-nav__item--active' : ''}`,
                        onClick: onNotif,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/src/views/CommunityView.jsx",
                                lineNumber: 75,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            " Bildirimler"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/views/CommunityView.jsx",
                        lineNumber: 71,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/views/CommunityView.jsx",
                lineNumber: 56,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            mastodonUser && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "community-logout",
                onClick: logout,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                        size: 15
                    }, void 0, false, {
                        fileName: "[project]/src/views/CommunityView.jsx",
                        lineNumber: 81,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    " Çıkış Yap"
                ]
            }, void 0, true, {
                fileName: "[project]/src/views/CommunityView.jsx",
                lineNumber: 80,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/views/CommunityView.jsx",
        lineNumber: 38,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(LeftSidebar, "FXZ2uSvoX6JfUSUft1TEy+ZvJiU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CommunityContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCommunity"]
    ];
});
_c1 = LeftSidebar;
// ─── Right Sidebar ────────────────────────────────────────────────────────────
const RightSidebar = ({ showSearch })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "community-sidebar community-sidebar--right",
        children: [
            showSearch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SearchBox, {}, void 0, false, {
                fileName: "[project]/src/views/CommunityView.jsx",
                lineNumber: 91,
                columnNumber: 24
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "community-info-card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "community-info-card__title",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                size: 16
                            }, void 0, false, {
                                fileName: "[project]/src/views/CommunityView.jsx",
                                lineNumber: 94,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            " Koza Topluluğu"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/views/CommunityView.jsx",
                        lineNumber: 93,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "community-info-card__desc",
                        children: "Empati temelli bir paylaşım alanı. Açık, federe ve güvenli."
                    }, void 0, false, {
                        fileName: "[project]/src/views/CommunityView.jsx",
                        lineNumber: 96,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/views/CommunityView.jsx",
                lineNumber: 92,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/views/CommunityView.jsx",
        lineNumber: 90,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c2 = RightSidebar;
// ─── Inner Page (must be inside CommunityProvider) ───────────────────────────
const CommunityInner = ()=>{
    _s2();
    const { mastodonUser, authLoading, notifications } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CommunityContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCommunity"])();
    const [notifOpen, setNotifOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [replyTo, setReplyTo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleReply = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CommunityInner.useCallback[handleReply]": (post)=>{
            setReplyTo(post);
        }
    }["CommunityInner.useCallback[handleReply]"], []);
    if (authLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "community-loading",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "community-loading__spinner"
                }, void 0, false, {
                    fileName: "[project]/src/views/CommunityView.jsx",
                    lineNumber: 116,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "Topluluk yükleniyor..."
                }, void 0, false, {
                    fileName: "[project]/src/views/CommunityView.jsx",
                    lineNumber: 117,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/views/CommunityView.jsx",
            lineNumber: 115,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "community-layout",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LeftSidebar, {
                onNotif: ()=>setNotifOpen((v)=>!v),
                notifOpen: notifOpen
            }, void 0, false, {
                fileName: "[project]/src/views/CommunityView.jsx",
                lineNumber: 125,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "community-main",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "community-main__header",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "community-main__title",
                            children: notifOpen ? 'Bildirimler' : 'Topluluk'
                        }, void 0, false, {
                            fileName: "[project]/src/views/CommunityView.jsx",
                            lineNumber: 130,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/views/CommunityView.jsx",
                        lineNumber: 129,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    notifOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$community$2f$NotificationPanel$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        onClose: ()=>setNotifOpen(false)
                    }, void 0, false, {
                        fileName: "[project]/src/views/CommunityView.jsx",
                        lineNumber: 136,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            mastodonUser ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$community$2f$PostComposer$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                inReplyToId: replyTo?.id,
                                replyingTo: replyTo?.authorUsername,
                                onSuccess: ()=>setReplyTo(null)
                            }, void 0, false, {
                                fileName: "[project]/src/views/CommunityView.jsx",
                                lineNumber: 140,
                                columnNumber: 31
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$community$2f$CommunityLoginPrompt$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/src/views/CommunityView.jsx",
                                lineNumber: 145,
                                columnNumber: 31
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$community$2f$TimelineFeed$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                onReply: handleReply
                            }, void 0, false, {
                                fileName: "[project]/src/views/CommunityView.jsx",
                                lineNumber: 147,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/src/views/CommunityView.jsx",
                lineNumber: 128,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RightSidebar, {
                showSearch: !!mastodonUser
            }, void 0, false, {
                fileName: "[project]/src/views/CommunityView.jsx",
                lineNumber: 153,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/views/CommunityView.jsx",
        lineNumber: 123,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s2(CommunityInner, "6anrwmI43M/GgG9Ss1ka9ov6ueY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CommunityContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCommunity"]
    ];
});
_c3 = CommunityInner;
// ─── Top-level Export (wraps in CommunityProvider) ───────────────────────────
const CommunityView = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CommunityContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommunityProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CommunityInner, {}, void 0, false, {
            fileName: "[project]/src/views/CommunityView.jsx",
            lineNumber: 161,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/views/CommunityView.jsx",
        lineNumber: 160,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c4 = CommunityView;
const __TURBOPACK__default__export__ = CommunityView;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "SearchBox");
__turbopack_context__.k.register(_c1, "LeftSidebar");
__turbopack_context__.k.register(_c2, "RightSidebar");
__turbopack_context__.k.register(_c3, "CommunityInner");
__turbopack_context__.k.register(_c4, "CommunityView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_ea27d5b4._.js.map