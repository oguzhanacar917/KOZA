import React, { useState, useRef, useEffect } from 'react';
import './GalaxyBottomNav.css';

const GalaxyBottomNav = ({
    items = [],
    activeId,
    onTabChange,
    className = '',
    glass = true
}) => {
    const [indicatorStyle, setIndicatorStyle] = useState({});
    const navRef = useRef(null);
    const itemRefs = useRef({});

    useEffect(() => {
        if (activeId && itemRefs.current[activeId]) {
            const activeItem = itemRefs.current[activeId];
            setIndicatorStyle({
                width: `${activeItem.offsetWidth}px`,
                left: `${activeItem.offsetLeft}px`,
                opacity: 1
            });
        }
    }, [activeId, items]);

    return (
        <nav
            className={`galaxy-bottom-nav-container ${className}`}
            ref={navRef}
        >
            <div className={`galaxy-bottom-nav ${glass ? 'liquid-glass' : ''}`}>
                <div
                    className="galaxy-bottom-nav-indicator"
                    style={indicatorStyle}
                />
                <div className="galaxy-bottom-nav-items">
                    {items.map((item) => (
                        <button
                            key={item.id}
                            ref={el => itemRefs.current[item.id] = el}
                            className={`galaxy-bottom-nav-item ${activeId === item.id ? 'active' : ''}`}
                            onClick={() => onTabChange?.(item.id)}
                        >
                            <span className="galaxy-bottom-nav-icon">
                                {item.icon}
                            </span>
                            {item.label && (
                                <span className="galaxy-bottom-nav-label">
                                    {item.label}
                                </span>
                            )}
                            {activeId === item.id && item.dot && (
                                <span className="galaxy-bottom-nav-dot" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default GalaxyBottomNav;
