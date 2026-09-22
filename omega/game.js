const app=document.getElementById('app');

const ERA=[
 ['Type 0','Pre-Civilization','~90 min','Learn to control a planet'],
 ['Type I','Planetary','~2 hr','Harness most usable planetary energy'],
 ['Type II','Stellar','~2 hr','Harvest stellar output'],
 ['Type III','Galactic','~2.5 hr','Coordinate a galaxy-wide industrial network'],
 ['Type IV','Cosmic','~2.5 hr','Engineer spacetime and cosmic infrastructure'],
 ['Type V','Multiversal','~2 hr','Cross causal boundaries'],
 ['Type Ω','Omega','~2–4 hr','Operate a self-improving reality-scale civilization']
];

const RES=['food','wood','stone','copper','iron','coal','energy','science','alloy','exotic','credits'];
const s={era:0,paused:false,year:1,resources:Object.fromEntries(RES.map(r=>[r,0])),buildings:{},research:{},projects:{},log:[],manualClicks:0};

const BUILD=[
 {id:'gatherer',name:'Gatherer Camp',desc:'Organizes food collection.',res:'food',rate:.45,cost:{wood:12,stone:8},tech:'agriculture'},
 {id:'lumber',name:'Lumber Camp',desc:'Automates wood cutting.',res:'wood',rate:.35,cost:{stone:18},tech:'woodworking'},
 {id:'quarry',name:'Stone Quarry',desc:'Automates stone extraction.',res:'stone',rate:.75,cost:{wood:22},tech:'masonry'},
 {id:'copper',name:'Copper Mine',desc:'Automates shallow copper mining.',res:'copper',rate:.22,cost:{stone:65,food:20},tech:'copper'},
 {id:'kiln',name:'Charcoal Kiln',desc:'Turns timber into industrial fuel.',res:'coal',rate:.32,cost:{wood:55,stone:35},tech:'charcoal'},
 {id:'iron',name:'Ironworks',desc:'Smelts iron from ore and fuel.',res:'iron',rate:.15,cost:{stone:120,coal:40,copper:20},tech:'iron'},
 {id:'lab',name:'Research Laboratory',desc:'Automates a tiny stream of scientific work.',res:'science',rate:.10,cost:{iron:80,wood:30,coal:25},tech:'laboratory'},
 {id:'steam',name:'Steam Engine',desc:'First true industrial power plant.',res:'energy',rate:.30,cost:{iron:150,coal:80,copper:45},tech:'steam'},
 {id:'factory',name:'Assembly Plant',desc:'Mass-produces machine parts.',res:'alloy',rate:.055,cost:{iron:220,copper:120,energy:100},tech:'assembly'},
 {id:'reactor',name:'Fusion Reactor',desc:'Controlled fusion unlocks planetary-scale power.',res:'energy',rate:2.0,cost:{alloy:700,science:450,exotic:25},tech:'fusion'},
 {id:'orbital',name:'Orbital Industry',desc:'Industrial complex in low orbit.',res:'alloy',rate:.45,cost:{alloy:2200,energy:3500,science:1800},tech:'orbital'},
 {id:'dyson',name:'Dyson Swarm',desc:'Star-harvesting collector network.',res:'energy',rate:16,cost:{alloy:18000,energy:60000,science:18000},tech:'dyson'},
 {id:'gate',name:'Gate Network',desc:'Reliable interstellar logistics.',res:'exotic',rate:.12,cost:{alloy:90000,energy:250000,science:70000},tech:'gates'},
 {id:'galactic',name:'Galactic Fabricator',desc:'Autonomous galaxy-scale manufacturing.',res:'alloy',rate:9,cost:{exotic:2200,energy:2000000,science:500000},tech:'galactic'},
 {id:'spacetime',name:'Spacetime Forge',desc:'Engineers local metric geometry.',res:'exotic',rate:1.8,cost:{exotic:30000,energy:12000000,science:4000000},tech:'spacetime'},
 {id:'causal',name:'Causal Computer',desc:'Computes across constrained timelines.',res:'science',rate:55,cost:{exotic:150000,energy:80000000,science:12000000},tech:'causal'},
 {id:'universe',name:'Universe Foundry',desc:'Constructs pocket universes as industrial domains.',res:'alloy',rate:120,cost:{exotic:900000,energy:600000000,science:90000000},tech:'foundry'},
 {id:'omega',name:'Omega Seed',desc:'Bootstraps recursive civilization-scale intelligence.',res:'exotic',rate:30,cost:{exotic:9000000,energy:9000000000,science:1500000000},tech:'omega'},
];

