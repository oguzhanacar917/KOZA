'use client';
import React from 'react';
import { useUser } from '../context/UserContext';
import { useUI } from '../context/UIContext';
import { Shield, Zap, Target, Lock, ArrowRight, AlertTriangle } from 'lucide-react';
import GalaxyContainer from '../components/galaxy/GalaxyContainer';
import GalaxyButton from '../components/galaxy/GalaxyButton';
import GalaxyCard from '../components/galaxy/GalaxyCard';
import GalaxyGrid from '../components/galaxy/GalaxyGrid';

const PricingView = ({ onClose }) => {
    const { user } = useUser();
    const { addToast } = useUI();

    const tiers = [
        {
            name: 'Gözlemci',
            price: '0',
            description: 'Hikaye dünyasına ilk adım.',
            features: [
                'Ayda 10 Hikaye Dönüşümü',
                'Temel Oyun Simülasyonu',
                'Standart Gelişim Takibi'
            ],
            cta: 'Mevcut Plan',
            variant: 'secondary',
            disabled: true
        },
        {
            name: 'Mimar',
            price: '49',
            description: 'Stratejik zihinler için tam gelişim paketi.',
            features: [
                'Sınırsız Hikaye Dönüşümü',
                'Gelişmiş Karakter Analizi',
                'Küresel Dayanıklılık Haritası',
                'Veri ve PDF Dışa Aktarma'
            ],
            cta: "Mimar'a Yükselt",
            variant: 'primary',
            highlight: true
        },
        {
            name: 'Koza Pro',
            price: '499',
            description: 'En derin dönüşüm ve destek seviyesi.',
            features: [
                'Öncelikli Hikaye İşleme',
                'Kişisel AI Gelişim Rehberi',
                'Derin Psikolojik Analizler',
                'Her Şey Sınırsız'
            ],
            cta: "Koza Pro'yu Keşfet",
            variant: 'gold'
        }
    ];

    return (
        <GalaxyContainer className="py-20 animate-fade-in">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-black uppercase tracking-tight mb-4">
                    Gelişiminize Yatırım Yapın
                </h1>
                <p className="text-neutral-500 max-w-2xl mx-auto border-l-2 border-amber-500 pl-6 text-left">
                    Gürültü ile sinyal arasındaki fark, onu işlemek için kullandığınız sistemdir. Dönüşüm seviyenizi seçin.
                </p>
            </div>

            <GalaxyGrid cols={3} gap={8}>
                {tiers.map((tier) => (
                    <div key={tier.name} className={`relative flex flex-col h-full ${tier.highlight ? 'scale-105 z-10' : ''}`}>
                        <GalaxyCard
                            className={`flex-1 flex flex-col border-2 ${tier.highlight ? 'border-neutral-900 shadow-2xl' : 'border-neutral-200'}`}
                        >
                            <div className="mb-6">
                                <h3 className="text-xl font-bold uppercase tracking-widest text-neutral-400 mb-1">{tier.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-neutral-900">{tier.price}₺</span>
                                    <span className="text-neutral-500">/ay</span>
                                </div>
                            </div>

                            <p className="text-neutral-600 mb-8 font-medium">{tier.description}</p>

                            <ul className="space-y-4 mb-10 flex-1">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex gap-3 text-sm font-semibold text-neutral-700">
                                        <Shield size={16} className="text-neutral-400 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <GalaxyButton
                                variant={tier.variant}
                                className="w-full justify-center"
                                disabled={tier.disabled}
                                onClick={() => addToast('success', 'Talep Alındı', `${tier.name} yükseltme süreci başlatılıyor.`)}
                            >
                                {tier.cta}
                            </GalaxyButton>
                        </GalaxyCard>
                    </div>
                ))}
            </GalaxyGrid>

            {/* Loss Aversion Section */}
            <div className="mt-24 p-12 bg-neutral-950 text-white rounded-sm border-l-8 border-amber-500">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-amber-500 mb-4 uppercase tracking-widest font-black text-sm">
                            <AlertTriangle size={20} />
                            Önemli Farkındalık
                        </div>
                        <h2 className="text-3xl font-black uppercase mb-6 leading-tight">
                            Hareketsiz Kalmanın Maliyeti
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed mb-8">
                            İşlenmemiş anlatılar yapısal yüke dönüşür. **Gözlemci** seviyesinde kalarak, hikayelerinizin sunduğu gelişim potansiyelinin büyük kısmını değerlendiremiyor olabilirsiniz.
                        </p>
                        <div className="flex gap-8">
                            <div>
                                <div className="text-2xl font-black text-white">2.4k+</div>
                                <div className="text-xs text-neutral-500 uppercase tracking-widest">Kazanılan İçgörü</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-white">92%</div>
                                <div className="text-xs text-neutral-500 uppercase tracking-widest">Dönüşüm Başarısı</div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-72">
                        <GalaxyButton variant="gold" className="w-full h-16 text-lg" onClick={onClose}>
                            Kaybı Önleyin
                        </GalaxyButton>
                    </div>
                </div>
            </div>
        </GalaxyContainer>
    );
};

export default PricingView;
