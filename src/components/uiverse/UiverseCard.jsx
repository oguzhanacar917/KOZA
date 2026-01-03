import React from 'react';
import './UiverseCard.css';

const UiverseCard = ({ children, className = '', onClick }) => {
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <div
            className={`uiverse-card ${className}`}
            onClick={onClick}
            onMouseMove={handleMouseMove}
        >
            <div className="card-shine" />
            <div className="card-content">
                {children}
            </div>
        </div>
    );
};

export default UiverseCard;
