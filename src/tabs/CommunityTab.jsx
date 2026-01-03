import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Eye, BookOpen, Gamepad2, Search } from 'lucide-react';
import GalaxyInput from '../components/galaxy/GalaxyInput';
import GalaxyButton from '../components/galaxy/GalaxyButton';
import GalaxyCard from '../components/galaxy/GalaxyCard';
import GalaxyChip from '../components/galaxy/GalaxyChip';
import GalaxyAvatar from '../components/galaxy/GalaxyAvatar';
import GalaxyBadge from '../components/galaxy/GalaxyBadge';
import GalaxyContainer from '../components/galaxy/GalaxyContainer';
import GalaxyGrid from '../components/galaxy/GalaxyGrid';

const CommunityTab = () => {
    const { communityWorks, awardXP } = useApp();
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredWorks = communityWorks.filter(work => {
        const matchesFilter = filter === 'all' || work.type === filter;
        const matchesSearch = searchQuery === '' ||
            work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            work.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
            work.category.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    return (
        <GalaxyContainer className="py-8">
            <div className="mb-8 text-center sm:text-left">
                <h1 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
                    Topluluk
                </h1>
                <p className="text-neutral-500">Diğer kullanıcıların dönüşüm hikayelerini keşfet</p>
            </div>

            {/* Search */}
            <div className="mb-8">
                <GalaxyInput
                    icon={Search}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Hikaye veya oyun ara..."
                    className="w-full"
                />
            </div>

            {/* Filter */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-none items-center">
                <GalaxyChip
                    label="Hepsi"
                    active={filter === 'all'}
                    onClick={() => setFilter('all')}
                />
                <GalaxyChip
                    label="Hikayeler"
                    icon={BookOpen}
                    active={filter === 'story'}
                    onClick={() => setFilter('story')}
                />
                <GalaxyChip
                    label="Oyunlar"
                    icon={Gamepad2}
                    active={filter === 'game'}
                    onClick={() => setFilter('game')}
                />
            </div>

            {/* Works Grid */}
            {filteredWorks.length === 0 ? (
                <div className="text-center py-16 bg-white/30 rounded-3xl border border-white/40 backdrop-blur-sm">
                    <BookOpen size={48} className="mx-auto mb-4 text-neutral-300" />
                    <p className="text-neutral-500 font-medium">Sonuç bulunamadı</p>
                </div>
            ) : (
                <GalaxyGrid cols={2} className="gap-6">
                    {filteredWorks.map(work => (
                        <GalaxyCard
                            key={work.id}
                            title={work.title}
                            subtitle={
                                <div className="flex items-center gap-2 mt-1">
                                    <GalaxyBadge variant="secondary" className="text-[10px] py-0 px-2 h-5">
                                        {work.category}
                                    </GalaxyBadge>
                                </div>
                            }
                            emoji={work.type === 'story' ? '📖' : '🎮'}
                        >
                            <div className="flex items-center gap-3 mb-4 -mt-1">
                                <GalaxyAvatar
                                    name={work.author}
                                    size="small"
                                    status="online"
                                />
                                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                                    {work.author}
                                </span>
                            </div>

                            <p className="text-neutral-600 text-sm mb-6 line-clamp-3 leading-relaxed opacity-80">
                                {work.preview}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-primary-500/10">
                                <div className="flex items-center gap-4 text-sm text-neutral-500">
                                    <span className="flex items-center gap-1.5 hover:text-primary-600 transition-colors cursor-pointer group">
                                        <Eye size={16} className="group-hover:text-primary-500 transition-colors" />
                                        {work.views}
                                    </span>
                                    <button
                                        onClick={() => awardXP(10, 'Topluluk desteği')}
                                        className="flex items-center gap-1.5 hover:text-red-500 transition-all hover:scale-110 group"
                                    >
                                        <Heart size={16} className="group-hover:fill-red-500 transition-colors" />
                                        {work.likes}
                                    </button>
                                </div>
                                <GalaxyButton
                                    className="!py-1.5 !px-4 !text-[11px] uppercase tracking-wide"
                                    onClick={() => { }}
                                    variant="secondary"
                                >
                                    Görüntüle
                                </GalaxyButton>
                            </div>
                        </GalaxyCard>
                    ))}
                </GalaxyGrid>
            )}
        </GalaxyContainer>
    );
};

export default CommunityTab;
