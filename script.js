// Splash screen
const splashBar = document.getElementById('sp-bar');
let sp = 0;
const stk = setInterval(()=>{ sp = Math.min(100, sp + (sp<70?4:sp<90?1.5:0.4)); splashBar.style.width=sp+'%'; if(sp>=100) clearInterval(stk); }, 40);

window.addEventListener('load', ()=>{
  clearInterval(stk); splashBar.style.width='100%';
  setTimeout(()=>{
    document.getElementById('splash').classList.add('out');
    document.getElementById('header').classList.add('in');
    document.getElementById('sw').classList.add('in');
    document.getElementById('status-msg').classList.add('in');
  }, 700);
});

// Live clock
setInterval(()=>{ document.getElementById('hclock').textContent=new Date().toTimeString().slice(0,8); }, 1000);

// App configuration
const OWM_KEY = 'e243d452751bdd6c4dbabad28b95ca2f ';
const OWM = 'https://api.openweathermap.org/data/2.5';
let unit='metric', lastLat=null, lastLon=null;

// Weather themes/
const SKY = {
  // id range → theme
  clear_day:   { stops:['#0a2a6e','#1a5fbf','#3b8fff','#6ab4ff'], orbs:['rgba(30,100,255,0.35)','rgba(100,200,255,0.25)','rgba(255,220,100,0.15)'], particles:'sunrays', mood:'☀️ Clear & Sunny' },
  clear_night: { stops:['#010510','#050d24','#0a1540','#0d1e52'], orbs:['rgba(20,30,100,0.5)','rgba(10,20,80,0.4)','rgba(60,40,120,0.35)'], particles:'stars',   mood:'🌙 Clear Night' },
  clouds_few:  { stops:['#0f2a5e','#1a4a9e','#2e6bbf','#5a8fd0'], orbs:['rgba(30,80,180,0.4)','rgba(100,160,220,0.3)','rgba(50,50,100,0.3)'], particles:'none',    mood:'⛅ Partly Cloudy' },
  clouds_scat: { stops:['#0e2248','#1a3a7a','#2a5299','#4a72b0'], orbs:['rgba(40,70,140,0.45)','rgba(80,120,180,0.35)','rgba(60,60,120,0.3)'],  particles:'none',    mood:'🌤 Scattered Clouds' },
  clouds_over: { stops:['#111520','#1a1e30','#252840','#303550'], orbs:['rgba(50,55,90,0.5)','rgba(70,75,110,0.4)','rgba(40,45,80,0.45)'],        particles:'none',    mood:'☁️ Overcast' },
  drizzle:     { stops:['#0d1a28','#142035','#1c2d48','#253d60'], orbs:['rgba(30,60,100,0.5)','rgba(60,100,140,0.4)','rgba(20,50,90,0.45)'],       particles:'rain',    mood:'🌦 Drizzling' },
  rain:        { stops:['#090f1a','#0d1628','#121e38','#182848'], orbs:['rgba(20,40,90,0.55)','rgba(40,70,120,0.45)','rgba(15,35,80,0.5)'],        particles:'rain',    mood:'🌧 Rainy' },
  heavy_rain:  { stops:['#060a12','#0a1020','#0e1830','#141f40'], orbs:['rgba(15,30,75,0.6)','rgba(30,55,100,0.5)','rgba(10,25,70,0.55)'],         particles:'heavyrain',mood:'⛈ Heavy Rain' },
  thunder:     { stops:['#06080f','#090c18','#0d1225','#12182e'], orbs:['rgba(30,20,80,0.6)','rgba(60,40,120,0.5)','rgba(20,10,70,0.55)'],          particles:'lightning',mood:'⛈ Thunderstorm' },
  snow:        { stops:['#1a2235','#2a3550','#3a4a6a','#4a5e80'], orbs:['rgba(100,120,180,0.35)','rgba(140,160,210,0.3)','rgba(80,100,160,0.35)'], particles:'snow',    mood:'❄️ Snowfall' },
  mist:        { stops:['#151a25','#1e2535','#283045','#323d55'], orbs:['rgba(80,90,120,0.4)','rgba(100,110,140,0.35)','rgba(70,80,110,0.4)'],      particles:'fog',     mood:'🌫 Foggy & Misty' },
  haze:        { stops:['#1e1a10','#2e2816','#3e361e','#4e4428'], orbs:['rgba(120,100,40,0.35)','rgba(160,130,50,0.3)','rgba(100,80,30,0.35)'],    particles:'none',    mood:'🌫 Hazy' },
  sand:        { stops:['#1e1008','#30180a','#42220e','#543018'], orbs:['rgba(140,80,20,0.45)','rgba(180,110,30,0.35)','rgba(120,60,15,0.4)'],      particles:'none',    mood:'🌪 Sandy / Dusty' },
};

