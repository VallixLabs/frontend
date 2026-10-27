// Fig. 01: accuracy vs training time (the design's benchmarkfig1.html chart, laid out to fill its container).
// The numbers are opt.data (src/site/data/hero.json, built by scripts/export_benchmarks.py): accuracy from the
// valli benchmark export, training compute as reported by each model's authors, inference speed where measured.
// The SVG is drawn in CSS pixels at the host's size, so text stays a readable size and the plot uses all the
// space the hero leaves; it is redrawn (without the intro animation) when the host is resized.
export function drawFig1(host, opt = {}) {

const NS='http://www.w3.org/2000/svg';
const INK='#141414',VX='#2e5c36',MID='#6d6a64',TICK='#3e3c38',LAB='#3e3c38',RULE='#dedbd4',LEAD='#cfccc5',PANEL='#f8f7f4';
const MONO='"IBM Plex Mono", ui-monospace, Menlo, monospace',SANS='"Source Sans 3", Arial, sans-serif';
function S(t,a={},p){const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;}
function T(p,x,y,s,a={}){const e=S('text',Object.assign({x,y,'font-family':MONO,'font-size':12,fill:MID},a),p);e.textContent=s;return e;}
const eo=t=>{t=Math.max(0,Math.min(1,t));return 1-Math.pow(1-t,3);};
const back=t=>{t=Math.max(0,Math.min(1,t));const c=1.7;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2);};
const fmtH=h=>h<1?`${Math.round(h*60)} min`:h<48?`${+h.toFixed(h<10?1:0)} GPU-hours`:h<24*60?`${Math.round(h/24)} GPU-days`:`${(h/24/30).toFixed(1)} GPU-months`;

/* data: {n, ours, acc, h (training GPU-hours or null), hl (training label), rps (inference rows/s or null), src} */
const DATA=opt.data.models;

const svg=S('svg',{'aria-label':'Scatter of tabular foundation models: accuracy against the GPU time it took to train them.'});
svg.style.cssText='position:absolute;inset:0;display:block;width:100%;height:100%;overflow:visible';host.appendChild(svg);
const tip=document.createElement('div');tip.style.cssText='position:absolute;pointer-events:none;background:#141414;color:#f4f2ee;font-family:"IBM Plex Mono",ui-monospace,Menlo,monospace;font-size:11.5px;line-height:1.55;padding:8px 11px;border-radius:2px;white-space:nowrap;opacity:0;transform:translate(-50%,-100%);margin-top:-14px;transition:opacity .12s;z-index:5';host.appendChild(tip);

let M=[],order=[],guides=null,vl=null,raf=0,running=true,started=false,t0=null,animate=true,lastW=0,lastH=0,onScreen=true;

