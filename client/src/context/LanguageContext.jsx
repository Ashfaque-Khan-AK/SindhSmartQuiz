import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { LANGUAGES, isRTL, translate } from '../i18n/translations';
import { useAuth } from './AuthContext';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'ssq_language';

export function LanguageProvider({ children }) {
  const { user } = useAuth();
  const [language, setLanguageState] = useState(
    () => localStorage.getItem(STORAGE_KEY) || user?.language || 'en'
  );

  // Apply the saved profile language only when a different user signs in.
  const lastUserId = useRef(user?._id ?? null);
  useEffect(() => {
    const id = user?._id ?? null;
    if (id && id !== lastUserId.current && user?.language) {
      setLanguageState(user.language);
    }
    lastUserId.current = id;
  }, [user?._id, user?.language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL(language) ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = useCallback((next) => {
    if (LANGUAGES.some((item) => item.code === next)) {
      setLanguageState(next);
    }
  }, []);

  const t = useCallback((key, vars) => translate(language, key, vars), [language]);

  const pick = useCallback(
    (value) => {
      if (!value) return '';
      if (typeof value === 'string') return value;
      return value[language] || value.en || value.ur || value.sd || '';
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      dir: isRTL(language) ? 'rtl' : 'ltr',
      rtl: isRTL(language),
      languages: LANGUAGES,
      setLanguage,
      t,
      pick,
    }),
    [language, setLanguage, t, pick]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
