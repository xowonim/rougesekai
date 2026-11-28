/* 35차 수정: 전투 메시지창 (행동 문구 -> 행동 -> 다음 문구), 쓰러짐 문구, CPU 대사는 마지막 캐릭터 기준 */
(function(){
const s=document.createElement('style');
s.textContent=`.msgb{width:100%;box-sizing:border-box;min-height:3.6em;display:flex;align-items:center;padding:.7em 1.4em;font-size:1.1em;letter-spacing:.04em;line-height:1.5;background:rgba(10,12,16,.55);border:1px solid rgba(255,255,255,.14);animation:msgin .18s ease-out}
@keyframes msgin{from{opacity:.2;transform:translateY(.25em)}}
.msgb{position:relative}.msgb::after{content:'\\25BC';position:absolute;right:1.1em;bottom:.6em;font-size:.7em;color:var(--dim);animation:msgbk 1s ease-in-out infinite}
@keyframes msgbk{50%{opacity:.25}}`;
document.head.appendChild(s);

/* ---------- 문구 변환 ---------- */
const SKIP=[/^.+에게 \d+ 피해$/,/^.+ HP \d+ (회복|흡수|소모)/,/^.+ 반동 \d+$/];
function disp(e){
 let t=e.t;if(typeof t!=='string'||!t)return '';
 if(e.act&&e.act.n&&t.endsWith('의 '+e.act.n)){
  const nm=t.slice(0,t.length-e.act.n.length-2);
  return `${josa(nm,'은/는')} ${josa(e.act.n,'을/를')} 사용했다!`}
 const m=/^(.*[은는]) (?:돌로 굳어 |얼어붙어 )?움직이지 못한다\.?$/.exec(t);
 if(m)return `${m[1]} 움직일 수 없었다!`;
 if(/^.+에게 \d+ 피해 · 치명타$/.test(t))return '급소에 맞았다!';
 if(SKIP.some(r=>r.test(t)))return '';
 return t}

/* 마지막 한 명이 쓰러질 때는 기존 문구를 그대로 두고, 나머지는 "쓰러졌다!"로 */
function prep(ev){
 const pAll=run.party&&run.party.every(f=>f.hp<=0);
 const eAll=run.dbl?dFoes().every(f=>f.hp<=0):true;
 let lp=-1,le=-1;
 ev.forEach((e,i)=>{if(typeof e.t!=='string')return;if(/쓰러졌다\.$/.test(e.t))lp=i;else if(/[을를] 쓰러뜨렸다\.$/.test(e.t))le=i});
 ev.forEach((e,i)=>{if(typeof e.t!=='string'||e.disp!==undefined)return;
  if(/쓰러졌다\.$/.test(e.t)&&!(pAll&&i===lp))e.disp=e.t.replace(/쓰러졌다\.$/,'쓰러졌다!');
  else if(run.dbl&&/[을를] 쓰러뜨렸다\.$/.test(e.t)&&!(eAll&&i===le)){
   const nm=e.t.replace(/[을를] 쓰러뜨렸다\.$/,'');e.disp=`${josa(nm,'은/는')} 쓰러졌다!`}})}

/* ---------- 재생 ---------- */
function msg(t){
 const el=document.getElementById('cards');if(!el)return;
 el.innerHTML='';const d=document.createElement('div');d.className='msgb';d.textContent=t;el.appendChild(d);
 ['sideL','sideR'].forEach(k=>{const x=document.getElementById(k);if(x)x.innerHTML=''})}
playEvents=function(ev,done){
 try{prep(ev)}catch(err){}
 let i=0,timer=null;
 const step=()=>{
  clearTimeout(timer);
  if(i>=ev.length){done();return}
  const e=ev[i++];paintInfo(e.s,true,e.pop);
  let t='';try{t=e.disp!==undefined?e.disp:disp(e)}catch(err){}
  if(t)msg(t);
  if(e.act)showAct(e.act);if(e.lunge)lunge(e.lunge);if(e.fx)playFx(e.fx);if(e.shake)shake();if(e.sfx)sfx(e.sfx);
  /* 문구가 있는 줄은 클릭해야 다음으로 넘어간다 */
  if(t)return;
  timer=setTimeout(step,e.d||((e.pop||e.fx)?700:450))};
 skipFn=step;step()};

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
