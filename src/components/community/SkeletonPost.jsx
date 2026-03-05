import React from 'react';
import './SkeletonPost.css';

const SkeletonPost = () => (
    <div className="skeleton-post">
        <div className="skeleton-avatar" />
        <div className="skeleton-content">
            <div className="skeleton-line" style={{ width: '40%', height: '13px' }} />
            <div className="skeleton-line" style={{ width: '100%', height: '14px' }} />
            <div className="skeleton-line" style={{ width: '85%', height: '14px' }} />
            <div className="skeleton-line" style={{ width: '60%', height: '14px' }} />
        </div>
    </div>
);

export default SkeletonPost;
