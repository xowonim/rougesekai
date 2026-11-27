/* =====================================================================
   능력치 / 저장 / 유틸
   ===================================================================== */
const BASE={4:{hp:90,atk:22,def:12,spd:10},5:{hp:110,atk:26,def:14,spd:11},6:{hp:140,atk:32,def:18,spd:12}};
const ROLE={a:{hp:.92,atk:1.15,def:.95,spd:1},t:{hp:1.2,atk:.92,def:1.2,spd:.9},s:{hp:1,atk:1,def:1,spd:1.25},u:{hp:1.05,atk:.9,def:1.05,spd:1},m:{hp:1,atk:1,def:1,spd:1}};
function calcStats(ch,lv,bt){const b=BASE[ch.star],r=ROLE[ch.role],g=(1+.07*(lv-1))*(1+.08*(bt||0));
 return{hp:Math.round(b.hp*r.hp*g),atk:Math.round(b.atk*r.atk*g),def:Math.round(b.def*r.def*g),spd:Math.round(b.spd*r.spd*(1+.02*(lv-1)))}}
const expNeed=lv=>20+lv*6;
const skNeed=lv=>30+lv*25;
const skMul=lv=>1+.02*((lv||1)-1);
const BOOK={
 ls:{n:'수련의 서 소',x:100},lm:{n:'수련의 서 중',x:350},ll:{n:'수련의 서 대',x:1000},
 ss:{n:'오행의 기운 소',x:30},sm:{n:'오행의 기운 중',x:100},sl:{n:'오행의 기운 대',x:300}};
const SZ={s:'소',m:'중',l:'대'};
/* MP: 전투가 끝나도 유지된다. 자동 회복 없음. 기술을 쓰면 줄고, 기본 공격(①번)으로 조금씩 채운다 */
const MP_BASE=100,MP_WIN=25,MP_CARD=40;
function mpCost(s,i){if(s.mp!==undefined)return s.mp;if(i<0)return 0;if(i===0&&s.t==='a')return 0;
 if(s.t==='a')return s.p<50?8:s.p<70?12:s.p<100?16:24;if(s.t==='h')return 14;return 10}
/* 돌파: 매 단계 능력치 +8%, 단계별 추가 효과 */
const BT_X=['','최대 MP +10','스킬 위력 +5%','기본 공격 MP +3','스킬 위력 +5%','최대 MP +10 · 기본 공격 MP +2'];
function btFx(bt){bt=bt||0;return{pow:1+(bt>=3?.05:0)+(bt>=5?.05:0),max:MP_BASE+(bt>=2?10:0)+(bt>=6?10:0),gain:20+(bt>=4?3:0)+(bt>=6?2:0)}}

const KEY='kamisekai_rogue_v2';
let S;
const newChar=()=>({lv:1,exp:0,bt:0,sk:[]});
function ensureChar(id){const o=S.chars[id],c=CHM[id];if(!o||!c)return;
 if(!Array.isArray(o.sk))o.sk=[];
 while(o.sk.length<c.sk.length)o.sk.push({lv:1,exp:0});
 o.lv=Math.min(o.lv||1,CFG.LV_MAX);o.sk.forEach(k=>{k.lv=Math.min(k.lv||1,CFG.SK_MAX)})}
function freshSave(){return{coin:CFG.START_COIN,ap:0,chars:{luihu:newChar(),cheonryong:newChar()},
 mats:{ls:3,lm:0,ll:0,ss:3,sm:0,sl:0},best:0,runs:0,party:['luihu','cheonryong'],sfx:true}}
function normalize(){
 const f=freshSave();for(const k in f)if(S[k]===undefined)S[k]=f[k];
 for(const k in f.mats)if(S.mats[k]===undefined)S.mats[k]=0;
 for(const id in S.chars){if(!CHM[id])delete S.chars[id];else ensureChar(id)}
 S.party=S.party.filter(id=>S.chars[id])}
function load(){try{const r=localStorage.getItem(KEY);S=r?JSON.parse(r):freshSave()}catch(e){S=freshSave()}normalize()}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}

const rnd=a=>a[Math.floor(Math.random()*a.length)];
const $=id=>document.getElementById(id);
function josa(w,p){const c=w.charCodeAt(w.length-1);const has=c>=0xAC00&&c<=0xD7A3&&((c-0xAC00)%28)!==0;const[a,b]=p.split('/');return w+(has?a:b)}
const rank=n=>`<b class="rk">★${n}</b>`;
/* 이미지: chars/icon(아이콘) · chars/full(아카이브 전신) · chars/battle(전투) / <id>.png */
const IMG=(dir,ch)=>`<img src="chars/${dir}/${ch.id}.png" alt="" onerror="this.remove()">`;
const imgTag=ch=>IMG('icon',ch);
/* 효과음: 파일 없이 합성 (컴프레서 + 에코) */
let AC=null,MB=null;
function ac(){try{if(!S||!S.sfx)return null;
 if(!AC){AC=new (window.AudioContext||window.webkitAudioContext)();
  const comp=AC.createDynamicsCompressor();comp.threshold.value=-16;comp.ratio.value=5;comp.connect(AC.destination);
  const dl=AC.createDelay(.6);dl.delayTime.value=.16;const fb=AC.createGain();fb.gain.value=.3;const wet=AC.createGain();wet.gain.value=.3;
  dl.connect(fb);fb.connect(dl);dl.connect(wet);wet.connect(comp);MB={dry:comp,echo:dl}}
 if(AC.state==='suspended')AC.resume();return AC}catch(e){return null}}
function tone(f,d,type,v,to,at,o){const c=ac();if(!c)return;o=o||{};
 try{const t=c.currentTime+(at||0),osc=c.createOscillator(),g=c.createGain();osc.type=type||'sine';osc.frequency.setValueAtTime(f,t);if(to)osc.frequency.exponentialRampToValueAtTime(to,t+d);
  let out=g;if(o.lp){const lf=c.createBiquadFilter();lf.type='lowpass';lf.frequency.setValueAtTime(o.lp,t);if(o.lp2)lf.frequency.exponentialRampToValueAtTime(o.lp2,t+d);g.connect(lf);out=lf}
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v||.1,t+(o.a||.004));g.gain.exponentialRampToValueAtTime(.0001,t+d);
  osc.connect(g);out.connect(MB.dry);if(o.echo)out.connect(MB.echo);
  if(o.vib){const l=c.createOscillator(),lg=c.createGain();l.frequency.value=o.vib[0];lg.gain.value=o.vib[1];l.connect(lg);lg.connect(osc.frequency);l.start(t);l.stop(t+d+.05)}
  osc.start(t);osc.stop(t+d+.05)}catch(e){}}
function noise(d,v,f0,f1,at,type,q,o){const c=ac();if(!c)return;o=o||{};
 try{const n=Math.floor(c.sampleRate*d),b=c.createBuffer(1,n,c.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=Math.random()*2-1;
  const t=c.currentTime+(at||0),src=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();src.buffer=b;f.type=type||'bandpass';f.Q.value=q||1;f.frequency.setValueAtTime(f0,t);if(f1)f.frequency.exponentialRampToValueAtTime(f1,t+d);
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+(o.a||.004));g.gain.exponentialRampToValueAtTime(.0001,t+d);
  src.connect(f);f.connect(g);g.connect(MB.dry);if(o.echo)g.connect(MB.echo);src.start(t)}catch(e){}}
const rr=(a,b)=>a+Math.random()*(b-a);
const SFX={
 tap:()=>{tone(1300,.05,'triangle',.05,800)},
 cast:()=>{noise(.34,.07,500,3200,0,'bandpass',2);tone(260,.32,'sine',.08,820,0,{echo:1})},
 slash:()=>{noise(.13,.13,2200,7500,0,'bandpass',1.6);noise(.12,.34,2600,420,.06,'lowpass',.7);tone(200,.16,'sine',.22,55,.06)},
 hit:()=>{noise(.1,.34,2400,420,0,'lowpass',.7);tone(190,.15,'sine',.24,55)},
 crit:()=>{noise(.13,.14,2200,8000,0,'bandpass',1.6);noise(.2,.4,3000,300,.05,'lowpass',.7);tone(130,.28,'sine',.3,38,.05);tone(1568,.55,'sine',.05,0,.06,{echo:1});tone(2217,.4,'sine',.035,0,.06)},
 boom:()=>{tone(115,.75,'sine',.38,26);noise(.85,.36,1500,80,0,'lowpass',.8);noise(.4,.2,3200,700,.03,'bandpass',.9);for(let i=0;i<5;i++)noise(.04,.1,rr(2500,5000),0,.12+i*.07,'bandpass',2)},
 zap:()=>{tone(1900,.22,'sawtooth',.07,110,0,{lp:5200});tone(70,.4,'sawtooth',.12,48,.02,{lp:420});noise(.3,.2,6500,2600,0,'highpass',.8);for(let i=0;i<6;i++)tone(rr(300,2100),.028,'square',.06,0,i*.035)},
 miss:()=>noise(.3,.11,3300,700,0,'bandpass',1.2),
 heal:()=>{[523,659,784,1047].forEach((f,i)=>tone(f,.55,'sine',.075,0,i*.09,{echo:1}));tone(2093,.45,'sine',.022,0,.32)},
 up:()=>{tone(392,.36,'triangle',.07,784,0,{echo:1,lp:3200});tone(587,.36,'triangle',.055,1175,.06,{echo:1});[1568,2093].forEach((f,i)=>tone(f,.22,'sine',.035,0,.2+i*.07))},
 down:()=>{tone(440,.55,'sawtooth',.07,100,0,{lp:1800,lp2:180});tone(220,.6,'sine',.12,55,.05);noise(.5,.08,900,140,0,'lowpass')},
 stun:()=>{tone(250,.16,'sine',.32,65);noise(.05,.2,2200,500,0,'lowpass');[[880,.12],[1175,.26],[784,.4]].forEach(([f,t])=>tone(f,.5,'sine',.07,0,t,{echo:1,vib:[7,f*.02]}))},
 ko:()=>{tone(320,.65,'sawtooth',.1,38,0,{lp:1400,lp2:90});noise(.55,.16,1100,90,0,'lowpass')},
 win:()=>{[523,659,784,1047].forEach((f,i)=>{tone(f,.45,'triangle',.08,0,i*.1,{echo:1});tone(f*2,.4,'sine',.025,0,i*.1)})},
 lose:()=>{[392,330,262,196].forEach((f,i)=>tone(f,.5,'triangle',.08,0,i*.2,{lp:1800,lp2:300,echo:1}))},
 pull:()=>{noise(.5,.1,500,5500,0,'bandpass',2);tone(420,.5,'sine',.07,1000,0,{echo:1})},
 rare:()=>{noise(.5,.1,500,6000,0,'bandpass',2);[784,988,1175,1568,1976].forEach((f,i)=>tone(f,.7,'triangle',.07,0,.15+i*.1,{echo:1}));tone(3136,.8,'sine',.03,0,.5,{echo:1})}};