function getTheme(owmId, pod){
  if(owmId>=200&&owmId<300) return SKY.thunder;
  if(owmId>=300&&owmId<400) return SKY.drizzle;
  if(owmId>=500&&owmId<503) return SKY.rain;
  if(owmId>=503&&owmId<600) return SKY.heavy_rain;
  if(owmId>=600&&owmId<700) return SKY.snow;
  if(owmId===701||owmId===741) return SKY.mist;
  if(owmId===721) return SKY.haze;
  if(owmId===731||owmId===761||owmId===762) return SKY.sand;
  if(owmId>=700&&owmId<800) return SKY.mist;
  if(owmId===800) return pod==='n'?SKY.clear_night:SKY.clear_day;
  if(owmId===801) return pod==='n'?SKY.clouds_few:SKY.clouds_few;
  if(owmId===802) return SKY.clouds_scat;
  if(owmId>=803) return SKY.clouds_over;
  return SKY.clear_day;
}

// Sky background rendering
const skyC = document.getElementById('sky-canvas');
const skyX = skyC.getContext('2d');
let skyTheme = SKY.clear_night;
let currentOrbs = [
  {x:0.1,y:0.1,r:0.5,vx:0.0002,vy:0.00015},
  {x:0.85,y:0.8,r:0.45,vx:-0.00015,vy:-0.0002},
  {x:0.5,y:0.45,r:0.35,vx:0.0001,vy:0.00018}
];
// lerp targets for smooth color transitions
let fromStops = [...SKY.clear_night.stops];
let toStops   = [...SKY.clear_night.stops];
let fromOrbs  = [...SKY.clear_night.orbs];
let toOrbs    = [...SKY.clear_night.orbs];
let lerpT = 1;

