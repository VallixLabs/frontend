// ILLUSTRATIVE benchmark data, from the design's benchmarks.js (benchmarkmaindoc.html). Nothing here is
// measured: the scores come from a seeded random generator, Valli's (V) and Kumo-large's (K) ranks are set by
// hand in RANK, and training times / speeds are placeholders. `illustrative: true` makes every figure and table
// carry an "Illustrative data" label. To publish real results, replace this module with one exporting the same
// shape built from your runs, and set `illustrative: false`.
//
// Shape: MODELS[{i,n,type,h,kind,rps,src}], BENCH[{k,l,n}], MS[labelled-row counts],
//   RES[task][bench][mi] = {rank[], err[], ci[], ece[], cov[], q[]} indexed by model i,
//   DATASETS[{n,b,t}], dsErr(dataset, modelIndex, mi), V = Valli's index, K = Valli's base model's index.

function m32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function gs(R){let u=0,v=0;while(!u)u=R();while(!v)v=R();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
function hsh(...a){let h=7;a.join('|').split('').forEach(c=>h=Math.imul(h,31)+c.charCodeAt(0)|0);return h>>>0;}
const cl=(x,a,b)=>x<a?a:x>b?b:x;

// [name, type, training hours, 'pre' (pretrained once) | 'per' (per dataset), inference rows/s, note]
const MODELS=[
 ['valli','ours',.25,'per',760000,'served by tvarit'],
 ['TabPFN-2.5','fm',4000,'pre',22000],['TabPFN v2','fm',2688,'pre',21000,'Hollmann et al. 2025'],['TabICLv2','fm',588,'pre',31000,'24.5 H100-days'],
 ['TabICL','fm',1440,'pre',25000,'60 A100-days'],['Kumo-large','fm',150,'pre',9000],['Kumo-small','fm',60,'pre',26000],['LimiX','fm',900,'pre',14000],
 ['Mitra','fm',300,'pre',18000],['TabDPT','fm',500,'pre',16000],['CatBoost, tuned','tree',.45,'per',1900000],['LightGBM, tuned','tree',.3,'per',3400000],
 ['XGBoost, tuned','tree',.38,'per',2800000],['RealMLP','nn',.8,'per',700000],['TabM','nn',.9,'per',520000],['ModernNCA','nn',.6,'per',310000],
 ['AutoGluon, best','auto',4,'per',60000],['GP, tuned','gp',.05,'per',90000],['Random forest','tree',.04,'per',600000],['TabR','nn',.7,'per',260000],
 ['FT-Transformer','nn',1.1,'per',380000],['ExcelFormer','nn',.9,'per',350000],['HyperFast','fm',200,'pre',45000],['CARTE','fm',100,'pre',20000],
 ['TuneTables','fm',.33,'per',18000],['TabPFN-1','fm',192,'pre',40000],['MLP, tuned','nn',.5,'per',900000],['ResNet','nn',.6,'per',800000],
 ['SAINT','nn',1.3,'per',240000],['TabNet','nn',1,'per',300000],['NODE','nn',1.4,'per',200000],['EBM','tree',.2,'per',1200000],
 ['ExtraTrees','tree',.03,'per',650000],['HistGB','tree',.05,'per',2500000],['kNN','other',.002,'per',200000],['SVM','other',.01,'per',150000],
 ['Ridge / logistic','other',.001,'per',8000000],['CatBoost, default','tree',.02,'per',1900000],['LightGBM, default','tree',.01,'per',3400000],
 ['XGBoost, default','tree',.015,'per',2800000],['Trompt','nn',1.2,'per',220000]].map(([n,type,h,kind,rps,src],i)=>({i,n,type,h,kind,rps,src}));
const N=MODELS.length,V=0,K=6;
const BENCH=[{k:'sci',l:'Scientific',n:'5 real datasets'},{k:'bus',l:'Business',n:'6 real datasets'},{k:'syn',l:'Synthetic',n:'24 tables'},{k:'tab',l:'TabArena',n:'39 tables'}];
const MS=[25,50,100,200,1000];
const RANK={reg:{sci:[[1,1,1,2,3],[13,13,5,6,5]],bus:[[1,1,2,2,4],[10,9,6,6,5]],syn:[[1,1,1,1,3],[12,11,8,6,5]],tab:[[2,3,3,4,5],[8,6,5,3,4]]},
            cls:{sci:[[1,1,3,4,9],[4,5,2,6,16]],bus:[[1,2,3,3,6],[9,8,6,6,7]],syn:[[1,1,1,1,3],[13,12,7,5,6]],tab:[[1,1,2,4,10],[15,14,9,5,9]]}};
const BASE={reg:{sci:[.34,.29,.24,.2,.15],bus:[.31,.27,.22,.19,.14],syn:[.28,.24,.2,.17,.12],tab:[.36,.31,.26,.22,.16]},
            cls:{sci:[.61,.55,.5,.46,.39],bus:[.58,.53,.49,.45,.38],syn:[.52,.47,.43,.4,.34],tab:[.6,.55,.51,.47,.41]}};
const bias=(type,m)=>({ours:0,fm:m<=100?.24:-.02,tree:m>=200?.2:-.14,nn:m>=200?.06:-.06,auto:m>=200?.14:-.02,gp:m<=50?.12:-.1,other:-.25})[type];
const RES={reg:{},cls:{}};
['reg','cls'].forEach(t=>BENCH.forEach(b=>{RES[t][b.k]=MS.map((m,mi)=>{const R=m32(hsh(t,b.k,m));
  const sc=MODELS.map(o=>({i:o.i,v:(1-o.i/N)*.6+bias(o.type,m)+gs(R)*.12}));
  const others=sc.filter(o=>o.i!==V&&o.i!==K).sort((a,c)=>c.v-a.v).map(o=>o.i),order=new Array(N).fill(null);
  order[RANK[t][b.k][0][mi]-1]=V;order[RANK[t][b.k][1][mi]-1]=K;let p=0;for(let r=0;r<N;r++)if(order[r]===null)order[r]=others[p++];
  const rank=[],err=[],ci=[],ece=[],cov=[],q=[],B=BASE[t][b.k][mi];
  order.forEach((idx,r)=>{rank[idx]=r+1;err[idx]=B*(1+.55*Math.pow(r/(N-1),.85)+r*.0006);ci[idx]=err[idx]*(.022+.02*R());});
  MODELS.forEach(o=>{let qq=({ours:.95,fm:.72,tree:.55,nn:.62,auto:.66,gp:.84,other:.58})[o.type]+gs(R)*.05+mi*.012;if(o.i===V)qq=(m>=1000?.91:.95)+R()*.03;q[o.i]=cl(qq,.3,.985);
    ece[o.i]=.006+.12*Math.pow(1-q[o.i],1.25);cov[o.i]=o.type==='gp'?cl(.93+R()*.02,0,.99):cl(.9-.34*(1-q[o.i])+(o.i===V?(R()-.5)*.012:0),.5,.95);});
  return{rank,err,ci,ece,cov,q};});}));
const DATASETS=[['Solubility','sci','reg'],['Reaction yield','sci','reg'],['Polymer Tg','sci','reg'],['Toxicity class','sci','cls'],['Crystal phase','sci','cls'],
  ['Claims cost','bus','reg'],['Demand','bus','reg'],['Lead value','bus','reg'],['Churn','bus','cls'],['Credit default','bus','cls'],['Fraud flag','bus','cls']].map(([n,b,t],i)=>({n,b,t,f:.72+m32(i*7+3)()*.62}));
const dsErr=(d,i,mi)=>{const R=m32(hsh(d.n,i,mi));return RES[d.t][d.b][mi].err[i]*d.f*(1+gs(R)*.012);};

export const benchmarkData = { illustrative: true, MODELS, BENCH, MS, RES, DATASETS, dsErr, V, K };
