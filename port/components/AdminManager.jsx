// components/AdminManager.jsx
"use client";
import { useEffect, useState } from "react";
import { collection, doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import useAdmin from "@/components/hook/useAdmin";

export default function AdminManager() {
  const { isAdmin } = useAdmin();
  const [admins, setAdmins] = useState([]);
  const [uid, setUid] = useState("");
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
    <section className="rounded-lg border border-foreground/10 p-4 bg-foreground/[0.03] w-full max-w-2xl mx-auto mb-8">
      <h3 className="text-lg font-semibold mb-3 text-foreground">Gestion des admins</h3>

      <div className="flex gap-2 mb-3">
        <input
          className="border rounded px-2 py-1 bg-foreground text-primary flex-1"
          placeholder="UID de l’utilisateur"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
        />
        <input
          className="border rounded px-2 py-1 bg-foreground text-primary w-60"
          placeholder="Email (optionnel)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={addByUid}
          className="bg-accent text-primary rounded px-3 py-1 hover:bg-accent-hover transition"
        >
          + Ajouter
        </button>
      </div>

      <ul className="space-y-2 text-sm">
        {admins.map((a) => (
          <li key={a.id} className="flex items-center justify-between gap-2">
            <span className="truncate">
              <b>UID:</b> {a.id} {a.email ? <span className="opacity-70">— {a.email}</span> : null}
            </span>
            <button
              onClick={() => removeByUid(a.id)}
              className="text-red-500 hover:underline"
            >
              Retirer
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
