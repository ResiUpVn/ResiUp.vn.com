import React from 'react';
import PageTitle from '../components/PageTitle';
import useLocalStorage from '../hooks/useLocalStorage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { DailyChallenge, JournalEntry } from '../types';
import { useAuth } from '../context/AuthContext';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [challenges] = useLocalStorage<DailyChallenge[]>(`dailyChallenges_${user?.email ?? 'guest'}`, []);
    const [journalEntries] = useLocalStorage<JournalEntry[]>(`journalEntries_${user?.email ?? 'guest'}`, []);

    const completedChallenges = challenges.filter(c => c.completed).length;
    const totalChallenges = challenges.length;
    
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
        { name: 'Completed', value: completedChallenges },
        { name: 'Missed', value: Math.max(0, totalChallenges - completedChallenges) },
    ];
    const COLORS = ['#14b8a6', '#f1f5f9'];

    return (
        <div>
            <PageTitle title="My Dashboard" subtitle="Track your progress and celebrate your growth." />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                    <h3 className="text-lg font-semibold text-gray-500">Completed Challenges</h3>
                    <p className="text-5xl font-bold text-teal-600 mt-2">{completedChallenges}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                     <h3 className="text-lg font-semibold text-gray-500">Journal Entries</h3>
                    <p className="text-5xl font-bold text-blue-600 mt-2">{journalEntries.length}</p>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                     <h3 className="text-lg font-semibold text-gray-500">Current Streak</h3>
                    <p className="text-5xl font-bold text-amber-600 mt-2">0 <span className="text-2xl">days</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Journal Entries (Last 7 Days)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={journalData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#3b82f6" name="Entries" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm flex flex-col items-center">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Challenge Completion</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                // FIX: The `percent` property from recharts can be undefined or non-numeric. It is explicitly converted to a number to prevent type errors during multiplication.
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
