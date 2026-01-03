import React, { useEffect } from 'react';
import { useApp } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import { googleAnalytics } from './utils/googleAnalytics';

// New Architecture Components
import MainLayout from './components/layout/MainLayout';
import AppRouter from './router/AppRouter';
import GalaxyLoader from './components/galaxy/GalaxyLoader';

const App = () => {
    const { currentView, activeTab } = useApp();
    const { user: authUser, loading: authLoading } = useAuth();

    // Track page views
    useEffect(() => {
        const path = authUser ? (currentView ? `/${currentView.type}` : `/${activeTab}`) : '/landing';
        googleAnalytics.trackPageView(path);
    }, [currentView, activeTab, authUser]);

    // Show loading state while checking auth
    if (authLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <GalaxyLoader message="METAMORFOZ BAŞLIYOR..." />
            </div>
        );
    }

    if (!authUser) {
        return <HomePage />;
    }

    return (
        <MainLayout>
            <AppRouter />
        </MainLayout>
    );
};

export default App;
