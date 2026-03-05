module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/services/mastodonServer.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getMastodonToken",
    ()=>getMastodonToken,
    "mastodonFetch",
    ()=>mastodonFetch,
    "normalizeAccount",
    ()=>normalizeAccount,
    "normalizeNotification",
    ()=>normalizeNotification,
    "normalizePost",
    ()=>normalizePost
]);
/**
 * Server-side Mastodon helper utilities.
 * Used only in Next.js API routes (server-side only).
 */ const BASE_URL = process.env.MASTODON_BASE_URL || '';
function getMastodonToken(request) {
    return request.cookies.get('mastodon_token')?.value || null;
}
async function mastodonFetch(path, token, options = {}) {
    if (!BASE_URL) throw new Error('MASTODON_BASE_URL is not set');
    const url = `${BASE_URL}${path}`;
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
    };
    const res = await fetch(url, {
        ...options,
        headers
    });
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Mastodon API error ${res.status}: ${body}`);
    }
    return res.json();
}
function normalizePost(s) {
    if (!s) return null;
    const actual = s.reblog || s;
    return {
        id: s.id,
        content: actual.content,
        author: actual.account?.display_name || actual.account?.username || 'Unknown',
        authorUsername: actual.account?.username || '',
        authorAvatar: actual.account?.avatar || '',
        authorId: actual.account?.id || '',
        createdAt: s.created_at,
        likesCount: actual.favourites_count || 0,
        boostsCount: actual.reblogs_count || 0,
        repliesCount: actual.replies_count || 0,
        media: (actual.media_attachments || []).map((m)=>({
                id: m.id,
                type: m.type,
                url: m.url,
                previewUrl: m.preview_url
            })),
        isLiked: s.favourited || false,
        isBoosted: s.reblogged || false,
        isBoostedPost: !!s.reblog,
        boostedBy: s.reblog ? s.account?.display_name || s.account?.username : null,
        url: actual.url,
        inReplyToId: actual.in_reply_to_id || null,
        spoilerText: actual.spoiler_text || '',
        visibility: actual.visibility || 'public'
    };
}
function normalizeAccount(a) {
    if (!a) return null;
    return {
        id: a.id,
        username: a.username,
        displayName: a.display_name || a.username,
        avatar: a.avatar,
        header: a.header,
        bio: a.note,
        followersCount: a.followers_count,
        followingCount: a.following_count,
        postsCount: a.statuses_count,
        isFollowing: a.following || false,
        url: a.url,
        locked: a.locked || false,
        bot: a.bot || false,
        createdAt: a.created_at
    };
}
function normalizeNotification(n) {
    return {
        id: n.id,
        type: n.type,
        createdAt: n.created_at,
        account: normalizeAccount(n.account),
        post: n.status ? normalizePost(n.status) : null
    };
}
}),
"[project]/src/app/api/auth/me/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mastodonServer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/mastodonServer.js [app-route] (ecmascript)");
;
;
async function GET(request) {
    const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mastodonServer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMastodonToken"])(request);
    if (!token) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: 'Unauthorized'
    }, {
        status: 401
    });
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mastodonServer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mastodonFetch"])('/api/v1/accounts/verify_credentials', {}, token);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mastodonServer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeAccount"])(user));
    } catch (e) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: e.message
        }, {
            status: 401
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__eae5ae32._.js.map