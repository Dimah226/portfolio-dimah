'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { onSnapshot } from 'firebase/firestore';
import Link from 'next/link';
import { useLang } from '@/context/LangContext';
import Photo from '@/components/Photo';
import Stats from '@/components/Stats';
import Socials from '@/components/Socials';
import { FiArrowDownRight } from 'react-icons/fi';
import DataUniverse from '@/components/DataUniverse';
import EditableText from '@/components/EditableText';
import ThemeColorsPanel from '@/components/ThemeColorPanel';
import AdminManager from '@/components/AdminManager';
import HeroTypewriter from '@/components/HeroTypewriter';
import HeroMap from '@/components/HeroMap';
import useAdmin from '@/components/hook/useAdmin';
import { refs } from '@/lib/refs';

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { delay, duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
});

const DEFAULT_TICKER = ['Risk Management','ALM','LCR/NSFR','Stress-tests','Économétrie','Machine Learning','Actuariat','Power BI','Python','R','VBA','SQL','ENSEA','ISFA Lyon'];

/* Composant ticker admin — affiche un champ textarea pour éditer les items */
function TickerAdmin({ items, isAdmin, docRef }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(items.join(' · '));

  const save = async () => {
    const { setDoc } = await import('firebase/firestore');
    const arr = val.split('·').map(s => s.trim()).filter(Boolean);
    await setDoc(docRef, { valeur: JSON.stringify(arr) }, { merge: true });
    setEditing(false);
  };

  if (!isAdmin) return null;

  return editing ? (
    <div style={{ padding: '4px 24px', background: 'rgb(var(--cream-dark))', borderTop: '1px dashed rgb(var(--rouge)/0.4)' }}>
      <textarea value={val} onChange={e => setVal(e.target.value)} rows={2}
        style={{ width: '100%', fontFamily: "'DM Mono',monospace", fontSize: '11px', background: 'transparent', border: 'none', outline: 'none', color: 'rgb(var(--ink)/0.6)', resize: 'none' }} />
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={save} style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.12em', padding: '4px 12px', background: 'rgb(var(--ink))', color: 'rgb(var(--cream))', border: 'none' }}>Sauver</button>
        <button onClick={() => setEditing(false)} style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.12em', padding: '4px 12px', background: 'none', border: '1px solid rgb(var(--ink)/0.2)', color: 'rgb(var(--ink)/0.5)' }}>Annuler</button>
      </div>
      <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', color: 'rgb(var(--ink)/0.3)', marginTop: '4px' }}>Séparer les items par ·</p>
    </div>
  ) : (
    <button onClick={() => setEditing(true)} style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '2px 12px', background: 'rgb(var(--rouge)/0.08)', border: '1px dashed rgb(var(--rouge)/0.3)', color: 'rgb(var(--rouge)/0.7)', margin: '0 auto', display: 'block' }}>
      ✏ Éditer le ticker
    </button>
  );
}

