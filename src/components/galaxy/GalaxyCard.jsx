import React from 'react';
import './GalaxyCard.css';

const GalaxyCard = ({ children, className = '', title, subtitle, emoji, gradient }) => {
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <div
            className={`galaxy-card ${className}`}
            onMouseMove={handleMouseMove}
        >
            <div className={`galaxy-card-dots pink-dots ${gradient ? 'opacity-100' : ''}`} />

            {emoji && (
                <div className="galaxy-card-emoji">
                    {emoji}
                </div>
                <div className="galaxy-card-dots pink-dots"></div>
            </div>
        </div >
    );
};

export default GalaxyCard;
