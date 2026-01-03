import React, { useState } from 'react';
import { Star } from 'lucide-react';
import './GalaxyRating.css';

const GalaxyRating = ({ max = 5, value = 0, onChange, disabled }) => {
    const [hoverValue, setHoverValue] = useState(0);
    const [animatingStar, setAnimatingStar] = useState(null);

    const handleClick = (val) => {
        if (!disabled) {
            onChange && onChange(val);
            setAnimatingStar(val);
            setTimeout(() => setAnimatingStar(null), 600);
        }
    };

    return (
        <div
            className={`galaxy-rating ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
            onMouseLeave={() => setHoverValue(0)}
        >
            {[...Array(max)].map((_, index) => {
                const starValue = index + 1;
                const isActive = starValue <= (hoverValue || value);
                return (
                    <div
                        key={index}
                        className={`galaxy-star ${isActive ? 'active' : ''} ${animatingStar === starValue ? 'animating' : ''}`}
                        onClick={() => handleClick(starValue)}
                        onMouseEnter={() => !disabled && setHoverValue(starValue)}
                    >
                        <Star size={24} strokeWidth={isActive ? 0 : 2} />
                        {animatingStar === starValue && (
                            <div className="galaxy-star-burst">
                                <span></span><span></span><span></span><span></span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default GalaxyRating;
