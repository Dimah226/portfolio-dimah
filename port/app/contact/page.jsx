'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLang } from '@/context/LangContext';
import { FiMail, FiMapPin, FiLinkedin, FiGithub } from 'react-icons/fi';

const INFOS = [
  { icon: FiMail,    label: 'Email',       value: 'hamidrobgo009@gmail.com',    href: 'mailto:hamidrobgo009@gmail.com' },
  { icon: FiMapPin,  label: 'Localisation',value: 'Cocody Saint-Jean, Abidjan', href: '#' },
  { icon: FiLinkedin,label: 'LinkedIn',    value: 'linkedin.com/in/hamid',       href: 'https://linkedin.com' },
  { icon: FiGithub,  label: 'GitHub',      value: 'github.com/dimah',            href: 'https://github.com' },
];

const up = (d = 0) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { delay: d, duration: 0.7, ease: [0.16,1,0.3,1] } } });
const INIT = { name: '', email: '', subject: '', message: '' };

export default function ContactPage() {
  const { tr } = useLang();
  const c = tr.contact;
  const [form, setForm]     = useState(INIT);
  const [status, setStatus] = useState('idle');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('sending');
    try {
      await addDoc(collection(db, 'messages'), { ...form, createdAt: serverTimestamp(), read: false });
      setStatus('success');
      setForm(INIT);
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const inputStyle = {
    width: '100%', background: 'transparent',
    border: 'none', borderBottom: '1px solid rgb(var(--ink)/0.15)',
    padding: '10px 0', fontSize: '14px', fontFamily: "'Jost',sans-serif",
    fontWeight: 300, color: 'rgb(var(--ink))', outline: 'none',
    transition: 'border-color .2s',
  };

  return (
    <main>
      {/* ── EN-TÊTE ── */}
      <section style={{ padding: '80px 40px', borderBottom: '1px solid rgb(var(--ink)/0.08)' }}>
        <motion.div {...up(0.1)} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ width: '28px', height: '1px', background: 'rgb(var(--rouge))' }} />
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.35)' }}>{c.section}</span>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }} className="max-xl:block">
          <motion.h1 {...up(0.15)} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(52px, 6vw, 96px)', fontWeight: 700, lineHeight: 0.92, letterSpacing: '-0.04em', whiteSpace: 'pre-line' }}>
            {c.title}
          </motion.h1>
          <motion.div {...up(0.25)} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '8px' }}>
            <p style={{ fontFamily: "'Jost',sans-serif", fontSize: '14px', fontWeight: 300, color: 'rgb(var(--ink)/0.5)', lineHeight: 1.8, marginBottom: '20px' }}>{c.desc}</p>
            {/* Badge disponibilité */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', border: '1px solid rgb(var(--rouge)/0.25)', background: 'rgb(var(--rouge)/0.04)', width: 'fit-content' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgb(184 74 47)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgb(var(--rouge))' }}>{c.available}</span>
              <span style={{ fontFamily: "'Jost',sans-serif", fontSize: '11px', color: 'rgb(var(--ink)/0.45)' }}>— {c.avail_desc}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONTENU ── */}
      <section style={{ padding: '60px 40px', display: 'grid', gridTemplateColumns: '320px 1fr', gap: '80px' }} className="max-xl:block">

        {/* Infos */}
        <motion.aside {...up(0.2)} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {INFOS.map(({ icon: Icon, label, value, href }) => (
            <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" data-cursor-hover
              style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', textDecoration: 'none' }}>
              <div style={{ width: '32px', height: '32px', border: '1px solid rgb(var(--ink)/0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                <Icon size={13} style={{ color: 'rgb(var(--rouge))' }} />
              </div>
              <div>
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.3)', marginBottom: '3px' }}>{label}</p>
                <p style={{ fontFamily: "'Jost',sans-serif", fontSize: '13px', fontWeight: 400, color: 'rgb(var(--ink)/0.65)' }}>{value}</p>
              </div>
            </a>
          ))}

          {/* Séparateur */}
          <div style={{ height: '1px', background: 'rgb(var(--ink)/0.07)', margin: '8px 0' }} />

          {/* Langues */}
          <div>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.3)', marginBottom: '10px' }}>Langues</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[['Français', 'Langue maternelle'], ['Anglais', 'B2 · TOEIC 885']].map(([l, n]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '14px', fontStyle: 'italic', color: 'rgb(var(--ink)/0.65)' }}>{l}</span>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '8px', letterSpacing: '0.1em', color: 'rgb(var(--ink)/0.3)' }}>{n}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.aside>

        {/* Formulaire */}
        <motion.div {...up(0.3)}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="max-xl:grid-cols-1">
              <Field label={c.name}  type="text"  value={form.name}  onChange={set('name')}  required inputStyle={inputStyle} />
              <Field label={c.email} type="email" value={form.email} onChange={set('email')} required inputStyle={inputStyle} />
            </div>
            <Field label={c.subject} type="text" value={form.subject} onChange={set('subject')} inputStyle={inputStyle} />

            {/* Textarea */}
            <div>
              <label style={{ fontFamily: "'DM Mono',monospace", fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.3)', display: 'block', marginBottom: '10px' }}>
                {c.message} <span style={{ color: 'rgb(var(--rouge))' }}>*</span>
              </label>
              <textarea value={form.message} onChange={set('message')} required rows={5}
                placeholder="Décrivez votre projet ou votre question…"
                style={{ ...inputStyle, borderBottom: 'none', border: '1px solid rgb(var(--ink)/0.1)', padding: '12px', resize: 'none', width: '100%' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <button type="submit" disabled={status === 'sending'} data-cursor-hover style={{
                background: 'rgb(var(--ink))', color: 'rgb(var(--cream))',
                padding: '12px 28px', border: 'none',
                fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase',
                opacity: status === 'sending' ? 0.6 : 1, transition: 'opacity .2s',
              }}>
                {status === 'sending' ? c.sending : c.send}
              </button>

              {status === 'success' && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.15em', color: 'rgb(var(--rouge))' }}>
                  ✓ {c.success}
                </motion.span>
              )}
              {status === 'error' && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.15em', color: '#dc2626' }}>
                  ✕ {c.error}
                </motion.span>
              )}
            </div>
          </form>
        </motion.div>
      </section>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>
    </main>
  );
}

function Field({ label, type, value, onChange, required, inputStyle }) {
  return (
    <div>
      <label style={{ fontFamily: "'DM Mono',monospace", fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.3)', display: 'block', marginBottom: '10px' }}>
        {label} {required && <span style={{ color: 'rgb(var(--rouge))' }}>*</span>}
      </label>
      <input type={type} value={value} onChange={onChange} required={required} style={inputStyle}
        onFocus={e => e.target.style.borderBottomColor = 'rgb(var(--rouge))'}
        onBlur={e => e.target.style.borderBottomColor = 'rgb(var(--ink)/0.15)'} />
    </div>
  );
}
