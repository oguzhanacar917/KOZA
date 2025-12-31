import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import TransformationCanvas from '../components/cocoon/TransformationCanvas';

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

    return (
        <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden" style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, ${themeColor}11 0%, transparent 80%)`
        }}>
            {/* Background Particles */}
            <TransformationCanvas color={themeColor} intensity={0.5} />

            {/* Header */}
            <div className="fixed top-0 left-0 right-0 bg-neutral-950/40 backdrop-blur-md border-b border-white/5 z-50">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="text-sm font-medium tracking-widest text-neutral-400">
                        SAYFA {currentPage + 1} / {totalPages}
                    </div>
                </div>
            </div>

            {/* Story Content */}
            <div className="pt-16 min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
                <div className="max-w-2xl w-full">
                    <div className="animate-fade-in transition-all duration-700">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-8 text-balance text-center" style={{ color: themeColor }}>
                            {currentPageData.title}
                        </h2>
                        <div className="prose prose-invert prose-xl max-w-none">
                            <p className="text-neutral-200 leading-relaxed text-balance text-center font-serif italic text-lg opacity-90">
                                {currentPageData.content}
                            </p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="mt-16 flex items-center justify-between">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 0}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-full disabled:opacity-20 disabled:cursor-not-allowed transition-all border border-white/10"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <div className="flex gap-3">
                            {pages.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i)}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${i === currentPage
                                        ? 'w-10'
                                        : 'w-2 opacity-30 hover:opacity-50'
                                        }`}
                                    style={{ backgroundColor: i === currentPage ? themeColor : 'white' }}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages - 1}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-full disabled:opacity-20 disabled:cursor-not-allowed transition-all border border-white/10"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    {currentPage === totalPages - 1 && (
                        <div className="mt-12 text-center">
                            <button
                                onClick={onClose}
                                className="px-10 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-2xl"
                                style={{ backgroundColor: themeColor }}
                            >
                                Metamorfozu Tamamla
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoryView;
