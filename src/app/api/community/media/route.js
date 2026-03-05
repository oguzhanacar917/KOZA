import { NextResponse } from 'next/server';
import { getMastodonToken } from '../../../../services/mastodonServer';

const MASTODON_BASE_URL = process.env.MASTODON_BASE_URL;

export async function POST(request) {
    const token = getMastodonToken(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const formData = await request.formData();
        const res = await fetch(`${MASTODON_BASE_URL}/api/v2/media`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });
        if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
        const data = await res.json();
        return NextResponse.json({ id: data.id, url: data.url, previewUrl: data.preview_url, type: data.type });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
