import React, { useRef, useEffect } from 'react';
import './GalaxyToggle.css';

const GalaxyToggle = ({ checked, onChange, disabled }) => {
    const inputRef = useRef(null);

    return (
        <label className={`galaxy-toggle ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <input
                ref={inputRef}
                type="checkbox"
                checked={checked}
                onChange={(e) => !disabled && onChange(e.target.checked)}
                disabled={disabled}
            />
            <span className="galaxy-toggle-track">
                <span className="galaxy-toggle-glow"></span>
                <span className="galaxy-toggle-thumb"></span>
            </span>
        </label>
    );
};

export default GalaxyToggle;
