import React, { useState, useEffect } from 'react';
import PageTitle from '../components/PageTitle';

const cycle = [
    { text: 'Breathe In', duration: 4000 },
    { text: 'Hold', duration: 4000 },
    { text: 'Breathe Out', duration: 4000 },
    { text: 'Hold', duration: 4000 },
];

const BreathingPage: React.FC = () => {
    const [instruction, setInstruction] = useState('Get ready...');
    const [isAnimating, setIsAnimating] = useState(false);
    const [key, setKey] = useState(0);

    useEffect(() => {
        // Fix: Use ReturnType<typeof setTimeout> for the correct timer type in a browser environment.
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
            setInstruction('Get ready...');
        }

        return () => clearTimeout(timer);
    }, [isAnimating]);

    const handleButtonClick = () => {
        setIsAnimating(prev => !prev);
        setKey(prev => prev + 1); // Reset animation
    };

    return (
        <div className="flex flex-col items-center">
            <PageTitle title="Mindful Breathing" subtitle="Follow the guide to calm your mind and body." />

            <div className="w-80 h-80 bg-white rounded-full flex items-center justify-center shadow-lg relative">
                {isAnimating && (
                    <div
                        key={key}
                        className={`absolute w-full h-full bg-blue-300 rounded-full ${instruction === 'Breathe In' ? 'animate-[scaleUp_4s_ease-in-out_infinite]' : ''} ${instruction === 'Breathe Out' ? 'animate-[scaleDown_4s_ease-in-out_infinite]' : ''}`}
                        style={{ animationIterationCount: 'infinite' }}
                    ></div>
                )}
                 <style>
                    {`
                        @keyframes scaleUp {
                            0% { transform: scale(0.1); opacity: 0.5; }
                            100% { transform: scale(1); opacity: 0; }
                        }
                        @keyframes scaleDown {
                            0% { transform: scale(1); opacity: 0; }
                            100% { transform: scale(0.1); opacity: 0.5; }
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
                {isAnimating ? 'Stop Session' : 'Start Session'}
            </button>
        </div>
    );
};

export default BreathingPage;