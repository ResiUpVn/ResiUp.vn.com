import React, { useState, useEffect } from 'react';
import PageTitle from '../components/PageTitle';
import useLocalStorage from '../hooks/useLocalStorage';
import type { DailyChallenge } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';

const DailyChallengePage: React.FC = () => {
    const { user } = useAuth();
    const { t, language } = useTranslation();
    const [challenges, setChallenges] = useLocalStorage<DailyChallenge[]>(`dailyChallenges_${user?.email ?? 'guest'}`, []);
    const [todaysChallenge, setTodaysChallenge] = useState<DailyChallenge | null>(null);

    const ALL_CHALLENGES = t('challenges.list', { returnObjects: true }) as string[];

    useEffect(() => {
        const getDayOfYear = (date: Date) => {
            const start = new Date(date.getFullYear(), 0, 0);
            const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
            const oneDay = 1000 * 60 * 60 * 24;
            return Math.floor(diff / oneDay);
        };

        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        
        let challengeForToday = challenges.find(c => c.date === todayString);

        if (!challengeForToday) {
            const dayOfYear = getDayOfYear(today);
            const challengeIndex = (dayOfYear + (user?.email?.length || 0)) % ALL_CHALLENGES.length;
            const newChallenge: DailyChallenge = {
                id: Date.now(),
                text: ALL_CHALLENGES[challengeIndex],
                completed: false,
                date: todayString
            };
            setChallenges(prev => [...prev.filter(c => c.date !== todayString), newChallenge]);
            challengeForToday = newChallenge;
        } else {
             const dayOfYear = getDayOfYear(today);
             const challengeIndex = (dayOfYear + (user?.email?.length || 0)) % ALL_CHALLENGES.length;
             challengeForToday.text = ALL_CHALLENGES[challengeIndex];
        }
        
        setTodaysChallenge(challengeForToday);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language, user?.email, setChallenges]);

    const handleToggleComplete = () => {
        if (!todaysChallenge) return;

        const updatedChallenge = { ...todaysChallenge, completed: !todaysChallenge.completed };
        
        setChallenges(prev => 
            prev.map(c => c.id === updatedChallenge.id ? updatedChallenge : c)
        );
        setTodaysChallenge(updatedChallenge);
    };

    return (
        <div>
            <PageTitle title={t('challenges.title')} subtitle={t('challenges.subtitle')} />

            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-md text-center border border-slate-200/80">
                <p className="text-slate-500 mb-4 text-sm font-medium uppercase tracking-wider">{t('challenges.todaysFocus')}</p>
                <p className="text-2xl font-semibold text-slate-800 mb-6 min-h-[64px] flex items-center justify-center">
                    {todaysChallenge?.text || t('challenges.loading')}
                </p>
                {todaysChallenge && (
                    <button
                        onClick={handleToggleComplete}
                        className={`w-full max-w-xs px-6 py-3 font-semibold rounded-lg transition-all duration-300 ${
                            todaysChallenge.completed
                                ? 'bg-green-500 text-white shadow-lg hover:bg-green-600'
                                : 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
                        }`}
                    >
                        {todaysChallenge.completed ? t('challenges.completed') : t('challenges.markComplete')}
                    </button>
                )}
            </div>
        </div>
    );
};

export default DailyChallengePage;