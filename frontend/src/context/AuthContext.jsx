import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('edifix_token'));

  const fetchUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authAPI.getMe();
      setUser(data.data);
    } catch {
      localStorage.removeItem('edifix_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials) => {
    const { data } = await authAPI.login(credentials);
    localStorage.setItem('edifix_token', data.data.token);
    setToken(data.data.token);
    setUser(data.data.user);
    toast.success('Login successful');
    return data;
  };

  const register = async (credentials) => {
    const { data } = await authAPI.register(credentials);
    localStorage.setItem('edifix_token', data.data.token);
    setToken(data.data.token);
    setUser(data.data.user);
    toast.success('Registration successful');
    return data;
  };

  const logout = () => {
    localStorage.removeItem('edifix_token');
    setToken(null);
    setUser(null);
    toast.success('Logged out');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
