import React from 'react';
import './GalaxyQuote.css';

const GalaxyQuote = ({ children, author, className = "" }) => {
    return (
        <blockquote className={`galaxy-quote ${className}`}>
            <p>{children}</p>
            {author && <cite className="galaxy-quote-author">{author}</cite>}
        </blockquote>
    );
};

export default GalaxyQuote;
