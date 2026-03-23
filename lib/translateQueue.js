// lib/translateQueue.js
// Utilisé uniquement pour les tableaux statiques codés en dur dans les pages
// (DOMAINS_BASE, SOFT_BASE, etc.) qui n'ont pas de doc Firebase individuel.
//
// Couches :
//   1. Glossaire client (lib/glossary.js) → instantané, zéro réseau
//   2. Cache mémoire → instantané si déjà traduit dans la session
//   3. API Groq → seulement pour textes longs inconnus du glossaire
//
// Note : les EditableText n'utilisent PLUS ce système.
//        Ils lisent directement doc[lang] depuis Firebase.

import { glossaryLookup } from '@/lib/glossary';

const cache = {};
const pending = {};
let timer = null;

function scheduleFlush() {
  if (timer) return;
  timer = setTimeout(flush, 50);
}

async function flush() {
  timer = null;
  const keys = Object.keys(pending);
  if (!keys.length) return;

  const byLang = {};
  keys.forEach(key => {
    const sep = key.indexOf('::');
    const lang = key.slice(0, sep);
    if (!byLang[lang]) byLang[lang] = [];
    byLang[lang].push(key);
  });

  for (const [lang, langKeys] of Object.entries(byLang)) {
    const texts = langKeys.map(k => k.slice(lang.length + 2));
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts, targetLang: lang }),
      });
      const { translated } = await res.json();
      langKeys.forEach((key, i) => {
        const result = Array.isArray(translated) ? translated[i] : texts[i];
        cache[key] = result;
        (pending[key] || []).forEach(r => r(result));
        delete pending[key];
      });
    } catch {
      langKeys.forEach((key, i) => {
        cache[key] = texts[i];
        (pending[key] || []).forEach(r => r(texts[i]));
        delete pending[key];
      });
    }
  }
}

export function translateQueued(text, lang) {
  if (!text || lang === 'fr') return Promise.resolve(text);

  // Couche 1 : glossaire client (instantané)
  const hit = glossaryLookup(text, lang);
  if (hit) return Promise.resolve(hit);

  // Couche 2 : cache mémoire
  const key = `${lang}::${text}`;
  if (cache[key]) return Promise.resolve(cache[key]);

  // Couche 3 : API via batch queue
  return new Promise(resolve => {
    if (!pending[key]) pending[key] = [];
    pending[key].push(resolve);
    scheduleFlush();
  });
}