import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import './GalaxyModal.css';

const GalaxyModal = ({ isOpen, onClose, title, children, footer }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="galaxy-modal-overlay" onClick={onClose}>
            <div className="galaxy-modal" onClick={e => e.stopPropagation()}>
                <div className="galaxy-modal-header">
                    <h3 className="galaxy-modal-title">{title}</h3>
                    <button className="galaxy-modal-close" onClick={onClose}>
                        <X size={18} strokeWidth={2.5} />
                    </button>
                </div>
                <div className="galaxy-modal-content">
                    {children}
                </div>
                {footer && (
                    <div className="galaxy-modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default GalaxyModal;
