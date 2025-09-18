import React, { useState } from 'react';
import PageTitle from '../components/PageTitle';
import useLocalStorage from '../hooks/useLocalStorage';
import type { JournalEntry } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';

const JournalPage: React.FC = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
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
            <PageTitle title={t('journal.title')} subtitle={t('journal.subtitle')} />

            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md mb-8 border border-slate-200/80">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{t('journal.todaysEntry')}</h3>
                <textarea
                    value={currentContent}
                    onChange={(e) => setCurrentContent(e.target.value)}
                    placeholder={t('journal.placeholder')}
                    className="w-full h-40 p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white/50"
                />
                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleSave}
                        disabled={!currentContent.trim()}
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors"
                    >
                        {t('journal.save')}
                    </button>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">{t('journal.pastEntries')}</h3>
                <div className="space-y-4">
                    {entries.length > 0 ? (
                        entries.map(entry => (
                            <div key={entry.id} className="bg-white/70 backdrop-blur-sm p-5 rounded-xl shadow-md border border-slate-200/80">
                                <p className="text-sm font-medium text-slate-500 mb-2">{entry.date}</p>
                                <p className="text-slate-700 whitespace-pre-wrap">{entry.content}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-500">{t('journal.noEntries')}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JournalPage;