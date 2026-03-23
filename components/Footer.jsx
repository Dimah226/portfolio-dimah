'use client';
import { useLang } from '@/context/LangContext';
import EditableText from '@/components/EditableText';
import useAdmin from '@/components/hook/useAdmin';
import { refs } from '@/lib/refs';

export default function Footer() {
  const { tr } = useLang();
  const { isAdmin } = useAdmin();
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: 'rgb(var(--ink))', color: 'rgb(var(--cream))', borderTop: '1px solid rgb(var(--ink)/0.1)' }}>
      <div style={{ padding: '28px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '28px', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1 }}>
            DIMAH<span style={{ color: 'rgb(var(--rouge))' }}>.</span>
          </span>
          <EditableText
            value={tr.footer.tagline}
            docRef={refs.homeVar('footer_tagline')}
            isAdmin={isAdmin} as="span"
            style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgb(var(--cream)/0.25)' }}
          />
        </div>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgb(var(--cream)/0.2)' }}>
          © {year} Hamid · {tr.footer.rights}
        </span>
      </div>
    </footer>
  );
}