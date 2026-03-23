// hooks/useTranslatedArray.js
// Utilisé pour les tableaux statiques codés en dur dans les pages
// (domaines, soft skills, intérêts, labels contact…)
// qui n'ont pas de doc Firebase individuel.
//
// Couche 1 : glossaire (lib/glossary.js) → instantané
// Couche 2 : cache session → instantané
// Couche 3 : API Groq via translateQueue → seulement si inconnu

'use client';
import { useEffect, useState } from 'react';
import { useLang } from '@/context/LangContext';
import { translateQueued } from '@/lib/translateQueue';

export function useTranslatedArray(arr) {
  const { lang } = useLang();
  const [translated, setTranslated] = useState(arr);

  useEffect(() => {
    if (lang === 'fr') { setTranslated(arr); return; }
    let cancelled = false;
    Promise.all(arr.map(item => translateQueued(item, lang))).then(result => {
      if (!cancelled) setTranslated(result);
    });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, arr.join('||')]);

  return translated;
}

export function useTranslatedObjects(arr, keys) {
  const { lang } = useLang();
  const [translated, setTranslated] = useState(arr);

  useEffect(() => {
    if (lang === 'fr') { setTranslated(arr); return; }
    let cancelled = false;

    const flat = arr.flatMap(obj => keys.map(k => obj[k] || ''));
    Promise.all(flat.map(text => translateQueued(text, lang))).then(results => {
      if (cancelled) return;
      let idx = 0;
      const out = arr.map(obj => {
        const copy = { ...obj };
        keys.forEach(k => { copy[k] = results[idx++]; });
        return copy;
      });
      setTranslated(out);
    });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, JSON.stringify(arr.map(o => keys.map(k => o[k]).join()))]);

  return translated;
}