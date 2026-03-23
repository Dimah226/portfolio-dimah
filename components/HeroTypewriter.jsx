'use client';
import { useEffect, useState, useRef } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { refs } from '@/lib/refs';
import { useLang } from '@/context/LangContext';

const DEFAULT_PHRASES = [
  "Modéliser l'incertitude.",
  'Quantifier le risque.',
  'Transformer la donnée.',
  'Prévoir. Décider. Agir.',
  'Du bruit au signal.',
  "L'actuaire & le data scientist.",
  'IBNR. XGBoost. LSTM.',
  'Abidjan → Afrique → monde.',
];

async function translatePhrase(text, lang) {
  if (lang === 'fr' || !text) return text;
  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLang: lang }),
    });
    const { translated } = await res.json();
    return translated || text;
  } catch { return text; }
}

export default function HeroTypewriter() {
  const { lang } = useLang();
  const [frPhrases, setFrPhrases] = useState(DEFAULT_PHRASES);
  const [phrases, setPhrases]     = useState(DEFAULT_PHRASES);
  const [phraseIdx, setIdx]       = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase]         = useState('typing');
  const cacheRef = useRef({});  // { "en::phrase fr" : "translated" }
  const langRef  = useRef(lang); // pour éviter les mises à jour stale

  // ── Charge les phrases FR depuis Firestore ──────────────────
  useEffect(() => {
    const unsub = onSnapshot(refs.homeVar('typewriter_phrases'), (snap) => {
      if (!snap.exists()) return;
      const raw = snap.data().valeur;
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) { setFrPhrases(parsed); return; }
      } catch {}
      const lines = raw.split(/[|\n]/).map(s => s.trim()).filter(Boolean);
      if (lines.length > 0) setFrPhrases(lines);
    });
    return () => unsub();
  }, []);

  // ── Changement de langue ou de frPhrases ───────────────────
  // Stratégie :
  //   1. Reset IMMEDIAT sur les phrases FR — plus de gel d'attente
  //   2. Traduction phrase par phrase en arrière-plan, mise à jour au fil de l'eau
  useEffect(() => {
    langRef.current = lang;
    let cancelled = false;

    // Affichage immédiat sans attendre la traduction
    setPhrases(frPhrases);
    setIdx(0);
    setDisplayed('');
    setPhase('typing');

    if (lang === 'fr') return;

    // Traduit chaque phrase indépendamment et met à jour dès que c'est prêt
    frPhrases.forEach(async (p, i) => {
      const key = `${lang}::${p}`;
      let translated;
      if (cacheRef.current[key]) {
        translated = cacheRef.current[key];
      } else {
        translated = await translatePhrase(p, lang);
        cacheRef.current[key] = translated;
      }
      // Ignore si la langue a changé ou si le composant s'est démonté
      if (!cancelled && langRef.current === lang) {
        setPhrases(prev => {
          const next = [...prev];
          next[i] = translated;
          return next;
        });
      }
    });

    return () => { cancelled = true; };
  }, [lang, frPhrases]);

  // ── Animation typewriter ────────────────────────────────────
  useEffect(() => {
    const phrase = phrases[phraseIdx] ?? '';
    let t;
    if (phase === 'typing') {
      if (displayed.length < phrase.length) {
        t = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length + 1)), 42);
      } else {
        t = setTimeout(() => setPhase('pause'), 1800);
      }
    } else if (phase === 'pause') {
      t = setTimeout(() => setPhase('erasing'), 200);
    } else if (phase === 'erasing') {
      if (displayed.length > 0) {
        t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 22);
      } else {
        setIdx(i => (i + 1) % Math.max(phrases.length, 1));
        setPhase('typing');
      }
    }
    return () => clearTimeout(t);
  }, [displayed, phase, phraseIdx, phrases]);

  return (
    <div style={{ minHeight: '2.4em', display: 'flex', alignItems: 'center' }}>
      <span style={{
        fontFamily: "'Cormorant Garamond',serif",
        fontSize: 'clamp(32px, 3.8vw, 56px)',
        fontWeight: 400,
        fontStyle: 'italic',
        color: 'rgb(var(--ink)/0.22)',
        lineHeight: 1.15,
        letterSpacing: '-0.02em',
        whiteSpace: 'pre',
      }}>
        {displayed}
        <span style={{
          display: 'inline-block',
          width: '2px',
          height: '0.8em',
          background: 'rgb(var(--rouge)/0.6)',
          marginLeft: '3px',
          verticalAlign: 'middle',
          animation: 'blink 1s step-end infinite',
        }} />
      </span>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  );
}