'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { destroyCloudinary } from '@/lib/cloudinaryClient';
import { Button } from '@/components/ui/button'; // ← utilise ton bouton (accent dynamique)
import useAdmin from './hook/useAdmin';

const SETTINGS_DOC = doc(db, 'setting', 'home');

export default function Photo() {
  const [avatarId, setAvatarId] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isAdmin, loadings } = useAdmin();

  useEffect(() => {
    const unsub = onSnapshot(
      SETTINGS_DOC,
      (snap) => {
        const data = snap.exists() ? snap.data() : {};
        setAvatarId(data.avatarPublicId || null);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, []);

  const savePublicId = async (publicId) => {
    if (!publicId) return;
    try {
      if (avatarId) {
        try {
          await destroyCloudinary(avatarId);
        } catch {}
      }
      await setDoc(SETTINGS_DOC, { avatarPublicId: publicId }, { merge: true });
    } catch {
      // no-op
    }
  };

  return (
    <div className="w-full h-full relative">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 2, ease: 'easeIn' }}>
        {/* IMAGE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 2.4, ease: 'easeInOut' }}
          className="absolute w-[298px] h-[298px] xl:w-[498px] xl:h-[498px]"
        >
          {!loading && avatarId ? (
            <CldImage
              src={avatarId}
              alt="Portrait"
              fill
              sizes="(max-width:768px) 298px, 498px"
              priority
              className="object-contain"
            />
          ) : (
            <Image
              src="/assets/photo.png"
              priority
              quality={100}
              fill
              sizes="(max-width:768px) 298px, 498px"
              alt="Portrait"
              className="object-contain"
            />
          )}

          {isAdmin && (
            <div className="absolute top-2 right-2 z-20">
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                options={{ multiple: false, maxFiles: 1, folder: 'portfolio', sources: ['local', 'camera', 'url'] }}
                onSuccess={(res) => {
                  const id = res?.info?.public_id ?? res?.public_id ?? res?.assets?.[0]?.public_id ?? null;
                  if (id) savePublicId(id);
                }}
                onUpload={(res) => {
                  const id = res?.info?.public_id ?? res?.public_id ?? res?.assets?.[0]?.public_id ?? null;
                  if (id) savePublicId(id);
                }}
              >
                {({ open }) => (
                  <Button
                    type="button"
                    size="md"
                    className="px-3 py-1 h-auto text-xs rounded absolute top-0 right-0"
                    onClick={() => open()}
                  >
                    Changer
                  </Button>
                )}
              </CldUploadWidget>
            </div>
          )}
        </motion.div>

        {/* CERCLE (déjà dynamique via text-accent) */}
        <motion.svg className="w-[300px] h-[300px] xl:w-[506px] xl:h-[506px] text-accent" fill="transparent" viewBox="0 0 506 506">
          <motion.circle
            cx="253"
            cy="253"
            r="250"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ strokeDasharray: '24 10 0 0' }}
            animate={{ strokeDasharray: ['15 120 25 25', '16 25 92 72', '4 250 22 22'], rotate: [120, 360] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
          />
        </motion.svg>
      </motion.div>
    </div>
  );
}
