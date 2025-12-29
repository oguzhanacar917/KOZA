import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, BookOpen, Users, TrendingUp, Award, Shield, Loader2, AlertCircle } from 'lucide-react';

const HomePage = () => {
    const { signInWithGoogle, firebaseEnabled } = useAuth();
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [error, setError] = useState(null);

    const handleSignIn = async () => {
        setIsSigningIn(true);
        setError(null);

        const result = await signInWithGoogle();

        if (!result.success) {
            setError(result.error);
        }

        setIsSigningIn(false);
    };

    const features = [
        {
            icon: Sparkles,
            title: 'AI Destekli Dönüşüm',
            description: 'Yaşadığın zorlukları güçlendirici hikayelere ve oyunlara dönüştür'
        },
        {
            icon: BookOpen,
            title: 'Kişisel Hikayeler',
            description: 'Her deneyimin benzersiz bir öğrenme fırsatına dönüşür'
        },
        {
            icon: Users,
            title: 'Topluluk Desteği',
            description: 'Diğer kullanıcıların dönüşüm hikayelerinden ilham al'
        },
        {
            icon: TrendingUp,
            title: 'İlerleme Takibi',
            description: 'XP kazan, seviye atla ve gelişimini izle'
        },
        {
            icon: Award,
            title: 'Başarılar',
            description: 'Yolculuğunda kilometre taşlarını kutla'
        },
        {
            icon: Shield,
            title: 'Güvenli Ortam',
            description: 'Deneyimlerini güvenle paylaş ve keşfet'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-neutral-200 z-40">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-semibold text-lg">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                            K
                        </div>
                        KOZA
                    </div>
                    {firebaseEnabled && (
                        <button
                            onClick={handleSignIn}
                            disabled={isSigningIn}
                            className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors disabled:opacity-50"
                        >
                            {isSigningIn ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                        </button>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6 animate-fade-in">
                        <Sparkles size={16} />
                        AI Destekli Dönüşüm Platformu
                    </div>

                    <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-balance animate-slide-up">
                        Deneyimlerini
                        <span className="text-primary-600"> Güce </span>
                        Dönüştür
                    </h1>

                    <p className="text-xl text-neutral-600 mb-10 max-w-2xl mx-auto text-balance animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        KOZA ile yaşadığın zorlukları anlamlı hikayelere ve interaktif oyunlara dönüştür.
                        Her deneyim, bir öğrenme ve büyüme fırsatıdır.
                    </p>

                    {firebaseEnabled ? (
                        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            {error && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 max-w-md mx-auto">
                                    <AlertCircle size={20} />
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            <button
                                onClick={handleSignIn}
                                disabled={isSigningIn}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-neutral-200 rounded-lg font-semibold text-lg hover:border-primary-300 hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSigningIn ? (
                                    <>
                                        <Loader2 size={24} className="animate-spin" />
                                        Giriş yapılıyor...
                                    </>
                                ) : (
                                    <>
                                        <svg width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Google ile Başla
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg max-w-md mx-auto">
                            <AlertCircle size={24} className="mx-auto mb-3 text-amber-600" />
                            <p className="text-sm text-amber-800">
                                Firebase yapılandırması bulunamadı. Lütfen .env dosyasını yapılandırın.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Neden KOZA?
                        </h2>
                        <p className="text-lg text-neutral-600">
                            Dönüşüm yolculuğunda sana eşlik edecek güçlü özellikler
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="p-6 rounded-2xl border border-neutral-200 hover:border-primary-300 hover:shadow-lg transition-all"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                                        <Icon size={24} className="text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-neutral-600">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                        Dönüşüm Yolculuğuna Başla
                    </h2>
                    <p className="text-lg text-neutral-600 mb-10">
                        Her zorluk, bir fırsat. Her deneyim, bir hikaye.
                    </p>

                    {firebaseEnabled && (
                        <button
                            onClick={handleSignIn}
                            disabled={isSigningIn}
                            className="px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSigningIn ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 size={20} className="animate-spin" />
                                    Giriş yapılıyor...
                                </span>
                            ) : (
                                'Hemen Başla'
                            )}
                        </button>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-neutral-200 bg-white">
                <div className="max-w-6xl mx-auto text-center text-sm text-neutral-600">
                    <p>© 2024 KOZA. Tüm hakları saklıdır.</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
