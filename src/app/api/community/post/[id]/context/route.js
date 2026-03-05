import { NextResponse } from 'next/server';
import { getMastodonToken, mastodonFetch, normalizePost } from '../../../../services/mastodonServer';

export async function GET(request, { params }) {
    const token = getMastodonToken(request);
    try {
        const ctx = await mastodonFetch(`/api/v1/statuses/${params.id}/context`, {}, token);
        return NextResponse.json({
            ancestors: ctx.ancestors.map(normalizePost),
            descendants: ctx.descendants.map(normalizePost),
        });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
