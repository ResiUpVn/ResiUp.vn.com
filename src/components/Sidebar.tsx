import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { HomeIcon, DashboardIcon, HeartPulseIcon, WindIcon, FeatherIcon, BotIcon, MusicIcon, BookOpenIcon, UsersIcon, UserIcon, LogOutIcon, ShieldCheckIcon, TestTubeIcon } from './icons/Icons';

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useTranslation();

    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'vi' : 'en';
        setLanguage(newLang);
    };

    return (
        <div className="flex items-center justify-center">
            <button
                onClick={toggleLanguage}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
            >
                <span className={`font-semibold ${language === 'en' ? 'text-blue-600' : 'text-slate-500'}`}>EN</span>
                <div className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${language === 'vi' ? 'bg-blue-600' : 'bg-slate-300'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${language === 'vi' ? 'translate-x-4' : ''}`}></div>
                </div>
                <span className={`font-semibold ${language === 'vi' ? 'text-blue-600' : 'text-slate-500'}`}>VI</span>
            </button>
        </div>
    );
};


const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    const navItems = [
        { name: t('nav.home'), icon: HomeIcon, path: '/' },
        { name: t('nav.dashboard'), icon: DashboardIcon, path: '/dashboard' },
        { name: t('nav.challenges'), icon: HeartPulseIcon, path: '/challenges' },
        { name: t('nav.breathing'), icon: WindIcon, path: '/breathing' },
        { name: t('nav.journal'), icon: FeatherIcon, path: '/journal' },
        { name: t('nav.chatbot'), icon: BotIcon, path: '/chatbot' },
        { name: t('nav.tests'), icon: TestTubeIcon, path: '/tests' },
        { name: t('nav.natureSounds'), icon: MusicIcon, path: '/nature-sounds' },
        { name: t('nav.resources'), icon: BookOpenIcon, path: '/resources' },
        { name: t('nav.forum'), icon: UsersIcon, path: '/forum' },
    ];

    return (
        <aside className="w-64 bg-white/70 backdrop-blur-lg border-r border-slate-200/80 flex flex-col shadow-lg">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-blue-600">ResiUp</h1>
            </div>
            <nav className="flex-1 px-4 py-2 space-y-1">
                {navItems.map(item => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) =>
                            `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            isActive ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.name}
                    </NavLink>
                ))}
                {user?.isAdmin && (
                     <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                            `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            isActive ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
                            }`
                        }
                    >
                        <ShieldCheckIcon className="w-5 h-5 mr-3" />
                        {t('nav.admin')}
                    </NavLink>
                )}
            </nav>
            <div className="p-4 border-t border-slate-200/80 space-y-4">
                <LanguageSwitcher />
                <div className="flex items-center">
                    <NavLink to="/profile" className="flex items-center w-full group">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center mr-3">
                            <UserIcon className="w-6 h-6 text-slate-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 truncate">{user?.email}</p>
                            <p className="text-xs text-slate-500">{t('sidebar.viewProfile')}</p>
                        </div>
                    </NavLink>
                </div>
                 <button onClick={handleLogout} className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors">
                    <LogOutIcon className="w-5 h-5 mr-2"/>
                    {t('sidebar.logout')}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;