const TECH=[
 {id:'agriculture',name:'Agriculture',cost:{science:15},req:[],text:'Food surplus and settlement planning.'},
 {id:'woodworking',name:'Woodworking',cost:{science:35},req:['agriculture'],text:'Organized timber production.'},
 {id:'masonry',name:'Masonry',cost:{science:60},req:['woodworking'],text:'Permanent extraction and storage.'},
 {id:'copper',name:'Copperworking',cost:{science:120},req:['masonry'],text:'Metallurgy begins.'},
 {id:'charcoal',name:'Charcoal Making',cost:{science:220},req:['woodworking'],text:'High-temperature fuel.'},
 {id:'iron',name:'Iron Metallurgy',cost:{science:480},req:['copper','charcoal'],text:'Reliable iron production.'},
 {id:'laboratory',name:'Scientific Method',cost:{science:900},req:['iron'],text:'Institutionalized experimentation.'},
 {id:'steam',name:'Steam Power',cost:{science:1700},req:['iron','laboratory'],text:'Heat becomes mechanical work.'},
 {id:'assembly',name:'Industrial Assembly',cost:{science:4200},req:['steam'],text:'Standardized machine production.'},
 {id:'planetary',name:'Planetary Logistics',cost:{science:9000},req:['assembly'],text:'Global supply networks.'},
 {id:'fusion',name:'Fusion Physics',cost:{science:18000},req:['planetary'],text:'Practical fusion engineering.'},
 {id:'orbital',name:'Orbital Mechanics',cost:{science:45000},req:['fusion'],text:'Permanent industry above the atmosphere.'},
 {id:'dyson',name:'Stellar Engineering',cost:{science:180000},req:['orbital'],text:'Star-scale collector networks.'},
 {id:'gates',name:'Metric Gate Theory',cost:{science:650000},req:['dyson'],text:'Stable shortcuts through interstellar space.'},
 {id:'galactic',name:'Galactic Systems',cost:{science:2500000},req:['gates'],text:'Civilization-wide coordination.'},
 {id:'spacetime',name:'Spacetime Engineering',cost:{science:12000000},req:['galactic'],text:'Metric manipulation.'},
 {id:'causal',name:'Causal Computing',cost:{science:70000000},req:['spacetime'],text:'Information across causal structure.'},
 {id:'foundry',name:'Universe Construction',cost:{science:400000000},req:['causal'],text:'Industrialized pocket universes.'},
 {id:'omega',name:'Omega Theory',cost:{science:2500000000},req:['foundry'],text:'Recursive self-improvement at reality scale.'},
];

const PROJECT=[
 {era:1,name:'Planetary Grid Stabilization',cost:{energy:15000,alloy:1200,science:7000},req:['planetary','fusion'],text:'Unify the home world into a single energy network.'},
 {era:2,name:'Solar Harvest Program',cost:{energy:500000,alloy:15000,science:70000},req:['orbital','dyson'],text:'Capture a meaningful fraction of stellar output.'},
 {era:3,name:'Galactic Transit Mesh',cost:{energy:12000000,alloy:140000,science:800000},req:['gates','galactic'],text:'Connect industrial nodes across the galaxy.'},
 {era:4,name:'Metric Sovereignty',cost:{energy:250000000,exotic:6000,science:25000000},req:['spacetime'],text:'Control local spacetime engineering.'},
 {era:5,name:'Causal Bridge',cost:{energy:9000000000,exotic:250000,science:800000000},req:['causal'],text:'Cross formerly isolated causal domains.'},
 {era:6,name:'Omega Ascension',cost:{energy:250000000000,exotic:25000000,science:30000000000},req:['omega'],text:'Create a recursively expanding Omega civilization.'}
];

function fmt(n){if(n<1000)return Math.floor(n).toLocaleString();const u=['k','M','B','T','Qa','Qi','Sx','Sp','Oc','No','Dc'];let i=0,v=n;while(v>=1000&&i<u.length-1){v/=1000;i++}return v.toFixed(v<10?2:v<100?1:0)+u[i]}
function hasTech(id){return !!s.research[id]}
function buildingLevel(id){return s.buildings[id]||0}
function canPay(c){return Object.entries(c).every(([r,v])=>s.resources[r]>=v)}
function pay(c){Object.entries(c).forEach(([r,v])=>s.resources[r]-=v)}
function reqMet(t){return t.req.every(hasTech)}
function manual(resource,amount){s.resources[resource]+=amount;s.manualClicks++;if(s.manualClicks%25===0)addLog('Hands still matter: manual '+resource+' gathering continues.')}

