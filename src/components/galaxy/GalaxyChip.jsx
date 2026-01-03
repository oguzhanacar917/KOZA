import React from 'react';
import './GalaxyChip.css';

const GalaxyChip = ({ label, active, onClick, icon: Icon, className = "" }) => {
    return (
        <button
            className={`galaxy-chip ${active ? 'active' : ''} ${className}`}
            onClick={onClick}
        >
            {Icon && <Icon size={16} strokeWidth={2.5} />}
            {label}
        </button>
    );
};

export default GalaxyChip;
