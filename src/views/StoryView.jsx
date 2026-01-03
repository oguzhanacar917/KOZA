import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, BookOpen, Check } from 'lucide-react';
import TransformationCanvas from '../components/cocoon/TransformationCanvas';
import GalaxyButton from '../components/galaxy/GalaxyButton';
import GalaxyProgress from '../components/galaxy/GalaxyProgress';
import GalaxyToast from '../components/galaxy/GalaxyToast';

const StoryView = ({ story, onClose }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const pages = story.pages || [];
    const totalPages = pages.length;
    const themeColor = story.themeColor || '#9333EA';

    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 0));

    if (!pages.length) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <button onClick={onClose} className="mb-4 text-neutral-600 hover:text-neutral-900">
                    ← Geri
                </button>
                <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
                    <p className="text-neutral-600">Hikaye yüklenemedi</p>
                </div>
            </div>
        );
    }

    const currentPageData = pages[currentPage];
    const progressValue = ((currentPage + 1) / totalPages) * 100;

    return (
        <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden" style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, ${themeColor}11 0%, transparent 80%)`
        }}>
            {/* Background Particles */}
            <TransformationCanvas color={themeColor} intensity={0.5} />

            {/* Header */}
            <div className="fixed top-0 left-0 right-0 bg-neutral-950/40 backdrop-blur-md border-b border-white/5 z-50 transition-all duration-300">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex flex-col items-center">
                        <div className="text-xs font-medium tracking-widest text-neutral-400 mb-1">
                            SAYFA {currentPage + 1} / {totalPages}
                        </div>
                        <div className="w-32">
                            <GalaxyProgress value={progressValue} size="small" />
                        </div>
                    </div>

                    <div className="w-10"></div> {/* Spacer for center alignment */}
                </div>
            </div>

            {/* Story Content */}
            <div className="pt-24 min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
                <div className="max-w-2xl w-full">
                    <div className="animate-fade-in transition-all duration-700">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-8 text-balance text-center drop-shadow-lg" style={{ color: themeColor }}>
                            {currentPageData.title}
                        </h2>

                        <div className="bg-neutral-900/40 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl">
                            <div className="prose prose-invert prose-xl max-w-none">
                                <p className="text-neutral-100 leading-relaxed text-balance text-center font-serif text-lg opacity-90 first-letter:text-5xl first-letter:font-serif first-letter:mr-1 first-letter:float-left first-letter:text-white">
                                    {currentPageData.content}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="mt-12 flex items-center justify-between pointer-events-auto">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 0}
                            className="p-4 bg-white/5 hover:bg-white/10 rounded-full disabled:opacity-0 disabled:cursor-default transition-all border border-white/10 text-white hover:scale-110 active:scale-95"
                        >
                            <ChevronLeft size={28} />
                        </button>

                        <div className="flex gap-2">
                            {pages.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i)}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${i === currentPage
                                        ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]'
                                        : 'w-1.5 bg-white/20 hover:bg-white/40'
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages - 1}
                            className="p-4 bg-white/5 hover:bg-white/10 rounded-full disabled:opacity-0 disabled:cursor-default transition-all border border-white/10 text-white hover:scale-110 active:scale-95"
                        >
                            <ChevronRight size={28} />
                        </button>
                    </div>

                    {currentPage === totalPages - 1 && (
                        <div className="mt-12 text-center animate-fade-in-up">
                            <GalaxyButton
                                onClick={onClose}
                                className="!py-4 !px-12 !text-lg !rounded-full shadow-[0_0_30px_rgba(147,51,234,0.3)] hover:shadow-[0_0_50px_rgba(147,51,234,0.5)]"
                                icon={Check}
                            >
                                Metamorfozu Tamamla
                            </GalaxyButton>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoryView;
