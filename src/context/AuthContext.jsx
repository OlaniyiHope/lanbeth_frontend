import { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../lib/api.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const AUTH_USER_KEY = 'lanbeth-auth-user';
const AUTH_TOKEN_KEY = 'lanbeth-auth-token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(AUTH_USER_KEY)); } catch { return null; }
  });
  const [isInitialised, setIsInitialised] = useState(false);

  useEffect(() => {
    setIsInitialised(true);
  }, []);

  const login = async (identifier, password) => {
    const { token, user: apiUser } = await apiLogin(identifier, password);

    if (!token || !apiUser) {
      throw new Error('Login succeeded but no user data was returned.');
    }

    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(apiUser));
    setUser(apiUser);
    return apiUser;
  };

  const register = async (payload) => {
    const { token, user: apiUser } = await apiRegister(payload);

    if (apiUser) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(apiUser));
      setUser(apiUser);
    }
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
    return apiUser;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isInitialised,
    role: user?.role || null,
    login,
    register,
    logout,
  };

  if (!isInitialised) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}