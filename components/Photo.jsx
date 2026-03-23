'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { destroyCloudinary } from '@/lib/cloudinaryClient';
import { Button } from '@/components/ui/button';
import useAdmin from './hook/useAdmin';

const SETTINGS_DOC = doc(db, 'setting', 'home');

/* Placeholder quand aucune photo n'est configurée */
function PhotoPlaceholder() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'rgb(var(--cream-dark))',
      gap: '16px',
    }}>
      {/* Initiales */}
      <div style={{
        width: '120px', height: '120px',
        border: '1px solid rgb(var(--ink)/0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: '52px', fontWeight: 600, letterSpacing: '-0.04em',
          color: 'rgb(var(--ink)/0.25)',
        }}>H</span>
      </div>
      <span style={{
        fontFamily: "'DM Mono',monospace", fontSize: '9px',
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'rgb(var(--ink)/0.3)',
      }}>Ajouter une photo</span>
    </div>
  );
}

export default function Photo() {
  const [avatarId, setAvatarId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAdmin();

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
      if (avatarId) { try { await destroyCloudinary(avatarId); } catch {} }
      await setDoc(SETTINGS_DOC, { avatarPublicId: publicId }, { merge: true });
    } catch {}
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.6 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      {/* Photo ou placeholder */}
      {loading ? null : avatarId ? (
        <CldImage
          src={avatarId}
          alt="Portrait Hamid"
          fill
          sizes="420px"
          priority
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
      ) : (
        <PhotoPlaceholder />
      )}

      {/* Dégradé bas */}
      {avatarId && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '140px',
          background: 'linear-gradient(to top, rgb(var(--cream-dark)) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Bouton upload (admin uniquement) */}
      {isAdmin && (
        <div style={{ position: 'absolute', top: '14px', right: '14px', zIndex: 20 }}>
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            options={{ multiple: false, maxFiles: 1, folder: 'portfolio', sources: ['local', 'camera', 'url'] }}
            onSuccess={(res) => {
              const id = res?.info?.public_id ?? res?.public_id ?? null;
              if (id) savePublicId(id);
            }}
          >
            {({ open }) => (
              <Button type="button" size="sm" onClick={() => open()}
                style={{
                  fontFamily: "'DM Mono',monospace", fontSize: '10px',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  padding: '5px 12px',
                  background: 'rgb(var(--ink))', color: 'rgb(var(--cream))',
                  border: 'none',
                }}>
                {avatarId ? '↑ Changer' : '↑ Ajouter photo'}
              </Button>
            )}
          </CldUploadWidget>
        </div>
      )}
    </motion.div>
  );
}
