// Benchmarks section, from the design's benchmarks.js (benchmarkmaindoc.html): styles scoped under .vxb.
// The drawing code is the design's; the numbers now come from the `data` argument (see benchmark-data.js),
// and when data.illustrative is set every card says so.
const CSS = `.vxb{
  color-scheme:light;box-sizing:border-box;
  padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);
  --paper:#f4f3f0;--panel:#f8f7f4;--ink:#141414;--mid:#6d6a64;--faint:#aaa69e;--rule:#dedbd4;
  --mono:"IBM Plex Mono",ui-monospace,Menlo,Consolas,monospace;
  --sans:"Source Sans 3","Helvetica Neue",Arial,sans-serif;
  --serif:"Source Serif 4",Georgia,serif;
}
.vxb *,.vxb *::before,.vxb *::after{box-sizing:inherit}
.vxb{margin:0;background:var(--paper);color:var(--ink);font-family:var(--sans);-webkit-font-smoothing:antialiased}
.vxb .mono{font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--mid)}
.vxb .bp{display:grid;grid-template-columns:150px minmax(0,1fr);gap:48px;margin-top:56px}
@media(max-width:1100px){.vxb .bp{grid-template-columns:1fr}
.vxb .toc{display:none}
}
.vxb .toc{position:sticky;top:calc(env(safe-area-inset-top,0px) + 24px);align-self:start}
.vxb .toc a{display:block;color:var(--mid);text-decoration:none;font-family:var(--mono);font-size:11px;letter-spacing:.05em;padding:7px 0 7px 12px;border-left:1px solid var(--rule)}
.vxb .toc a:hover,.vxb .toc a.on{color:var(--ink);border-left-color:var(--ink)}
.vxb .toc a b{font-weight:500;color:var(--faint);margin-right:8px}
.vxb section.sec{margin-bottom:84px}
.vxb .sh{border-top:1px solid var(--ink);padding-top:12px;margin-bottom:22px}
.vxb .sh .n{font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;color:var(--mid)}
.vxb .sh h2{font-weight:500;font-size:30px;letter-spacing:-.018em;margin:6px 0 6px}
.vxb .sh p{color:var(--mid);font-size:16px;line-height:1.55;margin:0;max-width:760px}
.vxb .card{border:1px solid var(--rule);background:var(--panel);margin-bottom:22px}
.vxb .chd,.vxb .cft{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;padding:12px 18px}
.vxb .chd{border-bottom:1px solid var(--rule)}
.vxb .cft{border-top:1px solid var(--rule)}
.vxb .cb{padding:20px 22px 8px}
.vxb .key{font-family:var(--mono);font-size:11.5px;color:var(--ink);display:flex;gap:26px;flex-wrap:wrap;align-items:center;margin:0 0 6px}
.vxb .key span{display:inline-flex;align-items:center;gap:8px}
.vxb .key svg{width:auto;height:auto;display:inline-block;flex:none;overflow:visible}
.vxb .note{font-family:var(--mono);font-size:9.5px;letter-spacing:.03em;color:var(--faint);line-height:1.6;max-width:820px}
.vxb .ctrls{display:flex;gap:20px;flex-wrap:wrap;align-items:center}
.vxb .seg{display:inline-flex;gap:3px;flex-wrap:wrap;align-items:center}
.vxb .seg .lab{font-family:var(--mono);font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--faint);margin-right:6px}
.vxb .seg button{font-family:var(--mono);font-size:11px;letter-spacing:.04em;background:none;border:1px solid transparent;color:var(--mid);padding:4px 9px;cursor:pointer;border-radius:2px}
.vxb .seg button:hover{color:var(--ink)}
.vxb .seg button[aria-pressed="true"]{border-color:var(--rule);background:var(--paper);color:var(--ink)}
.vxb .pw{position:relative}
.vxb svg{display:block;width:100%;height:auto;overflow:visible}
.vxb .tip{position:absolute;pointer-events:none;background:var(--ink);color:#f4f2ee;font-family:var(--mono);font-size:11px;line-height:1.55;
  padding:8px 11px;border-radius:2px;white-space:nowrap;opacity:0;transform:translate(-50%,-100%);margin-top:-14px;transition:opacity .12s;z-index:5}
.vxb .quad{display:grid;grid-template-columns:repeat(4,minmax(0,1fr))}
.vxb .quad > div{border-right:1px solid var(--rule)}
.vxb .quad > div:last-child{border-right:0}
@media(max-width:900px){.vxb .quad{grid-template-columns:1fr 1fr}
.vxb .quad > div:nth-child(2){border-right:0}
.vxb .quad > div:nth-child(-n+2){border-bottom:1px solid var(--rule)}
}
.vxb .qh{font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink);padding:12px 14px 0}
.vxb .tw{overflow-x:auto}
.vxb table.t{border-collapse:collapse;width:100%;font-size:14px;min-width:760px}
.vxb table.t th{font-family:var(--mono);font-size:9.5px;letter-spacing:.11em;text-transform:uppercase;color:var(--mid);font-weight:500;text-align:right;padding:11px 12px;border-bottom:1px solid var(--ink);white-space:nowrap;cursor:pointer;user-select:none;background:var(--panel)}
.vxb table.t th.l,.vxb table.t td.l{text-align:left}
.vxb table.t th.c,.vxb table.t td.c{text-align:center}
.vxb table.t th.sorted{color:var(--ink)}
.vxb table.t th.sorted::after{content:" ↓"}
.vxb table.t th.grp{border-bottom:1px solid var(--rule);text-align:center;cursor:default;color:var(--faint);padding-bottom:6px}
.vxb table.t td{padding:0 12px;border-bottom:1px solid var(--rule);text-align:right;height:35px;white-space:nowrap;font-family:var(--mono);font-size:12px}
.vxb table.t td.nm{font-family:var(--sans);font-size:14.5px}
.vxb table.t td.nm small{font-family:var(--mono);font-size:9.5px;color:var(--mid);margin-left:8px;letter-spacing:.03em}
.vxb table.t td.rk{color:var(--faint);font-size:11px;width:40px;text-align:left}
.vxb table.t td.sub{color:var(--mid)}
.vxb table.t td .k{font-size:9px;color:var(--faint);margin-left:6px;letter-spacing:.04em}
.vxb table.t td.h span{display:inline-flex;justify-content:center;align-items:center;min-width:48px;height:25px;padding:0 6px}
.vxb table.t tr.ours td{border-bottom-color:var(--ink);font-weight:600}
.vxb table.t tr.ours td.nm::before{content:"";display:inline-block;width:8px;height:8px;background:var(--ink);border-radius:50%;margin-right:9px;vertical-align:1px}
.vxb table.t tr.vsep td{border-top:1px solid var(--ink)}
.vxb table.t .best{background:var(--ink);color:#f4f2ee;padding:3px 7px}
.vxb table.t .ci{color:var(--faint);font-size:10px;margin-left:4px}
.vxb table.t tbody tr{transition:opacity .35s}
.vxb .tfoot{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding:11px 18px;border-top:1px solid var(--rule)}
.vxb .lkey{display:flex;gap:6px;align-items:center;font-family:var(--mono);font-size:9.5px;color:var(--mid);letter-spacing:.06em}
.vxb .lkey i{display:inline-block;width:20px;height:12px}
.vxb .btn{font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;background:none;border:1px solid var(--rule);color:var(--mid);padding:5px 11px;cursor:pointer;border-radius:2px}
.vxb .btn:hover{color:var(--ink)}
.vxb .pop{transform:scale(0);transform-box:fill-box;transform-origin:center;transition:transform .6s cubic-bezier(.34,1.56,.64,1)}
.vxb .go .pop{transform:scale(1)}
.vxb .fade{opacity:0;transition:opacity .6s ease}
.vxb .go .fade{opacity:1}
.vxb .pulse{transform-box:fill-box;transform-origin:center;animation:vxbpulse 1.8s ease-out infinite;opacity:0}
@keyframes vxbpulse{0%{transform:scale(1);opacity:.45}100%{transform:scale(2.2);opacity:0}}
@media (prefers-reduced-motion: reduce){.vxb .pop,.vxb .fade{transition:none}
.vxb .pulse{animation:none}
}
.vxb{background:transparent}
.vxb .toc{top:88px}
.vxb section.sec{scroll-margin-top:84px}
.vxb .bp{margin-top:8px}
.vxb main{min-width:0}
.vxb .card{min-width:0;overflow:hidden}
@media(max-width:1100px){.vxb .bp{grid-template-columns:minmax(0,1fr)}}
.vxb .illus{font-family:var(--mono);font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:#f4f2ee;background:#a2553f;padding:3px 8px;white-space:nowrap}
.vxb .illus-banner{display:flex;gap:12px;align-items:baseline;flex-wrap:wrap;margin:0 0 28px;padding:14px 18px;border:1px solid #a2553f;background:rgba(162,85,63,.07);font-size:15px;line-height:1.5;color:var(--ink)}
`;
const HTML = `<div class="bp">
  <aside class="toc" id="toc">
    <a href="#overview"><b>01</b>Overview</a>
    <a href="#leaderboard"><b>02</b>Leaderboard</a>
    <a href="#accuracy"><b>03</b>Accuracy</a>
    <a href="#calibration"><b>04</b>Calibration</a>
  </aside>
  <main>

    <!-- ========== 01 OVERVIEW ========== -->
    <section class="sec" id="overview">
      <div class="sh"><span class="n">01</span><h2>Overview</h2><p>Accuracy, training time and inference speed for every tabular foundation model, in one chart.</p></div>
      <div class="card">
        <div class="chd"><span class="mono">Fig. 01</span><span class="mono" id="f1ctx"></span></div>
        <div class="cb">
          <div class="key"><span><b>↑</b> more accurate</span><span><b>←</b> faster to train</span><span><svg width="34" height="18" viewBox="0 0 34 18"><circle cx="6" cy="9" r="4" fill="none" stroke="#141414" stroke-width="1.2"/><circle cx="23" cy="9" r="8" fill="none" stroke="#141414" stroke-width="1.2"/></svg>bigger = faster inference</span></div>
          <div class="pw" id="w1"><svg id="s1"></svg><div class="tip"></div></div>
        </div>
        <div class="cft"><div class="seg" id="c1"><span class="lab">Benchmark</span></div><span class="note">Accuracy: mean score relative to the best model in each setting, ≤ 100 labelled rows, both tasks. Training: GPU time to produce the model. Inference: rows/s, one A10G; valli served by tvarit.</span></div>
      </div>
    </section>

    <!-- ========== 02 LEADERBOARD ========== -->
    <section class="sec" id="leaderboard">
      <div class="sh"><span class="n">02</span><h2>Leaderboard</h2><p>Rank among all 41 models at each number of labelled rows, with training time and inference speed. Click any column to sort.</p></div>
      <div class="card">
        <div class="chd"><div class="ctrls"><div class="seg" id="lbB"><span class="lab">Benchmark</span></div><div class="seg" id="lbT"><span class="lab">Task</span></div></div><span class="mono">Table 01</span></div>
        <div class="tw"><table class="t" id="lb"></table></div>
        <div class="tfoot"><div class="lkey"><span>MEAN RANK</span><i style="background:rgba(20,20,20,.82)"></i>≤1.5<i style="background:rgba(20,20,20,.42)"></i>≤3<i style="background:rgba(20,20,20,.22)"></i>≤5<i style="background:rgba(20,20,20,.1)"></i>≤10<i style="background:rgba(20,20,20,.04)"></i>≤20</div>
          <span class="note">Rank by log loss (classification) or CRPS (regression), averaged over the selected benchmarks and tasks. Training: one-off pretraining for foundation models, per dataset otherwise.</span></div>
      </div>
    </section>

    <!-- ========== 03 ACCURACY ========== -->
    <section class="sec" id="accuracy">
      <div class="sh"><span class="n">03</span><h2>Accuracy</h2><p>Log loss for classification and CRPS for regression — both proper scoring rules, lower is better.</p></div>
      <div class="ctrls" style="margin-bottom:14px"><div class="seg" id="aB"><span class="lab">Benchmark</span></div><div class="seg" id="aT"><span class="lab">Task</span></div></div>
      <div class="card">
        <div class="chd"><span class="mono">Fig. 02 · error relative to the best model</span><span class="mono" id="f2ctx"></span></div>
        <div class="cb">
          <div class="key"><span>on the bottom line = lowest error of all 41 models</span><span><svg width="28" height="10"><line x1="1" y1="5" x2="27" y2="5" stroke="#141414" stroke-width="2.6"/></svg>valli</span><span><svg width="28" height="10"><line x1="1" y1="5" x2="27" y2="5" stroke="#6d6a64" stroke-width="1.4"/></svg>next three models</span><span style="color:var(--mid)"><svg width="28" height="10"><line x1="1" y1="5" x2="27" y2="5" stroke="#aaa69e" stroke-width=".9"/></svg>all other models</span></div>
          <div class="pw" id="w2"><svg id="s2"></svg><div class="tip"></div></div>
        </div>
      </div>
      <div class="card">
        <div class="chd"><span class="mono">Table 02 · error per model</span><span class="mono" id="t2ctx"></span></div>
        <div class="tw"><table class="t" id="acc"></table></div>
        <div class="tfoot"><span class="note">Mean over tasks and 5 seeds, with 95% bootstrap interval. Black cell = lowest error at that number of rows.</span><button class="btn" id="accAll">show all 41 models</button></div>
      </div>
      <div class="card">
        <div class="chd"><div class="ctrls"><div class="seg" id="dM"><span class="lab">Labelled rows</span></div></div><span class="mono">Table 03 · error per real dataset</span></div>
        <div class="tw"><table class="t" id="ds"></table></div>
        <div class="tfoot"><span class="note">The 11 real datasets for the selected task; valli and the five models with the lowest mean error. Black cell = lowest error on that dataset.</span></div>
      </div>
    </section>

    <!-- ========== 04 CALIBRATION ========== -->
    <section class="sec" id="calibration">
      <div class="sh"><span class="n">04</span><h2>Calibration</h2><p>Whether a model's stated confidence matches how often it is right. Classification: expected calibration error, lower is better. Regression: how often the 90% interval contains the truth, 90% is ideal.</p></div>
      <div class="ctrls" style="margin-bottom:14px"><div class="seg" id="kT"><span class="lab">Task</span></div><div class="seg" id="kM"><span class="lab">Labelled rows</span></div></div>
      <div class="card">
        <div class="chd"><span class="mono">Fig. 03 · reliability</span><span class="mono" id="f3ctx"></span></div>
        <div class="cb" style="padding-bottom:6px">
          <div class="key"><span><svg width="28" height="10"><line x1="1" y1="5" x2="27" y2="5" stroke="#141414" stroke-width="2.6"/></svg>valli</span><span style="color:var(--mid)"><svg width="28" height="10"><line x1="1" y1="5" x2="27" y2="5" stroke="#aaa69e" stroke-width="1.2"/></svg>other models</span><span><svg width="28" height="10"><line x1="1" y1="5" x2="27" y2="5" stroke="#141414" stroke-width="1" stroke-dasharray="3 3"/></svg>perfect calibration</span></div>
        </div>
        <div class="quad" id="rel"></div>
      </div>
      <div class="card">
        <div class="chd"><span class="mono">Table 04 · calibration per model</span><span class="mono" id="t4ctx"></span></div>
        <div class="tw"><table class="t" id="cal"></table></div>
        <div class="tfoot"><span class="note" id="calnote"></span><button class="btn" id="calAll">show all 41 models</button></div>
      </div>
    </section>
  </main>
</div>`;

