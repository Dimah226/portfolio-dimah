'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/context/LangContext';

const SYSTEM_PROMPT = `Tu es l'assistant personnel de Hamid (alias Dimah), statisticien, économiste, actuaire et data scientist. 
Réponds en la même langue que la question posée (français, anglais, ou arabe).
Sois concis, chaleureux et professionnel. Parle à la première personne comme si tu étais Hamid.
Compétences clés : Python, R, SQL, SAS, Stata, machine learning, actuariat, économétrie, séries temporelles, Power BI.
Ne réponds qu'aux questions liées au profil professionnel de Hamid. Pour tout autre sujet, redirige poliment vers le formulaire de contact.`;

export default function Chatbot() {
  const { tr } = useLang();
  const c = tr.chatbot;
  const [open, setOpen]       = useState(false);
  const [msgs, setMsgs]       = useState([{ role: 'assistant', content: c.welcome }]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, loading]);

  /* Reset welcome msg when lang changes */
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
      setMsgs((m) => [...m, { role: 'assistant', content: '⚠ Erreur de connexion. Réessaie.' }]);
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
          width: '48px', height: '48px',
          background: 'rgb(var(--ink))', color: 'rgb(var(--cream))',
          border: '1px solid rgb(var(--ink)/0.2)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.05em',
          transition: 'background .2s',
        }}
      >
        {open ? '✕' : 'AI'}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'fixed', bottom: '90px', right: '28px', zIndex: 8999,
              width: '340px', maxWidth: 'calc(100vw - 40px)',
              background: 'rgb(var(--parchment))',
              border: '1px solid rgb(var(--ink)/0.12)',
              boxShadow: '0 8px 40px rgb(var(--ink)/0.1)',
              display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '12px 16px', borderBottom: '1px solid rgb(var(--ink)/0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '16px', fontWeight: 600, color: 'rgb(var(--ink))' }}>
                  {c.title}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', color: 'rgb(var(--ink)/0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>online</span>
                </div>
              </div>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', color: 'rgb(var(--ink)/0.3)', letterSpacing: '0.1em' }}>DIMAH_AI</span>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px' }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '85%', padding: '8px 12px',
                    background: m.role === 'user' ? 'rgb(var(--ink))' : 'rgb(var(--cream-dark))',
                    color: m.role === 'user' ? 'rgb(var(--cream))' : 'rgb(var(--ink))',
                    fontSize: '13px', lineHeight: '1.55',
                    fontFamily: "'Jost',sans-serif",
                  }}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', gap: '4px', paddingLeft: '4px' }}>
                  {[0,1,2].map((i) => (
                    <div key={i} style={{
                      width: '5px', height: '5px', borderRadius: '50%',
                      background: 'rgb(var(--ink)/0.3)',
                      animation: `bounce 1s ${i*0.15}s infinite`,
                    }}/>
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '10px 14px', borderTop: '1px solid rgb(var(--ink)/0.08)', display: 'flex', gap: '8px' }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
                placeholder={c.placeholder}
                style={{
                  flex: 1, background: 'transparent', border: '1px solid rgb(var(--ink)/0.15)',
                  padding: '8px 10px', fontSize: '12px', fontFamily: "'Jost',sans-serif",
                  color: 'rgb(var(--ink))', outline: 'none',
                }}
              />
              <button
                onClick={send}
                disabled={loading}
                style={{
                  background: 'rgb(var(--ink))', color: 'rgb(var(--cream))',
                  border: 'none', padding: '8px 14px',
                  fontFamily: "'DM Mono',monospace", fontSize: '10px',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  opacity: loading ? 0.5 : 1,
                }}
              >
                {c.send}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes bounce {
          0%,80%,100% { transform:translateY(0) }
          40% { transform:translateY(-6px) }
        }
      `}</style>
    </>
  );
}
