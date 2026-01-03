import React from 'react';
import './GalaxyBackdrop.css';

const GalaxyBackdrop = ({ isOpen, onClick, invisible, className = "" }) => {
    if (!isOpen) return null;

    return (
        <div
            className={`galaxy-backdrop ${isOpen ? 'open' : ''} ${invisible ? 'invisible' : ''} ${className}`}
            onClick={onClick}
        />
    );
};

export default GalaxyBackdrop;
