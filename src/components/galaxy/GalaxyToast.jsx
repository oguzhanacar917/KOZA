import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import './GalaxyToast.css';

const ICONS = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
    default: Info
};

const GalaxyToast = ({ title, message, type = 'default', onClose }) => {
    const [isExiting, setIsExiting] = useState(false);
    const Icon = ICONS[type] || ICONS.default;

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(onClose, 300); // Match animation duration
    };

    return (
        <div className={`galaxy-toast ${type} ${isExiting ? 'exit' : ''}`}>
            <div className="galaxy-toast-icon">
                <Icon size={16} strokeWidth={2.5} />
            </div>
            <div className="galaxy-toast-content">
                {title && <h4 className="galaxy-toast-title">{title}</h4>}
                <p className="galaxy-toast-message">{message}</p>
            </div>
            <button className="galaxy-toast-close" onClick={handleClose}>
                <X size={14} />
            </button>
        </div>
    );
};

export default GalaxyToast;
