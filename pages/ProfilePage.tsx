import React from 'react';
import PageTitle from '../components/PageTitle';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <PageTitle title={t('profile.title')} subtitle={t('profile.subtitle')} />

      <div className="max-w-md mx-auto bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-md border border-slate-200/80">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-500">{t('profile.email')}</label>
            <p className="mt-1 text-lg font-semibold text-slate-800">{user?.email}</p>
          </div>
          <div className="border-t pt-4">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
            >
              {t('profile.logoutButton')}
            </button>
          </div>
        </div>
        <div className="mt-6 text-xs text-center text-slate-400">
          <p>{t('profile.disclaimer1')}</p>
          <p>{t('profile.disclaimer2')}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;