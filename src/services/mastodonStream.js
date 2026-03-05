'use client';
/**
 * Mastodon WebSocket Streaming Client
 * Connects to the Mastodon streaming API and allows subscribing to events.
 */

const MASTODON_WS_URL = process.env.NEXT_PUBLIC_MASTODON_WS_URL || '';

export class MastodonStream {
    constructor() {
        this.ws = null;
        this.listeners = {};
        this.reconnectTimer = null;
        this.connected = false;
    }

    connect(stream = 'public') {
        if (!MASTODON_WS_URL) {
            console.warn('[MastodonStream] NEXT_PUBLIC_MASTODON_WS_URL not set. Real-time streaming disabled.');
            return;
        }

        const url = `${MASTODON_WS_URL}/api/v1/streaming?stream=${stream}`;

        try {
            this.ws = new WebSocket(url);

            this.ws.onopen = () => {
                this.connected = true;
                console.log('[MastodonStream] Connected:', stream);
                this._emit('connected');
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this._emit(data.event, data.payload ? JSON.parse(data.payload) : null);
                } catch (e) {
                    // ignore parse errors
                }
            };

            this.ws.onerror = (err) => {
                console.error('[MastodonStream] Error:', err);
                this._emit('error', err);
            };

            this.ws.onclose = () => {
                this.connected = false;
                this._emit('disconnected');
                // Auto-reconnect after 5s
                this.reconnectTimer = setTimeout(() => this.connect(stream), 5000);
            };
        } catch (err) {
            console.error('[MastodonStream] Failed to connect:', err);
        }
    }

    disconnect() {
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.connected = false;
    }

    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
        return () => this.off(event, callback);
    }

    off(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    _emit(event, data) {
        (this.listeners[event] || []).forEach(cb => {
            try { cb(data); } catch (e) { /* ignore */ }
        });
    }
}

// Singleton instance
export const mastodonStream = new MastodonStream();
