import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const ADMIN_EMAIL = 'admin_cute@gmail.com';
const ADMIN_PASS = '22112008@@@';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for logged in user in local storage
    try {
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse auth user from localStorage', error);
      localStorage.removeItem('authUser');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<void> => {
    // Special check for hardcoded admin user
    if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
        const adminUser: User = { id: 'admin-user', email: ADMIN_EMAIL, isAdmin: true };
        setUser(adminUser);
        localStorage.setItem('authUser', JSON.stringify(adminUser));
        return;
    }

    // This is a simulated auth system for regular users
    const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
    const userData = storedUsers[email];

    if (userData && userData.password === pass) {
      const loggedInUser: User = { id: userData.id, email: userData.email, isAdmin: userData.isAdmin || false };
      setUser(loggedInUser);
      localStorage.setItem('authUser', JSON.stringify(loggedInUser));
    } else {
      throw new Error('Invalid email or password');
    }
  };

  const signup = async (email: string, pass: string): Promise<void> => {
     // Prevent signing up with the reserved admin email
    if (email === ADMIN_EMAIL) {
        throw new Error('This email address is reserved.');
    }

    const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');

    if (storedUsers[email]) {
      throw new Error('An account with this email already exists');
    }
    
    const id = new Date().toISOString();
    
    // All new users are non-admins
    storedUsers[email] = { id, email, password: pass, isAdmin: false };
    localStorage.setItem('users', JSON.stringify(storedUsers));
    
    const newUser: User = { id, email, isAdmin: false };
    setUser(newUser);
    localStorage.setItem('authUser', JSON.stringify(newUser));
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
  };

  const value = { user, loading, login, signup, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};