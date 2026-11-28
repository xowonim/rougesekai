/* 35차 수정: 전투 메시지창 (행동 문구 -> 행동 -> 다음 문구), 쓰러짐 문구, CPU 대사는 마지막 캐릭터 기준 */
(function(){
const s=document.createElement('style');
s.textContent=`#bmsg{position:absolute;inset:0;z-index:90;cursor:pointer}
#bmsg .dbox{position:absolute;left:0;right:0;bottom:0;height:30%;box-sizing:border-box;padding:1.4em 12% 1.6em;display:flex;flex-direction:column;justify-content:center;background:rgba(8,9,12,.97);border-top:1px solid var(--line)}
#bmsg .dt{line-height:1.75;min-height:1.75em}
#bmsg .dh{position:absolute;right:7%;bottom:1.2em;width:0;height:0;border-left:.35em solid transparent;border-right:.35em solid transparent;border-top:.5em solid var(--dim);animation:dlgb 1s infinite}`;
document.head.appendChild(s);

/* ---------- 문구 변환 ---------- */
function disp(e){
 let t=e.t;if(typeof t!=='string'||!t)return '';
 if(e.act&&e.act.n&&t.endsWith('의 '+e.act.n)){
  const nm=t.slice(0,t.length-e.act.n.length-2);
  return `${josa(nm,'은/는')} ${josa(e.act.n,'을/를')} 사용했다!`}
 let m=/^(.*[은는]) (?:돌로 굳어 |얼어붙어 )?움직이지 못한다\.?$/.exec(t);
 if(m)return `${m[1]} 움직일 수 없었다!`;
 m=/^(.+)의 .+은\(는\) 봉인되어 쓸 수 없다\.$/.exec(t);
 if(m)return `${josa(m[1],'은/는')} 움직일 수 없었다!`;
 if(/^.+에게 \d+ 피해 · 치명타$/.test(t))return '급소에 맞았다!';
 return ''}

/* 마지막 한 명이 쓰러질 때는 기존 문구를 그대로 두고, 나머지는 "쓰러졌다!"로 */
function prep(ev){
 const pAll=run.party&&run.party.every(f=>f.hp<=0);
 const eAll=run.dbl?dFoes().every(f=>f.hp<=0):true;
 let lp=-1,le=-1;
 ev.forEach((e,i)=>{if(typeof e.t!=='string')return;if(/쓰러졌다\.$/.test(e.t))lp=i;else if(/[을를] 쓰러뜨렸다\.$/.test(e.t))le=i});
 ev.forEach((e,i)=>{if(typeof e.t!=='string'||e.disp!==undefined)return;
  if(/속도 상승 \(\d+단계\)/.test(e.t)){e.disp='';e.pop=null;e.fx=null;return}
  if(/쓰러졌다\.$/.test(e.t))e.disp=(pAll&&i===lp)?'':e.t.replace(/쓰러졌다\.$/,'쓰러졌다!');
  else if(/[을를] 쓰러뜨렸다\.$/.test(e.t)){
   if(!run.dbl||(eAll&&i===le))e.disp='';
   else{const nm=e.t.replace(/[을를] 쓰러뜨렸다\.$/,'');e.disp=`${josa(nm,'은/는')} 쓰러졌다!`}}})}

/* ---------- 재생 ---------- */
let BM=null;
function msg(t){
 let d=document.getElementById('bmsg');
 if(!d){const g=document.getElementById('screen');if(!g)return;
  d=document.createElement('div');d.id='bmsg';
  d.addEventListener('click',ev=>{ev.stopPropagation();if(typeof sfx==='function')sfx('tap');if(BM)BM()});
  g.appendChild(d)}
 d.innerHTML='<div class="dbox"><div class="dt"></div></div>';
 d.querySelector('.dt').textContent=t}
const unmsg=()=>{const d=document.getElementById('bmsg');if(d)d.remove()};
playEvents=function(ev,done){
 try{prep(ev)}catch(err){}
 let i=0,timer=null;
 const step=()=>{
  clearTimeout(timer);
  if(i>=ev.length){BM=null;unmsg();done();return}
  const e=ev[i++];paintInfo(e.s,true,e.pop);
  let t='';try{t=e.disp!==undefined?e.disp:disp(e)}catch(err){}
  if(t)msg(t);
  if(e.act)showAct(e.act);if(e.lunge)lunge(e.lunge);if(e.fx)playFx(e.fx);if(e.shake)shake();if(e.sfx)sfx(e.sfx);
  /* 문구는 읽을 수 있게 천천히 자동으로 넘어간다 (클릭하면 바로 다음으로) */
  const d=e.d||((e.pop||e.fx)?700:450);
  timer=setTimeout(step,t?Math.max(d,/쓰러졌다!/.test(t)?1300:1000):d)};
 BM=step;skipFn=step;step()};

/* ---------- 더블 배틀: 마지막으로 쓰러진 적 기록 ---------- */
const _dbt35=dblTurn;
dblTurn=function(acts){
 const before=run?dFoes().filter(f=>f.hp>0):[];
 const r=_dbt35(acts);
 try{
  const died=before.filter(f=>f.hp<=0);
  if(died.length){let best=null,bi=-2;
   died.forEach(f=>{const i=r.ev.findIndex(e=>e.s&&e.s[f.pos]&&e.s[f.pos].hp<=0);if(i>=bi){bi=i;best=f}});
   if(best)run.lastFoe=best.ch.id}
 }catch(err){}
 return r};

/* ---------- CPU 대사: 이긴 쪽은 마지막에 남은 캐릭터, 진 쪽은 마지막에 쓰러진 캐릭터 ---------- */
const _wb35=winBattle;
winBattle=function(){_wb35.apply(this,arguments);
 try{if(run&&run.pend&&run.dbl&&run.lastFoe){
  if(DLG[run.lastFoe])run.pend.id=run.lastFoe;else run.pend=null}
  if(run)run.lastFoe=null}catch(err){}};
const _lr35=loseRun;
loseRun=function(){
 const alive=(run&&run.dbl)?dFoes().find(f=>f.hp>0):null;
 _lr35.apply(this,arguments);
 try{if(run&&alive){if(DLG[alive.ch.id])run.pend={k:'lose',id:alive.ch.id};else run.pend=null}}catch(err){}};
})();