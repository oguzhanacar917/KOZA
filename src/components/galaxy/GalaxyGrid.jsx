import React from 'react';
import './GalaxyGrid.css';

const GalaxyGrid = ({ children, cols = 3, className = "" }) => {
    return (
        <div className={`galaxy-grid cols-${cols} ${className}`}>
            {children}
        </div>
    );
};

export default GalaxyGrid;
