// app/api/chat/route.js
// ─────────────────────────────────────────────────────────
// Chatbot IA — Groq (GRATUIT) avec fallback Gemini (GRATUIT)
//
// Choisir dans .env.local :
//   GROQ_API_KEY=gsk_...       ← console.groq.com (gratuit)
//   GEMINI_API_KEY=AIza...     ← aistudio.google.com (gratuit)
//
// Groq est prioritaire si la clé est présente.
// ─────────────────────────────────────────────────────────
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { messages, system } = await req.json();

    // ── GROQ (gratuit — llama-3.1-8b-instant) ──────────────
    if (process.env.GROQ_API_KEY) {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          max_tokens: 400,
          messages: [
            { role: 'system', content: system || '' },
            ...messages.slice(-10),
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok) return NextResponse.json({ error: data }, { status: res.status });

      const reply = data.choices?.[0]?.message?.content || '…';
      return NextResponse.json({ content: [{ type: 'text', text: reply }] });
    }

    // ── GEMINI FLASH (gratuit — fallback) ──────────────────
    if (process.env.GEMINI_API_KEY) {
      const geminiMessages = messages.slice(-10).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system || '' }] },
            contents: geminiMessages,
            generationConfig: { maxOutputTokens: 400 },
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) return NextResponse.json({ error: data }, { status: res.status });

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '…';
      return NextResponse.json({ content: [{ type: 'text', text: reply }] });
    }

    // ── Aucune clé configurée ──────────────────────────────
    return NextResponse.json({
      content: [{
        type: 'text',
        text: "Le chatbot n'est pas encore configuré. Ajoute GROQ_API_KEY dans .env.local (gratuit sur console.groq.com).",
      }],
    });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
