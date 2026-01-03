import React from 'react';
import './GalaxyDivider.css';

const GalaxyDivider = ({ vertical = false, className = "" }) => {
    return (
        <div className={`galaxy-divider ${vertical ? 'vertical' : ''} ${className}`} />
    );
};

export default GalaxyDivider;
