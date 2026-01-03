import React, { forwardRef } from 'react';
import './GalaxyDataDisplay.css';
import { X } from 'lucide-react';

// --- Stats ---

export const GalaxyStatGroup = forwardRef(({ children, className = '', ...props }, ref) => {
    return (
        <div ref={ref} className={`galaxy-stat-group ${className}`} {...props}>
            {children}
        </div>
    );
});

export const GalaxyStat = forwardRef(({ children, className = '', ...props }, ref) => {
    return (
        <div ref={ref} className={`galaxy-stat ${className}`} {...props}>
            {children}
        </div>
    );
});

export const GalaxyStatLabel = forwardRef(({ children, className = '', ...props }, ref) => {
    return (
        <div ref={ref} className={`galaxy-stat-label ${className}`} {...props}>
            {children}
        </div>
    );
});

export const GalaxyStatNumber = forwardRef(({ children, className = '', gradient = true, ...props }, ref) => {
    return (
        <div ref={ref} className={`galaxy-stat-number ${gradient ? 'gradient' : ''} ${className}`} {...props}>
            {children}
        </div>
    );
});

export const GalaxyStatHelpText = forwardRef(({ children, className = '', type, ...props }, ref) => {
    return (
        <div ref={ref} className={`galaxy-stat-help-text ${className}`} {...props}>
            {children}
        </div>
    );
});

export const GalaxyStatArrow = ({ type = 'increase', ...props }) => {
    const isIncrease = type === 'increase';
    return (
        <span style={{
            color: isIncrease ? '#10b981' : '#ef4444',
            display: 'inline-block',
            transform: isIncrease ? 'rotate(-45deg)' : 'rotate(45deg)'
        }} {...props}>
            ➜
        </span>
    );
};

// --- Tags ---

export const GalaxyTag = forwardRef(({ size = 'md', variant = 'subtle', children, className = '', ...props }, ref) => {
    return (
        <span ref={ref} className={`galaxy-tag ${size} ${variant} ${className}`} {...props}>
            {children}
        </span>
    );
});

export const GalaxyTagLabel = ({ children }) => <span>{children}</span>;

export const GalaxyTagLeftIcon = ({ as: Icon, ...props }) => {
    if (!Icon) return null;
    return <Icon size={14} className="mr-1.5" {...props} />;
};

export const GalaxyTagRightIcon = ({ as: Icon, ...props }) => {
    if (!Icon) return null;
    return <Icon size={14} className="ml-1.5" {...props} />;
};

export const GalaxyTagCloseButton = ({ onClick, ...props }) => {
    return (
        <span className="galaxy-tag-close-btn" onClick={onClick} role="button" aria-label="Remove tag" {...props}>
            <X size={12} />
        </span>
    );
};

// --- Tables ---

export const GalaxyTableContainer = forwardRef(({ children, className = '', ...props }, ref) => {
    return (
        <div ref={ref} className={`galaxy-table-container ${className}`} {...props}>
            <table className="galaxy-table">
                {children}
            </table>
        </div>
    );
});

export const GalaxyThead = ({ children, ...props }) => <thead className="galaxy-thead" {...props}>{children}</thead>;
export const GalaxyTbody = ({ children, ...props }) => <tbody className="galaxy-tbody" {...props}>{children}</tbody>;
export const GalaxyTr = ({ children, ...props }) => <tr className="galaxy-tr" {...props}>{children}</tr>;
export const GalaxyTh = ({ children, ...props }) => <th className="galaxy-th" {...props}>{children}</th>;
export const GalaxyTd = ({ children, ...props }) => <td className="galaxy-td" {...props}>{children}</td>;

// --- Empty State ---

export const GalaxyEmptyState = ({ icon: Icon, title, description, children, className = '', ...props }) => {
    return (
        <div className={`galaxy-empty-state ${className}`} {...props}>
            {Icon && <Icon size={48} className="galaxy-empty-state-icon" />}
            {title && <h3 className="galaxy-empty-state-title">{title}</h3>}
            {description && <p className="galaxy-empty-state-description">{description}</p>}
            {children && <div className="mt-4">{children}</div>}
        </div>
    );
};
