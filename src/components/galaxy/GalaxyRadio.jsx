import React from 'react';
import './GalaxyRadio.css';

const GalaxyRadio = ({ label, name, value, checked, onChange, disabled }) => {
    return (
        <label className={`galaxy-radio ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}>
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
            />
            <span className="galaxy-radio-ring">
                <span className="galaxy-radio-dot"></span>
            </span>
            {label && <span className="galaxy-radio-label">{label}</span>}
        </label>
    );
};

export default GalaxyRadio;
