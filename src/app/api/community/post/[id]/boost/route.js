import { NextResponse } from 'next/server';
import { getMastodonToken, mastodonFetch, normalizePost } from '../../../../services/mastodonServer';

export async function POST(request, { params }) {
    const token = getMastodonToken(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const undo = searchParams.get('undo') === 'true';
    const endpoint = undo
        ? `/api/v1/statuses/${params.id}/unreblog`
        : `/api/v1/statuses/${params.id}/reblog`;
    try {
        const post = await mastodonFetch(endpoint, { method: 'POST' }, token);
        return NextResponse.json(normalizePost(post));
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
