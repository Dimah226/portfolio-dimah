"use client";

import { useEffect, useMemo, useState } from "react";
import CountUp from "react-countup";
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
import useAdmin from "./hook/useAdmin";

export default function Stats() {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const { isAdmin, loading } = useAdmin();

  useEffect(() => {
    const colRef = collection(db, "stats");
    const q = query(colRef, orderBy("order", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const arr = [];
      snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
      setItems(arr);
      setLoaded(true);
    });
    return () => unsub();
  }, []);

  if (!loaded) return <section>…</section>;

  const addItem = async () => {
    if (items.length >= 4) return;
    const nextOrder = (items[items.length - 1]?.order || 0) + 1;
    await addDoc(collection(db, "stats"), {
      num: 0,
      text: "Nouvelle stat",
      visible: true,
      order: nextOrder,
    });
  };

  const removeItem = async (id) => {
    await deleteDoc(doc(db, "stats", id));
  };

  const updateItem = async (id, patch) => {
    await setDoc(doc(db, "stats", id), patch, { merge: true });
  };

  // --- Visiteur ---
  if (!isAdmin) {
    return (
      <section className="pt-4 pb-12 xl:pt-0 xl:pb-0">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-6 max-w-[80vw] mx-auto xl:max-w-none text-foreground">
            {items
              .filter((it) => it.visible)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex-1 flex gap-4 items-center justify-center xl:justify-start"
                >
                  <CountUp
                    end={item.num}
                    duration={5}
                    className="text-4xl xl:text-6xl font-extrabold"
                  />
                  <p
                    className={`${
                      item.text.length < 15
                        ? "max-w-[100px]"
                        : "max-w-[150px]"
                    } leading-snug text-foreground/80`}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </section>
    );
  }

  // --- Admin ---
  return (
    <div className="flex flex-col gap-6 justify-center items-center text-foreground">
      <div className="flex flex-wrap gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-2 p-4 border border-border rounded-lg bg-foreground/5 text-foreground w-[220px]"
          >
            {/* Nombre */}
            <label className="text-xs font-semibold">Nombre</label>
            <input
              type="number"
              className="border border-border text-primary bg-foreground rounded px-2 py-1"
              defaultValue={item.num}
              onBlur={(e) =>
                updateItem(item.id, { num: Number(e.target.value) })
              }
            />

            {/* Texte */}
            <label className="text-xs font-semibold">Texte</label>
            <input
              type="text"
              maxLength={30}
              className="border border-border text-primary bg-foreground rounded px-2 py-1"
              defaultValue={item.text}
              onBlur={(e) => updateItem(item.id, { text: e.target.value })}
            />

            {/* Visible */}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                defaultChecked={!!item.visible}
                onChange={(e) =>
                  updateItem(item.id, { visible: e.target.checked })
                }
              />
              Visible
            </label>

            {/* Ordre */}
            <label className="text-xs font-semibold">Ordre</label>
            <input
              type="number"
              className="border border-border text-primary bg-foreground rounded px-2 py-1 w-20"
              defaultValue={item.order ?? 0}
              onBlur={(e) =>
                updateItem(item.id, { order: Number(e.target.value) })
              }
            />

            {/* Supprimer */}
            <button
              className="text-red-600 text-sm self-start"
              onClick={() => removeItem(item.id)}
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>

      {/* Bouton ajouter */}
      {items.length < 4 && (
        <button
          type="button"
          onClick={addItem}
          className="bg-accent text-primary rounded px-3 py-1 hover:bg-accent-hover transition"
        >
          Ajouter une statistique
        </button>
      )}
    </div>
  );
}
