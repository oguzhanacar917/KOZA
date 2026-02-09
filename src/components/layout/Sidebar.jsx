import React from 'react';
import { Home, Users, Book, User, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import ValoButton from '../ui/ValoButton';

const Sidebar = () => {
    const { activeTab, setActiveTab, currentView, setCurrentView } = useApp();
    const { signOut } = useAuth();

    const navItems = [
        { id: 'create', label: 'Keşfet', icon: <Home size={20} /> },
        { id: 'community', label: 'Topluluk', icon: <Users size={20} /> },
        { id: 'learn', label: 'Akademi', icon: <Book size={20} /> },
        { id: 'profile', label: 'Profil', icon: <User size={20} /> },
    ];

    const handleTabChange = (id) => {
        setActiveTab(id);
        setCurrentView(null); // Reset to main view of that tab
    };

    return (
        <aside className="w-64 h-screen bg-white border-r border-neutral-200 flex flex-col flex-shrink-0">
            {/* Logo Area */}
            <div className="h-20 flex items-center px-6 border-b border-neutral-100">
                <div className="flex items-center gap-3 text-neutral-900">
                    <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                        K
                    </div>
                    <span className="text-xl font-bold tracking-tighter italic">KOZA</span>
                </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 py-6 px-3 space-y-4 overflow-y-auto">
                {navItems.map((item) => (
                    <ValoButton
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        isActive={activeTab === item.id && !currentView}
                        icon={item.icon}
                        className="w-full"
                    >
                        {item.label}
                    </ValoButton>
                ))}
            </nav>

            {/* Bottom/Footer Area */}
            <div className="p-4 border-t border-neutral-100">
                <ValoButton
                    onClick={() => signOut()}
                    icon={<LogOut size={20} />}
                    className="w-full"
                >
                    Çıkış Yap
                </ValoButton>
            </div>
        </aside>
    );
};

export default Sidebar;