function lerpColor(a, b, t){
  // parse rgba strings and lerp
  const pa = parseRGBA(a), pb = parseRGBA(b);
  const r=pa.r+(pb.r-pa.r)*t, g=pa.g+(pb.g-pa.g)*t, bl=pa.b+(pb.b-pa.b)*t, al=pa.a+(pb.a-pa.a)*t;
  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(bl)},${al.toFixed(3)})`;
}
function parseRGBA(s){
  const m=s.match(/[\d.]+/g)||['0','0','0','1'];
  // handle hex too
  if(s.startsWith('#')){
    const h=s.slice(1);
    return{r:parseInt(h.slice(0,2),16),g:parseInt(h.slice(2,4),16),b:parseInt(h.slice(4,6),16),a:1};
  }
  return{r:+m[0],g:+m[1],b:+m[2],a:+(m[3]??1)};
}

function resizeSky(){
  skyC.width=window.innerWidth; skyC.height=window.innerHeight;
  const pc=document.getElementById('particle-canvas');
  pc.width=window.innerWidth; pc.height=window.innerHeight;
}
window.addEventListener('resize',resizeSky); resizeSky();

function setSkyTheme(theme){
  fromStops=[...toStops];
  fromOrbs=[...toOrbs];
  toStops=[...theme.stops];
  toOrbs=[...theme.orbs];
  lerpT=0;
  skyTheme=theme;
  // mood badge
  const mb=document.getElementById('mood-badge');
  mb.textContent=theme.mood;
  mb.classList.add('show');
}

function drawSky(t){
  const w=skyC.width, h=skyC.height;
  const lt=Math.min(1,lerpT);

  // lerp gradient stops
  const stops=fromStops.map((s,i)=>lerpColor(s,toStops[i],lt));

  // vertical gradient base
  const grad=skyX.createLinearGradient(0,0,0,h);
  grad.addColorStop(0,   stops[0]);
  grad.addColorStop(0.4, stops[1]);
  grad.addColorStop(0.75,stops[2]);
  grad.addColorStop(1,   stops[3]);
  skyX.fillStyle=grad;
  skyX.fillRect(0,0,w,h);

  // animated orbs (volumetric light / cloud blobs)
  const orbCols=fromOrbs.map((s,i)=>lerpColor(s,toOrbs[i],lt));
  currentOrbs.forEach((o,i)=>{
    o.x+=o.vx; o.y+=o.vy;
    if(o.x<-0.3||o.x>1.3) o.vx*=-1;
    if(o.y<-0.3||o.y>1.3) o.vy*=-1;
    const rx=o.r*Math.max(w,h), ry=o.r*0.7*Math.max(w,h);
    const grd=skyX.createRadialGradient(o.x*w,o.y*h,0,o.x*w,o.y*h,rx);
    grd.addColorStop(0,  orbCols[i]);
    grd.addColorStop(1,  'transparent');
    skyX.save();
    skyX.scale(1,ry/rx);
    skyX.fillStyle=grd;
    skyX.beginPath();
    skyX.arc(o.x*w,(o.y*h)*(rx/ry),rx,0,Math.PI*2);
    skyX.fill();
    skyX.restore();
  });

  if(lerpT<1) lerpT+=0.008;
}

// Particle effects
const pC = document.getElementById('particle-canvas');
const pX = pC.getContext('2d');
let particles=[], pMode='none', pRunning=false;

class Particle{
  constructor(mode){
    this.mode=mode;
    this.reset();
  }
  reset(){
    const w=pC.width,h=pC.height;
    if(this.mode==='rain'||this.mode==='heavyrain'){
      this.x=Math.random()*w*1.3-w*0.15;
      this.y=Math.random()*h*0.5-20;
      this.len=this.mode==='heavyrain'?Math.random()*20+12:Math.random()*12+6;
      this.speed=this.mode==='heavyrain'?Math.random()*8+10:Math.random()*5+5;
      this.a=Math.random()*0.35+0.15;
      this.angle=Math.PI*0.08;
    } else if(this.mode==='snow'){
      this.x=Math.random()*w;
      this.y=Math.random()*h*0.3-20;
      this.r=Math.random()*3+1;
      this.speed=Math.random()*1.2+0.3;
      this.drift=Math.random()*0.6-0.3;
      this.a=Math.random()*0.6+0.3;
      this.t=Math.random()*Math.PI*2;
    } else if(this.mode==='stars'){
      this.x=Math.random()*pC.width;
      this.y=Math.random()*pC.height*0.85;
      this.r=Math.random()*1.2+0.2;
      this.a=Math.random()*0.7+0.1;
      this.twinkle=Math.random()*0.02+0.005;
      this.phase=Math.random()*Math.PI*2;
    } else if(this.mode==='sunrays'){
      this.x=Math.random()*pC.width;
      this.y=-10;
      this.h=Math.random()*pC.height*0.6+pC.height*0.2;
      this.w=Math.random()*3+0.5;
      this.a=Math.random()*0.04+0.01;
      this.speed=0;
    } else if(this.mode==='fog'){
      this.x=Math.random()*pC.width;
      this.y=Math.random()*pC.height;
      this.r=Math.random()*120+60;
      this.a=Math.random()*0.05+0.01;
      this.dx=Math.random()*0.3-0.15;
    } else if(this.mode==='lightning'){
      this.active=false;
      this.timer=Math.random()*200+50;
      this.flash=0;
    }
  }
  update(){
    const w=pC.width,h=pC.height;
    if(this.mode==='rain'||this.mode==='heavyrain'){
      this.x+=Math.sin(this.angle)*this.speed*0.3;
      this.y+=this.speed;
      if(this.y>h+20) this.reset();
    } else if(this.mode==='snow'){
      this.t+=0.02;
      this.x+=Math.sin(this.t)*this.drift;
      this.y+=this.speed;
      if(this.y>h+10) this.reset();
    } else if(this.mode==='stars'){
      this.phase+=this.twinkle;
      this.ca=this.a*(0.6+0.4*Math.sin(this.phase));
    } else if(this.mode==='sunrays'){
      // static, just shimmer alpha
      this.ca=(this.a||0.02)*(0.5+0.5*Math.sin(Date.now()*0.0007+(this.x||0)*0.01));
    } else if(this.mode==='fog'){
      this.x+=this.dx;
      if(this.x>w+this.r) this.x=-this.r;
      if(this.x<-this.r) this.x=w+this.r;
    } else if(this.mode==='lightning'){
      this.timer--;
      if(this.timer<=0&&!this.active){ this.active=true; this.flash=1; }
      if(this.active){ this.flash-=0.06; if(this.flash<=0){ this.active=false; this.timer=Math.random()*300+80; } }
    }
  }
  draw(){
    if(this.mode==='rain'||this.mode==='heavyrain'){
      pX.save();pX.strokeStyle=`rgba(180,210,255,${this.a})`;pX.lineWidth=this.mode==='heavyrain'?1:0.7;
      pX.beginPath();pX.moveTo(this.x,this.y);
      pX.lineTo(this.x+Math.sin(this.angle)*this.len,this.y+this.len);
      pX.stroke();pX.restore();
    } else if(this.mode==='snow'){
      pX.save();pX.fillStyle=`rgba(220,235,255,${this.a})`;
      pX.beginPath();pX.arc(this.x,this.y,this.r,0,Math.PI*2);pX.fill();pX.restore();
    } else if(this.mode==='stars'){
      pX.save();pX.fillStyle=`rgba(220,230,255,${this.ca||this.a})`;
      pX.beginPath();pX.arc(this.x,this.y,this.r,0,Math.PI*2);pX.fill();pX.restore();
    } else if(this.mode==='sunrays'){
      const grd=pX.createLinearGradient(this.x,0,this.x,this.h);
      grd.addColorStop(0,`rgba(255,240,180,${this.ca||0.02})`);
      grd.addColorStop(1,'transparent');
      pX.save();pX.fillStyle=grd;pX.fillRect(this.x,0,this.w,this.h);pX.restore();
    } else if(this.mode==='fog'){
      const grd=pX.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r);
      grd.addColorStop(0,`rgba(180,190,210,${this.a})`);grd.addColorStop(1,'transparent');
      pX.save();pX.fillStyle=grd;pX.beginPath();pX.arc(this.x,this.y,this.r,0,Math.PI*2);pX.fill();pX.restore();
    } else if(this.mode==='lightning'&&this.active){
      pX.save();pX.fillStyle=`rgba(200,220,255,${this.flash*0.12})`;
      pX.fillRect(0,0,pC.width,pC.height);pX.restore();
    }
  }
}

function initParticles(mode){
  pMode=mode;
  if(mode==='none'){ particles=[]; document.getElementById('particle-canvas').classList.remove('show'); return; }
  const counts={rain:120,heavyrain:200,snow:80,stars:120,sunrays:18,fog:12,lightning:1};
  const n=counts[mode]||0;
  particles=Array.from({length:n},()=>new Particle(mode));
  document.getElementById('particle-canvas').classList.add('show');
}

// Animation loop
function loop(t){
  requestAnimationFrame(loop);
  // sky
  skyX.clearRect(0,0,skyC.width,skyC.height);
  drawSky(t);
  // particles
  pX.clearRect(0,0,pC.width,pC.height);
  particles.forEach(p=>{ p.update(); p.draw(); });
}
requestAnimationFrame(loop);

// Temperature unit toggle

function setUnit(u){
  unit=u;
  document.getElementById('btn-c').classList.toggle('on',u==='metric');
  document.getElementById('btn-f').classList.toggle('on',u==='imperial');
  if(lastLat!==null) fetchCoords(lastLat,lastLon);
}

// Search and geolocation
document.getElementById('city-input').addEventListener('keydown',e=>{if(e.key==='Enter')doSearch();});

async function doSearch(){
  const q=document.getElementById('city-input').value.trim();
  if(!q){setStatus('Please enter a city name.');return;}
  showSkel(true); setStatus('');
  try{
    const r=await fetch(`${OWM}/weather?q=${encodeURIComponent(q)}&units=${unit}&appid=${OWM_KEY}`);
    if(!r.ok){
      const d=await r.json().catch(()=>({}));
      setStatus(r.status===401?'Invalid API key. Check your OWM key.':r.status===404?'City not found.':'API error '+r.status);
      showSkel(false); return;
    }
    const d=await r.json();
    lastLat=d.coord.lat; lastLon=d.coord.lon;
    await renderFromCurrent(d);
  }catch(e){ setStatus('Network error — check connection.'); showSkel(false); }
}

async function geoLocate(){
  if(!navigator.geolocation){setStatus('Geolocation not supported.');return;}
  setStatus('Locating…',true);
  navigator.geolocation.getCurrentPosition(async pos=>{
    lastLat=pos.coords.latitude; lastLon=pos.coords.longitude;
    showSkel(true);
    await fetchCoords(lastLat,lastLon);
  },()=>setStatus('Location access denied.'));
}

async function fetchCoords(lat,lon){
  showSkel(true);
  try{
    const r=await fetch(`${OWM}/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${OWM_KEY}`);
    if(!r.ok){const e=await r.json().catch(()=>({}));setStatus('Error '+r.status);showSkel(false);return;}
    await renderFromCurrent(await r.json());
  }catch(e){setStatus('Network error.');showSkel(false);}
}

// Weather data rendering
const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function owmIcon(id,pod){
  if(id>=200&&id<300) return '⛈';
  if(id>=300&&id<400) return '🌦';
  if(id>=500&&id<503) return '🌧';
  if(id>=503&&id<600) return '⛈';
  if(id>=600&&id<700) return '❄️';
  if(id===800) return pod==='n'?'🌙':'☀️';
  if(id===801) return pod==='n'?'🌙':'🌤';
  if(id===802) return '⛅';
  if(id>=803) return '☁️';
  if(id>=700) return '🌫';
  return '🌤';
}
function windDir(d){return['N','NE','E','SE','S','SW','W','NW'][Math.round(d/45)%8];}
function uvInfo(v){
  if(v<=2)  return{lbl:'Low',c:'#60a5fa',bg:'rgba(96,165,250,0.15)'};
  if(v<=5)  return{lbl:'Moderate',c:'#64ffda',bg:'rgba(100,255,218,0.15)'};
  if(v<=7)  return{lbl:'High',c:'#fbbf24',bg:'rgba(251,191,36,0.15)'};
  if(v<=10) return{lbl:'Very High',c:'#f97316',bg:'rgba(249,115,22,0.15)'};
  return         {lbl:'Extreme',c:'#f87171',bg:'rgba(248,113,113,0.15)'};
}
function ts(t){return Math.round(t)+(unit==='metric'?'°C':'°F');}

async function renderFromCurrent(cur){
  const lat=cur.coord.lat, lon=cur.coord.lon;
  const weather=cur.weather[0];
  const pod=weather.icon.endsWith('n')?'n':'d';

  // ── ACTIVATE SKY THEME ──
  const theme=getTheme(weather.id,pod);
  setSkyTheme(theme);
  initParticles(theme.particles);

  // ── HERO ──
  document.getElementById('d-city').textContent=cur.name;
  const cityEl = document.getElementById('d-city');
const cityLength = cur.name.length;

if (cityLength <= 10) {
    cityEl.style.fontSize = 'clamp(30px,5.5vw,60px)';
}
else if (cityLength <= 15) {
    cityEl.style.fontSize = 'clamp(26px,4.5vw,48px)';
}
else if (cityLength <= 20) {
    cityEl.style.fontSize = 'clamp(22px,4vw,40px)';
}
else {
    cityEl.style.fontSize = 'clamp(18px,3.5vw,32px)';
}
  document.getElementById('d-country').textContent=cur.sys.country||'';
  document.getElementById('d-badge').textContent=owmIcon(weather.id,pod)+' '+weather.description.replace(/\b\w/g,c=>c.toUpperCase());
  document.getElementById('d-icon').textContent=owmIcon(weather.id,pod);
  document.getElementById('d-lat').textContent=lat.toFixed(3)+'°';
  document.getElementById('d-lon').textContent=lon.toFixed(3)+'°';
  document.getElementById('d-upd').textContent=new Date().toTimeString().slice(0,8);
  document.getElementById('d-temp').textContent=ts(cur.main.temp);
  document.getElementById('d-feels').textContent=ts(cur.main.feels_like);
  document.getElementById('d-hi').textContent=ts(cur.main.temp_max);
  document.getElementById('d-lo').textContent=ts(cur.main.temp_min);
  document.getElementById('coord-foot').textContent=`${lat.toFixed(4)}, ${lon.toFixed(4)}`;

  // ── STATS ──
  const hum=cur.main.humidity;
  document.getElementById('d-hum').textContent=hum;
  document.getElementById('b-hum').style.width=hum+'%';

  const ws=unit==='imperial'?Math.round(cur.wind.speed):Math.round(cur.wind.speed*3.6);
  document.getElementById('d-wind').textContent=ws;
  document.getElementById('d-wu').textContent=unit==='imperial'?'mph':'km/h';
  document.getElementById('d-wdir').textContent=windDir(cur.wind.deg||0);
  document.getElementById('b-wind').style.width=Math.min(100,(ws/(unit==='imperial'?80:130))*100)+'%';

  const vis=((cur.visibility||0)/1000).toFixed(1);
  document.getElementById('d-vis').textContent=vis;
  document.getElementById('b-vis').style.width=Math.min(100,(parseFloat(vis)/20)*100)+'%';

  document.getElementById('d-pres').textContent=cur.main.pressure;
  const cloud=cur.clouds.all;
  document.getElementById('d-cloud').textContent=cloud;
  document.getElementById('b-cloud').style.width=cloud+'%';

  const dew=unit==='imperial'
    ?Math.round(cur.main.temp-(100-hum)/9*5)
    :Math.round(cur.main.temp-(100-hum)/5);
  document.getElementById('d-dew').textContent=dew;
  document.getElementById('d-deu').textContent=unit==='imperial'?'°F':'°C';

  // ── SUN ──
  const tz=cur.timezone;
  const fmt=u=>new Date((u+tz)*1000).toISOString().slice(11,16);
  document.getElementById('d-rise').textContent=fmt(cur.sys.sunrise);
  document.getElementById('d-set').textContent=fmt(cur.sys.sunset);
  document.getElementById('d-precip').textContent=cur.rain?(cur.rain['1h']||cur.rain['3h']||0).toFixed(1)+' mm/h':'0.0 mm/h';

  // ── UV (free endpoint) ──
  let uvR=0;
  try{
    const uvRes=await fetch(`${OWM}/uvi?lat=${lat}&lon=${lon}&appid=${OWM_KEY}`);
    if(uvRes.ok){const ud=await uvRes.json();uvR=Math.round(ud.value||0);}
  }catch(e){}
  const ui=uvInfo(uvR);
  document.getElementById('d-uv').textContent=uvR;
  const pill=document.getElementById('d-uvp');
  pill.textContent=ui.lbl;
  pill.style.cssText=`background:${ui.bg};color:${ui.c};border:1px solid ${ui.c}44;`;
  document.getElementById('uv-thumb').style.left=Math.min(95,(uvR/11)*100)+'%';

  // ── FORECAST ──
  const grid=document.getElementById('fc-grid');
  grid.innerHTML='';
  try{
    const fr=await fetch(`${OWM}/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${OWM_KEY}`);
    if(fr.ok){
      const fd=await fr.json();
      const byDay={};
      for(const item of fd.list){
        const key=item.dt_txt.slice(0,10);
        if(!byDay[key]) byDay[key]={hi:-999,lo:999,ids:[],pods:[],pops:[]};
        byDay[key].hi=Math.max(byDay[key].hi,item.main.temp_max||item.main.temp);
        byDay[key].lo=Math.min(byDay[key].lo,item.main.temp_min||item.main.temp);
        byDay[key].ids.push(item.weather[0].id);
        byDay[key].pods.push(item.weather[0].icon.endsWith('n')?'n':'d');
        byDay[key].pops.push(Math.round((item.pop||0)*100));
      }
      Object.keys(byDay).slice(0,5).forEach((k,i)=>{
        const day=byDay[k];
        const mid=Math.floor(day.ids.length/2);
        const icon=owmIcon(day.ids[mid],day.pods[mid]);
        const pop=Math.round(day.pops.reduce((a,b)=>a+b,0)/day.pops.length);
        const dt=new Date(k+'T12:00:00');
        const isToday=i===0;
        const card=document.createElement('div');
        card.className='fc'+(isToday?' today':'');
        card.style.cssText=`opacity:0;transform:translateY(18px) scale(0.95);transition:all 0.35s ${0.06*i+0.08}s cubic-bezier(0.34,1.56,0.64,1);`;
        card.innerHTML=`<div class="fc-day">${isToday?'Today':DAYS[dt.getDay()]}</div><span class="fc-icon">${icon}</span><div class="fc-hi">${ts(day.hi)}</div><div class="fc-lo">${ts(day.lo)}</div>${pop>0?`<div class="fc-pop">💧 ${pop}%</div>`:''}`;
        grid.appendChild(card);
        requestAnimationFrame(()=>requestAnimationFrame(()=>{card.style.opacity='1';card.style.transform='none';}));
      });
    }
  }catch(e){}

  setStatus('Weather loaded',true);
  showSkel(false);
}

// UI
function setStatus(msg,ok=false){
  const el=document.getElementById('status-msg');
  el.textContent=msg?'> '+msg:'';
  el.className='in'+(ok?' ok':'');
}
function showSkel(show){
  document.getElementById('skeleton').classList.toggle('show',show);
  if(show){
    document.getElementById('wx').classList.remove('show');
  } else if(lastLat!==null){
    document.getElementById('wx').classList.add('show');
    document.querySelectorAll('#wx > *').forEach((el,i)=>{
      el.style.transitionDelay=(i*0.07)+'s';
      requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add('revealed')));
    });
  }
}