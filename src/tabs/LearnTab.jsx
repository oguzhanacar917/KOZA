import { Brain, Shield, Users, MessageCircle, PlayCircle } from 'lucide-react';
import GalaxyButton from '../components/galaxy/GalaxyButton';
import GalaxyCard from '../components/galaxy/GalaxyCard';

// Atomic Imports
import {
    GalaxyContainer,
    GalaxyStack,
    GalaxyBox,
    GalaxyGrid,
    GalaxyFlex,
    GalaxyAspectRatio
} from '../components/galaxy/GalaxyLayout';

import {
    GalaxyHeading,
    GalaxyText
} from '../components/galaxy/GalaxyTypography';

import {
    GalaxyTag,
    GalaxyTagLabel
} from '../components/galaxy/GalaxyDataDisplay';

const LearnTab = () => {
    const modules = [
        {
            id: 1,
            title: "Duygu Kontrolü",
            subtitle: "Modül 01",
            description: "Öfke, korku ve hayal kırıklığını anlamak ve onları yakıta dönüştürmek.",
            icon: Brain,
            color: "primary"
        },
        {
            id: 2,
            title: "Dijital Güvenlik",
            subtitle: "Modül 02",
            description: "Siber dünyada sınırlarını çizmek ve dijital ayak izini yönetmek.",
            icon: Shield,
            color: "success"
        },
        {
            id: 3,
            title: "Radikal Empati",
            subtitle: "Modül 03",
            description: "Başkalarının gözünden bakabilmek için derin dinleme teknikleri.",
            icon: Users,
            color: "warning"
        },
        {
            id: 4,
            title: "İletişim Sanatı",
            subtitle: "Modül 04",
            description: "Kendini doğru ifade etme ve çatışmaları barışçıl çözme rehberi.",
            icon: MessageCircle,
            color: "error"
        }
    ];

    return (
        <GalaxyContainer className="py-8">
            <GalaxyStack spacing={8}>
                {/* Header */}
                <GalaxyBox className="text-center sm:text-left">
                    <GalaxyHeading as="h1" gradient className="mb-2">
                        Akademi
                    </GalaxyHeading>
                    <GalaxyText className="text-neutral-500">
                        Dönüşüm yolculuğunda sana rehberlik edecek modüller
                    </GalaxyText>
                </GalaxyBox>

                {/* Featured */}
                <GalaxyCard
                    title="Duygusal Rehber"
                    subtitle="Yeni Başlayanlar İçin"
                    emoji="🚀"
                >
                    <GalaxyFlex direction="column" className="md:flex-row items-center gap-8 relative z-10">
                        <GalaxyBox className="flex-1">
                            <GalaxyText className="text-neutral-500 mb-8 leading-relaxed max-w-lg">
                                Zorbalık sadece bir olay değil, bir iletişim biçimi hatasıdır. Kendini ve sınırlarını korumayı öğrenmek, dönüşümün ilk adımıdır.
                            </GalaxyText>
                            <GalaxyButton onClick={() => console.log('Start Academy')} className="!px-10 shadow-xl shadow-primary-500/20">
                                <PlayCircle size={20} />
                                Akademiyi Başlat
                            </GalaxyButton>
                        </GalaxyBox>
                        <GalaxyBox className="w-full md:w-80 h-auto bg-neutral-100 rounded-2xl border border-neutral-200 flex items-center justify-center shadow-lg group cursor-pointer hover:border-primary-500/50 transition-all overflow-hidden relative">
                            <GalaxyAspectRatio ratio={16 / 9}>
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-purple-600/10 group-hover:opacity-100 opacity-60 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform relative z-10">
                                        <PlayCircle size={32} className="text-white ml-1" />
                                    </div>
                                </div>
                            </GalaxyAspectRatio>
                        </GalaxyBox>
                    </GalaxyFlex>
                </GalaxyCard>

                {/* Modules */}
                <GalaxyGrid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
                    {modules.map(module => {
                        const Icon = module.icon;
                        return (
                            <GalaxyCard key={module.id} className="h-full flex flex-col">
                                <GalaxyFlex justify="space-between" align="flex-start" className="mb-4">
                                    <GalaxyFlex
                                        align="center"
                                        justify="center"
                                        className={`w-12 h-12 rounded-2xl border ${module.color === 'primary' ? 'bg-primary-500/10 border-primary-500/20 text-primary-600' :
                                            module.color === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-600' :
                                                module.color === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-600' :
                                                    'bg-red-500/10 border-red-500/20 text-red-600'
                                            }`}
                                    >
                                        <Icon size={24} />
                                    </GalaxyFlex>
                                    <GalaxyTag size="sm" variant="outline" className="text-[10px]">
                                        <GalaxyTagLabel>{module.subtitle}</GalaxyTagLabel>
                                    </GalaxyTag>
                                </GalaxyFlex>

                                <GalaxyHeading as="h3" size="lg" className="text-neutral-900 mb-2">
                                    {module.title}
                                </GalaxyHeading>
                                <GalaxyText size="sm" className="text-neutral-500 leading-relaxed mb-6 flex-1">
                                    {module.description}
                                </GalaxyText>

                                <GalaxyButton
                                    className="w-full !py-2 !text-xs uppercase tracking-wider"
                                    variant="secondary"
                                    onClick={() => { }}
                                >
                                    Modüle Git
                                </GalaxyButton>
                            </GalaxyCard>
                        );
                    })}
                </GalaxyGrid>
            </GalaxyStack>
        </GalaxyContainer>
    );
};

export default LearnTab;
