import React from 'react';
import GalaxyModal from './GalaxyModal';
import GalaxyButton from './GalaxyButton'; // Assuming we want standard buttons here
import { AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import './GalaxyDialog.css';

const ICONS = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle
};

const GalaxyDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "info" // info, success, warning, danger
}) => {
    const Icon = ICONS[variant] || ICONS.info;

    const footer = (
        <div className="galaxy-dialog-actions">
            <GalaxyButton variant="secondary" onClick={onClose}>
                {cancelText}
            </GalaxyButton>
            <GalaxyButton
                onClick={() => { onConfirm(); onClose(); }}
                className={variant === 'danger' ? 'bg-red-500 border-red-500 hover:bg-red-600' : ''}
            >
                {confirmText}
            </GalaxyButton>
        </div>
    );

    return (
        <GalaxyModal isOpen={isOpen} onClose={onClose} title="">
            <div className="flex flex-col items-center text-center">
                <div className={`galaxy-dialog-icon ${variant}`}>
                    <Icon size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">{title}</h3>
                <p className="text-neutral-500 mb-4">{message}</p>
            </div>
            {footer}
        </GalaxyModal>
    );
};

export default GalaxyDialog;
