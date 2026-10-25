// Fig. 01 — accuracy vs training time, bubble = inference speed (the design's benchmarkfig1.html chart).
// The numbers are opt.data (src/site/data/hero.json, built by scripts/export_benchmarks.py): accuracy from the
// valli benchmark export, training compute as reported by each model's authors, inference speed as measured.
export function drawFig1(host, opt = {}) {

const NS='http://www.w3.org/2000/svg';
const INK='#141414',MID='#6d6a64',FAINT='#aaa69e',RULE='#dedbd4',PANEL='#f8f7f4';
const MONO='"IBM Plex Mono", ui-monospace, Menlo, monospace',SANS='"Source Sans 3", Arial, sans-serif';
function S(t,a={},p){const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;}
function T(p,x,y,s,a={}){const e=S('text',Object.assign({x,y,'font-family':MONO,'font-size':11,fill:MID},a),p);e.textContent=s;return e;}
const eo=t=>{t=Math.max(0,Math.min(1,t));return 1-Math.pow(1-t,3);};
const back=t=>{t=Math.max(0,Math.min(1,t));const c=1.7;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2);};

/* data: {n, ours, acc, h (training GPU-hours), hl (training label), rps (inference rows/s), src} per model */
const D0=opt.data,M=D0.models.map(m=>({...m}));
const fmtH=h=>h<1?`${Math.round(h*60)} min`:h<48?`${+h.toFixed(h<10?1:0)} GPU-hours`:h<24*60?`${Math.round(h/24)} GPU-days`:`${(h/24/30).toFixed(1)} GPU-months`;
// log time axis X0..X1; models whose authors report no training compute sit in a separate band BX0..BX1
const W=1240,H=660,X0=120,X1=900,BX0=945,BX1=1150,Y0=168,Y1=572;
const hs=M.filter(m=>m.h!=null).map(m=>Math.log10(m.h)),LH0=Math.floor(Math.min(...hs)*4)/4-.35,LH1=Math.ceil(Math.max(...hs)*4)/4+.25;
const A0=Math.floor((Math.min(...M.map(m=>m.acc))-.02)*20)/20,A1=1.0;
const xs=h=>X0+(Math.log10(h)-LH0)/(LH1-LH0)*(X1-X0), ys=a=>Y1-(a-A0)/(A1-A0)*(Y1-Y0);
const rr=rps=>6+((Math.log10(rps)-3.8)/(6.0-3.8))*24;      // radius by inference speed (log)
const svg=S('svg',{viewBox:`20 ${Y0-28} ${W-20} ${H-Y0+28}`,preserveAspectRatio:'xMidYMid meet','aria-label':'Scatter of tabular foundation models: accuracy against training time, bubble size is inference speed.'});
svg.style.cssText='display:block;width:100%;height:100%;overflow:visible';host.appendChild(svg);
const tip=document.createElement('div');tip.style.cssText='position:absolute;pointer-events:none;background:#141414;color:#f4f2ee;font-family:"IBM Plex Mono",ui-monospace,Menlo,monospace;font-size:11px;line-height:1.55;padding:8px 11px;border-radius:2px;white-space:nowrap;opacity:0;transform:translate(-50%,-100%);margin-top:-16px;transition:opacity .12s;z-index:5';host.appendChild(tip);
const defs=S('defs',{},svg);
const rg=S('radialGradient',{id:'vxbest',cx:X0,cy:Y0,r:520,gradientUnits:'userSpaceOnUse'},defs);
S('stop',{offset:'0','stop-color':INK,'stop-opacity':.075},rg);S('stop',{offset:'1','stop-color':INK,'stop-opacity':0},rg);
const clipP=S('clipPath',{id:'vxpc'},defs);S('rect',{x:X0,y:Y0,width:X1-X0,height:Y1-Y0},clipP);

