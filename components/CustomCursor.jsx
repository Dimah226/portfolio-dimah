'use client';
import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos     = useRef({ x: -100, y: -100 });
  const ring    = useRef({ x: -100, y: -100 });
  const raf     = useRef(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      dot.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
    };

    const expand = () => ring.classList.add('cursor-hover');
    const shrink = () => ring.classList.remove('cursor-hover');

    let rx = -100, ry = -100;
    const lerp = (a, b, n) => a + (b - a) * n;

    const animate = () => {
      rx = lerp(rx, pos.current.x, 0.14);
      ry = lerp(ry, pos.current.y, 0.14);
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    const hoverEls = document.querySelectorAll('a,button,[data-cursor-hover]');
    hoverEls.forEach((el) => { el.addEventListener('mouseenter', expand); el.addEventListener('mouseleave', shrink); });

    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <style>{`
        .cursor-dot {
          position:fixed; top:0; left:0; width:6px; height:6px;
          border-radius:50%; background:rgb(var(--rouge));
          pointer-events:none; z-index:99999;
          margin:-3px 0 0 -3px; transition:opacity .2s;
          will-change:transform;
        }
        .cursor-ring {
          position:fixed; top:0; left:0; width:32px; height:32px;
          border-radius:50%; border:1px solid rgb(var(--ink)/0.35);
          pointer-events:none; z-index:99998;
          margin:-16px 0 0 -16px; transition:width .25s,height .25s,border-color .25s;
          will-change:transform;
        }
        .cursor-ring.cursor-hover {
          width:52px; height:52px; margin:-26px 0 0 -26px;
          border-color:rgb(var(--rouge)/0.6);
        }
      `}</style>
      <div className="cursor-dot"  ref={dotRef}  />
      <div className="cursor-ring" ref={ringRef} />
    </>
  );
}
