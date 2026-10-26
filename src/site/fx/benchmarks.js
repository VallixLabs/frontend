// Benchmarks section, from the design's benchmarks.js (benchmarkmaindoc.html): styles scoped under .vxb.
// The design's styling and figure types; the numbers come from `data` (src/site/data/benchmarks.json, built by
// scripts/export_benchmarks.py from the valli repository's benchmark export).
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
.vxb .mono{font-family:'Source Sans 3',system-ui,sans-serif;font-weight:600;font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--mid)}
.vxb .wrap{max-width:1300px;margin:0 auto;padding:0 28px}
.vxb nav{display:flex;align-items:center;justify-content:space-between;padding:16px 0 8px;gap:16px}
.vxb nav .links{display:flex;gap:26px;font-size:14px}
.vxb nav .links .on{border-bottom:1px solid var(--ink)}
@media(max-width:820px){.vxb nav .links{display:none}
}
.vxb .logo{font-family:var(--serif);font-style:italic;font-weight:600;font-size:22px}
.vxb .logo small{font-family:var(--mono);font-style:normal;font-size:9px;letter-spacing:.14em;font-weight:500;margin-left:4px;vertical-align:2px}
.vxb .pill{display:inline-flex;align-items:center;gap:10px;border-radius:99px;padding:8px 15px;font-size:14px;border:1px solid var(--rule);background:#fbfaf8;color:var(--ink);text-decoration:none}
.vxb .ph{padding:56px 0 0;max-width:860px}
.vxb .ph h1{font-weight:500;font-size:clamp(38px,5vw,60px);line-height:1.06;letter-spacing:-.028em;margin:10px 0 16px}
.vxb .ph p{font-size:17.5px;line-height:1.6;color:var(--mid);margin:0 0 18px;max-width:700px}
.vxb .links2{display:flex;gap:10px;flex-wrap:wrap}
.vxb .bp{display:block;margin-top:40px}
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
.vxb .ttl{font-size:21px;font-weight:500;letter-spacing:-.01em;margin:0 0 10px}
.vxb .key{font-family:var(--mono);font-size:11.5px;color:var(--ink);display:flex;gap:26px;flex-wrap:wrap;align-items:center;margin:0 0 6px}
.vxb .key span{display:inline-flex;align-items:center;gap:8px}
.vxb .key svg{width:auto;height:auto;display:inline-block;flex:none;overflow:visible}
.vxb .note{font-family:var(--mono);font-size:9.5px;letter-spacing:.03em;color:var(--faint);line-height:1.6;max-width:820px}
.vxb .ctrls{display:flex;gap:20px;flex-wrap:wrap;align-items:center}
.vxb .seg{display:inline-flex;gap:3px;flex-wrap:wrap;align-items:center}
.vxb .seg .lab{font-family:'Source Sans 3',system-ui,sans-serif;font-weight:600;font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--faint);margin-right:6px}
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
.vxb .qh{font-family:'Source Sans 3',system-ui,sans-serif;font-weight:600;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink);padding:12px 14px 0}
.vxb .tw{overflow-x:auto}
.vxb table.t{border-collapse:collapse;width:100%;font-size:14px;min-width:760px}
.vxb table.t th{font-family:'Source Sans 3',system-ui,sans-serif;font-weight:600;font-size:9.5px;letter-spacing:.11em;text-transform:uppercase;color:var(--mid);font-weight:500;text-align:right;padding:11px 12px;border-bottom:1px solid var(--ink);white-space:nowrap;cursor:pointer;user-select:none;background:var(--panel)}
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
.vxb .btn{font-family:'Source Sans 3',system-ui,sans-serif;font-weight:600;font-size:10px;letter-spacing:.14em;text-transform:uppercase;background:none;border:1px solid var(--rule);color:var(--mid);padding:5px 11px;cursor:pointer;border-radius:2px}
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
.vxb .end{height:110px}
.vxb{background:transparent}
.vxb .toc{top:88px}
.vxb section.sec{scroll-margin-top:84px}
.vxb .bp{margin-top:8px}
.vxb main{min-width:0}
.vxb .card{min-width:0;overflow:hidden}
@media(max-width:1100px){.vxb .bp{grid-template-columns:minmax(0,1fr)}}

