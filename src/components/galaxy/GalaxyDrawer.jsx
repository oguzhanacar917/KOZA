import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import GalaxyBackdrop from './GalaxyBackdrop';
import './GalaxyDrawer.css';

const GalaxyDrawer = ({ isOpen, onClose, position = 'right', title, children, footer, width = '400px' }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    return createPortal(
        <div className="galaxy-drawer-portal">
            <GalaxyBackdrop isOpen={isOpen} onClick={onClose} />
            <div
                className={`galaxy-drawer ${position} ${isOpen ? 'open' : ''}`}
                style={{ width }}
            >
                <div className="galaxy-drawer-header">
                    <h3 className="galaxy-drawer-title">{title}</h3>
                    <button className="galaxy-drawer-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>
                <div className="galaxy-drawer-content">
                    {children}
                </div>
                {footer && (
                    <div className="galaxy-drawer-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default GalaxyDrawer;
