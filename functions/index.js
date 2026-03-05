// functions/index.js
// Cloud Functions API proxy for Mastodon Community endpoints

const { onRequest } = require('firebase-functions/v2/https');
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

// ─── Configuration ────────────────────────────────────────────────────────────
// These are server-side only and never exposed to the browser.
const MASTODON_BASE_URL = 'https://social.koza.app';
const MASTODON_CLIENT_ID = 'kHzJeAT7fi5lAWiJxc6sS6o8TrW5cTFVwLhHTQB6TFQ';
const MASTODON_CLIENT_SECRET = 'Y4U_TLr0HJPYr4O-eemKo1VPxsB1Z5-ekioaMKLQT6M';
const MASTODON_REDIRECT_URI = 'https://koza-empathy.web.app/api/auth/callback';
const COOKIE_NAME = 'mastodon_token';

const app = express();
app.use(express.json());

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getToken(req) {
    const raw = req.headers.cookie || '';
    const pairs = raw.split(';');
    for (const pair of pairs) {
        const [k, v] = pair.trim().split('=');
        if (k === COOKIE_NAME) return decodeURIComponent(v);
    }
    return null;
}

async function mastodonFetch(path, options = {}, token = null) {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${MASTODON_BASE_URL}${path}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Mastodon error ${res.status}`);
    return data;
}

function normalizePost(s) {
    const base = s.reblog || s;
    return {
        id: s.id,
        content: base.content,
        spoilerText: base.spoiler_text,
        createdAt: base.created_at,
        author: base.account.display_name || base.account.username,
        authorUsername: base.account.username,
        authorAvatar: base.account.avatar,
        authorId: base.account.id,
        likesCount: base.favourites_count,
        boostsCount: base.reblogs_count,
        repliesCount: base.replies_count,
        isLiked: base.favourited,
        isBoosted: base.reblogged,
        media: (base.media_attachments || []).map(m => ({
            id: m.id, url: m.url, previewUrl: m.preview_url, type: m.type
        })),
        isBoostedPost: !!s.reblog,
        boostedBy: s.reblog ? s.account.display_name : null,
    };
}

function normalizeAccount(a) {
    return {
        id: a.id,
        username: a.username,
        displayName: a.display_name,
        avatar: a.avatar,
        bio: a.note,
        followersCount: a.followers_count,
        followingCount: a.following_count,
        postsCount: a.statuses_count,
        isFollowing: a.following,
    };
}

// ─── Auth Routes ──────────────────────────────────────────────────────────────
app.get('/auth/login', (req, res) => {
    const url = new URL(`${MASTODON_BASE_URL}/oauth/authorize`);
    url.searchParams.set('client_id', MASTODON_CLIENT_ID);
    url.searchParams.set('scope', 'read write follow');
    url.searchParams.set('redirect_uri', MASTODON_REDIRECT_URI);
    url.searchParams.set('response_type', 'code');
    res.redirect(url.toString());
});

app.get('/auth/callback', async (req, res) => {
    const { code } = req.query;
    const body = new URLSearchParams({
        client_id: MASTODON_CLIENT_ID,
        client_secret: MASTODON_CLIENT_SECRET,
        redirect_uri: MASTODON_REDIRECT_URI,
        grant_type: 'authorization_code',
        code,
    });
    const tokenRes = await fetch(`${MASTODON_BASE_URL}/oauth/token`, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return res.status(400).json({ error: 'OAuth failed' });
    const maxAge = 60 * 60 * 24 * 30;
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=${tokenData.access_token}; HttpOnly; Secure; Path=/; Max-Age=${maxAge}; SameSite=Lax`);
    res.redirect('https://koza-empathy.web.app');
});

app.get('/auth/me', async (req, res) => {
    const token = getToken(req);
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const user = await mastodonFetch('/api/v1/accounts/verify_credentials', {}, token);
        res.json(normalizeAccount(user));
    } catch (e) { res.status(401).json({ error: e.message }); }
});

