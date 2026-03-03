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
import GalaxyGrid from '../components/galaxy/GalaxyGrid';
import GalaxyStat from '../components/galaxy/GalaxyStat';
import KozaLoader from '../components/ui/KozaLoader';

// Memoized Sub-Components for Scale
const CreateHeader = memo(() => (
    <div className="text-center mb-16 px-4">
        <div className="galaxy-badge primary mb-6 group cursor-default border-neutral-800 bg-neutral-900/50 text-neutral-300">
            <Zap size={14} className="text-amber-500" />
            <span>Sovereign Cognitive Auditing</span>
        </div>
        <h1 className="text-6xl font-black mb-4 tracking-tight uppercase text-neutral-900">
            Deneyimi Yapılandır
        </h1>
        <p className="text-neutral-500 text-lg font-medium max-w-xl mx-auto leading-relaxed border-l-2 border-neutral-200 pl-6 text-left">
            Karmaşık anlatıları eyleme geçirilebilir sinyallere dönüştürün. Karmaşayı en aza indirin.
        </p>
    </div>
));

const StatsSection = memo(({ user }) => {
    const entropyScore = ClarityService.getEntropyReductionScore(user);

    return (
        <div className="mt-20 border-t border-neutral-200 pt-12">
            <GalaxyGrid cols={3}>
                <GalaxyStat icon={BookOpen} label="Yapılandırılmış Anlatılar" value={user?.storiesCreated || 0} />
                <GalaxyStat icon={Zap} label="Netlik Endeksi" value={user?.xp || 0} />
                <GalaxyStat icon={BarChart3} label="Azaltılmış Karmaşa" value={`${entropyScore}%`} />
            </GalaxyGrid>
        </div>
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

    const handleGenerate = useCallback(async () => {
        if (!activeStory.trim() || isProcessing) return;
        setError(null);
        setIsProcessing(true);
        setStage('Anlatı vektörleri çözümleniyor...');

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
            awardXP(clarityGain, creationMode === 'story' ? 'Anlatı yapılandırıldı' : 'Mantık simülasyonu oluşturuldu');
            addToast('success', 'Netlik Arttı', `+${clarityGain} Netlik Endeksi`);
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

    return (
        <GalaxyContainer className="py-8">
            <CreateHeader />

            <div className="max-w-2xl mx-auto">
                {!analysisResult ? (
                    <div className="space-y-8">
                        <div className="flex justify-center">
                            <GalaxyTabs
                                activeTab={creationMode}
                                onChange={setCreationMode}
                                tabs={[
                                    { id: 'story', label: 'Yapısal Denetim', icon: BookOpen },
                                    { id: 'game', label: 'Mantık Simülasyonu', icon: Gamepad2 }
                                ]}
                            />
                        </div>

                        <div className="animate-slide-up">
                            <GalaxyTextarea
                                value={activeStory}
                                onChange={setActiveStory}
                                placeholder={creationMode === 'story' ? "Yapısal çözümleme için ham anlatı verilerini girin..." : "Mantık simülasyonu için bilişsel zorlukları girin..."}
                                disabled={isProcessing}
                                minHeight="150px"
                            />

                            <div className="mt-6 flex justify-end">
                                <GalaxyButton
                                    onClick={handleGenerate}
                                    disabled={!activeStory.trim() || isProcessing}
                                    icon={Sparkles}
                                    variant="primary"
                                >
                                    {creationMode === 'story' ? 'Yapılandırmayı Başlat' : 'Simülasyon Oluştur'}
                                </GalaxyButton>
                            </div>
                        </div>

                        {error && isAdmin && (
                            <GalaxyAlert type="error" title="Giriş Hatası">
                                {error}
                            </GalaxyAlert>
                        )}

                        {isProcessing && (
                            <div className="mt-12 animate-fade-in flex flex-col items-center gap-4">
                                <KozaLoader size="large" message={stage} />
                            </div>
                        )}

                        <div className="mt-8 p-4 bg-neutral-50/50 rounded-xl border border-neutral-100/50 text-center">
                            <p className="text-xs text-neutral-400 font-medium italic">
                                🔔 {SAFETY_DISCLAIMER}
                            </p>
                        </div>
                    </div>
                ) : (
                    <GalaxyCard
                        className="text-center"
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
                                Yeni Vektör İşle
                            </GalaxyButton>
                        </div>
                    </GalaxyCard>
                )}
            </div>

            <StatsSection user={user} />
        </GalaxyContainer>
    );
};

export default memo(CreateTab);
