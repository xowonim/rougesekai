/* 42차 수정: '우주' 차원 · 예르모 행성 (노르니르 · 위그드라실 성채 · 디시르 · 왈퀴리아) · 새 NPC · 특산품 */
(function(){
/* ---------- 기본 데이터 ---------- */
BASE[3]={hp:80,atk:19,def:10.5,spd:9};
DC.d='#b03a32';
const EL5=['木','火','土','金','水'];
const COLS=[['b','水'],['r','火'],['y','土'],['s','金'],['g','木']];
const rr=a=>a[Math.floor(Math.random()*a.length)];

/* ---------- 새 NPC ---------- */
const FR={'火':.5,'金':.5,'木':2,'水':2};
CHM.thebeast={id:'thebeast',name:'침식 마물',el:'？',star:3,race:'비인간형 적대적 생물',role:'a',sk:[
 A('돌진','거세게 몸을 던진다. 자신도 반동 피해를 입고, 상대에게 부조화 10%가 쌓인다.',100,{acc:75,recoil:20,tDis:10,x42:1,kn:'단일 공격'}),
 W('굉음','귀를 찢는 소리를 낸다. 2턴간 상대의 공격력이 20% 떨어지고, 70% 확률로 혼란에 빠진다.',0,{acc:100,atkDn:[.2,2],foeConf:70,x42:1,kn:'상대 변화'}),
 A('할퀴기','날카로운 발톱으로 할퀸다. 5턴간 지속 피해를 입히고, 부조화 30%를 쌓은 뒤 5턴간 매 턴 3%를 더 쌓는다.',140,{acc:50,sc:'범위',dotN:[2,5],tDis:30,tDisT:[3,5],x42:1,kn:'범위 공격'})]};
CHM.bestbeast={id:'bestbeast',name:'집행된 침식 마물',el:'？',star:3,race:'비인간형 적대적 생물',role:'a',sk:[
 A('돌진','거세게 몸을 던진다. 상대에게 부조화 10%가 쌓이고, 낙인 1개가 사라진다.',100,{acc:75,tDis:10,brandRm:1,x42:1,kn:'단일 공격'}),
 W('굉음','귀를 찢는 소리를 낸다. 5턴간 상대의 공격력이 20% 떨어지고, 70% 확률로 혼란에 빠지며, 낙인 5개가 새겨진다.',0,{acc:100,atkDn:[.2,5],foeConf:70,brandAdd:5,x42:1,kn:'상대 변화'}),
 A('할퀴기','날카로운 발톱으로 할퀸다. 5턴간 지속 피해를 입히고, 부조화 50%를 쌓은 뒤 5턴간 매 턴 10%를 더 쌓는다.',140,{acc:50,sc:'범위',dotN:[5,5],tDis:50,tDisT:[10,5],x42:1,kn:'범위 공격'})]};
CHM.wolfmen={id:'wolfmen',name:'늑대의 춤 용병',el:'？',star:3,race:'예르모족',role:'a',sk:[
 A('주먹질!','주먹을 휘두른다.',10,{acc:85,kn:'단일 공격'}),
 H('술 한잔의 여유..','술 한잔으로 숨을 돌린다.',20,{acc:100,kn:'단일 회복'}),
 A('난도질!!','마구잡이로 칼을 휘두른다. 2~5회 연속으로 공격한다.',20,{acc:85,multi:[2,5],kn:'단일 연속 공격'})]};
CHM.wolfboss={id:'wolfboss',name:'늑대의 춤 대장',el:'？',star:3,race:'예르모족',role:'t',sk:[
 A('주먹질!','주먹을 휘두른다.',45,{acc:90,kn:'단일 공격'}),
 H('술 백 잔을 마실 테다!!','술을 마구 들이켠다. 자신은 반드시 혼란에 빠진다.',30,{acc:100,selfConf:1,x42:1,kn:'단일 회복'}),
 A('난도질!!','마구잡이로 칼을 휘두른다. 2~5회 연속으로 공격한다.',45,{acc:80,multi:[2,5],kn:'단일 연속 공격'})]};
CHM.icingbaekdo={id:'icingbaekdo',name:'얼어붙은 백도',el:'金',star:5,race:'원향족',role:'a',sk:[
 A('얼어붙은 삼지창','얼어붙은 삼지창으로 두 번 찌른다. 서리를 1개 얻는다. 火 · 金에게는 약하고 木 · 水에게는 강하다.',40,{acc:90,multi:[2,2],frost:1,tm:FR,kn:'단일 연속 공격'}),
 A('어는 비','차갑게 내리는 비로 얼려 버린다. 서리 5개를 소모하며, 90% 확률로 상대를 빙결시킨다.',70,{acc:100,sc:'범위',frz:90,frostCost:5,x42:1,kn:'범위 공격'}),
 A('자유로워진 백호의 힘','해방된 백호의 힘을 휘두른다. 사용할 때마다 공격력 10%, 방어무시 10%, 속도 3%가 오른다. (최대 5중첩)',70,{acc:90,sc:'범위',bkFree:1,x42:1,kn:'범위 공격'})]};

/* ---------- 대사 ---------- */
const mk=(id,nm,c,wp,pre,win,lose,o)=>{DLG[id]=Object.assign({nm,c,tag:'',jp:'',wp,pre,win,lose,wc:c},o||{})};
mk('thebeast','침식 마물','d','과',['크르르⋯⋯.'],'끼이이익!!','크아아악!!',{full:()=>`${dlgName('침식 마물','d')}이 당신을 발견했다!`});
mk('bestbeast','집행된 침식 마물','d','과',['크르르⋯⋯.'],'끼이이익!!','크아아악!!',{mid:['눈빛이 남다르다!'],full:()=>`${dlgName('침식 마물','d')}이 당신을 발견했다!`});
mk('wolfmen','늑대의 춤 용병','b','과',['어이, 어이. 거기 너 뭐야.'],'죄송합니다, 한 번만 살려주세요!!','흥, 까불지 말란 말이야!',{full:e=>`${dlgName('늑대의 춤 용병',(e&&e.dc)||'b')}이 당신을 발견했다!`});
mk('wolfboss','늑대의 춤 대장','b','과',['네가 우리 애들이 말한 놈이냐?'],'늑대의 춤의 새로운 대장이 되어주세요, 보스!!','아우~!! 내 안에 늑대가 울부짖는다!!',{full:e=>`${dlgName('늑대의 춤 대장',(e&&e.dc)||'b')}이 당신을 발견했다!`});
mk('icingbaekdo','백백도','s','와',['내가 여기서 이기게 된다면⋯⋯.','⋯ 그건 내가 그만큼 강해졌다는 뜻일까?'],'아무도⋯ 나를⋯ 이해할 수 없어⋯⋯.','자유로워진 것 같아⋯⋯.',{mid:['당신이 알던 모습과는 사뭇 달라졌지만,'],full:()=>`${dlgName('백백도','s')}가 전투를 위해 찾아왔다!`});

/* 늑대의 춤 용병 · 대장: 이름 색과 주 오행은 무작위 / 집행된 침식 마물: 주 오행 무작위 */
const _me42=makeEnemy;
makeEnemy=function(w){
 const e=_me42(w);
 try{
  const id=e.ch.id;
  if(id==='wolfmen'||id==='wolfboss'){const c=rr(COLS);e.ch=Object.assign({},e.ch,{el:c[1]});e.dc=c[0]}
  else if(id==='bestbeast')e.ch=Object.assign({},e.ch,{el:rr(EL5)});
  else if(id==='icingbaekdo')e.frzRes=1;
 }catch(x){}
 return e};
const _db42=drawBattle;
drawBattle=function(){
 try{const e=run&&run.enemy;if(e&&e.dc&&DLG[e.ch.id]){DLG[e.ch.id].c=e.dc;DLG[e.ch.id].wc=e.dc}}catch(x){}
 return _db42()};

/* ---------- 도우미 ---------- */
const S42=f=>(run&&run.dbl)?(f.pos||f.side):f.side;
const evx=(ev,t,f,v,o)=>{o=o||{};ev.push({t,s:snap(),raw:true,pop:v!==undefined?{side:S42(f),v,cls:o.cls||'tx'}:undefined,fx:o.fx?{side:S42(f),...o.fx}:undefined,sfx:o.sfx})};
function addDis(f,pct,ev){
 if(!f||f.hp<=0)return;
 f.dis=Math.min(100,(f.dis||0)+pct);
 evx(ev,`${f.ch.name} 부조화 ${f.dis}%`,f,'부조화 '+f.dis+'%',{fx:{k:'down',c:'#8a6fb8'},sfx:'down'});
 if(f.dis>=100){f.hp=0;evx(ev,`${josa(f.ch.name,'은/는')} 부조화가 100%에 달해 전투불능이 되었다.`,f,'전투불능',{sfx:'ko'})}}
function addBrand(f,n,ev){
 if(!f||f.hp<=0)return;
 f.brand=Math.min(7,(f.brand||0)+n);
 evx(ev,`${josa(f.ch.name,'은/는')} 낙인이 새겨졌다. (${f.brand}/7)`,f,'낙인 x'+f.brand,{fx:{k:'down',c:'#a02a2a'},sfx:'down'});
 if(f.brand>=7){f.hp=0;run.brandKO=true;evx(ev,`${josa(f.ch.name,'은/는')} 낙인이 7개 쌓여 전투불능이 되었다.`,f,'전투불능',{sfx:'ko'})}}

/* ---------- 스킬 효과 ---------- */
let MC=null;
const _rbs42=resetBattleState;
resetBattleState=function(f){_rbs42(f);f.bkS=0};
const _perf42=perform;
function castOnly(a,d,idx,ev,sk){
 const n0=ev.length,ot=sk.t,op=sk.p;sk.t='h';sk.p=0;
 try{_perf42(a,d,idx,ev)}finally{sk.t=ot;sk.p=op}
 const mine=ev.slice(n0);
 return{cast:mine.some(e=>e.t===`${a.ch.name}의 ${sk.n}`),fail:mine.some(e=>e.t==='효과가 없었다.'),mine}}
function body(a,d,idx,ev){
 const sk=idx<0?BASIC:a.ch.sk[idx];
 if(!sk||!sk.x42)return _perf42(a,d,idx,ev);
 const mp0=a.mp,n0=ev.length;
 let cast,fail=false,mine;
 if(sk.t==='w'){const r=castOnly(a,d,idx,ev,sk);cast=r.cast;fail=r.fail;mine=r.mine;
  if(fail)mine.forEach(e=>{if(e.t==='효과가 없었다.'&&e.pop)e.pop={...e.pop,side:S42(d)}})}
 else{_perf42(a,d,idx,ev);mine=ev.slice(n0);cast=mine.some(e=>e.t===`${a.ch.name}의 ${sk.n}`)}
 if(sk.frostCost)a.mp=mp0;
 const landed=mine.some(e=>typeof e.t==='string'&&(e.t.startsWith(`${d.ch.name}에게 `)||e.t.includes('싸울 마음이 없다')));
 const once=!run.areaSub;
 /* 공격 후 상대에게 */
 if(sk.t==='a'&&landed&&d.hp>0){
  if(sk.tDis)addDis(d,sk.tDis,ev);
  if(sk.tDisT&&d.hp>0){d.curseDisT=sk.tDisT[1];d.curseDisP=sk.tDisT[0]}
  if(sk.brandRm&&d.hp>0&&(d.brand||0)>0){d.brand--;evx(ev,`${d.ch.name}의 낙인이 하나 사라졌다. (${d.brand}/7)`,d,'낙인 x'+d.brand,{fx:{k:'up',c:'#a02a2a'},sfx:'up'})}}
 /* 상대 변화 */
 if(sk.t==='w'&&cast&&!fail&&d.hp>0){
  if(sk.atkDn){d.d.atk=Math.max(d.d.atk,sk.atkDn[0]);d.dT=Math.max(d.dT||0,sk.atkDn[1]);
   evx(ev,`${d.ch.name} 공격력 하락`,d,'공격력 DOWN',{fx:{k:'down',c:'#ad8fd8'},sfx:'down'})}
  if(sk.foeConf&&!d.conf&&Math.random()*100<sk.foeConf){d.conf=1;d.confAge=0;
   evx(ev,`${josa(d.ch.name,'은/는')} 혼란에 빠졌다.`,d,'혼란',{fx:{k:'down',c:'#d8a85a'},sfx:'down'})}
  if(sk.brandAdd)addBrand(d,sk.brandAdd,ev)}
 /* 자신에게 */
 if(cast&&once&&a.hp>0){
  if(sk.selfConf&&!a.conf){a.conf=1;a.confAge=0;
   evx(ev,`${josa(a.ch.name,'은/는')} 혼란에 빠졌다.`,a,'혼란',{fx:{k:'down',c:'#d8a85a'},sfx:'down'})}
  if(sk.frostCost){a.frost=Math.max(0,(a.frost||0)-sk.frostCost);
   evx(ev,`${a.ch.name} 서리 ${a.frost}개`,a,'서리 '+a.frost,{fx:{k:'up',c:'#9ad0f0'},sfx:'up'})}
  if(sk.bkFree){
   a.bkS=Math.min(5,(a.bkS||0)+1);const n=a.bkS;
   a.m.atk=Math.max(a.m.atk,.1*n);a.mT=99;a.ignT=99;a.ignP=Math.max(a.ignP||0,.1*n);a.spdB=.03*n;a.spdBT=99;
   evx(ev,`${a.ch.name} 백호의 힘이 오른다. (${n}중첩)`,a,'백호의 힘 x'+n,{fx:{k:'up',c:'#c8d4e8'},sfx:'up'})}}}
perform=function(a,d,idx,ev){
 const prev=MC;MC=a;
 try{
  const sk=idx<0?BASIC:a.ch.sk[idx];
  /* 프리드리히산 와인: 명중률 10% 감소 */
  if(a.side==='p'&&a.wine>0&&sk){
   const o=sk.acc;sk.acc=(o!==undefined?o:(sk.t==='a'?95:100))-10;
   try{return body(a,d,idx,ev)}finally{if(o===undefined)delete sk.acc;else sk.acc=o}}
  return body(a,d,idx,ev)
 }finally{MC=prev}};
const _mc42=mpCost;
mpCost=function(s,i){
 if(s&&s.frostCost){const F=MC||(run&&run.party&&run.party[run.active]);return(F&&(F.frost||0)>=s.frostCost)?0:9999}
 return _mc42(s,i)};
const _ai42=aiPick;
aiPick=function(e,p){
 const prev=MC;MC=e;
 try{return _ai42(e,p)}finally{MC=prev}};

/* ---------- 지역 · 차원 ---------- */
const rep=l=>l.flatMap(([id,w])=>Array(w).fill(id));
const normal=(npc,f)=>{
 const o=[[50,{ids:[npc]}]];
 [[4,20],[5,30]].forEach(([s,r])=>{const l=f[s]||[];if(l.length)o.push([r,{ids:rep(l)}])});
 return o};
const bossL=l=>l.map(([id,w])=>[w,{ids:[id]}]);
REG.nornir={id:'nornir',name:'노르니르',g:['#2b2f63','#090a18'],tip:'',
 spawn:normal('thebeast',{5:[['yormungand',50]]}),
 bossSp:bossL([['bestbeast',50],['yormungand',50]]),
 next:[['disir',50],['yggdr',50]]};
REG.yggdr={id:'yggdr',name:'위그드라실 성채',g:['#3a2a4e','#0f0a18'],tip:'',
 spawn:normal('wolfmen',{4:[['berdi',15],['hannah',20]],5:[['yormungand',20],['icingbaekdo',20],['kuroaka',1]]}),
 bossSp:bossL([['wolfboss',24],['berdi',15],['yormungand',20],['hannah',20],['icingbaekdo',20],['kuroaka',1]]),
 next:[['nornir',100]]};
REG.disir={id:'disir',name:'디시르',g:['#2d3a5a','#0a0d18'],tip:'',
 spawn:normal('thebeast',{4:[['hannah',25]],5:[['yormungand',15],['icingbaekdo',29],['kuroaka',1]]}),
 bossSp:bossL([['bestbeast',30],['yormungand',15],['hannah',25],['icingbaekdo',29],['kuroaka',1]]),
 next:[['nornir',50],['valk',50]]};
REG.valk={id:'valk',name:'왈퀴리아',g:['#4a2f3a','#150a10'],tip:'',
 spawn:normal('bestbeast',{5:[['jarel',33],['yormungand',33],['icingbaekdo',33],['kuroaka',1]]}),
 bossSp:bossL([['jarel',33],['yormungand',33],['icingbaekdo',33],['kuroaka',1]]),
 next:[['disir',100]]};

const WORLD=['tamaki','iwonhyang','sephirot','badr','glisha'],SPACE=['nornir','yggdr','disir','valk'];
const START={world:'tamaki',space:'nornir'},DIMS=['world','space'],DIM_STG=25;
/* 차원: 25스테이지(지도 5개)마다 다른 차원으로 전환 */
window.dimAt=function(b){
 const k=Math.floor(b/(DIM_STG/CFG.MAP_STAGES));
 if(!run.dimK)run.dimK=['world'];
 while(run.dimK.length<=k){const cur=run.dimK[run.dimK.length-1],o=DIMS.filter(x=>x!==cur);run.dimK.push(o.length?rr(o):cur)}
 return run.dimK[k]};
window.mapList=function(b){return dimAt(b)==='space'?SPACE:WORLD};
ensureRegion=function(b){
 if(!run.regions)run.regions=[];
 while(run.regions.length<=b){
  const i=run.regions.length;let r;
  if(i===0)r='tamaki';
  else if(i%(DIM_STG/CFG.MAP_STAGES)===0)r=START[dimAt(i)];
  else r=nextRegion(run.regions[i-1],run.metAnak);
  run.regions.push(r);run.metAnak=false}};
const _nb42=nextBattle;
nextBattle=function(){
 try{
  const w=run.wave,b=Math.floor((w-1)/CFG.MAP_STAGES);
  if(b>0&&(w-1)%CFG.MAP_STAGES===0&&run.dimDone!==w){
   run.dimDone=w;ensureRegion(b);
   /* 차원이 바뀌면 능력치 강화는 초기화 (구슬 · 부조화 · HP · MP · 아이템은 유지) */
   if(dimAt(b)!==dimAt(b-1))run.buf={atk:0,def:0,spd:0}}
 }catch(x){}
 _nb42()};

/* 부조화 축적: 노르니르 1% · 디시르 3% · 왈퀴리아 1% (매 턴, 전체) */
const DISR={nornir:1,disir:3,valk:1};
const _dbt42=dblTurn;
dblTurn=function(acts){if(run)run.disDone=false;return _dbt42(acts)};
const _eot42=endOfTurn;
endOfTurn=function(ev){
 _eot42(ev);
 const p=DISR[run.region];
 if(!p||run.bw)return;
 if(run.dbl){if(run.disDone)return;run.disDone=true}
 const list=run.dbl?[...dAllies(),...dFoes()]:[run.party[run.active],run.enemy];
 [...new Set(list)].filter(f=>f&&f.hp>0).forEach(f=>addDis(f,p,ev))};

/* ---------- 특산품 (위그드라실 성채의 보상 스테이지) ---------- */
ITEMS.ger={n:'게르만주',r:4,d:'HP 50% 회복\n상태이상 해제',w:3,pct:.5,cure:1};
ITEMS.fri={n:'프리드리히산 와인',r:4,d:'HP 50% 회복\n공격력 30% 증가 · 명중률 10% 감소\n(5스테이지)',w:3,pct:.5,cure:0,wine:1};
ITEMS.lak={n:'라칸칸',r:4,d:'HP 100% 회복\n상태이상 해제',w:3,pct:1,cure:1};
const SPEC=['ger','fri','lak'];
const _rc42=rewardCards;
rewardCards=function(){
 const sv={};
 if(!(run&&run.region==='yggdr'))SPEC.forEach(id=>{sv[id]=ITEMS[id];delete ITEMS[id]});
 try{return _rc42()}finally{Object.keys(sv).forEach(id=>{ITEMS[id]=sv[id]})}};
const _ru42=rewardUse;
rewardUse=function(id,i){
 const f=run.party[i],m=ITEMS[id];
 if(f&&m){if(m.cure)cleanse(f);if(m.wine)f.wine=5}
 return _ru42(id,i)};
const _to42=tickOrbs;
tickOrbs=function(){_to42();(run.party||[]).forEach(f=>{if(f.wine>0)f.wine--})};
const _st42=st;
st=function(f,k){let v=_st42(f,k);if(k==='atk'&&f.wine>0)v*=1.3;return v};
const _ic42=itemIcon;
itemIcon=function(id,col){
 if(!SPEC.includes(id))return _ic42(id,col);
 const sv=p=>`<svg class="si" viewBox="0 0 24 24" fill="none" stroke="${col}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
 if(id==='ger')return sv('<path d="M10 3h4M10.5 3v3.5L8.5 9v10.5A1.5 1.5 0 0 0 10 21h4a1.5 1.5 0 0 0 1.5-1.5V9l-2-2.5V3"/><path d="M8.5 13h7"/>');
 if(id==='fri')return sv('<path d="M7 3h10l-.6 6.5a4.4 4.4 0 0 1-8.8 0z"/><path d="M12 14v6M8.5 21h7"/>');
 return sv('<path d="M12 6c4.6 0 7.5 3.2 7.5 7s-3 7-7.5 7-7.5-3.2-7.5-7S7.400 6 12 6z"/><path d="M12 6c.2-1.6 1.2-2.6 3-3"/>')};
})();
