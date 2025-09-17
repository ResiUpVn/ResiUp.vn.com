import React from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import { HeartPulseIcon, WindIcon, FeatherIcon, BotIcon, MusicIcon, TestTubeIcon } from '../components/icons/Icons';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';

const HomePage: React.FC = () => {
    const { user } = useAuth();
    const { t } = useTranslation();

    const features = [
        { name: t('features.challenge.title'), icon: HeartPulseIcon, desc: t('features.challenge.desc'), link: '/challenges', color: 'bg-blue-100 text-blue-800' },
        { name: t('features.breathing.title'), icon: WindIcon, desc: t('features.breathing.desc'), link: '/breathing', color: 'bg-green-100 text-green-800' },
        { name: t('features.sounds.title'), icon: MusicIcon, desc: t('features.sounds.desc'), link: '/nature-sounds', color: 'bg-indigo-100 text-indigo-800' },
        { name: t('features.journal.title'), icon: FeatherIcon, desc: t('features.journal.desc'), link: '/journal', color: 'bg-yellow-100 text-yellow-800' },
        { name: t('features.chatbot.title'), icon: BotIcon, desc: t('features.chatbot.desc'), link: '/chatbot', color: 'bg-teal-100 text-teal-800' },
        { name: t('features.tests.title'), icon: TestTubeIcon, desc: t('features.tests.desc'), link: '/tests', color: 'bg-purple-100 text-purple-800' },
    ];

    const welcomeTitle = user ? `${t('home.welcomeBack')}, ${user.email.split('@')[0]}!` : t('home.welcome');

    return (
        <div>
            <PageTitle title={welcomeTitle} subtitle={t('home.subtitle')} />

            <div className="p-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white mb-10 shadow-lg">
                <h2 className="text-2xl font-bold">{t('home.quoteTitle')}</h2>
                <p className="mt-2 text-lg italic">{t('home.quoteText')}</p>
                <p className="mt-1 text-right font-medium">- Carl Rogers</p>
            </div>
            
            <h3 className="text-xl font-semibold text-slate-700 mb-4">{t('home.quickAccess')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map(feature => (
                    <Link to={feature.link} key={feature.name} className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-200/80">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${feature.color}`}>
                            <feature.icon className="w-6 h-6" />
                        </div>
                        <h4 className="mt-4 font-semibold text-lg text-slate-800">{feature.name}</h4>
                        <p className="mt-1 text-slate-500 text-sm">{feature.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default HomePage;