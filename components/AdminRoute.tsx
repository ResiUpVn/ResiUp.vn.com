
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute: React.FC = () => {
  const { user } = useAuth();
  
  // Assumes loading state is handled by ProtectedRoute wrapper
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return user.isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
