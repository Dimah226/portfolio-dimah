"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  addDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";

import * as Fa from "react-icons/fa"; // accès dynamique aux icônes
import { FiExternalLink } from "react-icons/fi";
import useAdmin from "./hook/useAdmin";

// helpers en haut du fichier (à côté de IconFromName)
function isValidIconName(name) {
  return !!Fa[name];
}


// Fonction qui transforme un nom en composant
function IconFromName({ name, className }) {
  const Comp = Fa[name] || Fa.FaQuestion; // fallback si nom invalide
  return <Comp className={className} />;
}

export default function Socials({ containerStyles = "", iconStyles = "" }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const { isAdmin, loading } = useAdmin();

  useEffect(() => {
    const colRef = collection(db, "socials");
    const q = query(colRef, orderBy("order", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const arr = [];
      snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
      setItems(arr);
      setLoaded(true);
    });
    return () => unsub();
  }, []);

  if (!loaded) return <div className={containerStyles}>…</div>;

  // Fonctions admin
  const addItem = async () => {
    const nextOrder = (items[items.length - 1]?.order || 0) + 1;
    await addDoc(collection(db, "socials"), {
      icon: "FaGithub",
      url: "",
      visible: true,
      order: nextOrder,
      label: "Nouveau",
    });
  };

  const removeItem = async (id) => {
    await deleteDoc(doc(db, "socials", id));
  };

  const updateItem = async (id, patch) => {
    await setDoc(doc(db, "socials", id), patch, { merge: true });
  };

  // --- VISITEUR (inchangé) ---
if (!isAdmin) {
  return (
    <div className={containerStyles}>
      {items
        .filter((it) => it.visible)
        .map((item) => {
          const external = /^https?:\/\//i.test(item.url || "");
          return (
            <Link
              key={item.id}
              href={item.url || "#"}
              className={iconStyles}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              onClick={(e) => {
                if (!item.url) e.preventDefault();
              }}
            >
              <IconFromName name={item.icon} />
            </Link>
          );
        })}
    </div>
  );
}


  // --- ADMIN (remplace seulement le bloc admin rendu) ---
return (
  <div className="flex flex-col gap-[50px] justify-center items-center ">
    <div className={containerStyles}>
      {items.map((item) => {
        const external = /^https?:\/\//i.test(item.url || "");
        const validIcon = isValidIconName(item.icon);
        return (
          <div key={item.id} className="relative group">
            <Link
              href={item.url || "#"}
              className={`${iconStyles} ${item.visible ? "" : "opacity-40"}`}
              title={item.label || ""}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              onClick={(e) => {
                if (!item.url) e.preventDefault();
              }}
            >
              <IconFromName name={item.icon} />
            </Link>

            {/* Panneau d’édition – couleurs dynamiques */}
            <div className="absolute left-0 top-[110%] z-30 hidden group-hover:flex flex-col gap-2
                            w-[280px] rounded-lg shadow-md p-3
                            bg-primary text-foreground border border-foreground/10">
              {/* Icône */}
              <label className="text-xs font-semibold">Icône</label>
              <input
                className={`rounded px-2 py-1 bg-transparent border outline-none
                           ${validIcon ? "border-foreground/20 focus:border-accent"
                                       : "border-red-500/70 focus:border-red-500"}`}
                placeholder="Nom (ex: FaGithub) – voir le site ci-dessous"
                defaultValue={item.icon}
                onBlur={(e) => updateItem(item.id, { icon: e.target.value.trim() })}
              />
              {!validIcon && (
                <p className="text-xs text-red-400">
                  Nom d’icône invalide. Exemple: <code className="opacity-80">FaGithub</code>
                </p>
              )}

              {/* URL */}
              <label className="text-xs font-semibold mt-1">URL</label>
              <input
                className="rounded px-2 py-1 bg-transparent border border-foreground/20 outline-none focus:border-accent"
                placeholder="https://..."
                defaultValue={item.url}
                onBlur={(e) => updateItem(item.id, { url: e.target.value.trim() })}
              />

              {/* Label */}
              <label className="text-xs font-semibold">Label</label>
              <input
                className="rounded px-2 py-1 bg-transparent border border-foreground/20 outline-none focus:border-accent"
                placeholder="Nom (ex: Github)"
                defaultValue={item.label || ""}
                onBlur={(e) => updateItem(item.id, { label: e.target.value })}
              />

              {/* Visible */}
              <label className="flex items-center gap-2 text-sm mt-1">
                <input
                  type="checkbox"
                  defaultChecked={!!item.visible}
                  onChange={(e) => updateItem(item.id, { visible: e.target.checked })}
                />
                Visible
              </label>

              {/* Ordre */}
              <label className="text-xs font-semibold">Ordre</label>
              <input
                type="number"
                className="rounded px-2 py-1 bg-transparent border border-foreground/20 outline-none focus:border-accent w-24"
                defaultValue={item.order ?? 0}
                onBlur={(e) =>
                  updateItem(item.id, { order: Number(e.target.value) || 0 })
                }
              />

              <div className="flex items-center justify-between pt-1">
                <button
                  className=" bg-red-500 text-white rounded px-3 py-1 hover:bg-red-600 transition"
                  onClick={() => removeItem(item.id)}
                >
                  -
                </button>

                <a
                  href="https://react-icons.github.io/react-icons/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md
                             border border-foreground/20 hover:border-accent
                             hover:text-accent transition"
                >
                  <span>Icônes</span>
                  <FiExternalLink />
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {/* Bouton ajouter (tokens) */}
    <button
      type="button"
      onClick={addItem}
      className="bg-accent text-primary rounded px-3 py-1 hover:bg-accent-hover transition-all"
    >
      Ajouter un réseau
    </button>
  </div>
);

}
