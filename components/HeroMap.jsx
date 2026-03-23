'use client';
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { useLang } from '@/context/LangContext';

const cache = {};
async function tr(text, lang) {
  if (lang === 'fr' || !text) return text;
  const k = `${lang}::${text}`;
  if (cache[k]) return cache[k];
  try {
    const r = await fetch('/api/translate', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({text,targetLang:lang}) });
    const { translated } = await r.json();
    cache[k] = translated || text;
    return cache[k];
  } catch { return text; }
}

export default function HeroMap() {
  const svgRef = useRef(null);
  const [ready, setReady]   = useState(false);
  const { lang }            = useLang();
  const labelsRef           = useRef({ abidjan: 'Abidjan', ouaga: 'Ouagadougou' });
  const abidjanTextRef      = useRef(null);
  const ouagaTextRef        = useRef(null);

  /* Traduit les noms de villes quand lang change */
  useEffect(() => {
    let dead = false;
    Promise.all([tr('Abidjan', lang), tr('Ouagadougou', lang)]).then(([a, o]) => {
      if (dead) return;
      labelsRef.current = { abidjan: a, ouaga: o };
      if (abidjanTextRef.current) abidjanTextRef.current.textContent = a;
      if (ouagaTextRef.current)   ouagaTextRef.current.textContent   = o;
    });
    return () => { dead = true; };
  }, [lang]);

  useEffect(() => {
    let cancelled = false;

    async function draw() {
      const el = svgRef.current; if (!el) return;
      const W = el.clientWidth || 600, H = el.clientHeight || 700;
      const svg = d3.select(el).attr('width', W).attr('height', H);

      const projection = d3.geoNaturalEarth1().scale(W/1.3).translate([W/2, H/2]).rotate([-10,-5]);
      const pathGen = d3.geoPath().projection(projection);

      const world = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(r=>r.json());
      if (cancelled) return;

      const countries = topojson.feature(world, world.objects.countries);
      svg.selectAll('path').data(countries.features).join('path')
        .attr('d', pathGen).attr('fill','rgb(232,225,211)').attr('stroke','rgb(14,12,8)').attr('stroke-width',0.5).attr('stroke-opacity',0.5);

      const ABIDJAN = [-4.008, 5.359];
      const OUAGA   = [-1.533, 12.364];
      const pA = projection(ABIDJAN), pO = projection(OUAGA);
      if (!pA || !pO) return;

      // Ligne
      svg.append('line').attr('x1',pO[0]).attr('y1',pO[1]).attr('x2',pA[0]).attr('y2',pA[1])
        .attr('stroke','rgb(184,74,47)').attr('stroke-width',1.2).attr('stroke-dasharray','5 3').attr('stroke-opacity',0.85);

      // Abidjan
      svg.append('circle').attr('cx',pA[0]).attr('cy',pA[1]).attr('r',5).attr('fill','rgb(184,74,47)');
      const pulseA = svg.append('circle').attr('cx',pA[0]).attr('cy',pA[1]).attr('r',5).attr('fill','none').attr('stroke','rgb(184,74,47)').attr('stroke-width',1.2).attr('stroke-opacity',0.6);
      (function loopA(){pulseA.attr('r',5).attr('stroke-opacity',0.6).transition().duration(2000).attr('r',16).attr('stroke-opacity',0).on('end',loopA);})();
      const tA = svg.append('text').attr('x',pA[0]+8).attr('y',pA[1]+3).attr('font-family',"'DM Mono',monospace").attr('font-size',10).attr('fill','rgb(184,74,47)').attr('font-weight','600').text(labelsRef.current.abidjan);
      abidjanTextRef.current = tA.node();

      // Ouagadougou
      svg.append('circle').attr('cx',pO[0]).attr('cy',pO[1]).attr('r',4).attr('fill','rgb(14,12,8)').attr('fill-opacity',0.65);
      const pulseO = svg.append('circle').attr('cx',pO[0]).attr('cy',pO[1]).attr('r',4).attr('fill','none').attr('stroke','rgb(14,12,8)').attr('stroke-width',1).attr('stroke-opacity',0.4);
      (function loopO(){pulseO.attr('r',4).attr('stroke-opacity',0.4).transition().duration(2600).attr('r',12).attr('stroke-opacity',0).on('end',loopO);})();
      const tO = svg.append('text').attr('x',pO[0]+7).attr('y',pO[1]+3).attr('font-family',"'DM Mono',monospace").attr('font-size',10).attr('fill','rgb(14,12,8)').attr('fill-opacity',0.65).text(labelsRef.current.ouaga);
      ouagaTextRef.current = tO.node();

      if (!cancelled) setReady(true);
    }

    draw();
    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
      <svg ref={svgRef} width="100%" height="100%" style={{opacity:ready?0.35:0,transition:'opacity 1.4s ease'}} />
    </div>
  );
}