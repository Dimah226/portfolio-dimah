'use client';
import { motion } from 'framer-motion';
import { useLang } from '@/context/LangContext';

const SKILLS = [
  { name: 'Python',      pct: 90 },
  { name: 'R',           pct: 88 },
  { name: 'SQL',         pct: 82 },
  { name: 'SAS',         pct: 75 },
  { name: 'Stata',       pct: 72 },
  { name: 'Excel / VBA', pct: 85 },
  { name: 'Power BI',    pct: 78 },
  { name: 'LaTeX',       pct: 80 },
];

const DOMAINS = [
  'Statistique inférentielle', 'Économétrie', 'Modélisation actuarielle',
  'Machine Learning', 'Séries temporelles', 'Analyse de risque',
  'Data Visualization', 'Probabilités', 'NLP', 'Recherche opérationnelle',
];

const VALUES = [
  { sym: '∑', title: 'Rigueur analytique', desc: 'Chaque modèle repose sur des hypothèses solides et vérifiables.' },
  { sym: '→', title: 'Impact concret',     desc: 'Une analyse n\'a de valeur que si elle guide une décision réelle.' },
  { sym: '⟳', title: 'Curiosité continue', desc: 'La data science évolue vite — je reste à la pointe des méthodes.' },
];

const up = (d = 0) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { delay: d, duration: 0.7, ease: [0.16,1,0.3,1] } } });

export default function AboutPage() {
  const { tr } = useLang();
  const a = tr.about;

  return (
    <main>
      {/* ── EN-TÊTE MAGAZINE ── */}
      <section style={{ padding: '80px 40px 0', borderBottom: '1px solid rgb(var(--ink)/0.08)' }}>
        <motion.div {...up(0.1)} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ width: '28px', height: '1px', background: 'rgb(var(--rouge))' }} />
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.35)' }}>{a.section}</span>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', paddingBottom: '60px' }} className="max-xl:block">
          <motion.h1 {...up(0.15)} style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 'clamp(60px, 7vw, 110px)', fontWeight: 700,
            lineHeight: 0.9, letterSpacing: '-0.04em',
            whiteSpace: 'pre-line',
          }}>
            {a.title}<span style={{ color: 'rgb(var(--rouge))' }}></span>
          </motion.h1>

          {/* Pull quote */}
          <motion.div {...up(0.25)} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '8px', paddingTop: '40px' }}>
            <div style={{ width: '32px', height: '2px', background: 'rgb(var(--rouge))', marginBottom: '20px' }} />
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '20px', fontWeight: 400, fontStyle: 'italic', lineHeight: 1.6, color: 'rgb(var(--ink)/0.75)', marginBottom: '16px' }}>
              « {a.p3} »
            </p>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.15em', color: 'rgb(var(--ink)/0.3)', textTransform: 'uppercase' }}>— Hamid</p>
          </motion.div>
        </div>
      </section>

      {/* ── BIO + VALEURS ── */}
      <section style={{ padding: '60px 40px', borderBottom: '1px solid rgb(var(--ink)/0.08)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px' }} className="max-xl:block max-xl:gap-8">
        <motion.div {...up(0.2)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[a.p1, a.p2].map((p, i) => (
            <p key={i} style={{ fontFamily: "'Jost',sans-serif", fontSize: '15px', fontWeight: 300, lineHeight: 1.8, color: 'rgb(var(--ink)/0.65)' }}>{p}</p>
          ))}
        </motion.div>

        <motion.div {...up(0.3)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {VALUES.map((v) => (
            <div key={v.title} style={{ display: 'flex', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid rgb(var(--ink)/0.06)' }}>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '20px', color: 'rgb(var(--rouge))', width: '28px', flexShrink: 0, marginTop: '2px' }}>{v.sym}</span>
              <div>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '16px', fontWeight: 600, color: 'rgb(var(--ink))', marginBottom: '4px' }}>{v.title}</p>
                <p style={{ fontFamily: "'Jost',sans-serif", fontSize: '13px', fontWeight: 300, color: 'rgb(var(--ink)/0.5)', lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── SKILLS TECHNIQUES ── */}
      <section style={{ padding: '60px 40px', borderBottom: '1px solid rgb(var(--ink)/0.08)' }}>
        <motion.p {...up(0.1)} style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.3)', marginBottom: '32px' }}>{a.skills_title}</motion.p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 80px' }} className="max-xl:grid-cols-1">
          {SKILLS.map((s, i) => (
            <motion.div key={s.name} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.15 + i * 0.05 } }} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.1em', color: 'rgb(var(--ink)/0.4)', width: '80px', flexShrink: 0 }}>{s.name}</span>
              <div style={{ flex: 1, height: '1px', background: 'rgb(var(--ink)/0.08)', position: 'relative' }}>
                <motion.div
                  style={{ position: 'absolute', top: '-0.5px', left: 0, height: '2px', background: 'rgb(var(--rouge))', transformOrigin: 'left' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${s.pct}%`, transition: { delay: 0.4 + i * 0.05, duration: 0.8, ease: [0.16,1,0.3,1] } }}
                />
              </div>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'rgb(var(--rouge)/0.7)', width: '32px', textAlign: 'right' }}>{s.pct}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── DOMAINES ── */}
      <section style={{ padding: '60px 40px' }}>
        <motion.p {...up(0.1)} style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.3)', marginBottom: '24px' }}>{a.domains_title}</motion.p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {DOMAINS.map((d, i) => (
            <motion.span key={d} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1, transition: { delay: 0.1 + i * 0.03 } }}
              style={{ fontFamily: "'Jost',sans-serif", fontSize: '12px', fontWeight: 300, padding: '6px 14px', border: '1px solid rgb(var(--ink)/0.12)', color: 'rgb(var(--ink)/0.55)' }}>
              {d}
            </motion.span>
          ))}
        </div>
      </section>
    </main>
  );
}
