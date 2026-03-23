// components/NavAdminToggle.jsx
"use client";

import useAdmin from "@/components/hook/useAdmin"; // ← chemin correct
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function NavAdminToggle({ className = "" }) {
  const { isAdminRaw, adminMode, setAdminMode } = useAdmin();

  if (!isAdminRaw) return null;

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-2 ${className}`}>
            <span className="text-xs select-none" style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.1em', color: 'rgb(var(--ink)/0.4)' }}>
              Preview
            </span>
            <Switch checked={adminMode} onCheckedChange={setAdminMode} />
            <span className="text-xs select-none" style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.1em', color: 'rgb(var(--rouge)/0.8)' }}>
              Admin
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Basculer l&apos;affichage (admin ↔︎ visiteur)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}