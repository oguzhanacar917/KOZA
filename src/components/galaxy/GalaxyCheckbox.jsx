import React from 'react';
import { Check } from 'lucide-react';
import './GalaxyCheckbox.css';

const GalaxyCheckbox = ({ label, checked, onChange, disabled }) => {
    return (
        <label className={`galaxy-checkbox ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
            />
            <span className="galaxy-checkbox-mark">
                <Check className="galaxy-checkmark-icon" size={16} strokeWidth={3} />
            </span>
            {label && <span className="galaxy-checkbox-label">{label}</span>}
        </label>
    );
};

export default GalaxyCheckbox;
