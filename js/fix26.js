/* 26차 수정: 새 스킬트리 (오토리 · 루이후 · 메르헨 · 아미르 · 사마엘 · 아낙 · 진 · 청천룡 · 주환희 · 백백도)
   + 새 상태이상 (석화 · 분노 · 나태 · 낙인 · 부조화) */
(function(){
const EL_O={'火':.5,'水':.5,'木':2,'金':2};
const EL_C={'土':0,'木':.5,'火':.5,'金':2,'水':2};
CFG.SHOCK_FREE=.2;

/* ---------- 스킬 데이터 ---------- */
CHM.luihu.sk=[
 A('원자','원자를 생성해 융합시켜 원소를 만들어 투척한다.',45,{acc:90}),
 A('폭발','불안정한 능력이 큰 폭발을 일으킨다. 자신도 반동 피해를 입는다.',70,{acc:80,sc:'범위',recoil:10}),
 A('피폭','생성한 원소가 방사선을 일으켜 상대를 피폭시킨다.',150,{acc:55,sc:'범위',stun:100})];
CHM.otori.sk=[
 A('불도깨비','주변의 불도깨비를 투척한다. 火 · 水에게는 약하고 木 · 金에게는 강하다.',15,{acc:90,multi:[2,5],tm:EL_O}),
 B('시간 조작','과거를 조작해 필드의 HP · MP · 상태이상을 5턴 전으로 되돌린다. 자신은 50% 확률로 기절한다.',0,{acc:100,rewind:1,noTgt:1,kn:'필드 변화',
  aiCond:f=>f.hp<f.maxhp*.45&&!!(run&&run.hist&&run.hist.length>=3)}),
 A('공간 조작','어디든 이동해 허점을 찌른다. 방어를 절반 무시한다.',65,{ign:.5})];
CHM.marchen.sk=[
 A('생명의 가루','세피로트 나무의 꽃가루를 분사한다. 준 피해만큼 생명력을 흡수한다.',30,{acc:85,sc:'범위',dr:100}),
 H('재생','입김을 불어넣어 생명력을 되살린다.',40,{acc:100,kn:'단일 회복'}),
 B('창조된 생명','파티의 HP를 모두 회복하고 상태이상을 없앤다. 쓰러진 동료는 HP 50%로 되살리고, 5턴간 매 턴 HP 3%를 회복시킨다.',0,{acc:100,regen3:1,noTgt:1,kn:'상대 변화',
  aiCond:f=>f.hp<f.maxhp*.5&&!(f.regenT>0)})];
CHM.amir.sk=[
 A('게브의 낫','낫을 휘둘러 상대의 방어를 깎아낸다. (최대 5중첩)',65,{acc:90,sc:'범위',defDn:1}),
 A('엔네아드의 기적','출전한 모든 캐릭터의 공격력 · 방어력 · 속도 · 회피율 변화를 반대로 뒤집는다.',95,{acc:100,reverse:1,kn:'필드 변화'}),
 B('호루스의 눈','2턴간 무적이 되고, 2턴간 방어를 70% 무시한다.',0,{acc:100,horus:1,noTgt:1,kn:'자기 변화',aiCond:f=>!(f.inv>0)&&f.hp<f.maxhp*.7})];
CHM.samael.sk=[
 A('영대','입을 맞춰 상대의 생명력을 흡수한다.',55,{acc:100,dr:50}),
 A('소멸','검게 변한 손으로 닿은 것을 가루로 만든다. 2회 연속으로 공격한다.',100,{acc:90,multi:[2,2],dr:50}),
 A('죄악','영혼 심판으로 죄를 부여한다. 5턴간 지속 피해를 입히고 애정 · 나태 · 분노 중 하나를 건다. 준 피해만큼 생명력을 흡수한다.',20,{acc:90,dotN:[3,5],rndSt:['love','sloth','rage'],dr:100})];
CHM.anax.sk=[
 A('낙인','검은 공막과 붉은 홍채의 눈동자 낙인을 새긴다.',35,{acc:85,brand:1}),
 A('석화','감고 있던 눈을 떠, 마주친 상대를 돌로 만든다.',30,{acc:80,sc:'범위',petri:100}),
 A('집행','규율의 집행. 낙인 7개로 쓰러진 캐릭터가 있어야 쓸 수 있다. 3회 연속 공격하고 낙인 5개를 새긴다.',70,{acc:100,sc:'범위',multi:[3,3],brand:5,needBrand:1})];
CHM.jin.sk=[
 A('부조화의 기운','부조화의 기운을 투척한다. 필드의 모두에게 부조화 10%가 쌓인다.',50,{acc:95,disAll:10}),
 A('참화','부조화를 마물화해 생성한다. 3회 연속 공격하고 필드의 모두에게 부조화 15%가 쌓인다.',30,{acc:85,sc:'범위',multi:[3,3],disAll:15}),
 A('부조화의 저주','자신의 부조화를 50% 소모한다. 5턴간 상대에게 지속 피해 5%, 필드의 모두에게 매 턴 부조화 6%.',70,{acc:100,sc:'범위',needDis:1,curse:1,kn:'필드 변화'})];
CHM.cheonryong.sk=[
 A('여의주','여의주를 검으로 만들어 벤다.',35,{acc:100}),
 Z('구름','여의주의 힘으로 구름을 만들어 잠시 날아오른다. 공격을 피한다.',{acc:100}),
 A('감전','여의주에 흐르는 고전압으로 상대를 감전시킨다. 土에게는 통하지 않는다.',55,{acc:75,shock:true,tm:EL_C})];
CHM.hwanhee.sk=[
 A('불도깨비','작은 불도깨비를 생성해 투척한다. 火 · 水에게는 약하고 木 · 金에게는 강하다.',15,{acc:90,multi:[2,5],tm:EL_O}),
 H('치유','주작의 힘으로 화끈하게 치유한다. MP 대신 자신의 HP를 5% 소모한다.',35,{acc:100,kn:'단일 회복',hpPct:5,mp:0}),
 W('우주의 소리','우주와 교감해 2턴간 상대의 방어를 10% 낮춘다.',0,{acc:50,sc:'범위',defDn2:.1,kn:'상대 변화'})];
CHM.baekdo.sk=[
 A('삼지창','삼지창으로 전투에 임한다.',40,{acc:80,bkLock:1}),
 A('눈폭탄','눈으로 만든 폭탄으로 행동을 제약한다.',30,{acc:85,stun:30,bkLock:1}),
 A('백호의 힘','쓰러지면 HP 100%로 한 번 되살아나 5턴간 백호의 힘을 발현한다. 그동안은 이 스킬만 쓸 수 있다.',70,{acc:80,bkUlt:1})];
/* ③ 스킬은 ②보다 항상 8 이상 크게 (fix25 규칙을 새 스킬에도 적용) */
['otori','luihu','marchen','amir','samael','cheonryong'].forEach(id=>{const s=CHM[id].sk,m2=mpCost(s[1],1),m3=mpCost(s[2],2);if(m3<m2+8)s[2].mp=m2+8});

/* ---------- 도우미 ---------- */
let MCF=null;
const S26=f=>(run&&run.dbl)?(f.pos||f.side):f.side;
const evx=(ev,t,f,v,o)=>{o=o||{};ev.push({t,s:snap(),raw:true,pop:v!==undefined?{side:S26(f),v,cls:o.cls||'tx'}:undefined,fx:o.fx?{side:S26(f),...o.fx}:undefined,sfx:o.sfx,d:o.d})};
const fieldAll=(a,d)=>run.dbl?[...dAllies(),...dFoes()]:[a,d].filter(Boolean);
const foesOf=(a,d)=>run.dbl?(a.side==='p'?dFoes():dAllies()):[d];
const fighters=()=>[...new Set([...(run.party||[]),run.enemy,run.enemy2,run.eA].filter(Boolean))];
const SKEYS=['mp','stun','stunImm','shock','shockT','dot','psn','conf','confAge','seal','sealAge','love','loveAge','d','dT','m','mT','dbStk','slowStk','slowT','spdStk','spdT','spdB','spdBT','evStk','inv','evade','brand','dis','rage','rageAge','sloth','slothAge','petri','petriAge','petriSlow','defStk','stk','rest','pend','dive','regenT','ignT','ignP','curseT','curseDisT','last'];
const snapAll=()=>fighters().map(f=>{const o={f,hp:f.hp};SKEYS.forEach(k=>{o[k]=f[k]===undefined?undefined:structuredClone(f[k])});return o});
const restoreOne=(f,o)=>{f.hp=o.hp;SKEYS.forEach(k=>{if(o[k]!==undefined)f[k]=structuredClone(o[k])})};

function addBrand(f,n,ev){
 if(f.hp<=0)return;
 f.brand=Math.min(7,(f.brand||0)+n);
 evx(ev,`${josa(f.ch.name,'은/는')} 낙인이 새겨졌다. (${f.brand}/7)`,f,'낙인 x'+f.brand,{fx:{k:'down',c:'#a02a2a'},sfx:'down'});
 if(f.brand>=7){f.hp=0;run.brandKO=true;evx(ev,`${josa(f.ch.name,'은/는')} 낙인이 7개 쌓여 전투불능이 되었다.`,f,'전투불능',{sfx:'ko'})}}
function addDis(f,pct,ev){
 if(f.hp<=0)return;
 f.dis=Math.min(100,(f.dis||0)+pct);
 evx(ev,`${f.ch.name} 부조화 ${f.dis}%`,f,'부조화 '+f.dis+'%',{fx:{k:'down',c:'#8a6fb8'},sfx:'down'});
 if(f.dis>=100){f.hp=0;evx(ev,`${josa(f.ch.name,'은/는')} 부조화가 100%에 달해 전투불능이 되었다.`,f,'전투불능',{sfx:'ko'})}}
const ST_TXT={
 love:f=>[`${josa(f.ch.name,'은/는')} 싸울 마음을 잃었다.`,'애정','#e68fb0'],
 sloth:f=>[`${josa(f.ch.name,'은/는')} 나태해졌다. 속도가 떨어진다.`,'나태','#9aa0b0'],
 rage:f=>[`${josa(f.ch.name,'은/는')} 분노했다. 공격력이 오르지만 명중이 떨어진다.`,'분노','#e0705a'],
 petri:f=>[`${josa(f.ch.name,'은/는')} 돌로 굳었다.`,'석화','#b0a890']};
function applySt(f,k,ev){
 if(f.hp<=0)return false;
 if(k==='love'){if(f.love)return false;f.love=1;f.loveAge=0}
 else if(k==='sloth'){if(f.sloth)return false;f.sloth=1;f.slothAge=0}
 else if(k==='rage'){if(f.rage)return false;f.rage=1;f.rageAge=0}
 else if(k==='petri'){if(f.petri)return false;f.petri=1;f.petriAge=0}
 const [t,v,c]=ST_TXT[k](f);evx(ev,t,f,v,{fx:{k:'down',c},sfx:'down'});return true}
function checkBk(f,ev){
 if(!f||f.ch.id!=='baekdo'||f.hp>0||f.bkUsed)return;
 f.bkUsed=1;f.bkWin=5;f.hp=f.maxhp;cleanse(f);
 f.m={atk:.3,def:.3};f.mT=5;f.ignT=5;f.ignP=Math.max(f.ignP||0,.3);f.spdB=.15;f.spdBT=5;
 evx(ev,`${josa(f.ch.name,'은/는')} 백호의 힘으로 되살아났다. 5턴간 백호의 힘이 발현된다.`,f,'백호의 힘',{cls:'tx heal',fx:{k:'up',c:'#f2d04a'},sfx:'heal'})}
function reverseStats(f){
 [f.m,f.d]=[f.d,f.m];[f.mT,f.dT]=[f.dT||0,f.mT||0];
 const up=f.spdStk||0,dn=f.slowStk||0;f.spdStk=dn;f.slowStk=up;[f.spdT,f.slowT]=[f.slowT||0,f.spdT||0];
 if(f.spdB>0){f.slowStk=Math.min(5,Math.max(f.slowStk,Math.round(f.spdB/.1)));f.slowT=Math.max(f.slowT||0,f.spdBT||0);f.spdB=0;f.spdBT=0}
 if(f.dbStk>0){const dn2=typeof ATK_DN!=='undefined'?ATK_DN:.1;f.m.atk=Math.max(f.m.atk,dn2*f.dbStk);f.mT=Math.max(f.mT||0,3);f.dbStk=0}
 f.evStk=-(f.evStk||0)}

/* ---------- 전투 상태 ---------- */
const _rbs26=resetBattleState;
resetBattleState=function(f){
 const kp=f.side==='p'?{b:f.brand||0,d:f.dis||0}:null;
 _rbs26(f);
 f.rage=0;f.rageAge=0;f.sloth=0;f.slothAge=0;f.petri=0;f.petriAge=0;f.petriSlow=0;f.defStk=0;f.ignT=0;f.ignP=0;f.regenT=0;f.bkUsed=0;f.bkWin=0;f.curseT=0;f.curseDisT=0;
 f.brand=kp?kp.b:0;f.dis=kp?kp.d:0};
const _st26=st;
st=function(f,k){let v=_st26(f,k);
 if(k==='atk'&&f.rage)v*=1.5;
 if(k==='def'&&f.defStk)v*=Math.max(.3,1-.05*f.defStk);
 const n=Math.floor((f.dis||0)/25);
 if(n>0){if(k==='spd')v*=1-.03*n;if(k==='def')v*=1-.05*n}
 if(k==='spd'){if(f.sloth)v*=.7;if(f.petriSlow>0)v*=.9}
 return v};
const _cl26=cleanse;
cleanse=function(f){
 const had=_cl26(f)||!!(f.rage||f.sloth||f.petri||f.brand||f.defStk);
 f.rage=0;f.rageAge=0;f.sloth=0;f.slothAge=0;f.petri=0;f.petriAge=0;f.petriSlow=0;f.brand=0;f.defStk=0;f.curseT=0;
 return had};
/* 부조화 해제 (부조화를 풀 수 있는 스킬을 만들 때 사용) */
window.clearDis=function(f){const had=(f.dis||0)>0;f.dis=0;f.curseDisT=0;return had};

const _mc26=mpCost;
mpCost=function(s,i){
 if(s){
  const F=MCF||(run&&run.party&&run.party[run.active]);
  if(s.needBrand&&!(run&&run.brandKO))return 9999;
  if(s.needDis)return(F&&(F.dis||0)>=50)?0:9999;
  if(s.bkUlt)return(F&&F.bkWin>0)?0:9999;
  if(s.bkLock&&F&&F.bkWin>0)return 9999;
  if(s.aiCond&&MCF&&MCF.side==='e'&&!s.aiCond(MCF))return 9999}
 return _mc26(s,i)};
const _sf26=skFace;
skFace=function(ch,i,s,lv,tag,mp){
 let h=_sf26(ch,i,s,lv,tag,mp);
 if(!mp||!s)return h;
 if(ch.id==='samael'&&i>=0){const c=mpCost(s,i);h=h.replace(/MP \d+/,'HP '+(Math.round(c*.7*10)/10)+'%')}
 else if(s.hpPct)h=h.replace(/MP \d+/,'HP '+s.hpPct+'%');
 else if(s.needDis)h=h.replace(/MP \d+/,'부조화 50%');
 else if(s.needBrand&&!(run&&run.brandKO))h=h.replace(/MP \d+/,'조건 미달성');
 else if(s.bkUlt)h=h.replace(/MP \d+/,'백호의 힘');
 return h};

/* ---------- 상태 아이콘 ---------- */
Object.assign(SVGP,{
 petri:'<path d="M6 20V10l3-5 3 3 3-3 3 5v10z"/>',
 rage:'<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z"/>',
 sloth:'<path d="M5 8h14L5 16h14"/>',
 brand:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.2" fill="currentColor"/>',
 dis:'<path d="M3 12h3l2-6 3 12 3-9 2 3h5"/>'});
['petri','rage','sloth','brand','dis'].forEach(k=>{ICKEYS.push(k);STICON[k]=k});
const _snap26=snap;
snap=function(){
 const s=_snap26();
 const add=(o,f)=>{if(!o||!f)return;o.st=o.st||{};Object.assign(o.st,{petri:!!f.petri,rage:!!f.rage,sloth:!!f.sloth,brand:(f.brand|0)>0,dis:(f.dis|0)>0})};
 try{
  if(run.dbl){add(s.p,dA());add(s.e,run.eA||run.enemy);add(s.q,dB());add(s.f,run.enemy2)}
  else{add(s.p,run.party[run.active]);add(s.e,run.enemy)}
 }catch(e){}
 return s};
const _stIc26=stIc;
stIc=function(f){let h=_stIc26(f);
 ['petri','rage','sloth','brand','dis'].forEach(k=>{if(f[k]>0)h+=`<span>${svg(k)}</span>`});
 return h};

/* ---------- 행동 ---------- */
const _perf26=perform;
function castOnly(a,d,idx,ev,sk){
 const n0=ev.length,ot=sk.t,op=sk.p;sk.t='h';sk.p=0;
 try{_perf26(a,d,idx,ev)}finally{sk.t=ot;sk.p=op}
 const mine=ev.slice(n0);
 return{cast:mine.some(e=>e.t===`${a.ch.name}의 ${sk.n}`),fail:mine.some(e=>e.t==='효과가 없었다.'),mine}}
function body(a,d,idx,ev){
 if(a.petri>0&&!(a.pend!==null&&a.pend!==undefined)){
  evx(ev,`${josa(a.ch.name,'은/는')} 돌로 굳어 움직이지 못한다.`,a,'석화',{sfx:'stun'});return}
 if(a.bkWin>0)idx=2;
 const sk=idx<0?BASIC:a.ch.sk[idx];
 if(!sk)return _perf26(a,d,idx,ev);
 const mp0=a.mp,hpSkill=a.ch.id==='samael'&&idx>=0||!!sk.hpPct;
 /* HP를 쓰는 스킬 */
 if(hpSkill){
  const mc=a.ch.id==='samael'?mpCost(sk,idx):0;
  const cost=sk.hpPct?Math.round(a.maxhp*sk.hpPct/100):Math.round(a.maxhp*mc*.7/100);
  if(cost>0&&!(a.rest>0)&&!(a.stun>0)&&a.seal!==idx&&!(a.pend!==null&&a.pend!==undefined)){
   const b=a.hp;a.hp=Math.max(1,a.hp-cost);const lost=b-a.hp;
   if(lost>0)evx(ev,`${a.ch.name} HP ${lost} 소모`,a,'-'+lost,{cls:'dot',sfx:'hit'})}}
 const custom=sk.rewind||sk.regen3||sk.horus;
 const hp0=d.hp,n0=ev.length;
 let cast=false,fail=false,mine;
 if(custom){const r=castOnly(a,d,idx,ev,sk);cast=r.cast;fail=r.fail;mine=r.mine}
 else if(sk.defDn2){
  const r=castOnly(a,d,idx,ev,sk);cast=r.cast;fail=r.fail;mine=r.mine;
  if(fail)r.mine.forEach(e=>{if(e.t==='효과가 없었다.'&&e.pop)e.pop={...e.pop,side:S26(d)}})}
 else{_perf26(a,d,idx,ev);mine=ev.slice(n0);cast=mine.some(e=>e.t===`${a.ch.name}의 ${sk.n}`)}
 if(hpSkill)a.mp=mp0;
 const landed=mine.some(e=>typeof e.t==='string'&&(e.t.startsWith(`${d.ch.name}에게 `)||e.t.includes('싸울 마음이 없다')));
 const dealt=Math.max(0,hp0-d.hp),once=!run.areaSub;
 /* 타입 상성으로 피해가 0이 된 경우 */
 if(sk.tm&&sk.tm[d.ch.el]===0)mine.forEach(e=>{if(typeof e.t==='string'&&e.t.includes('싸울 마음이 없다'))e.t=`${d.ch.name}에게는 효과가 없는 것 같다.`});
 /* 시간 조작 */
 if(sk.rewind&&cast&&!fail){
  const H=run.hist||[],t=H[Math.max(0,H.length-6)];
  if(t){const field=run.dbl?[...dAllies(),...dFoes()]:[a,d];
   field.forEach(f=>{const o=t.find(x=>x.f===f);if(o)restoreOne(f,o)});
   evx(ev,'시간이 되돌아간다. 필드의 HP · MP · 상태이상이 5턴 전으로 돌아갔다.',a,'시간 회귀',{fx:{k:'up',c:'#9ad0f0'},sfx:'up',d:900})}
  else evx(ev,'되돌릴 과거가 없다.',a,'변화 없음',{sfx:'miss'});
  if(a.hp>0&&Math.random()<.5){a.stun=1;a.stunImm=0;evx(ev,`${josa(a.ch.name,'은/는')} 시간의 반동으로 기절했다.`,a,'기절',{fx:{k:'stun'},sfx:'stun'})}}
 /* 창조된 생명 */
 if(sk.regen3&&cast&&!fail){
  const mates=a.side==='p'?run.party:(run.dbl?dFoes().filter(x=>x.hp>0):[a]);
  mates.forEach(f=>{if(f.hp<=0)f.hp=Math.round(f.maxhp*.5);else f.hp=f.maxhp;cleanse(f);f.regenT=5});
  evx(ev,'파티의 HP가 회복되고 상태이상이 사라졌다. 쓰러진 동료가 되살아난다. 5턴간 매 턴 HP가 조금씩 회복된다.',a,'생명 창조',{cls:'tx heal',fx:{k:'heal'},sfx:'heal',d:900})}
 /* 호루스의 눈 */
 if(sk.horus&&cast&&!fail){
  a.inv=2;a.ignT=2;a.ignP=Math.max(a.ignP||0,.7);
  evx(ev,`${josa(a.ch.name,'은/는')} 호루스의 눈을 뜬다. 2턴간 무적, 2턴간 방어무시 70%.`,a,'무적',{fx:{k:'up',c:'#e0b84a'},sfx:'up'})}
 /* 흡수 */
 if(sk.dr&&landed&&a.hp>0&&dealt>0){
  const g=Math.round(dealt*sk.dr/100),b=a.hp;a.hp=Math.min(a.maxhp,a.hp+g);const got=a.hp-b;
  if(got>0)evx(ev,`${a.ch.name} HP ${got} 흡수`,a,'+'+got,{cls:'heal',fx:{k:'heal'},sfx:'heal'})}
 /* 공격 후 효과 */
 if(landed&&d.hp>0){
  if(sk.dotN){d.dot={pct:sk.dotN[0],t:sk.dotN[1],sid:a.ch.id,ss:a.side,dr:sk.dr||0};evx(ev,`${josa(d.ch.name,'은/는')} 지속 피해를 입는다.`,d,'지속',{fx:{k:'down',c:'#8a6fb8'},sfx:'down'})}
  if(sk.rndSt){const pool=sk.rndSt.filter(k=>!(k==='love'?d.love:k==='sloth'?d.sloth:d.rage));if(pool.length)applySt(d,pool[Math.floor(Math.random()*pool.length)],ev)}
  if(sk.petri&&Math.random()*100<sk.petri)applySt(d,'petri',ev);
  if(sk.defDn){d.defStk=Math.min(5,(d.defStk||0)+1);evx(ev,`${d.ch.name} 방어력 저하 (${d.defStk}단계)`,d,'방어력 DOWN x'+d.defStk,{fx:{k:'down',c:'#ad8fd8'},sfx:'down'})}
  if(sk.brand)addBrand(d,sk.brand,ev)}
 if(sk.defDn2&&cast&&!fail&&d.hp>0){d.d.def=Math.max(d.d.def,sk.defDn2);d.dT=2;evx(ev,`${d.ch.name} 방어력 하락`,d,'방어력 DOWN',{fx:{k:'down',c:'#ad8fd8'},sfx:'down'})}
 if(sk.disAll&&landed&&once)fieldAll(a,d).forEach(f=>addDis(f,sk.disAll,ev));
 if(sk.curse&&cast&&landed&&once){
  a.dis=Math.max(0,(a.dis||0)-50);
  evx(ev,`${a.ch.name} 부조화 ${a.dis}%`,a,'부조화 -50%',{sfx:'up'});
  const foes=foesOf(a,d);
  fieldAll(a,d).forEach(f=>{f.curseDisT=5;if(foes.includes(f))f.curseT=5});
  evx(ev,'저주가 필드를 뒤덮는다. 5턴간 상대는 지속 피해를 입고, 모두의 부조화가 쌓인다.',a,'저주',{fx:{k:'down',c:'#8a6fb8'},sfx:'down',d:900})}
 if(sk.reverse&&cast&&once){
  const field=fieldAll(a,d);field.forEach(reverseStats);
  evx(ev,'엔네아드의 기적. 출전한 모두의 능력 변화가 뒤집혔다.',a,'능력 반전',{fx:{k:'up',c:'#e0b84a'},sfx:'up',d:900})}
 checkBk(a,ev);checkBk(d,ev)}
perform=function(a,d,idx,ev){
 const prev=MCF;MCF=a;
 try{
  const sk=idx<0?BASIC:a.ch.sk[idx];
  const delta=(a.rage?-30:0)-5*Math.floor((a.dis||0)/25);
  if(sk&&delta){
   const o=sk.acc;sk.acc=(o!==undefined?o:(sk.t==='a'?95:100))+delta;
   try{return body(a,d,idx,ev)}finally{if(o===undefined)delete sk.acc;else sk.acc=o}}
  return body(a,d,idx,ev)
 }finally{MCF=prev}};

const _hc26=hitCalc;
hitCalc=function(a,d,sk,k){
 const s2=(a.ignT>0&&a.ignP>(sk.ign||0))?{...sk,ign:a.ignP}:sk;
 const h=_hc26(a,d,s2,k);
 if(sk.tm&&sk.tm[d.ch.el]!==undefined){const m=sk.tm[d.ch.el];h.dmg=m===0?0:Math.max(1,Math.round(h.dmg*m))}
 return h};

/* ---------- 턴 종료 ---------- */
const _eot26=endOfTurn;
endOfTurn=function(ev){
 const L=[run.party[run.active],run.enemy];
 const dd=L.map(f=>f&&f.hp>0&&f.dot&&f.dot.dr?{f,v:Math.min(f.hp,Math.max(1,Math.round(f.maxhp*f.dot.pct/100))),sid:f.dot.sid,ss:f.dot.ss,dr:f.dot.dr}:null).filter(Boolean);
 _eot26(ev);
 dd.forEach(o=>{const src=fighters().find(x=>x.ch.id===o.sid&&x.side===o.ss);
  if(!src||src.hp<=0)return;
  const g=Math.round(o.v*o.dr/100),b=src.hp;src.hp=Math.min(src.maxhp,src.hp+g);
  if(src.hp>b)evx(ev,`${src.ch.name} HP ${src.hp-b} 흡수`,src,'+'+(src.hp-b),{cls:'heal',fx:{k:'heal'},sfx:'heal'})});
 L.forEach(f=>{
  if(!f)return;
  checkBk(f,ev);
  if(f.hp<=0)return;
  if(f.petriSlow>0)f.petriSlow--;
  if(f.petri>0){
   const v=Math.max(1,Math.round(f.maxhp*.05)),b=f.hp;f.hp=Math.max(0,f.hp-v);const lost=b-f.hp;
   if(lost>0)evx(ev,`${f.ch.name} 석화 피해 ${lost}`,f,'-'+lost,{cls:'dot',sfx:'hit'});
   if(f.hp<=0){evx(ev,`${josa(f.ch.name,'은/는')} 쓰러졌다.`,f,undefined,{sfx:'ko'});return}
   f.petriAge++;
   if(f.petriAge>=2&&Math.random()<.1){f.petri=0;f.petriSlow=2;evx(ev,`${josa(f.ch.name,'은/는')} 석화에서 풀렸다.`,f,'석화 해제',{sfx:'up'})}}
  if(f.rage){f.rageAge++;
   if(f.rageAge>=2&&Math.random()<.2){f.rage=0;f.rageAge=0;f.conf=1;f.confAge=0;
    evx(ev,`${josa(f.ch.name,'은/는')} 분노가 가라앉았지만 혼란에 빠졌다.`,f,'혼란',{fx:{k:'down',c:'#d8a85a'},sfx:'down'})}}
  if(f.sloth){
   if(f.slothAge>=1&&Math.random()<.2){f.sloth=0;f.slothAge=0;evx(ev,`${josa(f.ch.name,'은/는')} 나태에서 풀렸다.`,f,'나태 해제',{sfx:'up'})}
   else f.slothAge++}
  if(f.curseT>0){
   const v=Math.max(1,Math.round(f.maxhp*.05));f.hp=Math.max(0,f.hp-v);
   evx(ev,`${f.ch.name} 저주 피해 ${v}`,f,'-'+v,{cls:'dot',sfx:'hit'});f.curseT--;
   if(f.hp<=0)evx(ev,`${josa(f.ch.name,'은/는')} 쓰러졌다.`,f,undefined,{sfx:'ko'})}
  if(f.curseDisT>0&&f.hp>0){f.curseDisT--;addDis(f,6,ev)}
  if(f.regenT>0&&f.hp>0){
   const g=Math.round(f.maxhp*.03),b=f.hp;f.hp=Math.min(f.maxhp,f.hp+g);f.regenT--;
   if(f.hp>b)evx(ev,`${f.ch.name} HP ${f.hp-b} 회복`,f,'+'+(f.hp-b),{cls:'heal',fx:{k:'heal'},sfx:'heal'})}
  if(f.ignT>0)f.ignT--;
  if(f.bkWin>0&&--f.bkWin===0)evx(ev,`${f.ch.name}의 백호의 힘이 사라졌다.`,f,'백호의 힘 종료',{sfx:'down'});
  checkBk(f,ev)})};

/* ---------- AI ---------- */
const _ai26=aiPick;
aiPick=function(e,p){
 if(e.bkWin>0)return 2;
 const prev=MCF;MCF=e;
 try{return _ai26(e,p)}finally{MCF=prev}};

/* ---------- 턴 기록 (시간 조작) ---------- */
const _nb26=nextBattle;
nextBattle=function(){if(run){run.hist=null;run.brandKO=false}_nb26()};
const _dt26=doTurn;
doTurn=function(action){
 if(run&&!run.dbl&&!run.hist)run.hist=[snapAll()];
 const r=_dt26(action);
 if(run&&!run.dbl&&run.hist){run.hist.push(snapAll());if(run.hist.length>8)run.hist.shift()}
 return r};
const _dblt26=dblTurn;
dblTurn=function(acts){
 if(run&&!run.hist)run.hist=[snapAll()];
 const r=_dblt26(acts);
 if(run&&run.hist){run.hist.push(snapAll());if(run.hist.length>8)run.hist.shift()}
 return r};

/* ---------- 더블배틀 연동 ---------- */
dKind=function(sk,team){
 if(!sk||sk.noTgt)return 'self';
 if(sk.t==='a'||sk.t==='w')return sk.sc==='범위'?'foeAll':'foe1';
 if(team==='p'&&(sk.t==='h'||sk.t==='b'||sk.t==='g')&&!sk.weather&&!sk.partyHeal&&!sk.dive&&!sk.rnd)return 'ally1';
 return 'self'};
dArea=function(a,list,first,idx,ev){
 const n=ev.length;run.areaSub=false;dOne(a,first,idx,ev);
 if(!ev.slice(n).some(e=>e.act))return;
 run.areaSub=true;
 try{list.forEach(o=>{
  if(o===first||o.hp<=0||a.hp<=0)return;
  const m=a.mp,l=a.last,k=ev.length;
  dOne(a,o,idx,ev);a.mp=m;a.last=l;
  const ci=ev.findIndex((e,j)=>j>=k&&e.act);if(ci>=0)ev.splice(ci,1)})}
 finally{run.areaSub=false}};
dRemap=function(ev,n,mp){
 const m=s=>mp[s]||s;
 for(let j=n;j<ev.length;j++){const e=ev[j];if(e.raw)continue;
  if(e.pop&&e.pop.side)e.pop={...e.pop,side:m(e.pop.side)};
  if(e.fx&&e.fx.side)e.fx={...e.fx,side:m(e.fx.side)};
  if(e.act&&e.act.side)e.act={...e.act,side:m(e.act.side)};
  if(e.lunge)e.lunge=m(e.lunge)}};
})();
