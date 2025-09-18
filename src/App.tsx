import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import HomePage from './pages/HomePage';
import DailyChallengePage from './pages/DailyChallengePage';
import BreathingPage from './pages/BreathingPage';
import NatureSoundsPage from './pages/NatureSoundsPage';
import JournalPage from './pages/JournalPage';
import ChatbotPage from './pages/ChatbotPage';
import DashboardPage from './pages/DashboardPage';
import ForumPage from './pages/ForumPage';
import PostDetailPage from './pages/PostDetailPage';
import ResourcesPage from './pages/ResourcesPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import TestsPage from './pages/TestsPage';


const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/challenges" element={<DailyChallengePage />} />
                <Route path="/breathing" element={<BreathingPage />} />
                <Route path="/nature-sounds" element={<NatureSoundsPage />} />
                <Route path="/journal" element={<JournalPage />} />
                <Route path="/chatbot" element={<ChatbotPage />} />
                <Route path="/forum" element={<ForumPage />} />
                <Route path="/forum/:postId" element={<PostDetailPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/tests" element={<TestsPage />} />
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminPage />} />
                </Route>
              </Route>
            </Route>
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;