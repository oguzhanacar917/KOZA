import React from 'react';

const CocoonLoader = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-50/80 backdrop-blur-md">
            <div className="relative w-32 h-40">
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full animate-pulse-subtle"></div>

                {/* Cocoon Shape - SVG Animation */}
                <svg
                    className="w-full h-full drop-shadow-2xl"
                    viewBox="0 0 100 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M50 10 C 25 10, 15 40, 15 60 C 15 90, 35 110, 50 110 C 65 110, 85 90, 85 60 C 85 40, 75 10, 50 10 Z"
                        className="fill-white stroke-primary-200"
                        strokeWidth="1"
                    />

                    {/* Wrapping Silken Threads */}
                    <path
                        d="M20 50 Q 50 40 80 50"
                        className="stroke-primary-300/50"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M18 60 Q 50 50 82 60"
                        className="stroke-primary-300/50"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M20 70 Q 50 80 80 70"
                        className="stroke-primary-300/50"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />

                    {/* Inner Life Pulsing */}
                    <ellipse cx="50" cy="60" rx="20" ry="30" className="fill-primary-400/20 animate-pulse">
                        <animate attributeName="ry" values="30;32;30" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="rx" values="20;22;20" dur="2s" repeatCount="indefinite" />
                    </ellipse>

                    {/* Cracks / Hatching Effect (Hidden by default, could be animated to show) */}

                </svg>

                {/* Hanging Thread */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-screen -mt-40 bg-gradient-to-b from-transparent to-primary-200"></div>
            </div>

            <p className="mt-8 text-lg font-medium text-primary-800 animate-pulse tracking-wide">
                Dönüşüyor...
            </p>
        </div>
    );
};

export default CocoonLoader;
