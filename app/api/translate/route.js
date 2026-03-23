// app/api/translate/route.js
// Appelé dans 2 cas seulement :
//   1. Admin save dans EditableText → traduit FR vers EN + AR (une fois par save)
//   2. useTranslatedArray → pour les tableaux statiques non couverts par le glossaire
//
// Plus jamais appelé à chaque render visiteur.

import { NextResponse } from 'next/server';
import { glossaryLookup, isShortUiText } from '@/lib/glossary';

const PROTECTED_TERMS = `LCR, NSFR, ALM, IBNR, GMM, MCO, DID, ACP, VAR, VBA, AUC, RMSE, CEFR, TOEIC, ISE,
Python, R, SQL, SAS, Stata, LaTeX, Power BI, Excel, Git, XGBoost, SHAP, LSTM, SARIMA,
Prophet, Streamlit, dbt, Pandas, NumPy, scikit-learn, TensorFlow, EViews, ggplot2,
Plotly, Tableau, Shiny, Chain-Ladder, Bootstrap, Adobe Suite, Canva,
ENSEA, ISFA, INP-HB, ACPEC, Heymann's Inc, Prytanée Militaire du Kadiogo,
Hamid, Dimah, Robgo, Abidjan, Ouagadougou, Lyon, Yamoussoukro, Abengourou,
Côte d'Ivoire, Burkina Faso`.trim();

const SYSTEM_EN_UI = `Translate French website UI labels to English. Translation only — no rewriting.
RULES: 1-word in → 1-word out when possible. Never expand. Preserve casing, punctuation, line breaks.
Return unchanged if already English. JSON array in → JSON array out (same length).
Keep verbatim: ${PROTECTED_TERMS}
Output only the translation.`;

const SYSTEM_EN_COPY = `Translate French portfolio text to natural professional English. Faithful — no embellishment.
RULES: Preserve meaning, structure, rhythm. Keep line breaks. Preserve protected terms.
JSON array in → JSON array out (same length).
Keep verbatim: ${PROTECTED_TERMS}
Output only the translation.`;

const SYSTEM_AR_UI = `ترجم تسميات واجهة موقع من الفرنسية إلى العربية. ترجمة فقط — بلا إعادة صياغة.
قواعد: كلمة واحدة دخلاً → كلمة واحدة خرجاً. ممنوع التوسع. حافظ على الرموز والأرقام وفواصل الأسطر.
مصفوفة JSON دخلاً → مصفوفة JSON خرجاً بنفس الطول.
انسخ كما هي: ${PROTECTED_TERMS}
أخرج الترجمة فقط.`;

const SYSTEM_AR_COPY = `ترجم نصوص ملف أعمال مهني من الفرنسية إلى العربية الفصحى. بأمانة — بلا إضافات.
قواعد: حافظ على المعنى والبنية والإيجاز وفواصل الأسطر.
مصفوفة JSON دخلاً → مصفوفة JSON خرجاً بنفس الطول.
انسخ كما هي: ${PROTECTED_TERMS}
أخرج الترجمة فقط.`;

// File d'attente séquentielle — 1 seul appel Groq actif côté serveur
// Évite que N requêtes parallèles brûlent les 6000 TPM en même temps
let groqQueue = Promise.resolve();
function enqueueGroq(fn) {
  const next = groqQueue.then(fn);
  groqQueue = next.catch(() => {});
  return next;
}

function wordCount(s = '') { return s.trim().split(/\s+/).filter(Boolean).length; }

function looksExpanded(src, out) {
  const sw = wordCount(src), ow = wordCount(out);
  if (sw <= 1 && ow > 3) return true;
  if (sw <= 2 && ow > 6) return true;
  if (src.trim().length <= 20 && out.trim().length > src.trim().length * 3) return true;
  return false;
}

function getPrompt(lang, mode) {
  if (lang === 'ar') return mode === 'ui' ? SYSTEM_AR_UI : SYSTEM_AR_COPY;
  return mode === 'ui' ? SYSTEM_EN_UI : SYSTEM_EN_COPY;
}

// 1 retry max (avant : 3) — évite de tripler la consommation TPM sur 429
async function callGroq(text, lang, mode = 'copy', retries = 1) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: mode === 'ui' ? 60 : 800,
      temperature: 0,
      messages: [
        { role: 'system', content: getPrompt(lang, mode) },
        { role: 'user', content: `<TEXT>\n${text}\n</TEXT>` },
      ],
    }),
  });

  if (res.status === 429 && retries > 0) {
    const wait = Math.ceil(parseFloat(res.headers.get('retry-after') || '3') * 1000) + 500;
    console.log(`[translate] 429 → wait ${wait}ms`);
    await new Promise(r => setTimeout(r, wait));
    return callGroq(text, lang, mode, retries - 1);
  }

  const data = await res.json();
  if (!res.ok) { console.error('[translate]', res.status, JSON.stringify(data)); return null; }
  const raw = data.choices?.[0]?.message?.content?.trim() || null;
  if (!raw) return null;
  // Le modèle répercute parfois les balises XML du prompt → on les enlève
  return raw
    .replace(/^<TEXT>\s*/i, '')
    .replace(/\s*<\/TEXT>$/i, '')
    .trim() || null;
}

async function translateOne(text, targetLang) {
  if (!text?.trim()) return text;
  if (targetLang === 'fr') return text;

  // Glossaire partagé → zéro token
  const hit = glossaryLookup(text, targetLang);
  if (hit) return hit;

  const mode = isShortUiText(text) ? 'ui' : 'copy';
  const translated = await enqueueGroq(() => callGroq(text, targetLang, mode));
  if (!translated) return text;

  if (looksExpanded(text, translated)) {
    const retry = await enqueueGroq(() => callGroq(text, targetLang, 'ui'));
    if (retry && !looksExpanded(text, retry)) return retry;
    return text;
  }

  return translated;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { targetLang } = body;

    if (!process.env.GROQ_API_KEY) {
      console.error('[translate] missing GROQ_API_KEY');
      return NextResponse.json(body.texts ? { translated: body.texts } : { translated: body.text });
    }

    // Batch (useTranslatedArray) — séquentiel pour protéger le TPM
    if (body.texts && Array.isArray(body.texts)) {
      const { texts } = body;
      if (!texts.length || targetLang === 'fr') return NextResponse.json({ translated: texts });
      const translated = [];
      for (const t of texts) translated.push(await translateOne(t, targetLang));
      return NextResponse.json({ translated });
    }

    // Simple (EditableText admin save)
    const { text } = body;
    if (!text?.trim() || targetLang === 'fr') return NextResponse.json({ translated: text });
    return NextResponse.json({ translated: await translateOne(text, targetLang) });

  } catch (err) {
    console.error('[translate] error:', err);
    return NextResponse.json({ translated: '' }, { status: 500 });
  }
}