function buyTech(t){
 if(hasTech(t.id)||!reqMet(t)||!canPay(t.cost)||t.id==='omega'&&s.era<5)return;
 pay(t.cost);s.research[t.id]=1;addLog('Technology mastered: '+t.name+'.');
 render();
}
function build(b){
 if(!hasTech(b.tech)||!canPay(b.cost))return;
 pay(b.cost);s.buildings[b.id]=(s.buildings[b.id]||0)+1;addLog('Built '+b.name+' Mk.'+s.buildings[b.id]+'.');
 render();
}
function upgrade(b){
 const lvl=buildingLevel(b.id);if(lvl<1)return;
 const scale=Math.pow(2.35,lvl-1);const cost={};Object.entries(b.cost).forEach(([r,v])=>cost[r]=Math.ceil(v*scale*1.2));
 cost.science=Math.ceil(10*Math.pow(2,lvl));
 if(!canPay(cost))return;pay(cost);s.buildings[b.id]++;addLog(b.name+' upgraded to Mk.'+s.buildings[b.id]+'.');
 render();
}
function project(p){
 if(s.era!==p.era||s.projects[p.era]||!p.req.every(hasTech)||!canPay(p.cost))return;
 pay(p.cost);s.projects[p.era]=1;s.era++;s.year*=1.7;addLog('ASCENSION PROJECT COMPLETE: '+p.name+'. Civilization is now '+ERA[s.era][0]+'.');render();
}
function story(){
 const events=[
 'The first census counts more people than the founders believed possible.',
 'A machine-learning archive reconstructs a forgotten scientific dispute.',
 'A remote colony invents a new alloy that changes your industrial equations.',
 'Astronomers detect a repeating signal with no obvious source.',
 'A philosopher asks whether an expanding civilization can preserve a coherent culture.',
 'An autonomous probe returns carrying a star map that does not match known astronomy.',
 'A new mathematical formalism collapses years of research into a single elegant framework.',
 'A systems crisis reveals a dependency nobody had documented.',
 'A neighboring intelligence proposes reciprocal access to infrastructure.',
 'A simulation produces a result your researchers cannot reproduce experimentally.'
 ];
 let x=events[Math.floor(Math.random()*events.length)];addLog('CHRONICLE • '+x);
 if(Math.random()<.22)s.resources.science+=Math.max(50,500*mult());
 render();
}
function mult(){return 1+s.era*.55}
function tick(dt){
 if(s.paused)return;
 for(const b of BUILD){const lvl=buildingLevel(b.id);if(lvl>0&&hasTech(b.tech))s.resources[b.res]+=b.rate*lvl*dt*mult()}
 s.year+=dt*.035;
 if(s.era===0)s.resources.food=Math.min(s.resources.food,Math.max(s.resources.food,0));
 if(Math.random()<.006)story();
}
function costHTML(c){return Object.entries(c).map(([r,v])=>fmt(v)+' '+r).join(' · ')}
function section(title,html){return '<section class="card" style="margin-top:14px"><h2 style="margin:0 0 12px">'+title+'</h2>'+html+'</section>'}
function render(){
 const R=s.resources;
 let h='<div style="display:flex;justify-content:space-between;gap:20px;align-items:end;flex-wrap:wrap"><div><div class="tiny muted" style="letter-spacing:.2em">OMEGA CIVILIZATION ENGINE</div><h1 style="font-size:38px;margin:5px 0">From Nothing to Ω</h1><div class="muted">'+ERA[s.era][2]+' · '+ERA[s.era][3]+'</div></div><div style="text-align:right"><div class="tiny muted">YEAR '+Math.floor(s.year)+'</div><div style="font-size:24px;font-weight:700">'+ERA[s.era][0]+' — '+ERA[s.era][1]+'</div></div></div>';
 h+='<div class="grid" style="margin-top:16px">'+RES.slice(0,9).map(r=>'<div class="card"><div class="tiny muted">'+r.toUpperCase()+'</div><div style="font-size:22px;font-weight:700">'+fmt(R[r])+'</div></div>').join('')+'</div>';
 h+=section('Manual Production — no free resources', '<div class="grid">'+[['food','Gather Food'],['wood','Chop Wood'],['stone','Break Stone'],['copper','Extract Copper']].map(x=>'<button data-man="'+x[0]+'">'+x[1]+' <span class="muted">+1</span></button>').join('')+'<button data-man="science">Study <span class="muted">+1 science</span></button><button data-story>Generate Chronicle Event</button></div><p class="tiny muted" style="margin-bottom:0">The starting economy is intentionally manual. Automation exists only after you research and physically build the required infrastructure.</p>');
 h+=section('Automation', '<div class="research">'+BUILD.map(b=>{const lvl=buildingLevel(b.id),ok=hasTech(b.tech),cost=b.cost;const scale=lvl?Math.pow(2.35,lvl-1)*1.2:1;const c=lvl?Object.fromEntries(Object.entries(cost).map(([r,v])=>[r,Math.ceil(v*scale)])):cost; if(lvl)c.science=Math.ceil(10*Math.pow(2,lvl)); return '<div class="card"><div style="font-weight:700">'+b.name+' '+(lvl?'Mk.'+lvl:'')+'</div><div class="tiny muted" style="margin:5px 0">'+b.desc+'</div><div class="tiny">+'+(b.rate*mult()*Math.max(1,lvl)).toFixed(2)+' '+b.res+'/s '+(lvl?'current':'when built')+'</div><button data-build="'+b.id+'" '+(!ok||!canPay(c)?'disabled':'')+' style="width:100%;margin-top:9px">'+(lvl?'Build upgrade':'Construct')+'</button><div class="tiny muted" style="margin-top:5px">'+(lvl?'Next: ':'Cost: ')+costHTML(c)+'</div><div class="tiny muted">'+(ok?'Tech ready':'Requires '+b.tech)+'</div></div>'}).join('')+'</div>');
 h+=section('Research — every unlock is deliberate', '<div class="research">'+TECH.map(t=>'<div class="card"><div style="font-weight:700">'+t.name+'</div><div class="tiny muted" style="margin:5px 0">'+t.text+'</div><div class="tiny">Cost: '+costHTML(t.cost)+'</div><button data-tech="'+t.id+'" '+(hasTech(t.id)||!reqMet(t)||!canPay(t.cost)||(t.id==='omega'&&s.era<5)?'disabled':'')+' style="width:100%;margin-top:9px">'+(hasTech(t.id)?'✓ Mastered':'Research')+'</button><div class="tiny muted" style="margin-top:5px">'+(t.req.length?'Requires: '+t.req.join(', '):'Foundation technology')+'</div></div>').join('')+'</div>');
 const p=PROJECT.find(x=>x.era===s.era);
 h+=section('Civilization Ascension', p?'<div><div style="font-size:20px;font-weight:700">'+p.name+'</div><div class="muted" style="margin:5px 0">'+p.text+'</div><div class="tiny">Requirements: '+p.req.join(', ')+' · Cost: '+costHTML(p.cost)+'</div><button data-project '+(!p.req.every(hasTech)||s.projects[p.era]||!canPay(p.cost)?'disabled':'')+' style="margin-top:10px">'+(s.projects[p.era]?'Complete':'Begin Ascension Project')+'</button></div>':'<div class="muted">Omega is the terminal stage of the designed campaign. The endgame is intentionally a long optimization and civilization-management phase.</div>');
 h+=section('Campaign Pacing', '<div class="grid">'+ERA.map(e=>'<div class="card" style="opacity:'+((ERA.indexOf(e)<=s.era)?1:.45)+'"><div class="tiny muted">'+e[0]+'</div><div style="font-weight:700">'+e[1]+'</div><div class="tiny muted">'+e[2]+'</div></div>').join('')+'</div><p class="tiny muted">Target first-run active play: roughly 12–17 hours. Era ascensions are gated by prerequisite technologies, production infrastructure, escalating resource thresholds, and dedicated multi-resource ascension projects.</p>');
 h+=section('Chronicle', '<div class="mono">'+(s.log.length?s.log.map(x=>'<div>'+x+'</div>').join(''):'The first settlement has not yet written history.')+'</div>');
 h+='<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px"><button data-pause>'+ (s.paused?'Resume':'Pause') +'</button><button data-reset>Reset Civilization</button></div>';
 app.innerHTML=h;
 app.querySelectorAll('[data-man]').forEach(b=>b.onclick=()=>manual(b.dataset.man,1));
 app.querySelectorAll('[data-build]').forEach(b=>b.onclick=()=>build(BUILD.find(x=>x.id===b.dataset.build)));
 app.querySelectorAll('[data-tech]').forEach(b=>b.onclick=()=>buyTech(TECH.find(x=>x.id===b.dataset.tech)));
 const pr=app.querySelector('[data-project]');if(pr)pr.onclick=()=>project(PROJECT.find(x=>x.era===s.era));
 app.querySelector('[data-story]').onclick=story;
 app.querySelector('[data-pause]').onclick=()=>{s.paused=!s.paused;render()};
 app.querySelector('[data-reset]').onclick=()=>location.reload();
}
setInterval(()=>{tick(.25);render()},250);
render();
