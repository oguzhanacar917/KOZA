/**
 * Server-side Mastodon helper utilities.
 * Used only in Next.js API routes (server-side only).
 */

const BASE_URL = process.env.MASTODON_BASE_URL || '';

/**
 * Extract mastodon_token from request cookies.
 */
export function getMastodonToken(request) {
    return request.cookies.get('mastodon_token')?.value || null;
}

/**
 * Proxied fetch to Mastodon API.
 */
export async function mastodonFetch(path, token, options = {}) {
    if (!BASE_URL) throw new Error('MASTODON_BASE_URL is not set');

    const url = `${BASE_URL}${path}`;
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const res = await fetch(url, { ...options, headers });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Mastodon API error ${res.status}: ${body}`);
    }

    return res.json();
}

/**
 * Normalize a Mastodon status object into a simplified Post object.
 */
export function normalizePost(s) {
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
        media: (actual.media_attachments || []).map(m => ({
            id: m.id,
            type: m.type,
            url: m.url,
            previewUrl: m.preview_url,
        })),
        isLiked: s.favourited || false,
        isBoosted: s.reblogged || false,
        isBoostedPost: !!s.reblog,
        boostedBy: s.reblog ? (s.account?.display_name || s.account?.username) : null,
        url: actual.url,
        inReplyToId: actual.in_reply_to_id || null,
        spoilerText: actual.spoiler_text || '',
        visibility: actual.visibility || 'public',
    };
}

/**
 * Normalize a Mastodon account object.
 */
export function normalizeAccount(a) {
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
        createdAt: a.created_at,
    };
}

/**
 * Normalize a Mastodon notification.
 */
export function normalizeNotification(n) {
    return {
        id: n.id,
        type: n.type,
        createdAt: n.created_at,
        account: normalizeAccount(n.account),
        post: n.status ? normalizePost(n.status) : null,
    };
}
