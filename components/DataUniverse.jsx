'use client';
import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/context/LangContext';

const DISTS = [
  { name: 'Loi Normale',          formula: 'f(x) = (1/σ√2π) · e^(−x²/2σ²)',             pdf: (x) => { const u=(x-0.5)*7; return Math.exp(-u*u/2); } },
  { name: 'Loi Exponentielle',    formula: 'f(x) = λ · e^(−λx)   [λ = 4]',               pdf: (x) => (x<0?0:3.0*Math.exp(-x*4.2)) },
  { name: 'Distribution Bimodale',formula: 'f(x) = ½[φ(x−μ₁) + φ(x−μ₂)]',              pdf: (x) => { const u1=(x-0.27)*13,u2=(x-0.73)*13; return 0.52*(Math.exp(-u1*u1/2)+Math.exp(-u2*u2/2)); } },
  { name: 'Loi Bêta (α = β = 0.4)',formula:'f(x) = x^(α−1)(1−x)^(β−1) / B(α,β)',       pdf: (x) => { if(x<=0.015||x>=0.985)return 3.5; return 0.13/Math.sqrt(x*(1-x)); } },
  { name: 'Loi Chi-deux (k = 3)', formula: 'f(x) = x^(k/2−1) · e^(−x/2) / 2^(k/2)Γ(k/2)', pdf: (x) => { const t=x*7.5; return t>0?Math.sqrt(t)*Math.exp(-t/2)*0.85:0; } },
];

const NP = 460;
const cache = {};

async function tr(text, lang) {
  if (lang === 'fr' || !text) return text;
  const k = `${lang}::${text}`;
  if (cache[k]) return cache[k];
  try {
    const r = await fetch('/api/translate', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({text, targetLang:lang}) });
    const { translated } = await r.json();
    cache[k] = translated || text;
    return cache[k];
  } catch { return text; }
}

function maxPdf(dist) { let m=0; for(let i=0;i<=300;i++) m=Math.max(m,dist.pdf(i/300)); return m||1; }

function getCSSColors() {
  const style = getComputedStyle(document.documentElement);
  const get = (v) => style.getPropertyValue(v).trim() || null;
  const parse = (raw, fb) => { if(!raw) return fb; const p=raw.split(' ').map(Number); return p.length===3&&p.every(n=>!isNaN(n))?p:fb; };
  return { ink:parse(get('--ink'),[14,12,8]), cream:parse(get('--cream'),[244,239,228]), rouge:parse(get('--rouge'),[184,74,47]) };
}

