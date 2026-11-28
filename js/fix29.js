/* 29차 수정: 케르마 · 아스텔 · 하나 나이틀리 스킬 정리 (서리 · 얼음 결정 · 빙결) */
(function(){
let MC29=null;
const S29=f=>(run&&run.dbl)?(f.pos||f.side):f.side;
const evx=(ev,t,f,v,o)=>{o=o||{};ev.push({t,s:snap(),raw:true,pop:v!==undefined?{side:S29(f),v,cls:o.cls||'tx'}:undefined,fx:o.fx?{side:S29(f),...o.fx}:undefined,sfx:o.sfx,d:o.d})};
const pk=()=>{try{(run.party||[]).forEach(f=>{if(f.permaKO&&f.hp>0){f.hp=0;f.bkWin=0}})}catch(e){}};

/* ---------- 스킬 데이터 ---------- */
CHM.kerma.sk=[
 A('차크람','차크람으로 전투에 임한다. 2회 연속으로 공격한다.',30,{acc:90,multi:[2,2],kn:'단일 연속 공격'}),
 A('누르','빛을 무기화해 쏜다. 상대의 부조화가 20% 줄어든다.',90,{acc:100,mp:18,disCut:20,kn:'단일 공격'}),
 A('틴들','능력치를 극단적으로 끌어올려 행동하지 못하게 한다. 상대의 부조화가 50% 줄어든다.',120,{acc:100,stun:100,mp:28,disCut:50,kn:'단일 공격'})];
CHM.astel.sk=[
 A('철퇴','철퇴로 내려친다.',55,{acc:65,kn:'단일 공격'}),
 A('바위','바위를 던진다. 2~5회 연속으로 공격한다.',10,{acc:80,multi:[2,5],mp:11,kn:'단일 연속 공격'}),
 A('틴들','능력치를 극단적으로 끌어올려 행동하지 못하게 한다. 상대의 부조화가 50% 줄어든다.',120,{acc:100,stun:100,mp:19,disCut:50,kn:'단일 공격'})];

/* ---------- 하나 나이틀리 ---------- */
CHM.hannah.sk=[
 A('서리 얼음','서리가 낀 얼음을 던진다. 서리를 1개 얻는다. MP를 소모한다.',35,{acc:95,mp:4,frost:1,kn:'단일 공격'}),
 W('따뜻한 포옹','따뜻하게 안아 상대의 몸에 얼음 결정을 1개 만든다. 서리 3개를 소모한다. 얼음 결정 1개당 공격력 · 속도가 20% 떨어지고, 3개가 쌓이면 전투불능이 되어 이번 게임에서 되살아날 수 없다.',0,{acc:100,hug:1,mp:0,kn:'타인 변화'}),
 A('눈보라','눈보라를 일으켜 얼려 버린다. 상대는 빙결 상태가 된다. 더블 배틀에서는 하나를 제외한 모두가 휘말린다.',90,{acc:100,sc:'범위',frz:100,snowAll:1,mp:20,kn:'범위 공격'})];
Object.assign(PROF,{
 hannah:{full:'하나 나이틀리',rom:'Hannah Knightly / 汉娜',aff:'반대세력',sex:'여성',age:'26세',ht:'171cm',race:'인간',el:'水',abil:'얼음을 다루는 능력',
  intro:'반대세력의 주요 인물 중 한 명으로, 세상력으로 900년 전에 리벤 카르마에서 일어난 대형 화재의 주범 중 한 명이다. 트럼프에게 세뇌를 당하며 미치광이가 되어버렸다는데⋯.'},
 astel:{full:'아스텔',rom:'ἀστήρ / 星辰',aff:'덴드론고니아',sex:'남성',age:'약 26만세',ht:'177cm',race:'아르케족',el:'+',abil:'바위를 다루는 능력',
  intro:'에이레네 학교의 학생. 사바오스 부대의 대장이 된 케토스를 높이 사고 있으나, 매번 전투에 몰두하는 케토스가 걱정되어 잔소리를 하고 있다. 성적이 좋지 못해 몇 년째 졸업을 못 하고 있어, 네필레가 유심히 신경쓰고 있다.'}});
if(PROF.kerma)PROF.kerma.aff='덴드론고니아, 프라니아 제국';

/* ---------- 상태 ---------- */
const _rbs29=resetBattleState;
resetBattleState=function(f){_rbs29(f);f.frost=0;f.ice=0;f.frz=0;f.frzAge=0;f.frzWeak=0};
const _cl29=cleanse;
cleanse=function(f){const had=_cl29(f)||!!(f.frz||f.ice||f.frzWeak);f.frz=0;f.frzAge=0;f.frzWeak=0;f.ice=0;return had};
const _st29=st;
st=function(f,k){let v=_st29(f,k);
 if(f.ice>0&&(k==='atk'||k==='spd'))v*=Math.max(.1,1-.2*f.ice);
 return v};
const _mc29=mpCost;
mpCost=function(s,i){
 if(s&&s.hug){const F=MC29||(run&&run.party&&run.party[run.active]);return(F&&(F.frost||0)>=3)?0:9999}
 return _mc29(s,i)};
const _sf29=skFace;
skFace=function(ch,i,s,lv,tag,mp){
 let h=_sf29(ch,i,s,lv,tag,mp);
 if(mp&&s&&s.hug){const F=run&&run.party&&run.party.find(f=>f.ch===ch);h=h.replace(/MP \d+/,'서리 3'+(F?' · 보유 '+(F.frost||0):''))}
 return h};

/* ---------- 화면 ---------- */
Object.assign(SVGP,{
 frz:'<path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9"/>',
 ice:'<path d="M12 3l5 6-5 12-5-12z"/>'});
['frz','ice'].forEach(k=>{ICKEYS.push(k);STICON[k]=k});
const _snap29=snap;
snap=function(){
 const s=_snap29();
 const add=(o,f)=>{if(!o||!f)return;o.st=o.st||{};o.st.frz=!!f.frz;o.st.ice=(f.ice|0)>0};
 try{
  if(run.dbl){add(s.p,dA());add(s.e,run.eA||run.enemy);add(s.q,dB());add(s.f,run.enemy2)}
  else{add(s.p,run.party[run.active]);add(s.e,run.enemy)}
 }catch(e){}
 return s};
const _stIc29=stIc;
stIc=function(f){let h=_stIc29(f);
 if(f.frz>0)h+=`<span>${svg('frz')}</span>`;
 if(f.ice>0)h+=`<span>${svg('ice')}</span>`;
 return h};

/* ---------- 행동 ---------- */
const _perf29=perform;
function castOnly(a,d,idx,ev,sk){
 const n0=ev.length,ot=sk.t,op=sk.p;sk.t='h';sk.p=0;
 try{_perf29(a,d,idx,ev)}finally{sk.t=ot;sk.p=op}
 const mine=ev.slice(n0);
 return{cast:mine.some(e=>e.t===`${a.ch.name}의 ${sk.n}`),fail:mine.some(e=>e.t==='효과가 없었다.'),mine}}
function body(a,d,idx,ev){
 const sk=idx<0?BASIC:a.ch.sk[idx];
 if(!sk)return _perf29(a,d,idx,ev);
 const pendNow=a.pend!==null&&a.pend!==undefined;
 /* 빙결: 행동불가 */
 if(a.frz>0&&!pendNow){
  evx(ev,`${josa(a.ch.name,'은/는')} 얼어붙어 움직이지 못한다.`,a,'빙결',{sfx:'stun'});return}
 /* 따뜻한 포옹 */
 if(sk.hug){
  const m0=a.mp,r=castOnly(a,d,idx,ev,sk);a.mp=m0;
  if(r.fail)r.mine.forEach(e=>{if(e.t==='효과가 없었다.'&&e.pop){e.pop={...e.pop,side:S29(d)};e.raw=true}});
  if(!r.cast||r.fail||d.hp<=0)return;
  a.frost=Math.max(0,(a.frost||0)-3);
  d.ice=Math.min(3,(d.ice||0)+1);
  evx(ev,`${d.ch.name} 얼음 결정 ${d.ice}개`,d,'얼음 결정 x'+d.ice,{fx:{k:'down',c:'#9ad0f0'},sfx:'down'});
  if(d.ice>=3){
   d.hp=0;d.permaKO=true;
   evx(ev,`${josa(d.ch.name,'은/는')} 얼음 결정에 뒤덮여 전투불능이 되었다. 이번 게임에서는 되살아날 수 없다.`,d,'전투불능',{sfx:'ko'})}
  return}
 const n0=ev.length,hp0=d.hp;
 _perf29(a,d,idx,ev);
 const mine=ev.slice(n0);
 const cast=mine.some(e=>e.t===`${a.ch.name}의 ${sk.n}`);
 const landed=mine.some(e=>typeof e.t==='string'&&(e.t.startsWith(`${d.ch.name}에게 `)||e.t.includes('싸울 마음이 없다')));
 if(sk.frost&&cast&&a.hp>0){
  a.frost=(a.frost||0)+sk.frost;
  evx(ev,`${a.ch.name} 서리 ${a.frost}개`,a,'서리 '+a.frost,{fx:{k:'up',c:'#9ad0f0'},sfx:'up'})}
 if(sk.disCut&&landed&&d.hp>0&&(d.dis||0)>0){
  const b=d.dis;d.dis=Math.max(0,b-sk.disCut);
  evx(ev,`${d.ch.name} 부조화 ${d.dis}%`,d,'부조화 -'+(b-d.dis)+'%',{fx:{k:'up',c:'#8fd0b0'},sfx:'up'})}
 if(sk.frz&&landed&&d.hp>0&&!d.frz&&Math.random()*100<sk.frz){
  d.frz=1;d.frzAge=0;
  evx(ev,`${josa(d.ch.name,'은/는')} 꽁꽁 얼어붙었다.`,d,'빙결',{fx:{k:'down',c:'#9ad0f0'},sfx:'down'})}}
perform=function(a,d,idx,ev){
 const prev=MC29;MC29=a;
 try{
  const sk=idx<0?BASIC:a.ch.sk[idx];
  /* 눈보라는 자신을 제외한 모두가 대상이므로 범위 반복에서 호출된다 */
  return body(a,d,idx,ev)
 }finally{MC29=prev;pk()}};
const _hc29=hitCalc;
hitCalc=function(a,d,sk,k){
 const h=_hc29(a,d,sk,k);
 if(d.frzWeak>0&&a.ch.el==='水'&&h.dmg>0)h.dmg=Math.round(h.dmg*2);
 return h};
const _dArea29=dArea;
dArea=function(a,list,first,idx,ev){
 const sk=a.ch.sk[idx];
 if(sk&&sk.snowAll&&run.dbl){
  const al=(a.side==='p'?dAllies():dFoes()).filter(x=>x!==a&&x.hp>0);
  list=[...list,...al]}
 return _dArea29(a,list,first,idx,ev)};

/* ---------- 턴 종료 ---------- */
const _eot29=endOfTurn;
endOfTurn=function(ev){
 const L=[run.party[run.active],run.enemy].filter(Boolean);
 _eot29(ev);
 L.forEach(f=>{
  if(f.hp<=0)return;
  if(f.frzWeak>0)f.frzWeak--;
  if(f.frz>0){
   const v=Math.max(1,Math.round(f.maxhp*.05)),b=f.hp;f.hp=Math.max(0,f.hp-v);const lost=b-f.hp;
   if(lost>0)evx(ev,`${f.ch.name} 빙결 피해 ${lost}`,f,'-'+lost,{cls:'dot',sfx:'hit'});
   if(f.hp<=0){evx(ev,`${josa(f.ch.name,'은/는')} 쓰러졌다.`,f,undefined,{sfx:'ko'});return}
   f.frzAge++;
   if(f.frzAge>=2&&Math.random()<.1){f.frz=0;f.frzAge=0;f.frzWeak=3;
    evx(ev,`${josa(f.ch.name,'은/는')} 얼음에서 풀려났다. 3턴간 水의 공격에 약해진다.`,f,'빙결 해제',{sfx:'up'})}}});
 pk()};
const _nb29=nextBattle;
nextBattle=function(){pk();_nb29()};
const _pr29=pickReward;
pickReward=function(i){
 const c=run&&run.cards&&run.cards[i],t=[];
 if(c&&c.k==='revive')run.party.forEach(f=>{if(f.permaKO&&f.hp<=0){f.hp=1;t.push(f)}});
 try{return _pr29(i)}finally{t.forEach(f=>{f.hp=0});pk()}};

/* ---------- AI ---------- */
const _ai29=aiPick;
aiPick=function(e,p){
 const prev=MC29;MC29=e;
 try{
  const r=_ai29(e,p);
  if(r>=0){const s=e.ch.sk[r];
   if(s&&((s.frz&&p.frz)||(s.hug&&(p.ice>=3||(e.frost||0)<3))))return 0}
  return r
 }finally{MC29=prev}};
})();
