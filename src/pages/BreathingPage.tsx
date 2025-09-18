import React, { useState, useEffect, useMemo } from 'react';
import PageTitle from '../components/PageTitle';
import { useTranslation } from '../context/LanguageContext';

const BreathingPage: React.FC = () => {
    const { t } = useTranslation();
    const cycle = useMemo(() => [
        { text: t('breathing.breatheIn'), duration: 4000 },
        { text: t('breathing.hold'), duration: 4000 },
        { text: t('breathing.breatheOut'), duration: 4000 },
        { text: t('breathing.hold'), duration: 4000 },
    ], [t]);

    const [instruction, setInstruction] = useState(t('breathing.getReady'));
    const [isAnimating, setIsAnimating] = useState(false);
    const [key, setKey] = useState(0);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (isAnimating) {
            let currentStep = 0;
            const runCycle = () => {
                setInstruction(cycle[currentStep].text);
                timer = setTimeout(() => {
                    currentStep = (currentStep + 1) % cycle.length;
                    runCycle();
                }, cycle[currentStep].duration);
            };
            runCycle();
        } else {
            setInstruction(t('breathing.getReady'));
        }

        return () => clearTimeout(timer);
    }, [isAnimating, cycle, t]);

    const handleButtonClick = () => {
        setIsAnimating(prev => !prev);
        setKey(prev => prev + 1); // Reset animation
    };

    return (
        <div className="flex flex-col items-center">
            <PageTitle title={t('breathing.title')} subtitle={t('breathing.subtitle')} />

            <div className="w-80 h-80 bg-white rounded-full flex items-center justify-center shadow-2xl relative">
                {isAnimating && (
                    <div
                        key={key}
                        className={`absolute w-full h-full bg-blue-300/50 rounded-full ${instruction === t('breathing.breatheIn') ? 'animate-[scaleUp_4s_ease-in-out_infinite]' : ''} ${instruction === t('breathing.breatheOut') ? 'animate-[scaleDown_4s_ease-in-out_infinite]' : ''}`}
                        style={{ animationIterationCount: 'infinite' }}
                    ></div>
                )}
                 <style>
                    {`
                        @keyframes scaleUp {
                            0% { transform: scale(0.1); opacity: 0.8; }
                            100% { transform: scale(1); opacity: 0; }
                        }
                        @keyframes scaleDown {
                            0% { transform: scale(1); opacity: 0; }
                            100% { transform: scale(0.1); opacity: 0.8; }
                        }
                    `}
                </style>
                <div className="z-10 text-center">
                    <p className="text-3xl font-semibold text-blue-700">{instruction}</p>
                </div>
            </div>

            <button
                onClick={handleButtonClick}
                className="mt-10 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
                {isAnimating ? t('breathing.stop') : t('breathing.start')}
            </button>
        </div>
    );
};

export default BreathingPage;