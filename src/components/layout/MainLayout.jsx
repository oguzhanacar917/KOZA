import React from 'react';
import { useApp } from '../../context/AppContext';
import Onboarding from '../Onboarding';
import GalaxyToastContainer from '../galaxy/GalaxyToastContainer';
import Header from './Header';
import GalaxyBottomNav from '../galaxy/GalaxyBottomNav';
import GalaxyFab from '../galaxy/GalaxyFab';
import { Home, Users, Book, Search, User, Plus } from 'lucide-react';

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
        <div className="min-h-screen text-neutral-900 pb-20 overflow-x-hidden selection:bg-primary-200 selection:text-primary-900">
            {/* Liquid Background Blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200/30 blur-[120px] rounded-full animate-pulse-subtle" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/20 blur-[120px] rounded-full animate-float" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-200/20 blur-[120px] rounded-full animate-morph-slow" />
            </div>

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

            {/* Floating Action Button */}
            {!currentView && (
                <GalaxyFab
                    icon={<Plus size={24} />}
                    onClick={() => addToast('info', 'Aksiyon', 'Yeni gönderi özelliği yakında!')}
                    label="Yeni"
                    size="md"
                    className="!bottom-24"
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
