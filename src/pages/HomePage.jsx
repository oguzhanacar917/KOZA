import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, ArrowRight, Github, Twitter, MessageSquare, Globe, Zap, Heart, Shield } from 'lucide-react';
import TransformationCanvas from '../components/cocoon/TransformationCanvas';

const HomePage = () => {
    const { signInWithGoogle, firebaseEnabled } = useAuth();
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [error, setError] = useState(null);

    const handleSignIn = async () => {
        setIsSigningIn(true);
        setError(null);
        try {
            const result = await signInWithGoogle();
            if (!result.success) {
                setError(result.error);
            }
        } catch (err) {
            setError("Giriş yapılırken bir hata oluştu.");
        } finally {
            setIsSigningIn(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#05070a] text-white font-sans selection:bg-neon-purple/30 selection:text-white overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0">
                <TransformationCanvas color="#d946ef" intensity={0.2} />
                <div className="absolute inset-0 bg-radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 80%)" />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-heading font-extrabold tracking-tighter italic text-white">KOZA</span>
                    </div>

                    <div className="hidden md:flex items-center gap-10">
                        <a href="#hikayeler" className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">Hikayeler</a>
                        <a href="#akademi" className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">Akademi</a>
                        <a href="#topluluk" className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">Topluluk</a>
                        <a href="#iletisim" className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">İletişim</a>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex items-center gap-4 text-white/40">
                            <Github size={18} className="hover:text-white cursor-pointer" />
                            <Twitter size={18} className="hover:text-white cursor-pointer" />
                            <MessageSquare size={18} className="hover:text-white cursor-pointer" />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 pt-44 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center min-h-screen">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h1 className="text-5xl md:text-8xl font-heading font-extrabold mb-8 leading-tight tracking-tight">
                        <span className="block">Zorbalığa Karşı</span>
                        <span className="text-gradient-purple-blue">Çık!</span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed mb-12">
                        Zorbalığa karşı verdiğin mücadelede yalnız değilsin. <br className="hidden md:block" />
                        Kozandan çık ve kendi gücünü keşfet! 
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={handleSignIn}
                            disabled={isSigningIn}
                            className="group relative flex items-center justify-center gap-3 px-10 py-4 bg-white text-black rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-glow-purple disabled:opacity-70"
                        >
                            {isSigningIn ? <Loader2 size={20} className="animate-spin" /> : 'Yolculuğa Başla'}
                            {!isSigningIn && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                        </button>

                        <button className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full font-bold border border-white/10 transition-all backdrop-blur-md">
                            Öz Birikimi
                        </button>
                    </div>
                </div>

                {/* Futuristic Visual / Robot Element Mock */}
                <div className="w-full max-w-5xl relative mt-12 animate-float">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-transparent z-10" />

                    {/* Infinity Visual with CSS */}
                    <div className="relative h-[400px] flex items-center justify-center">
                        <div className="absolute w-full h-full bg-radial-gradient(ellipse at center, rgba(217, 70, 239, 0.1) 0%, transparent 70%)" />

                        {/* Infinity Shape Concept */}
                        <div className="relative w-80 h-40">
                            <div className="absolute inset-0 border-[12px] border-neon-purple/20 rounded-[100px] rotate-[-20deg] blur-sm animate-pulse" />
                            <div className="absolute inset-0 border-[2px] border-neon-purple rounded-[100px] rotate-[-20deg] shadow-[0_0_30px_rgba(217,70,239,0.5)]" />

                            <div className="absolute top-0 right-[-60px] w-80 h-40 border-[12px] border-neon-blue/20 rounded-[100px] rotate-[20deg] blur-sm animate-pulse delay-75" />
                            <div className="absolute top-0 right-[-60px] w-80 h-40 border-[2px] border-neon-blue rounded-[100px] rotate-[20deg] shadow-[0_0_30px_rgba(59,130,246,0.5)]" />
                        </div>

                        {/* Floating Tech Dots */}
                        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-neon-purple rounded-full animate-ping" />
                        <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-neon-blue rounded-full animate-ping delay-500" />
                        <div className="absolute top-1/2 right-10 w-2 h-2 bg-neon-cyan rounded-full animate-ping delay-1000" />
                    </div>

                    {/* Feature Cards in futuristic style */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20 -mt-20">
                        <div className="p-8 bg-glass-dark rounded-3xl group hover:border-neon-purple/50 transition-all">
                            <div className="w-12 h-12 bg-neon-purple/10 rounded-xl flex items-center justify-center mb-6 text-neon-purple">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-xl font-heading font-bold mb-3">Hikayeler</h3>
                            <p className="text-white/40 text-sm leading-relaxed">Olumsuzlukları güce dönüştüren her gün yeni bir hikaye.</p>
                        </div>
                        <div className="p-8 bg-glass-dark rounded-3xl group hover:border-neon-blue/50 transition-all">
                            <div className="w-12 h-12 bg-neon-blue/10 rounded-xl flex items-center justify-center mb-6 text-neon-blue">
                                <Heart size={24} />
                            </div>
                            <h3 className="text-xl font-heading font-bold mb-3">Topluluk</h3>
                            <p className="text-white/40 text-sm leading-relaxed">Seninle aynı yoldan geçen binlerce kişiyle beraber.</p>
                        </div>
                        <div className="p-8 bg-glass-dark rounded-3xl group hover:border-neon-cyan/50 transition-all">
                            <div className="w-12 h-12 bg-neon-cyan/10 rounded-xl flex items-center justify-center mb-6 text-neon-cyan">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-xl font-heading font-bold mb-3">Güven</h3>
                            <p className="text-white/40 text-sm leading-relaxed">Verilerin uçtan uca şifreli ve tamamen güvende.</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Error Toast */}
            {error && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-2xl shadow-glow-purple z-[100] animate-slide-up flex items-center gap-3 backdrop-blur-xl border border-white/20">
                    <span className="font-bold">Sistem Hatası:</span>
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="ml-4 hover:opacity-50">✕</button>
                </div>
            )}

            {/* Futuristic Footer */}
            <footer className="py-20 border-t border-white/5 relative z-10 bg-black/40">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4 text-white/20 text-xs font-bold tracking-[0.3em] uppercase">
                        KOZA DESIGN SYSTEMS © 2026
                    </div>
                    <div className="flex items-center gap-8 text-white/40 text-[10px] font-bold tracking-widest uppercase">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Security</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