function sfx(k){try{if(SFX[k])SFX[k]()}catch(e){}}
const hpColor=r=>r>.5?'#8fd49b':r>.2?'#e8c870':'#e0705a';

/* 아이콘 */
const TG=`<svg class="ic" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#14161c" stroke="#f2f2f0" stroke-width="4"/><path d="M50 4A46 46 0 0 1 50 96A23 23 0 0 1 50 50A23 23 0 0 0 50 4Z" fill="#f2f2f0"/><circle cx="50" cy="27" r="7" fill="#14161c"/><circle cx="50" cy="73" r="7" fill="#f2f2f0"/></svg>`;
const AP=`<svg class="ic" viewBox="0 0 100 100"><circle cx="50" cy="56" r="38" fill="#f0a24a"/><path d="M50 22C50 40 50 60 50 94" stroke="#c9782c" stroke-width="4" fill="none" opacity=".6"/><path d="M52 20C58 4 76 2 84 8C80 22 64 26 52 20Z" fill="#7fc08a"/></svg>`;
const wallet=()=>`<div class="wallet"><span>${TG}${S.coin.toLocaleString()}</span><span>${AP}${S.ap.toLocaleString()}</span></div>`;

/* 아이콘 (img/skill/<캐릭터id>_<번호>.png, img/item/<키>.png 가 있으면 그 그림으로 대체) */
const SVGP={
 single:'<circle cx="12" cy="12" r="6"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
 area:'<circle cx="12" cy="12" r="2.5"/><circle cx="12" cy="12" r="6.5"/><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.6 4.6l2 2M17.4 17.4l2 2M19.4 4.6l-2 2M6.6 17.4l-2 2"/>',
 evade:'<path d="M3 9h10a3 3 0 1 0-3-3M3 15h14a3 3 0 1 1-3 3M3 12h6"/>',
 heal:'<circle cx="12" cy="12" r="9"/><path d="M12 7v10M7 12h10"/>',
 buff:'<path d="M12 20V5M6 11l6-6 6 6"/>',
 guard:'<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/>',
 debuff:'<path d="M12 4v15M6 13l6 6 6-6"/>',
 stun:'<path d="M12 3a9 9 0 1 0 9 9 6 6 0 1 0-6 6 3 3 0 1 0-3-3"/>',
 shock:'<path d="M13 2L5 14h6l-1 8 8-12h-6z"/>',
 trn:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 11h6M9 14h6M9 17h4"/>',
 gi:'<path d="M12 5L16.7 19.4L4.4 10.5L19.6 10.5L7.3 19.4Z"/><circle cx="12" cy="5" r="1.8"/><circle cx="19.6" cy="10.5" r="1.8"/><circle cx="16.7" cy="19.4" r="1.8"/><circle cx="7.3" cy="19.4" r="1.8"/><circle cx="4.4" cy="10.5" r="1.8"/>'};
