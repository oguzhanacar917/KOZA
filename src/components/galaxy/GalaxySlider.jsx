import React, { useState, useEffect, useRef } from 'react';
import './GalaxySlider.css';

const GalaxySlider = ({ min = 0, max = 100, value, onChange, disabled, step = 1 }) => {
    const [localValue, setLocalValue] = useState(value || min);
    const sliderRef = useRef(null);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const percentage = ((localValue - min) / (max - min)) * 100;

    const handleChange = (e) => {
        const val = Number(e.target.value);
        setLocalValue(val);
        onChange && onChange(val);
    };

    return (
        <div className={`galaxy-slider-container ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <div
                className="galaxy-slider-fill"
                style={{ width: `${percentage}%` }}
            />
            <input
                ref={sliderRef}
                type="range"
                min={min}
                max={max}
                step={step}
                value={localValue}
                onChange={handleChange}
                disabled={disabled}
                className="galaxy-slider"
                style={{ background: 'transparent' }} // Let fill handle visual track
            />
            {/* Background track under fill needs to be separate if we want specific styling, 
                 but standard input styling works well with transparent background trick */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 bg-white/30 rounded-full -z-10 backdrop-blur-sm pointer-events-none group-hover:h-2 transition-all" />
        </div>
    );
};

export default GalaxySlider;
