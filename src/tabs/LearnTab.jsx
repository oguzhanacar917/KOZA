import { Brain, Shield, Users, MessageCircle, PlayCircle } from 'lucide-react';
import GalaxyCard from '../components/galaxy/GalaxyCard';
import GalaxyButton from '../components/galaxy/GalaxyButton';
import GalaxyContainer from '../components/galaxy/GalaxyContainer';
import GalaxyGrid from '../components/galaxy/GalaxyGrid';
import GalaxyBadge from '../components/galaxy/GalaxyBadge';

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
            <div className="mb-8 text-center sm:text-left">
                <h1 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
                    Akademi
                </h1>
                <p className="text-neutral-500">Dönüşüm yolculuğunda sana rehberlik edecek modüller</p>
            </div>

            {/* Featured */}
            <GalaxyCard
                className="mb-12"
                title="Duygusal Rehber"
                subtitle="Yeni Başlayanlar İçin"
                emoji="🚀"
            >
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="flex-1">
                        <p className="text-neutral-500 mb-8 leading-relaxed max-w-lg">
                            Zorbalık sadece bir olay değil, bir iletişim biçimi hatasıdır. Kendini ve sınırlarını korumayı öğrenmek, dönüşümün ilk adımıdır.
                        </p>
                        <GalaxyButton onClick={() => console.log('Start Academy')} className="!px-10 shadow-xl shadow-primary-500/20">
                            <PlayCircle size={20} />
                            Akademiyi Başlat
                        </GalaxyButton>
                    </div>
                    <div className="w-full md:w-80 aspect-video bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 flex items-center justify-center shadow-lg group cursor-pointer hover:border-primary-500/50 transition-all overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-purple-600/10 group-hover:opacity-100 opacity-60 transition-opacity" />
                        <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform relative z-10">
                            <PlayCircle size={32} className="text-white ml-1" />
                        </div>
                    </div>
                </div>
            </GalaxyCard>

            {/* Modules */}
            <GalaxyGrid cols={4} className="gap-6">
                {modules.map(module => {
                    const Icon = module.icon;
                    return (
                        <GalaxyCard key={module.id} className="h-full flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${module.color === 'primary' ? 'bg-primary-500/10 border-primary-500/20 text-primary-600' :
                                    module.color === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-600' :
                                        module.color === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-600' :
                                            'bg-red-500/10 border-red-500/20 text-red-600'
                                    }`}>
                                    <Icon size={24} />
                                </div>
                                <GalaxyBadge variant="outline" className="text-[10px]">{module.subtitle}</GalaxyBadge>
                            </div>

                            <h3 className="text-lg font-bold text-neutral-800 mb-2">{module.title}</h3>
                            <p className="text-sm text-neutral-500 leading-relaxed mb-6 flex-1">{module.description}</p>

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
        </GalaxyContainer>
    );
};

export default LearnTab;