const svg=k=>`<svg class="si" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${SVGP[k]}</svg>`;
const skKind=s=>s.t==='a'?(s.sc==='범위'?'area':'single'):s.t==='h'?'heal':s.t==='b'?'buff':s.t==='g'?'guard':s.t==='w'?'debuff':'evade';
const picOver=src=>`<img src="${src}" alt="" onload="this.previousSibling.style.display='none'" onerror="this.remove()">`;
const skIcon=(ch,i,s)=>`<span class="sic">${svg(skKind(s))}${i>=0?picOver(`img/skill/${ch.id}_${i+1}.png`):''}</span>`;
const BOOKSZ={s:.85,m:1,l:1.15};
const BKB='<rect x="9" y="4" width="14" height="24" rx="1" fill="#e2d8bd" stroke="#1a1814" stroke-width="1"/><path d="M12.2 4v24" stroke="#8c3b31" stroke-width=".7"/><path d="M9 8h3.2M9 12.5h3.2M9 17h3.2M9 21.5h3.2M9 26h3.2" stroke="#8c3b31" stroke-width=".9"/><rect x="15" y="7" width="5" height="11" fill="none" stroke="#1a1814" stroke-width=".8"/><path d="M16.7 10h1.6M16.7 12.8h1.6M16.7 15.6h1.6" stroke="#1a1814" stroke-width=".7"/>';
const ELK=['木','火','土','金','水'];
function bkSvg(k){const n={s:1,m:2,l:3}[k[1]]||1;let g='';
 if(k[0]==='l'){const T=n===1?[[0,0,0,1]]:n===2?[[-4,1,-9,.95],[3.5,0,5,.95]]:[[-6,2,-15,.88],[6,1,11,.88],[0,-1,0,.92]];
  g=T.map(t=>`<g transform="translate(${t[0]} ${t[1]}) rotate(${t[2]} 16 16) translate(16 16) scale(${t[3]}) translate(-16 -16)">${BKB}</g>`).join('')}
 else{const P=ELK.map((e,i)=>{const a=(-90+72*i)*Math.PI/180;return[16+10.5*Math.cos(a),16+10.5*Math.sin(a),e]});
  const ln=(a,b)=>`M${P[a][0].toFixed(1)} ${P[a][1].toFixed(1)}L${P[b][0].toFixed(1)} ${P[b][1].toFixed(1)}`;
  g=`<path d="${[0,1,2,3,4].map(i=>ln(i,(i+1)%5)).join('')}" stroke="#f2f2f0" stroke-opacity=".5" stroke-width=".7" fill="none"/>`;
  if(n>=2)g+=`<path d="${[0,1,2,3,4].map(i=>ln(i,(i+2)%5)).join('')}" stroke="#f2f2f0" stroke-opacity=".28" stroke-width=".6" fill="none"/>`;
  if(n>=3)g+=`<circle cx="16" cy="16" r="14.6" fill="none" stroke="#f0e2ae" stroke-opacity=".6" stroke-width=".8"/><circle cx="16" cy="16" r="2" fill="#f0e2ae"/>`;
  g+=P.map(p=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.3" style="fill:var(--${p[2]})" stroke="#0c0d11" stroke-width=".8"/><circle cx="${(p[0]-1).toFixed(1)}" cy="${(p[1]-1).toFixed(1)}" r=".9" fill="#fff" fill-opacity=".65"/>`).join('')}
 return `<svg class="si" viewBox="0 0 32 32">${g}</svg>`}
const bookIcon=k=>`<span class="sic bk" style="--z:${BOOKSZ[k[1]]}">${bkSvg(k)}${picOver('img/item/'+k+'.png')}</span>`;
const stHtml=s=>(s.stun?`<span title="">${svg('stun')}</span>`:'')+(s.shock?`<span>${svg('shock')}</span>`:'')+(s.ev?`<span>${svg('evade')}</span>`:'');

const kindName=s=>s.t==='a'?(s.sc==='범위'?'범위 공격':'단일 공격'):s.t==='w'?'적 변화':'자기 변화';
const statLine=(s,lv)=>{const p=Math.round((s.p||0)*skMul(lv)),acc=s.t==='a'?(s.acc!==undefined?s.acc:95):100;return `위력 ${s.t==='a'?p:'-'} / 명중 ${acc}`};
function skFace(ch,i,s,lv,tag,mp){const c=mp?mpCost(s,i):0;
 return `<div class="sf"><span class="a">${i<0?svg('single'):skIcon(ch,i,s)}</span><span class="c">${s.n}${tag||''}${mp?`<small>MP ${c}</small>`:''}</span><span class="r"><span>${kindName(s)}</span><span>${statLine(s,lv)}</span></span></div>`}

/* =====================================================================
   전투 로직
   ===================================================================== */
let run=null,busy=false,skipFn=null,lastHp={};
function newFighter(ch,lv,bt,side,mult,sl){const s=calcStats(ch,lv,bt);mult=mult||{};const k=mult.all||1,b=btFx(bt);
 const f={ch,lv,side,sl:sl||[],maxhp:Math.round(s.hp*(mult.hp||1)*k),atk:s.atk*(mult.atk||1)*k,def:s.def*(mult.def||1)*k,spd:s.spd,hp:0,pow:b.pow,mpm:b.max,gain:b.gain,mp:b.max};
 f.hp=f.maxhp;resetBattleState(f);return f}
function resetBattleState(f){f.m={atk:0,def:0};f.mT=0;f.d={atk:0,def:0};f.dT=0;f.evade=0;f.stun=0;f.stunImm=0;f.rest=0;f.shock=false;f.shockT=0;f.dot=null}
function st(f,k){let v=f[k];if(f.side==='p'&&run)v*=1+run.buf[k];
 if(k==='atk'||k==='def')v*=Math.max(.4,1+f.m[k]-f.d[k]);return v}
const slv=(f,i)=>(i>=0&&f.sl[i]&&f.sl[i].lv)||1;

function startRun(ids){
 run={wave:1,party:ids.map(id=>{const c=S.chars[id];return newFighter(CHM[id],c.lv,c.bt,'p',null,c.sk)}),active:0,buf:{atk:0,def:0,spd:0},gained:0,won:0,enemy:null,phase:'menu',sub:'cmd',note:''};
 S.runs++;save();nextBattle()}

function makeEnemy(w){
 const m=mapOf(w),boss=w%CFG.MAP_STAGES===0;
 const ch=CHM[boss?m.boss:rnd(m.pool)];
 const lv=1+Math.floor((w-1)*1.1)+(boss?2:0);
 const base=Math.min(1.5,.75+.012*(w-1));
 const e=newFighter(ch,lv,0,'e',boss?{hp:base*1.5,atk:base*1.1,def:base*1.1}:{all:base});
 e.boss=boss;return e}

function nextBattle(){
 const w=run.wave,m=mapOf(w);
 run.enemy=makeEnemy(w);
 run.party.forEach(resetBattleState);
 if(run.party[run.active].hp<=0)run.active=run.party.findIndex(f=>f.hp>0);
 const e=run.enemy;
 run.note=((w-1)%CFG.MAP_STAGES===0?`${m.name}.  `:'')+(e.boss?`${josa(e.ch.name,'이/가')} 모습을 드러냈다.`:`${josa(e.ch.name,'이/가')} 앞을 가로막는다.`);
 run.phase='menu';run.sub='cmd';
 drawBattle()}

function snap(){const P=run.party[run.active],E=run.enemy;
 const fl=f=>({stun:f.stun>0,shock:!!f.shock,ev:f.evade>0});
 return{p:{id:P.ch.id,name:P.ch.name,hp:P.hp,max:P.maxhp,lv:P.lv,mp:P.mp,mpm:P.mpm,st:fl(P)},e:{hp:E.hp,max:E.maxhp,mp:E.mp,mpm:E.mpm,st:fl(E)}}}

function hitCalc(a,d,sk,k){
 const def=st(d,'def')*(1-(sk.ign||0));
 const crit=Math.random()<.06;
 const dmg=sk.p*k*(a.pow||1)*(st(a,'atk')/def)*.34*(.9+Math.random()*.2)*(crit?1.5:1);
 return{dmg:Math.max(1,Math.round(dmg)),crit}}

function perform(a,d,idx,ev){
 const say=(t,o)=>ev.push({t,s:snap(),...o});
 const sk=idx<0?BASIC:a.ch.sk[idx],k=skMul(slv(a,idx)),me=a.side,you=d.side;
 const tx=(side,v,c)=>({side,v,cls:'tx'+(c?' '+c:'')});
 if(a.rest>0){a.rest--;say(`${josa(a.ch.name,'은/는')} 숨을 고른다.`,{pop:tx(me,'휴식')});return}
 if(a.stun>0){
  if(Math.random()<CFG.STUN_WAKE){a.stun=0;a.stunImm=1;say(`${josa(a.ch.name,'은/는')} 정신을 차렸다.`,{pop:tx(me,'기상'),sfx:'up'})}
  else{say(`${josa(a.ch.name,'은/는')} 움직이지 못한다.`,{pop:tx(me,'기절'),fx:{side:me,k:'stun'},sfx:'stun'});return}}
 const cost=mpCost(sk,idx);a.mp=Math.max(0,a.mp-cost);if(cost===0)a.mp=Math.min(a.mpm,a.mp+a.gain);
 say(`${a.ch.name}의 ${sk.n}`,{act:{side:me,n:sk.n,k:skKind(sk)},fx:{side:me,k:'charge',c:EC[a.ch.el]},sfx:'cast',lunge:sk.t==='a'?me:null,d:520});
 if(sk.t==='a'){
  const acc=(sk.acc!==undefined?sk.acc:95)-(a.shock?50:0);
  if(d.evade>0){say(`${josa(d.ch.name,'은/는')} 공격을 피했다.`,{pop:tx(you,'회피'),fx:{side:you,k:'dodge'},sfx:'miss'});return}
  if(Math.random()*100>=acc){say('빗나갔다.',{pop:tx(you,'MISS'),sfx:'miss'});return}
  const h=hitCalc(a,d,sk,k);
  d.hp=Math.max(0,d.hp-h.dmg);
  const area=sk.sc==='범위';
  say(`${d.ch.name}에게 ${h.dmg} 피해`+(h.crit?' · 치명타':''),{pop:{side:you,v:'-'+h.dmg,cls:h.crit?'crit':''},fx:{side:you,k:sk.shock?'zap':area?'ring':'slash',c:EC[a.ch.el],big:h.crit},sfx:h.crit?'crit':area?'boom':sk.shock?'zap':'slash',shake:h.crit||area||h.dmg>=d.maxhp*.25});
  if(sk.drain&&a.hp>0){const g=Math.round(h.dmg*.5);a.hp=Math.min(a.maxhp,a.hp+g);say(`${a.ch.name} HP ${g} 흡수`,{pop:{side:me,v:'+'+g,cls:'heal'},fx:{side:me,k:'heal'},sfx:'heal'})}
  if(sk.recoil&&a.hp>0){const r=Math.round(h.dmg*sk.recoil/100);a.hp=Math.max(0,a.hp-r);say(`${a.ch.name} 반동 ${r}`,{pop:{side:me,v:'-'+r,cls:'dot'},sfx:'hit'})}
  if(d.hp>0&&sk.stun&&d.stun<=0&&(sk.stun>=100||!d.stunImm)&&Math.random()*100<sk.stun){d.stun=1;say(`${josa(d.ch.name,'은/는')} 기절했다.`,{pop:tx(you,'기절'),fx:{side:you,k:'stun'},sfx:'stun'})}
  if(d.hp>0&&sk.shock&&!d.shock){d.shock=true;d.shockT=0;say(`${josa(d.ch.name,'은/는')} 감전되었다.`,{pop:tx(you,'감전'),sfx:'zap'})}
  if(d.hp>0&&sk.dot){d.dot={pct:sk.dot,t:3};say(`${josa(d.ch.name,'은/는')} 지속 피해를 입는다.`,{pop:tx(you,'지속'),fx:{side:you,k:'down',c:'#8a6fb8'},sfx:'down'})}
  if(sk.selfStun&&a.hp>0)a.rest=1;
 }else if(sk.t==='h'){
  const g=Math.round(a.maxhp*sk.p*k/100),before=a.hp;a.hp=Math.min(a.maxhp,a.hp+g);
  a.d={atk:0,def:0};a.dT=0;a.dot=null;
  say(`${a.ch.name} HP ${a.hp-before} 회복`,{pop:{side:me,v:'+'+(a.hp-before),cls:'heal'},fx:{side:me,k:'heal'},sfx:'heal'});
 }else if(sk.t==='b'){a.m.atk=Math.max(a.m.atk,sk.p*k/100);a.mT=3;say(`${a.ch.name} 공격 상승`,{pop:tx(me,'공격 UP'),fx:{side:me,k:'up',c:EC[a.ch.el]},sfx:'up'})}
 else if(sk.t==='g'){a.m.def=Math.max(a.m.def,sk.p*k/100);a.mT=3;say(`${a.ch.name} 방어 상승`,{pop:tx(me,'방어 UP'),fx:{side:me,k:'up',c:'#6fa0dc'},sfx:'up'})}
 else if(sk.t==='w'){d.d.atk=Math.max(d.d.atk,sk.p*k/100);d.d.def=Math.max(d.d.def,sk.p*k/100);d.dT=3;say(`${d.ch.name} 공방 하락`,{pop:tx(you,'공방 DOWN'),fx:{side:you,k:'down',c:'#ad8fd8'},sfx:'down'})}
 else if(sk.t==='z'){a.evade=2;say(`${josa(a.ch.name,'은/는')} 회피 태세에 들어간다.`,{pop:tx(me,'회피 태세'),fx:{side:me,k:'up',c:'#6fa0dc'},sfx:'up'})}
}

function aiPick(e,p){
 const cand=[];
 e.ch.sk.forEach((s,i)=>{
  if(e.mp<mpCost(s,i))return;
  if(s.t==='b'&&e.m.atk>0)return;
  if(s.t==='g'&&e.m.def>0)return;
  if(s.t==='w'&&p.d.atk>0)return;
  if(s.t==='z'&&e.evade>0)return;
  if(s.t==='h'&&e.hp>e.maxhp*.7)return;
  cand.push(i)});
 if(e.hp<e.maxhp*.4){const h=cand.find(i=>e.ch.sk[i].t==='h');if(h!==undefined&&Math.random()<.75)return h}
 if(cand.length&&Math.random()<.7)return rnd(cand);
 return (e.ch.sk[0]&&e.ch.sk[0].t==='a')?0:-1}

function endOfTurn(ev){
 const say=(t,pop)=>ev.push({t,s:snap(),pop});
 [run.party[run.active],run.enemy].forEach(f=>{
  if(f.hp>0&&f.dot){const v=Math.max(1,Math.round(f.maxhp*f.dot.pct/100));f.hp=Math.max(0,f.hp-v);say(`${f.ch.name} 지속 피해 ${v}`,{pop:{side:f.side,v:'-'+v,cls:'dot'},sfx:'hit'});f.dot.t--;if(f.dot.t<=0)f.dot=null}
  if(f.mT>0&&--f.mT<=0)f.m={atk:0,def:0};
  if(f.dT>0&&--f.dT<=0)f.d={atk:0,def:0};
  if(f.evade>0)f.evade--;
  if(f.stunImm>0)f.stunImm--;
  if(f.hp>0&&f.shock){if(f.shockT>=1&&Math.random()<CFG.SHOCK_FREE){f.shock=false;say(`${josa(f.ch.name,'은/는')} 감전에서 풀렸다.`,{pop:{side:f.side,v:'해제',cls:'tx'},sfx:'up'})}f.shockT++}
 })}

function doTurn(action){
 const ev=[];const P=()=>run.party[run.active],E=run.enemy;
 const say=(t,o)=>ev.push({t,s:snap(),...o});
 let order;
 if(action.type==='switch'){
  const old=P();run.active=action.to;
  say(`${old.ch.name}, 교대. ${P().ch.name}`,{sfx:'tap'});
  order=['e'];
 }else{
  const ps=st(P(),'spd'),es=st(E,'spd');
  order=(ps>es||(ps===es&&Math.random()<.5))?['p','e']:['e','p'];
  if(P().shock&&!E.shock)order=['e','p'];
  else if(E.shock&&!P().shock)order=['p','e'];
 }
 let result='cont';
 for(const who of order){
  if(P().hp<=0||E.hp<=0)break;
  if(who==='p')perform(P(),E,action.i,ev);
  else perform(E,P(),aiPick(E,P()),ev);
  if(E.hp<=0){result='win';break}
  if(P().hp<=0)break;
 }
 if(result!=='win'&&P().hp>0&&E.hp>0)endOfTurn(ev);
 if(E.hp<=0)result='win';
 else if(P().hp<=0){
  say(`${josa(P().ch.name,'은/는')} 쓰러졌다.`,{sfx:'ko'});
  result=run.party.some(f=>f.hp>0)?'forced':'lose';
 }
 if(result==='win')say(`${josa(E.ch.name,'을/를')} 쓰러뜨렸다.`,{sfx:'win'});
 return{ev,result}}

function addExp(id,amt){const c=S.chars[id];if(c.lv>=CFG.LV_MAX)return;c.exp+=amt;
 while(c.lv<CFG.LV_MAX&&c.exp>=expNeed(c.lv)){c.exp-=expNeed(c.lv);c.lv++}
 if(c.lv>=CFG.LV_MAX)c.exp=0}
function addSkExp(id,i,amt){const s=S.chars[id].sk[i];if(!s||s.lv>=CFG.SK_MAX)return;s.exp+=amt;
 while(s.lv<CFG.SK_MAX&&s.exp>=skNeed(s.lv)){s.exp-=skNeed(s.lv);s.lv++}
 if(s.lv>=CFG.SK_MAX)s.exp=0}

function winBattle(){
 if(!run.party.some(f=>f.hp>0)){run.note='';loseRun();return}
 const w=run.wave,boss=run.enemy.boss;
 const coin=12+3*w+(boss?80+2*w:0);
 S.coin+=coin;run.gained+=coin;run.won=w;
 const xp=12+3*w;
 run.party.forEach(f=>{if(f.hp>0){addExp(f.ch.id,xp);f.mp=Math.min(f.mpm,f.mp+MP_WIN)}});
 if(S.best<w)S.best=w;
 save();
 run.note=`${TG} ${coin}`;
 run.phase='reward';run.cards=rewardCards()}

function rewardCards(){
 const dmg=run.party.some(f=>f.hp>0&&f.hp<f.maxhp*.8),down=run.party.some(f=>f.hp<=0),w=run.wave;
 const pool=[
  {k:'atk',t:'공격',d:'+8%'},
  {k:'def',t:'방어',d:'+8%'},
  {k:'spd',t:'속도',d:'+8%'},
  {k:'hp',t:'체력',d:'최대 HP +10%'},
  {k:'exp',t:'수련',d:`경험치 +${20+w*6}`},
  {k:'purse',t:'재물',d:`${TG} ${60+w*4}`}];
 if(run.party.some(f=>f.hp>0&&f.mp<f.mpm*.6))pool.push({k:'mp',t:'MP',d:`+${MP_CARD}`},{k:'mp',t:'MP',d:`+${MP_CARD}`},{k:'mp',t:'MP',d:`+${MP_CARD}`});else pool.push({k:'mp',t:'MP',d:`+${MP_CARD}`});
 if(dmg)pool.push({k:'heal',t:'회복',d:'HP 40%'},{k:'heal',t:'회복',d:'HP 40%'});
 if(down)pool.push({k:'revive',t:'부활',d:'HP 50%'},{k:'revive',t:'부활',d:'HP 50%'});
 const out=[];while(out.length<3&&pool.length){const i=Math.floor(Math.random()*pool.length);const c=pool.splice(i,1)[0];if(!out.some(o=>o.k===c.k))out.push(c)}
 return out}

function pickReward(i){
 const c=run.cards[i];
 if(c.k==='atk'||c.k==='def'||c.k==='spd')run.buf[c.k]+=.08;
 else if(c.k==='hp')run.party.forEach(f=>{const n=Math.round(f.maxhp*1.1);if(f.hp>0)f.hp+=n-f.maxhp;f.maxhp=n});
 else if(c.k==='heal')run.party.forEach(f=>{if(f.hp>0)f.hp=Math.min(f.maxhp,f.hp+Math.round(f.maxhp*.4))});
 else if(c.k==='mp')run.party.forEach(f=>{if(f.hp>0)f.mp=Math.min(f.mpm,f.mp+MP_CARD)});
 else if(c.k==='revive'){const f=run.party.find(x=>x.hp<=0);if(f)f.hp=Math.round(f.maxhp*.5)}
 else if(c.k==='exp')run.party.forEach(f=>{if(f.hp>0)addExp(f.ch.id,20+run.wave*6)});
 else if(c.k==='purse'){const v=60+run.wave*4;S.coin+=v;run.gained+=v}
 run.party.forEach(f=>{if(f.hp>0)f.hp=Math.min(f.maxhp,f.hp+Math.round(f.maxhp*CFG.REGEN))});
 save();
 run.wave++;nextBattle()}

function loseRun(){run.phase='over';save();sfx('lose')}

/* =====================================================================
   뽑기
   ===================================================================== */
const RATE={6:.6,5:4,4:25.4};
function rollStar(){const r=Math.random()*100;return r<RATE[6]?6:r<RATE[6]+RATE[5]?5:r<RATE[6]+RATE[5]+RATE[4]?4:0}
function rollHigh(){const t=RATE[6]+RATE[5]+RATE[4],r=Math.random()*t;return r<RATE[6]?6:r<RATE[6]+RATE[5]?5:4}
const MATW=[['ls',24],['ss',24],['lm',9],['sm',9],['ll',2.5],['sl',2.5]];
function rollMat(){const t=MATW.reduce((a,b)=>a+b[1],0);let r=Math.random()*t;for(const[k,w]of MATW){if((r-=w)<0)return k}return'ls'}
function resolveStar(star){
 if(!star){const k=rollMat();S.mats[k]++;return{kind:'mat',k}}
 const ch=rnd(CH.filter(c=>c.star===star));
 if(!S.chars[ch.id]){S.chars[ch.id]=newChar();ensureChar(ch.id);return{kind:'char',ch,tag:'NEW'}}
 const o=S.chars[ch.id];
 if(o.bt<CFG.BT_MAX){o.bt++;return{kind:'char',ch,tag:`BREAKTHROUGH ${o.bt}`,bt:true}}
 const v=CFG.AP_DUP[ch.star]||1;S.ap+=v;return{kind:'char',ch,tag:`살구 ${v}`}}
function pullMany(n){
 const sts=[];for(let i=0;i<n;i++)sts.push(rollStar());
 if(n>=10&&!sts.some(s=>s>=4))sts[sts.length-1]=rollHigh();
 return sts.map(resolveStar)}

let ovr='';
function toGacha(){
 show(`<div class="bg dark"></div>${wallet()}
 <div class="cast"><h2>CAST</h2>
  <button class="tb" onclick="pull(1)">${TG} ${CFG.PULL_COST}</button>
  <button class="tb" onclick="pull(10)">${TG} ${CFG.PULL10_COST}</button>
  <hr>
  <div class="row" style="align-items:center;gap:.6em;justify-content:center">${AP} ${CFG.AP_PER_COIN} <span class="sub">→</span> ${TG} 1
   <button class="mini" ${S.ap>=CFG.AP_PER_COIN?'':'disabled'} onclick="exch(1)">1</button>
   <button class="mini" ${S.ap>=CFG.AP_PER_COIN?'':'disabled'} onclick="exch(0)">MAX</button></div>
 </div>
 <div class="back"><button class="tb" onclick="toTitle()">BACK</button></div><div id="ovl"></div>`)}
function exch(one){const n=one?1:Math.floor(S.ap/CFG.AP_PER_COIN);if(n<=0||S.ap<n*CFG.AP_PER_COIN)return;
 S.ap-=n*CFG.AP_PER_COIN;S.coin+=n;save();toGacha()}
function pull(n){
 const cost=n===10?CFG.PULL10_COST:CFG.PULL_COST;
 if(S.coin<cost){flashWallet();return}
 S.coin-=cost;const res=pullMany(n);save();
 const cells=res.map(r=>r.kind==='mat'
  ?`<div class="rc"><div class="tile" style="--c:#c4c9d4">${bookIcon(r.k)}</div>${BOOK[r.k].n}</div>`
  :`<div class="rc r${r.ch.star}"><div class="tile" style="--c:${EC[r.ch.el]}"><b>${r.ch.name[0]}</b>${imgTag(r.ch)}</div>${r.ch.name}<small${r.bt?' class="btg"':''}>${r.tag}</small></div>`).join('');
 toGacha();sfx(res.some(r=>r.kind==='char'&&r.ch.star>=5)?'rare':'pull');
 $('ovl').innerHTML=`<div class="ov" onclick="toGacha()"><div class="res" style="${n===1?'grid-template-columns:4.2em':''}">${cells}</div></div>`}
function flashWallet(){const w=document.querySelector('.wallet');if(!w)return;w.style.color='var(--acc)';setTimeout(()=>{w.style.color=''},500)}

/* =====================================================================
   화면 공통
   ===================================================================== */
let party=[],cur='luihu',mode='start';
function show(h){$('screen').innerHTML=h}
function tileHtml(c,o,extra,attrs){
 return `<div class="tile ${extra||''}" style="--c:${EC[c.el]}" ${attrs||''}><b>${c.name[0]}</b>${imgTag(c)}</div>`}

function toTitle(){
 run=null;busy=false;skipFn=null;
 show(`<div class="bg mist"></div>
 <img class="logo" src="img/logo.png" alt="神世界">
 <div class="menu">
  <button class="tb" onclick="toPrep()">START</button>
  <button class="tb" onclick="toGacha()">CAST</button>
  <button class="tb" onclick="toArc()">ARCHIVES</button>
  <button class="tb" onclick="toSet()">SETTING</button>
 </div>`)}

/* ---- SETTING ---- */
function toSet(){
 show(`<div class="bg mist"></div>
 <div class="menu" style="top:38%"><button class="tb" id="bSave" onclick="exportSave()">SAVE</button><button class="tb" id="bLoad" onclick="importSave()">LOAD</button><button class="tb" onclick="togSnd()">SOUND ${S.sfx?'ON':'OFF'}</button></div>
 <div class="back"><button class="tb" onclick="toTitle()">BACK</button></div>`)}
function togSnd(){S.sfx=!S.sfx;save();toSet();sfx('tap')}
function tell(id,t){const b=$(id);if(!b)return;const o=b.textContent;b.textContent=t;setTimeout(()=>{const x=$(id);if(x)x.textContent=o},1200)}
function exportSave(){
 try{const blob=new Blob([JSON.stringify({v:2,s:S})],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='kamisekai_save.json';document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),1500);tell('bSave','OK')}catch(e){tell('bSave','ERROR')}}
function importSave(){
 const i=document.createElement('input');i.type='file';i.accept='.json,application/json';
 i.onchange=()=>{const f=i.files&&i.files[0];if(!f)return;const r=new FileReader();
  r.onload=()=>{try{const d=JSON.parse(r.result),s=d.s||d;if(!s||!s.chars||typeof s.coin!=='number')throw 0;S=s;normalize();save();tell('bLoad','OK')}catch(e){tell('bLoad','ERROR')}};
  r.readAsText(f)};
 i.click()}

/* ---- 상세 패널 ---- */
let arcTab='info';
function skRows(c,o,train){
 return c.sk.map((k,i)=>{const sl=(o&&o.sk[i])||{lv:1,exp:0};
  const bt=(train&&o)?`<div class="bt">${['ss','sm','sl'].map(b=>`<button class="mini" ${S.mats[b]>0&&sl.lv<CFG.SK_MAX?'':'disabled'} onclick="useSk('${c.id}',${i},'${b}')">${bookIcon(b)}</button>`).join('')}</div>`:'';
  return `<div class="sk">${skFace(c,i,k,sl.lv,o?`<i>${sl.lv>=CFG.SK_MAX?'MAX':'Lv.'+sl.lv}</i>`:'')}${bt}</div>`}).join('')}
function profHtml(c){const p=PROF[c.id]||{};
 const v=(k,d)=>p[k]||d;
 const cell=(a,b,w)=>b?`<div${w?' class="w"':''}><span>${a}</span><b>${b}</b></div>`:'';
 const grid=cell('소속',v('aff'))+cell('성별',v('sex'))+cell('나이',v('age'))+cell('신체',v('ht'))+cell('종족',v('race',c.race))+cell('주 오행',v('el',c.el))+cell('능력',v('abil'),1);
 const intro=p.intro||LORE[c.id];
 const paras=intro?intro.split(/(?<=[.!?])\s+/).filter(Boolean).map(t=>`<p>${t}</p>`).join(''):'';
 return `${p.rom?`<div class="sub">${p.rom}</div>`:''}<div class="pg">${grid}</div>${paras?`<div class="intro">${paras}</div>`:''}`}
function btHtml(c,o){const n=o?o.bt:0,b=btFx(n);
 const sum=`<div class="btsum"><span>능력치<b>+${n*8}%</b></span><span>스킬 위력<b>+${Math.round((b.pow-1)*100)}%</b></span><span>최대 MP<b>${b.max}</b></span><span>기본 공격 MP<b>+${b.gain}</b></span></div>`;
 const rows=BT_X.map((x,i)=>`<div class="bs ${i<n?'on':''}"><i>${i+1}</i><span>능력치 +8%${x?' · '+x:''}</span></div>`).join('');
 const how=(o&&n>=CFG.BT_MAX)?`<div class="sub" style="margin-top:.7em">${AP} ${CFG.AP_DUP[c.star]||1}</div>`:'';
 return sum+rows+how}
function detHtml(id,train){
 const c=CHM[id],o=S.chars[id];
 const head=`<div class="dh">${train?'':tileHtml(c)}<div><div class="nm">${c.name}</div><div class="sub">${rank(c.star)}${o?`Lv.${o.lv} / ${CFG.LV_MAX}`:''}</div></div></div>`;
 const tabs=train?`<div class="tabs">${[['info','INFO'],['bt','BREAKTHROUGH'],['lore','PROFILE']].map(t=>`<button class="mini ${arcTab===t[0]?'on':''}" onclick="arcT('${t[0]}')">${t[1]}</button>`).join('')}</div>`:'';
 if(train&&arcTab==='lore')return head+tabs+profHtml(c);
 if(train&&arcTab==='bt')return head+tabs+btHtml(c,o);
 if(!o){
  const price=CFG.AP_CHAR[c.star];
  return head+tabs+skRows(c,null,false)
   +(train&&price?`<div class="row"><button class="mini" ${S.ap>=price?'':'disabled'} onclick="buyChar('${id}')">${AP} ${price}</button></div>`:'')}
 const s=calcStats(c,o.lv,o.bt),need=expNeed(o.lv),pct=o.lv>=CFG.LV_MAX?100:Math.round(o.exp/need*100);
 let h=head+tabs+`<div class="xpb"><i style="width:${pct}%"></i></div>
 <div class="st"><span>HP<b>${s.hp}</b></span><span>공격<b>${s.atk}</b></span><span>방어<b>${s.def}</b></span><span>속도<b>${s.spd}</b></span></div>`;
 if(train)h+=`<div class="row">${['ls','lm','ll'].map(k=>`<button class="mini" ${S.mats[k]>0&&o.lv<CFG.LV_MAX?'':'disabled'} onclick="useBook('${id}','${k}')">${bookIcon(k)} ${S.mats[k]}</button>`).join('')}</div>`;
 return h+skRows(c,o,train)}
function arcT(t){arcTab=t;drawArc()}

/* ---- START ---- */
function toPrep(){
 mode='start';
 party=S.party.filter(id=>S.chars[id]).slice(0,CFG.PARTY_MAX);
 if(!party.length)party=['luihu'];
 cur=party[0];drawPrep()}
function drawPrep(){
 const gs=$('pgrid')?$('pgrid').scrollTop:0;
 const tiles=CH.map(c=>{const o=S.chars[c.id],i=party.indexOf(c.id);
  return `<div class="tile ${o?'':'lk'} ${i>=0?'in':''} ${cur===c.id?'sel':''}" style="--c:${EC[c.el]}" onmouseenter="hov('${c.id}')" onclick="pick('${c.id}')"><b>${c.name[0]}</b>${imgTag(c)}${i>=0?`<em>${i+1}</em>`:''}</div>`}).join('');
 const slots=[0,1,2].map(i=>{const c=party[i]&&CHM[party[i]];
  return `<div class="slot" onclick="drop(${i})">${c?`${tileHtml(c)}<span>${c.name}</span>`:''}</div>`}).join('');
 show(`<div class="bg dark"></div><div class="tiles" id="pgrid">${tiles}</div><div class="det" id="pdet"></div>
 <div class="bar">${slots}<div class="sp"></div><button class="tb" ${party.length?'':'disabled'} onclick="start()">START</button><button class="tb" onclick="toTitle()">BACK</button></div>`);
 $('pgrid').scrollTop=gs;$('pdet').innerHTML=detHtml(cur,false)}
function hov(id){cur=id;const d=$('pdet');if(d)d.innerHTML=detHtml(id,false);document.querySelectorAll('#pgrid .tile').forEach((t,i)=>t.classList.toggle('sel',CH[i].id===id))}
function pick(id){cur=id;
 if(S.chars[id]){const i=party.indexOf(id);if(i>=0)party.splice(i,1);else if(party.length<CFG.PARTY_MAX)party.push(id)}
 drawPrep()}
function drop(i){party.splice(i,1);drawPrep()}
function start(){S.party=party.slice();save();startRun(party.slice())}

/* ---- ARCHIVES ---- */
function toArc(){mode='arc';arcTab='info';cur=S.chars[cur]?cur:'luihu';drawArc()}
function drawArc(){
 const gs=$('pgrid')?$('pgrid').scrollTop:0,ds=$('pdet')?$('pdet').scrollTop:0;
 const tiles=CH.map(c=>{const o=S.chars[c.id];
  return `<div class="tile ${o?'':'lk'} ${cur===c.id?'sel':''}" style="--c:${EC[c.el]}" onclick="arcPick('${c.id}')"><b>${c.name[0]}</b>${imgTag(c)}</div>`}).join('');
 const c=CHM[cur],o=S.chars[cur];
 const full=`<div class="afull ${o?'':'lk'}" style="--c:${EC[c.el]}"><b>${c.name[0]}</b>${IMG('full',c)}</div>`;
 const m=S.mats,grp=ks=>`<span>${ks.map(k=>`${bookIcon(k)}<b>${m[k]}</b>`).join('')}</span>`;
 show(`<div class="bg dark"></div>${wallet()}<div class="tiles alist" id="pgrid">${tiles}</div>${full}<div class="det adet" id="pdet">${detHtml(cur,true)}</div>
 <div class="bar"><div class="mats">${grp(['ls','lm','ll'])}${grp(['ss','sm','sl'])}</div><div class="sp"></div><button class="tb" onclick="toTitle()">BACK</button></div>`);
 $('pgrid').scrollTop=gs;$('pdet').scrollTop=ds}
function arcPick(id){cur=id;drawArc()}
function useBook(id,k){if(S.mats[k]<=0)return;S.mats[k]--;addExp(id,BOOK[k].x);save();drawArc()}
function useSk(id,i,k){if(S.mats[k]<=0)return;S.mats[k]--;addSkExp(id,i,BOOK[k].x);save();drawArc()}
function buyChar(id){const c=CHM[id],p=CFG.AP_CHAR[c.star];if(!p||S.chars[id]||S.ap<p)return;
 S.ap-=p;S.chars[id]=newChar();ensureChar(id);save();drawArc()}

/* =====================================================================
   전투 화면
   ===================================================================== */
function drawBattle(){
 const m=mapOf(run.wave),E=run.enemy;
 const card=(sd,inner)=>`<div class="cb" id="${sd}C"><div class="act" id="${sd}Act"></div><div class="pop" id="${sd}Pop"></div>${inner}
  <div class="who"><span id="${sd}Nm"></span><span id="${sd}Lv"></span></div><div class="hpl"><i id="${sd}Bar"></i></div><div class="mpl"><i id="${sd}Mp"></i></div><div class="hn" id="${sd}Hn"></div><div class="stt" id="${sd}St"></div></div>`;
 show(`<div class="bg" id="bgm" style="background-image:linear-gradient(170deg,${m.g[0]},${m.g[1]})"></div><div class="veil"></div>
 <div class="where">${m.name} · ${run.wave}</div>
 ${card('e',`<div class="pf" id="ePF" style="--c:${EC[E.ch.el]}"><b>${E.ch.name[0]}</b>${IMG('battle',E.ch)}</div>`)}
 ${card('p',`<div class="pf" id="pPF"></div>`)}
 <div id="cards"></div><div id="sideL" class="side l"></div><div id="sideR" class="side r"></div><canvas id="fxc"></canvas><div id="ovl"></div>`);
 FX.clear();const s=snap();lastHp={e:s.e.hp,p:s.p.hp,id:s.p.id};
 $('eNm').textContent=E.ch.name;$('eLv').textContent='Lv.'+E.lv;
 $('pPF').dataset.id='';
 paintInfo(s,false);paintMenu();
 const img=new Image();img.onload=()=>{const b=$('bgm');if(b)b.style.backgroundImage=`url(maps/${m.id}.png)`};img.src=`maps/${m.id}.png`}

/* 이펙트: canvas 파티클 */
const FX=(()=>{
 let cv=null,c=null,W=0,H=0,dp=1,L=[],raf=0,lt=0;const cc={};
 const R=(a,b)=>a+Math.random()*(b-a),TAU=Math.PI*2;
 function rgb(col){if(cc[col])return cc[col];let s=col||'#f2f2f0';const m=/var\((--[^)]+)\)/.exec(s);
  if(m)s=getComputedStyle(document.documentElement).getPropertyValue(m[1]).trim()||'#f2f2f0';
  let h=s.replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');
  const v=[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];return cc[col]=v.some(isNaN)?[242,242,240]:v}
 const A=(col,a)=>{const v=rgb(col);return `rgba(${v[0]},${v[1]},${v[2]},${Math.max(0,Math.min(1,a))})`};
 function init(){cv=$('fxc');if(!cv)return false;const g=$('game').getBoundingClientRect();dp=Math.min(2,window.devicePixelRatio||1);W=g.width;H=g.height;
  const w=Math.round(W*dp),h=Math.round(H*dp);if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h}c=cv.getContext('2d');return true}
 function box(side){const el=$(side+'C'),g=$('game').getBoundingClientRect();if(!el)return null;const r=el.getBoundingClientRect(),w=r.width,h=w*4/3;
  return{x:r.left-g.left+w/2,y:r.top-g.top+h/2,w,h}}
 function loop(ts){raf=0;if(!cv||!cv.isConnected){L=[];return}
  const dt=Math.min(.05,(ts-lt)/1000||.016);lt=ts;c.setTransform(dp,0,0,dp,0,0);c.clearRect(0,0,W,H);
  L=L.filter(o=>{o.age+=dt;if(o.age<0)return true;const p=o.age/o.dur;if(p>=1)return false;c.save();o.fn(p,o.age,dt);c.restore();return true});
  if(L.length)raf=requestAnimationFrame(loop);else c.clearRect(0,0,W,H)}
 function add(fn,dur,delay){L.push({fn,dur,age:-(delay||0)});if(!raf){lt=performance.now();raf=requestAnimationFrame(loop)}}
 function glow(x,y,r,col,a){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,A(col,a));g.addColorStop(1,A(col,0));c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,TAU);c.fill()}
 function star(x,y,r,rot){c.beginPath();for(let i=0;i<8;i++){const a=rot+i*Math.PI/4,rr=i%2?r*.28:r;c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}c.closePath()}
 /* 불꽃 */
 function sparks(x,y,n,col,o){o=o||{};const P=[];for(let i=0;i<n;i++){const a=o.a!==undefined?o.a+R(-(o.s||.7),(o.s||.7)):R(0,TAU),v=R(o.v0||140,o.v1||420);P.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:R(.5,1)*(o.life||.45),w:R(1,2.6)*(o.sz||1)})}
  add((p,age,dt)=>{c.globalCompositeOperation='lighter';c.lineCap='round';
   P.forEach(q=>{q.vx*=.93;q.vy=q.vy*.93+(o.g===undefined?260:o.g)*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;const lf=1-age/q.l;if(lf<=0)return;
    c.strokeStyle=A(o.white?'#fff':col,lf);c.lineWidth=q.w;c.beginPath();c.moveTo(q.x,q.y);c.lineTo(q.x-q.vx*.045,q.y-q.vy*.045);c.stroke()})},o.life||.5,o.delay)}
 /* 칼날 궤적 */
 function blade(x0,y0,x1,y1,curve,th,col,delay){const dx=x1-x0,dy=y1-y0,len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len;
  add(p=>{const hp=Math.min(1,p/.45),tp=Math.max(0,(p-.2)/.8),N=20,fade=1-Math.max(0,p-.55)/.45;if(hp<=tp)return;
   const pts=[];for(let i=0;i<=N;i++){const t=tp+(hp-tp)*i/N,off=Math.sin(t*Math.PI)*curve;pts.push([x0+dx*t+nx*off,y0+dy*t+ny*off,Math.sin(i/N*Math.PI)])}
   c.globalCompositeOperation='lighter';
   [[1.7,col,.6],[.55,'#fff',1]].forEach(([k,cl,al])=>{c.fillStyle=A(cl,al*fade);c.shadowColor=A(col,1);c.shadowBlur=k>1?14:6;c.beginPath();
    pts.forEach((q,i)=>{const m=q[2]*th*k/2;c[i?'lineTo':'moveTo'](q[0]+nx*m,q[1]+ny*m)});
    for(let i=N;i>=0;i--){const q=pts[i],m=q[2]*th*k/2;c.lineTo(q[0]-nx*m,q[1]-ny*m)}c.closePath();c.fill()})},.34,delay)}
 const FXS={
  slash(b,col,big){const t=b.w*.17*big;
   blade(b.x+b.w*.55,b.y-b.h*.42,b.x-b.w*.5,b.y+b.h*.4,b.w*.18,t,col,0);
   blade(b.x-b.w*.5,b.y-b.h*.18,b.x+b.w*.52,b.y+b.h*.3,-b.w*.14,t*.7,col,.1);
   add(p=>{c.globalCompositeOperation='lighter';glow(b.x,b.y,b.w*.8*big,col,.55*(1-p))},.25,.12);
   sparks(b.x,b.y,14*big,col,{a:Math.PI*.75,s:1,delay:.12,life:.4});sparks(b.x,b.y,8,col,{white:1,delay:.14,life:.3,v0:200,v1:480})},
  ring(b,col){
   add(p=>{c.globalCompositeOperation='lighter';glow(b.x,b.y,b.w*1.3,'#fff',.8*(1-p)*(1-p));glow(b.x,b.y,b.w*1.3,col,.5*(1-p))},.32);
   add(p=>{const r=b.w*(.1+.95*Math.pow(p,.55));c.globalCompositeOperation='lighter';c.strokeStyle=A(col,1-p);c.lineWidth=b.w*.14*(1-p)+1;c.shadowColor=A(col,1);c.shadowBlur=16;c.beginPath();c.arc(b.x,b.y,r,0,TAU);c.stroke()},.55);
   add(p=>{const r=b.w*(.05+.7*Math.pow(p,.6));c.globalCompositeOperation='lighter';c.strokeStyle=A('#fff',(1-p)*.9);c.lineWidth=b.w*.04*(1-p)+.8;c.beginPath();c.arc(b.x,b.y,r,0,TAU);c.stroke()},.45,.05);
   for(let i=0;i<9;i++){const a=R(0,TAU),d=R(.2,.6)*b.w,sx=b.x+Math.cos(a)*d,sy=b.y+Math.sin(a)*d,sz=R(.18,.34)*b.w;
    add(p=>{c.fillStyle=`rgba(18,18,24,${.3*(1-p)})`;c.beginPath();c.arc(sx+Math.cos(a)*p*b.w*.5,sy+Math.sin(a)*p*b.w*.5-p*b.w*.2,sz*(.5+p),0,TAU);c.fill()},.7,R(0,.08))}
   sparks(b.x,b.y,30,col,{v0:200,v1:620,g:300,life:.55});sparks(b.x,b.y,14,'#fff',{white:1,v0:260,v1:700,life:.35})},
  zap(b,col){const top=b.y-b.h*.75;
   const bolt=(sx)=>{const pts=[[sx,top]],N=9;for(let i=1;i<N;i++){const t=i/N;pts.push([sx+(b.x-sx)*t+R(-1,1)*b.w*.16,top+(b.y-top)*t])}pts.push([b.x+R(-1,1)*b.w*.05,b.y]);
    const br=[];for(let k=0;k<2;k++){const s=pts[2+Math.floor(R(0,5))],q=[s],a=R(-.9,.9)+Math.PI/2;let x=s[0],y=s[1];for(let i=0;i<3;i++){x+=Math.cos(a+R(-.5,.5))*b.w*.2;y+=Math.sin(a+R(-.5,.5))*b.w*.2;q.push([x,y])}br.push(q)}return[pts,...br]};
   const draw=(P,k,al)=>{c.beginPath();P.forEach((q,i)=>c[i?'lineTo':'moveTo'](q[0],q[1]));c.lineWidth=k;c.stroke()};
   [0,.09,.2].forEach((d,n)=>{const B=bolt(b.x+R(-.5,.5)*b.w);
    add(p=>{const al=(Math.floor(p*6)%2?.55:1)*(1-p*.4);c.globalCompositeOperation='lighter';c.lineJoin='round';c.lineCap='round';
     c.shadowColor='#8fc4ff';c.shadowBlur=18;c.strokeStyle=A('#7fb4ff',al*.8);B.forEach((P,i)=>draw(P,i?3:b.w*.09));
     c.shadowBlur=0;c.strokeStyle=A('#fff',al);B.forEach((P,i)=>draw(P,i?1:b.w*.035))},.14,d)});
   add(p=>{c.globalCompositeOperation='lighter';glow(b.x,b.y,b.w*1.1,'#bcd8ff',.7*(1-p));c.fillStyle=A('#fff',.35*(1-p)*(1-p));c.fillRect(b.x-b.w*.6,b.y-b.h*.6,b.w*1.2,b.h*1.2)},.3);
   sparks(b.x,b.y,22,'#f7ecaa',{v0:160,v1:520,g:400,life:.5,delay:.04})},
  heal(b,col){col='#8fd49b';
   add(p=>{c.globalCompositeOperation='lighter';c.strokeStyle=A(col,(1-p)*.8);c.lineWidth=2;c.beginPath();c.ellipse(b.x,b.y+b.h*.36,b.w*(.2+.5*p),b.w*(.06+.12*p),0,0,TAU);c.stroke();glow(b.x,b.y,b.w*.9,col,.22*Math.sin(p*Math.PI))},.9);
   for(let i=0;i<22;i++){const x0=b.x+R(-.42,.42)*b.w,y0=b.y+R(.1,.4)*b.h,ph=R(0,TAU),sp=R(.35,.7)*b.h,sz=R(2,4.5),dl=R(0,.45),plus=i%6===0;
    add(p=>{const y=y0-sp*p,x=x0+Math.sin(ph+p*6)*b.w*.04,al=Math.sin(p*Math.PI);c.globalCompositeOperation='lighter';
     if(plus){c.strokeStyle=A('#d8ffe0',al);c.lineWidth=1.6;c.lineCap='round';const s=sz*1.8;c.beginPath();c.moveTo(x-s,y);c.lineTo(x+s,y);c.moveTo(x,y-s);c.lineTo(x,y+s);c.stroke()}
     else{glow(x,y,sz*3,col,al*.5);c.fillStyle=A('#eaffee',al);c.beginPath();c.arc(x,y,sz*.55,0,TAU);c.fill()}},.85,dl)}},
  up(b,col){
   add(p=>{c.globalCompositeOperation='lighter';c.strokeStyle=A(col,(1-p)*.9);c.lineWidth=2;c.beginPath();c.ellipse(b.x,b.y+b.h*.38,b.w*(.15+.5*p),b.w*(.05+.12*p),0,0,TAU);c.stroke();
    const g=c.createLinearGradient(0,b.y+b.h*.4,0,b.y-b.h*.5);g.addColorStop(0,A(col,.3*Math.sin(p*Math.PI)));g.addColorStop(1,A(col,0));c.fillStyle=g;c.fillRect(b.x-b.w*.38,b.y-b.h*.5,b.w*.76,b.h*.9)},.8);
   for(let k=0;k<3;k++)add(p=>{const y=b.y+b.h*.3-p*b.h*.75,w=b.w*.3,al=Math.sin(p*Math.PI);c.globalCompositeOperation='lighter';c.strokeStyle=A(col,al);c.lineWidth=b.w*.045;c.lineCap='round';c.lineJoin='round';c.shadowColor=A(col,1);c.shadowBlur=10;
    c.beginPath();c.moveTo(b.x-w,y+w*.55);c.lineTo(b.x,y-w*.2);c.lineTo(b.x+w,y+w*.55);c.stroke()},.7,k*.13);
   for(let i=0;i<14;i++){const x0=b.x+R(-.4,.4)*b.w,y0=b.y+R(.1,.4)*b.h,sp=R(.4,.8)*b.h;add(p=>{c.globalCompositeOperation='lighter';c.fillStyle=A('#fff',Math.sin(p*Math.PI)*.9);c.beginPath();c.arc(x0,y0-sp*p,R(1,2)+.4,0,TAU);c.fill()},.7,R(0,.3))}},
  down(b,col){col=col||'#ad8fd8';
   add(p=>{const a=Math.sin(p*Math.PI);const g=c.createLinearGradient(0,b.y-b.h*.5,0,b.y+b.h*.5);g.addColorStop(0,`rgba(24,10,40,${.55*a})`);g.addColorStop(1,`rgba(24,10,40,0)`);c.fillStyle=g;c.fillRect(b.x-b.w*.55,b.y-b.h*.5,b.w*1.1,b.h)},.85);
   for(let k=0;k<3;k++)add(p=>{const y=b.y-b.h*.4+p*b.h*.8,w=b.w*.3,al=Math.sin(p*Math.PI);c.globalCompositeOperation='lighter';c.strokeStyle=A(col,al*.95);c.lineWidth=b.w*.045;c.lineCap='round';c.lineJoin='round';c.shadowColor=A(col,1);c.shadowBlur=8;
    c.beginPath();c.moveTo(b.x-w,y-w*.55);c.lineTo(b.x,y+w*.2);c.lineTo(b.x+w,y-w*.55);c.stroke()},.7,k*.13);
   for(let i=0;i<16;i++){const x0=b.x+R(-.42,.42)*b.w,y0=b.y-b.h*R(.1,.45),sp=R(.3,.6)*b.h,s=R(1.5,3.4);add(p=>{c.fillStyle=A(i%2?'#6a4f9a':col,Math.sin(p*Math.PI)*.8);c.beginPath();c.ellipse(x0,y0+sp*p*p*1.4,s*.7,s*1.5,0,0,TAU);c.fill()},.8,R(0,.3))}},
  stun(b){const cx=b.x,cy=b.y-b.h*.4,rx=b.w*.4,ry=b.w*.11,n=4;
   sparks(cx,cy+b.h*.08,10,'#f6e38a',{a:-Math.PI/2,s:1.3,v0:100,v1:300,g:300,life:.4});
   add(p=>{const al=p<.8?1:(1-p)/.2,sz=b.w*(.075+.012*Math.sin(p*20)),rot=p*5;c.globalCompositeOperation='lighter';
    const S=[];for(let i=0;i<n;i++){const a=p*TAU*2.2+i*TAU/n;S.push([cx+Math.cos(a)*rx,cy+Math.sin(a)*ry,Math.sin(a)])}
    S.sort((a,b2)=>a[2]-b2[2]).forEach(q=>{const k=.75+.25*q[2];glow(q[0],q[1],sz*2.6,'#f6e38a',.35*al*k);c.fillStyle=A('#fff3b8',al*k);star(q[0],q[1],sz*k,rot);c.fill()})},1.15)},
  dodge(b,col){
   for(let i=0;i<4;i++){const y=b.y+R(-.35,.35)*b.h;add(p=>{c.globalCompositeOperation='lighter';c.strokeStyle=A('#fff',Math.sin(p*Math.PI)*.55);c.lineWidth=1.5;c.lineCap='round';const x=b.x-b.w*.7+p*b.w*1.4;c.beginPath();c.moveTo(x-b.w*.35,y);c.lineTo(x,y);c.stroke()},.35,i*.04)}
   for(let i=0;i<5;i++){const x0=b.x+R(-.2,.2)*b.w,s=R(.1,.2)*b.w;add(p=>{c.fillStyle=`rgba(200,200,210,${.16*(1-p)})`;c.beginPath();c.arc(x0+p*b.w*.3,b.y+b.h*.38-p*b.h*.08,s*(.6+p),0,TAU);c.fill()},.5,R(0,.1))}},
  charge(b,col){
   for(let i=0;i<18;i++){const a=R(0,TAU),r0=b.w*R(.75,1.2),dl=R(0,.2);
    add(p=>{const e=p*p,r=r0*(1-e),x=b.x+Math.cos(a+p*1.4)*r,y=b.y+Math.sin(a+p*1.4)*r*1.2,r2=r0*(1-Math.max(0,p-.08)*Math.max(0,p-.08)),px=b.x+Math.cos(a+(p-.08)*1.4)*r2,py=b.y+Math.sin(a+(p-.08)*1.4)*r2*1.2;
     c.globalCompositeOperation='lighter';c.strokeStyle=A(col,.9*Math.min(1,p*4)*(1-p*.6));c.lineWidth=1.8;c.lineCap='round';c.beginPath();c.moveTo(px,py);c.lineTo(x,y);c.stroke()},.42,dl)}
   add(p=>{c.globalCompositeOperation='lighter';glow(b.x,b.y,b.w*(.2+.55*p),col,.5*p*(1-p*.5))},.5)}
 };
 return{
  clear(){L=[];if(raf)cancelAnimationFrame(raf);raf=0;cv=$('fxc');if(cv&&cv.getContext)cv.getContext('2d').clearRect(0,0,cv.width,cv.height)},
  play(f){if(!init())return;const b=box(f.side);if(!b||!FXS[f.k])return;FXS[f.k](b,f.c||'#f2f2f0',f.big?1.35:1)}}})();

