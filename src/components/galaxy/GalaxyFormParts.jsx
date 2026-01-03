import React, { createContext, useContext, forwardRef, useState } from 'react';
import './GalaxyFormParts.css';

// --- Form Control Context ---
const FormControlContext = createContext({});
const useFormControl = () => useContext(FormControlContext);

export const GalaxyFormControl = forwardRef(({ isInvalid, isRequired, isDisabled, children, className = '', ...props }, ref) => {
    return (
        <FormControlContext.Provider value={{ isInvalid, isRequired, isDisabled }}>
            <div
                ref={ref}
                className={`galaxy-form-control ${className}`}
                data-invalid={isInvalid}
                data-disabled={isDisabled}
                {...props}
            >
                {children}
            </div>
        </FormControlContext.Provider>
    );
});

export const GalaxyFormLabel = forwardRef(({ children, className = '', ...props }, ref) => {
    const { isInvalid, isRequired } = useFormControl();
    return (
        <label
            ref={ref}
            className={`galaxy-form-label ${className}`}
            data-invalid={isInvalid}
            {...props}
        >
            {children}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
    );
});

export const GalaxyFormHelperText = forwardRef(({ children, className = '', ...props }, ref) => {
    const { isInvalid } = useFormControl();
    if (isInvalid) return null; // Hide helper text on error typically, or keep both? Default to hiding in favor of error.
    return (
        <p ref={ref} className={`galaxy-form-helper-text ${className}`} {...props}>
            {children}
        </p>
    );
});

export const GalaxyFormErrorMessage = forwardRef(({ children, className = '', ...props }, ref) => {
    const { isInvalid } = useFormControl();
    if (!isInvalid) return null;
    return (
        <div ref={ref} className={`galaxy-form-error-message ${className}`} {...props}>
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 mr-1" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {children}
        </div>
    );
});

// --- Input Group ---
export const GalaxyInputGroup = forwardRef(({ children, className = '', ...props }, ref) => {
    return (
        <div ref={ref} className={`galaxy-input-group ${className}`} {...props}>
            {children}
        </div>
    );
});

export const GalaxyInputLeftElement = forwardRef(({ children, className = '', ...props }, ref) => {
    return (
        <div ref={ref} className={`galaxy-input-element left ${className}`} {...props}>
            {children}
        </div>
    );
});

export const GalaxyInputRightElement = forwardRef(({ children, className = '', ...props }, ref) => {
    return (
        <div ref={ref} className={`galaxy-input-element right ${className}`} {...props}>
            {children}
        </div>
    );
});

// --- Pin Input ---
export const GalaxyPinInput = forwardRef(({ values = ['', '', '', ''], onChange, onComplete, type = 'text', mask, children, className = '', ...props }, ref) => {
    // This is a simplified stateless container for structure. 
    // State management for PinInput usually requires a complex hook. 
    // For this generic expansion, we'll assume consumers render PinInputs or use a provided hook.
    return (
        <div ref={ref} className={`galaxy-pin-input ${className}`} {...props}>
            {children}
        </div>
    );
});

export const GalaxyPinInputField = forwardRef(({ className = '', ...props }, ref) => {
    return (
        <input
            ref={ref}
            className={`galaxy-pin-input-field ${className}`}
            maxLength={1}
            {...props}
        />
    );
});

// --- Number Input ---
// Simple styling wrapper, logic would be in hook
export const GalaxyNumberInput = forwardRef(({ children, className = '', ...props }, ref) => {
    return (
        <div ref={ref} className={`galaxy-input-group ${className}`} {...props}>
            {children}
        </div>
    );
});

export const GalaxyNumberInputField = forwardRef(({ className = '', ...props }, ref) => {
    return (
        <input
            ref={ref}
            type="number"
            className={`w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-neutral-900 dark:text-white placeholder-neutral-500 ${className}`}
            {...props}
        />
    );
});

export const GalaxyNumberInputStepper = ({ onIncrement, onDecrement }) => {
    return (
        <div className="galaxy-number-input-stepper">
            <button type="button" onClick={onIncrement} tabIndex={-1}>▲</button>
            <button type="button" onClick={onDecrement} tabIndex={-1}>▼</button>
        </div>
    );
};

// --- Basic Form Elements ---

export const GalaxyInput = forwardRef(({ size = 'md', variant = 'outline', isInvalid, className = '', ...props }, ref) => {
    // Sizes: xs, sm, md, lg
    // Variants: outline, filled, flushed, unstyled
    const sizeMap = { xs: 'h-6 text-xs', sm: 'h-8 text-sm', md: 'h-10 text-base', lg: 'h-12 text-lg' };

    return (
        <input
            ref={ref}
            className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-neutral-900 dark:text-white placeholder-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed ${sizeMap[size]} ${isInvalid ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
            {...props}
        />
    );
});

export const GalaxyTextarea = forwardRef(({ size = 'md', variant = 'outline', isInvalid, className = '', ...props }, ref) => {
    return (
        <textarea
            ref={ref}
            className={`w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-neutral-900 dark:text-white placeholder-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed ${isInvalid ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
            {...props}
        />
    );
});

export const GalaxySelect = forwardRef(({ size = 'md', variant = 'outline', isInvalid, children, className = '', ...props }, ref) => {
    const sizeMap = { xs: 'h-6 text-xs', sm: 'h-8 text-sm', md: 'h-10 text-base', lg: 'h-12 text-lg' };
    return (
        <div className="relative">
            <select
                ref={ref}
                className={`w-full appearance-none bg-white/5 border border-white/10 rounded-lg px-4 pr-8 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-neutral-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed ${sizeMap[size]} ${isInvalid ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
                {...props}
            >
                {children}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-neutral-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
        </div>
    );
});

export const GalaxyButton = forwardRef(({
    variant = 'primary',
    size = 'md',
    isLoading,
    isDisabled,
    leftIcon,
    rightIcon,
    children,
    className = '',
    onClick,
    ...props
}, ref) => {
    const variants = {
        primary: 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white shadow-lg shadow-primary-500/30 border-none',
        secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-sm',
        outline: 'bg-transparent border border-primary-500 text-primary-500 hover:bg-primary-500/10',
        ghost: 'bg-transparent hover:bg-white/10 text-neutral-700 dark:text-white',
        link: 'bg-transparent text-primary-500 hover:underline p-0 h-auto'
    };

    const sizes = {
        xs: 'h-6 px-2 text-xs',
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg'
    };

    const disabledStyles = 'opacity-60 cursor-not-allowed pointer-events-none';

    return (
        <button
            ref={ref}
            className={`
                inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 active:scale-95
                ${variants[variant]}
                ${sizes[size]}
                ${(isDisabled || isLoading) ? disabledStyles : ''}
                ${className}
            `}
            disabled={isDisabled || isLoading}
            onClick={onClick}
            {...props}
        >
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
        </button>
    );
});

