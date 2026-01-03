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
