import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import './GalaxySelect.css';

const GalaxySelect = ({ options = [], value, onChange, placeholder = "Select...", disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onChange && onChange(option.value);
        setIsOpen(false);
    };

    return (
        <div className={`galaxy-select-container ${disabled ? 'opacity-50 pointer-events-none' : ''}`} ref={containerRef}>
            <div
                className={`galaxy-select-trigger ${isOpen ? 'active' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span className={!selectedOption ? 'text-neutral-400' : ''}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className="galaxy-select-arrow" size={18} />
            </div>

            <div className={`galaxy-select-dropdown ${isOpen ? 'open' : ''}`}>
                <div className="galaxy-select-options-wrapper">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`galaxy-select-option ${value === option.value ? 'selected' : ''}`}
                            onClick={() => handleSelect(option)}
                        >
                            <span className="flex-1">{option.label}</span>
                            {value === option.value && <Check size={16} />}
                        </div>
                    ))}
                    {options.length === 0 && (
                        <div className="p-4 text-center text-neutral-400 text-sm">
                            No options found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GalaxySelect;
