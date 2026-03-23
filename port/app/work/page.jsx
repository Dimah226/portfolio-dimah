'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useLang } from '@/context/LangContext';
import { BsArrowUpRight, BsGithub } from 'react-icons/bs';

const PROJECTS = [
  {
    num: '01', category: 'Actuariat',
    title: 'Modèle de provisionnement IBNR',
    description: 'Développement d\'un modèle Chain-Ladder augmenté par bootstrap pour l\'estimation des provisions IBNR d\'un portefeuille auto. Réduction de l\'erreur de prédiction de 18%.',
    stack: ['R', 'Chain-Ladder', 'Bootstrap', 'ggplot2'],
    year: '2024', live: '', github: '',
    accent: '#B84A2F',
  },
  {
    num: '02', category: 'Économétrie',
    title: 'Impact du crédit sur la croissance',
    description: 'Étude en données de panel (80 pays, 30 ans) de l\'effet du crédit bancaire sur le PIB per capita. Modèles GMM-Arellano-Bond pour corriger l\'endogénéité.',
    stack: ['Stata', 'Panel GMM', 'IV', 'LaTeX'],
    year: '2023', live: '', github: '',
    accent: '#2A2722',
  },
  {
    num: '03', category: 'Machine Learning',
    title: 'Scoring crédit par gradient boosting',
    description: 'Modèle de scoring pour une institution financière : XGBoost + SHAP pour l\'interprétabilité. AUC 0.89. Interface de visualisation des décisions de crédit.',
    stack: ['Python', 'XGBoost', 'SHAP', 'Streamlit'],
    year: '2024', live: '', github: '',
    accent: '#B84A2F',
  },
  {
    num: '04', category: 'Data Science',
    title: 'Prévision de séries temporelles',
    description: 'Prévision de demande énergétique à 12 mois par combinaison SARIMA, Prophet et LSTM. Comparaison rigoureuse des performances hors échantillon.',
    stack: ['Python', 'Prophet', 'LSTM', 'SARIMA'],
    year: '2023', live: '', github: '',
    accent: '#2A2722',
  },
  {
    num: '05', category: 'Statistique',
    title: 'Dashboard épidémiologique',
    description: 'Tableau de bord interactif pour le suivi d\'indicateurs de santé publique. Automatisation des rapports hebdomadaires et alertes statistiques.',
    stack: ['R', 'Shiny', 'Power BI', 'SQL'],
    year: '2022', live: '', github: '',
    accent: '#B84A2F',
  },
];

export default function WorkPage() {
  const { tr } = useLang();
  const w = tr.work;
  const [hovered, setHovered] = useState(null);

  return (
    <main>
      {/* ── EN-TÊTE ── */}
      <section style={{ padding: '80px 40px', borderBottom: '1px solid rgb(var(--ink)/0.08)' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ width: '28px', height: '1px', background: 'rgb(var(--rouge))' }} />
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.35)' }}>{w.section}</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.7 } }} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(60px, 7vw, 110px)', fontWeight: 700, lineHeight: 0.9, letterSpacing: '-0.04em', whiteSpace: 'pre-line' }}>
          {w.title}
        </motion.h1>
      </section>

      {/* ── LISTE DE PROJETS (style "table des matières magazine") ── */}
      <section style={{ padding: '0 40px' }}>
        {PROJECTS.map((p, i) => (
          <motion.article
            key={p.num}
            initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1 + i * 0.08 } }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'grid', gridTemplateColumns: '60px 1fr auto',
              gap: '32px', alignItems: 'center',
              padding: '36px 0',
              borderBottom: '1px solid rgb(var(--ink)/0.07)',
              transition: 'background .3s',
              background: hovered === i ? 'rgb(var(--cream-dark)/0.4)' : 'transparent',
              marginLeft: '-40px', marginRight: '-40px', paddingLeft: '40px', paddingRight: '40px',
              cursor: 'pointer',
            }}
            className="max-xl:grid-cols-1"
          >
            {/* Numéro */}
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '11px', letterSpacing: '0.15em', color: 'rgb(var(--ink)/0.25)' }}>{p.num}</span>

            {/* Texte */}
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgb(var(--rouge)/0.7)' }}>{p.category}</span>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', color: 'rgb(var(--ink)/0.2)' }}>{p.year}</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(20px, 2.5vw, 30px)', fontWeight: 600, color: 'rgb(var(--ink))', marginBottom: '8px', transition: 'color .2s', ...(hovered === i && { color: 'rgb(var(--rouge))' }) }}>
                {p.title}
              </h2>
              <p style={{ fontFamily: "'Jost',sans-serif", fontSize: '13px', fontWeight: 300, color: 'rgb(var(--ink)/0.45)', lineHeight: 1.6, maxWidth: '540px', marginBottom: '12px' }}>{p.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {p.stack.map((t) => (
                  <span key={t} style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 8px', border: '1px solid rgb(var(--ink)/0.1)', color: 'rgb(var(--ink)/0.35)' }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Liens */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {p.live ? (
                <a href={p.live} target="_blank" rel="noopener noreferrer" data-cursor-hover style={{ width: '36px', height: '36px', border: '1px solid rgb(var(--ink)/0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(var(--ink)/0.4)', transition: 'border-color .2s,color .2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgb(var(--rouge))'; e.currentTarget.style.color = 'rgb(var(--rouge))'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgb(var(--ink)/0.15)'; e.currentTarget.style.color = 'rgb(var(--ink)/0.4)'; }}>
                  <BsArrowUpRight size={13} />
                </a>
              ) : null}
              {p.github ? (
                <a href={p.github} target="_blank" rel="noopener noreferrer" data-cursor-hover style={{ width: '36px', height: '36px', border: '1px solid rgb(var(--ink)/0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(var(--ink)/0.4)', transition: 'border-color .2s,color .2s' }}>
                  <BsGithub size={13} />
                </a>
              ) : null}
              {!p.live && !p.github && (
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.2)', alignSelf: 'center' }}>{w.soon}</span>
              )}
            </div>
          </motion.article>
        ))}
      </section>
    </main>
  );
}
