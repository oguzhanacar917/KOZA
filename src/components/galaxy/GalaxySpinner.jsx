import React from 'react';
import './GalaxySpinner.css';

const GalaxySpinner = ({ size = "medium", className = "" }) => {
    return (
        <div className={`galaxy-spinner ${size} ${className}`}>
            <div className="galaxy-orbit"></div>
            <div className="galaxy-core"></div>
            <div className="galaxy-satellite"></div>
        </div>
    );
};

export default GalaxySpinner;
