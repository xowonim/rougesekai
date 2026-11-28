/* 27차 수정: '세상' 캐릭터 정리 (강 현 · 강승아 · 아네모네 · 에스쿠엘 · 타오테 · 혼돈)
   + 흑백 필드 · 현무의 힘 · 봉인(2턴) */
(function(){
const EL_O={'火':.5,'水':.5,'木':2,'金':2};

/* ---------- 스킬 데이터 ---------- */
CHM.hyun.sk=[
 A('창바늘','창처럼 긴 바늘로 찌른다. 2회 연속으로 공격한다.',55,{acc:90,multi:[2,2]}),
 W('독심','뱀으로 심리를 파악해 허점을 찌른다. 2턴간 상대의 ②, ③ 스킬을 봉인한다.',0,{acc:85,sealX:2,mp:12,kn:'상대 변화'}),
 A('탐색','상대의 과거를 탐색한다. 첫 턴에는 시간이 멈춰 흑백 필드가 되고, 다음 턴에 10회 연속으로 공격하며 필드가 풀린다.',50,{acc:100,sc:'범위',multi:[10,10],bw:1,mp:22})];
CHM.seunga.sk=[
 A('쿠나이','쿠나이와 표창을 던진다.',10,{acc:90,multi:[2,5]}),
 Z('순간이동','거북을 이용해 빠르게 이동한다. 1턴간 공격을 피하고, 속도가 3% 오른다. (최대 10중첩)',{tp:1,mp:8}),
 A('관망하는 자세','가만히 지켜보다 한꺼번에 쏟아낸다. 첫 턴에는 시간이 멈춰 흑백 필드가 되고, 다음 턴에 10회 연속으로 공격하며 필드가 풀린다.',55,{acc:100,sc:'범위',multi:[10,10],bw:1,mp:18})];
CHM.anemone.sk=[
 A('미미한 공격..','어딘가 힘이 빠진 공격을 한다. 火 · 水에게는 약하고 木 · 金에게는 강하다.',5,{acc:95,tm:EL_O}),
 A('선물 배달','선물을 배달한다. 받은 쪽은 기운이 빠진다. (공격력 10% 저하, 최대 2중첩)',-15,{acc:70,gift:1,mp:8}),
 B('고귀한 숙녀','숙녀의 품격으로 아군이 가볍게 움직인다. 파티의 속도와 회피율이 2턴간 10% 오른다.',0,{acc:75,lady:1,noTgt:1,mp:20,kn:'상대 변화',
  aiCond:f=>!(f.ladySpd>0)})];
CHM.esquel.sk=[
 A('아지태의 검술','아지태에게 배운 검술로 벤다.',35,{acc:70}),
 H('재생','생명력을 소모해 부상을 치유한다. MP 대신 자신의 HP를 5% 소모한다.',30,{acc:100,kn:'단일 회복',hpPct:5,mp:0,eqLog:1}),
 H('자가재생','②로 소모한 생명력만큼 자신의 HP를 회복한다. 사용하면 소모량은 초기화된다.',0,{acc:100,kn:'자기 변화',selfRegen:1,mp:12,noTgt:1})];
CHM.taotie.sk=[
 A('검술','당나라 시절부터 애용한 무기로 벤다.',35,{acc:95}),
 W('나태','상대에게 나태를 부여해 움직임을 둔하게 만든다.',0,{acc:95,inflict:['sloth'],mp:12,kn:'상대 변화'}),
 A('소멸','검게 변한 손으로 닿은 것을 가루로 만든다. 2회 연속으로 공격하고, 준 피해의 50%만큼 생명력을 흡수한다.',100,{acc:50,multi:[2,2],dr:50,mp:26,kn:'단일 공격'})];
CHM.chaos.sk=[
 A('흡수','생명체를 먹으며 음의 기운을 흡수한다. 준 피해의 50%만큼 생명력을 흡수한다.',30,{acc:90,dr:50}),
 A('소멸','검게 변한 손으로 닿은 것을 가루로 만든다. 2회 연속으로 공격하고, 준 피해의 50%만큼 생명력을 흡수한다.',100,{acc:50,multi:[2,2],dr:50,mp:20}),
 W('탐닉','상대의 본능을 극대화한다. 애정 · 나태 · 혼란을 모두 건다.',0,{acc:90,inflict:['love','sloth','conf'],mp:30,kn:'상대 변화'})];

/* ---------- 도우미 ---------- */
let MC27=null;
const S27=f=>(run&&run.dbl)?(f.pos||f.side):f.side;
const evx=(ev,t,f,v,o)=>{o=o||{};ev.push({t,s:snap(),raw:true,pop:v!==undefined?{side:S27(f),v,cls:o.cls||'tx'}:undefined,fx:o.fx?{side:S27(f),...o.fx}:undefined,sfx:o.sfx,d:o.d})};
const fighters=()=>[...new Set([...(run.party||[]),run.enemy,run.enemy2,run.eA].filter(Boolean))];
const team=f=>run.dbl?(f.side==='p'?dAllies():dFoes()):(f.side==='p'?run.party.filter(x=>x.hp>0):[f]);
const partner=(f,id)=>!!(run&&run.dbl&&(f.side==='p'?dAllies():dFoes()).some(x=>x!==f&&x.hp>0&&x.ch.id===id));
const isBwSk=f=>f&&f.hp>0&&f.pend!==null&&f.pend!==undefined&&f.ch.sk[f.pend]&&f.ch.sk[f.pend].bw;
function releaseBw(ev,f,txt){
 if(!run.bw)return;
 run.bw=false;
 fighters().forEach(x=>{if(isBwSk(x))x.pend=null});
 evx(ev,txt||'시간이 다시 흐른다. 흑백 필드가 해제되었다.',f,'필드 해제',{fx:{k:'up',c:'#e6e6e6'},sfx:'up',d:700})}
const INF={
 sloth:d=>d.sloth?null:(d.sloth=1,d.slothAge=0,[`${josa(d.ch.name,'은/는')} 나태해졌다. 속도가 떨어진다.`,'나태','#9aa0b0']),
 love:d=>d.love?null:(d.love=1,d.loveAge=0,[`${josa(d.ch.name,'은/는')} 싸울 마음을 잃었다.`,'애정','#e68fb0']),
 conf:d=>d.conf?null:(d.conf=1,d.confAge=0,[`${josa(d.ch.name,'은/는')} 혼란에 빠졌다.`,'혼란','#d8a85a'])};
function inflict(d,k,ev){
 if(d.hp<=0)return;
 const r=INF[k](d);
 if(r)evx(ev,r[0],d,r[1],{fx:{k:'down',c:r[2]},sfx:'down'})}

/* ---------- 스킬 상태 ---------- */
const _rbs27=resetBattleState;
resetBattleState=function(f){_rbs27(f);f.sealT=0;f.ladySpd=0;f.ladyT=0;f.ladyEvPrev=0;f.tpStk=0;f.eqSpent=0;f.bwNew=false};
const _cl27=cleanse;
cleanse=function(f){const had=_cl27(f)||(f.sealT>0);f.sealT=0;return had};
const _st27=st;
st=function(f,k){let v=_st27(f,k);
 if(k==='spd'){if(isBwSk(f)&&!f.bwNew)v+=1e6;if(f.tpStk>0)v*=1+.03*f.tpStk;if(f.ladySpd>0)v*=1+f.ladySpd}
 if(f.ch.id==='seunga'&&(k==='atk'||k==='spd')&&partner(f,'hyun'))v*=1.05;
 return v};
const _mc27=mpCost;
mpCost=function(s,i){
 if(s&&i>=1){const F=MC27||(run&&run.party&&run.party[run.active]);if(F&&F.sealT>0&&F.ch.sk[i]===s)return 9999}
 return _mc27(s,i)};
const _sf27=skFace;
skFace=function(ch,i,s,lv,tag,mp){
 if(mp&&i>=1&&run&&run.party){const F=run.party.find(f=>f.ch===ch&&f.hp>0);if(F&&F.sealT>0)tag=(tag||'')+' · 봉인'}
 return _sf27(ch,i,s,lv,tag,mp)};

/* ---------- 화면 ---------- */
const _snap27=snap;
snap=function(){
 const s=_snap27();
 try{
  s.bw=!!(run&&run.bw);
  const add=(o,f)=>{if(!o||!f)return;o.st=o.st||{};if(f.sealT>0)o.st.seal=true;if(f.ladySpd>0||f.tpStk>0)o.st.spd=true};
  if(run.dbl){add(s.p,dA());add(s.e,run.eA||run.enemy);add(s.q,dB());add(s.f,run.enemy2)}
  else{add(s.p,run.party[run.active]);add(s.e,run.enemy)}
 }catch(e){}
 return s};
const _stIc27=stIc;
stIc=function(f){let h=_stIc27(f);
 if(f.sealT>0&&!(f.seal!==null&&f.seal!==undefined))h+=`<span>${svg('seal')}</span>`;
 if((f.ladySpd>0||f.tpStk>0)&&!(f.spdB>0))h+=`<span>${svg('buff')}</span>`;
 return h};
const _pi27=paintInfo;
paintInfo=function(s,fl,popv){_pi27(s,fl,popv);try{document.body.classList.toggle('bw',!!(s&&s.bw))}catch(e){}};
const _tt27=toTitle;
toTitle=function(){try{document.body.classList.remove('bw')}catch(e){}return _tt27.apply(this,arguments)};
(function(){const st=document.createElement('style');st.textContent='body.bw #bgm,body.bw .pf{filter:grayscale(1)!important}#bgm,.pf{transition:filter .6s}';document.head.appendChild(st)})();

/* ---------- 행동 ---------- */
const _perf27=perform;
function castOnly(a,d,idx,ev,sk){
 const n0=ev.length,ot=sk.t,op=sk.p;sk.t='h';sk.p=0;
 try{_perf27(a,d,idx,ev)}finally{sk.t=ot;sk.p=op}
 const mine=ev.slice(n0);
 return{cast:mine.some(e=>e.t===`${a.ch.name}의 ${sk.n}`),fail:mine.some(e=>e.t==='효과가 없었다.'),mine}}
function body(a,d,idx,ev){
 const sk=idx<0?BASIC:a.ch.sk[idx];
 if(!sk)return _perf27(a,d,idx,ev);
 const pendNow=a.pend!==null&&a.pend!==undefined,n0=ev.length;
 /* 독심: 봉인된 스킬 */
 if(a.sealT>0&&idx>=1&&!pendNow&&!(a.rest>0)&&!(a.stun>0)){
  evx(ev,`${a.ch.name}의 ${sk.n}은(는) 봉인되어 쓸 수 없다.`,a,'봉인',{sfx:'miss'});return}
 /* 흑백 필드를 여는 2턴 스킬 */
 if(sk.bw){
  if(run.areaSub){if(a.bwNew)return;return _perf27(a,d,idx,ev)}
  if(pendNow&&!a.bwNew){
   a.pend=null;releaseBw(ev,a);
   const m=a.mp;_perf27(a,d,idx,ev);a.mp=m;const l=a.last;
   /* 더블배틀: 두 번째 턴은 단일 대상으로 들어오므로 나머지 상대에게도 직접 공격한다 */
   if(run.dbl){
    run.areaSub=true;
    try{(a.side==='p'?dFoes():dAllies()).forEach(o=>{
     if(o===d||o.hp<=0||a.hp<=0)return;
     const k=ev.length;_perf27(a,o,idx,ev);a.mp=m;a.last=l;
     const ci=ev.findIndex((e,j)=>j>=k&&e.act);if(ci>=0)ev.splice(ci,1)})}
    finally{run.areaSub=false}}
   return}
  if(!pendNow){
   const r=castOnly(a,d,idx,ev,sk);
   if(r.cast){a.pend=idx;a.bwNew=true;run.bw=true;
    evx(ev,'시간이 멈췄다. 필드가 흑백으로 변한다. 이 동안 모든 피해가 0이 된다.',a,'흑백 필드',{fx:{k:'down',c:'#9a9a9a'},sfx:'down',d:900})}
   return}
  return}
 /* 상대에게 거는 스킬: 독심 / 나태 / 탐닉 */
 if(sk.sealX||sk.inflict){
  const r=castOnly(a,d,idx,ev,sk);
  if(r.fail)r.mine.forEach(e=>{if(e.t==='효과가 없었다.'&&e.pop){e.pop={...e.pop,side:S27(d)};e.raw=true}});
  if(r.cast&&!r.fail&&d.hp>0){
   if(sk.sealX){d.sealT=sk.sealX;evx(ev,`${d.ch.name}의 ②, ③ 스킬이 봉인되었다.`,d,'봉인',{fx:{k:'down',c:'#ad8fd8'},sfx:'down'})}
   if(sk.inflict)sk.inflict.forEach(k=>inflict(d,k,ev))}
  return}
 /* 고귀한 숙녀 */
 if(sk.lady){
  const r=castOnly(a,d,idx,ev,sk);
  if(!r.cast||r.fail)return;
  team(a).forEach(f=>{if(!(f.ladyT>0))f.ladyEvPrev=f.evStk||0;f.ladySpd=.1;f.ladyT=2;f.evStk=Math.max(f.evStk||0,2/3)});
  evx(ev,'파티의 속도와 회피율이 2턴간 10% 오른다.',a,'속도 · 회피 UP',{fx:{k:'up',c:'#6fa0dc'},sfx:'up'});return}
 /* 자가재생 */
 if(sk.selfRegen){
  const r=castOnly(a,d,idx,ev,sk);
  if(!r.cast||r.fail)return;
  const sp=a.eqSpent||0,b=a.hp;a.hp=Math.min(a.maxhp,a.hp+sp);a.eqSpent=0;
  if(a.hp>b)evx(ev,`${a.ch.name} HP ${a.hp-b} 회복`,a,'+'+(a.hp-b),{cls:'heal',fx:{k:'heal'},sfx:'heal'});
  else evx(ev,'회복할 HP가 없었다.',a,'변화 없음',{sfx:'miss'});
  return}
 /* 순간이동 */
 if(sk.tp){
  _perf27(a,d,idx,ev);
  if(ev.slice(n0).some(e=>e.t===`${a.ch.name}의 ${sk.n}`)){
   a.tpStk=Math.min(10,(a.tpStk||0)+1);
   evx(ev,`${a.ch.name} 속도 상승 (${a.tpStk}단계)`,a,'속도 UP x'+a.tpStk,{fx:{k:'up',c:'#6fa0dc'},sfx:'up'})}
  return}
 const wasBw=!!run.bw;
 _perf27(a,d,idx,ev);
 const mine=ev.slice(n0);
 /* 재생: 소모한 HP 기록 */
 if(sk.eqLog)mine.forEach(e=>{const m=typeof e.t==='string'&&e.t.startsWith(a.ch.name+' HP ')&&/HP (\d+) 소모$/.exec(e.t);if(m)a.eqSpent=(a.eqSpent||0)+(+m[1])});
 /* 흑백 필드 중에는 피해가 0 */
 if(wasBw&&!a.love)mine.forEach(e=>{if(typeof e.t==='string'&&e.t.includes('싸울 마음이 없다'))e.t=`${d.ch.name}에게는 피해를 줄 수 없다. (흑백 필드)`});
 /* 시간 조작은 흑백 필드를 해제한다 */
 if(sk.rewind&&run.bw&&mine.some(e=>e.t===`${a.ch.name}의 ${sk.n}`))releaseBw(ev,a,'시간 조작으로 흑백 필드가 해제되었다.')}
perform=function(a,d,idx,ev){
 const prev=MC27;MC27=a;
 try{
  const sk=idx<0?BASIC:a.ch.sk[idx];
  /* 현무의 힘: 승아는 현과 함께 출전하면 명중률 10% 상승 */
  if(sk&&a.ch.id==='seunga'&&partner(a,'hyun')){
   const o=sk.acc;sk.acc=(o!==undefined?o:(sk.t==='a'?95:100))+10;
   try{return body(a,d,idx,ev)}finally{if(o===undefined)delete sk.acc;else sk.acc=o}}
  return body(a,d,idx,ev)
 }finally{MC27=prev}};
const _hc27=hitCalc;
hitCalc=function(a,d,sk,k){
 const h=_hc27(a,d,sk,k);
 if(run&&run.bw&&h.dmg>0){h.dmg=0;h.crit=false}
 return h};

/* ---------- 턴 종료 ---------- */
const _eot27=endOfTurn;
endOfTurn=function(ev){
 const L=[run.party[run.active],run.enemy].filter(Boolean);
 _eot27(ev);
 L.forEach(f=>{
  f.bwNew=false;
  if(f.hp<=0)return;
  if(f.ladyT>0&&--f.ladyT===0){f.ladySpd=0;if(f.evStk===2/3)f.evStk=f.ladyEvPrev||0}
  if(f.sealT>0&&--f.sealT===0)evx(ev,`${f.ch.name}의 봉인이 풀렸다.`,f,'봉인 해제',{sfx:'up'});
  /* 현무의 힘: 현과 함께 출전한 승아는 매 턴 HP 3% 회복 */
  if(f.ch.id==='seunga'&&partner(f,'hyun')){
   const g=Math.round(f.maxhp*.03),b=f.hp;f.hp=Math.min(f.maxhp,f.hp+g);
   if(f.hp>b)evx(ev,`${f.ch.name} HP ${f.hp-b} 회복 (현무의 힘)`,f,'+'+(f.hp-b),{cls:'heal',fx:{k:'heal'},sfx:'heal'})}});
 if(run.bw&&!fighters().some(isBwSk))releaseBw(ev,L[0]||run.party[run.active])};
const _nb27=nextBattle;
nextBattle=function(){if(run)run.bw=false;try{document.body.classList.remove('bw')}catch(e){}_nb27()};

/* ---------- AI ---------- */
const _ai27=aiPick;
aiPick=function(e,p){
 const prev=MC27;MC27=e;
 try{
  const r=_ai27(e,p);
  if(r>=0){const s=e.ch.sk[r];
   if(s&&((s.sealX&&p.sealT>0)||(s.tp&&(e.tpStk||0)>=10)||(s.selfRegen&&!(e.eqSpent>0))||(s.inflict&&s.inflict.every(k=>p[k]))))return 0}
  return r
 }finally{MC27=prev}};
})();
