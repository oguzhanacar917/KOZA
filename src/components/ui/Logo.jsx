import React from 'react';

const Logo = ({ className = "", size = "md" }) => {
    const sizeClasses = {
        sm: "text-xl",
        md: "text-2xl",
        lg: "text-4xl",
        xl: "text-5xl"
    };

    return (
        <div className={`font-black tracking-tighter select-none flex items-center gap-2 ${className}`}>
            <div className="relative flex items-center justify-center">
                {/* Abstract Butterfly/Cocoon Shape */}
                <svg
                    className={`${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'}`}
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M50 20 C 30 20, 20 40, 20 50 C 20 70, 40 80, 50 80 C 60 80, 80 70, 80 50 C 80 40, 70 20, 50 20 Z"
                        className="fill-primary-500/20 stroke-primary-600"
                        strokeWidth="4"
                    />
                    <path
                        d="M50 25 C 65 25, 75 40, 75 50 C 75 60, 65 75, 50 75 C 35 75, 25 60, 25 50 C 25 40, 35 25, 50 25 Z"
                        className="fill-primary-500/30"
                    />
                    <circle cx="50" cy="50" r="10" className="fill-primary-500 animate-pulse-subtle" />
                </svg>
            </div>
            <span className={`${sizeClasses[size]} bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent`}>
                KOZA
            </span>
        </div>
    );
};

export default Logo;
