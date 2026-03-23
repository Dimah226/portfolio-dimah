'use client';
import { motion } from 'framer-motion';
import { useLang } from '@/context/LangContext';
import Link from 'next/link';
import EditableText from '@/components/EditableText';
import useAdmin from '@/components/hook/useAdmin';
import { refs } from '@/lib/refs';
import { useTranslatedObjects } from '@/hooks/useTranslatedArray';

const SERVICES_BASE = [
  { code:'01', icon:'∑', titleKey:'svc_01_title', descKey:'svc_01_desc', title:'Analyse statistique', desc:"Tests d'hypothèses, intervalles de confiance, ANOVA, régression — je donne du sens à vos données.", tags:['R','Python','SPSS','SAS'] },
  { code:'02', icon:'⌒', titleKey:'svc_02_title', descKey:'svc_02_desc', title:'Économétrie',         desc:"Modèles à données de panel, MCO, instruments, DID, VAR — j'identifie les relations causales.", tags:['Stata','R','Python','EViews'] },
  { code:'03', icon:'⊕', titleKey:'svc_03_title', descKey:'svc_03_desc', title:'Actuariat',           desc:"Tarification, provisionnement, mortalité, modèles de risque. Je modélise l'incertitude.", tags:['R','SAS','Excel','VBA'] },
  { code:'04', icon:'◈', titleKey:'svc_04_title', descKey:'svc_04_desc', title:'Machine Learning',    desc:"Modèles prédictifs supervisés et non supervisés, NLP, séries temporelles.", tags:['Python','scikit-learn','XGBoost','TensorFlow'] },
  { code:'05', icon:'⊞', titleKey:'svc_05_title', descKey:'svc_05_desc', title:'Data Engineering',   desc:"Nettoyage, transformation et structuration de données massives.", tags:['SQL','Python','Pandas','dbt'] },
  { code:'06', icon:'◎', titleKey:'svc_06_title', descKey:'svc_06_desc', title:'Reporting & Dataviz', desc:"Dashboards interactifs, rapports automatisés, visualisations impactantes.", tags:['Power BI','ggplot2','Plotly','Tableau'] },
];

const up = (d=0) => ({ initial:{opacity:0,y:20}, animate:{opacity:1,y:0,transition:{delay:d,duration:0.7,ease:[0.16,1,0.3,1]}} });

export default function ServicesPage() {
  const { tr } = useLang(); const s = tr.services;
  const { isAdmin } = useAdmin();
  /* Traduit les titres et les tags */
  const services = useTranslatedObjects(SERVICES_BASE, ['title','desc']);

  return (
    <main>
      <section style={{ padding:'80px 40px', borderBottom:'1px solid rgb(var(--ink)/0.08)' }}>
        <motion.div {...up(0.1)} style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'24px' }}>
          <div style={{ width:'28px', height:'1px', background:'rgb(var(--rouge))' }} />
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', letterSpacing:'0.25em', textTransform:'uppercase', color:'rgb(var(--ink)/0.35)' }}>{s.section}</span>
        </motion.div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'60px' }} className="max-xl:block">
          <motion.h1 {...up(0.15)} style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(60px,7vw,110px)', fontWeight:700, lineHeight:0.9, letterSpacing:'-0.04em', whiteSpace:'pre-line' }}>{s.title}</motion.h1>
          <motion.p {...up(0.25)} style={{ fontFamily:"'Jost',sans-serif", fontSize:'15px', fontWeight:300, color:'rgb(var(--ink)/0.5)', lineHeight:1.8, maxWidth:'420px', alignSelf:'end', paddingBottom:'8px' }}>{s.desc}</motion.p>
        </div>
      </section>

      <section style={{ padding:'0 40px' }}>
        {services.map((svc, i) => (
          <motion.article key={svc.code}
            initial={{opacity:0}} animate={{opacity:1,transition:{delay:0.1+i*0.07}}}
            style={{ display:'grid', gridTemplateColumns:'80px 1fr auto', gap:'32px', alignItems:'start', padding:'40px 0', borderBottom:'1px solid rgb(var(--ink)/0.07)' }}
            className="max-xl:grid-cols-1"
          >
            <div><span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'48px', fontWeight:300, color:'rgb(var(--ink)/0.08)', lineHeight:1 }}>{svc.code}</span></div>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'10px' }}>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:'18px', color:'rgb(var(--rouge))' }}>{svc.icon}</span>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'22px', fontWeight:600, color:'rgb(var(--ink))' }}>
                  <EditableText value={svc.title} docRef={refs.serviceVar(svc.titleKey)} isAdmin={isAdmin} as="span" />
                </h2>
              </div>
              <p style={{ fontFamily:"'Jost',sans-serif", fontSize:'14px', fontWeight:300, color:'rgb(var(--ink)/0.55)', lineHeight:1.7, maxWidth:'480px', marginBottom:'16px' }}>
                <EditableText value={svc.desc} docRef={refs.serviceVar(svc.descKey)} isAdmin={isAdmin} as="span" multiline />
              </p>
            </div>
            {/* Tags — non traduits car ce sont des noms techniques */}
            <div style={{ display:'flex', flexDirection:'column', gap:'6px', paddingTop:'4px', minWidth:'100px' }}>
              {SERVICES_BASE[i].tags.map((t) => (
                <span key={t} style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgb(var(--ink)/0.35)', padding:'3px 8px', border:'1px solid rgb(var(--ink)/0.1)', textAlign:'center' }}>{t}</span>
              ))}
            </div>
          </motion.article>
        ))}
      </section>

      <section style={{ padding:'80px 40px', display:'flex', justifyContent:'center' }}>
        <Link href="/contact" data-cursor-hover style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'24px', fontStyle:'italic', color:'rgb(var(--ink))', borderBottom:'1px solid rgb(var(--ink)/0.25)', paddingBottom:'4px' }}>{s.cta}</Link>
      </section>
    </main>
  );
}