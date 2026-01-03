import React, { useEffect, useState } from 'react';
import './GalaxyStat.css';

const GalaxyStat = ({ label, value, icon: Icon, suffix = "" }) => {
    const [count, setCount] = useState(0);

    // Simple count up animation
    useEffect(() => {
        let start = 0;
        const end = parseInt(value) || 0;
        if (start === end) return;

        const duration = 2000;
        const incrementTime = 20; // ms
        const step = Math.ceil(end / (duration / incrementTime));

        const timer = setInterval(() => {
            start += step;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, incrementTime);

        return () => clearInterval(timer);
    }, [value]);

    return (
        <div className="galaxy-stat">
            {Icon && (
                <div className="galaxy-stat-icon">
                    <Icon size={20} strokeWidth={2.5} />
                </div>
            )}
            <div className="galaxy-stat-value">
                {typeof value === 'number' ? count : value}{suffix}
            </div>
            <div className="galaxy-stat-label">{label}</div>
        </div>
    );
};

export default GalaxyStat;
