import React from 'react';
import { Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import './GalaxyAlert.css';

const ICONS = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle
};

const GalaxyAlert = ({ type = 'info', title, children }) => {
    const Icon = ICONS[type] || ICONS.info;

    return (
        <div className={`galaxy-alert ${type}`}>
            <Icon className="galaxy-alert-icon" size={20} strokeWidth={2} />
            <div className="galaxy-alert-content">
                {title && <h4 className="galaxy-alert-title">{title}</h4>}
                <div className="galaxy-alert-message">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default GalaxyAlert;
