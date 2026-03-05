'use client';
import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, Image, X, AlertCircle } from 'lucide-react';
import { useCommunity } from '../../context/CommunityContext';
import { community } from '../../services/mastodonService';
import './PostComposer.css';

const MAX_CHARS = 500;

const PostComposer = ({ inReplyToId = null, replyingTo = null, onSuccess }) => {
    const { mastodonUser, createPost } = useCommunity();
    const [content, setContent] = useState('');
    const [mediaList, setMediaList] = useState([]); // [{id, previewUrl}]
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const fileRef = useRef(null);

    const charsLeft = MAX_CHARS - content.length;
    const isOverLimit = charsLeft < 0;
    const canSubmit = content.trim().length > 0 && !isOverLimit && !submitting && !uploading;

    const handleImageSelect = useCallback(async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setUploading(true);
        setError(null);
        try {
            const uploads = await Promise.all(files.slice(0, 4 - mediaList.length).map(f => community.uploadMedia(f)));
            setMediaList(prev => [...prev, ...uploads]);
        } catch (err) {
            setError('Görsel yüklenemedi: ' + err.message);
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    }, [mediaList.length]);

    const removeMedia = useCallback((id) => {
        setMediaList(prev => prev.filter(m => m.id !== id));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!canSubmit) return;

        setSubmitting(true);
        setError(null);
        try {
            const post = await createPost({
                content,
                inReplyToId: inReplyToId || undefined,
                mediaIds: mediaList.map(m => m.id),
            });
            setContent('');
            setMediaList([]);
            onSuccess?.(post);
        } catch (err) {
            setError('Gönderi oluşturulamadı: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    }, [canSubmit, content, inReplyToId, mediaList, createPost, onSuccess]);

    if (!mastodonUser) return null;

    return (
        <form className="post-composer" onSubmit={handleSubmit}>
            <div className="post-composer__row">
                {mastodonUser.avatar
                    ? <img src={mastodonUser.avatar} alt={mastodonUser.username} className="post-composer__avatar" />
                    : <div className="post-composer__avatar post-composer__avatar--placeholder">{(mastodonUser.displayName || '?')[0]}</div>
                }
                <div className="post-composer__main">
                    {replyingTo && (
                        <p className="post-composer__replying-to">
                            <span>@{replyingTo}</span> kişisine yanıt veriyorsunuz
                        </p>
                    )}
                    <textarea
                        className="post-composer__textarea"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder={inReplyToId ? 'Yanıtınızı yazın...' : 'Topluluğa bir şeyler paylaşın...'}
                        rows={3}
                        disabled={submitting}
                    />

                    {mediaList.length > 0 && (
                        <div className="post-composer__media-preview">
                            {mediaList.map(m => (
                                <div key={m.id} className="post-composer__media-item">
                                    <img src={m.previewUrl || m.url} alt="upload preview" />
                                    <button type="button" className="post-composer__media-remove" onClick={() => removeMedia(m.id)}>
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {error && (
                        <div className="post-composer__error">
                            <AlertCircle size={14} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="post-composer__toolbar">
                        <div className="post-composer__actions">
                            <input ref={fileRef} type="file" accept="image/*,video/*" multiple className="sr-only" onChange={handleImageSelect} id="composer-file" />
                            <label htmlFor="composer-file" className="post-composer__icon-btn" title="Görsel ekle">
                                <Image size={18} />
                            </label>
                        </div>
                        <div className="post-composer__right">
                            <span className={`post-composer__counter ${charsLeft < 20 ? 'post-composer__counter--warning' : ''} ${isOverLimit ? 'post-composer__counter--error' : ''}`}>
                                {charsLeft}
                            </span>
                            <button type="submit" className="post-composer__submit" disabled={!canSubmit}>
                                {submitting ? '...' : <><Sparkles size={15} /> Paylaş</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default PostComposer;
