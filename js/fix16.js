/* 16차 수정: 아네모네 · 타오테 · 자렐 · 지용 */

/* ---------- 스킬 ---------- */
CHM.anemone.sk=[
 A('미미한 공격..','어딘가 힘이 빠진 공격을 한다.',5,{acc:95}),
 A('꽃 선물','꽃을 선물한다. 받은 쪽은 기운이 빠진다.',-15,{acc:80,gift:1}),
 B('고귀한 숙녀','숙녀의 품격으로 아군이 가볍게 움직인다.',0,{acc:75,evUp:3,kn:'타인 변화'})];
CHM.taotie.sk=[
 A('검술','당나라 시절부터 애용한 무기로 벤다.',35,{acc:95}),
 W('나태','상대에게 나태를 부여해 움직임을 둔하게 만든다.',0,{acc:95,slow:5,kn:'타인 변화'}),
 A('소멸','검게 변한 손으로 닿은 것을 가루로 만든다.',100,{acc:50,multi:[2,2],kn:'단일 공격'})];
CHM.jarel.sk=[
 A('풀화살','오덕으로 이루어진 풀과 화살을 쏜다.',15,{acc:100,sc:'범위',multi:[2,5],kn:'범위 연속 공격'}),
 A('구속넝쿨','넝쿨로 상대를 구속한다. 지속 피해를 입히고 마지막으로 쓴 기술을 봉인한다.',35,{acc:75,dot:5,bind:1}),
 B('흡수','모든 부조화를 몸으로 흡수한다.',0,{acc:50,absorb:1,kn:'자기 변화'})];
CHM.jiyong.sk=[
 A('조약돌','조약돌을 던진다.',10,{acc:100,multi:[2,5],kn:'단일 연속 공격'}),
 W('예지','일어날 일을 읽어 상대의 기술 하나를 막는다.',0,{acc:90,rndSeal:1,kn:'타인 변화'}),
 H('향수','그리운 향기로 파티의 몸과 마음을 달랜다.',0,{acc:100,partyHeal:1,kn:'타인 변화'})];

Object.assign(PROF,{
 anemone:{full:'아네모네',rom:'Anemone / 銀蓮花',aff:'세피로트 나무',sex:'여성',age:'외관상 18세',ht:'147cm',race:'이사야족',el:'火',abil:'영생을 누리는 능력',
  intro:'‘목의 신’ 메르헨의 보좌관으로, 유일하게 세피로트 나무에서 태어나지 않은 이사야족이다. 언제나 웃으면서 말끝을 올리고 요조숙녀같은 행동을 선보인다.'},
 taotie:{full:'타오테',rom:'Tāotiè / 饕餮',aff:'글리샬라볼라스',sex:'남성',age:'외관상 21세',ht:'183cm',race:'사흉',el:'木',abil:'나태를 다루는 능력',
  intro:'‘금의 신’ 사마엘을 돕는 사흉 중 한 명. 전생의 정체는 송 루이후가 당나라 해결사로 활동하던 시절에 루이후를 도와줬던 조수 탕 하오위이다. 인간이었을 적과 달리 귀찮은 것을 싫어하며 개인주의자처럼 행동하지만, 루이후에게만은 이런 성향을 누그러뜨리고 있다.'},
 jarel:{full:'자렐',rom:'Jarrell / 贾雷尔',aff:'예르모 행성',sex:'남성',age:'470세',ht:'182cm',race:'예르모족',el:'土',abil:'풀을 다루는 능력',
  intro:'과거 예르모 행성 전역에 유행했던 역병으로부터 예르모족을 구한 &lt;예르모의 영웅&gt;이었으나, 현재는 왠지 예르모족의 비난을 받고 있다. 예르모 행성에 오덕 침식 마물이 나타난 후로 자취를 감췄다.'},
 jiyong:{full:'지용',rom:'Jiyong / 芝溶',aff:'아람길',sex:'남성',age:'29세',ht:'168cm',race:'인간',el:'金',abil:'예지를 다루는 능력',
  intro:'해경의 오랜 친구 중 한 명으로, 아람학당의 국어교사이자 책방 사장으로 일하고 있다. 늘 화가 많고 신경질적이지만 타인의 마음을 너무 쉽고 깊게 헤아릴 줄 알아 생긴 방어일 뿐, 나쁜 사람은 절대 아니다.'}});
