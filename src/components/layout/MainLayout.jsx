import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import Onboarding from '../Onboarding';
import GalaxyToastContainer from '../galaxy/GalaxyToastContainer';
import Header from './Header';
import GalaxyBottomNav from '../galaxy/GalaxyBottomNav';
import { Home, Users, Book, Search, User, Bell } from 'lucide-react';

const MainLayout = ({ children }) => {
    const {
        notification,
        activeTab,
        setActiveTab,
        currentView,
        addToast,
        showOnboarding,
        setShowOnboarding
    } = useApp();



    const navItems = [
        { id: 'create', label: 'Keşfet', icon: <Home size={20} />, dot: true },
        { id: 'community', label: 'Topluluk', icon: <Users size={20} /> },
        { id: 'learn', label: 'Akademi', icon: <Book size={20} /> },
        { id: 'search', label: 'Ara', icon: <Search size={20} /> },
        { id: 'profile', label: 'Profil', icon: <User size={20} /> },
    ];

    const handleTabChange = (id) => {
        if (id === 'search') {
            addToast('info', 'Keşfet', 'Arama özelliği yakında sizlerle!');
            return;
        }
        setActiveTab(id);
    };

    return (
        <div
            className="min-h-screen text-neutral-900 pb-20 overflow-x-hidden selection:bg-primary-200 selection:text-primary-900 transition-all duration-300"
        >

            {/* Onboarding Overlay */}
            {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}

            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="relative z-10 pt-20 max-w-6xl mx-auto px-4 animate-liquid">
                {children}
            </main>

            {/* Bottom Navigation */}
            {!currentView && (
                <GalaxyBottomNav
                    items={navItems}
                    activeId={activeTab}
                    onTabChange={handleTabChange}
                />
            )}



            {/* Notification */}
            {notification && (
                <div className="fixed bottom-24 right-4 bg-white border border-neutral-200 rounded-lg shadow-lg p-4 max-w-sm animate-slide-up z-50">
                    <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${notification.type === 'levelup' ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-600'
                            }`}>
                            <Bell size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm">{notification.title}</p>
                            <p className="text-sm text-neutral-600 mt-0.5">{notification.message}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Galaxy Toast Notifications */}
            <GalaxyToastContainer />
        </div>
    );
};

export default MainLayout;
