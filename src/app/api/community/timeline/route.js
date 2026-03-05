import { NextResponse } from 'next/server';
import { getMastodonToken, mastodonFetch, normalizePost } from '../../../../services/mastodonServer';

export async function GET(request) {
    const token = getMastodonToken(request);
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'public';
    const max_id = searchParams.get('max_id');
    const limit = searchParams.get('limit') || '20';
    const endpoint = type === 'home' ? '/api/v1/timelines/home' : '/api/v1/timelines/public';
    const params = new URLSearchParams({ limit });
    if (max_id) params.set('max_id', max_id);
    try {
        const posts = await mastodonFetch(`${endpoint}?${params}`, {}, token);
        const normalized = posts.map(normalizePost);
        const nextMaxId = normalized.length > 0 ? normalized[normalized.length - 1].id : null;
        return NextResponse.json({ posts: normalized, nextMaxId, hasMore: posts.length >= Number(limit) });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
