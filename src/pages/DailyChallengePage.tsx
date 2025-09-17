// FIX: Replaced placeholder content with the correct component implementation to resolve module loading errors.
import React, { useState, useEffect } from 'react';
import PageTitle from '../components/PageTitle';
import useLocalStorage from '../hooks/useLocalStorage';
import type { DailyChallenge } from '../types';
import { useAuth } from '../context/AuthContext';

const ALL_CHALLENGES = [
  "Write down three things you're grateful for today.",
  "Spend 5 minutes doing a mindful breathing exercise.",
  "Go for a 15-minute walk outside and notice your surroundings.",
  "Reach out to a friend or family member you haven't spoken to in a while.",
  "Do one small act of kindness for someone else.",
  "Spend 10 minutes tidying up a small area of your space.",
  "Listen to a favorite uplifting song without distractions.",
  "Write down a short-term goal you want to accomplish this week.",
  "Try a 5-minute guided meditation.",
  "Stretch your body for 10 minutes.",
  "Drink a full glass of water as soon as you wake up.",
  "Read a chapter of a book.",
  "Avoid checking social media for the first hour of your day.",
  "Compliment a stranger or a colleague.",
  "Write down one thing you like about yourself.",
];

const getDayOfYear = (date: Date) => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
};

const DailyChallengePage: React.FC = () => {
    const { user } = useAuth();
    const [challenges, setChallenges] = useLocalStorage<DailyChallenge[]>(`dailyChallenges_${user?.email ?? 'guest'}`, []);
    const [todaysChallenge, setTodaysChallenge] = useState<DailyChallenge | null>(null);

    useEffect(() => {
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
            setChallenges(prev => [...prev, newChallenge]);
            challengeForToday = newChallenge;
        }
        
        setTodaysChallenge(challengeForToday);
    }, [challenges, setChallenges, user?.email]);

    const handleToggleComplete = () => {
        if (!todaysChallenge) return;

        const updatedChallenge = { ...todaysChallenge, completed: !todaysChallenge.completed };
        setTodaysChallenge(updatedChallenge);

        setChallenges(prev => 
            prev.map(c => c.id === updatedChallenge.id ? updatedChallenge : c)
        );
    };

    return (
        <div>
            <PageTitle title="Daily Challenge" subtitle="A small step each day towards a better you." />

            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <p className="text-gray-500 mb-4 text-sm font-medium uppercase tracking-wider">Today's Focus</p>
                <p className="text-2xl font-semibold text-gray-800 mb-6 min-h-[64px] flex items-center justify-center">
                    {todaysChallenge?.text || 'Loading challenge...'}
                </p>
                {todaysChallenge && (
                    <button
                        onClick={handleToggleComplete}
                        className={`w-full max-w-xs px-6 py-3 font-semibold rounded-lg transition-all duration-300 ${
                            todaysChallenge.completed
                                ? 'bg-green-500 text-white shadow-md hover:bg-green-600'
                                : 'bg-teal-600 text-white shadow-md hover:bg-teal-700'
                        }`}
                    >
                        {todaysChallenge.completed ? 'Completed!' : 'Mark as Complete'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default DailyChallengePage;