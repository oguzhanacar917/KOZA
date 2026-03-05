'use client';
import React, { useEffect } from 'react';
import { Bell, Heart, Repeat2, UserPlus, AtSign, X } from 'lucide-react';
import { useCommunity } from '../../context/CommunityContext';
import './NotificationPanel.css';

const ICONS = {
    favourite: { Icon: Heart, color: '#e11d48', label: 'gönderinizi beğendi' },
    reblog: { Icon: Repeat2, color: '#059669', label: 'gönderinizi paylaştı' },
    follow: { Icon: UserPlus, color: '#7c3aed', label: 'sizi takip etmeye başladı' },
    mention: { Icon: AtSign, color: '#0ea5e9', label: 'sizi bahsetti' },
};

function relativeTime(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'şimdi';
    if (mins < 60) return `${mins}d`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}sa`;
    return `${Math.floor(hrs / 24)}g`;
}

const NotificationPanel = ({ onClose }) => {
    const { notifications, notifLoading, unreadCount, loadNotifications, clearNotifications } = useCommunity();

    useEffect(() => {
        loadNotifications();
    }, []);

    return (
        <div className="notif-panel">
            <div className="notif-panel__header">
                <div className="notif-panel__title">
                    <Bell size={18} />
                    <span>Bildirimler</span>
                    {unreadCount > 0 && <span className="notif-panel__badge">{unreadCount}</span>}
                </div>
                <div className="notif-panel__actions">
                    {notifications.length > 0 && (
                        <button className="notif-panel__clear" onClick={clearNotifications}>Tümünü Temizle</button>
                    )}
                    <button className="notif-panel__close" onClick={onClose}><X size={16} /></button>
                </div>
            </div>

            <div className="notif-panel__list">
                {notifLoading && <p className="notif-panel__empty">Yükleniyor...</p>}
                {!notifLoading && notifications.length === 0 && (
                    <p className="notif-panel__empty">Henüz bildiriminiz yok.</p>
                )}
                {notifications.map(n => {
                    const meta = ICONS[n.type] || { Icon: Bell, color: '#94a3b8', label: n.type };
                    const { Icon, color, label } = meta;
                    return (
                        <div key={n.id} className="notif-item">
                            <div className="notif-item__icon" style={{ color, background: color + '18' }}>
                                <Icon size={16} />
                            </div>
                            <div className="notif-item__content">
                                <div className="notif-item__row">
                                    {n.account?.avatar && (
                                        <img src={n.account.avatar} className="notif-item__avatar" alt={n.account.username} />
                                    )}
                                    <span className="notif-item__actor">{n.account?.displayName}</span>
                                    <span className="notif-item__label">{label}</span>
                                    <span className="notif-item__time">{relativeTime(n.createdAt)}</span>
                                </div>
                                {n.post?.content && (
                                    <p className="notif-item__excerpt"
                                        dangerouslySetInnerHTML={{ __html: n.post.content }}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default NotificationPanel;
