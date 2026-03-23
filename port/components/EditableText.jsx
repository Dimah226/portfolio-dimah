// components/EditableText.jsx
"use client";

import { useState } from "react";
import { setDoc } from "firebase/firestore";
import { cn } from "@/lib/utils";

export default function EditableText({
  value = "",
  docRef,          // <-- passe un docRef (ex: refs.homeVar("role"))
  isAdmin = false,
  as: Tag = "span",
  className,
  inputClassName,
  multiline = false,
}) {
  const [text, setText] = useState(value);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!isAdmin || !docRef) return;
    setSaving(true);
    await setDoc(docRef, { valeur: text }, { merge: true });
    setSaving(false);
    setEditing(false);
  };

  if (!isAdmin) return <Tag className={className}>{text}</Tag>;

  if (editing) {
    const common = {
      value: text,
      onChange: (e) => setText(e.target.value),
      onBlur: save,
      autoFocus: true,
      className: cn(
        // ⬇️ couleurs tokenisées
        "bg-primary text-foreground rounded px-2 py-1 outline-none border border-accent/40",
        inputClassName
      ),
    };
    return multiline ? (
      <textarea {...common} rows={4} />
    ) : (
      <input
        {...common}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") setEditing(false);
        }}
      />
    );
  }

  return (
    <Tag
      className={cn(
        // ⬇️ accent déjà tokenisé
        "cursor-text border-b border-dotted border-accent/80 hover:border-accent",
        className
      )}
      title={saving ? "Enregistrement..." : "Cliquer pour éditer"}
      onClick={() => setEditing(true)}
    >
      {text || <span className="opacity-50">Clique pour écrire…</span>}
    </Tag>
  );
}