function build(){
  svg.innerHTML='';
  const W=Math.max(320,host.clientWidth),H=Math.max(200,host.clientHeight),narrow=W<760;
  svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
  const fs=narrow?10.5:13;                                   // tick and model-label size, px
  M=DATA.map(m=>({...m}));
  const pub=M.filter(m=>m.h!=null),band=M.filter(m=>m.h==null).sort((a,b)=>b.acc-a.acc);

  // ---- frame: y labels + title on the left, x labels + title below, a label column right of the band ----
  const X0=narrow?40:72,Y0=narrow?30:22,Y1=H-(narrow?34:46);
  const LW=band.length?(narrow?84:Math.min(150,Math.max(118,W*.1))):0;   // band label column
  const BX1=W-LW-(band.length?8:0);
  const bandW=band.length?Math.min(Math.max(band.length*(narrow?16:26),(BX1-X0)*.26),(BX1-X0)*.4):0;
  const BX0=BX1-bandW,X1=band.length?BX0-(narrow?14:26):BX1;

  const hs=pub.map(m=>Math.log10(m.h)),LH0=Math.floor(Math.min(...hs)*4)/4-.35,LH1=Math.ceil(Math.max(...hs)*4)/4+.25;
  const accs=M.map(m=>m.acc),STEP=.02;
  const A0=Math.floor((Math.min(...accs)-.006)/STEP)*STEP,A1=Math.ceil((Math.max(...accs)+.012)/STEP)*STEP;
  const xs=h=>X0+(Math.log10(h)-LH0)/(LH1-LH0)*(X1-X0),ys=a=>Y1-(a-A0)/(A1-A0)*(Y1-Y0);

  const defs=S('defs',{},svg);
  const rg=S('radialGradient',{id:'vxbest',cx:X0,cy:Y0,r:Math.max(W,H)*.45,gradientUnits:'userSpaceOnUse'},defs);
  S('stop',{offset:'0','stop-color':INK,'stop-opacity':.07},rg);S('stop',{offset:'1','stop-color':INK,'stop-opacity':0},rg);
  S('rect',{x:X0,y:Y0,width:X1-X0,height:Y1-Y0,fill:'url(#vxbest)'},svg);

  const g=S('g',{},svg);
  // x: time ticks, kept apart so labels never collide
  const TT=[[.25,'15 min'],[1,'1 hour'],[24,'1 day'],[168,'1 week'],[720,'1 month'],[4320,'6 months'],[8760,'1 year']].filter(([h])=>Math.log10(h)>=LH0&&Math.log10(h)<=LH1);
  let lastX=-1e9;
  TT.forEach(([h,l])=>{const x=xs(h);S('line',{x1:x,y1:Y0,x2:x,y2:Y1,stroke:RULE,'stroke-width':1},g);
    if(x-lastX>(narrow?46:64)){T(g,x,Y1+(narrow?15:20),l,{'text-anchor':'middle','font-size':fs,'font-weight':600,fill:TICK});lastX=x;}});
  // y: accuracy ticks every STEP, thinned if the plot is short
  const nT=Math.round((A1-A0)/STEP),every=(Y1-Y0)/nT<22?2:1;
  for(let k=0;k<=nT;k++){const a=A0+k*STEP,y=ys(a);S('line',{x1:X0,y1:y,x2:BX1,y2:y,stroke:RULE,'stroke-width':1},g);
    if(k%every===0)T(g,X0-10,y+4.5,a.toFixed(2),{'text-anchor':'end','font-size':fs,'font-weight':600,fill:TICK});}
  S('path',{d:`M${X0} ${Y0} V${Y1} H${X1}`,stroke:MID,'stroke-width':1.2,fill:'none'},g);
  const ttl={'font-family':SANS,'font-weight':700,'font-size':narrow?9.5:11.5,'letter-spacing':narrow?1:1.4,fill:INK};
  T(g,(X0+X1)/2,Y1+(narrow?30:40),narrow?'GPU TIME TO TRAIN · log · ← faster':'GPU TIME TO TRAIN THE MODEL  ·  log scale  ·  ← faster',{...ttl,'text-anchor':'middle'});
  if(narrow)T(g,4,Y0-16,'ACCURACY  ·  ↑ better',{...ttl,'text-anchor':'start'});   // no room for a rotated title
  else T(g,0,0,'ACCURACY  ·  relative to the best model  ·  ↑ better',{...ttl,'text-anchor':'middle',transform:`translate(16 ${(Y0+Y1)/2}) rotate(-90)`});

  // ---- models without published training compute: their own band, labels in a column with leaders ----
  const R=narrow?5:7,RV=narrow?7:10;
  if(band.length){
    S('rect',{x:BX0,y:Y0,width:BX1-BX0,height:Y1-Y0,fill:INK,'fill-opacity':.035},g);
    S('line',{x1:BX0,y1:Y0,x2:BX0,y2:Y1,stroke:MID,'stroke-width':1,'stroke-dasharray':'2 3'},g);
    T(g,(BX0+BX1)/2,Y1+(narrow?15:20),'not published',{'text-anchor':'middle','font-size':fs,'font-weight':600,fill:TICK});
    T(g,BX0+8,Y0+(narrow?12:15),narrow?'COMPUTE NOT PUBLISHED':'TRAINING COMPUTE NOT PUBLISHED',{'font-family':SANS,'font-weight':700,'font-size':narrow?8.5:10,'letter-spacing':1.1,fill:MID});
    const pad=R+6,step=(BX1-BX0-2*pad)/Math.max(1,band.length-1);
    band.forEach((m,k)=>{m.bx=band.length===1?(BX0+BX1)/2:BX0+pad+k*step;});
  }

  // ---- dots ----
  const leads=S('g',{},svg),layer=S('g',{},svg),labels=S('g',{},svg);
  order=[...M].sort((a,b)=>(a.ours?1:0)-(b.ours?1:0));
  order.forEach((m,i)=>{m.x=m.h==null?m.bx:xs(m.h);m.y=ys(m.acc);m.r=m.ours?RV:R;m.i=i;m.period=m.ours?1.4:2.6;
    m.rings=[0,1].map(()=>S('circle',{cx:m.x,cy:m.y,r:m.r,fill:'none',stroke:m.ours?VX:INK,'stroke-width':m.ours?1.2:.8,opacity:0},layer));
    m.dot=S('circle',{cx:m.x,cy:m.y,r:animate?0:m.r,fill:m.ours?VX:PANEL,stroke:m.ours?VX:INK,'stroke-width':m.ours?0:1.4},layer);});

  // band labels: one column right of the band, in accuracy order, pushed apart, with a leader to each dot
  const lh=fs+4;
  // labels that would overlap form a group, stacked lh apart and centred on the mean of their dots
  let grp=band.map(m=>({ms:[m],c:m.y}));
  const top=G=>G.c-(G.ms.length-1)*lh/2;
  for(let merged=true;merged;){merged=false;
    for(let k=1;k<grp.length;k++){const a=grp[k-1],b=grp[k];
      if(top(b)-(top(a)+(a.ms.length-1)*lh)<lh){const ms=a.ms.concat(b.ms);grp.splice(k-1,2,{ms,c:ms.reduce((s,m)=>s+m.y,0)/ms.length});merged=true;break;}}}
  const col=[];grp.forEach(G=>G.ms.forEach((m,k)=>col.push({m,y:top(G)+k*lh})));
  const lo=Y0+lh,hi=Y1-4,shift=col.length?Math.max(0,lo-col[0].y)-Math.max(0,col[col.length-1].y-hi):0;
  col.forEach(c=>c.y+=shift);
  const LX=BX1+(narrow?8:12);
  col.forEach(({m,y})=>{
    m.lead=S('path',{d:`M${m.x+m.r} ${m.y} C${(m.x+BX1)/2+20} ${m.y} ${BX1-6} ${y} ${LX-4} ${y}`,fill:'none',stroke:LEAD,'stroke-width':1,opacity:animate?0:1},leads);
    m.lab=T(labels,LX,y+fs*.36,m.n,{'font-family':SANS,'font-size':fs+.5,'font-weight':600,fill:LAB,opacity:animate?0:1});});

  // valli: big label, guides to both axes, a short note
  const V=M.find(m=>m.ours);
  guides=S('g',{opacity:animate?0:1},svg);
  S('line',{x1:V.x,y1:V.y,x2:V.x,y2:Y1,stroke:VX,'stroke-width':1,'stroke-dasharray':'3 4'},guides);
  S('line',{x1:V.x,y1:V.y,x2:X0,y2:V.y,stroke:VX,'stroke-width':1,'stroke-dasharray':'3 4'},guides);
  S('circle',{cx:V.x,cy:Y1,r:3,fill:VX},guides);S('circle',{cx:X0,cy:V.y,r:3,fill:VX},guides);
  vl=S('g',{opacity:animate?0:1},svg);
  const others=M.filter(m=>!m.ours),rep=others.filter(m=>m.h!=null),meas=others.filter(m=>m.rps);
  const vx=V.x+V.r+(narrow?10:16),halo={stroke:PANEL,'stroke-width':5,'paint-order':'stroke'};
  T(vl,vx,V.y+(narrow?6:9),'valli',{'font-family':SANS,'font-size':narrow?20:30,'font-weight':700,fill:VX,...halo,'stroke-width':7});
  const notes=[];
  if(V.rps&&!narrow)notes.push([`accuracy ${V.acc.toFixed(2)}  ·  trains in ${V.hl}  ·  ${(V.rps/1000).toFixed(0)}k rows/s`,INK,600]);
  if(!narrow&&rep.length){const lo=Math.min(...rep.map(m=>m.h)),hi=Math.max(...rep.map(m=>m.h));notes.push([`the others took ${fmtH(lo)} to ${fmtH(hi)} to pretrain (where published)`,MID,500]);}
  if(!narrow&&meas.length){const sl=meas.map(m=>V.rps/m.rps);notes.push([`and predict ${Math.round(Math.min(...sl))}–${Math.round(Math.max(...sl))}× slower (where measured)`,MID,500]);}
  const ny=V.y+(narrow?22:30),bx=(el,pad=3)=>{const b=el.getBBox();return {x:b.x-pad,y:b.y-pad,w:b.width+2*pad,h:b.height+2*pad};};
  const noteBoxes=[bx(vl.lastChild)];
  notes.forEach(([s,c,w],k)=>noteBoxes.push(bx(T(vl,vx+2,ny+k*(fs+5),s,{'font-size':12.5,'font-weight':w,fill:c,...halo}))));

  // labels for models with published compute: right, left, above or below, avoiding dots, labels and the note
  // (text widths are measured, so this holds for any font size)
  const placed=[...noteBoxes],hit=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
  order.filter(m=>!m.ours&&m.h!=null).sort((a,b)=>b.acc-a.acc).forEach(m=>{
    m.lab=T(labels,0,0,m.n,{'font-family':SANS,'font-size':fs+.5,'font-weight':600,fill:LAB,opacity:animate?0:1,stroke:PANEL,'stroke-width':4,'paint-order':'stroke'});
    const w=m.lab.getComputedTextLength()+4,h=fs+4,c=[[m.x+m.r+7,m.y+fs*.36,'start'],[m.x-m.r-7,m.y+fs*.36,'end'],[m.x,m.y-m.r-7,'middle'],[m.x,m.y+m.r+fs+3,'middle']];
    let pick=c[0];
    for(const cand of c){const[x,y,a]=cand,bx=a==='start'?x:a==='end'?x-w:x-w/2,bb={x:bx,y:y-fs,w,h};
      if(!placed.some(p=>hit(p,bb))&&!M.some(o=>o!==m&&hit({x:o.x-o.r,y:o.y-o.r,w:o.r*2,h:o.r*2},bb))&&bb.x>X0+2&&bb.x+bb.w<BX0-6){pick=cand;placed.push(bb);break;}}
    m.lab.setAttribute('x',pick[0]);m.lab.setAttribute('y',pick[1]);m.lab.setAttribute('text-anchor',pick[2]);});

  // hover targets
  order.forEach(m=>{const hz=S('circle',{cx:m.x,cy:m.y,r:Math.max(m.r,10)+4,fill:'transparent',style:'cursor:pointer'},svg);
    hz.addEventListener('mousemove',()=>{
      tip.innerHTML=`<b>${m.n}</b><br>accuracy ${m.acc.toFixed(3)}<br>training ${m.hl}${m.h!=null&&m.h>=1?' ≈ '+Math.round(m.h).toLocaleString()+' GPU-hours':''}<br>${m.rps?m.rps.toLocaleString()+' rows/s'+(m.ours?' · tvarit':''):'inference speed not measured'}<br><span style="color:#aaa69e">${m.src}</span>`;
      const ctm=svg.getScreenCTM(),hr=host.getBoundingClientRect(),pt=svg.createSVGPoint();pt.x=m.x;pt.y=m.y-m.r;const q=pt.matrixTransform(ctm);
      tip.style.left=(q.x-hr.left)+'px';tip.style.top=(q.y-hr.top)+'px';tip.style.opacity=1;});
    hz.addEventListener('mouseleave',()=>tip.style.opacity=0);});
  lastW=W;lastH=H;
}

