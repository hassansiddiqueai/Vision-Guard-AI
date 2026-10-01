import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('vg_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.warn('Failed parsing saved user', e);
      }
    }
    // Default auditor user so every tab and route is immediately accessible
    const defaultUser = {
      id: 'demo-user-001',
      name: 'Alex Mercer',
      email: 'alex.mercer@visionguard.ai',
      role: 'Senior Safety Auditor',
      organization: 'Apex Industrial Systems',
      createdAt: '2025-01-15T08:30:00Z',
      isDemo: true,
    };
    localStorage.setItem('vg_user', JSON.stringify(defaultUser));
    return defaultUser;
  });

  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('vg_token');
    if (savedToken) return savedToken;
    const defaultToken = 'demo_jwt_token_visionguard_2025';
    localStorage.setItem('vg_token', defaultToken);
    return defaultToken;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Check if token exists on mount and validate with backend if active
    const initAuth = async () => {
      const savedToken = localStorage.getItem('vg_token');
      if (savedToken && !savedToken.startsWith('demo_')) {
        try {
          const profile = await authService.getProfile();
          if (profile && profile.user) {
            setUser(profile.user);
            localStorage.setItem('vg_user', JSON.stringify(profile.user));
          }
        } catch (err) {
          console.info('Backend profile sync note:', err.message);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const data = await authService.login(email, password);
      const authToken = data.token || 'vg_jwt_session_' + Date.now();
      const userData = data.user || {
        id: data.id || 'usr_' + Date.now(),
        name: data.name || email.split('@')[0],
        email: email,
        role: data.role || 'Inspector / Safety Engineer',
        organization: data.organization || 'VisionGuard Enterprise',
        createdAt: data.createdAt || new Date().toISOString(),
      };

      setToken(authToken);
      setUser(userData);
      localStorage.setItem('vg_token', authToken);
      localStorage.setItem('vg_user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      const message = err.message || 'Login failed. Please check your credentials.';
      setAuthError(message);
      throw new Error(message);
    }
  };

  const demoLogin = (role = 'Senior Safety Auditor') => {
    const demoUser = {
      id: 'demo-user-001',
      name: 'Alex Mercer',
      email: 'alex.mercer@visionguard.ai',
      role: role,
      organization: 'Apex Industrial Systems',
      createdAt: '2025-01-15T08:30:00Z',
      isDemo: true,
    };
    const demoToken = 'demo_jwt_token_visionguard_2025';

    setToken(demoToken);
    setUser(demoUser);
    localStorage.setItem('vg_token', demoToken);
    localStorage.setItem('vg_user', JSON.stringify(demoUser));
    return demoUser;
  };

  const register = async (name, email, password) => {
    setAuthError(null);
    try {
      const data = await authService.register(name, email, password);
      const authToken = data.token || 'vg_jwt_session_' + Date.now();
      const userData = data.user || {
        id: data.id || 'usr_' + Date.now(),
        name: name,
        email: email,
        role: 'Safety Inspector',
        organization: 'VisionGuard Enterprise',
        createdAt: new Date().toISOString(),
      };

      setToken(authToken);
      setUser(userData);
      localStorage.setItem('vg_token', authToken);
      localStorage.setItem('vg_user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      const message = err.message || 'Registration failed. Please try again.';
      setAuthError(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    authService.logout();
    const guestUser = {
      id: 'demo-user-001',
      name: 'Alex Mercer',
      email: 'alex.mercer@visionguard.ai',
      role: 'Safety Auditor',
      organization: 'Apex Industrial Systems',
      createdAt: '2025-01-15T08:30:00Z',
      isDemo: true,
    };
    const guestToken = 'demo_jwt_token_visionguard_2025';
    setToken(guestToken);
    setUser(guestUser);
    localStorage.setItem('vg_token', guestToken);
    localStorage.setItem('vg_user', JSON.stringify(guestUser));
    setAuthError(null);
  };

  const updateUser = (updatedData) => {
    const updated = { ...user, ...updatedData };
    setUser(updated);
    localStorage.setItem('vg_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        authError,
        login,
        demoLogin,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