function restart(el,cls){if(!el)return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);el.addEventListener('animationend',()=>el.classList.remove(cls),{once:true})}
function flash(id){restart($(id),'hit')}
function pop(side,v,cls){const el=$(side+'Pop');if(!el)return;el.textContent=v;el.className='pop'+(cls?' '+cls:'');void el.offsetWidth;el.classList.add('go')}
function showAct(a){const el=$(a.side+'Act');if(!el)return;el.innerHTML=`${svg(a.k)}<span>${a.n}</span>`;restart(el,'go')}
function lunge(side){restart($(side+'PF'),'lg')}
function shake(){restart($('screen'),'shake')}
function playFx(f){FX.play(f);if(f.k==='dodge')restart($(f.side+'PF'),'dg')}
function paintInfo(s,fl,popv){
 const er=Math.max(0,s.e.hp/s.e.max),pr=Math.max(0,s.p.hp/s.p.max);
 $('eBar').style.width=er*100+'%';$('eBar').style.background=hpColor(er);
 $('pBar').style.width=pr*100+'%';$('pBar').style.background=hpColor(pr);
 $('eMp').style.width=Math.max(0,s.e.mp/s.e.mpm)*100+'%';$('pMp').style.width=Math.max(0,s.p.mp/s.p.mpm)*100+'%';
 $('eHn').textContent=`${s.e.hp} / ${s.e.max}  ·  MP ${s.e.mp}`;$('pHn').textContent=`${s.p.hp} / ${s.p.max}  ·  MP ${s.p.mp}`;
 $('eSt').innerHTML=stHtml(s.e.st||{});$('pSt').innerHTML=stHtml(s.p.st||{});
 $('pNm').textContent=s.p.name;$('pLv').textContent='Lv.'+s.p.lv;
 const ps=$('pPF');
 if(ps.dataset.id!==s.p.id){const c=CHM[s.p.id];ps.dataset.id=s.p.id;ps.style.setProperty('--c',EC[c.el]);ps.innerHTML=`<b>${c.name[0]}</b>${IMG('battle',c)}`}
 if(fl){if(lastHp.e>s.e.hp)flash('ePF');if(lastHp.id===s.p.id&&lastHp.p>s.p.hp)flash('pPF');if(popv)pop(popv.side,popv.v,popv.cls)}
 $('ePF').classList.toggle('ko',s.e.hp<=0);ps.classList.toggle('ko',s.p.hp<=0);
 lastHp={e:s.e.hp,p:s.p.hp,id:s.p.id}}

