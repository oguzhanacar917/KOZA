import React, { Suspense, lazy } from 'react';
import { useApp } from '../context/AppContext';
import GalaxySpinner from '../components/galaxy/GalaxySpinner'; // Lighter loader for page delivery

// Lazy Load Components (Lightspeed Optimization)
const CreateTab = lazy(() => import('../tabs/CreateTab'));
const CommunityTab = lazy(() => import('../tabs/CommunityTab'));
const LearnTab = lazy(() => import('../tabs/LearnTab'));
const StoryView = lazy(() => import('../views/StoryView'));
const GameView = lazy(() => import('../views/GameView'));

const FallbackLoader = () => (
    <div className="flex items-center justify-center p-20 animate-fade-in">
        <GalaxySpinner size="large" />
    </div>
);

const AppRouter = () => {
    const { currentView, setCurrentView, activeTab } = useApp();

    // 1. Full Screen Views (Story / Game)
    if (currentView?.type === 'story') {
        return (
            <Suspense fallback={<FallbackLoader />}>
                <StoryView story={currentView.data} onClose={() => setCurrentView(null)} />
            </Suspense>
        );
    }

    if (currentView?.type === 'game') {
        return (
            <Suspense fallback={<FallbackLoader />}>
                <GameView game={currentView.data} onClose={() => setCurrentView(null)} />
            </Suspense>
        );
    }

    // 2. Tab Navigation
    const renderTabContent = () => {
        switch (activeTab) {
            case 'create': return <CreateTab />;
            case 'community': return <CommunityTab />;
            case 'learn': return <LearnTab />;
            default: return <CreateTab />;
        }
    };

    return (
        <div key={activeTab + (currentView?.type || 'none')} className="animate-liquid">
            <Suspense fallback={<FallbackLoader />}>
                {renderTabContent()}
            </Suspense>
        </div>
    );
};

export default AppRouter;