export default function Home() {
  const { tr } = useLang();
  const h = tr.hero;
  const { isAdmin } = useAdmin();

  const [tickerItems, setTickerItems] = useState(DEFAULT_TICKER);

  // Charge les items du ticker depuis Firestore
  useEffect(() => {
    const unsub = onSnapshot(refs.homeVar('ticker_items'), (snap) => {
      if (!snap.exists()) return;
      try {
        const parsed = JSON.parse(snap.data().valeur);
        if (Array.isArray(parsed) && parsed.length > 0) setTickerItems(parsed);
      } catch {}
    });
    return () => unsub();
  }, []);

  return (
    <main>
      <section style={{
        height: 'calc(100vh - 80px)',
        display: 'grid', gridTemplateColumns: '1fr 520px',
        borderBottom: '1px solid rgb(var(--ink)/0.08)',
        overflow: 'hidden',
      }} className="max-xl:flex max-xl:flex-col max-xl:h-auto">

        {/* ══ COLONNE GAUCHE ══ */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgb(var(--ink)/0.08)', height: '100%', overflow: 'hidden' }}>
          <HeroMap />

          <div style={{ position: 'relative', zIndex: 1, padding: '32px 48px 28px', display: 'flex', flexDirection: 'column', height: '100%' }}>

            {/* ── HAUT ── */}
            <div style={{ marginBottom: '16px' }}>
              <motion.div {...up(0.05)} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <div style={{ width: '32px', height: '1px', background: 'rgb(var(--rouge))' }} />
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.5)' }}>
                  {h.label}
                </span>
              </motion.div>

              {/* Ligne rôle éditable */}
              <motion.p {...up(0.1)} style={{ fontFamily: "'DM Mono',monospace", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.4)', marginBottom: '12px', lineHeight: 1.6 }}>
                <EditableText
                  value="Ingénieur Statisticien · Actuaire · Risk Manager · Data Scientist"
                  docRef={refs.homeVar('hero_role')}
                  isAdmin={isAdmin} as="span"
                />
              </motion.p>

              {/* Prénom */}
              <motion.h1 {...up(0.15)} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(48px, 5.5vw, 80px)', fontWeight: 700, lineHeight: 0.9, letterSpacing: '-0.04em', color: 'rgb(var(--ink))' }}>
                <EditableText value="Hamid" docRef={refs.homeVar('hero_prenom')} isAdmin={isAdmin} as="span" />
                <span style={{ color: 'rgb(var(--rouge))' }}>.</span>
              </motion.h1>
            </div>

            {/* ── Typewriter ── */}
            <motion.div {...up(0.2)} style={{ marginBottom: '16px' }}>
              <HeroTypewriter />
              {/* Bouton admin pour éditer les phrases */}
              {isAdmin && (
                <div style={{ marginTop: '6px' }}>
                  <EditableText
                    value={'["Modéliser l\'incertitude.","Quantifier le risque.","Transformer la donnée.","Prévoir. Décider. Agir.","Du bruit au signal.","IBNR. XGBoost. LSTM.","Abidjan → Afrique → monde."]'}
                    docRef={refs.homeVar('typewriter_phrases')}
                    isAdmin={isAdmin} as="span"
                    style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', color: 'rgb(var(--ink)/0.3)' }}
                  />
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', color: 'rgb(var(--ink)/0.25)', marginLeft: '6px' }}>(JSON array)</span>
                </div>
              )}
            </motion.div>

            {/* ── Accroche ── */}
            <motion.div {...up(0.28)}>
              <div style={{ width: '100%', height: '1px', background: 'rgb(var(--ink)/0.07)', marginBottom: '16px' }} />
              <p style={{ fontFamily: "'Jost',sans-serif", fontSize: '16px', fontWeight: 300, color: 'rgb(var(--ink)/0.6)', lineHeight: 1.75, maxWidth: '460px' }}>
                <EditableText value={`${h.intro} ${h.intro2}`} docRef={refs.homeVar('hero_intro')} isAdmin={isAdmin} as="span" multiline />
              </p>
            </motion.div>

            {/* ── BAS ── */}
            <div style={{ marginTop: 'auto' }}>
              <motion.div {...up(0.36)} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <Link href="/work" data-cursor-hover style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgb(var(--ink))', color: 'rgb(var(--cream))', padding: '13px 26px', fontFamily: "'DM Mono',monospace", fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  {h.cta_work} <FiArrowDownRight size={14} />
                </Link>
                <a href="/cv-hamid.pdf" download data-cursor-hover style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid rgb(var(--ink)/0.25)', color: 'rgb(var(--ink)/0.65)', padding: '13px 26px', fontFamily: "'DM Mono',monospace", fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  {h.cta_cv}
                </a>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.42, duration: 0.8 } }} style={{ borderTop: '1px solid rgb(var(--ink)/0.07)', marginTop: '16px' }}>
                <Stats />
              </motion.div>

              <motion.div {...up(0.45)} style={{ borderTop: '1px solid rgb(var(--ink)/0.07)', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Socials />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '1px', height: '32px', background: 'rgb(var(--ink)/0.1)' }} />
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.25)', writingMode: 'vertical-rl' }}>{h.scroll}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ══ COLONNE PHOTO ══ */}
        <div style={{ position: 'relative', background: 'rgb(var(--cream-dark))' }} className="max-xl:hidden">
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'rgb(var(--rouge))', zIndex: 2 }} />
          <Photo />
          <span style={{ position: 'absolute', bottom: '18px', right: '18px', zIndex: 3, fontFamily: "'DM Mono',monospace", fontSize: '11px', letterSpacing: '0.18em', color: 'rgb(var(--ink)/0.3)' }}>p. 01</span>
          {/* Localisation éditable */}
          <span style={{ position: 'absolute', bottom: '18px', left: '18px', zIndex: 3 }}>
            <EditableText
              value="Abidjan, Côte d'Ivoire"
              docRef={refs.homeVar('hero_location')}
              isAdmin={isAdmin} as="span"
              style={{ fontFamily: "'DM Mono',monospace", fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.35)' }}
            />
          </span>
        </div>
      </section>

      {/* ════ TICKER ════ */}
      <div style={{ borderBottom: '1px solid rgb(var(--ink)/0.08)', borderTop: isAdmin ? '1px dashed rgb(var(--rouge)/0.2)' : 'none' }}>
        <div style={{ overflow: 'hidden', height: '42px', display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', animation: 'marquee 22s linear infinite', whiteSpace: 'nowrap' }}>
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} style={{ fontFamily: "'DM Mono',monospace", fontSize: '12px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '0 24px', color: i % 3 === 1 ? 'rgb(var(--rouge)/0.7)' : 'rgb(var(--ink)/0.45)' }}>{item}</span>
            ))}
          </div>
        </div>
        <TickerAdmin items={tickerItems} isAdmin={isAdmin} docRef={refs.homeVar('ticker_items')} />
      </div>

      {/* ════ DATA UNIVERSE ════ */}
      <section style={{ borderBottom: '1px solid rgb(var(--ink)/0.08)' }}>
        <DataUniverse />
      </section>

      <ThemeColorsPanel />
      <AdminManager />
    </main>
  );
}