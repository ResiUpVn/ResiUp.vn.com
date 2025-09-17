
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HomeIcon, DashboardIcon, HeartPulseIcon, WindIcon, FeatherIcon, BotIcon, MusicIcon, BookOpenIcon, UsersIcon, UserIcon, LogOutIcon, ShieldCheckIcon } from './icons/Icons';

const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    const navItems = [
        { name: 'Home', icon: HomeIcon, path: '/' },
        { name: 'Dashboard', icon: DashboardIcon, path: '/dashboard' },
        { name: 'Challenges', icon: HeartPulseIcon, path: '/challenges' },
        { name: 'Breathing', icon: WindIcon, path: '/breathing' },
        { name: 'Journal', icon: FeatherIcon, path: '/journal' },
        { name: 'AI Chatbot', icon: BotIcon, path: '/chatbot' },
        { name: 'Nature Sounds', icon: MusicIcon, path: '/nature-sounds' },
        { name: 'Resources', icon: BookOpenIcon, path: '/resources' },
        { name: 'Forum', icon: UsersIcon, path: '/forum' },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-teal-600">ResiUp</h1>
            </div>
            <nav className="flex-1 px-4 py-2 space-y-2">
                {navItems.map(item => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) =>
                            `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-100'
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
                            isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-100'
                            }`
                        }
                    >
                        <ShieldCheckIcon className="w-5 h-5 mr-3" />
                        Admin
                    </NavLink>
                )}
            </nav>
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center mb-4">
                    <NavLink to="/profile" className="flex items-center w-full group">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <UserIcon className="w-6 h-6 text-gray-500" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-800 group-hover:text-teal-600 truncate">{user?.email}</p>
                            <p className="text-xs text-gray-500">View Profile</p>
                        </div>
                    </NavLink>
                </div>
                 <button onClick={handleLogout} className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors">
                    <LogOutIcon className="w-5 h-5 mr-2"/>
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
