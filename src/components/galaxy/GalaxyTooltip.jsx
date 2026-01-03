import React from 'react';
import './GalaxyTooltip.css';

const GalaxyTooltip = ({ content, children }) => {
    return (
        <div className="galaxy-tooltip-wrapper">
            {children}
            <div className="galaxy-tooltip">
                {content}
            </div>
        </div>
    );
};

export default GalaxyTooltip;
