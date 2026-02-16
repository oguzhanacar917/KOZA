import React, { useState } from 'react';
import GalaxyBottomNav from './GalaxyBottomNav';
import GalaxyFab from './GalaxyFab';
import GalaxyIndicator from './GalaxyIndicator';
import { Home, Users, Book, Search, User, Plus } from 'lucide-react';
import GalaxyCard from './GalaxyCard';

const GalaxyShowcase = () => {
    const [activeTab, setActiveTab] = useState('home');

    const navItems = [
        { id: 'home', label: 'Keşfet', icon: <Home size={20} />, dot: true },
        { id: 'community', label: 'Topluluk', icon: <Users size={20} /> },
        { id: 'search', label: 'Ara', icon: <Search size={20} /> },
        { id: 'profile', label: 'Profil', icon: <User size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-neutral-50 p-8 pb-32">
            <div className="max-w-4xl mx-auto space-y-12">
                <section>
                    <h2 className="text-3xl font-bold text-neutral-900 mb-6">Premium Components</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <GalaxyCard title="Indicators" subtitle="Liquid & Ring variations">
                            <div className="flex items-center justify-around p-4 h-32">
                                <GalaxyIndicator type="liquid" label="Processing" />
                                <GalaxyIndicator type="ring" size="sm" label="Loading" />
                                <GalaxyIndicator type="liquid" size="lg" />
                            </div>
                        </GalaxyCard>

                        <GalaxyCard title="Floating Action Button" subtitle="Morphing shape & Shimmer">
                            <div className="flex items-center justify-center p-4 h-32 relative">
                                <span className="text-sm text-neutral-400">Look at the bottom right corner</span>
                                <GalaxyFab
                                    icon={<Plus size={24} />}
                                    onClick={() => alert('FAB Clicked!')}
                                    className="static !translate-y-0 !right-0 !bottom-0 !relative"
                                />
                            </div>
                        </GalaxyCard>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-4">Bottom Navigation</h2>
                    <p className="text-neutral-500 mb-8">Premium magnetic tab navigation with liquid glass backdrop.</p>
                    {/* The actual component is fixed to bottom by default in its CSS, 
                        but for showcase we might want to see it here too if we removed 'fixed' */}
                </section>
            </div>

            <GalaxyBottomNav
                items={navItems}
                activeId={activeTab}
                onTabChange={setActiveTab}
            />

            <GalaxyFab
                icon={<Plus size={24} />}
                onClick={() => console.log('Main FAB clicked')}
                label="New Action"
                size="md"
            />
        </div>
    );
};

export default GalaxyShowcase;
