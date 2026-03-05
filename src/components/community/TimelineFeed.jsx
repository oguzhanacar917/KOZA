'use client';
import React, { useEffect, useRef, useCallback } from 'react';
import { useCommunity } from '../../context/CommunityContext';
import PostCard from './PostCard';
import SkeletonPost from './SkeletonPost';

const TimelineFeed = ({ onReply }) => {
    const { posts, timelineLoading, timelineError, hasMore, loadTimeline } = useCommunity();
    const sentinelRef = useRef(null);
    const observerRef = useRef(null);

    // Initial load
    useEffect(() => {
        loadTimeline({ replace: true });
    }, []);

    // Infinite scroll using IntersectionObserver
    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting && hasMore && !timelineLoading) {
                    loadTimeline();
                }
            },
            { rootMargin: '300px' }
        );

        if (sentinelRef.current) {
            observerRef.current.observe(sentinelRef.current);
        }

        return () => observerRef.current?.disconnect();
    }, [hasMore, timelineLoading, loadTimeline]);

    if (posts.length === 0 && timelineLoading) {
        return (
            <div>
                {Array.from({ length: 5 }, (_, i) => <SkeletonPost key={i} />)}
            </div>
        );
    }

    if (timelineError) {
        return (
            <div className="community-error">
                <p>⚠️ Akış yüklenemedi: {timelineError}</p>
                <button onClick={() => loadTimeline({ replace: true })}>Tekrar Dene</button>
            </div>
        );
    }

    return (
        <div className="timeline-feed">
            {posts.map(post => (
                <PostCard key={post.id} post={post} onReply={onReply} />
            ))}

            {/* Sentinel for infinite scroll */}
            <div ref={sentinelRef} className="timeline-sentinel" />

            {timelineLoading && posts.length > 0 && (
                <div style={{ padding: '12px' }}>
                    <SkeletonPost />
                    <SkeletonPost />
                </div>
            )}

            {!hasMore && posts.length > 0 && (
                <div className="timeline-end">
                    <span>🌟 Tüm gönderiler yüklendi</span>
                </div>
            )}
        </div>
    );
};

export default TimelineFeed;
