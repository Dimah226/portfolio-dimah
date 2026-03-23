'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useLang } from '@/context/LangContext';
import { LOCALES, LOCALE_LABELS } from '@/lib/i18n';
import useAdmin from '@/components/hook/useAdmin';
import { Switch } from '@/components/ui/switch';

export const NAV_PATHS = [
  { key: 'home',     path: '/' },
  { key: 'about',    path: '/about' },
  { key: 'services', path: '/services' },
  { key: 'work',     path: '/work' },
  { key: 'resume',   path: '/resume' },
  { key: 'contact',  path: '/contact' },
];

export default function Header() {
  const pathname = usePathname();
  const { lang, setLang, tr } = useLang();
  const { isAdminRaw, adminMode, setAdminMode } = useAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header style={{
      borderBottom: '1px solid rgb(var(--ink)/0.08)',
      background: 'rgb(var(--parchment)/0.92)',
      backdropFilter: 'blur(12px)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      {/* Bande de date magazine */}
      <div style={{ borderBottom: '1px solid rgb(var(--ink)/0.07)', padding: '4px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.18em', color: 'rgb(var(--ink)/0.3)', textTransform: 'uppercase' }}>
          Portfolio · Hamid · Statisticien &amp; Data Scientist
        </span>
        <div style={{ display: 'flex', gap: '12px' }}>
          {LOCALES.map((l) => (
            <button key={l} onClick={() => setLang(l)} style={{
              fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.15em',
              textTransform: 'uppercase', background: 'none', border: 'none', padding: '0',
              color: lang === l ? 'rgb(var(--rouge))' : 'rgb(var(--ink)/0.3)',
              fontWeight: lang === l ? 700 : 400,
              borderBottom: lang === l ? '1px solid rgb(var(--rouge))' : '1px solid transparent',
              paddingBottom: '1px',
            }}>{LOCALE_LABELS[l]}</button>
          ))}
        </div>
      </div>

      {/* Ligne principale */}
      <div style={{ padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', height: '56px' }}>
        <Link href="/" data-cursor-hover>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '26px', fontWeight: 700, letterSpacing: '-0.03em', color: 'rgb(var(--ink))', lineHeight: 1 }}>
            DIMAH<span style={{ color: 'rgb(var(--rouge))' }}>.</span>
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden xl:flex" style={{ alignItems: 'center', gap: '28px', display: 'flex' }}>
          {NAV_PATHS.map(({ key, path }) => {
            const active = pathname === path;
            return (
              <Link key={path} href={path} data-cursor-hover style={{
                fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase',
                color: active ? 'rgb(var(--rouge))' : 'rgb(var(--ink)/0.45)',
                borderBottom: active ? '1px solid rgb(var(--rouge))' : '1px solid transparent',
                paddingBottom: '2px', transition: 'color .2s',
              }}>{tr.nav[key]}</Link>
            );
          })}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isAdminRaw && (
            <div className="hidden xl:flex" style={{ alignItems: 'center', gap: '8px', paddingRight: '16px', borderRight: '1px solid rgb(var(--ink)/0.1)', display: 'flex' }}>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', color: 'rgb(var(--ink)/0.3)', letterSpacing: '0.1em' }}>preview</span>
              <Switch checked={adminMode} onCheckedChange={setAdminMode} />
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', color: 'rgb(var(--rouge)/0.7)', letterSpacing: '0.1em' }}>admin</span>
            </div>
          )}
          <Link href="/contact" data-cursor-hover className="hidden xl:block" style={{
            fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
            padding: '8px 18px', background: 'rgb(var(--ink))', color: 'rgb(var(--cream))',
          }}>{tr.hire}</Link>

          {/* Mobile burger */}
          <button className="xl:hidden" onClick={() => setMobileOpen(true)} style={{ background: 'none', border: 'none', fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.15em', color: 'rgb(var(--ink)/0.6)', textTransform: 'uppercase' }}>MENU</button>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgb(var(--parchment))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '28px' }}>
          <button onClick={() => setMobileOpen(false)} style={{ position: 'absolute', top: '24px', right: '28px', background: 'none', border: 'none', fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.15em', color: 'rgb(var(--ink)/0.4)', textTransform: 'uppercase' }}>FERMER</button>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '40px', fontWeight: 700, color: 'rgb(var(--ink))' }}>DIMAH<span style={{ color: 'rgb(var(--rouge))' }}>.</span></span>
          {NAV_PATHS.map(({ key, path }) => (
            <Link key={path} href={path} onClick={() => setMobileOpen(false)} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '32px', fontWeight: 600, fontStyle: 'italic', color: pathname === path ? 'rgb(var(--rouge))' : 'rgb(var(--ink)/0.65)' }}>{tr.nav[key]}</Link>
          ))}
          <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
            {LOCALES.map((l) => (
              <button key={l} onClick={() => setLang(l)} style={{ fontFamily: "'DM Mono',monospace", fontSize: '11px', letterSpacing: '0.15em', background: 'none', border: 'none', color: lang === l ? 'rgb(var(--rouge))' : 'rgb(var(--ink)/0.35)', fontWeight: lang === l ? 700 : 400 }}>{LOCALE_LABELS[l]}</button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
