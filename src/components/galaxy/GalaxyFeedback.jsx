import React, { forwardRef } from 'react';
import './GalaxyFeedback.css';
import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

// --- Alerts ---

const statusIconMap = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle,
    error: XCircle,
};

export const GalaxyAlert = forwardRef(({ status = 'info', children, className = '', ...props }, ref) => {
    return (
        <div ref={ref} className={`galaxy-alert ${className}`} data-status={status} role="alert" {...props}>
            {children}
        </div>
    );
});

export const GalaxyAlertIcon = forwardRef(({ className = '', ...props }, ref) => {
    // We can infer icon from parent status context if we used Context, 
    // but for now we'll support explicit icon or manual usage.
    // Ideally usage is <GalaxyAlert status="error"><GalaxyAlertIcon icon={CustomIcon} />...</GalaxyAlert>
    return (
        <div ref={ref} className={`galaxy-alert-icon ${className}`} {...props} />
    );
});

// A managed AlertIcon that automatically picks the icon based on status props passed to it
export const GalaxyStatusIcon = ({ status = 'info', size = 20, ...props }) => {
    const Icon = statusIconMap[status] || Info;
    return <Icon size={size} {...props} />;
}

export const GalaxyAlertTitle = forwardRef(({ children, className = '', ...props }, ref) => {
    return (
        <div ref={ref} className={`galaxy-alert-title ${className}`} {...props}>
            {children}
        </div>
    );
});

export const GalaxyAlertDescription = forwardRef(({ children, className = '', ...props }, ref) => {
    return (
        <div ref={ref} className={`galaxy-alert-description ${className}`} {...props}>
            {children}
        </div>
    );
});

// --- Skeletons ---

export const GalaxySkeleton = forwardRef(({ width, height, isLoaded, children, className = '', ...props }, ref) => {
    if (isLoaded) return <>{children}</>;

    return (
        <div
            ref={ref}
            className={`galaxy-skeleton ${className}`}
            style={{ width, height }}
            {...props}
        />
    );
});

export const GalaxySkeletonText = forwardRef(({ noOfLines = 3, spacing = '0.5rem', startColor, endColor, className = '', ...props }, ref) => {
    return (
        <div className={`galaxy-skeleton-text-group ${className}`} {...props}>
            {Array.from({ length: noOfLines }).map((_, i) => (
                <div
                    key={i}
                    className="galaxy-skeleton galaxy-skeleton-text"
                    style={{ marginBottom: i === noOfLines - 1 ? 0 : spacing, width: i === noOfLines - 1 ? '80%' : '100%' }}
                />
            ))}
        </div>
    );
});

export const GalaxySkeletonCircle = forwardRef(({ size = '2rem', className = '', ...props }, ref) => {
    return (
        <GalaxySkeleton
            ref={ref}
            className={`galaxy-skeleton-circle ${className}`}
            width={size}
            height={size}
            {...props}
        />
    );
});

// --- Circular Progress ---

export const GalaxyCircularProgress = forwardRef(({ value = 0, size = '48px', thickness = '4px', color = '#9333ea', trackColor, children, className = '', ...props }, ref) => {
    const radius = 20; // Internal SVG coord
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div ref={ref} className={`galaxy-circular-progress ${className}`} style={{ width: size, height: size }} Role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} {...props}>
            <svg viewBox="0 0 50 50" className="galaxy-circular-progress-svg" style={{ width: '100%', height: '100%' }}>
                <circle
                    className="galaxy-circular-progress-track"
                    cx="25" cy="25" r={radius}
                    fill="none"
                    strokeWidth={thickness}
                    style={{ stroke: trackColor }}
                />
                <circle
                    className="galaxy-circular-progress-indicator"
                    cx="25" cy="25" r={radius}
                    fill="none"
                    strokeWidth={thickness}
                    style={{
                        stroke: color,
                        strokeDasharray: circumference,
                        strokeDashoffset: offset
                    }}
                />
            </svg>
            {children && <div className="galaxy-circular-progress-label">{children}</div>}
        </div>
    );
});

export const GalaxyCircularProgressLabel = ({ children }) => <span className="galaxy-circular-progress-label">{children}</span>;

// --- Empty State ---

export const GalaxyEmptyState = forwardRef(({ icon: Icon, title, description, action, className = '', ...props }, ref) => {
    return (
        <div ref={ref} className={`galaxy-empty-state ${className}`} {...props}>
            {Icon && (
                <div className="text-neutral-500 mb-4 opacity-50">
                    <Icon size={48} />
                </div>
            )}
            <h3 className="text-lg font-bold text-neutral-300 mb-2">{title}</h3>
            <p className="text-sm text-neutral-500 max-w-sm mx-auto mb-6">{description}</p>
            {action}
        </div>
    );
});
