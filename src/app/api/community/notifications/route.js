import { NextResponse } from 'next/server';
import { getMastodonToken, mastodonFetch, normalizeNotification } from '../../../../services/mastodonServer';

export async function GET(request) {
    const token = getMastodonToken(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const notifs = await mastodonFetch('/api/v1/notifications', {}, token);
        return NextResponse.json(notifs.map(normalizeNotification));
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    const token = getMastodonToken(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        await mastodonFetch('/api/v1/notifications/clear', { method: 'POST' }, token);
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
