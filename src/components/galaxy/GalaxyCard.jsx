import React from 'react';
import UiverseCard from '../uiverse/UiverseCard';

const GalaxyCard = ({ children, className = '', title, subtitle, emoji, onClick, gradient }) => {
    // Map existing props to a layout inside UiverseCard
    // UiverseCard already has a "liquid crystal" background, so we don't need 'galaxy-card-dots' unless we want to keep them.
    // The user requested "redesign using uiverse.io", so we should infer using the NEW style mostly.

    return (
        <UiverseCard className={className} onClick={onClick}>
            {(title || subtitle || emoji) && (
                <div className="flex flex-col items-center mb-4 text-center">
                    {emoji && <div className="text-4xl mb-2">{emoji}</div>}
                    {title && <h3 className="text-xl font-bold text-neutral-900 mb-1">{title}</h3>}
                    {subtitle && <p className="text-sm text-neutral-500 opacity-80">{subtitle}</p>}
                </div>
            )}
            {children}
        </UiverseCard>
    );
};

export default GalaxyCard;
