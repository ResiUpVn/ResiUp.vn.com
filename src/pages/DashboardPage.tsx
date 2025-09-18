import React from 'react';
import PageTitle from '../components/PageTitle';
import useLocalStorage from '../hooks/useLocalStorage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { DailyChallenge, JournalEntry, TestResult } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [challenges] = useLocalStorage<DailyChallenge[]>(`dailyChallenges_${user?.email ?? 'guest'}`, []);
    const [journalEntries] = useLocalStorage<JournalEntry[]>(`journalEntries_${user?.email ?? 'guest'}`, []);
    const [testResults] = useLocalStorage<TestResult[]>(`testResults_${user?.email ?? 'guest'}`, []);

    const completedChallenges = challenges.filter(c => c.completed).length;
    const totalChallenges = challenges.length;
    const latestTestResult = testResults.length > 0 ? testResults[0] : null;
    
    // Process journal entries for chart
    const journalData = journalEntries
        .reduce((acc, entry) => {
            const date = new Date(entry.id).toLocaleDateString('en-CA'); // YYYY-MM-DD
            const found = acc.find(d => d.date === date);
            if (found) {
                found.count += 1;
            } else {
                acc.push({ date, count: 1 });
            }
            return acc;
        }, [] as {date: string; count: number}[])
        .slice(0, 7) // Last 7 days
        .reverse();

    const pieData = [
        { name: t('dashboard.completed'), value: completedChallenges },
        { name: t('dashboard.missed'), value: Math.max(0, totalChallenges - completedChallenges) },
    ];
    const COLORS = ['#2563eb', '#e2e8f0'];

    const getSeverity = (scale: 'depression' | 'anxiety' | 'stress', score: number) => {
        const severities = t(`tests.dass21.severity.${scale}`, { returnObjects: true }) as { level: string, range: [number, number], color: string }[];
        const result = severities.find(s => score >= s.range[0] && score <= s.range[1]);
        return result || { level: t('tests.dass21.severity.unknown'), color: 'bg-slate-400' };
    };

    return (
        <div>
            <PageTitle title={t('dashboard.title')} subtitle={t('dashboard.subtitle')} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md text-center border border-slate-200/80">
                    <h3 className="text-lg font-semibold text-slate-500">{t('dashboard.completedChallenges')}</h3>
                    <p className="text-5xl font-bold text-blue-600 mt-2">{completedChallenges}</p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md text-center border border-slate-200/80">
                     <h3 className="text-lg font-semibold text-slate-500">{t('dashboard.journalEntries')}</h3>
                    <p className="text-5xl font-bold text-indigo-600 mt-2">{journalEntries.length}</p>
                </div>
                 <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md text-center border border-slate-200/80">
                     <h3 className="text-lg font-semibold text-slate-500">{t('dashboard.currentStreak')}</h3>
                    <p className="text-5xl font-bold text-amber-600 mt-2">0 <span className="text-2xl">{t('dashboard.days')}</span></p>
                </div>
            </div>
            
            {latestTestResult && (
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md border border-slate-200/80 mb-8">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">{t('dashboard.latestTestResult')} ({new Date(latestTestResult.date).toLocaleDateString()})</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-center">
                        {(Object.keys(latestTestResult.scores) as Array<keyof typeof latestTestResult.scores>).map(key => {
                            const score = latestTestResult.scores[key];
                            const { level, color } = getSeverity(key, score);
                            return (
                                <div key={key} className="p-4 bg-slate-50 rounded-lg">
                                    <h4 className="font-semibold text-slate-600 capitalize">{t(`tests.results.${key}`)}</h4>
                                    <p className="text-3xl font-bold text-slate-800 my-1">{score}</p>
                                    <span className={`px-2 py-0.5 text-xs font-semibold text-white rounded-full ${color}`}>{level}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md border border-slate-200/80">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">{t('dashboard.journalChartTitle')}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={journalData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#4f46e5" name={t('dashboard.entries')} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md flex flex-col items-center border border-slate-200/80">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">{t('dashboard.challengeChartTitle')}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(Number(percent || 0) * 100).toFixed(0)}%`}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                             <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;