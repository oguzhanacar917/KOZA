'use client';
import React, { useState, useCallback, memo } from 'react';
import { Heart, Repeat2, MessageCircle, Share, MoreHorizontal, Repeat } from 'lucide-react';
import { useCommunity } from '../../context/CommunityContext';
import './PostCard.css';

// Strip HTML from Mastodon content (posted as HTML)
function stripHtml(html) {
    if (typeof window !== 'undefined') {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }
    return html?.replace(/<[^>]+>/g, '') || '';
}

// Format relative time
function relativeTime(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'şimdi';
    if (mins < 60) return `${mins}d`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}sa`;
    const days = Math.floor(hrs / 24);
    return `${days}g`;
}

const PostCard = memo(({ post, showThread = false, onReply }) => {
    const { mastodonUser, toggleLike, toggleBoost, dispatch } = useCommunity();
    const [actionLoading, setActionLoading] = useState(null);

    const handleLike = useCallback(async (e) => {
        e.stopPropagation();
        if (!mastodonUser || actionLoading) return;
        setActionLoading('like');
        try { await toggleLike(post.id, post.isLiked); }
        finally { setActionLoading(null); }
    }, [mastodonUser, post, toggleLike, actionLoading]);

    const handleBoost = useCallback(async (e) => {
        e.stopPropagation();
        if (!mastodonUser || actionLoading) return;
        setActionLoading('boost');
        try { await toggleBoost(post.id, post.isBoosted); }
        finally { setActionLoading(null); }
    }, [mastodonUser, post, toggleBoost, actionLoading]);

    const handleCardClick = useCallback(() => {
        dispatch({ type: 'SET_ACTIVE_POST', post });
    }, [dispatch, post]);

    const text = stripHtml(post.content);

    return (
        <article className={`post-card ${showThread ? 'post-card--thread' : ''}`} onClick={!showThread ? handleCardClick : undefined}>
            {post.isBoostedPost && (
                <div className="post-card__boost-label">
                    <Repeat size={13} />
                    <span>{post.boostedBy} paylaştı</span>
                </div>
            )}

            <div className="post-card__body">
                <div className="post-card__avatar-col">
                    {post.authorAvatar
                        ? <img src={post.authorAvatar} alt={post.authorUsername} className="post-card__avatar" loading="lazy" />
                        : <div className="post-card__avatar post-card__avatar--placeholder">{(post.author || '?')[0]}</div>
                    }
                    {showThread && <div className="post-card__thread-line" />}
                </div>

                <div className="post-card__content">
                    <div className="post-card__header">
                        <span className="post-card__author">{post.author}</span>
                        <span className="post-card__username">@{post.authorUsername}</span>
                        <span className="post-card__dot">·</span>
                        <span className="post-card__time">{relativeTime(post.createdAt)}</span>
                    </div>

                    {post.spoilerText && (
                        <p className="post-card__spoiler">{post.spoilerText}</p>
                    )}

                    <p className="post-card__text">{text}</p>

                    {post.media?.length > 0 && (
                        <div className={`post-card__media post-card__media--${Math.min(post.media.length, 4)}`}>
                            {post.media.map(m => (
                                m.type === 'image'
                                    ? <img key={m.id} src={m.previewUrl || m.url} alt="media" className="post-card__media-img" loading="lazy" />
                                    : <video key={m.id} src={m.url} controls className="post-card__media-img" />
                            ))}
                        </div>
                    )}

                    <div className="post-card__actions">
                        <button
                            className="post-card__action post-card__action--reply"
                            onClick={(e) => { e.stopPropagation(); onReply && onReply(post); }}
                            aria-label="Yanıtla"
                        >
                            <MessageCircle size={16} />
                            {post.repliesCount > 0 && <span>{post.repliesCount}</span>}
                        </button>

                        <button
                            className={`post-card__action post-card__action--boost ${post.isBoosted ? 'post-card__action--active-boost' : ''} ${actionLoading === 'boost' ? 'post-card__action--loading' : ''}`}
                            onClick={handleBoost}
                            disabled={!mastodonUser}
                            aria-label="Paylaş"
                        >
                            <Repeat2 size={16} />
                            {post.boostsCount > 0 && <span>{post.boostsCount}</span>}
                        </button>

                        <button
                            className={`post-card__action post-card__action--like ${post.isLiked ? 'post-card__action--active-like' : ''} ${actionLoading === 'like' ? 'post-card__action--loading' : ''}`}
                            onClick={handleLike}
                            disabled={!mastodonUser}
                            aria-label="Beğen"
                        >
                            <Heart size={16} fill={post.isLiked ? 'currentColor' : 'none'} />
                            {post.likesCount > 0 && <span>{post.likesCount}</span>}
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
});

PostCard.displayName = 'PostCard';
export default PostCard;
