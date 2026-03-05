import { NextResponse } from 'next/server';
import { getMastodonToken, mastodonFetch, normalizeAccount, normalizePost } from '../../../../services/mastodonServer';

export async function GET(request, { params }) {
    const token = getMastodonToken(request);
    try {
        const user = await mastodonFetch(`/api/v1/accounts/${params.id}`, {}, token);
        const posts = await mastodonFetch(`/api/v1/accounts/${params.id}/statuses`, {}, token);
        return NextResponse.json({ user: normalizeAccount(user), posts: posts.map(normalizePost) });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
