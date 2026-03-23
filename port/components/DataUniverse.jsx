'use client';
import { useEffect, useRef } from 'react';

/*
 * DataUniverse — Moteur de particules statistiques interactif
 * ──────────────────────────────────────────────────────────
 * - 460 particules formant des distributions statistiques
 * - Souris repousse les particules (champ de force)
 * - Clic → explosion + morphing vers la distribution suivante
 * - Constellations entre particules proches
 * - Courbe PDF en rouge tuile tracée en temps réel
 * - Stats live (n, μ̂, σ̂)
 * - Easter egg : taper "dimah" au clavier
 */

const DISTS = [
  {
    name: 'Loi Normale',
    formula: 'f(x) = (1/σ√2π) · e^(−x²/2σ²)',
    pdf: (x) => { const u = (x - 0.5) * 7; return Math.exp(-u * u / 2); },
  },
  {
    name: 'Loi Exponentielle',
    formula: 'f(x) = λ · e^(−λx)   [λ = 4]',
    pdf: (x) => (x < 0 ? 0 : 3.0 * Math.exp(-x * 4.2)),
  },
  {
    name: 'Distribution Bimodale',
    formula: 'f(x) = ½[φ(x−μ₁) + φ(x−μ₂)]',
    pdf: (x) => {
      const u1 = (x - 0.27) * 13, u2 = (x - 0.73) * 13;
      return 0.52 * (Math.exp(-u1 * u1 / 2) + Math.exp(-u2 * u2 / 2));
    },
  },
  {
    name: 'Loi Bêta (α = β = 0.4)',
    formula: 'f(x) = x^(α−1)(1−x)^(β−1) / B(α,β)',
    pdf: (x) => {
      if (x <= 0.015 || x >= 0.985) return 3.5;
      return 0.13 / Math.sqrt(x * (1 - x));
    },
  },
  {
    name: 'Loi Chi-deux (k = 3)',
    formula: 'f(x) = x^(k/2−1) · e^(−x/2) / 2^(k/2)Γ(k/2)',
    pdf: (x) => { const t = x * 7.5; return t > 0 ? Math.sqrt(t) * Math.exp(-t / 2) * 0.85 : 0; },
  },
];

const NP = 460;

function maxPdf(dist) {
  let m = 0;
  for (let i = 0; i <= 300; i++) m = Math.max(m, dist.pdf(i / 300));
  return m || 1;
}

