// hooks/useAdmin.js
"use client";
import { useEffect, useState, useCallback } from "react";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const STORAGE_KEY = "adminMode";
const EVENT_NAME  = "admin-mode-changed";

export default function useAdmin() {
  const [user, setUser] = useState(null);
  const [isAdminRaw, setIsAdminRaw] = useState(false); // droit firestore
  const [loading, setLoading] = useState(true);
  const [adminMode, _setAdminMode] = useState(false);  // vue édition ↔ preview

  // --- helpers ---
  const readPref = () => {
    try { return localStorage.getItem(STORAGE_KEY) === "1"; }
    catch { return false; }
  };
  const writePref = (on) => {
    try { localStorage.setItem(STORAGE_KEY, on ? "1" : "0"); } catch {}
  };
  const broadcast = () => {
    try { window.dispatchEvent(new Event(EVENT_NAME)); } catch {}
  };

  const setAdminMode = useCallback((on) => {
    const next = !!on;
    _setAdminMode(next);
    writePref(next);
    broadcast();
  }, []);

  const toggleAdminMode = useCallback(() => {
    _setAdminMode((prev) => {
      const next = !prev;
      writePref(next);
      broadcast();
      return next;
    });
  }, []);

  // Restaure la préférence au premier rendu
  useEffect(() => { _setAdminMode(readPref()); }, []);

  // Auth + rôle admin Firestore
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      let ok = false;
      if (u) {
        try {
          const snap = await getDoc(doc(db, "admins", u.uid));
          ok = snap.exists();
        } catch {}
      }
      setIsAdminRaw(ok);
      setLoading(false);
      if (!ok) setAdminMode(false); // si on perd le droit admin, on coupe la vue admin
    });
    return () => unsub();
  }, [setAdminMode]);

  // Écoute les changements (depuis le toggle d’une autre page/composant)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        _setAdminMode(e.newValue === "1");
      }
    };
    const onBroadcast = () => _setAdminMode(readPref());
    window.addEventListener("storage", onStorage);
    window.addEventListener(EVENT_NAME, onBroadcast);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(EVENT_NAME, onBroadcast);
    };
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setAdminMode(false);
  }, [setAdminMode]);

  // isAdmin = droit Firestore ET toggle actif
  const isAdmin = isAdminRaw && adminMode;

  return {
    user,
    loading,
    // état « droit » vs « vue »
    isAdminRaw,
    adminMode,
    isAdmin,          // ← utilise ça partout (remplace ton ancien isAdmin)
    setAdminMode,
    toggleAdminMode,
    loginWithGoogle,
    logout,
  };
}