/* animation: dots pop in, labels fade, every dot keeps a slow pulse */
function loop(ts){if(t0===null)t0=ts;const t=(ts-t0)/1000;
  if(!onScreen&&t>5){raf=requestAnimationFrame(loop);return;}   // off screen: keep the clock, skip the work
  order.forEach(m=>{const start=animate?(m.ours?1.5:.3+m.i*.07):-10,k=(t-start)/(m.ours?.7:.5),s=m.ours?back(k):eo(k);
    m.dot.setAttribute('r',Math.max(0,m.r*s));
    const f=eo((t-start-.35)/.4);if(m.lab)m.lab.setAttribute('opacity',f);if(m.lead)m.lead.setAttribute('opacity',f);
    m.rings.forEach((ring,j)=>{if(t<start+.6){ring.setAttribute('opacity',0);return;}
      const ph=(((t-start)/m.period)+j*.5)%1;ring.setAttribute('r',m.r+ph*(m.ours?26:12));ring.setAttribute('opacity',(1-ph)*(m.ours?.42:.16));});});
  if(animate){guides.setAttribute('opacity',eo((t-2.1)/.5));vl.setAttribute('opacity',eo((t-2.0)/.5));}
  if(running)raf=requestAnimationFrame(loop);}

build();
const ro=new ResizeObserver(()=>{if(Math.abs(host.clientWidth-lastW)<4&&Math.abs(host.clientHeight-lastH)<4)return;
  animate=!started;build();});
ro.observe(host);
const io=new IntersectionObserver(([e])=>{onScreen=e.isIntersecting;});io.observe(host);
const play=()=>{if(started)return;started=true;(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>{animate=true;build();t0=null;raf=requestAnimationFrame(loop);});};
if(opt.autoplay!==false)play();
return {play,svg,destroy(){running=false;cancelAnimationFrame(raf);ro.disconnect();io.disconnect();svg.remove();tip.remove();}};

}
