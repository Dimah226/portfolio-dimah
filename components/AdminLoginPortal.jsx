// components/AdminLoginPortal.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import useAdmin from "./hook/useAdmin";
import { Switch } from "@/components/ui/switch";

export default function AdminLoginPortal() {
  const { user, isAdminRaw, isAdmin, adminMode, setAdminMode, loginWithGoogle, logout } = useAdmin();
  const [open, setOpen] = useState(false);
  const clicks = useRef(0);
  const timer = useRef(null);

  // Raccourci clavier: Alt + Shift + A
  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey && e.shiftKey && e.key.toLowerCase() === "a") setOpen((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Hotspot invisible (5 clics rapides)
  const onSecretClick = () => {
    clicks.current += 1;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => (clicks.current = 0), 600);
    if (clicks.current >= 5) {
      clicks.current = 0;
      setOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={onSecretClick}
        aria-label="hidden-login"
        className="fixed left-2 bottom-2 w-4 h-4 opacity-0 focus:opacity-100"
      />

      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary/60">
          <div className="w-[92vw] max-w-[460px] rounded-xl bg-primary p-5 text-foreground shadow-xl border border-foreground/20">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {user ? (isAdminRaw ? "Admin connecté" : "Connecté (non admin)") : "Connexion admin"}
              </h3>
              <button onClick={() => setOpen(false)} className="text-sm opacity-70 hover:opacity-100">✕</button>
            </div>

            {!user && (
              <button
                onClick={async () => { await loginWithGoogle(); setOpen(false); }}
                className="w-full h-12 rounded-md bg-accent text-primary font-semibold hover:bg-accent-hover transition"
              >
                Se connecter avec Google
              </button>
            )}

            {user && (
              <div className="space-y-4">
                <div className="text-sm opacity-80">
                  <div>Connecté : <strong>{user.email}</strong></div>
                  <div>Droit Firestore : {isAdminRaw ? "✅ Admin autorisé" : "⛔️ Non admin"}</div>
                </div>

                {/* Toggle de VUE admin : n'influe pas Firestore, juste l’édition */}
                {isAdminRaw && (
                  <div className="flex items-center justify-between rounded-md border border-foreground/15 px-3 py-2">
                    <div className="text-sm">
                      <div className="font-medium">Mode admin</div>
                      <div className="opacity-70 text-xs">
                        {adminMode ? "Édition activée (UI d’admin visible)" : "Prévisualisation visiteur (édition masquée)"}
                      </div>
                    </div>
                    <Switch checked={adminMode} onCheckedChange={setAdminMode} />
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setOpen(false)}
                    className="flex-1 h-10 rounded-md border border-foreground/20 hover:bg-foreground/10 transition"
                  >
                    Fermer
                  </button>
                  <button
                    onClick={async () => { await logout(); setOpen(false); }}
                    className="flex-1 h-10 rounded-md bg-red-500 text-foreground hover:bg-red-600 transition"
                  >
                    Se déconnecter
                  </button>
                </div>

                <div className="text-xs opacity-80">
                  <div className="flex items-center gap-2">
                    <span>UID : <code className="select-all">{user?.uid || "—"}</code></span>
                    {user && (
                      <button
                        onClick={() => navigator.clipboard.writeText(user.uid)}
                        className="text-accent hover:underline"
                      >
                        Copier
                      </button>
                    )}
                  </div>
                </div>

                {!isAdminRaw && user && (
                  <p className="mt-1 text-xs opacity-70">
                    Tu es connecté mais pas admin. Ajoute <code>admins/&lt;uid&gt;</code> dans Firestore pour activer les droits.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
