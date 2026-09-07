import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { login as apiLogin, register as apiRegister, fetchMe } from '../lib/api.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const AUTH_USER_KEY = 'lanbeth-auth-user';
const AUTH_TOKEN_KEY = 'lanbeth-auth-token';
const AUTH_EXPIRY_KEY = 'lanbeth-auth-expiry';
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours

function readStoredSession() {
  try {
    const user = JSON.parse(localStorage.getItem(AUTH_USER_KEY));
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const expiry = Number(localStorage.getItem(AUTH_EXPIRY_KEY));
    if (!user || !token || !expiry) return null;
    if (Date.now() >= expiry) return null; // expired locally
    return { user, token, expiry };
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
  const [user, setUser] = useState(null);
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

  // Force-logout helper: wipes storage + state, used whenever the server
  // tells us the session is no longer valid (revoked token, deactivated
  // account, expired JWT, etc). Setting user -> null flips Gate() in
  // App.jsx back to the login-only route tree automatically.
  const forceLogout = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    clearSession();
    setUser(null);
  };

  useEffect(() => {
    let cancelled = false;

    async function verifySession() {
      const stored = readStoredSession();

      // No local session at all (or it's malformed / expired locally) —
      // nothing to verify against the server, just stay logged out.
      if (!stored) {
        clearSession();
        if (!cancelled) {
          setUser(null);
          setIsInitialised(true);
        }
        return;
      }

      // We have a token that looks unexpired on the client — but the
      // client's clock is not the source of truth. Confirm with the DB.
      try {
        const { user: dbUser } = await fetchMe();

        if (cancelled) return;

        if (!dbUser || dbUser.status !== 'active') {
          // Server says this account is gone, deactivated, or the token
          // no longer maps to a valid user — kill the session.
          forceLogout();
        } else {
          setUser(dbUser);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(dbUser));
          scheduleAutoLogout(stored.expiry);
        }
      } catch (err) {
        // fetchMe() throws on any non-2xx response (401 expired/invalid
        // token, 403 inactive account, network error, etc). Any failure
        // here means we can't trust this session — wipe it.
        if (!cancelled) {
          forceLogout();
        }
      } finally {
        if (!cancelled) setIsInitialised(true);
      }
    }

    verifySession();

    return () => {
      cancelled = true;
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
    forceLogout();
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isInitialised,
    role: user?.role || null,
    login,
    register,
    logout,
    forceLogout, // exposed so api.js can call this directly on any 401/403
  };

  if (!isInitialised) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}