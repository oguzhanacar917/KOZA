import React, { useState, useEffect, useRef, useCallback } from 'react';
import './GalaxyRange.css';

const GalaxyRange = ({ min = 0, max = 100, step = 1, value = [20, 80], onChange, disabled }) => {
    const [range, setRange] = useState(value);
    const trackRef = useRef(null);
    const isDragging = useRef(null); // 'min' or 'max' or null

    useEffect(() => {
        setRange(value);
    }, [value]);

    const getPercentage = (val) => ((val - min) / (max - min)) * 100;

    const handleMouseDown = (type) => (e) => {
        if (disabled) return;
        isDragging.current = type;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleMouseUp);
    };

    const updateValue = useCallback((clientX) => {
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const percentage = Math.min(Math.max(0, (clientX - rect.left) / rect.width), 1);
        const rawValue = min + percentage * (max - min);
        // Snap to step
        const snappedValue = Math.round(rawValue / step) * step;
        const finalValue = Math.min(Math.max(min, snappedValue), max);

        setRange(prev => {
            const newRange = [...prev];
            if (isDragging.current === 'min') {
                newRange[0] = Math.min(finalValue, prev[1] - step);
            } else {
                newRange[1] = Math.max(finalValue, prev[0] + step);
            }
            if (newRange[0] !== prev[0] || newRange[1] !== prev[1]) {
                onChange && onChange(newRange);
            }
            return newRange;
        });
    }, [min, max, step, onChange]);

    const handleMouseMove = useCallback((e) => {
        updateValue(e.clientX);
    }, [updateValue]);

    const handleTouchMove = useCallback((e) => {
        e.preventDefault(); // Prevent scrolling while dragging
        updateValue(e.touches[0].clientX);
    }, [updateValue]);

    const handleMouseUp = () => {
        isDragging.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
    };

    return (
        <div className={`galaxy-range-container ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="galaxy-range-track" ref={trackRef}></div>
            <div
                className="galaxy-range-fill"
                style={{
                    left: `${getPercentage(range[0])}%`,
                    width: `${getPercentage(range[1]) - getPercentage(range[0])}%`
                }}
            ></div>

            {/* Min Thumb */}
            <div
                className="galaxy-range-thumb"
                style={{ left: `${getPercentage(range[0])}%` }}
                onMouseDown={handleMouseDown('min')}
                onTouchStart={handleMouseDown('min')}
            />

            {/* Max Thumb */}
            <div
                className="galaxy-range-thumb"
                style={{ left: `${getPercentage(range[1])}%` }}
                onMouseDown={handleMouseDown('max')}
                onTouchStart={handleMouseDown('max')}
            />
        </div>
    );
};

export default GalaxyRange;
