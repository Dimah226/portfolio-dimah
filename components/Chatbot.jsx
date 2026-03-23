'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/context/LangContext';

/* ─────────────────────────────────────────────────────────────
   SYSTEM PROMPT — naturel, humain, sans redondance
   La règle de langue est au début pour que le modèle la respecte
───────────────────────────────────────────────────────────── */
const SYSTEM_PROMPT = `Tu es Hamid — statisticien, économiste et data scientist basé à Abidjan. ton nom complet est ROBGO Abdul Hamid Al Haqq, mais on t'appelles souvent "Dimah". Tu es passionné par la donnée, que tu maîtrises avec rigueur et créativité.
Tu réponds TOUJOURS dans la même langue que la question : français si on écrit en français, English if written in English, عربي إن كان السؤال بالعربية.

Ton ton : direct, chaleureux, sans jargon inutile. Pas de formules creuses comme "Bien sûr !" ou "Absolument !". Réponds comme quelqu'un qui connaît son sujet et va droit au but.

Ce que tu peux faire :
- Parler de mes compétences : Python, R, SQL, Stata, Excel/VBA, Power BI, LaTeX
- Expliquer mes domaines : actuariat, économétrie, machine learning, risk management, ALM, séries temporelles
- Résumer mes projets (provisionnement IBNR, scoring crédit XGBoost, prévision énergétique LSTM...)
- Dire où en est ma formation : ENSEA Abidjan, en cours de préparation à l'ISFA Lyon
- Indiquer mes disponibilités ou comment me contacter

Ce que tu ne fais pas : répondre à des questions sans lien avec mon profil. Dans ce cas, oriente vers le formulaire de contact en une phrase, sans t'excuser dix fois.

Sois concis. Deux à cinq phrases suffisent pour la plupart des réponses. Si la question est précise, réponds précisément.`;

export default function Chatbot() {
  const { tr } = useLang();
  const c = tr.chatbot;
  const [open, setOpen]     = useState(false);
  const [msgs, setMsgs]     = useState([{ role: 'assistant', content: c.welcome }]);
  const [input, setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, loading]);

  useEffect(() => {
    setMsgs([{ role: 'assistant', content: c.welcome }]);
  }, [c.welcome]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg = { role: 'user', content: text };
    setMsgs((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: [...msgs, userMsg].filter((m) => m.role !== 'system'),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || data.reply || '…';
      setMsgs((m) => [...m, { role: 'assistant', content: reply }]);
    } catch {
      setMsgs((m) => [...m, { role: 'assistant', content: '⚠ Connexion perdue. Réessaie.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Chatbot"
        style={{
          position: 'fixed', bottom: '28px', right: '28px', zIndex: 9000,
          width: '50px', height: '50px',
          background: 'rgb(var(--ink))', color: 'rgb(var(--cream))',
          border: '1px solid rgb(var(--ink)/0.15)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'DM Mono', monospace", fontSize: '11px', letterSpacing: '0.05em',
          transition: 'background .2s, transform .2s',
        }}
      >
        {open ? '✕' : 'AI'}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{
              position: 'fixed', bottom: '92px', right: '28px', zIndex: 8999,
              width: '360px', maxWidth: 'calc(100vw - 40px)',
              background: 'rgb(var(--parchment))',
              border: '1px solid rgb(var(--ink)/0.14)',
              boxShadow: '0 12px 48px rgb(var(--ink)/0.12)',
              display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid rgb(var(--ink)/0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <p style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: '17px', fontWeight: 600,
                  color: 'rgb(var(--ink))',
                }}>{c.title}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                  <span style={{
                    fontFamily: "'DM Mono',monospace", fontSize: '10px',
                    color: 'rgb(var(--ink)/0.5)', textTransform: 'uppercase', letterSpacing: '0.15em',
                  }}>online</span>
                </div>
              </div>
              <span style={{
                fontFamily: "'DM Mono',monospace", fontSize: '10px',
                color: 'rgb(var(--ink)/0.4)', letterSpacing: '0.1em',
              }}>DIMAH_AI</span>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '16px',
              display: 'flex', flexDirection: 'column', gap: '10px',
              maxHeight: '320px',
            }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '85%', padding: '9px 13px',
                    background: m.role === 'user' ? 'rgb(var(--ink))' : 'rgb(var(--cream-dark))',
                    color: m.role === 'user' ? 'rgb(var(--cream))' : 'rgb(var(--ink))',
                    fontSize: '13.5px', lineHeight: '1.6',
                    fontFamily: "'Jost',sans-serif",
                  }}>
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{ display: 'flex', gap: '5px', paddingLeft: '4px', alignItems: 'center' }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: 'rgb(var(--ink)/0.35)',
                      animation: `chatbounce 1s ${i * 0.15}s infinite`,
                    }} />
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: '12px 16px',
              borderTop: '1px solid rgb(var(--ink)/0.08)',
              display: 'flex', gap: '8px',
            }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
                placeholder={c.placeholder}
                style={{
                  flex: 1, background: 'transparent',
                  border: '1px solid rgb(var(--ink)/0.2)',
                  padding: '9px 12px', fontSize: '13px',
                  fontFamily: "'Jost',sans-serif",
                  color: 'rgb(var(--ink))', outline: 'none',
                }}
              />
              <button
                onClick={send}
                disabled={loading}
                style={{
                  background: 'rgb(var(--ink))', color: 'rgb(var(--cream))',
                  border: 'none', padding: '9px 16px',
                  fontFamily: "'DM Mono',monospace", fontSize: '10px',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  opacity: loading ? 0.5 : 1,
                  transition: 'opacity .2s',
                }}
              >
                {c.send}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes chatbounce {
          0%,80%,100% { transform: translateY(0); opacity: 0.35; }
          40% { transform: translateY(-5px); opacity: 0.9; }
        }
      `}</style>
    </>
  );
}
