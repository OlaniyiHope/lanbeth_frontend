// import { createContext, useContext, useEffect, useState } from 'react';
// import { login as apiLogin, register as apiRegister } from '../lib/api.js';

// const AuthContext = createContext(null);
// export const useAuth = () => useContext(AuthContext);

// const AUTH_USER_KEY = 'lanbeth-auth-user';
// const AUTH_TOKEN_KEY = 'lanbeth-auth-token';

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(() => {
//     try { return JSON.parse(localStorage.getItem(AUTH_USER_KEY)); } catch { return null; }
//   });
//   const [isInitialised, setIsInitialised] = useState(false);

//   useEffect(() => {
//     setIsInitialised(true);
//   }, []);

//   const login = async (identifier, password) => {
//     const { token, user: apiUser } = await apiLogin(identifier, password);

//     if (!token || !apiUser) {
//       throw new Error('Login succeeded but no user data was returned.');
//     }

//     localStorage.setItem(AUTH_TOKEN_KEY, token);
//     localStorage.setItem(AUTH_USER_KEY, JSON.stringify(apiUser));
//     setUser(apiUser);
//     return apiUser;
//   };

//   const register = async (payload) => {
//     const { token, user: apiUser } = await apiRegister(payload);

//     if (apiUser) {
//       localStorage.setItem(AUTH_USER_KEY, JSON.stringify(apiUser));
//       setUser(apiUser);
//     }
//     if (token) {
//       localStorage.setItem(AUTH_TOKEN_KEY, token);
//     }
//     return apiUser;
//   };

//   const logout = () => {
//     localStorage.removeItem(AUTH_TOKEN_KEY);
//     localStorage.removeItem(AUTH_USER_KEY);
//     setUser(null);
//   };

//   const value = {
//     user,
//     isAuthenticated: !!user,
//     isInitialised,
//     role: user?.role || null,
//     login,
//     register,
//     logout,
//   };

//   if (!isInitialised) return null;

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { login as apiLogin, register as apiRegister } from '../lib/api.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const AUTH_USER_KEY = 'lanbeth-auth-user';
const AUTH_TOKEN_KEY = 'lanbeth-auth-token';
const AUTH_EXPIRY_KEY = 'lanbeth-auth-expiry';
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours

function readStoredSession() {
  try {
    const user = JSON.parse(localStorage.getItem(AUTH_USER_KEY));
    const expiry = Number(localStorage.getItem(AUTH_EXPIRY_KEY));
    if (!user || !expiry) return null;
    if (Date.now() >= expiry) return null; // expired
    return { user, expiry };
  } catch {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_EXPIRY_KEY);
}

export function AuthProvider({ children }) {
  const stored = readStoredSession();
  const [user, setUser] = useState(stored?.user ?? null);
  const [isInitialised, setIsInitialised] = useState(false);
  const timerRef = useRef(null);

  const scheduleAutoLogout = (expiry) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const msLeft = expiry - Date.now();
    if (msLeft <= 0) {
      clearSession();
      setUser(null);
      return;
    }
    timerRef.current = setTimeout(() => {
      clearSession();
      setUser(null);
    }, msLeft);
  };

  useEffect(() => {
    // If we booted with a stale user but no valid stored session, wipe it.
    if (!stored) {
      clearSession();
      setUser(null);
    } else {
      scheduleAutoLogout(stored.expiry);
    }
    setIsInitialised(true);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startSession = (apiUser, token) => {
    const expiry = Date.now() + SESSION_DURATION_MS;
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(apiUser));
    localStorage.setItem(AUTH_EXPIRY_KEY, String(expiry));
    setUser(apiUser);
    scheduleAutoLogout(expiry);
  };

  const login = async (identifier, password) => {
    const { token, user: apiUser } = await apiLogin(identifier, password);
    if (!token || !apiUser) {
      throw new Error('Login succeeded but no user data was returned.');
    }
    startSession(apiUser, token);
    return apiUser;
  };

  const register = async (payload) => {
    const { token, user: apiUser } = await apiRegister(payload);
    if (apiUser && token) startSession(apiUser, token);
    return apiUser;
  };

  const logout = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    clearSession();
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