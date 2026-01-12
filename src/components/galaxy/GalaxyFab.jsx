import React from 'react';
import './GalaxyFab.css';

const GalaxyFab = ({
    icon,
    onClick,
    className = '',
    variant = 'primary',
    size = 'md',
    label
}) => {
    return (
        <button
            className={`galaxy-fab galaxy-fab-${variant} galaxy-fab-${size} ${className}`}
            onClick={onClick}
            aria-label={label || 'Floating action button'}
        >
            <div className="galaxy-fab-morph" />
            <div className="galaxy-fab-content">
                <span className="galaxy-fab-icon">{icon}</span>
                {label && size === 'lg' && (
                    <span className="galaxy-fab-label">{label}</span>
                )}
            </div>
            <div className="galaxy-fab-shimmer" />
        </button>
    );
};

export default GalaxyFab;