app.post('/auth/logout', (req, res) => {
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; Secure; Path=/; Max-Age=0`);
    res.json({ success: true });
});

// ─── Timeline ─────────────────────────────────────────────────────────────────
app.get('/community/timeline', async (req, res) => {
    const token = getToken(req);
    const { type = 'public', max_id, limit = 20 } = req.query;
    const endpoint = type === 'home' ? '/api/v1/timelines/home' : '/api/v1/timelines/public';
    const params = new URLSearchParams({ limit });
    if (max_id) params.set('max_id', max_id);
    try {
        const posts = await mastodonFetch(`${endpoint}?${params}`, {}, token);
        const normalized = posts.map(normalizePost);
        const next = normalized.length > 0 ? normalized[normalized.length - 1].id : null;
        res.json({ posts: normalized, nextMaxId: next, hasMore: posts.length >= Number(limit) });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Post CRUD ────────────────────────────────────────────────────────────────
app.post('/community/post', async (req, res) => {
    const token = getToken(req);
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const { content, inReplyToId, mediaIds = [] } = req.body;
    try {
        const post = await mastodonFetch('/api/v1/statuses', {
            method: 'POST',
            body: JSON.stringify({ status: content, in_reply_to_id: inReplyToId, media_ids: mediaIds }),
        }, token);
        res.json(normalizePost(post));
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Like ─────────────────────────────────────────────────────────────────────
app.post('/community/post/:id/like', async (req, res) => {
    const token = getToken(req);
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const endpoint = req.query.undo === 'true'
        ? `/api/v1/statuses/${req.params.id}/unfavourite`
        : `/api/v1/statuses/${req.params.id}/favourite`;
    try { res.json(normalizePost(await mastodonFetch(endpoint, { method: 'POST' }, token))); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Boost ────────────────────────────────────────────────────────────────────
app.post('/community/post/:id/boost', async (req, res) => {
    const token = getToken(req);
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const endpoint = req.query.undo === 'true'
        ? `/api/v1/statuses/${req.params.id}/unreblog`
        : `/api/v1/statuses/${req.params.id}/reblog`;
    try { res.json(normalizePost(await mastodonFetch(endpoint, { method: 'POST' }, token))); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Context ──────────────────────────────────────────────────────────────────
app.get('/community/post/:id/context', async (req, res) => {
    const token = getToken(req);
    try {
        const ctx = await mastodonFetch(`/api/v1/statuses/${req.params.id}/context`, {}, token);
        res.json({
            ancestors: ctx.ancestors.map(normalizePost),
            descendants: ctx.descendants.map(normalizePost),
        });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── User Profile ─────────────────────────────────────────────────────────────
app.get('/community/user/:id', async (req, res) => {
    const token = getToken(req);
    try {
        const user = await mastodonFetch(`/api/v1/accounts/${req.params.id}`, {}, token);
        const posts = await mastodonFetch(`/api/v1/accounts/${req.params.id}/statuses`, {}, token);
        res.json({ user: normalizeAccount(user), posts: posts.map(normalizePost) });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Follow ───────────────────────────────────────────────────────────────────
app.post('/community/user/:id/follow', async (req, res) => {
    const token = getToken(req);
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const endpoint = req.query.undo === 'true'
        ? `/api/v1/accounts/${req.params.id}/unfollow`
        : `/api/v1/accounts/${req.params.id}/follow`;
    try { res.json(await mastodonFetch(endpoint, { method: 'POST' }, token)); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Notifications ────────────────────────────────────────────────────────────
app.get('/community/notifications', async (req, res) => {
    const token = getToken(req);
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const notifs = await mastodonFetch('/api/v1/notifications', {}, token);
        res.json(notifs.map(n => ({
            id: n.id,
            type: n.type,
            createdAt: n.created_at,
            account: n.account ? normalizeAccount(n.account) : null,
            post: n.status ? normalizePost(n.status) : null,
        })));
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Search ───────────────────────────────────────────────────────────────────
app.get('/community/search', async (req, res) => {
    const token = getToken(req);
    const { q, type } = req.query;
    const params = new URLSearchParams({ q, resolve: 'true' });
    if (type) params.set('type', type);
    try {
        const results = await mastodonFetch(`/api/v2/search?${params}`, {}, token);
        res.json({
            posts: (results.statuses || []).map(normalizePost),
            users: (results.accounts || []).map(normalizeAccount),
            hashtags: results.hashtags || [],
        });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

exports.api = onRequest({ region: 'us-central1', timeoutSeconds: 30 }, app);
