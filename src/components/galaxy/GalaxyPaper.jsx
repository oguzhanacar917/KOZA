import React from 'react';
import './GalaxyPaper.css';

const GalaxyPaper = ({ children, elevation = 1, className = "" }) => {
    return (
        <div className={`galaxy-paper elevation-${elevation} ${className}`}>
            {children}
        </div>
    );
};

export default GalaxyPaper;
