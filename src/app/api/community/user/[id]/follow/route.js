import { NextResponse } from 'next/server';
import { getMastodonToken, mastodonFetch } from '../../../../../../services/mastodonServer';

export async function POST(request, { params }) {
    const token = getMastodonToken(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const undo = searchParams.get('undo') === 'true';
    const endpoint = undo
        ? `/api/v1/accounts/${params.id}/unfollow`
        : `/api/v1/accounts/${params.id}/follow`;
    try {
        return NextResponse.json(await mastodonFetch(endpoint, { method: 'POST' }, token));
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
