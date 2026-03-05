import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ success: true });
    response.cookies.set('mastodon_token', '', { httpOnly: true, secure: true, path: '/', maxAge: 0 });
    return response;
}
