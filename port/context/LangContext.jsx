'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { LOCALE_DIR, t as translations } from '@/lib/i18n';

const LangCtx = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLangState] = useState('fr');

  const setLang = (l) => {
    setLangState(l);
    try { localStorage.setItem('dimah_lang', l); } catch {}
    document.documentElement.lang = l;
    document.documentElement.dir = LOCALE_DIR[l];
  };

  useEffect(() => {
    const saved = localStorage.getItem('dimah_lang') || 'fr';
    setLang(saved);
  }, []);

  const tr = translations[lang] || translations.fr;

  return (
    <LangCtx.Provider value={{ lang, setLang, tr, dir: LOCALE_DIR[lang] }}>
      {children}
    </LangCtx.Provider>
  );
}

export const useLang = () => {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error('useLang must be inside LangProvider');
  return ctx;
};
