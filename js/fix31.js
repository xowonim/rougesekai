/* 31차 수정: '세상' 지도 정리 (등장 캐릭터 · 보스 · 필드 효과 · 이동 확률) */
(function(){
/* ---------- 지역별 등장 캐릭터 (스킬트리의 '등장 지역' 기준) ---------- */
const TAG={
 tamaki:['otori','hyun','seunga','baekdo','cheonryong'],
 iwonhyang:['jin','hyun','seunga','baekdo','hwanhee','cheonryong','chaos'],
 sephirot:['marchen','seunga','baekdo','anemone','hwanhee','cheonryong'],
 glisha:['samael','hyun','seunga','taotie','chaos']};
const RATE={4:45,5:50,6:5};
function gen(ids){
 const t={4:[],5:[],6:[]};
 ids.forEach(id=>{const c=CHM[id];if(c&&t[c.star])t[c.star].push(id)});
 return [4,5,6].filter(s=>t[s].length).map(s=>[RATE[s],{ids:t[s]}])}
Object.keys(TAG).forEach(k=>{REG[k].spawn=gen(TAG[k])});
REG.badr.spawn=[[70,{ids:['horus']}],[30,{ids:['amir']}]];
REG.anak.spawn=[[100,{ids:['anax']}]];

/* ---------- 보스 스테이지 등장 캐릭터 ---------- */
REG.tamaki.bossSp=[[21,{ids:['otori']}],[25,{ids:['hyun']}],[25,{ids:['cheonryong']}],[25,{ids:['baekdo']}],[3,{ids:['azitae']}],[1,{ids:['samael']}]];
REG.iwonhyang.bossSp=[[7,{ids:['jin']}],[45,{ids:['hyun']}],[45,{ids:['seunga']}],[3,{ids:['azitae']}]];
REG.glisha.bossSp=[[33,{ids:['taotie']}],[33,{ids:['chaos']}],[33,{ids:['yormungand']}],[1,{ids:['samael']}]];
REG.sephirot.bossSp=[[33,{ids:['marchen']}],[33,{ids:['tarot']}],[33,{ids:['azitae']}],[1,{ids:['otori']}]];
REG.badr.bossSp=[[100,{ids:['amir']}]];
REG.anak.bossSp=[[100,{ids:['anax']}]];

/* ---------- 이동 확률 ---------- */
REG.tamaki.next=[['anak',1],['iwonhyang',33],['sephirot',33],['glisha',33]];
REG.iwonhyang.next=[['sephirot',50],['glisha',50]];
REG.glisha.next=[['sephirot',33],['iwonhyang',33],['badr',33],['tamaki',1]];
REG.sephirot.next=[['glisha',33],['iwonhyang',33],['badr',33],['tamaki',1]];
REG.badr.next=[['glisha',50],['sephirot',50]];
REG.anak.next=[['sephirot',100]];

/* ---------- 안내 문구 ---------- */
REG.iwonhyang.tip='눈이 내린다. 턴마다 전체 HP의 3%를 잃는다.';
REG.glisha.tip='무더운 날씨. 전체 공격력이 30% 오르고, 낙뢰가 떨어질 수 있다.';
REG.sephirot.tip='턴마다 전체 HP가 1% 회복된다.';
REG.badr.tip='안개가 낀다. 전체 회피율 10%, 공격력 10% 상승. 모든 공격에 방어무시 10%가 붙는다.';
REG.anak.tip='타마키 오토리, 강 현, 강승아의 ③ 스킬을 쓸 수 없다.';

/* ---------- 보스 스테이지는 보스 목록에서 선택 ---------- */
const _pe31=pickEnemy;
pickEnemy=function(R){
 if(run&&run.bossNow&&R&&R.bossSp&&!run.invite&&!run.forceAnak){const e=wpick(R.bossSp);return CHM[rnd(e.ids)]}
 return _pe31(R)};
const _me31=makeEnemy;
makeEnemy=function(w){
 if(run)run.bossNow=(w%CFG.MAP_STAGES===0);
 try{return _me31(w)}finally{if(run)run.bossNow=false}};

/* ---------- 필드 효과 ---------- */
const rg=()=>run&&run.region;
const _st31=st;
st=function(f,k){
 let v=_st31(f,k);
 if(k==='atk'){if(rg()==='glisha')v*=1.3;else if(rg()==='badr')v*=1.1}
 /* 아낙의 고유차원: 예전의 공격 · 방어 10% 감소는 없앴다 */
 if(f.side==='p'&&rg()==='anak'&&(k==='atk'||k==='def'))v/=.9;
 return v};
const _hc31=hitCalc;
hitCalc=function(a,d,sk,k){
 if(rg()!=='badr'||!sk)return _hc31(a,d,sk,k);
 const o=sk.ign;sk.ign=Math.min(.95,(o||0)+.1);
 try{return _hc31(a,d,sk,k)}finally{if(o===undefined)delete sk.ign;else sk.ign=o}};
const _perf31=perform;
perform=function(a,d,idx,ev){
 const sk=idx<0?BASIC:a.ch.sk[idx];
 if(rg()==='badr'&&sk&&sk.t==='a'&&d&&!(d.evade>0)&&!(d.inv>0)&&Math.random()<.1){
  const old=d.evade;d.evade=1;
  try{return _perf31(a,d,idx,ev)}finally{d.evade=old}}
 return _perf31(a,d,idx,ev)};
const BLOCK=new Set(['otori','hyun','seunga'].map(id=>CHM[id]&&CHM[id].sk&&CHM[id].sk[2]).filter(Boolean));
const _mc31=mpCost;
mpCost=function(s,i){if(rg()==='anak'&&BLOCK.has(s))return 9999;return _mc31(s,i)};
const _sf31=skFace;
skFace=function(ch,i,s,lv,tag,mp){
 let h=_sf31(ch,i,s,lv,tag,mp);
 if(rg()==='anak'&&BLOCK.has(s))h=h.replace(/MP \d+|조건 미달성/,'사용 불가');
 return h};
const _ai31=aiPick;
aiPick=function(e,p){
 const r=_ai31(e,p);
 if(r>=0&&rg()==='anak'&&BLOCK.has(e.ch.sk[r]))return 0;
 return r};
const evx31=(ev,t,f,v,o)=>{o=o||{};ev.push({t,s:snap(),raw:true,pop:v!==undefined?{side:(run.dbl?(f.pos||f.side):f.side),v,cls:o.cls||'tx'}:undefined,fx:o.fx?{side:(run.dbl?(f.pos||f.side):f.side),...o.fx}:undefined,sfx:o.sfx})};
const _dbt31=dblTurn;
dblTurn=function(acts){if(run)run.ltDone=false;return _dbt31(acts)};
const _eot31=endOfTurn;
endOfTurn=function(ev){
 const L=[run.party[run.active],run.enemy].filter(Boolean);
 _eot31(ev);
 const R=rg(),alive=L.filter(f=>f.hp>0);
 if(R==='sephirot'){
  alive.forEach(f=>{
   const v=Math.max(1,Math.round(f.maxhp*.01)),b=f.hp;f.hp=Math.min(f.maxhp,f.hp+v);const g=f.hp-b;
   if(g>0)evx31(ev,`${f.ch.name} HP ${g} 회복`,f,'+'+g,{cls:'heal',fx:{k:'heal'},sfx:'heal'})})}
 else if(R==='glisha'&&!(run.dbl&&run.ltDone)){
  run.ltDone=true;
  if(Math.random()>=.2)return;
  const pool=run.dbl?[...dAllies(),...dFoes()].filter(f=>f.hp>0):alive;
  const t=pool[Math.floor(Math.random()*pool.length)];if(!t)return;
  if(t.hp>1&&!t.dive){
   const d=Math.min(Math.max(1,Math.round(t.maxhp*.1)),t.hp-1);t.hp-=d;
   evx31(ev,`낙뢰가 ${t.ch.name}에게 떨어졌다. ${d} 피해`,t,'-'+d,{fx:{k:'zap',c:'#f2d04a'},sfx:'zap'})}}};
})();
