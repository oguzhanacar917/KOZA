'use client';
import React, { useState, useMemo, useCallback, memo } from 'react';
import { useUser } from '../context/UserContext';
import { useStory } from '../context/StoryContext';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import { NarrativeDomain } from '../domain/narrativeDomain';
import { SAFETY_DISCLAIMER } from '../utils/safety';
import { Sparkles, BookOpen, Gamepad2, AlertCircle, Zap, Star, GamepadIcon, HeadphonesIcon, BarChart3 } from 'lucide-react';

import { ClarityService } from '../services/ClarityService';
import GalaxyContainer from '../components/galaxy/GalaxyContainer';
import GalaxyTabs from '../components/galaxy/GalaxyTabs';
import GalaxyTextarea from '../components/galaxy/GalaxyTextarea';
import GalaxyButton from '../components/galaxy/GalaxyButton';
import GalaxyAlert from '../components/galaxy/GalaxyAlert';
import GalaxyCard from '../components/galaxy/GalaxyCard';
import GalaxyStat from '../components/galaxy/GalaxyStat';
import { GalaxyBox, GalaxyFlex, GalaxyStack, GalaxyGrid, GalaxyCenter } from '../components/galaxy/GalaxyLayout';
import KozaLoader from '../components/ui/KozaLoader';

// Memoized Sub-Components for Scale
const StatsSection = memo(({ user }) => {
    const entropyScore = ClarityService.getEntropyReductionScore(user);

    return (
        <GalaxyStack spacing={12} className="mt-20 border-t border-neutral-200 pt-12">
            <GalaxyGrid templateColumns="repeat(3, 1fr)" gap={6}>
                <GalaxyStat icon={BookOpen} label="Tamamlanan Hikayeler" value={user?.storiesCreated || 0} />
                <GalaxyStat icon={Zap} label="Gelişim Puanı" value={user?.xp || 0} />
                <GalaxyStat icon={BarChart3} label="Dönüşüm Oranı" value={`${entropyScore}%`} />
            </GalaxyGrid>
        </GalaxyStack>
    );
});

