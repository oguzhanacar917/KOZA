import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './GalaxyAccordion.css';

const GalaxyAccordion = ({ items = [] }) => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="galaxy-accordion">
            {items.map((item, index) => (
                <GalaxyAccordionItem
                    key={index}
                    title={item.title}
                    isOpen={openIndex === index}
                    onToggle={() => toggle(index)}
                >
                    {item.content}
                </GalaxyAccordionItem>
            ))}
        </div>
    );
};

const GalaxyAccordionItem = ({ title, isOpen, onToggle, children }) => {
    const contentRef = useRef(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setHeight(contentRef.current.scrollHeight);
        } else {
            setHeight(0);
        }
    }, [isOpen]);

    return (
        <div className={`galaxy-accordion-item ${isOpen ? 'open' : ''}`}>
            <button className="galaxy-accordion-header" onClick={onToggle}>
                <span>{title}</span>
                <ChevronDown className="galaxy-accordion-icon" size={20} />
            </button>
            <div
                className="galaxy-accordion-content"
                style={{ height: `${height}px` }}
            >
                <div className="galaxy-accordion-content-inner" ref={contentRef}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default GalaxyAccordion;
