'use client';
import Link from 'next/link';
import { useLang } from '@/context/LangContext';
import { NAV_PATHS } from '@/components/Header';

export default function Footer() {
  const { tr } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer style={{ borderTop: '1px solid rgb(var(--ink)/0.1)', marginTop: '80px', background: 'rgb(var(--ink))', color: 'rgb(var(--cream))' }}>
      {/* Bande supérieure */}
      <div style={{ borderBottom: '1px solid rgb(var(--cream)/0.08)', padding: '48px 40px', display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '40px', alignItems: 'start' }}>

        {/* Gauche : masthead */}
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '48px', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '12px' }}>
            DIMAH<span style={{ color: 'rgb(var(--rouge))' }}>.</span>
          </div>
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgb(var(--cream)/0.3)', marginBottom: '4px' }}>
            {tr.footer.tagline}
          </p>
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.15em', color: 'rgb(var(--cream)/0.2)' }}>
            Vol. I — Portfolio Hamid
          </p>
        </div>

        {/* Centre : règle verticale */}
        <div style={{ width: '1px', background: 'rgb(var(--cream)/0.1)', minHeight: '80px' }} />

        {/* Droite : nav + CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgb(var(--cream)/0.25)', marginBottom: '4px' }}>Navigation</p>
          {NAV_PATHS.map(({ key, path }) => (
            <Link key={path} href={path} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '15px', fontStyle: 'italic', color: 'rgb(var(--cream)/0.5)', transition: 'color .2s' }}
              onMouseEnter={e => e.target.style.color = 'rgb(var(--cream))'}
              onMouseLeave={e => e.target.style.color = 'rgb(var(--cream)/0.5)'}
            >{tr.nav[key]}</Link>
          ))}
        </div>
      </div>

      {/* Bas */}
      <div style={{ padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.15em', color: 'rgb(var(--cream)/0.2)', textTransform: 'uppercase' }}>
          © {year} Hamid · {tr.footer.rights}
        </span>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.15em', color: 'rgb(var(--cream)/0.2)', textTransform: 'uppercase' }}>
          FR · EN · ع
        </span>
      </div>
    </footer>
  );
}
