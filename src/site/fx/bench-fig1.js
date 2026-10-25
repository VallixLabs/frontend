// Fig. 01 on the landing page: error relative to the best model at each number of labelled rows, every ranked
// model on one benchmark, valli in bold. Same ink, rules, tooltip and pop-in as the design's chart; the numbers
// are `opt.data` (src/site/data/hero.json, built by scripts/export_benchmarks.py from the valli benchmark export).
export function drawFig1(host, opt = {}) {

const NS='http://www.w3.org/2000/svg';
const INK='#141414',MID='#6d6a64',FAINT='#aaa69e',RULE='#dedbd4',PANEL='#f8f7f4';
const MONO='"IBM Plex Mono", ui-monospace, Menlo, monospace',SANS='"Source Sans 3", Arial, sans-serif';
function S(t,a={},p){const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;}
function T(p,x,y,s,a={}){const e=S('text',Object.assign({x,y,'font-family':MONO,'font-size':11,fill:MID},a),p);e.textContent=s;return e;}
const eo=t=>{t=Math.max(0,Math.min(1,t));return 1-Math.pow(1-t,3);};
const back=t=>{t=Math.max(0,Math.min(1,t));const c=1.7;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2);};
const ord=n=>{const v=n%100;return n+((v>10&&v<14)?'th':({1:'st',2:'nd',3:'rd'}[n%10]||'th'));};

const data=opt.data,ms=data.ms,ids=Object.keys(data.rows);
const OURS=ids.find(i=>data.models[i].role==='ours'),BASE=ids.find(i=>data.models[i].role==='base');
const best=ms.map((_,j)=>Math.min(...ids.map(i=>data.rows[i][j]).filter(Boolean).map(r=>r.err)));
const rel=(i,j)=>{const r=data.rows[i][j];return r?r.err/best[j]:null;};

const W=1240,H=660,X0=150,X1=1000,Y0=168,Y1=572,LO=.985,HI=1.30;
const xs=m=>X0+(Math.log10(m)-Math.log10(ms[0]))/(Math.log10(ms[ms.length-1])-Math.log10(ms[0]))*(X1-X0);
const ys=v=>Y1-(Math.min(v,HI)-LO)/(HI-LO)*(Y1-Y0);
const svg=S('svg',{viewBox:`20 ${Y0-28} ${W-20} ${H-Y0+28}`,preserveAspectRatio:'xMidYMid meet','aria-label':`${data.bench} ${data.task}: ${data.metric} of every ranked model relative to the best, at ${ms.join(', ')} labelled rows; valli highlighted.`});
svg.style.cssText='display:block;width:100%;height:100%;overflow:visible';host.appendChild(svg);
const tip=document.createElement('div');tip.style.cssText='position:absolute;pointer-events:none;background:#141414;color:#f4f2ee;font-family:"IBM Plex Mono",ui-monospace,Menlo,monospace;font-size:11px;line-height:1.55;padding:8px 11px;border-radius:2px;white-space:nowrap;opacity:0;transform:translate(-50%,-100%);margin-top:-16px;transition:opacity .12s;z-index:5';host.appendChild(tip);
const defs=S('defs',{},svg);
const rg=S('radialGradient',{id:'vxbest',cx:X0,cy:Y1,r:520,gradientUnits:'userSpaceOnUse'},defs);
S('stop',{offset:'0','stop-color':INK,'stop-opacity':.075},rg);S('stop',{offset:'1','stop-color':INK,'stop-opacity':0},rg);
const clip=S('clipPath',{id:'vxpc'},defs);S('rect',{x:X0-12,y:Y0-12,width:X1-X0+24,height:Y1-Y0+24},clip);

/* ---- plot ---- */
S('rect',{x:X0,y:Y0,width:X1-X0,height:Y1-Y0,fill:'url(#vxbest)'},svg);
const g=S('g',{},svg);
ms.forEach((m,j)=>{const x=xs(m);S('line',{x1:x,y1:Y0,x2:x,y2:Y1,stroke:RULE,'stroke-width':.8},g);T(g,x,Y1+22,`${m.toLocaleString()} rows`,{'text-anchor':'middle','font-size':11.5});T(g,x,Y1+38,`${data.n_ranked[j]} ranked`,{'text-anchor':'middle','font-size':9.5,fill:FAINT});});
[1,1.05,1.1,1.15,1.2,1.25,1.3].forEach(v=>{const y=ys(v);S('line',{x1:X0,y1:y,x2:X1,y2:y,stroke:v===1?INK:RULE,'stroke-width':v===1?1.1:.8},g);T(g,X0-12,y+4,v===1?'best':`+${Math.round((v-1)*100)}%`,{'text-anchor':'end','font-size':11.5,fill:v===1?INK:MID});});
S('path',{d:`M${X0} ${Y0} V${Y1} H${X1}`,stroke:MID,'stroke-width':1,fill:'none'},g);
T(g,(X0+X1)/2,Y1+62,`LABELLED ROWS  ·  log scale  ·  ${data.bench.toUpperCase()}, ${data.task.toUpperCase()}, ${data.n_tables} TABLES`,{'text-anchor':'middle','font-size':10.5,'letter-spacing':1.4,fill:INK});
T(g,0,0,`${data.metric.toUpperCase()}  ·  relative to the best model  ·  ↓ better`,{'text-anchor':'middle','font-size':10.5,'letter-spacing':1.4,fill:INK,transform:`translate(${X0-78} ${(Y0+Y1)/2}) rotate(-90)`});

