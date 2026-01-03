import React, { useState, useRef, useEffect } from 'react';
import './GalaxyColorPicker.css';

const PRESET_COLORS = [
    '#EF4444', '#F97316', '#F59E0B', '#10B981', '#06B6D4', '#3B82F6',
    '#6366F1', '#8B5CF6', '#A855F7', '#EC4899', '#F43F5E', '#881337',
    '#171717', '#404040', '#737373', '#A3A3A3', '#D4D4D4', '#FFFFFF'
];

const GalaxyColorPicker = ({ value = '#A855F7', onChange, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="galaxy-color-picker-container" ref={containerRef}>
            {label && <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 ml-1">{label}</label>}

            <div
                className="galaxy-color-button"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div
                    className="galaxy-color-preview"
                    style={{ backgroundColor: value }}
                />
                <span className="galaxy-color-hex">{value}</span>
            </div>

            <div className={`galaxy-color-popover ${isOpen ? 'open' : ''}`}>
                <div className="galaxy-color-grid">
                    {PRESET_COLORS.map(color => (
                        <div
                            key={color}
                            className={`galaxy-color-swatch ${value === color ? 'active' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => {
                                onChange && onChange(color);
                                setIsOpen(false);
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GalaxyColorPicker;
