import React, { forwardRef } from 'react';
import './GalaxyLayout.css';

// --- Primitives ---

export const GalaxyBox = forwardRef(({ as: Component = 'div', children, className = '', ...props }, ref) => {
    return (
        <Component ref={ref} className={`galaxy-box ${className}`} {...props}>
            {children}
        </Component>
    );
});

export const GalaxyFlex = forwardRef(({ direction = 'row', align, justify, wrap, gap, children, className = '', ...props }, ref) => {
    const style = {
        flexDirection: direction,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap,
        gap: gap !== undefined ? `${gap * 0.25}rem` : undefined,
    };
    return (
        <div ref={ref} className={`galaxy-flex ${className}`} style={{ ...style, ...props.style }} {...props}>
            {children}
        </div>
    );
});

export const GalaxyStack = forwardRef(({ direction = 'column', spacing = 2, align, justify, children, className = '', ...props }, ref) => {
    return (
        <GalaxyFlex
            ref={ref}
            direction={direction}
            gap={spacing}
            align={align}
            justify={justify}
            className={`galaxy-stack ${direction === 'row' ? 'horizontal' : ''} ${className}`}
            {...props}
        >
            {children}
        </GalaxyFlex>
    );
});

export const GalaxyCenter = forwardRef(({ children, className = '', ...props }, ref) => {
    return (
        <div ref={ref} className={`galaxy-center ${className}`} {...props}>
            {children}
        </div>
    );
});

export const GalaxyGrid = forwardRef(({ templateColumns, gap = 4, children, className = '', ...props }, ref) => {
    const style = {
        gridTemplateColumns: templateColumns,
        gap: gap !== undefined ? `${gap * 0.25}rem` : undefined,
    };
    return (
        <div ref={ref} className={`galaxy-grid ${className}`} style={{ ...style, ...props.style }} {...props}>
            {children}
        </div>
    );
});

export const GalaxyGridItem = forwardRef(({ colSpan, rowSpan, children, className = '', ...props }, ref) => {
    const style = {
        gridColumn: colSpan ? `span ${colSpan} / span ${colSpan}` : undefined,
        gridRow: rowSpan ? `span ${rowSpan} / span ${rowSpan}` : undefined,
    };
    return (
        <div ref={ref} className={`galaxy-grid-item ${className}`} style={{ ...style, ...props.style }} {...props}>
            {children}
        </div>
    );
});

export const GalaxyContainer = forwardRef(({ children, className = '', centerContent, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={`galaxy-container ${centerContent ? 'galaxy-center' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
});

export const GalaxyDivider = forwardRef(({ orientation = 'horizontal', className = '', ...props }, ref) => {
    const style = orientation === 'vertical'
        ? { height: 'auto', width: '1px', borderBottom: 'none', borderLeft: '1px solid var(--galaxy-glass-medium)' }
        : {};

    return (
        <hr ref={ref} className={`galaxy-divider ${className}`} style={{ ...style, ...props.style }} {...props} />
    );
});

export const GalaxySpacer = () => <div className="galaxy-spacer" />;

export const GalaxyAspectRatio = forwardRef(({ ratio = 4 / 3, children, className = '', ...props }, ref) => {
    return (
        <div ref={ref} className={`relative w-full ${className}`} style={{ paddingBottom: `${(1 / ratio) * 100}%` }} {...props}>
            <div className="absolute inset-0">
                {children}
            </div>
        </div>
    );
});
