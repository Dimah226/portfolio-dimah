"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  collection, doc, onSnapshot, setDoc,
  addDoc, deleteDoc, query, orderBy,
} from "firebase/firestore";
import * as Fa from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import useAdmin from "./hook/useAdmin";

function isValidIconName(name) { return !!Fa[name]; }

function IconFromName({ name }) {
  const Comp = Fa[name] || Fa.FaQuestion;
  return <Comp />;
}

/* Style d'icône magazine — inline, garanti sans bleu parasite */
const ICON_STYLE = {
  width: '36px', height: '36px',
  border: '1px solid rgb(var(--ink)/0.25)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '15px',
  color: 'rgb(var(--ink))',         /* ← encre pleine, pas de bleu */
  background: 'transparent',
  textDecoration: 'none',
  transition: 'border-color .2s, color .2s',
  flexShrink: 0,
};

const ICON_STYLE_HIDDEN = { ...ICON_STYLE, opacity: 0.3 };

export default function Socials() {
  const [items, setItems]   = useState([]);
  const [loaded, setLoaded] = useState(false);
  const { isAdmin }         = useAdmin();

  useEffect(() => {
    const q = query(collection(db, "socials"), orderBy("order", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoaded(true);
    });
    return () => unsub();
  }, []);

  if (!loaded) return <div style={{ height: '36px' }} />;

  const addItem = async () => {
    await addDoc(collection(db, "socials"), {
      icon: "FaGithub", url: "", visible: true, label: "Nouveau",
      order: (items[items.length - 1]?.order || 0) + 1,
    });
  };
  const removeItem = (id) => deleteDoc(doc(db, "socials", id));
  const updateItem = (id, patch) => setDoc(doc(db, "socials", id), patch, { merge: true });

  /* ── MODE VISITEUR ── */
  if (!isAdmin) {
    return (
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {items.filter((it) => it.visible).map((item) => {
          const external = /^https?:\/\//i.test(item.url || "");
          return (
            <Link
              key={item.id}
              href={item.url || "#"}
              style={ICON_STYLE}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              onClick={(e) => { if (!item.url) e.preventDefault(); }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgb(var(--rouge))';
                e.currentTarget.style.color = 'rgb(var(--rouge))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgb(var(--ink)/0.25)';
                e.currentTarget.style.color = 'rgb(var(--ink))';
              }}
            >
              <IconFromName name={item.icon} />
            </Link>
          );
        })}
      </div>
    );
  }

  /* ── MODE ADMIN ── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Rangée d'icônes + bouton + sur la même ligne */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        {items.map((item) => {
          const external = /^https?:\/\//i.test(item.url || "");
          const validIcon = isValidIconName(item.icon);
          return (
            <div key={item.id} style={{ position: 'relative' }} className="group">
              {/* Icône */}
              <Link
                href={item.url || "#"}
                style={item.visible ? ICON_STYLE : ICON_STYLE_HIDDEN}
                title={item.label || item.icon}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                onClick={(e) => e.preventDefault()}
              >
                <IconFromName name={item.icon} />
              </Link>

              {/* Panneau édition au survol */}
              <div className="absolute left-0 top-[110%] z-30 hidden group-hover:flex flex-col gap-2 w-[260px] p-3 shadow-lg"
                style={{ background: 'rgb(var(--cream))', border: '1px solid rgb(var(--ink)/0.12)' }}>

                <label style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.4)' }}>Icône</label>
                <input
                  defaultValue={item.icon}
                  placeholder="FaLinkedin, FaGithub…"
                  onBlur={(e) => updateItem(item.id, { icon: e.target.value.trim() })}
                  style={{ border: `1px solid ${validIcon ? 'rgb(var(--ink)/0.15)' : '#ef4444'}`, padding: '4px 8px', fontFamily: "'DM Mono',monospace", fontSize: '11px', background: 'rgb(var(--cream-dark))', color: 'rgb(var(--ink))', outline: 'none' }}
                />
                {!validIcon && <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', color: '#ef4444' }}>Nom invalide — ex: FaLinkedin</span>}

                <label style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.4)', marginTop: '4px' }}>URL</label>
                <input
                  defaultValue={item.url}
                  placeholder="https://..."
                  onBlur={(e) => updateItem(item.id, { url: e.target.value.trim() })}
                  style={{ border: '1px solid rgb(var(--ink)/0.15)', padding: '4px 8px', fontFamily: "'DM Mono',monospace", fontSize: '11px', background: 'rgb(var(--cream-dark))', color: 'rgb(var(--ink))', outline: 'none' }}
                />

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'DM Mono',monospace", fontSize: '9px', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.4)', marginTop: '4px' }}>
                  <input type="checkbox" defaultChecked={!!item.visible}
                    onChange={(e) => updateItem(item.id, { visible: e.target.checked })} />
                  Visible
                </label>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                  <button onClick={() => removeItem(item.id)}
                    style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ef4444', background: 'none', border: 'none' }}>
                    Supprimer
                  </button>
                  <a href="https://react-icons.github.io/react-icons/" target="_blank" rel="noopener noreferrer"
                    style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.4)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                    Icônes <FiExternalLink size={10} />
                  </a>
                </div>
              </div>
            </div>
          );
        })}

        {/* Bouton + inline avec les icônes */}
        <button onClick={addItem} style={{
          width: '36px', height: '36px',
          border: '1px dashed rgb(var(--ink)/0.25)',
          background: 'none',
          fontFamily: "'DM Mono',monospace", fontSize: '16px',
          color: 'rgb(var(--ink)/0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>+</button>
      </div>
    </div>
  );
}