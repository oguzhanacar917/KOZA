import React from 'react';
import './GalaxyLink.css';

const GalaxyLink = ({ href, children, onClick, className = "" }) => {
    return (
        <a
            href={href}
            onClick={(e) => {
                if (onClick) {
                    e.preventDefault();
                    onClick(e);
                }
            }}
            className={`galaxy-link ${className}`}
        >
            {children}
        </a>
    );
};

export default GalaxyLink;
