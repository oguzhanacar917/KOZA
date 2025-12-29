import ReactGA from 'react-ga4';
import { ANALYTICS_CONFIG } from '../config';

class GoogleAnalytics {
    constructor() {
        this.initialized = false;
    }

    initialize() {
        if (this.initialized || !ANALYTICS_CONFIG.measurementId) {
            return;
        }

        try {
            ReactGA.initialize(ANALYTICS_CONFIG.measurementId, {
                gaOptions: {
                    anonymizeIp: true,
                }
            });
            this.initialized = true;
            console.log('📊 Google Analytics initialized');
        } catch (error) {
            console.error('Failed to initialize Google Analytics:', error);
        }
    }

    trackPageView(path) {
        if (!this.initialized) return;

        try {
            ReactGA.send({ hitType: 'pageview', page: path });
        } catch (error) {
            console.error('Failed to track page view:', error);
        }
    }

    trackEvent(category, action, label, value) {
        if (!this.initialized) return;

        try {
            ReactGA.event({
                category,
                action,
                label,
                value
            });
        } catch (error) {
            console.error('Failed to track event:', error);
        }
    }

    setUserProperties(properties) {
        if (!this.initialized) return;

        try {
            ReactGA.set(properties);
        } catch (error) {
            console.error('Failed to set user properties:', error);
        }
    }

    trackTiming(category, variable, value, label) {
        if (!this.initialized) return;

        try {
            ReactGA.event({
                category,
                action: variable,
                label,
                value,
                nonInteraction: true
            });
        } catch (error) {
            console.error('Failed to track timing:', error);
        }
    }
}

export const googleAnalytics = new GoogleAnalytics();
