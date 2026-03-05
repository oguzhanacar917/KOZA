'use client';
import React, { useState, useCallback } from 'react';
import { Bell, Home, Search, Globe2, LogOut, Users } from 'lucide-react';
import { CommunityProvider, useCommunity } from '../context/CommunityContext';
import TimelineFeed from '../components/community/TimelineFeed';
import PostComposer from '../components/community/PostComposer';
import NotificationPanel from '../components/community/NotificationPanel';
import CommunityLoginPrompt from '../components/community/CommunityLoginPrompt';
import './CommunityView.css';

// ─── Search Box ──────────────────────────────────────────────────────────────
const SearchBox = () => {
    const { searchContent, searchResults, searchLoading } = useCommunity();
    const [q, setQ] = useState('');

    const handleSearch = useCallback((e) => {
        e.preventDefault();
        searchContent({ q });
    }, [q, searchContent]);

    return (
        <form onSubmit={handleSearch} className="community-search">
            <input
                className="community-search__input"
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="🔍 Ara..."
            />
        </form>
    );
};

// ─── Left Sidebar ─────────────────────────────────────────────────────────────
const LeftSidebar = ({ onNotif, notifOpen }) => {
    const { mastodonUser, timelineType, setTimelineType, logout } = useCommunity();

    return (
        <aside className="community-sidebar community-sidebar--left">
            {mastodonUser && (
                <div className="community-profile-card">
                    {mastodonUser.avatar
                        ? <img src={mastodonUser.avatar} alt={mastodonUser.username} className="community-profile-card__avatar" />
                        : <div className="community-profile-card__avatar community-profile-card__avatar--placeholder">{(mastodonUser.displayName || '?')[0]}</div>
                    }
                    <div className="community-profile-card__info">
                        <p className="community-profile-card__name">{mastodonUser.displayName}</p>
                        <p className="community-profile-card__username">@{mastodonUser.username}</p>
                    </div>
                    <div className="community-profile-card__stats">
                        <span><strong>{mastodonUser.postsCount ?? '—'}</strong> gönderi</span>
                        <span><strong>{mastodonUser.followersCount ?? '—'}</strong> takipçi</span>
                    </div>
                </div>
            )}

            <nav className="community-nav">
                <button
                    className={`community-nav__item ${timelineType === 'public' ? 'community-nav__item--active' : ''}`}
                    onClick={() => setTimelineType('public')}
                >
                    <Globe2 size={18} /> Keşfet
                </button>
                {mastodonUser && (
                    <button
                        className={`community-nav__item ${timelineType === 'home' ? 'community-nav__item--active' : ''}`}
                        onClick={() => setTimelineType('home')}
                    >
                        <Home size={18} /> Ana Akış
                    </button>
                )}
                <button
                    className={`community-nav__item ${notifOpen ? 'community-nav__item--active' : ''}`}
                    onClick={onNotif}
                >
                    <Bell size={18} /> Bildirimler
                </button>
            </nav>

            {mastodonUser && (
                <button className="community-logout" onClick={logout}>
                    <LogOut size={15} /> Çıkış Yap
                </button>
            )}
        </aside>
    );
};

// ─── Right Sidebar ────────────────────────────────────────────────────────────
const RightSidebar = ({ showSearch }) => (
    <aside className="community-sidebar community-sidebar--right">
        {showSearch && <SearchBox />}
        <div className="community-info-card">
            <h3 className="community-info-card__title">
                <Users size={16} /> Koza Topluluğu
            </h3>
            <p className="community-info-card__desc">
                Empati temelli bir paylaşım alanı. Açık, federe ve güvenli.
            </p>
        </div>
    </aside>
);

// ─── Inner Page (must be inside CommunityProvider) ───────────────────────────
const CommunityInner = () => {
    const { mastodonUser, authLoading, notifications } = useCommunity();
    const [notifOpen, setNotifOpen] = useState(false);
    const [replyTo, setReplyTo] = useState(null);

    const handleReply = useCallback((post) => {
        setReplyTo(post);
    }, []);

    if (authLoading) {
        return (
            <div className="community-loading">
                <div className="community-loading__spinner" />
                <p>Topluluk yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="community-layout">
            {/* Left Sidebar */}
            <LeftSidebar onNotif={() => setNotifOpen(v => !v)} notifOpen={notifOpen} />

            {/* Main Feed */}
            <main className="community-main">
                <div className="community-main__header">
                    <h1 className="community-main__title">
                        {notifOpen ? 'Bildirimler' : 'Topluluk'}
                    </h1>
                </div>

                {notifOpen ? (
                    <NotificationPanel onClose={() => setNotifOpen(false)} />
                ) : (
                    <>
                        {mastodonUser
                            ? <PostComposer
                                inReplyToId={replyTo?.id}
                                replyingTo={replyTo?.authorUsername}
                                onSuccess={() => setReplyTo(null)}
                            />
                            : <CommunityLoginPrompt />
                        }
                        <TimelineFeed onReply={handleReply} />
                    </>
                )}
            </main>

            {/* Right Sidebar */}
            <RightSidebar showSearch={!!mastodonUser} />
        </div>
    );
};

// ─── Top-level Export (wraps in CommunityProvider) ───────────────────────────
const CommunityView = () => (
    <CommunityProvider>
        <CommunityInner />
    </CommunityProvider>
);

export default CommunityView;