const BANNER = `<div class="illus-banner"><span class="illus">Illustrative data</span><span>These figures and tables show the planned format only. The numbers are generated, not measured, and do not reproduce from any experiment.</span></div>`;

export function mountBenchmarks(host, data) {
  if (host.dataset.mounted) return; host.dataset.mounted = '1';
  if (!document.getElementById('vxb-style')) { const st = document.createElement('style'); st.id = 'vxb-style'; st.textContent = CSS; document.head.appendChild(st); }
  const { MODELS, BENCH, MS, RES, DATASETS, dsErr, V, K } = data;
  const N = MODELS.length;
  // Model counts in the copy follow the data; illustrative data labels every card.
  let html = HTML.replace(/\b41 models\b/g, `${N} models`);
  if (data.illustrative) html = BANNER + html;
  host.classList.add('vxb'); host.innerHTML = html;
  if (data.illustrative) host.querySelectorAll('.chd').forEach(h => { if (!h.querySelector('.illus')) { const s = document.createElement('span'); s.className = 'illus'; s.textContent = 'Illustrative data'; h.appendChild(s); } });

/* ================= helpers ================= */
const NS='http://www.w3.org/2000/svg',INK='#141414',MID='#6d6a64',FAINT='#aaa69e',RULE='#dedbd4',PANEL='#f8f7f4';
const MONO='"IBM Plex Mono", ui-monospace, Menlo, monospace',SANS='"Source Sans 3", Arial, sans-serif';
function S(t,a={},p){const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;}
function T(p,x,y,s,a={}){const e=S('text',Object.assign({x,y,'font-family':MONO,'font-size':11.5,fill:MID},a),p);e.textContent=s;return e;}
function m32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const cl=(x,a,b)=>x<a?a:x>b?b:x,mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
const ord=n=>{const v=n%100;return n+((v>10&&v<14)?'th':({1:'st',2:'nd',3:'rd'}[n%10]||'th'));};
const D=(el,s)=>{el.style.transitionDelay=s+'s';return el;};
function hsh(...a){let h=7;a.join('|').split('').forEach(c=>h=Math.imul(h,31)+c.charCodeAt(0)|0);return h>>>0;}
function drawLine(p,dur,delay){const L=p.getTotalLength();p.style.strokeDasharray=`${L} ${L}`;p.style.strokeDashoffset=L;p.style.transition=`stroke-dashoffset ${dur}s cubic-bezier(.4,0,.2,1) ${delay}s`;p.dataset.draw=1;return p;}
function go(svg){requestAnimationFrame(()=>requestAnimationFrame(()=>{svg.classList.add('go');svg.querySelectorAll('[data-draw]').forEach(p=>p.style.strokeDashoffset=0);}));}
const observers=[];
function onView(el,fn){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){fn();io.disconnect();}}),{threshold:.2});io.observe(el);observers.push(io);}
function tipFor(id){const w=document.getElementById(id),t=w.querySelector('.tip');return{on(el,h){el.addEventListener('mousemove',ev=>{const r=w.getBoundingClientRect();t.innerHTML=h;t.style.left=(ev.clientX-r.left)+'px';t.style.top=(ev.clientY-r.top)+'px';t.style.opacity=1;});el.addEventListener('mouseleave',()=>t.style.opacity=0);}};}
function seg(id,opts,cur,cb){const el=document.getElementById(id);opts.forEach(([v,l])=>{const b=document.createElement('button');b.textContent=l;b.setAttribute('aria-pressed',v===cur?'true':'false');
  b.onclick=()=>{el.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');cb(v);};el.appendChild(b);});}
function lazy(id,build){let seen=false;build(false);onView(document.getElementById(id),()=>{seen=true;build(true);});return()=>build(seen);}
function fadeRows(tb){[...tb.querySelectorAll('tbody tr')].forEach((r,i)=>{r.style.opacity=0;setTimeout(()=>r.style.opacity=1,12*i);});}
const fmtH=h=>h<1/60?'seconds':h<1?`${Math.round(h*60)} min`:h<48?`${+h.toFixed(h<10?1:0)} h`:h<24*60?`${Math.round(h/24)} GPU-days`:`${(h/24/30).toFixed(1)} GPU-months`;
const fmtR=r=>r>=1e6?`${(r/1e6).toFixed(1)}M`:r>=1e3?`${Math.round(r/1e3)}k`:`${r}`;
const BL=k=>BENCH.find(b=>b.k===k).l;
// aggregates
const sel=(b,t)=>({bs:b==='all'?BENCH.map(x=>x.k):b==='real'?['sci','bus']:[b],ts:t==='both'?['reg','cls']:[t]});
const meanRank=(i,mi,s)=>mean(s.ts.flatMap(t=>s.bs.map(b=>RES[t][b][mi].rank[i])));
const relScore=(i,s,mis)=>mean(s.ts.flatMap(t=>s.bs.flatMap(b=>mis.map(mi=>{const r=RES[t][b][mi];return Math.min(...r.err)/r.err[i];}))));

/* ================= 01 · overview ================= */
let f1b='real';
const FMS=['valli','TabPFN-2.5','TabPFN v2','TabICLv2','TabICL','LimiX','Kumo-large','Mitra','Kumo-small'].map(n=>MODELS.find(m=>m.n===n)).filter(Boolean);
const r1=lazy('s1',anim=>{const svg=document.getElementById('s1');svg.innerHTML='';svg.classList.remove('go');
  document.getElementById('f1ctx').textContent=f1b==='real'?'11 real datasets · scientific and business':f1b==='syn'?'24 synthetic tables':'39 TabArena tables';
  const W=1000,H=500,X0=80,X1=960,Y0=20,Y1=420,LH0=-.9,LH1=3.75,s=sel(f1b,'both'),pts=FMS.map(m=>({m,a:relScore(m.i,s,[0,1,2])}));
  const A0=Math.floor((Math.min(...pts.map(p=>p.a))-.03)*20)/20,A1=1.0;svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
  const xs=h=>X0+(Math.log10(h)-LH0)/(LH1-LH0)*(X1-X0),ys=a=>Y1-(a-A0)/(A1-A0)*(Y1-Y0),rr=v=>6+((Math.log10(v)-3.8)/2.2)*22;
  [[.25,'15 min'],[1,'1 hour'],[24,'1 day'],[168,'1 week'],[720,'1 month'],[4320,'6 months']].forEach(([h,l])=>{const x=xs(h);S('line',{x1:x,y1:Y0,x2:x,y2:Y1,stroke:RULE},svg);T(svg,x,Y1+22,l,{'text-anchor':'middle'});});
  for(let a=A0;a<=1.0001;a+=.05){const y=ys(a);S('line',{x1:X0,y1:y,x2:X1,y2:y,stroke:RULE},svg);T(svg,X0-10,y+4,a.toFixed(2),{'text-anchor':'end'});}
  S('path',{d:`M${X0} ${Y0} V${Y1} H${X1}`,stroke:MID,fill:'none'},svg);
  T(svg,(X0+X1)/2,Y1+50,'TRAINING TIME · GPU time to produce the model · log scale',{'text-anchor':'middle','font-size':10.5,'letter-spacing':1.2,fill:INK});
  T(svg,0,0,'ACCURACY · relative to the best model',{'text-anchor':'middle','font-size':10.5,'letter-spacing':1.2,fill:INK,transform:`translate(${X0-56} ${(Y0+Y1)/2}) rotate(-90)`});
  const tip=tipFor('w1'),placed=[],hit=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
  pts.forEach(p=>{p.x=xs(p.m.h);p.y=ys(p.a);p.r=rr(p.m.rps);});
  const html=p=>`<b>${p.m.n}</b><br>accuracy ${p.a.toFixed(3)}<br>training ${fmtH(p.m.h)}${p.m.src?' · '+p.m.src:''}<br>${p.m.rps.toLocaleString()} rows/s`;
  pts.slice(1).forEach((p,i)=>{const dur=(3.4-2.6*((Math.log10(p.m.rps)-3.8)/2.2)).toFixed(2);
    S('circle',{cx:p.x,cy:p.y,r:p.r,fill:'none',stroke:INK,'stroke-width':.8,class:'pulse',style:`animation-duration:${dur}s;animation-delay:${(i*.13).toFixed(2)}s`},svg);
    const c=D(S('circle',{cx:p.x,cy:p.y,r:p.r,fill:PANEL,stroke:INK,'stroke-width':1.3,class:'pop'},svg),.2+i*.07);tip.on(c,html(p));
    const w=p.m.n.length*7.1,cand=[[p.x+p.r+7,p.y+4,'start'],[p.x-p.r-7,p.y+4,'end'],[p.x,p.y-p.r-8,'middle'],[p.x,p.y+p.r+16,'middle']];
    let pick=cand[0];for(const c2 of cand){const bx=c2[2]==='start'?c2[0]:c2[2]==='end'?c2[0]-w:c2[0]-w/2,bb={x:bx,y:c2[1]-11,w,h:14};
      if(!placed.some(q=>hit(q,bb))&&!pts.some(o=>o!==p&&hit({x:o.x-o.r,y:o.y-o.r,w:o.r*2,h:o.r*2},bb))&&bb.x+bb.w<X1){pick=c2;placed.push(bb);break;}}
    D(T(svg,pick[0],pick[1],p.m.n,{'text-anchor':pick[2],class:'fade',stroke:PANEL,'stroke-width':4,'paint-order':'stroke'}),.6+i*.07);});
  const P=pts[0],g=S('g',{class:'fade',style:'transition-delay:1.2s'},svg);
  S('line',{x1:P.x,y1:P.y,x2:P.x,y2:Y1,stroke:INK,'stroke-dasharray':'3 4'},g);S('line',{x1:P.x,y1:P.y,x2:X0,y2:P.y,stroke:INK,'stroke-dasharray':'3 4'},g);
  S('circle',{cx:P.x,cy:P.y,r:P.r,fill:'none',stroke:INK,'stroke-width':1.1,class:'pulse',style:'animation-duration:.9s'},svg);
  const vc=D(S('circle',{cx:P.x,cy:P.y,r:P.r,fill:INK,class:'pop'},svg),1);tip.on(vc,html(P));
  T(g,P.x+P.r+14,P.y,'valli',{'font-family':SANS,'font-size':26,'font-weight':600,fill:INK,stroke:PANEL,'stroke-width':6,'paint-order':'stroke'});
  T(g,P.x+P.r+16,P.y+20,`accuracy ${P.a.toFixed(3)} · ${fmtH(P.m.h)} to train · ${fmtR(P.m.rps)} rows/s`,{fill:INK,stroke:PANEL,'stroke-width':5,'paint-order':'stroke'});
  const lx=X1-230,ly=Y0+28;T(svg,lx,ly-6,'INFERENCE SPEED',{'font-size':9.5,'letter-spacing':1.3,fill:INK});
  [[1e4,'10k'],[1e5,'100k'],[1e6,'1M rows/s']].forEach(([v,l],i)=>{const r=rr(v),cx=lx+16+i*74;S('circle',{cx,cy:ly+28,r,fill:'none',stroke:MID},svg);T(svg,cx,ly+28+r+14,l,{'text-anchor':'middle','font-size':9.5});});
  if(anim)go(svg);});
seg('c1',[['real','Real data'],['syn','Synthetic'],['tab','TabArena']],f1b,v=>{f1b=v;r1();});

/* ================= 02 · leaderboard ================= */
let lbB='all',lbT='both',lbS=5;
const tintR=r=>r<=1.5?.82:r<=3?.42:r<=5?.22:r<=10?.1:r<=20?.04:0;
function lb(anim){const s=sel(lbB,lbT),single=s.bs.length===1&&s.ts.length===1,tb=document.getElementById('lb');
  const rows=MODELS.map(o=>{const r=MS.map((_,mi)=>meanRank(o.i,mi,s));return{o,r,mean:mean(r)};});
  const key=x=>lbS<5?x.r[lbS]:lbS===5?x.mean:lbS===6?x.o.h:-x.o.rps;rows.sort((a,b)=>key(a)-key(b));
  const th=(j,l,c='')=>`<th data-j="${j}" class="${c}${lbS===j?' sorted':''}">${l}</th>`;
  let h=`<thead><tr><th class="grp" colspan="2"></th><th class="grp" colspan="6">Rank · lower is better</th><th class="grp" colspan="2">Cost</th></tr><tr><th class="l" style="cursor:default"></th><th class="l" style="cursor:default">Model</th>`+
    MS.map((m,j)=>th(j,`${m.toLocaleString()} rows`,'c ')).join('')+th(5,'Mean','c ')+th(6,'Training')+th(7,'Inference')+'</tr></thead><tbody>';
  rows.forEach((x,k)=>{const o=x.o,f=v=>single?String(Math.round(v)):v.toFixed(1);
    h+=`<tr class="${o.i===V?'ours':''}"><td class="rk">${k+1}</td><td class="nm l">${o.n}${o.i===K?'<small>valli’s base</small>':''}</td>`+
      x.r.map(v=>{const a=tintR(v);return`<td class="h c"><span style="background:rgba(20,20,20,${a});color:${a>.4?'#f4f2ee':'#141414'}">${f(v)}</span></td>`;}).join('')+
      `<td class="h c"><span style="background:rgba(20,20,20,${tintR(x.mean)});color:${tintR(x.mean)>.4?'#f4f2ee':'#141414'}">${x.mean.toFixed(1)}</span></td>`+
      `<td>${fmtH(o.h)}<span class="k">${o.kind==='pre'?'pretrain':'per dataset'}</span></td><td>${fmtR(o.rps)} rows/s${o.i===V?'<span class="k">tvarit</span>':''}</td></tr>`;});
  tb.innerHTML=h+'</tbody>';tb.querySelectorAll('th[data-j]').forEach(t=>t.onclick=()=>{lbS=+t.dataset.j;lb(true);});if(anim)fadeRows(tb);}
seg('lbB',[['all','All'],...BENCH.map(b=>[b.k,b.l])],lbB,v=>{lbB=v;lb(true);});
seg('lbT',[['both','Both'],['reg','Regression'],['cls','Classification']],lbT,v=>{lbT=v;lb(true);});
lb(false);

/* ================= 03 · accuracy ================= */
let aB='sci',aT='reg',accAll=false,dM=1;
const metricName=t=>t==='reg'?'CRPS':'log loss';
const r2=lazy('s2',anim=>{const svg=document.getElementById('s2');svg.innerHTML='';svg.classList.remove('go');const res=RES[aT][aB];
  document.getElementById('f2ctx').textContent=`${BL(aB)} · ${aT==='reg'?'regression':'classification'} · ${metricName(aT)}`;
  const W=1000,H=430,X0=80,X1=800,Y0=20,Y1=370;svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
  const best=res.map(r=>Math.min(...r.err)),rel=(i,j)=>res[j].err[i]/best[j],lo=.98,hi=1.36;
  const xs=m=>X0+(Math.log10(m)-Math.log10(25))/(Math.log10(1000)-Math.log10(25))*(X1-X0),ys=v=>Y1-(v-lo)/(hi-lo)*(Y1-Y0);
  const cp=S('clipPath',{id:'cp2'},S('defs',{},svg));S('rect',{x:X0,y:Y0-2,width:X1-X0+2,height:Y1-Y0+4},cp);
  MS.forEach(m=>{const x=xs(m);S('line',{x1:x,y1:Y0,x2:x,y2:Y1,stroke:RULE},svg);T(svg,x,Y1+22,m.toLocaleString(),{'text-anchor':'middle'});});
  [1,1.05,1.1,1.15,1.2,1.25,1.3,1.35].forEach(v=>{const y=ys(v);S('line',{x1:X0,y1:y,x2:X1,y2:y,stroke:v===1?INK:RULE,'stroke-width':v===1?1.2:.8},svg);T(svg,X0-10,y+4,v===1?'best':`+${Math.round((v-1)*100)}%`,{'text-anchor':'end',fill:v===1?INK:MID});});
  S('path',{d:`M${X0} ${Y0} V${Y1} H${X1}`,stroke:MID,fill:'none'},svg);
  T(svg,(X0+X1)/2,Y1+50,'LABELLED ROWS · log scale',{'text-anchor':'middle','font-size':10.5,'letter-spacing':1.2,fill:INK});
  T(svg,0,0,`${metricName(aT).toUpperCase()} vs the best model at each size`,{'text-anchor':'middle','font-size':10.5,'letter-spacing':1.2,fill:INK,transform:`translate(${X0-60} ${(Y0+Y1)/2}) rotate(-90)`});
  const avg=MODELS.map(o=>({o,m:mean(res.map(r=>r.err[o.i]))})).sort((a,b)=>a.m-b.m),top=avg.filter(x=>x.o.i!==V).slice(0,3).map(x=>x.o.i);
  const tip=tipFor('w2'),path=i=>MS.map((m,j)=>(j?'L':'M')+xs(m)+' '+ys(rel(i,j))).join(' '),lines=S('g',{'clip-path':'url(#cp2)'},svg);
  MODELS.forEach(o=>{if(o.i===V||top.includes(o.i))return;const p=S('path',{d:path(o.i),fill:'none',stroke:FAINT,'stroke-width':.9,'stroke-opacity':.7},lines);drawLine(p,1,.05+o.i*.008);
    const hz=S('path',{d:path(o.i),fill:'none',stroke:'transparent','stroke-width':7},lines);tip.on(hz,o.n);});
  const ends=[];
  top.concat([V]).forEach((i,k)=>{const ours=i===V,p=S('path',{d:path(i),fill:'none',stroke:ours?INK:MID,'stroke-width':ours?2.8:1.5,'stroke-linejoin':'round'},lines);drawLine(p,1.2,ours?.8:.4+k*.1);
    MS.forEach((m,j)=>{if(rel(i,j)>hi)return;const c=D(S('circle',{cx:xs(m),cy:ys(rel(i,j)),r:ours?4.5:3,fill:ours?INK:PANEL,stroke:ours?INK:MID,'stroke-width':1.2,class:'pop'},svg),1+j*.06);
      tip.on(c,`${MODELS[i].n} · ${m} rows<br>${metricName(aT)} ${res[j].err[i].toFixed(3)} (${rel(i,j)===1?'best':'+'+((rel(i,j)-1)*100).toFixed(1)+'%'}) · rank ${ord(res[j].rank[i])}`);});
    ends.push({i,y:ys(Math.min(rel(i,4),hi)),ours});});
  ends.sort((a,b)=>a.y-b.y);for(let k=1;k<ends.length;k++)if(ends[k].y-ends[k-1].y<16)ends[k].y=ends[k-1].y+16;
  ends.forEach(e=>D(T(svg,X1+14,e.y+4,MODELS[e.i].n,{'font-family':SANS,'font-size':e.ours?16:13.5,'font-weight':e.ours?600:400,fill:e.ours?INK:MID,class:'fade'}),1.4));
  if(anim)go(svg);});
function accTable(anim){const res=RES[aT][aB],tb=document.getElementById('acc');
  document.getElementById('t2ctx').textContent=`${BL(aB)} · ${aT==='reg'?'regression':'classification'} · ${metricName(aT)}`;
  const best=MS.map((_,j)=>Math.min(...res[j].err)),rows=MODELS.map(o=>({o,m:mean(res.map(r=>r.err[o.i]))})).sort((a,b)=>a.m-b.m),show=accAll?rows:rows.slice(0,15);
  let h=`<thead><tr><th class="l"></th><th class="l">Model</th>${MS.map(m=>`<th>${m.toLocaleString()} rows</th>`).join('')}<th>Mean</th></tr></thead><tbody>`;
  show.forEach((x,k)=>{const o=x.o;h+=`<tr class="${o.i===V?'ours':''}"><td class="rk">${k+1}</td><td class="nm l">${o.n}${o.i===K?'<small>valli’s base</small>':''}</td>`+
    MS.map((_,j)=>{const e=res[j].err[o.i],c=res[j].ci[o.i],b=e===best[j];return`<td>${b?`<span class="best">${e.toFixed(3)}</span>`:e.toFixed(3)}<span class="ci">±${c.toFixed(3)}</span></td>`;}).join('')+`<td>${x.m.toFixed(3)}</td></tr>`;});
  tb.innerHTML=h+'</tbody>';document.getElementById('accAll').textContent=accAll?'show top 15':`show all ${N} models`;if(anim)fadeRows(tb);}
function dsTable(anim){const tb=document.getElementById('ds'),dsets=DATASETS.filter(d=>d.t===aT);
  const avg=MODELS.map(o=>({o,m:mean(dsets.map(d=>dsErr(d,o.i,dM)))})).sort((a,b)=>a.m-b.m),cols=[MODELS[V]].concat(avg.filter(x=>x.o.i!==V).slice(0,5).map(x=>x.o));
  let h=`<thead><tr><th class="l">Dataset</th><th class="l">Domain</th>${cols.map(o=>`<th>${o.n}</th>`).join('')}</tr></thead><tbody>`;let prev=null;
  dsets.forEach(d=>{const vals=cols.map(o=>dsErr(d,o.i,dM)),mn=Math.min(...vals);
    h+=`<tr class="${prev&&prev!==d.b?'vsep':''}"><td class="nm l">${d.n}</td><td class="l sub">${BL(d.b)}</td>`+vals.map(v=>`<td>${v===mn?`<span class="best">${v.toFixed(3)}</span>`:v.toFixed(3)}</td>`).join('')+'</tr>';prev=d.b;});
  h+=`<tr><td class="nm l" colspan="2" style="color:var(--mid)">Lowest error on</td>${cols.map((o,ci)=>{const w=dsets.filter(d=>{const vals=cols.map(c=>dsErr(d,c.i,dM));return vals[ci]===Math.min(...vals);}).length;return`<td style="font-weight:${ci===0?600:400}">${w} of ${dsets.length}</td>`;}).join('')}</tr>`;
  tb.innerHTML=h+'</tbody>';if(anim)fadeRows(tb);}
seg('aB',BENCH.map(b=>[b.k,b.l]),aB,v=>{aB=v;r2();accTable(true);});
seg('aT',[['reg','Regression · CRPS'],['cls','Classification · log loss']],aT,v=>{aT=v;r2();accTable(true);dsTable(true);});
seg('dM',MS.map((m,j)=>[j,m.toLocaleString()]),dM,v=>{dM=v;dsTable(true);});
document.getElementById('accAll').onclick=()=>{accAll=!accAll;accTable(true);};
accTable(false);dsTable(false);

/* ================= 04 · calibration ================= */
let kT='cls',kM=1,calAll=false;
const SHOW=['TabPFN-2.5','Kumo-large','LimiX','TabICLv2','Kumo-small','CatBoost, tuned','XGBoost, tuned','RealMLP'].map(n=>MODELS.find(m=>m.n===n)).filter(Boolean).map(m=>m.i);
function curve(t,q,i,b){const R=m32(hsh(t,b,i,kM)),pts=[];for(let k=0;k<10;k++){const c=(k+.5)/10;let o;
  if(t==='cls'){o=.5+(c-.5)*(.38+.62*q);}else{o=MODELS[i].type==='gp'?Math.min(.995,c*1.05):c*(1-.36*(1-q));}
  o+=(R()-.5)*.02*(i===V?.4:1);pts.push([c,cl(o,0,1)]);}return pts;}
const r3=lazy('rel',anim=>{const host=document.getElementById('rel');host.innerHTML='';
  document.getElementById('f3ctx').textContent=`${kT==='cls'?'classification · stated confidence':'regression · interval coverage'} · ${MS[kM].toLocaleString()} rows`;
  BENCH.forEach(b=>{const cell=document.createElement('div');cell.innerHTML=`<div class="qh">${b.l}</div>`;host.appendChild(cell);
    const svg=S('svg',{viewBox:'0 0 260 268'},cell),x0=40,y0=14,Sz=200,px=v=>x0+v*Sz,py=v=>y0+Sz-v*Sz,res=RES[kT][b.k][kM];
    [0,.5,1].forEach(v=>{S('line',{x1:px(v),y1:y0,x2:px(v),y2:y0+Sz,stroke:RULE},svg);S('line',{x1:x0,y1:py(v),x2:x0+Sz,y2:py(v),stroke:RULE},svg);
      T(svg,px(v),y0+Sz+15,`${v*100}%`,{'text-anchor':'middle','font-size':9.5});T(svg,x0-6,py(v)+3.5,`${v*100}%`,{'text-anchor':'end','font-size':9.5});});
    T(svg,x0+Sz/2,y0+Sz+33,kT==='cls'?'STATED CONFIDENCE':'NOMINAL INTERVAL',{'text-anchor':'middle','font-size':8.5,'letter-spacing':1,fill:INK});
    S('line',{x1:px(0),y1:py(0),x2:px(1),y2:py(1),stroke:INK,'stroke-width':1,'stroke-dasharray':'3 3'},svg);
    SHOW.concat([V]).forEach((i,k)=>{const ours=i===V,pts=curve(kT,res.q[i],i,b.k);
      const p=S('path',{d:pts.map(([c,o],j)=>(j?'L':'M')+px(c)+' '+py(o)).join(' '),fill:'none',stroke:ours?INK:FAINT,'stroke-width':ours?2.6:1.1,'stroke-linejoin':'round'},svg);drawLine(p,1,ours?.6:.1+k*.04);
      if(ours)pts.forEach(([c,o],j)=>D(S('circle',{cx:px(c),cy:py(o),r:2.6,fill:INK,class:'pop'},svg),1+j*.04));});
    const val=kT==='cls'?`ECE ${res.ece[V].toFixed(3)}`:`covers ${(res.cov[V]*100).toFixed(0)}%`;
    D(T(svg,x0+6,y0+14,`valli · ${val}`,{'font-size':10,fill:INK,'font-weight':600,class:'fade',stroke:PANEL,'stroke-width':4,'paint-order':'stroke'}),1.2);
    if(anim)go(svg);});});
function calTable(anim){const tb=document.getElementById('cal'),key=kT==='cls'?'ece':'cov',score=(r,i)=>key==='ece'?r.ece[i]:Math.abs(r.cov[i]-.9);
  document.getElementById('t4ctx').textContent=`${kT==='cls'?'classification · ECE, lower is better':'regression · 90% interval coverage, 90% is ideal'}`;
  document.getElementById('calnote').textContent=kT==='cls'?'Expected calibration error, 10 bins, mean over 5 seeds. Black cell = best in that column.':'Share of held-out rows inside the model’s 90% interval. Black cell = closest to 90% in that column.';
  const rows=MODELS.map(o=>({o,m:mean(BENCH.map(b=>score(RES[kT][b.k][kM],o.i)))})).sort((a,b)=>a.m-b.m),show=calAll?rows:rows.slice(0,15);
  const best=BENCH.map(b=>Math.min(...MODELS.map(o=>score(RES[kT][b.k][kM],o.i))));
  let h=`<thead><tr><th class="l"></th><th class="l">Model</th>${BENCH.map(b=>`<th>${b.l}</th>`).join('')}<th>Mean</th></tr></thead><tbody>`;
  show.forEach((x,k)=>{const o=x.o;h+=`<tr class="${o.i===V?'ours':''}"><td class="rk">${k+1}</td><td class="nm l">${o.n}${o.i===K?'<small>valli’s base</small>':''}</td>`+
    BENCH.map((b,j)=>{const r=RES[kT][b.k][kM],v=key==='ece'?r.ece[o.i].toFixed(3):`${(r.cov[o.i]*100).toFixed(1)}%`,isb=score(r,o.i)===best[j];return`<td>${isb?`<span class="best">${v}</span>`:v}</td>`;}).join('')+
    `<td>${key==='ece'?x.m.toFixed(3):`±${(x.m*100).toFixed(1)} pts`}</td></tr>`;});
  tb.innerHTML=h+'</tbody>';document.getElementById('calAll').textContent=calAll?'show top 15':`show all ${N} models`;if(anim)fadeRows(tb);}
seg('kT',[['cls','Classification · ECE'],['reg','Regression · coverage']],kT,v=>{kT=v;r3();calTable(true);});
seg('kM',MS.map((m,j)=>[j,m.toLocaleString()]),kM,v=>{kM=v;r3();calTable(true);});
document.getElementById('calAll').onclick=()=>{calAll=!calAll;calTable(true);};
calTable(false);

/* ================= toc ================= */
{const links=[...host.querySelectorAll('#toc a')];const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(l=>l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id));}),{rootMargin:'-35% 0px -60% 0px'});
 links.forEach(a=>io.observe(document.querySelector(a.getAttribute('href'))));observers.push(io);}

  return () => { observers.forEach(o => o.disconnect()); host.innerHTML = ''; host.classList.remove('vxb'); delete host.dataset.mounted; };
}
