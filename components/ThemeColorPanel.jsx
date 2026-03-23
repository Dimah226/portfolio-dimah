// components/ThemeColorPanel.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import useAdmin from "./hook/useAdmin";

// ── utils ──────────────────────────────────────────────
const clamp = (n, a = 0, b = 255) => Math.max(a, Math.min(b, n));

const hexToRgbArr = (hex) => {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((x) => x + x).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return [isNaN(r) ? 0 : r, isNaN(g) ? 0 : g, isNaN(b) ? 0 : b];
};

const rgbArrToHex = ([r, g, b]) =>
  "#" + [r, g, b].map((v) => clamp(v).toString(16).padStart(2, "0")).join("");

const lightenHex = (hex, amt = 0.12) => {
  const [r, g, b] = hexToRgbArr(hex);
  const mix = (c) => clamp(Math.round(c + (255 - c) * amt));
  return rgbArrToHex([mix(r), mix(g), mix(b)]);
};

const darkenHex = (hex, amt = 0.08) => {
  const [r, g, b] = hexToRgbArr(hex);
  const mix = (c) => clamp(Math.round(c * (1 - amt)));
  return rgbArrToHex([mix(r), mix(g), mix(b)]);
};

/*
  applyCSSVars — met à jour TOUTES les variables CSS utilisées
  par le portfolio magazine (--cream, --ink, --rouge…)
  en plus des alias système (--color-primary, --color-accent…).
*/
const applyCSSVars = (theme) => {
  const root = document.documentElement;

  const setRgb = (name, hex) => {
    const [r, g, b] = hexToRgbArr(hex);
    root.style.setProperty(name, `${r} ${g} ${b}`);
  };

  // ── Variables magazine (utilisées par le portfolio) ──
  if (theme.primaryHex) {
    setRgb("--cream",      theme.primaryHex);
    setRgb("--parchment",  lightenHex(theme.primaryHex, 0.04));
    setRgb("--cream-dark", darkenHex(theme.primaryHex, 0.06));
  }
  if (theme.foregroundHex) {
    setRgb("--ink",      theme.foregroundHex);
    setRgb("--ink-soft", lightenHex(theme.foregroundHex, 0.15));
  }
  if (theme.accentHex) {
    setRgb("--rouge",       theme.accentHex);
    setRgb("--rouge-hover", theme.accentHoverHex || lightenHex(theme.accentHex, 0.12));
  }

  // ── Alias système (compatibilité Tailwind tokens) ──
  if (theme.primaryHex)    setRgb("--color-primary",      theme.primaryHex);
  if (theme.foregroundHex) setRgb("--color-foreground",   theme.foregroundHex);
  if (theme.accentHex)     setRgb("--color-accent",       theme.accentHex);
  if (theme.accentHoverHex)setRgb("--color-accent-hover", theme.accentHoverHex);
  if (theme.borderHex)     setRgb("--color-border",       theme.borderHex);
  if (theme.ringHex)       setRgb("--color-ring",         theme.ringHex);
};

// ── Valeurs par défaut = palette magazine actuelle ──
const DEFAULTS = {
  primaryHex:     "#F4EFE4",  // --cream
  foregroundHex:  "#0E0C08",  // --ink
  accentHex:      "#B84A2F",  // --rouge
  accentHoverHex: "#D45739",  // --rouge-hover
  borderHex:      "#0E0C08",
  ringHex:        "#B84A2F",
};

export default function ThemeColorsPanel({ docPath = "settings/theme", className = "" }) {
  const { isAdmin } = useAdmin();
  const [theme, setTheme] = useState(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  const ref = useMemo(() => {
    const parts = docPath.split("/");
    return doc(db, parts[0], parts[1]);
  }, [docPath]);

  useEffect(() => {
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.exists() ? snap.data() : {};
      const merged = { ...DEFAULTS, ...data };
      setTheme(merged);
      if (typeof window !== "undefined") applyCSSVars(merged);
      setLoaded(true);
    });
    return () => unsub();
  }, [ref]);

  if (!isAdmin) return null;
  if (!loaded) return null;

  const livePreview = (key, hex) => {
    const t = { ...theme, [key]: hex };
    if (key === "accentHex") t.accentHoverHex = lightenHex(hex, 0.12);
    setTheme(t);
    applyCSSVars(t);
  };

  const persist = async (key, hex) => {
    const patch = { [key]: hex };
    if (key === "accentHex") patch.accentHoverHex = lightenHex(hex, 0.12);
    await setDoc(ref, patch, { merge: true });
  };

  const Row = ({ label, keyName }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.5)', width: '160px', flexShrink: 0 }}>
        {label}
      </span>
      <input
        type="color"
        value={theme[keyName]}
        onInput={(e) => livePreview(keyName, e.target.value)}
        onChange={(e) => persist(keyName, e.target.value)}
        style={{ width: '36px', height: '36px', border: '1px solid rgb(var(--ink)/0.15)', background: 'none', padding: '2px', flexShrink: 0 }}
      />
      <input
        type="text"
        value={theme[keyName]}
        onChange={(e) => livePreview(keyName, e.target.value)}
        onBlur={(e) => persist(keyName, e.target.value)}
        style={{ flex: 1, height: '36px', border: '1px solid rgb(var(--ink)/0.15)', background: 'rgb(var(--cream-dark))', color: 'rgb(var(--ink))', padding: '0 10px', fontFamily: "'DM Mono',monospace", fontSize: '12px', outline: 'none' }}
      />
      <div style={{ width: '36px', height: '36px', background: theme[keyName], border: '1px solid rgb(var(--ink)/0.1)', flexShrink: 0 }} />
    </div>
  );

  return (
    <section style={{ padding: '24px 48px', borderTop: '1px solid rgb(var(--ink)/0.08)' }}>
      <div style={{ border: '1px solid rgb(var(--ink)/0.1)', padding: '20px', background: 'rgb(var(--cream-dark))' }}>
        <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.4)', marginBottom: '16px' }}>
          Couleurs du thème
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Row label="Fond (cream)"      keyName="primaryHex" />
          <Row label="Texte (ink)"       keyName="foregroundHex" />
          <Row label="Accent (rouge)"    keyName="accentHex" />
          <Row label="Bordures"          keyName="borderHex" />
        </div>
        <button
          onClick={async () => { setTheme(DEFAULTS); applyCSSVars(DEFAULTS); await setDoc(ref, DEFAULTS, { merge: true }); }}
          style={{ marginTop: '16px', fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '8px 18px', background: 'rgb(var(--ink))', color: 'rgb(var(--cream))', border: 'none' }}
        >
          Restaurer défaut
        </button>
      </div>
    </section>
  );
}