/* ---- every ranked model: a faint line; Kumo-small dashed; valli bold ---- */
const lines=S('g',{'clip-path':'url(#vxpc)'},svg),layer=S('g',{},svg);
const pathOf=i=>{let d='',on=false;ms.forEach((m,j)=>{const v=rel(i,j);if(v==null){on=false;return;}d+=(on?'L':'M')+xs(m).toFixed(1)+' '+ys(v).toFixed(1);on=true;});return d;};
const drawn=[];
ids.forEach(i=>{const ours=i===OURS,base=i===BASE,d=pathOf(i);if(!d)return;
  const p=S('path',{d,fill:'none',stroke:ours?INK:base?MID:FAINT,'stroke-width':ours?2.8:base?1.6:.9,'stroke-opacity':ours||base?1:.6,'stroke-dasharray':base?'5 3':null,'stroke-linejoin':'round'},ours||base?layer:lines);
  const L=p.getTotalLength();p.style.strokeDasharray=base?'5 3':`${L} ${L}`;if(!base)p.style.strokeDashoffset=L;p.style.opacity=base?0:1;
  const dots=ms.map((m,j)=>{const v=rel(i,j);if(v==null||v>HI)return null;return S('circle',{cx:xs(m),cy:ys(v),r:0,fill:ours?INK:PANEL,stroke:ours?INK:base?MID:FAINT,'stroke-width':ours?0:1},ours||base?layer:lines);});
  drawn.push({i,ours,base,p,L,dots,start:ours?1.5:base?1.1:.3+Math.random()*.4});});
// valli's label and its place at each size, in the clear space right of its last point
const V=OURS,vlast=ms.length-1,vl=S('g',{opacity:0},svg);
const vEnd=ys(Math.min(rel(V,vlast)??1,HI)),lx=X1+18,ly=Math.min(Y1-60,Math.max(Y0+30,vEnd-40));
T(vl,lx,ly,'valli',{'font-family':SANS,'font-size':28,'font-weight':600,fill:INK});
ms.forEach((m,j)=>{const r=data.rows[V][j];if(r)T(vl,lx+2,ly+22+j*17,`${ord(r.place)} of ${data.n_ranked[j]} at ${m.toLocaleString()} rows`,{'font-size':11.5,fill:j===0?INK:MID});});
// legend above the plot
const bl=S('g',{opacity:0},svg),lg=[[INK,2.8,null,'valli'],[MID,1.6,'5 3',`${data.models[BASE].n}, released (valli's base)`],[FAINT,.9,null,'every other ranked model']];
let gx=X0;lg.forEach(([c,w,da,l])=>{S('line',{x1:gx,y1:Y0-16,x2:gx+26,y2:Y0-16,stroke:c,'stroke-width':w,'stroke-dasharray':da},bl);const t=T(bl,gx+34,Y0-12,l,{'font-size':11,fill:INK});gx+=34+t.getComputedTextLength()+26;});

/* animation */
let t0=null;
function loop(ts){if(t0===null)t0=ts;const t=(ts-t0)/1000;
  drawn.forEach(o=>{const k=eo((t-o.start)/(o.ours?1:.8));if(o.base)o.p.style.opacity=k;else o.p.style.strokeDashoffset=o.L*(1-k);
    o.dots.forEach((c,j)=>{if(!c)return;const s=o.ours?back((t-o.start-.2-j*.12)/.6):eo((t-o.start-.2)/.5);c.setAttribute('r',Math.max(0,(o.ours?5:o.base?3.5:2.2)*s));});});
  vl.setAttribute('opacity',eo((t-2.1)/.5));bl.setAttribute('opacity',eo((t-2.0)/.5));
  if(t<3.5&&running)raf=requestAnimationFrame(loop);}

/* hover */
drawn.forEach(o=>o.dots.forEach((c,j)=>{if(!c)return;const r=data.rows[o.i][j],hz=S('circle',{cx:c.getAttribute('cx'),cy:c.getAttribute('cy'),r:9,fill:'transparent',style:'cursor:pointer'},svg);
  hz.addEventListener('mousemove',()=>{tip.innerHTML=`<b>${data.models[o.i].n}</b><br>${ms[j].toLocaleString()} rows · ${ord(r.place)} of ${data.n_ranked[j]}<br>${data.metric} ${r.err.toFixed(3)} (${rel(o.i,j)===1?'best':'+'+((rel(o.i,j)-1)*100).toFixed(1)+'%'})`;
    const ctm=svg.getScreenCTM(),hr=host.getBoundingClientRect(),pt=svg.createSVGPoint();pt.x=+c.getAttribute('cx');pt.y=+c.getAttribute('cy')-6;const q=pt.matrixTransform(ctm);
    tip.style.left=(q.x-hr.left)+'px';tip.style.top=(q.y-hr.top)+'px';tip.style.opacity=1;});
  hz.addEventListener('mouseleave',()=>tip.style.opacity=0);}));

let raf=0,running=true,started=false;
const play=()=>{if(started)return;started=true;(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>{t0=null;raf=requestAnimationFrame(loop);});};
if(opt.autoplay!==false)play();
return {play,svg,destroy(){running=false;cancelAnimationFrame(raf);svg.remove();tip.remove();}};

}
