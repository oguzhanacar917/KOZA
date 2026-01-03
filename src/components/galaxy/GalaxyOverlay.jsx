import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './GalaxyOverlay.css';
import { ChevronRight } from 'lucide-react';

// --- Menu ---

export const GalaxyMenu = ({ children }) => {
    // Menu state is composed of Button and List. 
    // Usually requires Context to toggle open/close. 
    // Simulating context here for structure, but usually provided by a hook or context.
    // For this atomic implementation, assuming controlled or simple composition.
    return <div className="galaxy-menu">{children}</div>;
};

export const GalaxyMenuButton = forwardRef(({ as: Component = 'button', children, className = '', ...props }, ref) => {
    return (
        <Component ref={ref} className={`galaxy-menu-button ${className}`} aria-haspopup="menu" {...props}>
            {children}
        </Component>
    );
});

export const GalaxyMenuList = forwardRef(({ children, className = '', isOpen, ...props }, ref) => {
    if (!isOpen) return null;
    return (
        <div ref={ref} className={`galaxy-menu-list ${className}`} role="menu" tabIndex={-1} {...props}>
            {children}
        </div>
    );
});

export const GalaxyMenuItem = forwardRef(({ icon: Icon, command, children, className = '', ...props }, ref) => {
    return (
        <button ref={ref} className={`galaxy-menu-item ${className}`} role="menuitem" {...props}>
            {Icon && <Icon size={16} className="mr-2.5 opacity-70" />}
            <span className="flex-1">{children}</span>
            {command && <span className="text-xs opacity-50 ml-2">{command}</span>}
        </button>
    );
});

export const GalaxyMenuDivider = () => <div className="galaxy-menu-divider" />;

export const GalaxyMenuGroup = ({ title, children }) => (
    <div>
        <div className="galaxy-menu-group-title">{title}</div>
        {children}
    </div>
);


// --- Portal Helper ---
const Portal = ({ children }) => {
    if (typeof document === 'undefined') return null;
    return createPortal(children, document.body);
};


// --- Modal ---

export const GalaxyModal = ({ isOpen, onClose, children, size = 'md' }) => {
    if (!isOpen) return null;

    return (
        <Portal>
            <div className="galaxy-overlay" onClick={onClose} />
            <div className="galaxy-modal-wrapper" role="dialog" aria-modal="true">
                {children}
            </div>
        </Portal>
    );
};

export const GalaxyModalContent = forwardRef(({ children, className = '', ...props }, ref) => {
    return (
        <div ref={ref} className={`galaxy-modal-content ${className}`} onClick={e => e.stopPropagation()} {...props}>
            {children}
        </div>
    );
});

export const GalaxyModalHeader = ({ children }) => <div className="galaxy-modal-header">{children}</div>;
export const GalaxyModalBody = ({ children }) => <div className="galaxy-modal-body">{children}</div>;
export const GalaxyModalFooter = ({ children }) => <div className="galaxy-modal-footer">{children}</div>;


// --- Drawer ---

export const GalaxyDrawer = ({ isOpen, onClose, placement = 'right', children }) => {
    if (!isOpen) return null;

    const placementStyles = {
        right: { justifyContent: 'flex-end' },
        left: { justifyContent: 'flex-start' },
    };

    return (
        <Portal>
            <div className="galaxy-overlay" onClick={onClose} />
            <div className="galaxy-drawer-wrapper" style={placementStyles[placement]}>
                {children}
            </div>
        </Portal>
    );
};

export const GalaxyDrawerContent = forwardRef(({ children, className = '', ...props }, ref) => {
    return (
        <div ref={ref} className={`galaxy-drawer-content animate-slide-in ${className}`} onClick={e => e.stopPropagation()} {...props}>
            {children}
        </div>
    );
});

export const GalaxyDrawerHeader = ({ children }) => <div className="galaxy-drawer-header">{children}</div>;
export const GalaxyDrawerBody = ({ children }) => <div className="galaxy-drawer-body">{children}</div>;
export const GalaxyDrawerFooter = ({ children }) => <div className="galaxy-drawer-footer">{children}</div>;


// --- Breadcrumb ---

export const GalaxyBreadcrumb = forwardRef(({ separator = <ChevronRight size={14} />, children, className = '', ...props }, ref) => {
    const validChildren = React.Children.toArray(children).filter(child => React.isValidElement(child));

    const clones = validChildren.map((child, index) => {
        return React.cloneElement(child, {
            isLastChild: index === validChildren.length - 1,
            separator,
        });
    });

    return (
        <nav ref={ref} aria-label="breadcrumb" className={`galaxy-breadcrumb ${className}`} {...props}>
            <ol className="flex items-center flex-wrap">
                {clones}
            </ol>
        </nav>
    );
});

export const GalaxyBreadcrumbItem = forwardRef(({ isCurrentPage, isLastChild, separator, children, className = '', ...props }, ref) => {
    return (
        <li ref={ref} className={`galaxy-breadcrumb-item ${className}`} {...props}>
            {children}
            {!isLastChild && <span className="galaxy-breadcrumb-separator">{separator}</span>}
        </li>
    );
});

export const GalaxyBreadcrumbLink = forwardRef(({ as: Component = 'a', isCurrentPage, children, className = '', ...props }, ref) => {
    return (
        <Component
            ref={ref}
            className={`galaxy-breadcrumb-link ${className}`}
            aria-current={isCurrentPage ? 'page' : undefined}
            data-current={isCurrentPage}
            {...props}
        >
            {children}
        </Component>
    );
});
