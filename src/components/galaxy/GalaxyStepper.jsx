import React from 'react';
import { Check } from 'lucide-react';
import './GalaxyStepper.css';

const GalaxyStepper = ({ steps = [], currentStep = 0 }) => {
    return (
        <div className="galaxy-stepper">
            {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isActive = index === currentStep;
                const isLast = index === steps.length - 1;

                return (
                    <div
                        key={index}
                        className={`galaxy-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isLast ? 'last' : ''}`}
                    >
                        <div className="galaxy-step-icon">
                            {isCompleted ? <Check size={16} strokeWidth={3} /> : index + 1}
                        </div>
                        <div className="galaxy-step-label">{step}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default GalaxyStepper;
