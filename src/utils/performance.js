/**
 * Performance monitoring utilities
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = [];
        this.observers = [];
        this.init();
    }

    init() {
        // Monitor page load performance
        if (typeof window !== 'undefined' && window.performance) {
            window.addEventListener('load', () => {
                // Use modern PerformanceNavigationTiming (Navigation Timing Level 2)
                // instead of the deprecated window.performance.timing Level 1 API
                setTimeout(() => {
                    const [navEntry] = performance.getEntriesByType('navigation');
                    if (navEntry) {
                        const pageLoadTime = navEntry.loadEventEnd - navEntry.startTime;
                        const connectTime = navEntry.responseEnd - navEntry.requestStart;
                        const renderTime = navEntry.domComplete - navEntry.domInteractive;

                        this.recordMetric('page_load', {
                            total: Math.round(pageLoadTime),
                            connect: Math.round(connectTime),
                            render: Math.round(renderTime)
                        });
                    }
                }, 0);
            });

            // Monitor long tasks
            if ('PerformanceObserver' in window) {
                try {
                    const observer = new PerformanceObserver((list) => {
                        for (const entry of list.getEntries()) {
                            if (entry.duration > 50) {
                                this.recordMetric('long_task', {
                                    duration: entry.duration,
                                    name: entry.name
                                });
                            }
                        }
                    });
                    observer.observe({ entryTypes: ['longtask'] });
                    this.observers.push(observer);
                } catch {
                    console.warn('Long task monitoring not supported');
                }
            }
        }
    }

    recordMetric(name, data) {
        const metric = {
            name,
            timestamp: Date.now(),
            ...data
        };

        this.metrics.push(metric);
        console.log('📊 Performance:', name, data);

        // Keep only last 100 metrics
        if (this.metrics.length > 100) {
            this.metrics.shift();
        }
    }

    measureAsync(name, asyncFn) {
        const start = performance.now();
        return asyncFn().finally(() => {
            const duration = performance.now() - start;
            this.recordMetric(name, { duration });
        });
    }

    getMetrics() {
        return this.metrics;
    }

    getAverageMetric(name) {
        const filtered = this.metrics.filter(m => m.name === name);
        if (filtered.length === 0) return null;

        const sum = filtered.reduce((acc, m) => acc + (m.duration || m.total || 0), 0);
        return sum / filtered.length;
    }

    cleanup() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
    }
}

export const performanceMonitor = new PerformanceMonitor();
