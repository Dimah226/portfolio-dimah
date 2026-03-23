'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLang } from '@/context/LangContext';
import Photo from '@/components/Photo';
import Stats from '@/components/Stats';
import Socials from '@/components/Socials';
import { FiArrowDownRight } from 'react-icons/fi';
import DataUniverse from '@/components/DataUniverse';

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0, transition: { delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
});

const TICKER_ITEMS = [
  'Risk Management', 'ALM', 'LCR/NSFR', 'Stress-tests',
  'Économétrie', 'Machine Learning', 'Actuariat', 'Power BI',
  'Python', 'R', 'VBA', 'SQL', 'ENSEA', 'ISFA Lyon',
];

const ROLES_FR = ['Ingénieur Statisticien-Économiste', 'Actuaire (en cours)', 'Risk Management & ALM', 'ENSEA Abidjan · ISFA Lyon'];

export default function Home() {
  const { tr, lang } = useLang();
  const h = tr.hero;

  return (
    <main>
      {/* ════ HERO ════ */}
      <section style={{
        minHeight: 'calc(100vh - 80px)',
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        borderBottom: '1px solid rgb(var(--ink)/0.08)',
        overflow: 'hidden',
      }} className="max-xl:flex max-xl:flex-col">

        {/* ── Colonne texte ── */}
        <div style={{ padding: '60px 40px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid rgb(var(--ink)/0.08)' }}>

          <motion.div {...up(0.1)} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
            <div style={{ width: '28px', height: '1px', background: 'rgb(var(--rouge))' }} />
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.4)' }}>{h.label}</span>
          </motion.div>

          <div style={{ flex: 1 }}>
            {/* Spécialités */}
            <motion.div {...up(0.15)} style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
              {ROLES_FR.map((r) => (
                <span key={r} style={{ fontFamily: "'DM Mono',monospace", fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase', padding: '3px 8px', border: '1px solid rgb(var(--ink)/0.12)', color: 'rgb(var(--ink)/0.4)' }}>{r}</span>
              ))}
            </motion.div>

            {/* Nom massif */}
            <motion.p {...up(0.18)} style={{ fontFamily: "'DM Mono',monospace", fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.3)', marginBottom: '6px' }}>
              Robgo Abdul Hamid Al Haqq
            </motion.p>

            <motion.h1 {...up(0.22)} style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 'clamp(72px, 9vw, 136px)',
              fontWeight: 700, lineHeight: 0.88, letterSpacing: '-0.04em',
              color: 'rgb(var(--ink))', marginBottom: '6px',
            }}>
              Hamid
            </motion.h1>

            <motion.div {...up(0.27)} style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '28px' }}>
              <span style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 'clamp(60px, 7.5vw, 110px)',
                fontWeight: 300, fontStyle: 'italic', lineHeight: 0.9,
                letterSpacing: '-0.04em', color: 'rgb(var(--ink)/0.15)',
              }}>Dimah</span>
              <span style={{ color: 'rgb(var(--rouge))', fontSize: 'clamp(60px, 7vw, 100px)', fontFamily: "'Cormorant Garamond',serif", lineHeight: 1 }}>.</span>
            </motion.div>

            <motion.p {...up(0.32)} style={{ fontFamily: "'Jost',sans-serif", fontSize: '15px', fontWeight: 300, color: 'rgb(var(--ink)/0.5)', lineHeight: 1.8, maxWidth: '440px', marginBottom: '36px' }}>
              {h.intro} <em style={{ color: 'rgb(var(--ink))', fontStyle: 'italic', fontFamily: "'Cormorant Garamond',serif", fontSize: '17px' }}>{h.intro2}</em>
            </motion.p>

            {/* CTA */}
            <motion.div {...up(0.38)} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '44px' }}>
              <Link href="/work" data-cursor-hover style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgb(var(--ink))', color: 'rgb(var(--cream))',
                padding: '12px 24px',
                fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
              }}>
                {h.cta_work} <FiArrowDownRight size={13} />
              </Link>
              <a href="/cv-hamid.pdf" download data-cursor-hover style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                border: '1px solid rgb(var(--ink)/0.2)', color: 'rgb(var(--ink)/0.55)',
                padding: '12px 24px',
                fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
              }}>
                {h.cta_cv}
              </a>
            </motion.div>

            <motion.div {...up(0.44)}>
              <Socials
                containerStyles="flex gap-3"
                iconStyles="w-8 h-8 border border-ink/15 flex items-center justify-center text-sm text-ink/40 hover:border-rouge hover:text-rouge transition-all duration-200"
              />
            </motion.div>
          </div>

          {/* Indicateur scroll */}
          <motion.div {...up(0.6)} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '36px' }}>
            <div style={{ width: '1px', height: '36px', background: 'rgb(var(--ink)/0.12)' }} />
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '8px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.22)', writingMode: 'vertical-rl' }}>{h.scroll}</span>
          </motion.div>
        </div>

        {/* ── Colonne photo (style encart magazine) ── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5, duration: 1 } }}
          style={{ position: 'relative', background: 'rgb(var(--cream-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}
          className="max-xl:hidden"
        >
          {/* Filet décoratif haut */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'rgb(var(--rouge))' }} />
          {/* Numéro de page */}
          <span style={{ position: 'absolute', bottom: '16px', right: '16px', fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.2em', color: 'rgb(var(--ink)/0.2)' }}>p. 01</span>
          {/* Localisation */}
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.25)' }}>Abidjan, Côte d'Ivoire</span>
          </div>
          <Photo />
        </motion.div>
      </section>

      {/* ════ DATA UNIVERSE ════ */}
      <section style={{ borderBottom: '1px solid rgb(var(--ink)/0.08)' }}>
        <DataUniverse />
      </section>

      {/* ════ TICKER ════ */}
      <div style={{ borderBottom: '1px solid rgb(var(--ink)/0.08)', overflow: 'hidden', height: '38px', display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', animation: 'marquee 22s linear infinite', whiteSpace: 'nowrap' }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} style={{ fontFamily: "'DM Mono',monospace", fontSize: '8px', letterSpacing: '0.28em', textTransform: 'uppercase', padding: '0 20px', color: i % 3 === 1 ? 'rgb(var(--rouge)/0.5)' : 'rgb(var(--ink)/0.25)' }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ════ STATS ════ */}
      <section style={{ padding: '72px 40px', borderBottom: '1px solid rgb(var(--ink)/0.08)' }}>
        <Stats />
      </section>
    </main>
  );
}
