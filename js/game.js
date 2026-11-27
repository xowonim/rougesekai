/* =====================================================================
   능력치 / 저장 / 유틸
   ===================================================================== */
const BASE={4:{hp:90,atk:22,def:12,spd:10},5:{hp:110,atk:26,def:14,spd:11},6:{hp:140,atk:32,def:18,spd:12}};
const ROLE={a:{hp:.92,atk:1.15,def:.95,spd:1},t:{hp:1.2,atk:.92,def:1.2,spd:.9},s:{hp:1,atk:1,def:1,spd:1.25},u:{hp:1.05,atk:.9,def:1.05,spd:1},m:{hp:1,atk:1,def:1,spd:1}};
function calcStats(ch,lv,bt){const b=BASE[ch.star],r=ROLE[ch.role],g=(1+.07*(lv-1))*(1+.08*(bt||0));
 return{hp:Math.round(b.hp*r.hp*g),atk:Math.round(b.atk*r.atk*g),def:Math.round(b.def*r.def*g),spd:Math.round(b.spd*r.spd*(1+.02*(lv-1)))}}
const expNeed=lv=>20+lv*10;
const MATS={s:{n:'소',x:100},m:{n:'중',x:350},l:{n:'대',x:1000}};

const KEY='kamisekai_rogue_v1';
let S;
function freshSave(){return{coin:CFG.START_COIN,chars:{luihu:{lv:1,exp:0,bt:0},cheonryong:{lv:1,exp:0,bt:0}},mats:{s:3,m:0,l:0},pity:0,best:0,runs:0,pulls:0,party:['luihu','cheonryong']}}
function load(){try{const r=localStorage.getItem(KEY);S=r?JSON.parse(r):freshSave()}catch(e){S=freshSave()}
 const f=freshSave();for(const k in f)if(S[k]===undefined)S[k]=f[k]}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}

const rnd=a=>a[Math.floor(Math.random()*a.length)];
const $=id=>document.getElementById(id);
function josa(w,p){const c=w.charCodeAt(w.length-1);const has=c>=0xAC00&&c<=0xD7A3&&((c-0xAC00)%28)!==0;const[a,b]=p.split('/');return w+(has?a:b)}
const stars=n=>'★'.repeat(n);
const elChip=e=>`<span class="el" style="--c:${EC[e]}">${e}</span>`;
const imgTag=ch=>`<img src="chars/${ch.id}.png" alt="" onerror="this.remove()">`;
const ico=(ch,extra)=>`<div class="ico ${extra||''}" style="--c:${EC[ch.el]}"><b>${ch.name[0]}</b>${imgTag(ch)}</div>`;
const hpColor=r=>r>.5?'#58c868':r>.2?'#e8c038':'#e04838';
function fx(s){const a=[];
 if(s.t==='a'){a.push('위력 '+s.p);if(s.stun)a.push('기절 '+s.stun+'%');if(s.drain)a.push('흡혈');if(s.recoil)a.push('반동');if(s.dot)a.push('지속');if(s.ign)a.push('방어 무시');if(s.acc&&s.acc<95)a.push('명중 '+s.acc+'%');if(s.selfStun)a.push('다음 턴 정지')}
 else if(s.t==='h')a.push('회복 '+s.p+'%');
 else if(s.t==='b')a.push('공격 +'+s.p+'%');
 else if(s.t==='g')a.push('방어 +'+s.p+'%');
 else if(s.t==='w')a.push('상대 공방 -'+s.p+'%');
 else if(s.t==='z')a.push('다음 공격 회피');
 return a.join(' · ')}

/* =====================================================================
   전투 로직
   ===================================================================== */
let run=null,busy=false,skipFn=null,lastHp={};
function newFighter(ch,lv,bt,side,mult){const s=calcStats(ch,lv,bt);mult=mult||{};const k=mult.all||1;
 const f={ch,lv,side,maxhp:Math.round(s.hp*(mult.hp||1)*k),atk:s.atk*(mult.atk||1)*k,def:s.def*(mult.def||1)*k,spd:s.spd,hp:0};
 f.hp=f.maxhp;resetBattleState(f);return f}
