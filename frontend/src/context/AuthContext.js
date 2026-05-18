import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistAuth = (data) => {
    localStorage.setItem('fb_token', data.token);
    localStorage.setItem('fb_user', JSON.stringify(data));
    setUser(data);
  };

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('fb_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await API.get('/me');
      const stored = JSON.parse(localStorage.getItem('fb_user') || '{}');
      persistAuth({ ...stored, ...data, token });
    } catch {
      localStorage.removeItem('fb_token');
      localStorage.removeItem('fb_user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const { data } = await API.post('/login', { email, password });
    persistAuth(data);
    return data;
  };

  const register = async (formData) => {
    const { data } = await API.post('/register', formData);
    persistAuth(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('fb_token');
    localStorage.removeItem('fb_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
