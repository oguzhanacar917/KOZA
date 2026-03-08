import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'mastodon_token';

export async function GET(request) {
    const MASTODON_BASE_URL = process.env.MASTODON_BASE_URL;
    const MASTODON_CLIENT_ID = process.env.MASTODON_CLIENT_ID;
    const MASTODON_CLIENT_SECRET = process.env.MASTODON_CLIENT_SECRET;
    const MASTODON_REDIRECT_URI = process.env.MASTODON_REDIRECT_URI;

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    if (!code) return NextResponse.json({ error: 'No code' }, { status: 400 });

    const body = new URLSearchParams({
        client_id: MASTODON_CLIENT_ID,
        client_secret: MASTODON_CLIENT_SECRET,
        redirect_uri: MASTODON_REDIRECT_URI,
        grant_type: 'authorization_code',
        code,
    });

    const tokenRes = await fetch(`${MASTODON_BASE_URL}/oauth/token`, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return NextResponse.json({ error: 'OAuth failed' }, { status: 400 });

    const maxAge = 60 * 60 * 24 * 30;
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set(COOKIE_NAME, tokenData.access_token, {
        httpOnly: true, secure: true, path: '/', maxAge, sameSite: 'lax',
    });
    return response;
}
