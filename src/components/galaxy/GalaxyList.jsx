import React from 'react';
import './GalaxyList.css';

export const GalaxyList = ({ children, className = "" }) => {
    return <div className={`galaxy-list ${className}`}>{children}</div>;
};

export const GalaxyListItem = ({ title, subtitle, icon: Icon, action, onClick, className = "" }) => {
    return (
        <div className={`galaxy-list-item ${className}`} onClick={onClick}>
            {Icon && (
                <div className="galaxy-list-item-icon">
                    <Icon size={20} />
                </div>
            )}
            <div className="galaxy-list-item-content">
                <div className="galaxy-list-item-title">{title}</div>
                {subtitle && <div className="galaxy-list-item-subtitle">{subtitle}</div>}
            </div>
            {action && <div className="galaxy-list-item-action">{action}</div>}
        </div>
    );
};
