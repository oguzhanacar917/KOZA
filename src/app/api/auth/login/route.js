import { NextResponse } from 'next/server';

const MASTODON_BASE_URL = process.env.MASTODON_BASE_URL;
const MASTODON_CLIENT_ID = process.env.MASTODON_CLIENT_ID;
const MASTODON_REDIRECT_URI = process.env.MASTODON_REDIRECT_URI;

export async function GET() {
    const url = new URL(`${MASTODON_BASE_URL}/oauth/authorize`);
    url.searchParams.set('client_id', MASTODON_CLIENT_ID);
    url.searchParams.set('scope', 'read write follow');
    url.searchParams.set('redirect_uri', MASTODON_REDIRECT_URI);
    url.searchParams.set('response_type', 'code');
    return NextResponse.redirect(url.toString());
}
