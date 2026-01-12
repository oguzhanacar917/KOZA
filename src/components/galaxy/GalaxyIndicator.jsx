import React from 'react';
import './GalaxyIndicator.css';

const GalaxyIndicator = ({
    type = 'liquid',
    size = 'md',
    label,
    className = ''
}) => {
    return (
        <div className={`galaxy-indicator-container ${className}`}>
            <div className={`galaxy-indicator galaxy-indicator-${type} galaxy-indicator-${size}`}>
                {type === 'liquid' && (
                    <div className="galaxy-indicator-liquid-wrapper">
                        <div className="galaxy-indicator-blob blob-1" />
                        <div className="galaxy-indicator-blob blob-2" />
                        <div className="galaxy-indicator-blob blob-3" />
                    </div>
                )}
                {type === 'ring' && (
                    <div className="galaxy-indicator-ring">
                        <div className="ring-inner" />
                    </div>
                )}
            </div>
            {label && <span className="galaxy-indicator-label">{label}</span>}
        </div>
    );
};

export default GalaxyIndicator;