Object.keys(S.chars||{}).forEach(ensureChar);

/* ---------- 상태 ---------- */
const EV_STK=.15,SLOW_STK=.1;
const _rbs16=resetBattleState;
resetBattleState=function(f){_rbs16(f);f.evStk=0;f.inv=0;f.slowStk=0;f.slowT=0;f.spdB=0;f.spdBT=0};
const _st16=st;
st=function(f,k){let v=_st16(f,k);
 if(k==='spd'){if(f.spdB)v*=1+f.spdB;if(f.slowStk)v*=Math.max(.3,1-SLOW_STK*f.slowStk)}
 return v};
const _snap16=snap;
snap=function(){const s=_snap16(),P=run.party[run.active],E=run.enemy;
 const add=(o,x)=>{const t=o.st;t.ev=t.ev||x.evStk>0||x.inv>0;t.dbf=t.dbf||x.slowStk>0;t.spd=t.spd||x.spdB>0};
 add(s.p,P);add(s.e,E);return s};
const _stIc16=stIc;
stIc=function(f){let h=_stIc16(f);
 if(f.evStk>0||f.inv>0)h+=`<span>${svg('evade')}</span>`;
 if(f.slowStk>0)h+=`<span>${svg('debuff')}</span>`;
 if(f.spdB>0)h+=`<span>${svg('buff')}</span>`;
 return h};
const _eot16=endOfTurn;
endOfTurn=function(ev){_eot16(ev);
 [run.party[run.active],run.enemy].forEach(f=>{
  if(f.inv>0)f.inv--;
  if(f.slowT>0&&--f.slowT<=0)f.slowStk=0;
  if(f.spdBT>0&&--f.spdBT<=0)f.spdB=0})};

