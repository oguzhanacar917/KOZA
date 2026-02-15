import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NarrativeDomain } from '../domain/narrativeDomain';
import { SAFETY_DISCLAIMER } from '../utils/safety';
import { Sparkles, BookOpen } from 'lucide-react';
import KozaLoader from '../components/ui/KozaLoader';

const CreateView = () => {
    const { activeStory, setActiveStory, isProcessing, setIsProcessing, setCurrentView, awardXP, saveStory } = useApp();
    const [stage, setStage] = useState('');

    const handleGenerate = async () => {
        if (!activeStory.trim() || isProcessing) return;

        setIsProcessing(true);
        setStage('Metamorfoz başlıyor...');

        try {
            const result = await NarrativeDomain.processNarrativeRequest(activeStory, 'story');

            if (result.isSafetyTriggered) {
                // In this view we'll just log or show a simple alert for now
                alert(result.message);
                return;
            }

            saveStory(result.data);
            awardXP(500, 'Hikaye oluşturuldu');
            setCurrentView({ type: 'story', data: result.data });
            setActiveStory('');
        } catch (error) {
            console.error('Generation failed:', error);
            setStage('');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-4">
                    <Sparkles size={16} />
                    AI Destekli Hikaye Oluşturma
                </div>
                <h1 className="text-4xl font-bold mb-3 text-balance">
                    Deneyimini Hikayeye Dönüştür
                </h1>
                <p className="text-neutral-600 text-lg text-balance">
                    Yaşadığın zorluğu anlat, AI ile güçlendirici bir hikayeye dönüştür
                </p>
            </div>

            <MessageBox
                value={activeStory}
                onChange={(val) => {
                    setActiveStory(val);
                }}
                onSend={handleGenerate}
                placeholder="Başına gelen bir zorbalık olayını anlat..."
                disabled={isProcessing}
            />

            {isProcessing && (
                <div className="mt-6 flex flex-col items-center gap-4">
                    <KozaLoader size="medium" message={stage} />
                </div>
            )}

            <div className="mt-4 p-3 bg-neutral-50/50 rounded-lg border border-neutral-100 text-center">
                <p className="text-[10px] text-neutral-400 font-medium">
                    ⚠️ {SAFETY_DISCLAIMER}
                </p>
            </div>

            <button
                onClick={handleGenerate}
                disabled={!activeStory.trim() || isProcessing}
                className="mt-4 w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
                <BookOpen size={20} />
                {isProcessing ? 'Oluşturuluyor...' : 'Hikaye Oluştur'}
            </button>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <GalaxyCard title="5" subtitle="Sayfa Hikaye" emoji="📖" />
                <GalaxyCard title="AI" subtitle="Destekli" emoji="🤖" />
                <GalaxyCard title="500" subtitle="XP Kazanç" emoji="💎" />
            </div>
        </div>
    );
};

export default CreateView;
