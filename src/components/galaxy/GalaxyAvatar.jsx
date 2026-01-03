import React from 'react';
import { User } from 'lucide-react';
import './GalaxyAvatar.css';

const GalaxyAvatar = ({ src, alt, size = "medium", status, fallbackInitials }) => {
    return (
        <div className={`galaxy-avatar-container ${size}`}>
            <div className="galaxy-avatar-glow"></div>
            <div className={`galaxy-avatar ${size}`}>
                {src ? (
                    <img src={src} alt={alt || "Avatar"} />
                ) : (
                    fallbackInitials ? (
                        <span>{fallbackInitials}</span>
                    ) : (
                        <User size={size === 'small' ? 16 : size === 'medium' ? 24 : 40} strokeWidth={2} />
                    )
                )}
            </div>
            {status && <div className={`galaxy-avatar-status ${status}`} />}
        </div>
    );
};

export default GalaxyAvatar;
