'use client';
import { motion } from 'framer-motion';
import { useLang } from '@/context/LangContext';

const EXPERIENCE = [
  {
    period: '2025 — jan. 2026',
    role: 'Consultant Risk Management & ALM',
    company: "Heymann's Inc · Abidjan",
    desc: "Automatisation des indicateurs de liquidité (LCR/NSFR) et stress-tests via VBA. Calcul des indicateurs de risque de taux (duration, sensibilité, gap). Production de tableaux de bord Power BI pour le suivi du portefeuille.",
    tags: ['VBA', 'Power BI', 'Excel', 'ALM', 'LCR/NSFR'],
  },
  {
    period: 'Août — sept. 2025',
    role: 'Stagiaire — Analyse de données',
    company: 'ENSEA · Abidjan',
    desc: "Enquête 2025 sur agriculture, sécurité alimentaire et santé à Abengourou. Apurement de bases volumineuses sous R. Construction d'indices composites (FCS, FIES, HDDS) et d'un indice de niveau de vie par ACP.",
    tags: ['R', 'ACP', 'Data cleaning', 'Indices composites'],
  },
  {
    period: '2023 — juil. 2025',
    role: 'Consultant & Membre',
    company: 'ENSEA Junior Services · Abidjan',
    desc: "Tableaux de bord interactifs Power BI/Excel pour PME. Accompagnement dans l'analyse des données opérationnelles et financières. Scripts Python et SQL pour extraction et transformation de données.",
    tags: ['Python', 'SQL', 'Power BI', 'Excel'],
  },
  {
    period: '2022 — 2023',
    role: 'Vice-Président — Commission Informatique & Affichage',
    company: 'ACPEC · INP-HB Yamoussoukro',
    desc: "Stratégie de communication digitale, coordination d'une équipe de 5 membres. Production de supports visuels pour événements académiques.",
    tags: ['Adobe Suite', 'Canva', 'Communication'],
  },
];

const EDUCATION = [
  {
    period: '2023 — présent',
    degree: 'Ingénieur Statisticien-Économiste (ISE) / Actuaire',
    school: 'ENSEA · Abidjan + Double diplôme Master Actuariat ISFA Lyon',
    desc: 'Économétrie avancée, Data Mining, Machine Learning, Macroéconomie, Analyse des risques, Python, R, VBA, SQL.',
  },
  {
    period: '2021 — 2023',
    degree: 'Classes Préparatoires Économiques & Commerciales (option scientifique)',
    school: 'INP-HB · Yamoussoukro',
    desc: 'Admis aux concours de l\'ENSEA et de l\'ESCAE de Yamoussoukro.',
  },
  {
    period: '2021',
    degree: 'Baccalauréat Série D',
    school: 'Prytanée Militaire du Kadiogo · Ouagadougou (Burkina Faso)',
    desc: 'Brevet de Secourisme Niveau 1.',
  },
];

const CERTS = [
  { year: 'Fév. 2026', label: 'TOEIC Listening & Reading — 885/990 (CEFR B2)' },
  { year: '2024', label: 'Build Your Analytical Skills with Statistical Analysis — Coursera' },
  { year: '2024', label: 'Devenir Analyste de Données — Udemy (Tableau, Excel, Power BI)' },
];

const HARD_SKILLS = [
  { cat: 'Risques & Conformité', items: ['LCR / NSFR', 'ALM', 'Risque de crédit', 'Stress tests', 'Réglementaire'] },
  { cat: 'Quantitatif',          items: ['Régression & Économétrie', 'ACP / Data Mining', 'Machine Learning', 'Statistiques', 'Actuariat (en cours)'] },
  { cat: 'Programmation',        items: ['Python', 'R', 'VBA / Excel avancé', 'SQL', 'Git', 'Power BI'] },
  { cat: 'Langues',              items: ['Français — maternelle', 'Anglais — B2 · TOEIC 885'] },
];

const SOFT_SKILLS = ['Rigueur analytique', 'Autonomie', 'Travail en équipe', 'Discrétion', 'Initiative', 'Curiosité intellectuelle', 'Communication', 'Esprit critique'];

const up = (d = 0) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { delay: d, duration: 0.6, ease: [0.16,1,0.3,1] } } });

