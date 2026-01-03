import React from 'react';
import './GalaxySkeleton.css';

const GalaxySkeleton = ({ variant = "text", width, height, className = "" }) => {
    const style = {
        width,
        height
    };

    return (
        <div
            className={`galaxy-skeleton ${variant} ${className}`}
            style={style}
        />
    );
};

export default GalaxySkeleton;