function resetBattleState(f){f.m={atk:0,def:0};f.mT=0;f.d={atk:0,def:0};f.dT=0;f.evade=0;f.stun=0;f.stunImm=0;f.dot=null;f.pp=f.ch.sk.map(s=>s.pp)}
function st(f,k){let v=f[k];if(f.side==='p'&&run)v*=1+run.buf[k];
 if(k==='atk'||k==='def')v*=Math.max(.4,1+f.m[k]-f.d[k]);return v}

function startRun(ids){
 run={wave:1,party:ids.map(id=>{const c=S.chars[id];return newFighter(CHM[id],c.lv,c.bt,'p')}),active:0,buf:{atk:0,def:0,spd:0},gained:0,won:0,enemy:null,phase:'menu',sub:'cmd',note:''};
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
 run.party.forEach(f=>{f.m={atk:0,def:0};f.mT=0;f.d={atk:0,def:0};f.dT=0;f.evade=0;f.stun=0;f.stunImm=0;f.dot=null;f.pp=f.ch.sk.map(s=>s.pp)});
 if(run.party[run.active].hp<=0)run.active=run.party.findIndex(f=>f.hp>0);
 const e=run.enemy;
 run.note=((w-1)%CFG.MAP_STAGES===0?`${m.name}에 도착했다. `:'')+(e.boss?`지역의 주인, ${josa(e.ch.name,'이/가')} 나타났다!`:`${josa(e.ch.name,'이/가')} 앞을 가로막는다.`);
 run.phase='menu';run.sub='cmd';
 drawBattle()}

function snap(){const P=run.party[run.active],E=run.enemy;
 return{p:{id:P.ch.id,name:P.ch.name,hp:P.hp,max:P.maxhp,lv:P.lv,el:P.ch.el},e:{hp:E.hp,max:E.maxhp}}}

function hitCalc(a,d,sk){
 const def=st(d,'def')*(1-(sk.ign||0));
 const em=elMult(a.ch.el,d.ch.el);
 const crit=Math.random()<.06;
 const dmg=sk.p*(st(a,'atk')/def)*.34*em*(.9+Math.random()*.2)*(crit?1.5:1);
 return{dmg:Math.max(1,Math.round(dmg)),em,crit}}

function perform(a,d,idx,ev){
 const say=(t)=>ev.push({t,s:snap()});
 const sk=idx<0?BASIC:a.ch.sk[idx];
 if(a.stun>0){a.stun--;a.stunImm=1;say(`${josa(a.ch.name,'은/는')} 움직이지 못한다!`);return}
 if(idx>=0)a.pp[idx]--;
 say(`${a.ch.name}의 ${sk.n}!`);
 if(sk.t==='a'){
  if(Math.random()*100>=(sk.acc||95)){say('공격이 빗나갔다.');return}
  if(d.evade>0){d.evade=0;say(`${josa(d.ch.name,'은/는')} 공격을 피했다!`);return}
  const h=hitCalc(a,d,sk);
  d.hp=Math.max(0,d.hp-h.dmg);
  say(`${d.ch.name}에게 ${h.dmg} 피해!`+(h.crit?' 급소에 맞았다!':'')+(h.em>1?' 효과가 굉장했다!':h.em<1?' 효과가 별로인 듯하다...':''));
  if(sk.drain&&a.hp>0){const g=Math.round(h.dmg*.5);a.hp=Math.min(a.maxhp,a.hp+g);say(`${a.ch.name}의 생명력이 ${g} 회복되었다.`)}
  if(sk.recoil&&a.hp>0){const r=Math.round(h.dmg*sk.recoil/100);a.hp=Math.max(0,a.hp-r);say(`${a.ch.name}의 반동 피해 ${r}.`)}
  if(d.hp>0&&sk.stun&&d.stun<=0&&!d.stunImm&&Math.random()*100<sk.stun){d.stun=1;say(`${josa(d.ch.name,'은/는')} 움직일 수 없게 되었다!`)}
  if(d.hp>0&&sk.dot){d.dot={pct:sk.dot,t:3};say(`${josa(d.ch.name,'은/는')} 지속 피해를 입는다.`)}
  if(sk.selfStun&&a.hp>0)a.stun=1;
 }else if(sk.t==='h'){
  const g=Math.round(a.maxhp*sk.p/100),before=a.hp;a.hp=Math.min(a.maxhp,a.hp+g);
  a.d={atk:0,def:0};a.dT=0;a.dot=null;
  say(`${a.ch.name}의 HP가 ${a.hp-before} 회복되었다.`);
 }else if(sk.t==='b'){a.m.atk=Math.max(a.m.atk,sk.p/100);a.mT=3;say(`${a.ch.name}의 공격이 올랐다!`)}
 else if(sk.t==='g'){a.m.def=Math.max(a.m.def,sk.p/100);a.mT=3;say(`${a.ch.name}의 방어가 올랐다!`)}
 else if(sk.t==='w'){d.d.atk=Math.max(d.d.atk,sk.p/100);d.d.def=Math.max(d.d.def,sk.p/100);d.dT=3;say(`${d.ch.name}의 공격과 방어가 떨어졌다!`)}
 else if(sk.t==='z'){a.evade=2;say(`${josa(a.ch.name,'은/는')} 다음 공격에 대비한다.`)}
}