/* ---- the reading key, big ---- */
/* ---- plot ---- */
S('rect',{x:X0,y:Y0,width:X1-X0,height:Y1-Y0,fill:'url(#vxbest)'},svg);
const g=S('g',{},svg);
const TT=[[.25,'15 min'],[1,'1 hour'],[24,'1 day'],[168,'1 week'],[720,'1 month'],[4320,'6 months'],[8760,'1 year'],[87600,'10 years']].filter(([h])=>Math.log10(h)>=LH0&&Math.log10(h)<=LH1);
TT.forEach(([h,l])=>{const x=xs(h);S('line',{x1:x,y1:Y0,x2:x,y2:Y1,stroke:RULE,'stroke-width':.8},g);T(g,x,Y1+22,l,{'text-anchor':'middle','font-size':11.5});});
[.7,.75,.8,.85,.9,.95,1].filter(a=>a>=A0-1e-9).forEach(a=>{const y=ys(a);S('line',{x1:X0,y1:y,x2:BX1,y2:y,stroke:RULE,'stroke-width':.8},g);T(g,X0-12,y+4,a.toFixed(2),{'text-anchor':'end','font-size':11.5});});
S('path',{d:`M${X0} ${Y0} V${Y1} H${X1}`,stroke:MID,'stroke-width':1,fill:'none'},g);
T(g,(X0+X1)/2,Y1+50,'GPU TIME TO TRAIN THE MODEL  ·  log scale  ·  ← faster',{'text-anchor':'middle','font-size':10.5,'letter-spacing':1.4,fill:INK});
T(g,0,0,'ACCURACY  ·  relative to the best model  ·  ↑ better',{'text-anchor':'middle','font-size':10.5,'letter-spacing':1.4,fill:INK,transform:`translate(${X0-66} ${(Y0+Y1)/2}) rotate(-90)`});

D0.caption.forEach((line,i)=>T(g,(X0+X1)/2,Y1+70+i*14,line,{'text-anchor':'middle','font-size':9.5,fill:FAINT}));

const nr=M.filter(m=>m.h==null);
if(nr.length){S('rect',{x:BX0,y:Y0,width:BX1-BX0,height:Y1-Y0,fill:INK,'fill-opacity':.03},g);S('line',{x1:BX0,y1:Y0,x2:BX0,y2:Y1,stroke:MID,'stroke-width':.8,'stroke-dasharray':'2 3'},g);
  T(g,(BX0+BX1)/2,Y1+22,'not published',{'text-anchor':'middle','font-size':11.5});T(g,(BX0+BX1)/2,Y0-10,'TRAINING COMPUTE NOT PUBLISHED',{'text-anchor':'middle','font-size':9,'letter-spacing':1.1,fill:MID});
  nr.sort((a,b)=>b.acc-a.acc).forEach((m,k)=>{m.bx=BX0+(k+.5)*(BX1-BX0)/nr.length;});}

/* size legend, top-right of plot */
const lg=S('g',{},svg),lx=X1-250,ly=Y0+30;
T(lg,lx,ly-6,'INFERENCE SPEED',{'font-size':9.5,'letter-spacing':1.4,fill:INK});
[[1e4,'10k'],[1e5,'100k'],[1e6,'1M rows/s']].forEach(([v,l],i)=>{const r=rr(v),cx=lx+18+i*78;S('circle',{cx,cy:ly+30,r,fill:'none',stroke:MID,'stroke-width':1},lg);T(lg,cx,ly+30+r+15,l,{'text-anchor':'middle','font-size':9.5});});

/* bubbles */
const layer=S('g',{},svg),labels=S('g',{},svg);
const order=[...M].sort((a,b)=>(a.ours?1:0)-(b.ours?1:0));
order.forEach((m,i)=>{m.x=m.h==null?m.bx:xs(m.h);m.y=ys(m.acc);m.r=rr(m.rps);m.i=i;
  m.rings=[0,1].map(()=>S('circle',{cx:m.x,cy:m.y,r:m.r,fill:'none',stroke:INK,'stroke-width':m.ours?1.1:.8,opacity:0},layer));
  m.dot=S('circle',{cx:m.x,cy:m.y,r:0,fill:m.ours?INK:PANEL,stroke:INK,'stroke-width':m.ours?0:1.3},layer);
  m.period=3.4-2.6*((Math.log10(m.rps)-3.8)/(6.0-3.8));});

/* label placement: try right, left, above, below; avoid other labels and bubbles */
const placed=[];
const boxOf=(x,y,w,h)=>({x,y,w,h});
const hit=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
order.filter(m=>!m.ours).sort((a,b)=>b.acc-a.acc).forEach(m=>{const w=m.n.length*6.9,h=13,c=[
   [m.x+m.r+7,m.y+4,'start'],[m.x-m.r-7,m.y+4,'end'],[m.x,m.y-m.r-8,'middle'],[m.x,m.y+m.r+15,'middle']];
  let pick=c[0];for(const cand of c){const[x,y,a]=cand,bx=a==='start'?x:a==='end'?x-w:x-w/2,bb=boxOf(bx,y-11,w,h);
    const clash=placed.some(p=>hit(p,bb))||M.some(o=>o!==m&&hit(boxOf(o.x-o.r,o.y-o.r,o.r*2,o.r*2),bb))||bb.x+bb.w>BX1-4;
    if(!clash){pick=cand;placed.push(bb);break;}}
  m.lab=T(labels,pick[0],pick[1],m.n,{'text-anchor':pick[2],'font-size':11.5,fill:MID,opacity:0,stroke:PANEL,'stroke-width':4,'paint-order':'stroke'});});
