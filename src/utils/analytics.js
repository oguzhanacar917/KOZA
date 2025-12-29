/**
 * Analytics and tracking utilities
 */

class Analytics {
    constructor() {
        this.events = [];
        this.sessionStart = Date.now();
    }

    track(eventName, properties = {}) {
        const event = {
            name: eventName,
            timestamp: Date.now(),
            sessionDuration: Date.now() - this.sessionStart,
            ...properties
        };

        this.events.push(event);

        // Store in localStorage for persistence
        this.saveToStorage();

        console.log('📊 Analytics:', eventName, properties);
    }

    saveToStorage() {
        try {
            const stored = JSON.parse(localStorage.getItem('koza-analytics') || '[]');
            const combined = [...stored, ...this.events].slice(-100); // Keep last 100 events
            localStorage.setItem('koza-analytics', JSON.stringify(combined));
            this.events = [];
        } catch (e) {
            console.error('Failed to save analytics:', e);
        }
    }

    getStats() {
        try {
            const events = JSON.parse(localStorage.getItem('koza-analytics') || '[]');
            return {
                totalEvents: events.length,
                storiesCreated: events.filter(e => e.name === 'story_created').length,
                gamesCreated: events.filter(e => e.name === 'game_created').length,
                xpEarned: events
                    .filter(e => e.name === 'xp_awarded')
                    .reduce((sum, e) => sum + (e.amount || 0), 0),
                lastActivity: events.length > 0 ? events[events.length - 1].timestamp : null
            };
        } catch (e) {
            return null;
        }
    }
}

export const analytics = new Analytics();
