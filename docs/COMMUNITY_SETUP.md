# Koza Community System Setup Guide

The Koza Community System is a headless social platform that uses a Mastodon instance as its backend. It integrates directly into the existing Koza Next.js app.

## Prerequisites
1. A running **Mastodon** instance (e.g., `https://social.koza.app`).
2. Admin access to the Mastodon instance to create an OAuth application.

---

## 1. Create a Mastodon OAuth Application

1. Log in to your Mastodon instance as an administrator.
2. Go to **Preferences** -> **Development** -> **New Application**.
3. Fill in the details:
   - **Application Name**: `Koza Community`
   - **Application Website**: `https://koza-empathy.web.app`
   - **Redirect URI**: `https://koza-empathy.web.app/api/auth/callback`
   - **Scopes**: Ensure the following scopes are checked:
     - `read`
     - `write`
     - `follow`
4. Click **Submit**.
5. You will be provided with a **Client key**, **Client secret**, and **Access token**.

---

## 2. Configure Environment Variables

Add the following variables to your Koza project's `.env.local` or `.env` file (and in your hosting provider's environment variables configuration, e.g., Firebase or Vercel):

```env
# Mastodon Configuration
MASTODON_BASE_URL=https://social.your-mastodon-instance.com
MASTODON_CLIENT_ID=your_client_key_here
MASTODON_CLIENT_SECRET=your_client_secret_here
MASTODON_REDIRECT_URI=https://koza-empathy.web.app/api/auth/callback

# WebSocket Streaming (Optional, for real-time updates)
# If left empty, the app will gracefully run without real-time streaming updates.
NEXT_PUBLIC_MASTODON_WS_URL=wss://social.your-mastodon-instance.com
```

**Important**:
- `MASTODON_REDIRECT_URI` must perfectly match the Redirect URI you specified in the Mastodon Developer settings.
- Do not add a trailing slash to `MASTODON_BASE_URL`.

---

## 3. Verify Server-side WebSocket Streaming

The real-time feed updates rely on the Mastodon Streaming API (`wss://.../api/v1/streaming`). Ensure your Mastodon server exposes its WebSocket server correctly (often on port 4000) and that your reverse proxy (Nginx/Traefik) allows WebSocket upgrade connections.

---

## 4. Usage

Once deployed, users can click "Topluluk" in the sidebar navigation. If they are not logged in, they will see a "Bağlan" prompt which redirects them to the Mastodon instance to authorize the app. After authorization, Mastodon redirects them back to `/api/auth/callback`, which sets a secure HTTP-Only cookie, seamlessly logging them into the community view without exposing the access token to the client.

## API Proxy Architecture
Client interactions go through the local Next.js API Routes (`/api/community/*`) to prevent CORS issues and protect tokens. The `mastodonService.js` on the client only talks to the Koza proxy routes.