function TimelineItem({ period, title, sub, desc, tags }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '20px', paddingBottom: '28px', borderBottom: '1px solid rgb(var(--ink)/0.06)', marginBottom: '28px' }}>
      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.1em', color: 'rgb(var(--rouge)/0.7)', paddingTop: '3px', lineHeight: 1.6 }}>{period}</span>
      <div>
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '18px', fontWeight: 600, color: 'rgb(var(--ink))', marginBottom: '2px' }}>{title}</h3>
        <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.1em', color: 'rgb(var(--ink)/0.35)', textTransform: 'uppercase', marginBottom: '8px' }}>{sub}</p>
        {desc && <p style={{ fontFamily: "'Jost',sans-serif", fontSize: '13px', fontWeight: 300, color: 'rgb(var(--ink)/0.5)', lineHeight: 1.65, marginBottom: '10px' }}>{desc}</p>}
        {tags && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {tags.map((t) => (
              <span key={t} style={{ fontFamily: "'DM Mono',monospace", fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 7px', border: '1px solid rgb(var(--ink)/0.1)', color: 'rgb(var(--ink)/0.35)' }}>{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ num, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.2em', color: 'rgb(var(--rouge)/0.7)' }}>{num}</span>
      <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '18px', fontWeight: 600, color: 'rgb(var(--ink))' }}>{label}</span>
      <div style={{ flex: 1, height: '1px', background: 'rgb(var(--ink)/0.08)' }} />
    </div>
  );
}

export default function ResumePage() {
  const { tr } = useLang();
  const r = tr.resume;

  return (
    <main>
      <section style={{ padding: '80px 40px', borderBottom: '1px solid rgb(var(--ink)/0.08)' }}>
        <motion.div {...up(0.1)} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ width: '28px', height: '1px', background: 'rgb(var(--rouge))' }} />
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.35)' }}>{r.section}</span>
        </motion.div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <motion.h1 {...up(0.15)} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(60px, 7vw, 110px)', fontWeight: 700, lineHeight: 0.9, letterSpacing: '-0.04em', whiteSpace: 'pre-line' }}>
            {r.title}
          </motion.h1>
          <motion.a {...up(0.25)} href="/cv-hamid.pdf" download data-cursor-hover style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '10px 20px', border: '1px solid rgb(var(--ink)/0.2)', color: 'rgb(var(--ink)/0.6)', marginBottom: '8px', display: 'inline-block', textDecoration: 'none' }}>
            {r.dl}
          </motion.a>
        </div>
      </section>

      <section style={{ padding: '60px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px' }} className="max-xl:block">
          <motion.div {...up(0.2)}>
            <SectionLabel num="01" label={r.experience} />
            {EXPERIENCE.map((e) => <TimelineItem key={e.role} period={e.period} title={e.role} sub={e.company} desc={e.desc} tags={e.tags} />)}
          </motion.div>

          <div>
            <motion.div {...up(0.3)}>
              <SectionLabel num="02" label={r.education} />
              {EDUCATION.map((e) => <TimelineItem key={e.degree} period={e.period} title={e.degree} sub={e.school} desc={e.desc} />)}
            </motion.div>

            <motion.div {...up(0.4)} style={{ marginTop: '40px' }}>
              <SectionLabel num="03" label="Certifications" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {CERTS.map((c) => (
                  <div key={c.label} style={{ display: 'flex', gap: '16px', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', color: 'rgb(var(--rouge)/0.6)', flexShrink: 0, width: '60px' }}>{c.year}</span>
                    <span style={{ fontFamily: "'Jost',sans-serif", fontSize: '12px', fontWeight: 300, color: 'rgb(var(--ink)/0.55)', lineHeight: 1.5 }}>{c.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...up(0.45)} style={{ marginTop: '40px' }}>
              <SectionLabel num="04" label={r.soft} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {SOFT_SKILLS.map((s) => (
                  <span key={s} style={{ fontFamily: "'Jost',sans-serif", fontSize: '12px', fontWeight: 300, padding: '4px 12px', border: '1px solid rgb(var(--ink)/0.1)', color: 'rgb(var(--ink)/0.5)' }}>{s}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div {...up(0.5)} style={{ marginTop: '64px', borderTop: '1px solid rgb(var(--ink)/0.08)', paddingTop: '48px' }}>
          <SectionLabel num="05" label={r.hard} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }} className="max-xl:grid-cols-2">
            {HARD_SKILLS.map((g) => (
              <div key={g.cat}>
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.25)', marginBottom: '12px' }}>{g.cat}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {g.items.map((s) => (
                    <span key={s} style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'rgb(var(--ink)/0.55)', letterSpacing: '0.04em' }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...up(0.55)} style={{ marginTop: '48px', borderTop: '1px solid rgb(var(--ink)/0.08)', paddingTop: '32px' }}>
          <SectionLabel num="06" label="Centres d'intérêt" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['Programmation de mini-jeux web', 'Design graphique (Adobe Suite, Canva)', 'Volleyball', 'Natation'].map((i) => (
              <span key={i} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '14px', fontStyle: 'italic', padding: '4px 14px', border: '1px solid rgb(var(--ink)/0.1)', color: 'rgb(var(--ink)/0.5)' }}>{i}</span>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