function paintMenu(){
 const P=run.party[run.active],ph=run.phase,cards=$('cards');
 $('ovl').innerHTML='';cards.innerHTML='';$('sideL').innerHTML='';$('sideR').innerHTML='';
 if(ph==='menu'){
  const opts=[];if(!(P.ch.sk[0]&&P.ch.sk[0].t==='a'))opts.push(-1);P.ch.sk.forEach((s,i)=>opts.push(i));
  cards.innerHTML=opts.map(i=>{const s=i<0?BASIC:P.ch.sk[i],l=i<0?1:slv(P,i);
   return `<button class="sc" ${P.mp<mpCost(s,i)?'disabled':''} onclick="act(${i})">${skFace(P.ch,i,s,l,'',true)}</button>`}).join('');
  $('sideL').innerHTML=`<button class="tb" onclick="openParty(false)">교체</button>`;
  $('sideR').innerHTML=`<button class="tb" onclick="quitRun()">철수</button>`}
 else if(ph==='forced')openParty(true)
 else if(ph==='reward'){
  $('ovl').innerHTML=`<div class="ov" style="flex-direction:column;gap:1.6em"><div class="gain">${run.note}</div><div class="rrow">${run.cards.map((k,i)=>`<button class="rw" onclick="pickReward(${i})"><b>${k.t}</b><span>${k.d}</span></button>`).join('')}</div></div>`}
 else if(ph==='over'){
  $('ovl').innerHTML=`<div class="ov" style="flex-direction:column;gap:1em"><div style="font-size:2.4em;font-weight:200;letter-spacing:.2em">${run.won}</div><div>${TG} ${run.gained}</div><button class="tb" style="margin-top:1em" onclick="toTitle()">OK</button></div>`}}