const CreateTab = () => {
    const { user, awardXP } = useUser();
    const {
        activeStory, setActiveStory,
        isProcessing, setIsProcessing,
        analysisResult, setAnalysisResult,
        saveStory
    } = useStory();
    const { setCurrentView, addToast } = useUI();
    const { isAdmin } = useAuth();

    const [stage, setStage] = useState('');
    const [error, setError] = useState(null);
    const [creationMode, setCreationMode] = useState('story');

    const entropyScore = ClarityService.getEntropyReductionScore(user);

    const handleGenerate = useCallback(async () => {
        if (!activeStory.trim() || isProcessing) return;
        setError(null);
        setIsProcessing(true);
        setStage('Hikayeniz işleniyor...');

        try {
            const result = await NarrativeDomain.processNarrativeRequest(activeStory, creationMode);
            if (result.isSafetyTriggered) {
                setError(result.message);
                if (isAdmin) addToast('warning', 'Safety Warning', 'Your input was flagged by our safety filters.');
                return;
            }

            const { data } = result;
            setAnalysisResult({ type: creationMode, category: data.title, data });
            saveStory(data);

            const clarityGain = ClarityService.calculateClarityGain(activeStory, data);
            awardXP(clarityGain, creationMode === 'story' ? 'Hikaye tamamlandı' : 'Oyun oluşturuldu');
            addToast('success', 'Gelişim Kaydedildi', `+${clarityGain} Gelişim Puanı`);
        } catch (error) {
            console.error('Generation failed:', error);
            setError(error.message || 'An error occurred. Please try again.');
            if (isAdmin) addToast('error', 'Error', error.message || 'Creation failed');
        } finally {
            setIsProcessing(false);
            setStage('');
        }
    }, [activeStory, creationMode, isProcessing, isAdmin, setIsProcessing, setAnalysisResult, saveStory, awardXP, addToast]);

    const viewResult = useCallback(() => {
        if (analysisResult) {
            setCurrentView({ type: analysisResult.type, data: analysisResult.data });
            setActiveStory('');
            setAnalysisResult(null);
        }
    }, [analysisResult, setCurrentView, setActiveStory, setAnalysisResult]);

    if (analysisResult) {
        return (
            <GalaxyContainer className="py-12">
                <GalaxyCard
                    className="text-center max-w-xl mx-auto"
                    title={analysisResult.category}
                    subtitle={analysisResult.type === 'story' ? 'Hikaye Hazır' : 'Oyun Hazır'}
                    emoji={analysisResult.type === 'story' ? '📖' : '🎮'}
                >
                    <p className="text-neutral-500 text-lg mb-10">
                        {analysisResult.type === 'story'
                            ? 'Deneyiminiz artık moral verici bir hikaye.'
                            : 'Zorluğunuz artık heyecan verici bir oyun.'}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <GalaxyButton onClick={viewResult}>
                            {analysisResult.type === 'story' ? 'Hikayeyi Oku' : 'Oyunu Oyna'}
                        </GalaxyButton>
                        <GalaxyButton
                            onClick={() => {
                                setAnalysisResult(null);
                                setActiveStory('');
                            }}
                            variant="secondary"
                        >
                            Yeni Hikaye Yaz
                        </GalaxyButton>
                    </div>
                </GalaxyCard>
            </GalaxyContainer>
        );
    }

    return (
        <GalaxyContainer className="py-10">
            {/* Two-column horizontal layout */}
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">

                {/* LEFT: Textarea — takes up most horizontal space */}
                <div className="flex-1 flex flex-col gap-4 animate-fade-in-up">
                    <GalaxyTextarea
                        value={activeStory}
                        onChange={setActiveStory}
                        placeholder={
                            creationMode === 'story'
                                ? "Yaşadıklarınızı anlatın, birlikte dönüştürelim..."
                                : "Karşılaştığınız engelleri yazın, bir oyuna çevirelim..."
                        }
                        disabled={isProcessing}
                        rows={14}
                    />

                    {isProcessing && (
                        <GalaxyCenter className="py-6 animate-fade-in">
                            <KozaLoader size="large" message={stage} />
                        </GalaxyCenter>
                    )}

                    {error && isAdmin && (
                        <GalaxyAlert type="error" title="Giriş Hatası">
                            {error}
                        </GalaxyAlert>
                    )}
                </div>

                {/* RIGHT: Mode selector + button + stats panel */}
                <div className="lg:w-72 flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '50ms' }}>

                    {/* Mode Tabs */}
                    <div>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3">Mod Seçimi</p>
                        <GalaxyTabs
                            activeTab={creationMode}
                            onChange={setCreationMode}
                            tabs={[
                                { id: 'story', label: 'Hikaye', icon: BookOpen },
                                { id: 'game', label: 'Oyun', icon: Gamepad2 }
                            ]}
                        />
                    </div>

                    {/* Generate Button */}
                    <GalaxyButton
                        onClick={handleGenerate}
                        disabled={!activeStory.trim() || isProcessing}
                        icon={Sparkles}
                        variant="magic"
                        className="w-full"
                    >
                        {creationMode === 'story' ? 'Hikayeyi Oluştur' : 'Oyunu Başlat'}
                    </GalaxyButton>

                    {/* Divider */}
                    <div className="border-t border-neutral-100" />

                    {/* Stats */}
                    <div>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-4">İstatistikler</p>
                        <GalaxyStack spacing={4}>
                            <GalaxyStat icon={BookOpen} label="Tamamlanan Hikayeler" value={user?.storiesCreated || 0} />
                            <GalaxyStat icon={Zap} label="Gelişim Puanı" value={user?.xp || 0} />
                            <GalaxyStat icon={BarChart3} label="Dönüşüm Oranı" value={`${entropyScore}%`} />
                        </GalaxyStack>
                    </div>

                    {/* Disclaimer */}
                    <div className="mt-auto p-4 bg-neutral-50/60 rounded-2xl border border-neutral-100/60 text-center">
                        <p className="text-[10px] text-neutral-400 font-medium italic leading-relaxed">
                            🔔 {SAFETY_DISCLAIMER}
                        </p>
                    </div>
                </div>
            </div>
        </GalaxyContainer>
    );
};

export default memo(CreateTab);
