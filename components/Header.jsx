'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useLang } from '@/context/LangContext';
import { LOCALES, LOCALE_LABELS } from '@/lib/i18n';
import useAdmin from '@/components/hook/useAdmin';
import EditableText from '@/components/EditableText';
import { refs } from '@/lib/refs';
import { CldImage } from 'next-cloudinary';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect } from 'react';

export const NAV_PATHS = [
  { key: 'home',     path: '/' },
  { key: 'about',    path: '/about' },
  { key: 'services', path: '/services' },
  { key: 'work',     path: '/work' },
  { key: 'resume',   path: '/resume' },
  { key: 'contact',  path: '/contact' },
];

function AdminToggle({ adminMode, onToggle }) {
  return (
    <div onClick={onToggle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '11px', letterSpacing: '0.1em', color: adminMode ? 'rgb(var(--ink)/0.35)' : 'rgb(var(--rouge))', transition: 'color .2s' }}>preview</span>
      <div style={{ width: '36px', height: '20px', background: adminMode ? 'rgb(var(--rouge))' : 'rgb(var(--ink)/0.15)', borderRadius: '10px', position: 'relative', transition: 'background .25s', flexShrink: 0, border: '1px solid rgb(var(--ink)/0.12)' }}>
        <div style={{ position: 'absolute', top: '3px', left: adminMode ? '18px' : '3px', width: '12px', height: '12px', borderRadius: '50%', background: 'white', transition: 'left .25s' }} />
      </div>
      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '11px', letterSpacing: '0.1em', color: adminMode ? 'rgb(var(--rouge))' : 'rgb(var(--ink)/0.35)', transition: 'color .2s' }}>admin</span>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { lang, setLang, tr } = useLang();
  const { isAdminRaw, adminMode, toggleAdminMode, isAdmin } = useAdmin();
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarId, setAvatarId] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'setting', 'home'), (snap) => {
      if (snap.exists()) setAvatarId(snap.data().avatarPublicId || null);
    });
    return () => unsub();
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <header style={{ borderBottom: '1px solid rgb(var(--ink)/0.1)', background: 'rgb(var(--parchment))', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 }}>

        {/* Bande supérieure — éditable */}
        <div style={{ borderBottom: '1px solid rgb(var(--ink)/0.08)', padding: '5px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <EditableText
            value="Portfolio · Hamid · Statisticien & Actuaire"
            docRef={refs.homeVar('header_tagline')}
            isAdmin={isAdmin} as="span"
            style={{ fontFamily: "'DM Mono',monospace", fontSize: '11px', letterSpacing: '0.16em', color: 'rgb(var(--ink)/0.45)', textTransform: 'uppercase' }}
          />
          <div style={{ display: 'flex', gap: '14px' }}>
            {LOCALES.map((l) => (
              <button key={l} onClick={() => setLang(l)} style={{ fontFamily: "'DM Mono',monospace", fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', background: 'none', border: 'none', padding: '0', color: lang === l ? 'rgb(var(--rouge))' : 'rgb(var(--ink)/0.4)', fontWeight: lang === l ? 700 : 400, borderBottom: lang === l ? '1px solid rgb(var(--rouge))' : '1px solid transparent', paddingBottom: '1px' }}>{LOCALE_LABELS[l]}</button>
            ))}
          </div>
        </div>

        {/* Ligne principale */}
        <div style={{ padding: '0 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
          <Link href="/" data-cursor-hover>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', color: 'rgb(var(--ink))', lineHeight: 1 }}>
              DIMAH<span style={{ color: 'rgb(var(--rouge))' }}>.</span>
            </span>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hidden xl:flex">
            {NAV_PATHS.map(({ key, path }) => {
              const active = pathname === path;
              return (
                <Link key={path} href={path} data-cursor-hover style={{ fontFamily: "'DM Mono',monospace", fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', color: active ? 'rgb(var(--rouge))' : 'rgb(var(--ink)/0.6)', borderBottom: active ? '1px solid rgb(var(--rouge))' : '1px solid transparent', paddingBottom: '2px', transition: 'color .2s' }}>{tr.nav[key]}</Link>
              );
            })}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {isAdminRaw && (
              <div className="hidden xl:flex" style={{ alignItems: 'center', paddingRight: '20px', borderRight: '1px solid rgb(var(--ink)/0.12)', display: 'flex' }}>
                <AdminToggle adminMode={adminMode} onToggle={toggleAdminMode} />
              </div>
            )}
            <Link href="/contact" data-cursor-hover className="hidden xl:block" style={{ fontFamily: "'DM Mono',monospace", fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '9px 20px', background: 'rgb(var(--ink))', color: 'rgb(var(--cream))' }}>{tr.hire}</Link>
            <button className="xl:hidden" onClick={() => setMenuOpen(true)} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', gap: '5px', padding: '4px' }}>
              {[0,1,2].map(i => <div key={i} style={{ width: '24px', height: '1.5px', background: 'rgb(var(--ink))' }} />)}
            </button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 190, background: 'rgba(14,12,8,0.5)', backdropFilter: 'blur(2px)' }} />}

      {/* Panneau slide */}
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 200, width: 'min(420px, 92vw)', background: 'rgb(var(--ink))', transform: menuOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {avatarId && (
          <div style={{ position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none' }}>
            <CldImage src={avatarId} alt="" fill style={{ objectFit: 'cover', objectPosition: 'center top' }} sizes="420px" />
          </div>
        )}

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', padding: '32px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px' }}>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em', color: 'rgb(var(--cream))' }}>
              DIMAH<span style={{ color: 'rgb(var(--rouge))' }}>.</span>
            </span>
            <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: '1px solid rgb(var(--cream)/0.2)', color: 'rgb(var(--cream)/0.6)', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Mono',monospace", fontSize: '14px' }}>✕</button>
          </div>

          {avatarId && (
            <div style={{ width: '72px', height: '72px', marginBottom: '32px', border: '1px solid rgb(var(--rouge)/0.4)', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
              <CldImage src={avatarId} alt="Hamid" fill style={{ objectFit: 'cover', objectPosition: 'center top' }} sizes="72px" />
            </div>
          )}

          {/* Tagline mobile éditable */}
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(var(--cream)/0.3)', marginBottom: '40px' }}>
            <EditableText
              value="Statisticien · Économiste · Actuaire"
              docRef={refs.homeVar('menu_tagline')}
              isAdmin={isAdmin} as="span"
              style={{ color: 'rgb(var(--cream)/0.3)' }}
            />
          </p>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
            {NAV_PATHS.map(({ key, path }, i) => {
              const active = pathname === path;
              return (
                <Link key={path} href={path} onClick={() => setMenuOpen(false)}
                  style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '36px', fontWeight: active ? 700 : 300, fontStyle: active ? 'normal' : 'italic', color: active ? 'rgb(var(--rouge))' : 'rgb(var(--cream)/0.7)', letterSpacing: '-0.02em', lineHeight: 1.2, borderBottom: '1px solid rgb(var(--cream)/0.06)', padding: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  {tr.nav[key]}
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '11px', color: 'rgb(var(--cream)/0.2)', letterSpacing: '0.1em' }}>0{i + 1}</span>
                </Link>
              );
            })}
          </nav>

          <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid rgb(var(--cream)/0.08)' }}>
            <div style={{ display: 'flex', gap: '16px', marginBottom: isAdminRaw ? '16px' : '0' }}>
              {LOCALES.map((l) => (
                <button key={l} onClick={() => setLang(l)} style={{ fontFamily: "'DM Mono',monospace", fontSize: '12px', letterSpacing: '0.15em', background: 'none', border: 'none', color: lang === l ? 'rgb(var(--rouge))' : 'rgb(var(--cream)/0.3)', fontWeight: lang === l ? 700 : 400, textTransform: 'uppercase' }}>{LOCALE_LABELS[l]}</button>
              ))}
            </div>
            {isAdminRaw && (
              <div onClick={toggleAdminMode} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '11px', letterSpacing: '0.1em', color: adminMode ? 'rgb(var(--cream)/0.3)' : 'rgb(var(--rouge))', transition: 'color .2s' }}>preview</span>
                <div style={{ width: '36px', height: '20px', background: adminMode ? 'rgb(var(--rouge))' : 'rgb(var(--cream)/0.15)', borderRadius: '10px', position: 'relative', transition: 'background .25s', border: '1px solid rgb(var(--cream)/0.15)' }}>
                  <div style={{ position: 'absolute', top: '3px', left: adminMode ? '18px' : '3px', width: '12px', height: '12px', borderRadius: '50%', background: 'white', transition: 'left .25s' }} />
                </div>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '11px', letterSpacing: '0.1em', color: adminMode ? 'rgb(var(--rouge))' : 'rgb(var(--cream)/0.3)', transition: 'color .2s' }}>admin</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}