export default function DataUniverse() {
  const { lang } = useLang();
  const canvasRef  = useRef(null);
  const nameRef    = useRef(null);
  const formulaRef = useRef(null);
  const statNRef   = useRef(null);
  const statMuRef  = useRef(null);
  const statSigRef = useRef(null);
  const eggRef     = useRef(null);
  const distNumRef = useRef(null);
  const hintRef    = useRef(null);
  const dIdxRef    = useRef(0);

  /* Traduit les noms des distributions quand la langue change */
  const [distNames, setDistNames] = useState(DISTS.map(d => d.name));
  const [hint, setHint]           = useState('cliquer · bouger · easter egg : taper dimah');

  useEffect(() => {
    let dead = false;
    Promise.all([
      ...DISTS.map(d => tr(d.name, lang)),
      tr('cliquer · bouger · easter egg : taper dimah', lang),
    ]).then((results) => {
      if (dead) return;
      setDistNames(results.slice(0, DISTS.length));
      setHint(results[DISTS.length]);
      /* Met à jour le label affiché dans le canvas */
      if (nameRef.current) nameRef.current.textContent = results[dIdxRef.current];
    });
    return () => { dead = true; };
  }, [lang]);

  /* Met à jour le label quand distNames change */
  useEffect(() => {
    if (nameRef.current) nameRef.current.textContent = distNames[dIdxRef.current];
  }, [distNames]);

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const cx = cv.getContext('2d');
    const DPR = window.devicePixelRatio || 1;
    const W = cv.offsetWidth, H = cv.offsetHeight;
    cv.width = W*DPR; cv.height = H*DPR; cx.scale(DPR,DPR);

    const pts = Array.from({length:NP},()=>({x:Math.random()*W,y:Math.random()*H,vx:0,vy:0,tx:W/2,ty:H/2,r:0.7+Math.random()*1.9,a:0.2+Math.random()*0.6,accent:Math.random()<0.07,ph:Math.random()*Math.PI*2}));
    let exploding=false,frameNum=0,mx=-9999,my=-9999,mActive=false,rafId;

    function setDist(idx) {
      dIdxRef.current = idx;
      const dist=DISTS[idx];
      const mg=60,uw=W-mg*2,bY=H*0.5,amp=H*0.37,mp=maxPdf(dist);
      pts.forEach((p,i)=>{
        const t=(i+Math.random()*0.6)/NP,rx=mg+t*uw,nx=(rx-mg)/uw,pv=dist.pdf(nx)/mp;
        p.tx=rx+(Math.random()-0.5)*16; p.ty=bY+amp*0.12-pv*amp+(Math.random()-0.5)*14;
        p.tx=Math.max(8,Math.min(W-8,p.tx)); p.ty=Math.max(10,Math.min(H-10,p.ty));
      });
      if(nameRef.current)    nameRef.current.textContent    = distNames[idx] || dist.name;
      if(formulaRef.current) formulaRef.current.textContent = dist.formula;
      if(distNumRef.current) distNumRef.current.textContent = `${idx+1}/${DISTS.length}`;
      updateStats();
    }

    function updateStats() {
      const xs=pts.map(p=>p.x/W),mu=xs.reduce((a,b)=>a+b,0)/xs.length;
      const sig=Math.sqrt(xs.map(x=>(x-mu)**2).reduce((a,b)=>a+b,0)/xs.length);
      if(statNRef.current)   statNRef.current.textContent=`n = ${NP}`;
      if(statMuRef.current)  statMuRef.current.textContent=`μ̂ = ${mu.toFixed(3)}`;
      if(statSigRef.current) statSigRef.current.textContent=`σ̂ = ${sig.toFixed(3)}`;
    }

    function explodeParticles(cb){
      exploding=true;
      pts.forEach(p=>{const a=Math.random()*Math.PI*2,s=12+Math.random()*28;p.vx=Math.cos(a)*s;p.vy=Math.sin(a)*s;});
      setTimeout(()=>{exploding=false;if(cb)cb();},560);
    }

    setDist(0);

    function drawCurve(rouge){
      const dist=DISTS[dIdxRef.current],mg=60,uw=W-mg*2,bY=H*0.5,amp=H*0.37,mp=maxPdf(dist),[r,g,b]=rouge;
      cx.beginPath();
      for(let i=0;i<=320;i++){const t=i/320,x=mg+t*uw,pv=dist.pdf(t)/mp,y=bY+amp*0.12-pv*amp;i===0?cx.moveTo(x,y):cx.lineTo(x,y);}
      cx.strokeStyle=`rgba(${r},${g},${b},0.55)`;cx.lineWidth=1.5;cx.stroke();
      const baseY=bY+amp*0.12;cx.lineTo(mg+uw,baseY);cx.lineTo(mg,baseY);cx.closePath();
      cx.fillStyle=`rgba(${r},${g},${b},0.035)`;cx.fill();
    }

    function tick(){
      frameNum++;
      const {ink,cream,rouge}=getCSSColors();
      const [ir,ig,ib]=ink,[cr,cg,cb]=cream;
      cx.fillStyle=`rgba(${ir},${ig},${ib},0.2)`;cx.fillRect(0,0,W,H);
      drawCurve(rouge);
      for(let i=0;i<NP;i+=4)for(let j=i+4;j<NP;j+=4){
        const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y;
        if(Math.abs(dx)>54||Math.abs(dy)>54)continue;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<54){cx.beginPath();cx.moveTo(pts[i].x,pts[i].y);cx.lineTo(pts[j].x,pts[j].y);cx.strokeStyle=`rgba(${cr},${cg},${cb},${0.065*(1-d/54)})`;cx.lineWidth=0.35;cx.stroke();}
      }
      pts.forEach(p=>{
        const k=exploding?0.012:0.055;
        p.vx+=(p.tx-p.x)*k;p.vy+=(p.ty-p.y)*k;
        if(!exploding){p.vx+=Math.sin(frameNum*0.018+p.ph)*0.025;p.vy+=Math.cos(frameNum*0.015+p.ph)*0.018;}
        if(mActive){const dx=p.x-mx,dy=p.y-my,d2=dx*dx+dy*dy;if(d2<150*150){const d=Math.sqrt(d2)||1,f=((150-d)/150)*11;p.vx+=(dx/d)*f;p.vy+=(dy/d)*f;}}
        p.vx*=0.85;p.vy*=0.85;p.x+=p.vx;p.y+=p.vy;
        cx.beginPath();cx.arc(p.x,p.y,p.r,0,Math.PI*2);
        cx.fillStyle=p.accent?`rgba(${rouge[0]},${rouge[1]},${rouge[2]},${p.a})`:`rgba(${cr},${cg},${cb},${p.a})`;cx.fill();
      });
      if(frameNum%90===0)updateStats();
      rafId=requestAnimationFrame(tick);
    }
    tick();

    const onMove=(e)=>{const r=cv.getBoundingClientRect();mx=(e.clientX-r.left)*(W/r.width);my=(e.clientY-r.top)*(H/r.height);mActive=true;};
    const onLeave=()=>(mActive=false);
    const onClick=()=>{const next=(dIdxRef.current+1)%DISTS.length;explodeParticles(()=>setDist(next));};
    let typed='';
    const onKey=(e)=>{typed=(typed+e.key.toLowerCase()).slice(-5);if(typed==='dimah'){explodeParticles();if(eggRef.current){eggRef.current.style.opacity='1';setTimeout(()=>{if(eggRef.current)eggRef.current.style.opacity='0';},2800);}typed='';}};

    cv.addEventListener('mousemove',onMove);cv.addEventListener('mouseleave',onLeave);cv.addEventListener('click',onClick);window.addEventListener('keydown',onKey);
    return ()=>{cancelAnimationFrame(rafId);cv.removeEventListener('mousemove',onMove);cv.removeEventListener('mouseleave',onLeave);cv.removeEventListener('click',onClick);window.removeEventListener('keydown',onKey);};
  }, []);

  const mono = { fontFamily:"'DM Mono',monospace" };

  return (
    <section style={{position:'relative',width:'100%',height:'580px',background:'rgb(var(--ink))',overflow:'hidden',cursor:'crosshair'}}>
      <canvas ref={canvasRef} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />
      <div style={{position:'absolute',top:'22px',left:'26px',pointerEvents:'none'}}>
        <div ref={nameRef} style={{...mono,fontSize:'10px',letterSpacing:'0.3em',textTransform:'uppercase',color:'rgb(var(--rouge))',marginBottom:'5px'}} />
        <div ref={formulaRef} style={{...mono,fontSize:'11px',color:'rgb(var(--cream)/0.45)',fontStyle:'italic'}} />
        <div style={{marginTop:'10px',width:'24px',height:'1px',background:'rgb(var(--rouge))',opacity:0.5}} />
      </div>
      <div style={{position:'absolute',top:'22px',right:'26px',textAlign:'right',pointerEvents:'none',lineHeight:'1.9'}}>
        <div ref={statNRef}   style={{...mono,fontSize:'9px',letterSpacing:'0.12em',color:'rgb(var(--cream)/0.22)'}} />
        <div ref={statMuRef}  style={{...mono,fontSize:'9px',letterSpacing:'0.12em',color:'rgb(var(--cream)/0.22)'}} />
        <div ref={statSigRef} style={{...mono,fontSize:'9px',letterSpacing:'0.12em',color:'rgb(var(--cream)/0.22)'}} />
      </div>
      <div ref={eggRef} style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',...mono,fontSize:'44px',letterSpacing:'0.5em',color:'rgb(var(--rouge))',opacity:0,pointerEvents:'none',fontWeight:700,transition:'opacity 0.4s',textTransform:'uppercase'}}>DIMAH</div>
      <div style={{position:'absolute',bottom:'18px',left:'50%',transform:'translateX(-50%)',pointerEvents:'none',whiteSpace:'nowrap'}}>
        <span style={{...mono,fontSize:'8px',letterSpacing:'0.22em',textTransform:'uppercase',color:'rgb(var(--cream)/0.18)'}}>{hint}</span>
      </div>
      <div ref={distNumRef} style={{position:'absolute',bottom:'18px',right:'26px',...mono,fontSize:'9px',letterSpacing:'0.15em',color:'rgb(var(--cream)/0.15)',pointerEvents:'none'}} />
    </section>
  );
}