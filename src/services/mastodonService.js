/**
 * Client-side Mastodon service — communicates with the Koza API proxy layer.
 * Never exposes the Mastodon access token directly.
 */

const BASE = '';

async function apiFetch(path, options = {}) {
    const res = await fetch(path, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || `Request failed: ${res.status}`);
    }

    return res.json();
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const community = {
    // Returns { user } from cookie session
    getMe: () => apiFetch('/api/auth/me'),

    loginUrl: () => '/api/auth/login',

    logout: () => apiFetch('/api/auth/logout', { method: 'POST' }),

    // ─── Timeline ──────────────────────────────────────────────────────────
    getTimeline: ({ type = 'public', maxId, limit = 20 } = {}) => {
        const qs = new URLSearchParams({ type, limit });
        if (maxId) qs.set('max_id', maxId);
        return apiFetch(`/api/community/timeline?${qs.toString()}`);
    },

    // ─── Posts ─────────────────────────────────────────────────────────────
    createPost: ({ content, inReplyToId, mediaIds, spoilerText, visibility }) =>
        apiFetch('/api/community/post', {
            method: 'POST',
            body: JSON.stringify({ content, inReplyToId, mediaIds, spoilerText, visibility }),
        }),

    likePost: (id) => apiFetch(`/api/community/post/${id}/like`, { method: 'POST' }),
    unlikePost: (id) => apiFetch(`/api/community/post/${id}/like`, { method: 'DELETE' }),

    boostPost: (id) => apiFetch(`/api/community/post/${id}/boost`, { method: 'POST' }),
    unboostPost: (id) => apiFetch(`/api/community/post/${id}/boost`, { method: 'DELETE' }),

    getPostContext: (id) => apiFetch(`/api/community/post/${id}/context`),

    // ─── Users ─────────────────────────────────────────────────────────────
    getUser: (id) => apiFetch(`/api/community/user/${id}`),
    getUserPosts: ({ id, maxId, limit = 20 } = {}) => {
        const qs = new URLSearchParams({ view: 'posts', limit });
        if (maxId) qs.set('max_id', maxId);
        return apiFetch(`/api/community/user/${id}?${qs.toString()}`);
    },

    followUser: (id) => apiFetch(`/api/community/user/${id}/follow`, { method: 'POST' }),
    unfollowUser: (id) => apiFetch(`/api/community/user/${id}/follow`, { method: 'DELETE' }),

    // ─── Notifications ─────────────────────────────────────────────────────
    getNotifications: ({ maxId, limit = 20 } = {}) => {
        const qs = new URLSearchParams({ limit });
        if (maxId) qs.set('max_id', maxId);
        return apiFetch(`/api/community/notifications?${qs.toString()}`);
    },
    clearNotifications: () => apiFetch('/api/community/notifications', { method: 'POST' }),

    // ─── Search ────────────────────────────────────────────────────────────
    search: ({ q, type = 'all', limit = 20 } = {}) => {
        const qs = new URLSearchParams({ q, type, limit });
        return apiFetch(`/api/community/search?${qs.toString()}`);
    },

    // ─── Media ─────────────────────────────────────────────────────────────
    uploadMedia: async (file) => {
        const form = new FormData();
        form.append('file', file);
        const res = await fetch('/api/community/media', { method: 'POST', body: form });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Media upload failed');
        }
        return res.json();
    },
};
