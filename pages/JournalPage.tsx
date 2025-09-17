import React, { useState } from 'react';
import PageTitle from '../components/PageTitle';
import useLocalStorage from '../hooks/useLocalStorage';
import type { JournalEntry } from '../types';
import { useAuth } from '../context/AuthContext';

const JournalPage: React.FC = () => {
    const { user } = useAuth();
    const [entries, setEntries] = useLocalStorage<JournalEntry[]>(`journalEntries_${user?.email ?? 'guest'}`, []);
    const [currentContent, setCurrentContent] = useState('');

    const handleSave = () => {
        if (currentContent.trim() === '') return;
        
        const newEntry: JournalEntry = {
            id: new Date().toISOString(),
            date: new Date().toDateString(),
            content: currentContent,
        };
        
        setEntries([newEntry, ...entries]);
        setCurrentContent('');
    };

    return (
        <div>
            <PageTitle title="My Journal" subtitle="A private space for your thoughts and feelings." />

            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Today's Entry</h3>
                <textarea
                    value={currentContent}
                    onChange={(e) => setCurrentContent(e.target.value)}
                    placeholder="What's on your mind...?"
                    className="w-full h-40 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                />
                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleSave}
                        disabled={!currentContent.trim()}
                        className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 disabled:bg-gray-400 transition-colors"
                    >
                        Save Entry
                    </button>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Past Entries</h3>
                <div className="space-y-4">
                    {entries.length > 0 ? (
                        entries.map(entry => (
                            <div key={entry.id} className="bg-white p-5 rounded-lg shadow-sm">
                                <p className="text-sm font-medium text-gray-500 mb-2">{entry.date}</p>
                                <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">You have no journal entries yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JournalPage;