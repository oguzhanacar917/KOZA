'use client';
import React from 'react';
import { Users, Globe } from 'lucide-react';
import { community } from '../../services/mastodonService';
import './CommunityLoginPrompt.css';

const CommunityLoginPrompt = () => {
    return (
        <div className="login-prompt">
            <div className="login-prompt__icon">🌐</div>
            <h2 className="login-prompt__title">Koza Topluluğuna Katılın</h2>
            <p className="login-prompt__desc">
                Hikaye paylaşın, başkalarından ilham alın ve büyüyen bir empati topluluğunun parçası olun.
            </p>
            <div className="login-prompt__features">
                <div className="login-prompt__feature">
                    <Globe size={18} />
                    <span>Federated & açık platform</span>
                </div>
                <div className="login-prompt__feature">
                    <Users size={18} />
                    <span>Gerçek insanlar, gerçek hikayeler</span>
                </div>
            </div>
            <a href={community.loginUrl()} className="login-prompt__btn">
                ✨ Toplulukla Bağlan
            </a>
            <p className="login-prompt__note">
                Mastodon hesabınızla güvenli OAuth bağlantısı.
            </p>
        </div>
    );
};

export default CommunityLoginPrompt;
