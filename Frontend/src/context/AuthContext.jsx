import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { ROLES } from '../utils/constants';
import * as authApi from '../api/authApi';
import { USE_MOCK } from '../api/mockHelpers';
import apiClient from '../api/apiClient';

const AuthContext = createContext(null);

const MOCK_USERS = {
  [ROLES.ADMIN]: {
    id: 'admin-001',
    name: 'Sarah Chen',
    email: 'sarah.chen@ims.dev',
    role: ROLES.ADMIN,
    avatar: null,
  },
  [ROLES.TEACHER]: {
    id: 'teacher-001',
    name: 'Marcus Johnson',
    email: 'marcus.j@ims.dev',
    role: ROLES.TEACHER,
    avatar: null,
  },
  [ROLES.STUDENT]: {
    id: 'student-001',
    name: 'Anika Patel',
    email: 'anika.p@ims.dev',
    role: ROLES.STUDENT,
    batchId: 'batch-001',
    avatar: null,
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('ims_user');
    if (savedUser) return JSON.parse(savedUser);
    return USE_MOCK ? null : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('ims_token') || (USE_MOCK ? 'mock-jwt-token' : null);
  });

  const login = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password });
    const resolvedToken = res.accessToken || res.token;
    const rawRole = res.user?.role || '';
    const normalizedRole = rawRole.toLowerCase() === 'instructor' ? ROLES.TEACHER : rawRole.toLowerCase();
    
    const normalizedUser = {
      ...res.user,
      role: normalizedRole
    };

    setUser(normalizedUser);
    setToken(resolvedToken);
    localStorage.setItem('ims_token', resolvedToken);
    localStorage.setItem('ims_user', JSON.stringify(normalizedUser));
    return normalizedUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error('Logout error:', e);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('ims_token');
    localStorage.removeItem('ims_user');
  }, []);

  const switchRole = useCallback(
    (role) => {
      if (USE_MOCK && MOCK_USERS[role]) {
        const newUser = MOCK_USERS[role];
        setUser(newUser);
        localStorage.setItem('ims_user', JSON.stringify(newUser));
      }
    },
    [],
  );

  const updateUserImage = useCallback((url) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, avatar: url };
      localStorage.setItem('ims_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateUser = useCallback((newData) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...newData };
      localStorage.setItem('ims_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  useEffect(() => {
    if (!token || USE_MOCK) return;
    
    const syncProfile = async () => {
      try {
        if (user?.role === ROLES.TEACHER) {
          const raw = await apiClient.get('/instructor/profile');
          if (raw && raw.profileImage) {
            setUser(prev => {
              if (!prev) return null;
              const updated = { ...prev, avatar: raw.profileImage, name: raw.userId?.name || prev.name };
              localStorage.setItem('ims_user', JSON.stringify(updated));
              return updated;
            });
          }
        }
      } catch (err) {
        console.error('Failed to sync user profile:', err);
      }
    };

    syncProfile();
  }, [token, user?.role]);

  const isAuthenticated = !!user && !!token;
  const role = user?.role || null;

  const value = useMemo(
    () => ({
      user,
      token,
      role,
      isAuthenticated,
      login,
      logout,
      switchRole,
      updateUserImage,
      updateUser,
    }),
    [user, token, role, isAuthenticated, login, logout, switchRole, updateUserImage, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