export default function DataUniverse() {
  const canvasRef   = useRef(null);
  const nameRef     = useRef(null);
  const formulaRef  = useRef(null);
  const statNRef    = useRef(null);
  const statMuRef   = useRef(null);
  const statSigRef  = useRef(null);
  const eggRef      = useRef(null);
  const distNumRef  = useRef(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const cx = cv.getContext('2d');
    const DPR = window.devicePixelRatio || 1;

    const W = cv.offsetWidth;
    const H = cv.offsetHeight;
    cv.width  = W * DPR;
    cv.height = H * DPR;
    cx.scale(DPR, DPR);

    /* ── Particules ── */
    const pts = Array.from({ length: NP }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: 0, vy: 0, tx: W / 2, ty: H / 2,
      r: 0.7 + Math.random() * 1.9,
      a: 0.2 + Math.random() * 0.6,
      accent: Math.random() < 0.07,
      ph: Math.random() * Math.PI * 2,
    }));

    let dIdx = 0;
    let exploding = false;
    let frameNum = 0;
    let mx = -9999, my = -9999, mActive = false;
    let rafId;

    /* ── Assigner les cibles selon la distribution ── */
    function setDist(idx) {
      dIdx = idx;
      const dist = DISTS[idx];
      const mg = 60, uw = W - mg * 2;
      const bY = H * 0.5, amp = H * 0.37;
      const mp = maxPdf(dist);

      pts.forEach((p, i) => {
        const t = (i + Math.random() * 0.6) / NP;
        const rx = mg + t * uw;
        const nx = (rx - mg) / uw;
        const pv = dist.pdf(nx) / mp;
        p.tx = rx + (Math.random() - 0.5) * 16;
        p.ty = bY + amp * 0.12 - pv * amp + (Math.random() - 0.5) * 14;
        p.tx = Math.max(8, Math.min(W - 8, p.tx));
        p.ty = Math.max(10, Math.min(H - 10, p.ty));
      });

      if (nameRef.current)    nameRef.current.textContent    = dist.name;
      if (formulaRef.current) formulaRef.current.textContent = dist.formula;
      if (distNumRef.current) distNumRef.current.textContent = `${idx + 1}/${DISTS.length}`;
      updateStats();
    }

    function updateStats() {
      const xs = pts.map((p) => p.x / W);
      const mu  = xs.reduce((a, b) => a + b, 0) / xs.length;
      const sig = Math.sqrt(xs.map((x) => (x - mu) ** 2).reduce((a, b) => a + b, 0) / xs.length);
      if (statNRef.current)   statNRef.current.textContent   = `n = ${NP}`;
      if (statMuRef.current)  statMuRef.current.textContent  = `μ̂ = ${mu.toFixed(3)}`;
      if (statSigRef.current) statSigRef.current.textContent = `σ̂ = ${sig.toFixed(3)}`;
    }

    function explodeParticles(cb) {
      exploding = true;
      pts.forEach((p) => {
        const a = Math.random() * Math.PI * 2, s = 12 + Math.random() * 28;
        p.vx = Math.cos(a) * s; p.vy = Math.sin(a) * s;
      });
      setTimeout(() => { exploding = false; if (cb) cb(); }, 560);
    }

    setDist(0);

    /* ── Dessiner la courbe PDF ── */
    function drawCurve() {
      const dist = DISTS[dIdx];
      const mg = 60, uw = W - mg * 2;
      const bY = H * 0.5, amp = H * 0.37;
      const mp = maxPdf(dist);

      cx.beginPath();
      for (let i = 0; i <= 320; i++) {
        const t = i / 320;
        const x = mg + t * uw;
        const pv = dist.pdf(t) / mp;
        const y = bY + amp * 0.12 - pv * amp;
        i === 0 ? cx.moveTo(x, y) : cx.lineTo(x, y);
      }
      cx.strokeStyle = 'rgba(184,74,47,0.55)';
      cx.lineWidth = 1.5;
      cx.stroke();

      const baseY = bY + amp * 0.12;
      cx.lineTo(mg + uw, baseY);
      cx.lineTo(mg, baseY);
      cx.closePath();
      cx.fillStyle = 'rgba(184,74,47,0.035)';
      cx.fill();
    }

    /* ── Boucle principale ── */
    function tick() {
      frameNum++;

      cx.fillStyle = 'rgba(14,12,8,0.2)';
      cx.fillRect(0, 0, W, H);

      drawCurve();

      /* Constellations */
      for (let i = 0; i < NP; i += 4) {
        for (let j = i + 4; j < NP; j += 4) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          if (Math.abs(dx) > 54 || Math.abs(dy) > 54) continue;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 54) {
            cx.beginPath();
            cx.moveTo(pts[i].x, pts[i].y);
            cx.lineTo(pts[j].x, pts[j].y);
            cx.strokeStyle = `rgba(244,239,228,${0.065 * (1 - d / 54)})`;
            cx.lineWidth = 0.35;
            cx.stroke();
          }
        }
      }

      /* Particules */
      pts.forEach((p) => {
        const k = exploding ? 0.012 : 0.055;
        p.vx += (p.tx - p.x) * k;
        p.vy += (p.ty - p.y) * k;

        if (!exploding) {
          p.vx += Math.sin(frameNum * 0.018 + p.ph) * 0.025;
          p.vy += Math.cos(frameNum * 0.015 + p.ph) * 0.018;
        }

        if (mActive) {
          const dx = p.x - mx, dy = p.y - my;
          const d2 = dx * dx + dy * dy;
          if (d2 < 150 * 150) {
            const d = Math.sqrt(d2) || 1;
            const f = ((150 - d) / 150) * 11;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }

        p.vx *= 0.85; p.vy *= 0.85;
        p.x += p.vx; p.y += p.vy;

        cx.beginPath();
        cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cx.fillStyle = p.accent
          ? `rgba(184,74,47,${p.a})`
          : `rgba(244,239,228,${p.a})`;
        cx.fill();
      });

      if (frameNum % 90 === 0) updateStats();
      rafId = requestAnimationFrame(tick);
    }
    tick();

    /* ── Événements ── */
    const onMove = (e) => {
      const r = cv.getBoundingClientRect();
      mx = (e.clientX - r.left) * (W / r.width);
      my = (e.clientY - r.top)  * (H / r.height);
      mActive = true;
    };
    const onLeave = () => (mActive = false);
    const onClick = () => {
      const next = (dIdx + 1) % DISTS.length;
      explodeParticles(() => setDist(next));
    };

    let typed = '';
    const onKey = (e) => {
      typed = (typed + e.key.toLowerCase()).slice(-5);
      if (typed === 'dimah') {
        explodeParticles();
        if (eggRef.current) {
          eggRef.current.style.opacity = '1';
          setTimeout(() => { if (eggRef.current) eggRef.current.style.opacity = '0'; }, 2800);
        }
        typed = '';
      }
    };

    cv.addEventListener('mousemove', onMove);
    cv.addEventListener('mouseleave', onLeave);
    cv.addEventListener('click', onClick);
    window.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(rafId);
      cv.removeEventListener('mousemove', onMove);
      cv.removeEventListener('mouseleave', onLeave);
      cv.removeEventListener('click', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const monoStyle = { fontFamily: "'DM Mono',monospace" };

  return (
    <section
      style={{ position: 'relative', width: '100%', height: '580px', background: '#0E0C08', overflow: 'hidden', cursor: 'crosshair' }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* Distribution label */}
      <div style={{ position: 'absolute', top: '22px', left: '26px', pointerEvents: 'none' }}>
        <div ref={nameRef} style={{ ...monoStyle, fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#B84A2F', marginBottom: '5px' }} />
        <div ref={formulaRef} style={{ ...monoStyle, fontSize: '11px', color: 'rgba(244,239,228,0.45)', fontStyle: 'italic' }} />
        <div style={{ marginTop: '10px', width: '24px', height: '1px', background: '#B84A2F', opacity: 0.5 }} />
      </div>

      {/* Stats */}
      <div style={{ position: 'absolute', top: '22px', right: '26px', textAlign: 'right', pointerEvents: 'none', lineHeight: '1.9' }}>
        <div ref={statNRef}   style={{ ...monoStyle, fontSize: '9px', letterSpacing: '0.12em', color: 'rgba(244,239,228,0.22)' }} />
        <div ref={statMuRef}  style={{ ...monoStyle, fontSize: '9px', letterSpacing: '0.12em', color: 'rgba(244,239,228,0.22)' }} />
        <div ref={statSigRef} style={{ ...monoStyle, fontSize: '9px', letterSpacing: '0.12em', color: 'rgba(244,239,228,0.22)' }} />
      </div>

      {/* Easter egg */}
      <div
        ref={eggRef}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          ...monoStyle, fontSize: '44px', letterSpacing: '0.5em',
          color: '#B84A2F', opacity: 0, pointerEvents: 'none',
          fontWeight: 700, transition: 'opacity 0.4s',
          textTransform: 'uppercase',
        }}
      >
        DIMAH
      </div>

      {/* Hint */}
      <div style={{ position: 'absolute', bottom: '18px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
        <span style={{ ...monoStyle, fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(244,239,228,0.18)' }}>
          cliquer · bouger · easter egg : taper dimah
        </span>
      </div>

      {/* Distribution counter */}
      <div ref={distNumRef} style={{ position: 'absolute', bottom: '18px', right: '26px', ...monoStyle, fontSize: '9px', letterSpacing: '0.15em', color: 'rgba(244,239,228,0.15)', pointerEvents: 'none' }} />
    </section>
  );
}
