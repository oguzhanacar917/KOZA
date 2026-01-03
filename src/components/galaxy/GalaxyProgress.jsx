import React from 'react';
import './GalaxyProgress.css';

const GalaxyProgress = ({ value = 0, max = 100, size = "medium", className = "" }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
        <div className={`galaxy-progress-container ${size} ${className}`}>
            <div
                className="galaxy-progress-bar"
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
};

export default GalaxyProgress;
