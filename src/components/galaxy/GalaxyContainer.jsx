import React from 'react';
import './GalaxyContainer.css';

const GalaxyContainer = ({ children, className = "" }) => {
    return (
        <div className={`galaxy-container ${className}`}>
            {children}
        </div>
    );
};

export default GalaxyContainer;
