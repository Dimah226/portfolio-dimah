// context/LangContext.jsx
'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { LOCALE_DIR, t as baseTranslations } from '@/lib/i18n';

const LangCtx = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLangState] = useState('fr');
  const [tr, setTr] = useState(baseTranslations.fr);

  const applyLang = useCallback((l) => {
    setLangState(l);
    try { localStorage.setItem('dimah_lang', l); } catch {}
    document.documentElement.lang = l;
    document.documentElement.dir = LOCALE_DIR[l] || 'ltr';
    // Toutes les langues sont dans i18n.js — aucun appel API nécessaire
    setTr(baseTranslations[l] ?? baseTranslations.fr);
  }, []);

  useEffect(() => {
    const saved = (() => {
      try { return localStorage.getItem('dimah_lang') || 'fr'; }
      catch { return 'fr'; }
    })();
    applyLang(saved);
  }, [applyLang]);

  return (
    <LangCtx.Provider value={{
      lang,
      setLang: applyLang,
      tr,
      dir: LOCALE_DIR[lang] || 'ltr',
    }}>
      {children}
    </LangCtx.Provider>
  );
}

export const useLang = () => {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error('useLang must be inside LangProvider');
  return ctx;
};