/* ---------- 행동 ---------- */
const _perf16=perform;
perform=function(a,d,idx,ev){
 const sk=idx<0?BASIC:a.ch.sk[idx];
 if(!sk)return _perf16(a,d,idx,ev);
 const me=a.side,you=d.side,n0=ev.length;
 const say=(t,o)=>ev.push({t,s:snap(),...o}),tx=(side,v)=>({side,v,cls:'tx'});
 const trick=sk.gift||sk.slow||sk.rndSeal||sk.absorb||sk.evUp,custom=trick||sk.partyHeal;
 const hp0=d.hp,ot=sk.t,op=sk.p;
 if(!custom){
  /* 일반 공격: 무적 · 회피율 중첩 */
  if(sk.t==='a'&&!(d.evade>0)&&(d.inv>0||(d.evStk&&Math.random()<EV_STK*d.evStk))){
   const old=d.evade,inv=d.inv>0;d.evade=1;
   try{_perf16(a,d,idx,ev)}finally{d.evade=old}
   if(inv)for(let j=n0;j<ev.length;j++){const e=ev[j];
    if(/공격을 피했다/.test(e.t)){e.t=`${josa(d.ch.name,'은/는')} 무적 상태라 피해를 받지 않는다.`;if(e.pop)e.pop.v='무적'}}
  }else _perf16(a,d,idx,ev);
  if(sk.bind&&d.hp>0&&d.hp<hp0){
   if(d.dot)d.dot.t=5;
   const l=d.last;
   if(l!==null&&l!==undefined&&l>=0&&d.ch.sk[l]&&(d.seal===null||d.seal===undefined)){d.seal=l;d.sealAge=0;
    say(`${d.ch.name}의 ${d.ch.sk[l].n}이(가) 봉인되었다.`,{pop:tx(you,'봉인'),fx:{side:you,k:'down',c:'#ad8fd8'},sfx:'down'})}}
  return}
 if(sk.partyHeal){_perf16(a,d,idx,ev)}
 else{sk.t='h';sk.p=0;try{_perf16(a,d,idx,ev)}finally{sk.t=ot;sk.p=op}}
 const mine=ev.slice(n0),cast=mine.some(e=>e.t===`${a.ch.name}의 ${sk.n}`),fail=mine.some(e=>e.t==='효과가 없었다.');
 if(!cast||fail)return;
 const mates=me==='p'?run.party.filter(f=>f.hp>0):[a];
 const k=skMul(slv(a,idx));
 const guard=()=>{ /* 공격형 스킬이 막히는지 */
  if(d.inv>0){say(`${josa(d.ch.name,'은/는')} 무적 상태라 피해를 받지 않는다.`,{pop:tx(you,'무적'),sfx:'miss'});return true}
  if(d.evade>0||(d.evStk&&Math.random()<EV_STK*d.evStk)){say(`${josa(d.ch.name,'은/는')} 공격을 피했다.`,{pop:tx(you,'회피'),fx:{side:you,k:'dodge'},sfx:'miss'});return true}
  return false};
 if(sk.gift){
  if(guard())return;
  const g=Math.min(d.maxhp-d.hp,hitCalc(a,d,{p:15,ign:0},k).dmg);
  if(g>0){d.hp+=g;say(`${d.ch.name} HP ${g} 회복`,{pop:{side:you,v:'+'+g,cls:'heal'},fx:{side:you,k:'heal'},sfx:'heal'})}
  d.dbStk=Math.min(2,(d.dbStk||0)+1);
  say(`${d.ch.name} 공격력 저하 (${d.dbStk}단계)`,{pop:tx(you,'공격력 DOWN x'+d.dbStk),fx:{side:you,k:'down',c:'#ad8fd8'},sfx:'down'})}
 if(sk.slow){
  d.slowStk=Math.min(sk.slow,(d.slowStk||0)+1);d.slowT=25;
  say(`${d.ch.name} 속도 저하 (${d.slowStk}단계)`,{pop:tx(you,'속도 DOWN x'+d.slowStk),fx:{side:you,k:'down',c:'#ad8fd8'},sfx:'down'})}
 if(sk.rndSeal){
  if(d.seal!==null&&d.seal!==undefined){say('이미 봉인된 기술이 있다.',{pop:tx(you,'변화 없음'),sfx:'miss'});return}
  const i=Math.floor(Math.random()*d.ch.sk.length);d.seal=i;d.sealAge=0;
  say(`${d.ch.name}의 ${d.ch.sk[i].n}이(가) 봉인되었다.`,{pop:tx(you,'봉인'),fx:{side:you,k:'down',c:'#ad8fd8'},sfx:'down'})}
 if(sk.evUp){
  mates.forEach(f=>{f.evStk=Math.min(sk.evUp,(f.evStk||0)+1)});
  say(`아군의 회피율이 오른다. (${a.evStk}단계)`,{pop:tx(me,'회피율 UP x'+a.evStk),fx:{side:me,k:'up',c:'#6fa0dc'},sfx:'up'})}
 if(sk.absorb){
  const b=a.hp;a.hp=a.maxhp;a.inv=2;a.m.atk=Math.max(a.m.atk,1);a.mT=3;a.spdB=1;a.spdBT=3;
  say(`${a.ch.name} HP ${a.hp-b} 회복`,{pop:{side:me,v:'+'+(a.hp-b),cls:'heal'},fx:{side:me,k:'heal'},sfx:'heal'});
  say(`${josa(a.ch.name,'은/는')} 힘을 흡수했다. 2턴간 무적, 3턴간 공격력과 속도가 오른다.`,{pop:tx(me,'무적'),fx:{side:me,k:'up',c:EC[a.ch.el]},sfx:'up'})}
 if(sk.partyHeal){
  mates.forEach(f=>{f.hp=Math.min(f.maxhp,f.hp+Math.round(f.maxhp*.5));cleanse(f)});
  say('파티의 HP가 회복되고 상태이상이 사라졌다.',{pop:tx(me,'파티 회복'),fx:{side:me,k:'heal'},sfx:'heal'})}
};

/* 구속넝쿨 · 꽃 선물은 공격형이라 위의 임시 변환을 쓰지 않는 쪽도 처리 */
const _ai16=aiPick;
aiPick=function(e,p){const r=_ai16(e,p);
 if(r>=0){const s=e.ch.sk[r];
  if(s&&((s.evUp&&e.evStk>=s.evUp)||(s.slow&&p.slowStk>=s.slow)||(s.gift&&p.dbStk>=2)||(s.rndSeal&&p.seal!==null&&p.seal!==undefined)||(s.absorb&&e.hp>e.maxhp*.5)))return 0}
 return r};
