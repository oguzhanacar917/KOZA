import { NextResponse } from 'next/server';
import { getMastodonToken, mastodonFetch, normalizeAccount } from '../../../../services/mastodonServer';

export async function GET(request) {
    const token = getMastodonToken(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const user = await mastodonFetch('/api/v1/accounts/verify_credentials', {}, token);
        return NextResponse.json(normalizeAccount(user));
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 401 });
    }
}
