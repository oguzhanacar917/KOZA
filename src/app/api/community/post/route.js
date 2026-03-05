import { NextResponse } from 'next/server';
import { getMastodonToken, mastodonFetch, normalizePost } from '../../../../services/mastodonServer';

export async function POST(request) {
    const token = getMastodonToken(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { content, inReplyToId, mediaIds = [] } = await request.json();
    try {
        const post = await mastodonFetch('/api/v1/statuses', {
            method: 'POST',
            body: JSON.stringify({ status: content, in_reply_to_id: inReplyToId, media_ids: mediaIds }),
        }, token);
        return NextResponse.json(normalizePost(post));
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
