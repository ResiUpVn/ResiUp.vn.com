// FIX: Replaced placeholder content with the correct component implementation to resolve module loading errors.
import React from 'react';
import PageTitle from '../components/PageTitle';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <PageTitle title="My Profile" subtitle="Manage your account settings." />

      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-lg font-semibold text-gray-800">{user?.email}</p>
          </div>
          <div className="border-t pt-4">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="mt-6 text-xs text-center text-gray-400">
          <p>This is a simulated authentication system.</p>
          <p>User data is stored in your browser's local storage.</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;