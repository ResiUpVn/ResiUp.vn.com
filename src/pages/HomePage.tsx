// FIX: Replaced placeholder content with the correct component implementation to resolve module loading errors.
import React from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import { HeartPulseIcon, WindIcon, FeatherIcon, BotIcon, MusicIcon } from '../components/icons/Icons';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
    const { user } = useAuth();

    const features = [
        { name: 'Daily Challenge', icon: HeartPulseIcon, desc: 'Build positive habits, one day at a time.', link: '/challenges', color: 'bg-blue-100 text-blue-800' },
        { name: 'Breathing', icon: WindIcon, desc: 'Calm your mind with guided exercises.', link: '/breathing', color: 'bg-green-100 text-green-800' },
        { name: 'Nature Sounds', icon: MusicIcon, desc: 'Relax with calming videos from nature.', link: '/nature-sounds', color: 'bg-indigo-100 text-indigo-800' },
        { name: 'Journal', icon: FeatherIcon, desc: 'Reflect on your thoughts and feelings.', link: '/journal', color: 'bg-yellow-100 text-yellow-800' },
        { name: 'AI Chatbot', icon: BotIcon, desc: 'Talk to Resi, your supportive AI friend.', link: '/chatbot', color: 'bg-teal-100 text-teal-800' },
    ];

    const welcomeTitle = user ? `Welcome back, ${user.email.split('@')[0]}!` : "Welcome!";

    return (
        <div>
            <PageTitle title={welcomeTitle} subtitle="Ready to continue your journey of self-discovery?" />

            <div className="p-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl text-white mb-10">
                <h2 className="text-2xl font-bold">Quote of the Day</h2>
                <p className="mt-2 text-lg italic">"The curious paradox is that when I accept myself just as I am, then I can change."</p>
                <p className="mt-1 text-right font-medium">- Carl Rogers</p>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Quick Access</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map(feature => (
                    <Link to={feature.link} key={feature.name} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${feature.color}`}>
                            <feature.icon className="w-6 h-6" />
                        </div>
                        <h4 className="mt-4 font-semibold text-lg text-gray-800">{feature.name}</h4>
                        <p className="mt-1 text-gray-500 text-sm">{feature.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default HomePage;