// components/EditableText.jsx
"use client";
import { useEffect, useState } from "react";
import { setDoc, onSnapshot } from "firebase/firestore";
import useAdmin from "@/components/hook/useAdmin";
import { useLang } from "@/context/LangContext";

// Traduit le texte FR vers EN et AR via l'API — appelé UNE SEULE FOIS au moment du save admin.
// Aucun appel à la traduction au render visiteur.
async function translateAll(frText) {
  const results = await Promise.allSettled(
    ['en', 'ar'].map(async (lang) => {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: frText, targetLang: lang }),
      });
      const { translated } = await res.json();
      return [lang, translated || frText];
    })
  );
  const entries = results.map((r, i) =>
    r.status === 'fulfilled' ? r.value : [['en', 'ar'][i], frText]
  );
  return { fr: frText, ...Object.fromEntries(entries) };
}

export default function EditableText({
  value = "",
  docRef,
  as: Tag = "span",
  className,
  multiline = false,
  style,
}) {
  const { isAdmin } = useAdmin();
  const { lang } = useLang();

  // Toutes les versions stockées en Firebase : { fr, en, ar }
  const [storedLangs, setStoredLangs] = useState({});
  // Brouillon FR pendant l'édition admin
  const [draftFr, setDraftFr] = useState(value);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Écoute le doc Firebase et stocke toutes les langues
  useEffect(() => {
    if (!docRef) return;
    const unsub = onSnapshot(docRef, (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();

      if (data.fr !== undefined) {
        // Format nouveau : { fr, en, ar }
        setStoredLangs({
          fr: data.fr,
          en: data.en || data.fr,
          ar: data.ar || data.fr,
        });
        setDraftFr(data.fr);
      } else if (data.valeur !== undefined) {
        // Format legacy : { valeur } — affiché tel quel, sera mis à jour au prochain save
        setStoredLangs({ fr: data.valeur, en: '', ar: '' });
        setDraftFr(data.valeur);
      }
    });
    return () => unsub();
  }, [docRef]);

  // Ce que l'on affiche : version dans la langue courante, sinon FR, sinon prop value
  const displayed = storedLangs[lang] || storedLangs.fr || value;

  // Save admin : traduit FR → EN + AR, puis stocke { fr, en, ar } dans Firebase
  const save = async () => {
    if (!docRef) return;
    setSaving(true);
    try {
      const allVersions = await translateAll(draftFr);
      await setDoc(docRef, allVersions, { merge: true });
    } catch (err) {
      console.error('[EditableText] save error:', err);
      // Fallback : save FR seulement
      await setDoc(docRef, { fr: draftFr, en: draftFr, ar: draftFr }, { merge: true });
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  // ── Visiteur (non-admin) ────────────────────────────────────
  if (!isAdmin) {
    return (
      <Tag className={className} style={style}>
        {displayed || value}
      </Tag>
    );
  }

  // ── Admin — mode édition ────────────────────────────────────
  if (editing) {
    const common = {
      value: draftFr,
      onChange: (e) => setDraftFr(e.target.value),
      onBlur: save,
      autoFocus: true,
      style: {
        background: 'rgb(var(--cream))',
        color: 'rgb(var(--ink))',
        border: '1px dashed rgb(var(--rouge)/0.7)',
        outline: 'none',
        padding: '2px 6px',
        width: '100%',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        fontWeight: 'inherit',
        lineHeight: 'inherit',
        letterSpacing: 'inherit',
        fontStyle: 'inherit',
        ...style,
      },
    };
    return multiline
      ? <textarea {...common} rows={3} onKeyDown={e => e.key === 'Escape' && setEditing(false)} />
      : <input {...common} onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false); }} />;
  }

  // ── Admin — mode lecture (avec indicateur éditable) ─────────
  const displayFr = storedLangs.fr || value;
  return (
    <Tag
      className={className}
      style={{ ...style, cursor: 'text', borderBottom: '1px dashed rgb(var(--rouge)/0.5)' }}
      title={saving ? 'Traduction FR → EN + AR en cours…' : '✏ Éditer (sauvegarde traduit automatiquement)'}
      onClick={() => { setDraftFr(displayFr); setEditing(true); }}
    >
      {saving
        ? <span style={{ opacity: 0.4, fontStyle: 'italic' }}>Traduction…</span>
        : (displayFr || <span style={{ opacity: 0.4, fontStyle: 'italic' }}>Cliquer pour écrire…</span>)
      }
    </Tag>
  );
}