import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import './GalaxyCode.css';

const GalaxyCode = ({ code, language = "text" }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="galaxy-code">
            <div className="galaxy-code-header">
                <span className="galaxy-code-lang">{language}</span>
                <button className="galaxy-code-copy" onClick={handleCopy}>
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
            </div>
            <pre>
                <code>{code}</code>
            </pre>
        </div>
    );
};

export default GalaxyCode;
