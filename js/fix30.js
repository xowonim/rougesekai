/* 30차 수정: 상태이상 알약 표시 · 아낙 낙인 해제 · 오스카 · 백백도/오스카 프로필 */
(function(){
/* ---------- 상태이상 알약 ---------- */
const PL={
 stun:['스턴','#b8891f'],shock:['감전','#a8941a'],evade:['회피','#3f8fb0'],seal:['봉인','#7d68b0'],love:['매혹','#c85a8c'],
 dot:['지속','#b5572c'],debuff:['약화','#6f7480'],buff:['강화','#3f9a5c'],psn:['중독','#8a52b8'],conf:['혼란','#c0702e'],
 petri:['석화','#7a766a'],rage:['분노','#c93d2b'],sloth:['나태','#5f7692'],brand:['낙인','#8a1c1c'],dis:['부조화','#2f918a'],
 frz:['빙결','#4d9fcc'],ice:['얼음','#6fb0d8'],dive:['잠수','#3f6a96'],ckb:['방어 UP','#3f6fa8'],invc:['무적','#c08a1c']};
const EYE='<svg viewBox="0 0 24 14" style="width:1.6em;height:.95em;display:block"><path d="M1 7C5 1 19 1 23 7 19 13 5 13 1 7z" fill="#0b0b0b" stroke="#e6e6e6" stroke-width="1"/><circle cx="12" cy="7" r="3.8" fill="#d41818"/><circle cx="12" cy="7" r="1.4" fill="#000"/></svg>';
Object.assign(SVGP,{
 ckb:'<path d="M6 11h12v9H6zM9 11V8a3 3 0 0 1 6 0v3"/>',
 invc:'<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6zM9 12l2 2 4-4"/>'});
['ckb','invc'].forEach(k=>{if(!ICKEYS.includes(k))ICKEYS.push(k);STICON[k]=k});
const pill=(k,n)=>{if(k==='buff')return '';if(k==='brand')return `<span class="eyes">${EYE.repeat(Math.max(1,Math.min(7,n|0||1)))}</span>`;const p=PL[k];return `<span class="sp" style="--c:${p[1]}">${p[0]}</span>`};
function pillize(h,n){
 if(!h||h.indexOf('<svg')<0)return h;
 const rev=new Map();Object.keys(SVGP).forEach(k=>{if(PL[k]&&!rev.has(SVGP[k]))rev.set(SVGP[k],k)});
 const keys=[];
 let out=h.replace(/<span><svg class="si"[^>]*>([\s\S]*?)<\/svg><\/span>/g,(m,inner)=>{
  const k=rev.get(inner.replace(/<(\w+)([^>]*)><\/\1>/g,'<$1$2/>'));if(!k)return m;
  if(keys.includes(k))return '';keys.push(k);return '\u0001'+k+'\u0001'});
 if(keys.includes('invc')&&keys.includes('evade'))out=out.replace('\u0001evade\u0001','');
 return out.replace(/\u0001(\w+)\u0001/g,(m,k)=>pill(k,n))}
(function(){const s=document.createElement('style');
 s.textContent='.stt{flex-wrap:wrap;height:auto;min-height:1.2em;gap:.25em}.pst{flex-wrap:wrap}.cb .stt{position:absolute;top:.4em;right:.4em;margin:0;height:auto;max-width:92%;justify-content:flex-end;font-size:.7em;pointer-events:none}.eyes{display:inline-flex;align-items:center;gap:.2em}.sp{display:inline-flex;align-items:center;gap:.3em;padding:.1em .7em;border-radius:999px;background:var(--c);color:#fff;font-size:.95em;font-weight:600;line-height:1.4;white-space:nowrap;letter-spacing:0}';
 document.head.appendChild(s)})();
const _stIc30=stIc;
stIc=function(f){let h=_stIc30(f);if(f.ckStk>0)h+=`<span>${svg('ckb')}</span>`;if(f.inv>0)h+=`<span>${svg('invc')}</span>`;return pillize(h,f.brand)};
const _snap30=snap;
snap=function(){
 const s=_snap30();
 const add=(o,f)=>{if(!o||!f)return;o.st=o.st||{};o.st.ckb=(f.ckStk|0)>0;o.st.brandN=f.brand|0;o.st.invc=f.inv>0};
 try{
  if(run.dbl){add(s.p,dA());add(s.e,run.eA||run.enemy);add(s.q,dB());add(s.f,run.enemy2)}
  else{add(s.p,run.party[run.active]);add(s.e,run.enemy)}
 }catch(e){}
 return s};
const _pi30=paintInfo;
paintInfo=function(s,fl,popv){_pi30(s,fl,popv);
 try{document.querySelectorAll('.stt').forEach(e=>{const pos=e.id.replace(/St$/,''),n=s&&s[pos]&&s[pos].st?s[pos].st.brandN:0,h=pillize(e.innerHTML,n);if(h!==e.innerHTML)e.innerHTML=h})}catch(e){}};

/* ---------- 아낙 전투 종료 시 낙인 해제 ---------- */
const _rc30=rewardCards;
rewardCards=function(){
 try{
  const ids=[run.enemy,run.enemy2,run.eA,run.eB].filter(Boolean).map(x=>x.ch&&x.ch.id);
  if(ids.includes('anax')){run.party.forEach(f=>{f.brand=0});run.brandKO=false}
 }catch(e){}
 return _rc30.apply(this,arguments)};

/* ---------- 프로필 ---------- */
Object.assign(PROF,{
 baekdo:{full:'백백도',rom:'Baek Baekdo / 白白道',aff:'이원향',sex:'남성',age:'2331세',ht:'179cm',race:'원향족',el:'金',abil:'—',
  intro:'이원향을 지키는 백호부대의 대원 중 한 명. 부대에서 유일하게 ‘오덕’을 다루지 못한다. 이성을 잃으면 백호의 힘이 발현된다는데⋯ 본인은 이 사실을 전혀 모르는 듯 하다.'},
 oscar:{full:'오스카',rom:'Oscar / 大塚',aff:'예르모 행성',sex:'남성',age:'508세',ht:'190cm',race:'예르모족',el:'金',abil:'분장을 다루는 능력',
  intro:'오스카의 여관의 주인. <예르모의 영웅>의 친구라고 한다. 몹시 호탕하고 장난끼가 많은 성격에 타인을 애칭으로 부르는 걸 즐기고 있다.'}});

/* ---------- 오스카 ---------- */
CHM.oscar.sk=[
 G('체크인','여관에 체크인해 푹 쉰다. 3턴간 방어력이 10% 오른다. 최대 3번까지 겹친다.',0,{mp:8,ck:1,kn:'자기 변화'}),
 H('옷장','옷장 속에 숨겨 준다. 1턴 동안 선택한 대상은 공격을 받지 않는다. 본인도 고를 수 있다.',0,{mp:12,closet:1,kn:'상대 변화'}),
 A('소멸','분장으로 정체를 감추고 두 번 연달아 후려친다. 준 피해의 50%를 흡수한다.',100,{acc:50,multi:[2,2],dr:50,mp:20,kn:'단일 연속 공격'})];
const _rbs30=resetBattleState;
resetBattleState=function(f){_rbs30(f);f.ckStk=0;f.ckT=0};
const _st30=st;
st=function(f,k){let v=_st30(f,k);if(k==='def'&&f.ckStk>0)v*=1+.1*f.ckStk;if(k==='spd'&&f.csFirst)v+=2e6;return v};
const _dk30=dKind;
dKind=function(sk,team){if(sk&&sk.ck)return 'self';return _dk30(sk,team)};
const _perf30=perform;
function cast30(a,d,idx,ev,sk){
 const n0=ev.length,ot=sk.t,op=sk.p,sv={d:a.d,dT:a.dT,dot:a.dot,hp:a.hp};
 sk.t='h';sk.p=0;
 try{_perf30(a,d,idx,ev)}finally{sk.t=ot;sk.p=op}
 a.d=sv.d;a.dT=sv.dT;a.dot=sv.dot;a.hp=sv.hp;
 const mine=ev.slice(n0);
 const ok=mine.some(e=>e.t===`${a.ch.name}의 ${sk.n}`)&&!mine.some(e=>e.t==='효과가 없었다.');
 for(let i=ev.length-1;i>=n0;i--){if(typeof ev[i].t==='string'&&/ HP \d+ 회복$/.test(ev[i].t))ev.splice(i,1)}
 return ok}
const S30=f=>(run&&run.dbl)?(f.pos||f.side):f.side;
const evx30=(ev,t,f,v,o)=>{o=o||{};ev.push({t,s:snap(),raw:true,pop:v!==undefined?{side:S30(f),v,cls:'tx'}:undefined,fx:o.fx?{side:S30(f),...o.fx}:undefined,sfx:o.sfx})};
perform=function(a,d,idx,ev){
 const sk=idx<0?BASIC:a.ch.sk[idx];
 if(sk&&sk.ck){
  if(!cast30(a,d,idx,ev,sk))return;
  a.ckStk=Math.min(3,(a.ckStk||0)+1);a.ckT=3;
  evx30(ev,`${a.ch.name} 방어력 ${a.ckStk*10}% 상승`,a,'방어 UP x'+a.ckStk,{fx:{k:'up',c:'#6fa0dc'},sfx:'up'});return}
 if(sk&&sk.closet){
  if(!cast30(a,d,idx,ev,sk))return;
  a.inv=1;
  evx30(ev,`${josa(a.ch.name,'은/는')} 옷장에 숨어 공격을 받지 않는다.`,a,'무적',{fx:{k:'up',c:'#e0c060'},sfx:'up'});return}
 return _perf30(a,d,idx,ev)};
const _eot30=endOfTurn;
endOfTurn=function(ev){
 const L=[run.party[run.active],run.enemy].filter(Boolean);
 _eot30(ev);
 L.forEach(f=>{if(f.hp>0&&f.ckT>0&&--f.ckT===0)f.ckStk=0})};
const _ai30=aiPick;
aiPick=function(e,p){
 const r=_ai30(e,p);
 if(r>=0){const s=e.ch.sk[r];if(s&&((s.ck&&(e.ckStk||0)>=3)||(s.closet&&e.inv>0)))return 0}
 return r};

/* ---------- 옷장: 속도와 관계없이 가장 먼저 발동 ---------- */
const _aiBase=aiPick;
aiPick=function(e,p){if(e.nxtPick!==undefined&&e.nxtPick!==null){const r=e.nxtPick;e.nxtPick=null;return r}return _aiBase(e,p)};
const _dt30=doTurn;
doTurn=function(action){
 const P=run&&run.party&&run.party[run.active],E=run&&run.enemy;
 try{
  if(P&&E&&!run.dbl&&action.type==='skill'){
   const s=action.i<0?null:P.ch.sk[action.i];if(s&&s.closet)P.csFirst=true;
   const r=_aiBase(E,P);E.nxtPick=r;const es=E.ch.sk[r];if(es&&es.closet)E.csFirst=true}
  return _dt30(action)
 }finally{[P,E].forEach(f=>{if(f){f.csFirst=false;f.nxtPick=null}})}};
const _dbt30=dblTurn;
dblTurn=function(acts){
 const L=[];
 try{
  [0,1].forEach(slot=>{const a=acts&&acts[slot],F=slot?dB():dA();
   if(F&&a&&a.type==='skill'&&a.i>=0&&F.ch.sk[a.i]&&F.ch.sk[a.i].closet){F.csFirst=true;L.push(F)}});
  return _dbt30(acts)
 }finally{L.forEach(f=>{f.csFirst=false})}};

/* ---------- 더블 배틀 출전 선택: 첫 캐릭터는 이미 출전, 두 번째만 고르면 바로 시작 ---------- */
(function(){const s=document.createElement('style');
 s.textContent='.dbd{font-style:normal;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;width:1.5em;height:1.5em;min-width:0;line-height:1;font-size:.8em;margin-right:.5em;vertical-align:.1em;border:1px solid var(--fg);border-radius:50%;font-weight:600}';
 document.head.appendChild(s)})();
function dsGo(i){
 run.pB=i;run.dsel=null;run.active=run.pA;
 dTag();run.note='';dblNextRound()}
drawSel=function(){
 if(D$('dlg'))return;
 const A0=run.pA;
 if(!run.party.some((f,i)=>i!==A0&&f.hp>0)){dsGo(-1);return}
 const rows=run.party.map((f,i)=>dRow(f,i,{off:f.hp<=0&&i!==A0,on:i===A0,badge:i===A0?1:0,fn:'dblSelPick'})).join('');
 D$('ovl').innerHTML=`<div class="ov"><div class="plist"><div class="dselt">${josa(run.party[A0].ch.name,'과/와')} 함께 출전할 캐릭터를 선택하세요</div>${rows}</div></div>`};
dblSelPick=function(i){
 if(!run||!run.dbl||run.phase!=='dsel'||busy)return;
 if(i===run.pA||!run.party[i]||run.party[i].hp<=0)return;
 dsGo(i)};
dblSelOk=function(){};
})();