function openParty(forced){
 $('ovl').innerHTML=`<div class="ov"><div class="plist">${run.party.map((f,i)=>{
  const dead=f.hp<=0,isCur=i===run.active&&!forced,r=Math.max(0,f.hp/f.maxhp);
  return `<button class="prow" ${dead||isCur?'disabled':''} onclick="pickMember(${i})">${tileHtml(f.ch)}<span class="pn">${f.ch.name}</span><span>Lv.${f.lv}</span><div class="hb"><i style="width:${r*100}%;background:${hpColor(r)}"></i></div><span class="pv">${f.hp}/${f.maxhp}</span></button>`}).join('')}
  ${forced?'':'<div style="text-align:center;margin-top:1em"><button class="tb" onclick="document.getElementById(\'ovl\').innerHTML=\'\'">BACK</button></div>'}</div></div>`}
function pickMember(i){
 if(busy)return;
 if(run.phase==='forced'){
  run.active=i;run.phase='menu';run.note='';
  paintInfo(snap(),false);paintMenu();return}
 $('ovl').innerHTML='';run.note='';runTurn({type:'switch',to:i})}

function act(i){
 if(busy||run.phase!=='menu')return;
 const P=run.party[run.active],sk=i<0?BASIC:P.ch.sk[i];if(P.mp<mpCost(sk,i))return;
 run.note='';runTurn({type:'skill',i})}

