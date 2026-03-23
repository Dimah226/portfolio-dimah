"use client";

import { useEffect, useState } from "react";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { db } from "@/lib/firebase";
import { arrayRemove, arrayUnion, doc, onSnapshot, setDoc, deleteDoc } from "firebase/firestore";
import { destroyCloudinary, bulkDestroyCloudinary } from "@/lib/cloudinaryClient";

export default function ProjectImagesManager({ projectId }) {
  const [proj, setProj] = useState(null);
  const ref = doc(db, "projects", projectId);

  useEffect(() => {
    return onSnapshot(ref, (snap) => setProj(snap.exists() ? snap.data() : { imagePublicIds: [] }));
  }, [projectId]);

  if (!proj) return null;
  const images = proj.imagePublicIds || [];

  const addImage = async (info) => {
    const id = info?.public_id;
    if (!id) return;
    await setDoc(ref, { imagePublicIds: arrayUnion(id) }, { merge: true });
  };

  const removeImage = async (publicId) => {
    await destroyCloudinary(publicId);
    await setDoc(ref, { imagePublicIds: arrayRemove(publicId) }, { merge: true });
  };

  const deleteProject = async () => {
    // supprime d'abord toutes les images chez Cloudinary
    if (images.length) await bulkDestroyCloudinary(images);
    // puis supprime le document Firestore
    await deleteDoc(ref);
  };

  return (
    <div className="space-y-4">
      {/* galerie */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((pid) => (
          <div key={pid} className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <CldImage src={pid} alt="project" fill crop="fill" gravity="auto" className="object-cover" />
            <button
              onClick={() => removeImage(pid)}
              className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>

      {/* ajout */}
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{ multiple: true, maxFiles: 5, sources: ["local", "url"] }}
        onUpload={(res) => addImage(res?.info)}
      >
        {({ open }) => (
          <button onClick={() => open()} className="bg-accent text-primary px-4 py-2 rounded">
            Ajouter des images
          </button>
        )}
      </CldUploadWidget>

      {/* suppression du projet */}
      <button onClick={deleteProject} className="bg-red-600 text-white px-4 py-2 rounded">
        Supprimer le projet (et ses images)
      </button>
    </div>
  );
}
