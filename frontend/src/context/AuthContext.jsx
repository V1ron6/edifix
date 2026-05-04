import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import {
  clearAuthStorage,
  getStoredUser,
  getToken,
  saveStoredUser,
  saveToken,
} from '../utils/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootstrapAuth() {
      const currentToken = getToken();
      if (!currentToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.get('/api/auth/me');
        const me = data?.user || data;
        setUser(me);
        setToken(currentToken);
        saveStoredUser(me);
      } catch {
        clearAuthStorage();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    bootstrapAuth();
  }, []);

  const login = (nextToken, nextUser) => {
    saveToken(nextToken);
    saveStoredUser(nextUser);
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    clearAuthStorage();
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
      setUser,
    }),
    [token, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
