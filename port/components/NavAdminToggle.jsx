// components/NavAdminToggle.jsx
"use client";

import useAdmin from "@/components/hook/useAdmin";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function NavAdminToggle({ className = "" }) {
  // On récupère ce que fournit ton hook
  const admin = useAdmin?.() || {};

  // Détection permissive selon les noms que tu utilises dans ton projet
  const isAdminUser =
    (admin.isAdminUser ?? admin.canAdmin ?? Boolean(admin.uid || admin.user)) || false;

  const adminMode = Boolean(admin.adminMode ?? admin.isAdmin ?? false);

  // Setter : on privilégie celui du hook, sinon fallback URL+localStorage
  const setAdminMode =
    admin.setAdminMode ??
    admin.toggle ??
    ((value) => {
      if (typeof window === "undefined") return;
      try {
        const v = Boolean(value);
        const url = new URL(window.location.href);
        if (v) url.searchParams.set("admin", "1");
        else url.searchParams.delete("admin");
        window.history.replaceState(null, "", url);
        localStorage.setItem("adminMode", v ? "1" : "0");
        // event facultatif si d'autres composants écoutent
        window.dispatchEvent(new Event("admin-mode-changed"));
      } catch {}
    });

  if (!isAdminRaw) return null; // visiteurs : rien à afficher

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-2 ${className}`}>
            <span className="text-xs text-foreground/70 select-none">Preview</span>
            <Switch checked={adminMode} onCheckedChange={setAdminMode} />
            <span className="text-xs text-foreground/70 select-none">Admin</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Basculer l’affichage (admin ↔︎ visiteur)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
