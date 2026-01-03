import React, { forwardRef } from 'react';
import './GalaxyTypography.css';

export const GalaxyHeading = forwardRef(({ as = 'h2', size = 'xl', gradient, children, className = '', ...props }, ref) => {
    const Component = as;
    const sizeMap = {
        '2xl': 'text-4xl md:text-5xl',
        'xl': 'text-3xl md:text-4xl',
        'lg': 'text-2xl md:text-3xl',
        'md': 'text-xl',
        'sm': 'text-lg',
        'xs': 'text-base',
    };

    return (
        <Component
            ref={ref}
            className={`galaxy-heading ${sizeMap[size]} ${gradient ? 'galaxy-gradient-text' : 'text-neutral-900 dark:text-white'} ${className}`}
            {...props}
        >
            {children}
        </Component>
    );
});

export const GalaxyText = forwardRef(({ as = 'p', size = 'md', isTruncated, children, className = '', ...props }, ref) => {
    const Component = as;
    const sizeMap = {
        '2xl': 'text-2xl',
        'xl': 'text-xl',
        'lg': 'text-lg',
        'md': 'text-base',
        'sm': 'text-sm',
        'xs': 'text-xs',
    };

    return (
        <Component
            ref={ref}
            className={`galaxy-text ${sizeMap[size]} ${isTruncated ? 'truncate' : ''} text-neutral-600 dark:text-neutral-300 ${className}`}
            {...props}
        >
            {children}
        </Component>
    );
});

export const GalaxyCode = forwardRef(({ children, className = '', ...props }, ref) => {
    return (
        <code ref={ref} className={`galaxy-code ${className}`} {...props}>
            {children}
        </code>
    );
});

export const GalaxyKbd = forwardRef(({ children, className = '', ...props }, ref) => {
    return (
        <kbd ref={ref} className={`galaxy-kbd ${className}`} {...props}>
            {children}
        </kbd>
    );
});

export const GalaxyBlockquote = forwardRef(({ children, className = '', ...props }, ref) => {
    return (
        <blockquote ref={ref} className={`galaxy-blockquote ${className}`} {...props}>
            {children}
        </blockquote>
    );
});

export const GalaxyLabel = forwardRef(({ children, className = '', required, ...props }, ref) => {
    return (
        <label ref={ref} className={`block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1 ${className}`} {...props}>
            {children}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
    );
});

export const GalaxyList = forwardRef(({ as = 'ul', spacing = 2, styleType = 'none', children, className = '', ...props }, ref) => {
    const Component = as;
    return (
        <Component
            ref={ref}
            className={`galaxy-list ${className}`}
            style={{ listStyleType: styleType, display: 'flex', flexDirection: 'column', gap: `${spacing * 0.25}rem` }}
            {...props}
        >
            {children}
        </Component>
    );
});

export const GalaxyListItem = forwardRef(({ children, className = '', ...props }, ref) => {
    return (
        <li ref={ref} className={`galaxy-list-item ${className}`} {...props}>
            {children}
        </li>
    );
});

