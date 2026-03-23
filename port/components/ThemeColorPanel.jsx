// components/ThemeColorsPanel.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import useAdmin from "./hook/useAdmin";

// ---- utils: hex <-> rgb triplet & hover derivation ----
const clamp = (n, a=0, b=255) => Math.max(a, Math.min(b, n));
const hexToRgbArr = (hex) => {
  const h = hex.replace("#","").trim();
  const full = h.length === 3 ? h.split("").map(x=>x+x).join("") : h;
  const r = parseInt(full.slice(0,2),16);
  const g = parseInt(full.slice(2,4),16);
  const b = parseInt(full.slice(4,6),16);
  return [isNaN(r)?0:r, isNaN(g)?0:g, isNaN(b)?0:b];
};
const rgbArrToHex = ([r,g,b]) =>
  "#"+[r,g,b].map(v => clamp(v).toString(16).padStart(2,"0")).join("");

// léger éclaircissement pour le hover (mélange avec blanc)
const lightenHex = (hex, amt = 0.12) => {
  const [r,g,b] = hexToRgbArr(hex);
  const mix = (c) => clamp(Math.round(c + (255 - c) * amt));
  return rgbArrToHex([mix(r), mix(g), mix(b)]);
};

// applique les variables CSS à :root
const applyCSSVars = (theme) => {
  const root = document.documentElement;
  const set = (name, hex) => {
    const [r,g,b] = hexToRgbArr(hex);
    root.style.setProperty(name, `${r} ${g} ${b}`);
  };
  if (theme.primaryHex)   set("--color-primary",   theme.primaryHex);
  if (theme.foregroundHex)set("--color-foreground",theme.foregroundHex);
  if (theme.accentHex)    set("--color-accent",    theme.accentHex);
  if (theme.accentHoverHex) set("--color-accent-hover", theme.accentHoverHex);
  if (theme.borderHex)    set("--color-border",    theme.borderHex);
  if (theme.ringHex)      set("--color-ring",      theme.ringHex);
};

const DEFAULTS = {
  primaryHex:    "#1c1c22",
  foregroundHex: "#ffffff",
  accentHex:     "#00ff99",
  accentHoverHex:"#00e187",
  borderHex:     "#ffffff",
  ringHex:       "#00ff99",
};

export default function ThemeColorsPanel({
  docPath = "settings/theme",  // Firestore: collection/doc
  className = "",
}) {
  const { isAdmin, loading } = useAdmin();

  const [theme, setTheme] = useState(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  // doc ref
  const ref = useMemo(() => {
    const parts = docPath.split("/"); // "settings/theme"
    return doc(db, parts[0], parts[1]);
  }, [docPath]);

  useEffect(() => {
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.exists() ? snap.data() : {};
      const merged = { ...DEFAULTS, ...data };
      setTheme(merged);
      // applique à l'arrivée des données
      if (typeof window !== "undefined") applyCSSVars(merged);
      setLoaded(true);
    });
    return () => unsub();
  }, [ref]);

  if (!isAdmin) return null; // visible seulement en mode admin
  if (!loaded) return <div className="p-4 text-foreground/60">Chargement du thème…</div>;

  // handlers
  const livePreview = (key, hex) => {
    const t = { ...theme, [key]: hex };
    // auto-derive hover si on change accent
    if (key === "accentHex" && (!theme.accentHoverHex || theme.accentHoverHex === DEFAULTS.accentHoverHex)) {
      t.accentHoverHex = lightenHex(hex, 0.12);
    }
    setTheme(t);
    applyCSSVars(t);
  };

  const persist = async (key, hex) => {
    const patch = { [key]: hex };
    // si on vient de changer accentHex et qu’on a recalculé hover, persistons-le aussi
    if (key === "accentHex" && theme.accentHoverHex && theme.accentHoverHex !== DEFAULTS.accentHoverHex) {
      patch.accentHoverHex = theme.accentHoverHex;
    }
    await setDoc(ref, patch, { merge: true });
  };

  const Row = ({ label, keyName }) => (
    <div className="flex items-center gap-3">
      <div className="w-36 text-sm text-foreground/80">{label}</div>
      <input
        type="color"
        value={theme[keyName]}
        onInput={(e) => livePreview(keyName, e.target.value)}
        onChange={(e) => persist(keyName, e.target.value)}
        className="h-9 w-9 rounded border border-foreground/20 bg-transparent p-0"
        title={theme[keyName]}
      />
      <input
        type="text"
        value={theme[keyName]}
        onChange={(e) => livePreview(keyName, e.target.value)}
        onBlur={(e) => persist(keyName, e.target.value)}
        className="flex-1 h-9 rounded border border-foreground/20 bg-primary text-foreground px-2"
        placeholder="#rrggbb"
      />
      <div
        className="h-9 w-16 rounded border border-foreground/20"
        style={{ background: theme[keyName] }}
        aria-hidden
      />
    </div>
  );

  return (
    <section className={cn("container mx-auto my-6", className)}>
      <div className="rounded-lg border border-foreground/10 bg-foreground/[0.03] p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Theme colors
        </h3>

        <div className="grid grid-cols-1 gap-3">
          <Row label="Fond"                keyName="primaryHex" />
            <Row label="Texte"             keyName="foregroundHex" />
            <Row label="Accent principal"  keyName="accentHex" />
            <Row label="Accent au survol"  keyName="accentHoverHex" />
            <Row label="Bordures"          keyName="borderHex" />
            <Row label="Anneau de focus"   keyName="ringHex" />

        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={async () => {
              setTheme(DEFAULTS);
              applyCSSVars(DEFAULTS);
              await setDoc(ref, DEFAULTS, { merge: true });
            }}
            className="bg-accent text-primary rounded px-3 py-2 hover:bg-accent-hover transition"
          >
            Restaure défaut
          </button>
        </div>

        {/* Petit aperçu rapide */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-lg p-4 border" style={{ borderColor: theme.borderHex }}>
            <p className="text-foreground/80">Bordures & ring</p>
            <input
              className="mt-2 h-[40px] w-full rounded px-3 outline-none"
              style={{
                background: theme.primaryHex,
                color: theme.foregroundHex,
                border: `1px solid ${theme.borderHex}`,
                boxShadow: `0 0 0 0px transparent`,
              }}
              placeholder="Input sample"
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.ringHex}55`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