function aiPick(e,p){
 const cand=[];
 e.ch.sk.forEach((s,i)=>{
  if(e.pp[i]<=0)return;
  if(s.t==='b'&&e.m.atk>0)return;
  if(s.t==='g'&&e.m.def>0)return;
  if(s.t==='w'&&p.d.atk>0)return;
  if(s.t==='z'&&e.evade>0)return;
  if(s.t==='h'&&e.hp>e.maxhp*.7)return;
  cand.push(i)});
 if(e.hp<e.maxhp*.4){const h=cand.find(i=>e.ch.sk[i].t==='h');if(h!==undefined&&Math.random()<.75)return h}
 if(cand.length&&Math.random()<.7)return rnd(cand);
 return -1}

function endOfTurn(ev){
 const say=(t)=>ev.push({t,s:snap()});
 [run.party[run.active],run.enemy].forEach(f=>{
  if(f.hp>0&&f.dot){const v=Math.max(1,Math.round(f.maxhp*f.dot.pct/100));f.hp=Math.max(0,f.hp-v);say(`${f.ch.name}의 HP가 지속 피해로 ${v} 줄었다.`);f.dot.t--;if(f.dot.t<=0)f.dot=null}
  if(f.mT>0&&--f.mT<=0)f.m={atk:0,def:0};
  if(f.dT>0&&--f.dT<=0)f.d={atk:0,def:0};
  if(f.evade>0)f.evade--;
  if(f.stunImm>0)f.stunImm--;
 })}

function doTurn(action){
 const ev=[];const P=()=>run.party[run.active],E=run.enemy;
 const say=(t)=>ev.push({t,s:snap()});
 let order;
 if(action.type==='switch'){
  const old=P();run.active=action.to;
  say(`${old.ch.name}, 돌아와! 가라, ${P().ch.name}!`);
  order=['e'];
 }else{
  const ps=st(P(),'spd'),es=st(E,'spd');
  order=(ps>es||(ps===es&&Math.random()<.5))?['p','e']:['e','p'];
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
  say(`${josa(P().ch.name,'은/는')} 쓰러졌다!`);
  result=run.party.some(f=>f.hp>0)?'forced':'lose';
 }
 if(result==='win')say(`${josa(E.ch.name,'을/를')} 쓰러뜨렸다!`);
 return{ev,result}}

function addExp(id,amt){const c=S.chars[id];if(c.lv>=CFG.LV_MAX)return;c.exp+=amt;
 while(c.lv<CFG.LV_MAX&&c.exp>=expNeed(c.lv)){c.exp-=expNeed(c.lv);c.lv++}
 if(c.lv>=CFG.LV_MAX)c.exp=0}

