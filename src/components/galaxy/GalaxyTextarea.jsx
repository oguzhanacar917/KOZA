import React from 'react';
import './GalaxyTextarea.css';

const GalaxyTextarea = ({ label, value, onChange, placeholder, disabled, rows = 4 }) => {
    return (
        <div className="galaxy-textarea-container">
            <textarea
                className="galaxy-textarea"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
            />
            {label && <label className="galaxy-textarea-label">{label}</label>}
        </div>
    );
};

export default GalaxyTextarea;
