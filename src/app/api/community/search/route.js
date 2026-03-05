import { NextResponse } from 'next/server';
import { getMastodonToken, mastodonFetch, normalizePost, normalizeAccount } from '../../../../services/mastodonServer';

export async function GET(request) {
    const token = getMastodonToken(request);
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const type = searchParams.get('type');
    if (!q) return NextResponse.json({ posts: [], users: [], hashtags: [] });
    const params = new URLSearchParams({ q, resolve: 'true' });
    if (type) params.set('type', type);
    try {
        const results = await mastodonFetch(`/api/v2/search?${params}`, {}, token);
        return NextResponse.json({
            posts: (results.statuses || []).map(normalizePost),
            users: (results.accounts || []).map(normalizeAccount),
            hashtags: results.hashtags || [],
        });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
