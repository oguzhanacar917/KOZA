import React from 'react';
import './GalaxyTimeline.css';

const GalaxyTimeline = ({ items = [] }) => {
    return (
        <div className="galaxy-timeline">
            {items.map((item, index) => (
                <div key={index} className="galaxy-timeline-item">
                    <div className="galaxy-timeline-dot"></div>
                    <div className="galaxy-timeline-date">{item.date}</div>
                    <div className="galaxy-timeline-content">
                        <h4 className="galaxy-timeline-title">{item.title}</h4>
                        <p className="galaxy-timeline-desc">{item.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GalaxyTimeline;