.vxb .ctrls{display:flex;gap:14px 28px;flex-wrap:wrap;align-items:center;margin:0 0 16px}
.vxb .seg{display:inline-flex;gap:6px;flex-wrap:wrap;align-items:center}
.vxb .seg .lab{font-family:'Source Sans 3',system-ui,sans-serif;font-weight:600;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--mid);margin-right:4px}
.vxb .seg button{font-family:'Source Sans 3',system-ui,sans-serif;font-size:14px;font-weight:500;letter-spacing:0;color:#141414;background:#f6f5f2;border:1px solid #d6d4ce;border-radius:999px;padding:7px 15px;cursor:pointer;transition:border-color .2s,color .2s,background .2s}
.vxb .seg button:hover{border-color:#2e5c36;color:#2e5c36}
.vxb .seg button[aria-pressed="true"]{background:#141414;border-color:#141414;color:#f6f5f2}
.vxb .seg button[aria-pressed="true"]:hover{background:#2e5c36;border-color:#2e5c36;color:#f6f5f2}
.vxb .chd .ctrls{margin:0}
.vxb .desc{font-size:14.5px;color:var(--mid)}
.vxb ul.stars{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:3px;font-size:13px;color:var(--mid);flex:1 1 320px}
.vxb ul.stars li::before{content:"* ";color:#2e5c36;font-weight:600}
.vxb .cft{align-items:flex-start}
.vxb table.t tr.ours td{color:#2e5c36;border-bottom-color:#2e5c36}
.vxb table.t tr.ours td.nm::before{background:#2e5c36}
.vxb table.t tr.ours{background:rgba(46,92,54,.06)}
.vxb .seg button{white-space:nowrap}
.vxb .cft .key{display:flex;flex-wrap:wrap;gap:8px 22px;align-items:center;font-family:'Source Sans 3',system-ui,sans-serif;font-size:13.5px;color:#141414;flex:1 1 300px}
.vxb .cft .key span{display:inline-flex;align-items:center;gap:8px;white-space:nowrap}
.vxb table.t tr.ours .best{background:#2e5c36;color:#f6f5f2}
.vxb #leaderboard .sh{border-top:0;padding-top:0}
.vxb .bp{margin-top:8px}
.vxb .illus{font-family:'Source Sans 3',system-ui,sans-serif;font-weight:600;font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:#f4f2ee;background:#a2553f;padding:3px 8px;white-space:nowrap}
.vxb .illus-banner{display:flex;gap:12px;align-items:baseline;flex-wrap:wrap;margin:0 0 28px;padding:14px 18px;border:1px solid #a2553f;background:rgba(162,85,63,.07);font-size:15px;line-height:1.5;color:var(--ink)}
`;
const CSS_MORE = `
.vxb .tfoot .lkey{flex:1 1 100%}
.vxb .quad.q3{grid-template-columns:repeat(3,minmax(0,1fr))}
@media(max-width:900px){.vxb .quad.q3{grid-template-columns:1fr}.vxb .quad.q3 > div{border-right:0;border-bottom:1px solid var(--rule)}}
.vxb table.t td.na{color:var(--faint)}
`;

const HTML = `<div class="bp">
  <main>

    <!-- ========== LEADERBOARD ========== -->
    <section class="sec" id="leaderboard">
      <div class="sh"><h2>Leaderboard</h2><p>Place among all ranked models at each number of labelled rows.</p></div>
      <div class="ctrls"><div class="seg" id="lbB"><span class="lab">Benchmark</span></div><div class="seg" id="lbT"><span class="lab">Task</span></div></div>
      <div class="card">
        <div class="tw"><table class="t" id="lb"></table></div>
        <div class="tfoot"><div class="lkey"><span>PLACE</span><i style="background:rgba(20,20,20,.82)"></i>1<i style="background:rgba(20,20,20,.42)"></i>≤3<i style="background:rgba(20,20,20,.22)"></i>≤5<i style="background:rgba(20,20,20,.1)"></i>≤10<i style="background:rgba(20,20,20,.04)"></i>≤20</div>
          <ul class="stars"><li>Place: lower is better. Mean = mean place over the columns the model is ranked in.</li><li>— = not ranked in that column (completed fewer than 95% of its tasks).</li><li id="t1ctx"></li><li>Run on NVIDIA A6000 GPUs.</li><li>Click any column heading to sort.</li></ul></div>
      </div>
    </section>

    <!-- ========== ACCURACY ========== -->
    <section class="sec" id="accuracy">
      <div class="sh"><h2>Accuracy</h2><p>Log loss for classification and CRPS for regression</p></div>
      <div class="ctrls"><div class="seg" id="aB"><span class="lab">Benchmark</span></div><div class="seg" id="aT"><span class="lab">Task</span></div></div>
      <div class="card">
        <div class="cb">
          <!-- Accuracy chart draws only the top 5 models: Valli + the four with the lowest mean error -->
          <div class="pw" id="w2"><svg id="s2"></svg><div class="tip"></div></div>
        </div>
        <div class="cft"><div class="key"><span><svg width="28" height="10"><line x1="1" y1="5" x2="27" y2="5" stroke="#2e5c36" stroke-width="2.6"/></svg>Valli</span><span><svg width="28" height="10"><line x1="1" y1="5" x2="27" y2="5" stroke="#6d6a64" stroke-width="1.4"/></svg>next four models</span></div><ul class="stars"><li>On the bottom line = lowest error of all ranked models.</li><li>Lower is better. CRPS is scaled by the target's standard deviation.</li><li id="f2ctx"></li><li>Run on NVIDIA A6000 GPUs.</li></ul></div>
      </div>
      <div class="card">
        <div class="chd"><span class="desc">Mean error per model at each number of labelled rows, with a 95% interval.</span><span class="mono" id="t2ctx"></span></div>
        <div class="tw"><table class="t" id="acc"></table></div>
        <div class="tfoot"><ul class="stars"><li>Mean over tables and repetitions; ± is half the 95% bootstrap interval over tables (dataset × scenario).</li><li>Dark cell = lowest error at that number of rows.</li><li>Run on NVIDIA A6000 GPUs.</li></ul><button class="btn" id="accAll"></button></div>
      </div>
      <div class="card">
        <div class="chd"><div class="ctrls"><div class="seg" id="dM"><span class="lab">Labelled rows</span></div></div><span class="desc" id="t3ctx"></span></div>
        <div class="tw"><table class="t" id="ds"></table></div>
        <div class="tfoot"><ul class="stars"><li id="dsnote"></li><li>Dark cell = lowest error on that dataset.</li><li>Run on NVIDIA A6000 GPUs.</li></ul></div>
      </div>
    </section>

    <!-- ========== CALIBRATION ========== -->
    <section class="sec" id="calibration">
      <div class="sh"><h2>Calibration</h2><p>Whether a model's stated confidence matches how often it is right</p></div>
      <div class="ctrls"><div class="seg" id="kT"><span class="lab">Task</span></div><div class="seg" id="kM"><span class="lab">Labelled rows</span></div></div>
      <div class="card">
        <div class="quad q3" id="rel"></div>
        <div class="cft"><div class="key"><span><svg width="28" height="10"><line x1="1" y1="5" x2="27" y2="5" stroke="#2e5c36" stroke-width="2.6"/></svg>Valli</span><span><svg width="28" height="10"><line x1="1" y1="5" x2="27" y2="5" stroke="#6d6a64" stroke-width="1.6" stroke-dasharray="5 3"/></svg>Kumo-small, released</span><span style="color:var(--mid)"><svg width="28" height="10"><line x1="1" y1="5" x2="27" y2="5" stroke="#aaa69e" stroke-width="1.2"/></svg>six best-placed others</span><span><svg width="28" height="10"><line x1="1" y1="5" x2="27" y2="5" stroke="#141414" stroke-width="1" stroke-dasharray="3 3"/></svg>perfect calibration</span></div><ul class="stars"><li>Classification: confidence of the predicted class against observed accuracy; expected calibration error, lower is better.</li><li>Regression: binned prediction against the mean actual value (standardised target); how often the 90% interval contains the truth, 90% is ideal.</li><li id="f3ctx"></li><li>Run on NVIDIA A6000 GPUs.</li></ul></div>
      </div>
      <div class="card">
        <div class="chd"><span class="desc">Calibration score per model at each number of labelled rows.</span><span class="mono" id="t4ctx"></span></div>
        <div class="tw"><table class="t" id="cal"></table></div>
        <div class="tfoot"><ul class="stars"><li id="calnote"></li><li>Run on NVIDIA A6000 GPUs.</li></ul><button class="btn" id="calAll"></button></div>
      </div>
    </section>
  </main>
</div>`;

const BANNER = `<div class="illus-banner"><span class="illus">Illustrative data</span><span>These figures and tables show the planned format only. The numbers are generated, not measured, and do not reproduce from any experiment.</span></div>`;

const DS_NAMES = { wind: 'Wind', radon: 'Radon', insurance: 'Insurance', pv: 'PV', selenium: 'Selenium' };

export function mountBenchmarks(host, data) {
  if (host.dataset.mounted) return; host.dataset.mounted = '1';
  if (!document.getElementById('vxb-style')) { const st = document.createElement('style'); st.id = 'vxb-style'; st.textContent = CSS + CSS_MORE; document.head.appendChild(st); }
  host.classList.add('vxb'); host.innerHTML = (data.illustrative ? BANNER : '') + HTML;
  if (data.illustrative) host.querySelectorAll('.chd').forEach(h => { const s = document.createElement('span'); s.className = 'illus'; s.textContent = 'Illustrative data'; h.appendChild(s); });

/* ================= helpers ================= */
const NS='http://www.w3.org/2000/svg',GR='#2e5c36',INK='#141414',MID='#6d6a64',FAINT='#aaa69e',RULE='#dedbd4',PANEL='#f8f7f4';
const MONO='"IBM Plex Mono", ui-monospace, Menlo, monospace',SANS='"Source Sans 3", Arial, sans-serif';
function S(t,a={},p){const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;}
function T(p,x,y,s,a={}){const e=S('text',Object.assign({x,y,'font-family':MONO,'font-size':11.5,fill:MID},a),p);e.textContent=s;return e;}
const mean=a=>a.length?a.reduce((s,x)=>s+x,0)/a.length:NaN;
const ord=n=>{const v=n%100;return n+((v>10&&v<14)?'th':({1:'st',2:'nd',3:'rd'}[n%10]||'th'));};
const D=(el,s)=>{el.style.transitionDelay=s+'s';return el;};
function drawLine(p,dur,delay){const L=p.getTotalLength();p.style.strokeDasharray=`${L} ${L}`;p.style.strokeDashoffset=L;p.style.transition=`stroke-dashoffset ${dur}s cubic-bezier(.4,0,.2,1) ${delay}s`;p.dataset.draw=1;return p;}
function go(svg){requestAnimationFrame(()=>requestAnimationFrame(()=>{svg.classList.add('go');svg.querySelectorAll('[data-draw]').forEach(p=>p.style.strokeDashoffset=0);}));}
const observers=[];
function onView(el,fn){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){fn();io.disconnect();}}),{threshold:.2});io.observe(el);observers.push(io);}
function tipFor(id){const w=document.getElementById(id),t=w.querySelector('.tip');return{on(el,h){el.addEventListener('mousemove',ev=>{const r=w.getBoundingClientRect();t.innerHTML=h;t.style.left=(ev.clientX-r.left)+'px';t.style.top=(ev.clientY-r.top)+'px';t.style.opacity=1;});el.addEventListener('mouseleave',()=>t.style.opacity=0);}};}
function seg(id,opts,cur,cb){const el=document.getElementById(id);el.querySelectorAll('button').forEach(b=>b.remove());opts.forEach(([v,l])=>{const b=document.createElement('button');b.textContent=l;b.setAttribute('aria-pressed',v===cur?'true':'false');
  b.onclick=()=>{el.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');cb(v);};el.appendChild(b);});}
function lazy(id,build){let seen=false;build(false);onView(document.getElementById(id),()=>{seen=true;build(true);});return()=>build(seen);}
function fadeRows(tb){[...tb.querySelectorAll('tbody tr')].forEach((r,i)=>{r.style.opacity=0;setTimeout(()=>r.style.opacity=1,12*i);});}

/* ================= data access ================= */
const BENCH=data.benches,M=data.models;
const ids=Object.keys(M),OURS=ids.find(i=>M[i].role==='ours'),BASE=ids.find(i=>M[i].role==='base');
const name=id=>id===OURS?'Valli':(M[id]&&M[id].n)||id;
const BL=k=>BENCH.find(b=>b.k===k).l;
const msOf=b=>BENCH.find(x=>x.k===b).ms;
const COMMON_MS=BENCH.map(b=>b.ms).reduce((a,ms)=>a.filter(m=>ms.includes(m)));
const cell=(b,t,m)=>data.cells[`${b}|${t}|${m}`];
const rankedRows=c=>c?c.rows.filter(r=>r.place!=null):[];
const row=(c,id)=>c&&c.rows.find(r=>r.id===id);
const metricName=t=>t==='regression'?'CRPS':'log loss';
const taskOpts=[['classification','Classification'],['regression','Regression']];
const benchOpts=BENCH.map(b=>[b.k,b.l]);
const sub=id=>id===BASE?'<small>Valli’s base</small>':'';
const logX=(ms,X0,X1)=>m=>ms.length<2?(X0+X1)/2:X0+(Math.log10(m)-Math.log10(ms[0]))/(Math.log10(ms[ms.length-1])-Math.log10(ms[0]))*(X1-X0);
// one path through the points a model has, broken where it is missing
function pathOf(pts){let d='',on=false;pts.forEach(p=>{if(p==null){on=false;return;}d+=(on?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1);on=true;});return d;}

/* ================= leaderboard ================= */
let lbB='tab',lbT='classification',lbS='mean';
const tintR=r=>r<=1?.82:r<=3?.42:r<=5?.22:r<=10?.1:r<=20?.04:0;
function lb(anim){const ms=msOf(lbB),cells=ms.map(m=>cell(lbB,lbT,m)),tb=document.getElementById('lb');
  document.getElementById('t1ctx').textContent=`${BL(lbB)}, ${lbT}: ${cells[0].n_tables} tables; the number after each column heading is how many models are ranked there.`;
  const all=[...new Set(cells.flatMap(c=>rankedRows(c).map(r=>r.id)))];
  const rows=all.map(id=>{const p=cells.map(c=>{const r=row(c,id);return r&&r.place!=null?r.place:null;});return{id,p,mean:mean(p.filter(x=>x!=null))};});
  const key=x=>lbS==='mean'?x.mean:(x.p[lbS]??Infinity);rows.sort((a,b)=>key(a)-key(b)||a.mean-b.mean);
  const th=(j,l)=>`<th data-j="${j}" class="c${lbS===j?' sorted':''}">${l}</th>`;
  let h=`<thead><tr><th class="grp" colspan="2"></th><th class="grp" colspan="${ms.length+1}">Place · lower is better</th></tr><tr><th class="l" style="cursor:default"></th><th class="l" style="cursor:default">Model</th>`+
    ms.map((m,j)=>th(j,`${m.toLocaleString()} rows <span style="color:var(--faint)">/ ${cells[j].n_ranked}</span>`)).join('')+th('mean','Mean')+'</tr></thead><tbody>';
  const cellH=(v,ours)=>{if(v==null||isNaN(v))return'<td class="h c na">—</td>';const a=tintR(v);return`<td class="h c"><span style="background:rgba(${ours?'46,92,54':'20,20,20'},${a});color:${a>.4?'#f4f2ee':'#141414'}">${Number.isInteger(v)?v:v.toFixed(1)}</span></td>`;};
  rows.forEach((x,k)=>{h+=`<tr class="${x.id===OURS?'ours':''}"><td class="rk">${k+1}</td><td class="nm l">${name(x.id)}${sub(x.id)}</td>`+x.p.map(v=>cellH(v,x.id===OURS)).join('')+cellH(x.mean,x.id===OURS)+'</tr>';});
  tb.innerHTML=h+'</tbody>';tb.querySelectorAll('th[data-j]').forEach(t=>t.onclick=()=>{const j=t.dataset.j;lbS=j==='mean'?'mean':+j;lb(true);});if(anim)fadeRows(tb);}
seg('lbB',benchOpts,lbB,v=>{lbB=v;lb(true);});
seg('lbT',taskOpts,lbT,v=>{lbT=v;lb(true);});
lb(false);

/* ================= accuracy ================= */
let aB='tab',aT='classification',accAll=false;
const sciMs=msOf('sci');let dM=sciMs.includes(50)?50:sciMs[0];
const r2=lazy('s2',anim=>{const svg=document.getElementById('s2');svg.innerHTML='';svg.classList.remove('go');
  const ms=msOf(aB),cells=ms.map(m=>cell(aB,aT,m));
  document.getElementById('f2ctx').textContent=`Showing ${BL(aB)}, ${aT}, ${metricName(aT)}.`;
  const W=1000,H=430,X0=80,X1=800,Y0=20,Y1=370;svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
  const best=cells.map(c=>Math.min(...rankedRows(c).map(r=>r.err))),lo=.98,hi=1.36;
  const rel=(id,j)=>{const r=row(cells[j],id);return r&&r.place!=null?r.err/best[j]:null;};
  const xs=logX(ms,X0,X1),ys=v=>Y1-(v-lo)/(hi-lo)*(Y1-Y0);
  const cp=S('clipPath',{id:'cp2'},S('defs',{},svg));S('rect',{x:X0,y:Y0-2,width:X1-X0+2,height:Y1-Y0+4},cp);
  ms.forEach(m=>{const x=xs(m);S('line',{x1:x,y1:Y0,x2:x,y2:Y1,stroke:RULE},svg);T(svg,x,Y1+22,m.toLocaleString(),{'text-anchor':'middle'});});
  [1,1.05,1.1,1.15,1.2,1.25,1.3,1.35].forEach(v=>{const y=ys(v);S('line',{x1:X0,y1:y,x2:X1,y2:y,stroke:v===1?INK:RULE,'stroke-width':v===1?1.2:.8},svg);T(svg,X0-10,y+4,v===1?'best':`+${Math.round((v-1)*100)}%`,{'text-anchor':'end',fill:v===1?INK:MID});});
  S('path',{d:`M${X0} ${Y0} V${Y1} H${X1}`,stroke:MID,fill:'none'},svg);
  T(svg,(X0+X1)/2,Y1+50,'LABELLED ROWS · log scale',{'text-anchor':'middle','font-size':10.5,'letter-spacing':1.2,fill:INK});
  T(svg,0,0,`${metricName(aT).toUpperCase()} vs the best model at each size`,{'text-anchor':'middle','font-size':10.5,'letter-spacing':1.2,fill:INK,transform:`translate(${X0-60} ${(Y0+Y1)/2}) rotate(-90)`});
  const all=[...new Set(cells.flatMap(c=>rankedRows(c).map(r=>r.id)))];
  const avg=all.map(id=>({id,m:mean(ms.map((_,j)=>rel(id,j)).filter(v=>v!=null))})).sort((a,b)=>a.m-b.m),top=avg.filter(x=>x.id!==OURS).slice(0,4).map(x=>x.id);
  const tip=tipFor('w2'),P=id=>ms.map((m,j)=>{const v=rel(id,j);return v==null?null:[xs(m),ys(v)];}),lines=S('g',{'clip-path':'url(#cp2)'},svg);
  /* only the top 5 models are drawn: Valli + the four with the lowest mean error */
  const ends=[];
  top.concat([OURS]).forEach((id,k)=>{const ours=id===OURS,d=pathOf(P(id));if(!d)return;drawLine(S('path',{d,fill:'none',stroke:ours?GR:MID,'stroke-width':ours?2.8:1.5,'stroke-linejoin':'round'},lines),1.2,ours?.8:.4+k*.1);
    ms.forEach((m,j)=>{const v=rel(id,j);if(v==null||v>hi)return;const r=row(cells[j],id);const c=D(S('circle',{cx:xs(m),cy:ys(v),r:ours?4.5:3,fill:ours?GR:PANEL,stroke:ours?GR:MID,'stroke-width':1.2,class:'pop'},svg),1+j*.06);
      tip.on(c,`${name(id)} · ${m.toLocaleString()} rows<br>${metricName(aT)} ${r.err.toFixed(3)} (${v===1?'best':'+'+((v-1)*100).toFixed(1)+'%'}) · ${ord(r.place)} of ${cells[j].n_ranked}`);});
    const lastJ=ms.map((_,j)=>rel(id,j)).map((v,j)=>v==null?-1:j).filter(j=>j>=0).pop();if(lastJ!=null)ends.push({id,y:ys(Math.min(rel(id,lastJ),hi)),ours});});
  ends.sort((a,b)=>a.y-b.y);for(let k=1;k<ends.length;k++)if(ends[k].y-ends[k-1].y<16)ends[k].y=ends[k-1].y+16;
  ends.forEach(e=>D(T(svg,X1+14,e.y+4,name(e.id),{'font-family':SANS,'font-size':e.ours?16:13.5,'font-weight':e.ours?600:400,fill:e.ours?GR:MID,class:'fade'}),1.4));
  if(anim)go(svg);});
function accTable(anim){const ms=msOf(aB),cells=ms.map(m=>cell(aB,aT,m)),tb=document.getElementById('acc');
  document.getElementById('t2ctx').textContent=`${BL(aB)} · ${aT} · ${metricName(aT)}`;
  const best=cells.map(c=>Math.min(...rankedRows(c).map(r=>r.err)));
  const all=[...new Set(cells.flatMap(c=>rankedRows(c).map(r=>r.id)))];
  const rows=all.map(id=>{const rs=cells.map(c=>{const r=row(c,id);return r&&r.place!=null?r:null;});return{id,rs,m:mean(rs.filter(Boolean).map(r=>r.err))};}).sort((a,b)=>a.m-b.m);
  const show=accAll?rows:rows.slice(0,15);
  let h=`<thead><tr><th class="l"></th><th class="l">Model</th>${ms.map(m=>`<th>${m.toLocaleString()} rows</th>`).join('')}<th>Mean</th></tr></thead><tbody>`;
  show.forEach((x,k)=>{h+=`<tr class="${x.id===OURS?'ours':''}"><td class="rk">${k+1}</td><td class="nm l">${name(x.id)}${sub(x.id)}</td>`+
    x.rs.map((r,j)=>{if(!r)return'<td class="na">—</td>';const b=r.err===best[j],ci=r.lo!=null&&r.hi!=null?`<span class="ci">±${((r.hi-r.lo)/2).toFixed(3)}</span>`:'';return`<td>${b?`<span class="best">${r.err.toFixed(3)}</span>`:r.err.toFixed(3)}${ci}</td>`;}).join('')+`<td>${x.m.toFixed(3)}</td></tr>`;});
  tb.innerHTML=h+'</tbody>';document.getElementById('accAll').textContent=accAll?'show top 15':`show all ${rows.length} models`;if(anim)fadeRows(tb);}
function dsTable(anim){const tb=document.getElementById('ds'),list=data.datasets[`${aT}|${dM}`]||[],c=cell('sci',aT,dM);
  const ranked=rankedRows(c).map(r=>r.id).filter(id=>list.every(d=>d.err[id]!=null));
  const avg=ranked.map(id=>({id,m:mean(list.map(d=>d.err[id]))})).sort((a,b)=>a.m-b.m),cols=[OURS].concat(avg.filter(x=>x.id!==OURS).slice(0,5).map(x=>x.id));
  let h=`<thead><tr><th class="l">Dataset</th>${cols.map((id,ci)=>`<th${ci===0?' style="color:#2e5c36"':''}>${name(id)}</th>`).join('')}</tr></thead><tbody>`;
  list.forEach(d=>{const vals=cols.map(id=>d.err[id]),mn=Math.min(...vals.filter(v=>v!=null));
    h+=`<tr><td class="nm l">${DS_NAMES[d.ds]||d.ds}</td>`+vals.map((v,ci)=>v==null?'<td class="na">—</td>':`<td${ci===0?' style="color:#2e5c36"':''}>${v===mn?`<span class="best"${ci===0?' style="background:#2e5c36;color:#f6f5f2"':''}>${v.toFixed(3)}</span>`:v.toFixed(3)}</td>`).join('')+'</tr>';});
  h+=`<tr><td class="nm l" style="color:var(--mid)">Lowest error on</td>${cols.map((id,ci)=>{const w=list.filter(d=>{const vals=cols.map(c2=>d.err[c2]).filter(v=>v!=null);return d.err[id]===Math.min(...vals);}).length;return`<td style="font-weight:${ci===0?600:400};${ci===0?'color:#2e5c36':''}">${w} of ${list.length}</td>`;}).join('')}</tr>`;
  tb.innerHTML=h+'</tbody>';
  document.getElementById('t3ctx').textContent=`Error on each of the ${list.length} real scientific datasets (${aT}, ${metricName(aT)}), for Valli and the five closest models.`;
  document.getElementById('dsnote').textContent=`Mean over each dataset's scenarios and repetitions; the five ranked models with the lowest mean error.${aT==='classification'?' Scientific classification is a single dataset, so read it as weak evidence.':''}`;
  if(anim)fadeRows(tb);}
seg('aB',benchOpts,aB,v=>{aB=v;r2();accTable(true);});
seg('aT',[['classification','Classification · log loss'],['regression','Regression · CRPS']],aT,v=>{aT=v;r2();accTable(true);dsTable(true);});
seg('dM',sciMs.map(m=>[m,m.toLocaleString()]),dM,v=>{dM=v;dsTable(true);});
document.getElementById('accAll').onclick=()=>{accAll=!accAll;accTable(true);};
accTable(false);dsTable(false);

/* ================= calibration ================= */
let kT='classification',kM=COMMON_MS.includes(200)?200:COMMON_MS[0],calAll=false;
const r3=lazy('rel',anim=>{const host=document.getElementById('rel');host.innerHTML='';const cls=kT==='classification';
  document.getElementById('f3ctx').textContent=`Showing ${cls?'classification, confidence vs accuracy':'regression, standardised target'}, at ${kM.toLocaleString()} labelled rows.`;
  BENCH.forEach(b=>{const cellEl=document.createElement('div');cellEl.innerHTML=`<div class="qh">${b.l}</div>`;host.appendChild(cellEl);
    const curves=(cls?data.rel:data.pva)[`${b.k}|${kM}`]||{},c=cell(b.k,kT,kM);
    const others=rankedRows(c).filter(r=>r.id!==OURS&&r.id!==BASE&&curves[r.id]).sort((a,b2)=>a.place-b2.place).slice(0,6).map(r=>r.id);
    const shown=others.concat([BASE,OURS]).filter(id=>curves[id]);
    let lo=0,hi=1;if(!cls){const vs=shown.flatMap(id=>curves[id].flatMap(p=>[p[0],p[1]]));lo=Math.floor(Math.min(...vs)*2)/2;hi=Math.ceil(Math.max(...vs)*2)/2;}
    const svg=S('svg',{viewBox:'0 0 260 268'},cellEl),x0=40,y0=14,Sz=200,px=v=>x0+(v-lo)/(hi-lo)*Sz,py=v=>y0+Sz-(v-lo)/(hi-lo)*Sz;
    const ticks=cls?[0,.5,1]:[lo,(lo+hi)/2,hi],fmt=v=>cls?`${v*100}%`:(+v.toFixed(1)).toString();
    ticks.forEach(v=>{S('line',{x1:px(v),y1:y0,x2:px(v),y2:y0+Sz,stroke:RULE},svg);S('line',{x1:x0,y1:py(v),x2:x0+Sz,y2:py(v),stroke:RULE},svg);
      T(svg,px(v),y0+Sz+15,fmt(v),{'text-anchor':'middle','font-size':9.5});T(svg,x0-6,py(v)+3.5,fmt(v),{'text-anchor':'end','font-size':9.5});});
    T(svg,x0+Sz/2,y0+Sz+33,cls?'STATED CONFIDENCE':'PREDICTED (binned)',{'text-anchor':'middle','font-size':8.5,'letter-spacing':1,fill:INK});
    S('line',{x1:px(lo),y1:py(lo),x2:px(hi),y2:py(hi),stroke:INK,'stroke-width':1,'stroke-dasharray':'3 3'},svg);
    shown.forEach((id,k)=>{const ours=id===OURS,base=id===BASE,pts=curves[id].filter(p=>p[0]!=null&&p[1]!=null);
      const p=S('path',{d:pts.map(([x,y],j)=>(j?'L':'M')+px(Math.max(lo,Math.min(hi,x))).toFixed(1)+' '+py(Math.max(lo,Math.min(hi,y))).toFixed(1)).join(' '),fill:'none',stroke:ours?GR:base?MID:FAINT,'stroke-width':ours?2.6:base?1.6:1.1,'stroke-dasharray':base?'5 3':null,'stroke-linejoin':'round'},svg);drawLine(p,1,ours?.6:.1+k*.04);
      if(ours)pts.forEach(([x,y],j)=>D(S('circle',{cx:px(Math.max(lo,Math.min(hi,x))),cy:py(Math.max(lo,Math.min(hi,y))),r:2.6,fill:INK,class:'pop'},svg),1+j*.04));});
    const r=row(c,OURS),val=!r||r.cal==null?'':cls?`ECE ${r.cal.toFixed(3)}`:`90% interval covers ${(r.cal*100).toFixed(0)}%`;
    if(val)D(T(svg,x0+6,y0+14,`Valli · ${val}`,{'font-size':10,fill:INK,'font-weight':600,class:'fade',stroke:PANEL,'stroke-width':4,'paint-order':'stroke'}),1.2);
    if(anim)go(svg);});});
function calTable(anim){const tb=document.getElementById('cal'),cls=kT==='classification',score=v=>cls?v:Math.abs(v-.9);
  document.getElementById('t4ctx').textContent=`${cls?'classification · ECE, lower is better':'regression · 90% interval coverage, 90% is ideal'} · ${kM.toLocaleString()} rows`;
  document.getElementById('calnote').textContent=cls?'Expected calibration error, mean over tables and repetitions. Dark cell = best in that column. — = not ranked on that benchmark.':'Share of held-out rows inside the model’s 90% interval, mean over tables and repetitions. Dark cell = closest to 90% in that column. — = not ranked on that benchmark.';
  const cells=BENCH.map(b=>cell(b.k,kT,kM));
  const all=[...new Set(cells.flatMap(c=>rankedRows(c).filter(r=>r.cal!=null).map(r=>r.id)))];
  const val=(c,id)=>{const r=row(c,id);return r&&r.place!=null&&r.cal!=null?r.cal:null;};
  const rows=all.map(id=>{const v=cells.map(c=>val(c,id));return{id,v,m:mean(v.filter(x=>x!=null).map(score))};}).sort((a,b)=>a.m-b.m),show=calAll?rows:rows.slice(0,15);
  const best=cells.map(c=>Math.min(...all.map(id=>val(c,id)).filter(x=>x!=null).map(score)));
  let h=`<thead><tr><th class="l"></th><th class="l">Model</th>${BENCH.map(b=>`<th>${b.l}</th>`).join('')}<th>Mean</th></tr></thead><tbody>`;
  show.forEach((x,k)=>{h+=`<tr class="${x.id===OURS?'ours':''}"><td class="rk">${k+1}</td><td class="nm l">${name(x.id)}${sub(x.id)}</td>`+
    x.v.map((v,j)=>{if(v==null)return'<td class="na">—</td>';const s=cls?v.toFixed(3):`${(v*100).toFixed(1)}%`;return`<td>${score(v)===best[j]?`<span class="best">${s}</span>`:s}</td>`;}).join('')+
    `<td>${cls?x.m.toFixed(3):`±${(x.m*100).toFixed(1)} pts`}</td></tr>`;});
  tb.innerHTML=h+'</tbody>';document.getElementById('calAll').textContent=calAll?'show top 15':`show all ${rows.length} models`;if(anim)fadeRows(tb);}
seg('kT',[['classification','Classification · reliability'],['regression','Regression · predicted vs actual']],kT,v=>{kT=v;r3();calTable(true);});
seg('kM',COMMON_MS.map(m=>[m,m.toLocaleString()]),kM,v=>{kM=v;r3();calTable(true);});
document.getElementById('calAll').onclick=()=>{calAll=!calAll;calTable(true);};
calTable(false);

  return () => { observers.forEach(o => o.disconnect()); host.innerHTML = ''; host.classList.remove('vxb'); delete host.dataset.mounted; };
}
