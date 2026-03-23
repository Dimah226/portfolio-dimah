// components/AdminManager.jsx
"use client";
import { useEffect, useState } from "react";
import { collection, doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import useAdmin from "@/components/hook/useAdmin";

const mono = { fontFamily: "'DM Mono',monospace" };
const label = { ...mono, fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.4)', display: 'block', marginBottom: '6px' };
const field = { width: '100%', border: '1px solid rgb(var(--ink)/0.15)', background: 'rgb(var(--cream-dark))', color: 'rgb(var(--ink))', padding: '8px 12px', ...mono, fontSize: '12px', outline: 'none' };

export default function AdminManager() {
  const { isAdmin, user } = useAdmin();
  const [admins, setAdmins] = useState([]);
  const [uid, setUid]     = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!isAdmin) return;
    const unsub = onSnapshot(collection(db, "admins"), (snap) => {
      setAdmins(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [isAdmin]);

  if (!isAdmin) return null;

  const addByUid = async () => {
    const clean = uid.trim();
    if (!clean) return;
    await setDoc(doc(db, "admins", clean), { role: "admin", email: email || null }, { merge: true });
    setUid(""); setEmail("");
  };

  const removeByUid = async (targetUid) => {
    if (!confirm("Retirer cet admin ?")) return;
    await deleteDoc(doc(db, "admins", targetUid));
  };

  return (
    <section style={{ padding: '24px 48px 40px', borderTop: '1px solid rgb(var(--ink)/0.08)' }}>
      <div style={{ maxWidth: '640px' }}>

        {/* En-tête */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <div style={{ width: '28px', height: '1px', background: 'rgb(var(--rouge))' }} />
          <span style={{ ...mono, fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgb(var(--ink)/0.4)' }}>
            Gestion des admins
          </span>
        </div>

        {/* Liste admins actuels */}
        {admins.length > 0 && (
          <div style={{ marginBottom: '20px', border: '1px solid rgb(var(--ink)/0.08)' }}>
            {admins.map((a, i) => (
              <div key={a.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px',
                borderBottom: i < admins.length - 1 ? '1px solid rgb(var(--ink)/0.06)' : 'none',
                background: a.id === user?.uid ? 'rgb(var(--rouge)/0.04)' : 'transparent',
              }}>
                <div>
                  <span style={{ ...mono, fontSize: '11px', color: 'rgb(var(--ink)/0.7)' }}>
                    {a.email || a.id}
                  </span>
                  {a.id === user?.uid && (
                    <span style={{ ...mono, fontSize: '9px', color: 'rgb(var(--rouge)/0.7)', marginLeft: '8px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      vous
                    </span>
                  )}
                  {a.email && (
                    <div style={{ ...mono, fontSize: '9px', color: 'rgb(var(--ink)/0.3)', marginTop: '2px', letterSpacing: '0.05em' }}>
                      {a.id.slice(0, 20)}…
                    </div>
                  )}
                </div>
                {a.id !== user?.uid && (
                  <button
                    onClick={() => removeByUid(a.id)}
                    style={{ ...mono, fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgb(var(--rouge)/0.7)', background: 'none', border: 'none' }}
                  >
                    Retirer
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Ajouter un admin */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div>
            <span style={label}>UID</span>
            <input
              style={field}
              placeholder="UID Firebase"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addByUid()}
            />
          </div>
          <div>
            <span style={label}>Email (optionnel)</span>
            <input
              style={field}
              placeholder="nom@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addByUid()}
            />
          </div>
        </div>
        <button
          onClick={addByUid}
          style={{ ...mono, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '10px 22px', background: 'rgb(var(--ink))', color: 'rgb(var(--cream))', border: 'none' }}
        >
          + Ajouter admin
        </button>
      </div>
    </section>
  );
}