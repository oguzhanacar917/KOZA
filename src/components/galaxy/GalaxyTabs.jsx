import React, { useState, useRef, useEffect } from 'react';
import './GalaxyTabs.css';

const GalaxyTabs = ({ tabs = [], activeTab, onChange, className = "" }) => {
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const tabsRef = useRef([]);

    useEffect(() => {
        const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
        if (activeIndex !== -1 && tabsRef.current[activeIndex]) {
            const element = tabsRef.current[activeIndex];
            setIndicatorStyle({
                left: element.offsetLeft,
                width: element.offsetWidth
            });
        }
    }, [activeTab, tabs]);

    return (
        <div className={`galaxy-tabs ${className}`}>
            <div
                className="galaxy-tab-indicator"
                style={{
                    transform: `translateX(${indicatorStyle.left - 6}px)`, // -6 to account for padding
                    width: indicatorStyle.width
                }}
            />
            {tabs.map((tab, index) => (
                <div
                    key={tab.id}
                    ref={el => tabsRef.current[index] = el}
                    className={`galaxy-tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onChange(tab.id)}
                >
                    {tab.icon && <tab.icon size={16} />}
                    {tab.label}
                </div>
            ))}
        </div>
    );
};

export default GalaxyTabs;
