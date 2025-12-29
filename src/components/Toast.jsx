import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ type = 'info', title, message, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration && onClose) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const config = {
        success: {
            icon: CheckCircle,
            bg: 'bg-green-50',
            border: 'border-green-200',
            iconColor: 'text-green-600',
            titleColor: 'text-green-900'
        },
        error: {
            icon: AlertCircle,
            bg: 'bg-red-50',
            border: 'border-red-200',
            iconColor: 'text-red-600',
            titleColor: 'text-red-900'
        },
        info: {
            icon: Info,
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            iconColor: 'text-blue-600',
            titleColor: 'text-blue-900'
        }
    };

    const { icon: Icon, bg, border, iconColor, titleColor } = config[type] || config.info;

    return (
        <div className={`${bg} ${border} border rounded-lg shadow-lg p-4 max-w-sm animate-slide-up`}>
            <div className="flex items-start gap-3">
                <div className={`${iconColor} flex-shrink-0`}>
                    <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${titleColor}`}>{title}</p>
                    {message && <p className="text-sm text-neutral-600 mt-0.5">{message}</p>}
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Toast;
