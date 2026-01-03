import React from 'react';
import { X } from 'lucide-react';
import './GalaxyTag.css';

const GalaxyTag = ({ label, onRemove, className = "" }) => {
    return (
        <span className={`galaxy-tag ${className}`}>
            {label}
            {onRemove && (
                <button className="galaxy-tag-remove" onClick={onRemove}>
                    <X size={14} />
                </button>
            )}
        </span>
    );
};

export default GalaxyTag;
