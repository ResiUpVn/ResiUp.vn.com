import React, { useState } from 'react';
import PageTitle from '../components/PageTitle';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import type { TestResult } from '../types';

const TestsPage: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [testResults, setTestResults] = useLocalStorage<TestResult[]>(`testResults_${user?.email ?? 'guest'}`, []);
    
    const dass21Questions = t('tests.dass21.questions', { returnObjects: true }) as { text: string; scale: 'D' | 'A' | 'S' }[];
    const options = t('tests.dass21.options', { returnObjects: true }) as string[];

    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [showResults, setShowResults] = useState(false);
    const [error, setError] = useState('');

    const handleAnswerChange = (questionIndex: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: value }));
        setError('');
    };

    const calculateScores = () => {
        if (Object.keys(answers).length !== dass21Questions.length) {
            setError(t('tests.errors.incomplete'));
            return;
        }

        const scores = { depression: 0, anxiety: 0, stress: 0 };

        dass21Questions.forEach((q, index) => {
            const answerValue = answers[index];
            if (q.scale === 'D') scores.depression += answerValue;
            if (q.scale === 'A') scores.anxiety += answerValue;
            if (q.scale === 'S') scores.stress += answerValue;
        });
        
        // DASS-21 scores are multiplied by 2
        scores.depression *= 2;
        scores.anxiety *= 2;
        scores.stress *= 2;

        const newResult: TestResult = {
            date: new Date().toISOString(),
            scores,
        };
        setTestResults([newResult, ...testResults]);
        setShowResults(true);
        window.scrollTo(0, 0);
    };

    const getSeverity = (scale: 'depression' | 'anxiety' | 'stress', score: number) => {
        const severities = t(`tests.dass21.severity.${scale}`, { returnObjects: true }) as { level: string, range: [number, number], color: string }[];
        const result = severities.find(s => score >= s.range[0] && score <= s.range[1]);
        return result || { level: t('tests.dass21.severity.unknown'), color: 'bg-slate-400' };
    };

    const handleRetake = () => {
        setAnswers({});
        setShowResults(false);
        setError('');
    };
    
    const lastResult = testResults[0];

    return (
        <div>
            <PageTitle title={t('tests.title')} subtitle={t('tests.subtitle')} />

            {!showResults && (
                <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-md border border-slate-200/80">
                    <h2 className="text-xl font-bold text-slate-800">{t('tests.dass21.title')}</h2>
                    <p className="mt-2 mb-6 text-slate-600">{t('tests.dass21.instruction')}</p>
                    
                    <div className="space-y-6">
                        {dass21Questions.map((q, index) => (
                            <div key={index} className="border-t pt-4">
                                <p className="font-semibold text-slate-700">{index + 1}. {q.text}</p>
                                <div className="flex flex-wrap gap-4 mt-3">
                                    {options.map((option, value) => (
                                        <label key={value} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name={`question-${index}`}
                                                checked={answers[index] === value}
                                                onChange={() => handleAnswerChange(index, value)}
                                                className="form-radio h-4 w-4 text-blue-600"
                                            />
                                            <span className="text-slate-600">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {error && <p className="mt-6 text-center text-red-600">{error}</p>}

                    <div className="mt-8 flex justify-center">
                        <button onClick={calculateScores} className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                            {t('tests.viewResults')}
                        </button>
                    </div>
                </div>
            )}

            {showResults && lastResult && (
                 <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-md border border-slate-200/80">
                    <h2 className="text-2xl font-bold text-center text-slate-800">{t('tests.results.title')}</h2>
                    <p className="text-center text-slate-500 mb-8">{t('tests.results.date', { date: new Date(lastResult.date).toLocaleString() })}</p>

                    <div className="grid md:grid-cols-3 gap-6 text-center">
                       {(Object.keys(lastResult.scores) as Array<keyof typeof lastResult.scores>).map(key => {
                           const score = lastResult.scores[key];
                           const { level, color } = getSeverity(key, score);
                           return (
                               <div key={key} className="p-6 bg-slate-50 rounded-lg">
                                   <h3 className="text-lg font-semibold text-slate-600 capitalize">{t(`tests.results.${key}`)}</h3>
                                   <p className="text-5xl font-bold text-slate-800 my-2">{score}</p>
                                   <span className={`px-3 py-1 text-sm font-semibold text-white rounded-full ${color}`}>
                                       {level}
                                   </span>
                               </div>
                           );
                       })}
                    </div>
                     <p className="mt-8 text-sm text-center text-slate-500">{t('tests.results.disclaimer')}</p>
                     <div className="mt-6 flex justify-center">
                        <button onClick={handleRetake} className="px-8 py-3 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 transition-colors">
                            {t('tests.retake')}
                        </button>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default TestsPage;