function winBattle(){
 if(!run.party.some(f=>f.hp>0)){run.note='모두 쓰러지고 말았다.';loseRun();return}
 const w=run.wave,boss=run.enemy.boss;
 const coin=12+3*w+(boss?80+2*w:0);
 S.coin+=coin;run.gained+=coin;run.won=w;
 const xp=12+3*w;
 run.party.forEach(f=>{if(f.hp>0)addExp(f.ch.id,xp)});
 if(S.best<w)S.best=w;
 save();
 run.note=`기운 ${coin} 획득.`;
 run.phase='reward';run.cards=rewardCards()}

function rewardCards(){
 const dmg=run.party.some(f=>f.hp>0&&f.hp<f.maxhp*.8),down=run.party.some(f=>f.hp<=0),w=run.wave;
 const pool=[
  {k:'atk',t:'공격 강화',d:'공격 +8%'},
  {k:'def',t:'방어 강화',d:'방어 +8%'},
  {k:'spd',t:'신속',d:'속도 +8%'},
  {k:'hp',t:'체력 강화',d:'최대 HP +10%'},
  {k:'exp',t:'수련',d:`경험치 +${20+w*6}`},
  {k:'purse',t:'기운 주머니',d:`기운 +${60+w*4}`}];
 if(dmg)pool.push({k:'heal',t:'회복',d:'HP 40% 회복'},{k:'heal',t:'회복',d:'HP 40% 회복'});
 if(down)pool.push({k:'revive',t:'부활',d:'쓰러진 동료 HP 50%로 부활'},{k:'revive',t:'부활',d:'쓰러진 동료 HP 50%로 부활'});
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

function loseRun(){run.phase='over';save()}

/* =====================================================================
   가챠
   ===================================================================== */
function pullOnce(){
 S.pity++;S.pulls++;
 const r=Math.random()*100;let star;
 if(S.pity>=CFG.PITY)star=Math.random()*13.5<1.5?6:5;
 else if(r<1.5)star=6;else if(r<13.5)star=5;else if(r<50)star=4;else star=0;
 if(star>=5)S.pity=0;
 if(!star){const x=Math.random()*100;const k=x<65?'s':x<93?'m':'l';S.mats[k]++;return{kind:'mat',k}}
 const ch=rnd(CH.filter(c=>c.star===star));
 const o=S.chars[ch.id];
 if(!o){S.chars[ch.id]={lv:1,exp:0,bt:0};return{kind:'char',ch,tag:'신규'}}
 if(o.bt<5){o.bt++;return{kind:'char',ch,tag:'돌파'}}
 S.mats.l++;return{kind:'char',ch,tag:'수련서'}}

/* =====================================================================
   화면
   ===================================================================== */
let party=[],cur='luihu';
function show(h){$('screen').innerHTML=h}
const coinBox=()=>`<div class="win coin">기운 ${S.coin.toLocaleString()}</div>`;

function toTitle(){
 run=null;busy=false;skipFn=null;
 show(`<div class="bg star"></div>${coinBox()}${S.best?`<div class="win best">최고 ${S.best}</div>`:''}
 <div class="logo"><div class="h">神世界</div><div class="s">KAMISEKAI</div></div>
 <div class="win menu"><button class="opt" onclick="toPrep()">출정</button><button class="opt" onclick="toGacha()">뽑기</button><button class="opt" onclick="resetAsk()">초기화</button></div>`)}
function resetAsk(){if(confirm('저장 데이터를 초기화합니다.')){try{localStorage.removeItem(KEY)}catch(e){}S=freshSave();save();toTitle()}}

/* ---- 출정 준비 ---- */
function toPrep(){
 party=S.party.filter(id=>S.chars[id]).slice(0,CFG.PARTY_MAX);
 if(!party.length)party=['luihu'];
 cur=party[0];drawPrep()}
function drawPrep(){
 const gs=$('pgrid')?$('pgrid').scrollTop:0;
 const icons=CH.map(c=>{const o=S.chars[c.id],i=party.indexOf(c.id);
  return `<div class="ico ${o?'':'lk'} ${i>=0?'in':''}" style="--c:${EC[c.el]}" onmouseenter="hov('${c.id}')" onclick="pick('${c.id}')"><b>${c.name[0]}</b>${imgTag(c)}${i>=0?`<em>${i+1}</em>`:''}</div>`}).join('');
 const slots=[0,1,2].map(i=>{const c=party[i]&&CHM[party[i]];
  return `<div class="slot" onclick="drop(${i})">${c?`${ico(c)}<span>${c.name}</span>`:''}</div>`}).join('');
 show(`<div class="bg dark"></div><div class="win pgrid" id="pgrid">${icons}</div><div class="win pdet" id="pdet"></div>
 <div class="win pparty">${slots}<div class="sp"></div><button class="opt" ${party.length?'':'disabled'} onclick="start()">출정</button><button class="opt" onclick="toTitle()">뒤로</button></div>`);
 $('pgrid').scrollTop=gs;drawDet()}
function hov(id){cur=id;drawDet()}
function pick(id){cur=id;
 if(S.chars[id]){const i=party.indexOf(id);if(i>=0)party.splice(i,1);else if(party.length<CFG.PARTY_MAX)party.push(id)}
 drawPrep()}
function drop(i){party.splice(i,1);drawPrep()}
function drawDet(){
 const el=$('pdet');if(!el)return;
 const c=CHM[cur],o=S.chars[cur];
 if(!o){el.innerHTML=`<div class="dh"><div class="ico lk" style="--c:${EC[c.el]}"><b>?</b></div><div><div class="nm">???</div><div class="sub star">${stars(c.star)}</div></div></div>`;return}
 const s=calcStats(c,o.lv,o.bt),need=expNeed(o.lv),pct=o.lv>=CFG.LV_MAX?100:Math.round(o.exp/need*100);
 el.innerHTML=`<div class="dh">${ico(c)}<div><div class="nm">${c.name}</div><div class="sub">${c.race} ${elChip(c.el)} <span class="star">${stars(c.star)}</span></div><div class="sub">Lv.${o.lv} · 돌파 ${o.bt}</div></div></div>
 <div class="xp"><i style="width:${pct}%"></i></div>
 <div class="st"><span>HP<b>${s.hp}</b></span><span>공격<b>${s.atk}</b></span><span>방어<b>${s.def}</b></span><span>속도<b>${s.spd}</b></span></div>
 ${c.sk.map((k,i)=>`<div class="sk"><b>${'①②③'[i]} ${k.n}</b><span>${fx(k)}</span></div>`).join('')}
 <div class="tr">${['s','m','l'].map(k=>`<button class="opt sm" ${S.mats[k]>0&&o.lv<CFG.LV_MAX?'':'disabled'} onclick="useMat('${c.id}','${k}')">수련서 ${MATS[k].n} ×${S.mats[k]}</button>`).join('')}</div>`}
function useMat(id,k){if(S.mats[k]<=0)return;S.mats[k]--;addExp(id,MATS[k].x);save();drawDet()}
function start(){S.party=party.slice();save();startRun(party.slice())}

/* ---- 뽑기 ---- */
function toGacha(){
 show(`<div class="bg dark"></div>${coinBox()}
 <div class="win gbox"><div class="gt">수집</div><div class="gp">${S.pity} / ${CFG.PITY}</div>
  <button class="opt" onclick="pull(1)">1회 · ${CFG.PULL_COST}</button>
  <button class="opt" onclick="pull(10)">10회 · ${CFG.PULL10_COST}</button></div>
 <div class="win back"><button class="opt" onclick="toTitle()">뒤로</button></div><div id="ovl"></div>`)}
function pull(n){
 const cost=n===10?CFG.PULL10_COST:CFG.PULL_COST;
 if(S.coin<cost){alert('기운이 부족합니다.');return}
 S.coin-=cost;const res=[];for(let i=0;i<n;i++)res.push(pullOnce());save();
 const cells=res.map(r=>r.kind==='mat'
  ?`<div class="rc"><div class="ico lk" style="--c:#c8ccd8"><b>書</b></div>수련서 ${MATS[r.k].n}</div>`
  :`<div class="rc r${r.ch.star}">${ico(r.ch)}${r.ch.name}<small>${r.tag}</small></div>`).join('');
 toGacha();
 $('ovl').innerHTML=`<div class="res" onclick="toGacha()"><div class="win rbox">${cells}</div></div>`}

/* ---- 전투 화면 ---- */
function bgStyle(m){return `background-image:linear-gradient(170deg,${m.g[0]},${m.g[1]})`}
function infoHtml(n,lv,el,hp,max,me,id){
 const r=Math.max(0,hp/max);let xp='';
 if(me){const o=S.chars[id];const need=expNeed(o.lv);xp=`<div class="xp"><i style="width:${o.lv>=CFG.LV_MAX?100:Math.round(o.exp/need*100)}%"></i></div>`}
 return `<div class="r1"><span>${n}</span><span>Lv.${lv}</span></div><div class="r2">${elChip(el)}<span class="hl">HP</span><div class="hpb"><i style="width:${r*100}%;background:${hpColor(r)}"></i></div></div>${me?`<div class="nums">${hp} / ${max}</div>${xp}`:''}`}

function drawBattle(){
 const m=mapOf(run.wave),E=run.enemy,s=snap();
 show(`<div class="bg" id="bgm" style="${bgStyle(m)}"></div><div class="gnd"></div>
 <div class="win where">${m.name} · ${run.wave}</div>
 <div class="plat" id="ePlat"></div><div class="plat" id="pPlat"></div>
 <div class="spr" id="eSpr" style="--c:${EC[E.ch.el]}"><b>${E.ch.name[0]}</b>${imgTag(E.ch)}</div>
 <div class="spr" id="pSpr"></div>
 <div class="win info" id="eInfo"></div><div class="win info" id="pInfo"></div>
 <div class="win" id="msg"></div><div class="win" id="cmd"></div><div id="ovl"></div>`);
 lastHp={e:s.e.hp,p:s.p.hp,id:s.p.id};
 paintInfo(s,false);paintMenu();
 const img=new Image();img.onload=()=>{const b=$('bgm');if(b)b.style.backgroundImage=`url(maps/${m.id}.png)`};img.src=`maps/${m.id}.png`}

function flash(id){const el=$(id);if(!el)return;el.classList.remove('hit');void el.offsetWidth;el.classList.add('hit')}
function paintInfo(s,fl){
 const E=run.enemy;
 $('eInfo').innerHTML=infoHtml(E.ch.name+(E.boss?' ★':''),E.lv,E.ch.el,s.e.hp,s.e.max,false);
 $('pInfo').innerHTML=infoHtml(s.p.name,s.p.lv,s.p.el,s.p.hp,s.p.max,true,s.p.id);
 const ps=$('pSpr');
 if(ps.dataset.id!==s.p.id){const c=CHM[s.p.id];ps.dataset.id=s.p.id;ps.style.setProperty('--c',EC[c.el]);ps.innerHTML=`<b>${c.name[0]}</b>${imgTag(c)}`}
 if(fl){if(lastHp.e>s.e.hp)flash('eSpr');if(lastHp.id===s.p.id&&lastHp.p>s.p.hp)flash('pSpr')}
 $('eSpr').classList.toggle('ko',s.e.hp<=0);ps.classList.toggle('ko',s.p.hp<=0);
 lastHp={e:s.e.hp,p:s.p.hp,id:s.p.id}}

function setMsg(t,full,extra){const m=$('msg');if(!m)return;m.innerHTML=`<div class="mt">${t}</div>${extra||''}`;m.classList.toggle('full',!!full)}
function paintMenu(){
 const P=run.party[run.active],c=$('cmd'),ph=run.phase;
 $('ovl').innerHTML='';
 c.style.display='none';
 if(ph==='menu'&&run.sub==='cmd'){
  setMsg(run.note||`${josa(P.ch.name,'은/는')} 무엇을 할까?`);
  c.style.display='';
  c.innerHTML=`<div class="cg"><button class="opt" onclick="sub('fight')">전투</button><button class="opt" onclick="openParty(false)">교체</button><button class="opt" onclick="quitRun()">도망</button><span></span></div>`}
 else if(ph==='menu'&&run.sub==='fight'){
  const opts=[{s:BASIC,i:-1}].concat(P.ch.sk.map((s,i)=>({s,i})));
  c.style.display='';
  c.innerHTML=`<div class="cg">${opts.map(({s,i})=>`<button class="opt sm" ${i>=0&&P.pp[i]<=0?'disabled':''} onmouseenter="skInfo(${i})" onclick="act(${i})">${s.n}</button>`).join('')}</div>`;
  skInfo(-1)}
 else if(ph==='play'){}
 else if(ph==='forced'){setMsg('다음 동료를 선택하세요.',true);openParty(true)}
 else if(ph==='reward'){
  setMsg(run.note,true);
  $('ovl').innerHTML=`<div class="cards">${run.cards.map((k,i)=>`<button class="win card" onclick="pickReward(${i})"><b>${k.t}</b><span>${k.d}</span></button>`).join('')}</div>`}
 else if(ph==='over'){
  setMsg(`${run.note?run.note+' ':''}${run.won}단계 클리어 · 기운 ${run.gained} 획득`);
  c.style.display='';
  c.innerHTML=`<div class="cg one"><button class="opt" onclick="toTitle()">확인</button></div>`}}

function sub(x){run.sub=x;paintMenu()}
function skInfo(i){
 const P=run.party[run.active];const s=i<0?BASIC:P.ch.sk[i];
 setMsg(`<div>${s.n}<small>${i<0?'위력 40':fx(s)+' · PP '+P.pp[i]+'/'+s.pp}</small></div>`,false,`<span class="bk" onclick="sub('cmd')">◀ 뒤로</span>`)}

function openParty(forced){
 $('ovl').innerHTML=`<div class="win plist">${run.party.map((f,i)=>{
  const dead=f.hp<=0,isCur=i===run.active&&!forced,r=f.hp/f.maxhp;
  return `<button class="prow" ${dead||isCur?'disabled':''} onclick="pickMember(${i})">${ico(f.ch)}<span class="pn">${f.ch.name}</span><span>Lv.${f.lv}</span><div class="hpb"><i style="width:${r*100}%;background:${hpColor(r)}"></i></div><span class="pv">${f.hp}/${f.maxhp}</span></button>`}).join('')}
  ${forced?'':'<button class="opt" onclick="document.getElementById(\'ovl\').innerHTML=\'\'">뒤로</button>'}</div>`}
function pickMember(i){
 if(busy)return;
 if(run.phase==='forced'){
  run.active=i;run.phase='menu';run.sub='cmd';run.note=`가라, ${run.party[i].ch.name}!`;
  paintInfo(snap(),false);paintMenu();return}
 $('ovl').innerHTML='';run.note='';runTurn({type:'switch',to:i})}

function act(i){
 if(busy||run.phase!=='menu')return;
 const P=run.party[run.active];if(i>=0&&P.pp[i]<=0)return;
 run.note='';runTurn({type:'skill',i})}

function runTurn(action){
 busy=true;run.phase='play';paintMenu();
 const r=doTurn(action);
 playEvents(r.ev,()=>{
  busy=false;skipFn=null;
  if(r.result==='win'){winBattle();paintMenu()}
  else if(r.result==='forced'){run.phase='forced';paintMenu()}
  else if(r.result==='lose'){loseRun();paintMenu()}
  else{run.phase='menu';run.sub='cmd';paintMenu()}})}

function playEvents(ev,done){
 let i=0,timer=null;
 const step=()=>{
  clearTimeout(timer);
  if(i>=ev.length){done();return}
  const e=ev[i++];setMsg(e.t,true);paintInfo(e.s,true);
  timer=setTimeout(step,700)};
 skipFn=step;step()}

function quitRun(){if(busy)return;if(confirm('출정을 마칩니다.')){run.note='';run.phase='over';paintMenu()}}

/* ---------- 시작 ---------- */
load();toTitle();
$('game').addEventListener('click',()=>{if(skipFn)skipFn()});
