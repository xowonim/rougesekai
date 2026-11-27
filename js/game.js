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
/* MP: 최대 100, 전투 시작 시 지급, 턴 종료마다 회복. ①번 공격은 소모 없음 */
const MP_MAX=100;
function mpCost(s,i){if(s.mp!==undefined)return s.mp;if(i<0)return 0;if(i===0&&s.t==='a')return 0;
 if(s.t==='a')return s.p<50?10:s.p<70?12:s.p<100?18:28;if(s.t==='h')return 15;return 12}
/* 돌파: 매 단계 능력치 +8%, 단계별 추가 효과 */
const BT_X=['','시작 MP +10','스킬 위력 +5%','MP 회복 +3','스킬 위력 +5%','시작 MP +10 · MP 회복 +2'];
function btFx(bt){bt=bt||0;return{pow:1+(bt>=3?.05:0)+(bt>=5?.05:0),mp:60+(bt>=2?10:0)+(bt>=6?10:0),reg:25+(bt>=4?3:0)+(bt>=6?2:0)}}

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
const rank=n=>`<b class="rk">${n}</b>`;
/* 이미지: chars/icon(아이콘) · chars/full(아카이브 전신) · chars/battle(전투) / <id>.png */
const IMG=(dir,ch)=>`<img src="chars/${dir}/${ch.id}.png" alt="" onerror="this.remove()">`;
const imgTag=ch=>IMG('icon',ch);
/* 효과음: 파일 없이 합성 */
let AC=null;
function ac(){try{if(!S||!S.sfx)return null;AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();return AC}catch(e){return null}}
function tone(f,d,type,v,to,at){const c=ac();if(!c)return;try{const t=c.currentTime+(at||0),o=c.createOscillator(),g=c.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+d);g.gain.setValueAtTime(v||.12,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d+.03)}catch(e){}}
function noise(d,v,fq,at){const c=ac();if(!c)return;try{const n=Math.floor(c.sampleRate*d),b=c.createBuffer(1,n,c.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=Math.random()*2-1;
 const t=c.currentTime+(at||0),src=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();src.buffer=b;f.type='bandpass';f.frequency.value=fq||1500;g.gain.setValueAtTime(v||.2,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);src.connect(f);f.connect(g);g.connect(c.destination);src.start(t)}catch(e){}}
const SFX={
 tap:()=>tone(720,.05,'square',.035),
 cast:()=>tone(300,.14,'triangle',.07,700),
 hit:()=>{noise(.12,.28,1700);tone(170,.12,'sawtooth',.1,60)},
 crit:()=>{noise(.2,.38,2400);tone(240,.2,'sawtooth',.14,50);tone(900,.1,'square',.05,300,.02)},
 boom:()=>{noise(.55,.4,320);tone(95,.5,'sawtooth',.18,30)},
 zap:()=>{tone(1400,.25,'square',.06,180);noise(.25,.2,5200)},
 miss:()=>noise(.2,.09,3600),
 heal:()=>{tone(523,.16,'sine',.1);tone(659,.16,'sine',.1,0,.1);tone(784,.3,'sine',.1,0,.2)},
 up:()=>{tone(440,.14,'triangle',.09,660);tone(660,.2,'triangle',.09,990,.1)},
 down:()=>{tone(520,.16,'triangle',.09,260);tone(300,.22,'triangle',.09,150,.1)},
 stun:()=>{tone(380,.12,'square',.05);tone(300,.12,'square',.05,0,.12);tone(220,.2,'square',.05,0,.24)},
 ko:()=>tone(260,.5,'sawtooth',.09,40),
 win:()=>{[523,659,784,1047].forEach((f,i)=>tone(f,.22,'triangle',.09,0,i*.1))},
 lose:()=>{[392,330,262,196].forEach((f,i)=>tone(f,.3,'triangle',.09,0,i*.18))},
 pull:()=>{tone(500,.4,'sine',.08,900);noise(.4,.06,4000)},
 rare:()=>{[784,988,1175,1568].forEach((f,i)=>tone(f,.4,'triangle',.09,0,i*.12));noise(.6,.06,5000,.1)}};
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
const BOOKSZ={s:.8,m:1,l:1.2};
const bookIcon=k=>`<span class="sic bk" style="--z:${BOOKSZ[k[1]]};${k[0]==='s'?'color:var(--阳)':''}">${svg(k[0]==='l'?'trn':'gi')}${picOver('img/item/'+k+'.png')}</span>`;
const stHtml=s=>(s.stun?`<span title="">${svg('stun')}</span>`:'')+(s.shock?`<span>${svg('shock')}</span>`:'')+(s.ev?`<span>${svg('evade')}</span>`:'');

const kindName=s=>s.t==='a'?(s.sc==='범위'?'범위 공격':'단일 공격'):s.t==='w'?'적 변화':'자기 변화';
const statLine=(s,lv)=>{const p=Math.round((s.p||0)*skMul(lv)),acc=s.t==='a'?(s.acc!==undefined?s.acc:95):100;return `위력 ${s.t==='a'?p:'-'} / 명중 ${acc}`};
function skFace(ch,i,s,lv,tag){const c=mpCost(s,i);
 return `<div class="sf"><span class="a">${i<0?svg('single'):skIcon(ch,i,s)}${c?`<small>MP ${c}</small>`:''}</span><span class="b">${kindName(s)}</span><span class="c">${s.n}${tag||''}</span><span class="d">${statLine(s,lv)}</span></div>`}

/* =====================================================================
   전투 로직
   ===================================================================== */
let run=null,busy=false,skipFn=null,lastHp={};
function newFighter(ch,lv,bt,side,mult,sl){const s=calcStats(ch,lv,bt);mult=mult||{};const k=mult.all||1,b=btFx(bt);
 const f={ch,lv,side,sl:sl||[],maxhp:Math.round(s.hp*(mult.hp||1)*k),atk:s.atk*(mult.atk||1)*k,def:s.def*(mult.def||1)*k,spd:s.spd,hp:0,pow:b.pow,mpStart:b.mp,mpRegen:b.reg,mpm:MP_MAX};
 f.hp=f.maxhp;resetBattleState(f);return f}
function resetBattleState(f){f.m={atk:0,def:0};f.mT=0;f.d={atk:0,def:0};f.dT=0;f.evade=0;f.stun=0;f.stunImm=0;f.rest=0;f.shock=false;f.shockT=0;f.dot=null;
 f.mp=f.mpStart}
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
 a.mp=Math.max(0,a.mp-mpCost(sk,idx));
 say(`${a.ch.name}의 ${sk.n}`,{act:{side:me,n:sk.n,k:skKind(sk)},sfx:'cast',lunge:sk.t==='a'?me:null,d:520});
 if(sk.t==='a'){
  const acc=(sk.acc!==undefined?sk.acc:95)-(a.shock?50:0);
  if(d.evade>0){say(`${josa(d.ch.name,'은/는')} 공격을 피했다.`,{pop:tx(you,'회피'),fx:{side:you,k:'dodge'},sfx:'miss'});return}
  if(Math.random()*100>=acc){say('빗나갔다.',{pop:tx(you,'MISS'),sfx:'miss'});return}
  const h=hitCalc(a,d,sk,k);
  d.hp=Math.max(0,d.hp-h.dmg);
  const area=sk.sc==='범위';
  say(`${d.ch.name}에게 ${h.dmg} 피해`+(h.crit?' · 치명타':''),{pop:{side:you,v:'-'+h.dmg,cls:h.crit?'crit':''},fx:{side:you,k:sk.shock?'zap':area?'ring':'slash',c:EC[a.ch.el]},sfx:h.crit?'crit':area?'boom':sk.shock?'zap':'hit',shake:h.crit||area||h.dmg>=d.maxhp*.25});
  if(sk.drain&&a.hp>0){const g=Math.round(h.dmg*.5);a.hp=Math.min(a.maxhp,a.hp+g);say(`${a.ch.name} HP ${g} 흡수`,{pop:{side:me,v:'+'+g,cls:'heal'},fx:{side:me,k:'heal'},sfx:'heal'})}
  if(sk.recoil&&a.hp>0){const r=Math.round(h.dmg*sk.recoil/100);a.hp=Math.max(0,a.hp-r);say(`${a.ch.name} 반동 ${r}`,{pop:{side:me,v:'-'+r,cls:'dot'},sfx:'hit'})}
  if(d.hp>0&&sk.stun&&d.stun<=0&&(sk.stun>=100||!d.stunImm)&&Math.random()*100<sk.stun){d.stun=1;say(`${josa(d.ch.name,'은/는')} 기절했다.`,{pop:tx(you,'기절'),fx:{side:you,k:'stun'},sfx:'stun'})}
  if(d.hp>0&&sk.shock&&!d.shock){d.shock=true;d.shockT=0;say(`${josa(d.ch.name,'은/는')} 감전되었다.`,{pop:tx(you,'감전'),sfx:'zap'})}
  if(d.hp>0&&sk.dot){d.dot={pct:sk.dot,t:3};say(`${josa(d.ch.name,'은/는')} 지속 피해를 입는다.`,{pop:tx(you,'지속'),sfx:'down'})}
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
  if(f.hp>0)f.mp=Math.min(f.mpm,f.mp+f.mpRegen);
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
 run.party.forEach(f=>{if(f.hp>0)addExp(f.ch.id,xp)});
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
 if(dmg)pool.push({k:'heal',t:'회복',d:'HP 40%'},{k:'heal',t:'회복',d:'HP 40%'});
 if(down)pool.push({k:'revive',t:'부활',d:'HP 50%'},{k:'revive',t:'부활',d:'HP 50%'});
 const out=[];while(out.length<3&&pool.length){const i=Math.floor(Math.random()*pool.length);const c=pool.splice(i,1)[0];if(!out.some(o=>o.k===c.k))out.push(c)}
 return out}

function pickReward(i){
 const c=run.cards[i];
 if(c.k==='atk'||c.k==='def'||c.k==='spd')run.buf[c.k]+=.08;
 else if(c.k==='hp')run.party.forEach(f=>{const n=Math.round(f.maxhp*1.1);if(f.hp>0)f.hp+=n-f.maxhp;f.maxhp=n});
 else if(c.k==='heal')run.party.forEach(f=>{if(f.hp>0)f.hp=Math.min(f.maxhp,f.hp+Math.round(f.maxhp*.4))});
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
 if(o.bt<CFG.BT_MAX){o.bt++;return{kind:'char',ch,tag:`돌파 ${o.bt}`}}
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
  :`<div class="rc r${r.ch.star}"><div class="tile" style="--c:${EC[r.ch.el]}"><b>${r.ch.name[0]}</b>${imgTag(r.ch)}</div>${r.ch.name}<small>${r.tag}</small></div>`).join('');
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
 const rows=[['소속',p.aff],['성별',p.sex],['나이',p.age],['신체',p.ht],['종족',p.race||c.race],['주 오행',p.el||c.el],['능력',p.abil]].filter(r=>r[1]);
 const intro=p.intro||LORE[c.id];
 return `${p.rom?`<div class="sub">${p.rom}</div>`:''}<div class="pg">${rows.map(r=>`<span>${r[0]}</span><b>${r[1]}</b>`).join('')}</div>${intro?`<div class="intro">${intro}</div>`:''}`}
