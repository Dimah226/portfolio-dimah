"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { CldUploadWidget } from "next-cloudinary";
import { destroyCloudinary } from "@/lib/cloudinaryClient";

export default function CvManager() {
  const [data, setData] = useState({ cvPublicId: null });

  useEffect(() => {
    const ref = doc(db, "settings", "home");
    return onSnapshot(ref, (snap) => setData(snap.exists() ? snap.data() : { cvPublicId: null }));
  }, []);

  const replaceCv = async (info) => {
    const newId = info?.public_id;
    if (!newId) return;
    const ref = doc(db, "settings", "home");
    if (data.cvPublicId) await destroyCloudinary(data.cvPublicId);
    await setDoc(ref, { cvPublicId: newId }, { merge: true });
  };

  const cvUrl = data.cvPublicId
    ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${data.cvPublicId}.pdf`
    : null;
  // (Cloudinary stocke aussi en "image" pour PDF avec transforms ; sinon .raw -> adapter l’URL)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-white/80">CV :</span>
        {cvUrl ? (
          <a href={cvUrl} target="_blank" className="underline text-accent">
            Ouvrir / Télécharger
          </a>
        ) : (
          <span className="text-white/50">Aucun CV</span>
        )}
      </div>

      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{
          multiple: false,
          maxFiles: 1,
          resourceType: "auto",
          clientAllowedFormats: ["pdf"],
          sources: ["local", "url"],
        }}
        onUpload={(res) => replaceCv(res?.info)}
      >
        {({ open }) => (
          <button onClick={() => open()} className="bg-accent text-primary px-4 py-2 rounded">
            Remplacer le CV (PDF)
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
}
