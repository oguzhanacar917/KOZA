import React, { useState, useEffect } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    X,
    Book,
    RotateCcw,
    RotateCw,
    Maximize2,
    Printer,
    Share2,
    Volume2,
    ChevronDown,
    Check,
    VolumeX
} from 'lucide-react';
import TransformationCanvas from '../components/cocoon/TransformationCanvas';
import GalaxyButton from '../components/galaxy/GalaxyButton';
import useAudioStory from '../hooks/useAudioStory';

const StoryView = ({ story, onClose }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const pages = story.pages || [];
    const totalPages = pages.length;
    const themeColor = story.themeColor || '#9333EA';
    const author = "KOZA GEZGİNİ"; // Default author if not in story meta

    const currentPageData = pages[currentPage];

    // Audio Hook
    const { toggle, isSpeaking, stop, supported } = useAudioStory(currentPageData?.content);

    // Stop audio when changing pages or closing
    useEffect(() => {
        stop();
    }, [currentPage, stop]);

    useEffect(() => {
        return () => stop();
    }, [stop]);

    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 0));

    if (!pages.length) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-8">
                <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center shadow-xl">
                    <p className="text-neutral-600 mb-6 font-medium">Hikaye yüklenemedi</p>
                    <button onClick={onClose} className="text-primary-600 hover:text-primary-700 font-bold">
                        ← Geri Dön
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f3f4f6] text-neutral-900 relative overflow-hidden flex flex-col font-sans">
            {/* Immersive Site Background showing through in margins */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <TransformationCanvas color={themeColor} intensity={0.3} />
            </div>

            {/* Premium Header */}
            <header className="h-16 bg-white border-b border-neutral-200 px-6 flex items-center justify-between z-50 shadow-sm shrink-0">
                <div className="flex items-center gap-4">
                    <Book size={20} className="text-neutral-400" />
                    <h1 className="font-bold text-neutral-800 text-sm tracking-tight truncate max-w-[200px]">
                        {story.title}
                    </h1>
                    <div className="flex items-center gap-1 ml-4 py-1 px-2 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer">
                        <RotateCcw size={16} className="text-neutral-400" />
                    </div>
                    <div className="flex items-center gap-1 py-1 px-2 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer">
                        <RotateCw size={16} className="text-neutral-400" />
                    </div>
                </div>

                {/* Page Navigation Center */}
                <div className="flex items-center gap-6">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 0}
                        className="p-2 hover:bg-neutral-50 rounded-lg disabled:opacity-20 transition-all text-neutral-600"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="text-xs font-bold tracking-widest text-neutral-500 tabular-nums">
                        {currentPage + 1} / {totalPages}
                    </div>
                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages - 1}
                        className="p-2 hover:bg-neutral-50 rounded-lg disabled:opacity-20 transition-all text-neutral-600"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2 border-r border-neutral-200">
                        <button className="p-2 hover:bg-neutral-50 rounded-lg text-neutral-400 hover:text-neutral-600">
                            <Maximize2 size={18} />
                        </button>
                        <button className="p-2 hover:bg-neutral-50 rounded-lg text-neutral-400 hover:text-neutral-600">
                            <Printer size={18} />
                        </button>
                        <button className="p-2 hover:bg-neutral-50 rounded-lg text-neutral-400 hover:text-neutral-600">
                            <Share2 size={18} />
                        </button>
                    </div>

                    <div className="flex items-center gap-1 ml-1">
                        <button
                            onClick={toggle}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all text-sm font-bold ${isSpeaking
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                                    : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                                }`}
                        >
                            {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                            <span>Dinle</span>
                        </button>
                        <button className="p-2 hover:bg-neutral-50 rounded-lg text-neutral-400">
                            <ChevronDown size={18} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg text-neutral-400 ml-2 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10 overflow-auto">
                <div className="w-full max-w-6xl aspect-[1.4/1] bg-white rounded-3xl book-depth flex relative overflow-hidden group">
                    {/* Spine Fold */}
                    <div className="book-spine" />

                    {/* Left Page: Illustration Area */}
                    <div className="flex-1 bg-neutral-100 relative overflow-hidden flex items-center justify-center">
                        {/* Placeholder for Story Illustration with spotlight effect */}
                        <div className="absolute inset-0 opacity-20" style={{ background: themeColor }} />
                        <div className="w-full h-full relative z-10 p-12 flex flex-col items-center justify-center">
                            <div className="w-64 h-64 rounded-full mix-blend-overlay blur-3xl opacity-50 absolute top-0 left-1/2 -translate-x-1/2" style={{ background: themeColor }} />

                            {/* The actual image or illustration placeholder */}
                            <div className="w-full h-full rounded-2xl border-4 border-white/50 shadow-2xl flex items-center justify-center bg-white/5 border-dashed overflow-hidden relative">
                                <div className="absolute inset-0 flex items-center justify-center transform rotate-12 scale-150 opacity-10">
                                    <Book size={200} />
                                </div>
                                <div className="relative z-10 text-center px-8">
                                    <div className="w-16 h-1 w-full max-w-xs mx-auto mb-4 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50" />
                                    <h4 className="text-xl font-bold opacity-30 italic text-neutral-400">
                                        {currentPageData.title}
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Page: Text Content */}
                    <div className="flex-1 paper-texture p-12 sm:p-20 flex flex-col relative">
                        {/* Author Tag */}
                        <div className="absolute top-10 right-12 text-[10px] sm:text-xs font-black tracking-[0.2em] text-neutral-400 uppercase">
                            {author}
                        </div>

                        {/* Content Container */}
                        <div className="flex-1 flex flex-col justify-center animate-fade-in py-12">
                            <div className="prose prose-slate prose-lg sm:prose-xl max-w-none">
                                <p className="text-neutral-800 leading-loose font-serif text-lg sm:text-xl md:text-2xl selection:bg-primary-100">
                                    {currentPageData.content}
                                </p>
                            </div>
                        </div>

                        {/* Page Number */}
                        <div className="absolute bottom-10 right-12 text-sm font-bold text-neutral-300 tabular-nums">
                            {currentPage + 1}
                        </div>
                    </div>

                    {/* Metamorphosis Completion (Last Page Overlay) */}
                    {currentPage === totalPages - 1 && (
                        <div className="absolute inset-0 z-40 bg-white/60 backdrop-blur-md flex items-center justify-center animate-fade-in">
                            <div className="text-center p-8 bg-white rounded-3xl shadow-2xl border border-neutral-100 scale-110">
                                <h3 className="text-2xl font-bold mb-4 text-primary-600">Harika Bir Yolculuktu!</h3>
                                <p className="text-neutral-600 mb-8 max-w-xs mx-auto font-medium">Bu hikaye metamorfozunu tamamladı. Yeni hikayeler seni bekliyor.</p>
                                <GalaxyButton
                                    onClick={onClose}
                                    className="!py-4 !px-12 !text-lg !rounded-full shadow-xl"
                                    icon={Check}
                                >
                                    Bitir ve Dön
                                </GalaxyButton>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Subtle Progress Trace at the very bottom */}
            <div className="h-1 bg-neutral-200 w-full shrink-0">
                <div
                    className="h-full bg-primary-500 transition-all duration-700 ease-out"
                    style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
                />
            </div>
        </div>
    );
};

export default StoryView;
