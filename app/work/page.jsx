'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '@/context/LangContext';
import { BsArrowUpRight, BsGithub } from 'react-icons/bs';
import EditableText from '@/components/EditableText';
import useAdmin from '@/components/hook/useAdmin';
import { refs } from '@/lib/refs';
import { useTranslatedObjects } from '@/hooks/useTranslatedArray';

const PROJECTS_BASE = [
  { num:'01', code:'proj_01', category:'Actuariat',       year:'2024', title:'Modèle de provisionnement IBNR',      description:"Développement d'un modèle Chain-Ladder augmenté par bootstrap pour l'estimation des provisions IBNR. Réduction de l'erreur de prédiction de 18%.", stack:['R','Chain-Ladder','Bootstrap','ggplot2'], live:'', github:'' },
  { num:'02', code:'proj_02', category:'Économétrie',     year:'2023', title:'Impact du crédit sur la croissance',  description:"Étude en données de panel (80 pays, 30 ans) de l'effet du crédit bancaire sur le PIB per capita. Modèles GMM-Arellano-Bond.", stack:['Stata','Panel GMM','IV','LaTeX'], live:'', github:'' },
  { num:'03', code:'proj_03', category:'Machine Learning', year:'2024', title:'Scoring crédit par gradient boosting', description:"Modèle de scoring XGBoost + SHAP pour l'interprétabilité. AUC 0.89. Interface de visualisation des décisions de crédit.", stack:['Python','XGBoost','SHAP','Streamlit'], live:'', github:'' },
  { num:'04', code:'proj_04', category:'Data Science',    year:'2023', title:'Prévision de séries temporelles',     description:"Prévision de demande énergétique à 12 mois par combinaison SARIMA, Prophet et LSTM.", stack:['Python','Prophet','LSTM','SARIMA'], live:'', github:'' },
  { num:'05', code:'proj_05', category:'Statistique',     year:'2022', title:'Dashboard épidémiologique',           description:"Tableau de bord interactif pour le suivi d'indicateurs de santé publique. Automatisation des rapports hebdomadaires.", stack:['R','Shiny','Power BI','SQL'], live:'', github:'' },
];

export default function WorkPage() {
  const { tr } = useLang(); const w = tr.work;
  const { isAdmin } = useAdmin();
  const [hovered, setHovered] = useState(null);

  /* Traduit titres, descriptions et catégories */
  const projects = useTranslatedObjects(PROJECTS_BASE, ['title','description','category']);

  return (
    <main>
      <section style={{ padding:'80px 40px', borderBottom:'1px solid rgb(var(--ink)/0.08)' }}>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'24px' }}>
          <div style={{ width:'28px', height:'1px', background:'rgb(var(--rouge))' }} />
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', letterSpacing:'0.25em', textTransform:'uppercase', color:'rgb(var(--ink)/0.35)' }}>{w.section}</span>
        </motion.div>
        <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0,transition:{delay:0.1}}} style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(60px,7vw,110px)', fontWeight:700, lineHeight:0.9, letterSpacing:'-0.04em', whiteSpace:'pre-line' }}>
          {w.title}
        </motion.h1>
      </section>

      <section style={{ padding:'0 40px' }}>
        {projects.map((p, i) => (
          <motion.article key={p.num}
            initial={{opacity:0}} animate={{opacity:1,transition:{delay:0.1+i*0.08}}}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
            style={{ display:'grid', gridTemplateColumns:'60px 1fr auto', gap:'32px', alignItems:'center', padding:'36px 0', borderBottom:'1px solid rgb(var(--ink)/0.07)', transition:'background .3s', background: hovered===i ? 'rgb(var(--cream-dark)/0.4)' : 'transparent', marginLeft:'-40px', marginRight:'-40px', paddingLeft:'40px', paddingRight:'40px' }}
            className="max-xl:grid-cols-1"
          >
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:'11px', letterSpacing:'0.15em', color:'rgb(var(--ink)/0.25)' }}>{p.num}</span>
            <div>
              <div style={{ display:'flex', alignItems:'baseline', gap:'12px', marginBottom:'6px', flexWrap:'wrap' }}>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgb(var(--rouge)/0.7)' }}>{p.category}</span>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', color:'rgb(var(--ink)/0.2)' }}>
                  <EditableText value={PROJECTS_BASE[i].year} docRef={refs.workVar(`${p.code}_year`)} isAdmin={isAdmin} as="span" />
                </span>
              </div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(20px,2.5vw,30px)', fontWeight:600, color: hovered===i ? 'rgb(var(--rouge))' : 'rgb(var(--ink))', marginBottom:'8px', transition:'color .2s' }}>
                <EditableText value={p.title} docRef={refs.workVar(`${p.code}_title`)} isAdmin={isAdmin} as="span" />
              </h2>
              <p style={{ fontFamily:"'Jost',sans-serif", fontSize:'13px', fontWeight:300, color:'rgb(var(--ink)/0.45)', lineHeight:1.6, maxWidth:'540px', marginBottom:'12px' }}>
                <EditableText value={p.description} docRef={refs.workVar(`${p.code}_desc`)} isAdmin={isAdmin} as="span" multiline />
              </p>
              {/* Stack — noms techniques, non traduits */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                {PROJECTS_BASE[i].stack.map((t) => (
                  <span key={t} style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', letterSpacing:'0.1em', textTransform:'uppercase', padding:'2px 8px', border:'1px solid rgb(var(--ink)/0.1)', color:'rgb(var(--ink)/0.35)' }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', gap:'10px' }}>
              {isAdmin ? (
                <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:'8px', color:'rgb(var(--ink)/0.3)' }}>LIVE</span>
                    <EditableText value={PROJECTS_BASE[i].live || 'https://'} docRef={refs.workVar(`${p.code}_live`)} isAdmin={isAdmin} as="span" style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', color:'rgb(var(--ink)/0.4)' }} />
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:'8px', color:'rgb(var(--ink)/0.3)' }}>GH</span>
                    <EditableText value={PROJECTS_BASE[i].github || 'https://github.com/'} docRef={refs.workVar(`${p.code}_github`)} isAdmin={isAdmin} as="span" style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', color:'rgb(var(--ink)/0.4)' }} />
                  </div>
                </div>
              ) : (
                <>
                  {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer" style={{ width:'36px', height:'36px', border:'1px solid rgb(var(--ink)/0.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'rgb(var(--ink)/0.4)' }}><BsArrowUpRight size={13} /></a>}
                  {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ width:'36px', height:'36px', border:'1px solid rgb(var(--ink)/0.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'rgb(var(--ink)/0.4)' }}><BsGithub size={13} /></a>}
                  {!p.live && !p.github && <span style={{ fontFamily:"'DM Mono',monospace", fontSize:'8px', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgb(var(--ink)/0.2)' }}>{w.soon}</span>}
                </>
              )}
            </div>
          </motion.article>
        ))}
      </section>
    </main>
  );
}