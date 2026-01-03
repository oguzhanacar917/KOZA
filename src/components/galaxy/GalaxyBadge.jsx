import React from 'react';
import './GalaxyBadge.css';

const GalaxyBadge = ({ children, variant = "default", icon: Icon, className = "" }) => {
    return (
        <span className={`galaxy-badge ${variant} ${className}`}>
            {Icon && <Icon size={12} strokeWidth={2.5} />}
            {children}
        </span>
    );
};

export default GalaxyBadge;
