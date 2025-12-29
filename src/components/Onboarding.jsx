import React from 'react';
import { Sparkles, Target, TrendingUp, Award } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
    const [step, setStep] = React.useState(0);

    const steps = [
        {
            icon: Sparkles,
            title: "KOZA'ya Hoş Geldin",
            description: "Deneyimlerini güçlendirici hikayelere ve oyunlara dönüştür. Her zorluk, bir dönüşüm fırsatıdır.",
            color: "primary"
        },
        {
            icon: Target,
            title: "Hikaye Oluştur",
            description: "Yaşadığın zorluğu anlat, AI destekli araçlarımız onu anlamlı bir hikayeye dönüştürsün.",
            color: "success"
        },
        {
            icon: TrendingUp,
            title: "Gelişimini İzle",
            description: "Her hikaye ve oyun ile XP kazan, seviye atla ve rozetler topla.",
            color: "warning"
        },
        {
            icon: Award,
            title: "Topluluğa Katıl",
            description: "Diğer kullanıcıların dönüşüm hikayelerini keşfet ve kendi deneyimlerini paylaş.",
            color: "error"
        }
    ];

    const currentStep = steps[step];
    const Icon = currentStep.icon;

    const colorMap = {
        primary: 'bg-primary-600',
        success: 'bg-green-600',
        warning: 'bg-amber-600',
        error: 'bg-red-600'
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 animate-fade-in">
                <div className={`w-16 h-16 ${colorMap[currentStep.color]} rounded-2xl flex items-center justify-center text-white mb-6 mx-auto`}>
                    <Icon size={32} />
                </div>

                <h2 className="text-2xl font-bold text-center mb-3">{currentStep.title}</h2>
                <p className="text-neutral-600 text-center mb-8">{currentStep.description}</p>

                <div className="flex gap-2 justify-center mb-6">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 rounded-full transition-all ${i === step ? 'w-8 bg-primary-600' : 'w-2 bg-neutral-200'
                                }`}
                        />
                    ))}
                </div>

                <div className="flex gap-3">
                    {step > 0 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="px-6 py-3 border border-neutral-200 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
                        >
                            Geri
                        </button>
                    )}
                    <button
                        onClick={() => {
                            if (step < steps.length - 1) {
                                setStep(step + 1);
                            } else {
                                localStorage.setItem('koza-onboarding-complete', 'true');
                                onComplete();
                            }
                        }}
                        className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                    >
                        {step < steps.length - 1 ? 'Devam' : 'Başla'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
