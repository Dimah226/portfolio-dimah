"use client";

import { useEffect, useState } from "react";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { destroyCloudinary } from "@/lib/cloudinaryClient"; // le helper client ci-dessus

export default function AdminAvatarManager() {
  const [data, setData] = useState({ avatarPublicId: null });

  useEffect(() => {
    const ref = doc(db, "settings", "home");
    return onSnapshot(ref, (snap) => setData(snap.exists() ? snap.data() : { avatarPublicId: null }));
  }, []);

  const replaceAvatar = async (info) => {
    const newId = info?.public_id;
    if (!newId) return;
    const ref = doc(db, "settings", "home");
    // supprime l'ancienne si elle existe
    if (data.avatarPublicId) await destroyCloudinary(data.avatarPublicId);
    // sauve la nouvelle
    await setDoc(ref, { avatarPublicId: newId }, { merge: true });
  };

  return (
    <div className="space-y-4">
      <div className="relative w-[220px] h-[220px] rounded-xl overflow-hidden bg-white/5">
        {data.avatarPublicId ? (
          <CldImage src={data.avatarPublicId} alt="Admin" fill crop="fill" gravity="face" className="object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center text-white/50">Pas d’avatar</div>
        )}
      </div>

      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{ multiple: false, maxFiles: 1, sources: ["local", "camera"] }}
        onUpload={(res) => replaceAvatar(res?.info)}
      >
        {({ open }) => (
          <button onClick={() => open()} className="bg-accent text-primary px-4 py-2 rounded">
            Remplacer la photo
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
}
