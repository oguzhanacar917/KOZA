import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import './GalaxyBreadcrumb.css';

const GalaxyBreadcrumb = ({ items = [], onNavigate, className = "" }) => {
    return (
        <div className={`galaxy-breadcrumb ${className}`}>
            <div className="galaxy-breadcrumb-item" onClick={() => onNavigate && onNavigate('home')}>
                <Home size={14} className="mr-1 hover:text-primary-600 cursor-pointer" />
            </div>
            {items.map((item, index) => (
                <div key={index} className={`galaxy-breadcrumb-item ${index === items.length - 1 ? 'active' : ''}`}>
                    <ChevronRight size={14} className="galaxy-breadcrumb-separator" />
                    <span
                        className="galaxy-breadcrumb-link"
                        onClick={() => index !== items.length - 1 && onNavigate && onNavigate(item.id)}
                    >
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default GalaxyBreadcrumb;
