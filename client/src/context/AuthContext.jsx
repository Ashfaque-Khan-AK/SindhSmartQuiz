import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { authApi } from '../services';

const TOKEN_KEY = 'ssq_token';
const USER_KEY = 'ssq_user';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)));

  const logout = useCallback((message) => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    setLoading(false);
    if (message) toast(message, { icon: '👋' });
  }, []);

  useEffect(() => {
    const onUnauthorized = () => logout('Your session expired. Please sign in again.');
    window.addEventListener('ssq:unauthorized', onUnauthorized);
    return () => window.removeEventListener('ssq:unauthorized', onUnauthorized);
  }, [logout]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return undefined;
    }

    let active = true;
    setLoading(true);
    authApi
      .me()
      .then((data) => {
        if (!active) return;
        setUser(data.user);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      })
      .catch(() => {
        // 401 responses are handled by the interceptor; network errors keep the cached user.
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const login = useCallback(async (email, password, expectedRole) => {
    const data = await authApi.login({ email, password });

    if (expectedRole && data.user.role !== expectedRole) {
      throw new Error(
        expectedRole === 'admin'
          ? 'This account is not an administrator.'
          : 'Please use the administrator login for this account.'
      );
    }

    persistSession(data.token, data.user);
    setToken(data.token);
    setUser(data.user);
    setLoading(false);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authApi.register(payload);
    return data.user;
  }, []);

  const updateUser = useCallback((partial) => {
    setUser((previous) => {
      const next = { ...previous, ...partial };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const refresh = useCallback(async () => {
    const data = await authApi.me();
    setUser(data.user);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user;
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, updateUser, refresh, isAuthenticated: Boolean(user) }),
    [user, token, loading, login, register, logout, updateUser, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