// valli label + guides
const V=M[0];
const guides=S('g',{opacity:0},svg);
S('line',{x1:V.x,y1:V.y,x2:V.x,y2:Y1,stroke:INK,'stroke-width':.9,'stroke-dasharray':'3 4'},guides);
S('line',{x1:V.x,y1:V.y,x2:X0,y2:V.y,stroke:INK,'stroke-width':.9,'stroke-dasharray':'3 4'},guides);
S('circle',{cx:V.x,cy:Y1,r:3,fill:INK},guides);S('circle',{cx:X0,cy:V.y,r:3,fill:INK},guides);
const vl=S('g',{opacity:0},svg);
T(vl,V.x+V.r+16,V.y-4,'valli',{'font-family':SANS,'font-size':28,'font-weight':600,fill:INK,stroke:PANEL,'stroke-width':6,'paint-order':'stroke'});
const others=M.filter(m=>!m.ours),rep=others.filter(m=>m.h!=null),hMin=Math.min(...rep.map(m=>m.h)),hMax=Math.max(...rep.map(m=>m.h));
const slow=others.map(m=>V.rps/m.rps),sLo=Math.round(Math.min(...slow)),sHi=Math.round(Math.max(...slow));
T(vl,V.x+V.r+18,V.y+18,`accuracy ${V.acc.toFixed(2)}  ·  trains in ${V.hl}  ·  ${(V.rps/1000).toFixed(0)}k rows/s`,{'font-size':12,fill:INK,stroke:PANEL,'stroke-width':5,'paint-order':'stroke'});
T(vl,V.x+V.r+18,V.y+36,`the others took ${fmtH(hMin)} to ${fmtH(hMax)} to pretrain`,{'font-size':11,fill:MID,stroke:PANEL,'stroke-width':5,'paint-order':'stroke'});
T(vl,V.x+V.r+18,V.y+52,`(where published), and predict ${sLo}–${sHi}× slower`,{'font-size':11,fill:MID,stroke:PANEL,'stroke-width':5,'paint-order':'stroke'});

/* animation */
let t0=null;
function loop(ts){if(t0===null)t0=ts;const t=(ts-t0)/1000;
  order.forEach(m=>{const start=m.ours?1.5:.3+m.i*.09,k=(t-start)/(m.ours?.7:.5),s=m.ours?back(k):eo(k);
    m.dot.setAttribute('r',Math.max(0,m.r*s));
    if(m.lab)m.lab.setAttribute('opacity',eo((t-start-.35)/.4));
    m.rings.forEach((ring,j)=>{if(t<start+.6){ring.setAttribute('opacity',0);return;}
      const ph=(((t-start)/m.period)+j*.5)%1;ring.setAttribute('r',m.r+ph*(m.ours?26:15));ring.setAttribute('opacity',(1-ph)*(m.ours?.42:.2));});});
  guides.setAttribute('opacity',eo((t-2.1)/.5));vl.setAttribute('opacity',eo((t-2.0)/.5));
  if(t<4.5||running)raf=requestAnimationFrame(loop);}

/* hover */
order.forEach(m=>{const hz=S('circle',{cx:m.x,cy:m.y,r:Math.max(m.r,10)+4,fill:'transparent',style:'cursor:pointer'},svg);
  hz.addEventListener('mousemove',ev=>{const r=svg.getBoundingClientRect();
    tip.innerHTML=`<b>${m.n}</b><br>accuracy ${m.acc.toFixed(3)}<br>training ${m.hl}${m.h!=null&&m.h>=1?' ≈ '+Math.round(m.h).toLocaleString()+' GPU-hours':''}<br>${m.rps.toLocaleString()} rows/s${m.ours?' · tvarit':''}<br><span style="color:#aaa69e">${m.src}</span>`;
    const ctm=svg.getScreenCTM(),hr=host.getBoundingClientRect(),pt=svg.createSVGPoint();pt.x=m.x;pt.y=m.y-m.r;const q=pt.matrixTransform(ctm);
    tip.style.left=(q.x-hr.left)+'px';tip.style.top=(q.y-hr.top)+'px';tip.style.opacity=1;});
  hz.addEventListener('mouseleave',()=>tip.style.opacity=0);});

let raf=0,running=true,started=false;
const play=()=>{if(started)return;started=true;(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>{t0=null;raf=requestAnimationFrame(loop);});};
if(opt.autoplay!==false)play();
return {play,svg,destroy(){running=false;cancelAnimationFrame(raf);svg.remove();tip.remove();}};

}
