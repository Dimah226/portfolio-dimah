// context/AdminContext.jsx
"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const AdminContext = createContext(null);

const STORAGE_KEY = "adminMode";

export function AdminProvider({ children }) {
  const [user, setUser]             = useState(null);
  const [isAdminRaw, setIsAdminRaw] = useState(false);
  const [loading, setLoading]       = useState(true);
  const [adminMode, setAdminModeState] = useState(false);

  // Lit localStorage côté client uniquement
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "1") setAdminModeState(true);
  }, []);

  // Auth + vérification Firestore
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
      if (!ok) {
        setAdminModeState(false);
        localStorage.setItem(STORAGE_KEY, "0");
      }
    });
    return () => unsub();
  }, []);

  const setAdminMode = useCallback((val) => {
    const next = typeof val === "function" ? val(adminMode) : !!val;
    setAdminModeState(next);
    localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  }, [adminMode]);

  const toggleAdminMode = useCallback(() => {
    setAdminMode((prev) => !prev);
  }, [setAdminMode]);

  const loginWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setAdminModeState(false);
    localStorage.setItem(STORAGE_KEY, "0");
  }, []);

  return (
    <AdminContext.Provider value={{
      user,
      loading,
      isAdminRaw,
      adminMode,
      isAdmin: isAdminRaw && adminMode,
      setAdminMode,
      toggleAdminMode,
      loginWithGoogle,
      logout,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export default function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
}