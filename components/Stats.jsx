"use client";
import { useEffect, useState, useRef } from "react";
import CountUp from "react-countup";
import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot, setDoc, addDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import useAdmin from "./hook/useAdmin";
import { useLang } from "@/context/LangContext";

async function tr(text, lang) {
  if (lang === 'fr' || !text) return text;
  try {
    const r = await fetch('/api/translate', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ text, targetLang: lang }) });
    const { translated } = await r.json();
    return translated || text;
  } catch { return text; }
}

export default function Stats() {
  const [items, setItems]   = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [labels, setLabels] = useState({});
  const { isAdmin }         = useAdmin();
  const { lang }            = useLang();
  const cache = useRef({});

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db,"stats"), orderBy("order","asc")), (snap) => {
      setItems(snap.docs.map((d) => ({ id:d.id, ...d.data() })));
      setLoaded(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!items.length) return;
    let dead = false;
    if (lang === 'fr') { const m={}; items.forEach(it => m[it.id]=it.text); setLabels(m); return; }
    Promise.all(items.map(async (it) => {
      const k = `${lang}::${it.text}`;
      if (!cache.current[k]) cache.current[k] = await tr(it.text, lang);
      return [it.id, cache.current[k]];
    })).then(entries => { if (!dead) setLabels(Object.fromEntries(entries)); });
    return () => { dead = true; };
  }, [items, lang]);

  if (!loaded) return null;

  const add    = () => { if (items.length<4) addDoc(collection(db,"stats"),{num:0,text:"Nouvelle stat",visible:true,order:(items[items.length-1]?.order||0)+1}); };
  const remove = (id) => deleteDoc(doc(db,"stats",id));
  const update = (id,p) => setDoc(doc(db,"stats",id),p,{merge:true});

  if (!isAdmin) {
    const vis = items.filter(it => it.visible);
    return (
      <div style={{display:'flex',flexWrap:'wrap'}}>
        {vis.map((item,i) => (
          <div key={item.id} style={{flex:'1 1 160px',padding:'32px 40px',borderRight:i<vis.length-1?'1px solid rgb(var(--ink)/0.08)':'none',display:'flex',flexDirection:'column',gap:'6px'}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(48px,6vw,80px)',fontWeight:700,lineHeight:1,letterSpacing:'-0.04em',color:'rgb(var(--ink))'}}>
              <CountUp end={item.num} duration={3} /><span style={{color:'rgb(var(--rouge))'}}>.</span>
            </div>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:'10px',letterSpacing:'0.16em',textTransform:'uppercase',color:'rgb(var(--ink)/0.45)',lineHeight:1.5,maxWidth:'120px'}}>
              {labels[item.id] || item.text}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'16px',alignItems:'center',padding:'24px'}}>
      <div style={{display:'flex',flexWrap:'wrap',gap:'16px'}}>
        {items.map((item) => (
          <div key={item.id} style={{display:'flex',flexDirection:'column',gap:'8px',padding:'16px',width:'200px',border:'1px solid rgb(var(--ink)/0.12)',background:'rgb(var(--cream-dark))'}}>
            <label style={{fontFamily:"'DM Mono',monospace",fontSize:'9px',letterSpacing:'0.15em',textTransform:'uppercase',color:'rgb(var(--ink)/0.4)'}}>Nombre</label>
            <input type="number" defaultValue={item.num} onBlur={e=>update(item.id,{num:Number(e.target.value)})} style={{border:'1px solid rgb(var(--ink)/0.15)',background:'rgb(var(--cream))',padding:'4px 8px',fontFamily:"'DM Mono',monospace",fontSize:'12px',color:'rgb(var(--ink))'}} />
            <label style={{fontFamily:"'DM Mono',monospace",fontSize:'9px',letterSpacing:'0.15em',textTransform:'uppercase',color:'rgb(var(--ink)/0.4)'}}>Texte (FR)</label>
            <input type="text" maxLength={30} defaultValue={item.text} onBlur={e=>update(item.id,{text:e.target.value})} style={{border:'1px solid rgb(var(--ink)/0.15)',background:'rgb(var(--cream))',padding:'4px 8px',fontFamily:"'DM Mono',monospace",fontSize:'12px',color:'rgb(var(--ink))'}} />
            <label style={{display:'flex',alignItems:'center',gap:'6px',fontFamily:"'DM Mono',monospace",fontSize:'9px',letterSpacing:'0.1em',textTransform:'uppercase',color:'rgb(var(--ink)/0.4)'}}>
              <input type="checkbox" defaultChecked={!!item.visible} onChange={e=>update(item.id,{visible:e.target.checked})} /> Visible
            </label>
            <button onClick={()=>remove(item.id)} style={{color:'rgb(184 74 47)',fontFamily:"'DM Mono',monospace",fontSize:'9px',textTransform:'uppercase',background:'none',border:'none',textAlign:'left'}}>Supprimer</button>
          </div>
        ))}
      </div>
      {items.length<4 && <button onClick={add} style={{fontFamily:"'DM Mono',monospace",fontSize:'9px',letterSpacing:'0.15em',textTransform:'uppercase',padding:'8px 20px',background:'rgb(var(--ink))',color:'rgb(var(--cream))',border:'none'}}>+ Ajouter une stat</button>}
    </div>
  );
}