function runTurn(action){
 busy=true;run.phase='play';paintMenu();
 const r=doTurn(action);
 playEvents(r.ev,()=>{
  busy=false;skipFn=null;
  if(r.result==='win'){winBattle();paintInfo(snap(),false);paintMenu()}
  else if(r.result==='forced'){run.phase='forced';paintMenu()}
  else if(r.result==='lose'){loseRun();paintMenu()}
  else{run.phase='menu';paintInfo(snap(),false);paintMenu()}})}

function playEvents(ev,done){
 let i=0,timer=null;
 const step=()=>{
  clearTimeout(timer);
  if(i>=ev.length){done();return}
  const e=ev[i++];paintInfo(e.s,true,e.pop);
  if(e.act)showAct(e.act);if(e.lunge)lunge(e.lunge);if(e.fx)playFx(e.fx);if(e.shake)shake();if(e.sfx)sfx(e.sfx);
  timer=setTimeout(step,e.d||((e.pop||e.fx)?700:450))};
 skipFn=step;step()}

function quitRun(){if(busy)return;if(confirm('철수합니다.')){run.note='';run.phase='over';paintMenu()}}

/* ---------- 시작 ---------- */
load();toTitle();
$('game').addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button');if(b)sfx('tap');else if(skipFn)skipFn()});