function btHtml(c,o){const n=o?o.bt:0,b=btFx(n);
 const sum=`<div class="btsum"><span>능력치<b>+${n*8}%</b></span><span>스킬 위력<b>+${Math.round((b.pow-1)*100)}%</b></span><span>시작 MP<b>${b.mp}</b></span><span>MP 회복<b>+${b.reg}</b></span></div>`;
 const rows=BT_X.map((x,i)=>`<div class="bs ${i<n?'on':''}"><i>${i+1}</i><span>능력치 +8%${x?' · '+x:''}</span></div>`).join('');
 const how=o?`<div class="sub" style="margin-top:.7em">${n>=CFG.BT_MAX?`${AP} ${CFG.AP_DUP[c.star]||1}`:'중복 획득 시 돌파'}</div>`:'';
 return sum+rows+how}
function detHtml(id,train){
 const c=CHM[id],o=S.chars[id];
 const head=`<div class="dh">${train?'':tileHtml(c)}<div><div class="nm">${c.name}</div><div class="sub">${rank(c.star)}${o?`Lv.${o.lv} / ${CFG.LV_MAX}`:''}</div></div></div>`;
 const tabs=train?`<div class="row">${[['info','INFO'],['bt','돌파'],['lore','PROFILE']].map(t=>`<button class="mini ${arcTab===t[0]?'on':''}" onclick="arcT('${t[0]}')">${t[1]}</button>`).join('')}</div>`:'';
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
 const card=(sd,inner)=>`<div class="cb" id="${sd}C"><div class="act" id="${sd}Act"></div><div class="pop" id="${sd}Pop"></div>${inner}<div class="fxl" id="${sd}Fx"></div>
  <div class="who"><span id="${sd}Nm"></span><span id="${sd}Lv"></span></div><div class="hpl"><i id="${sd}Bar"></i></div><div class="mpl"><i id="${sd}Mp"></i></div><div class="hn" id="${sd}Hn"></div><div class="stt" id="${sd}St"></div></div>`;
 show(`<div class="bg" id="bgm" style="background-image:linear-gradient(170deg,${m.g[0]},${m.g[1]})"></div><div class="veil"></div>
 <div class="where">${m.name} · ${run.wave}</div>
 ${card('e',`<div class="pf" id="ePF" style="--c:${EC[E.ch.el]}"><b>${E.ch.name[0]}</b>${IMG('battle',E.ch)}</div>`)}
 ${card('p',`<div class="pf" id="pPF"></div>`)}
 <div id="cards"></div><div id="sideL" class="side l"></div><div id="sideR" class="side r"></div><div id="ovl"></div>`);
 const s=snap();lastHp={e:s.e.hp,p:s.p.hp,id:s.p.id};
 $('eNm').textContent=E.ch.name;$('eLv').textContent='Lv.'+E.lv;
 $('pPF').dataset.id='';
 paintInfo(s,false);paintMenu();
 const img=new Image();img.onload=()=>{const b=$('bgm');if(b)b.style.backgroundImage=`url(maps/${m.id}.png)`};img.src=`maps/${m.id}.png`}

function restart(el,cls){if(!el)return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);el.addEventListener('animationend',()=>el.classList.remove(cls),{once:true})}
function flash(id){restart($(id),'hit')}
function pop(side,v,cls){const el=$(side+'Pop');if(!el)return;el.textContent=v;el.className='pop'+(cls?' '+cls:'');void el.offsetWidth;el.classList.add('go')}
function showAct(a){const el=$(a.side+'Act');if(!el)return;el.innerHTML=`${svg(a.k)}<span>${a.n}</span>`;restart(el,'go')}
function lunge(side){restart($(side+'PF'),'lg')}
function shake(){restart($('screen'),'shake')}
function playFx(f){const el=$(f.side+'Fx');if(!el)return;el.className='fxl';el.style.setProperty('--c',f.c||'#f2f2f0');void el.offsetWidth;el.classList.add(f.k);clearTimeout(el._t);el._t=setTimeout(()=>{el.className='fxl'},1000);
 if(f.k==='dodge')restart($(f.side+'PF'),'dg')}
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
   return `<button class="sc" ${P.mp<mpCost(s,i)?'disabled':''} onclick="act(${i})">${skFace(P.ch,i,s,l)}</button>`}).join('');
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
