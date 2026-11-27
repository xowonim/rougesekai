/* 19차 수정: 전투 이미지 상태 (기본 · 피격 · 전투 불능 · 공격), gif 지원 */
const PSUF={base:'',hit:'_hit',ko:'_ko',atk:'_atk'};
const PMAP={},HT_REF=220,HT_DEF=175;
function poseLoad(id){
 if(!id||PMAP[id])return;const m=PMAP[id]={};
 Object.keys(PSUF).forEach(p=>{
  const tryExt=i=>{const ext=['gif','png'][i];if(!ext){m[p]=null;return}
   const u=`chars/battle/${id}${PSUF[p]}.${ext}`,im=new Image();
   im.onload=()=>{m[p]=u;poseRefresh()};im.onerror=()=>tryExt(i+1);im.src=u};
  tryExt(0)})}
const PST={e:{pose:'',t:0,tm:0},p:{pose:'',t:0,tm:0}},PHP={e:null,p:null,pid:''};
const sideId=sd=>sd==='e'?(run&&run.enemy&&run.enemy.ch.id):(run&&run.party&&run.party[run.active]&&run.party[run.active].ch.id);
function poseApply(sd){
 const el=document.getElementById(sd+'PF');if(!el||!run)return;
 const id=sideId(sd),m=PMAP[id]||{};
 let pose='base';
 const ko=el.classList.contains('ko');
 if(ko)pose='ko';else if(PST[sd].pose&&Date.now()<PST[sd].t)pose=PST[sd].pose;
 const u=m[pose]||m.base||null;
 el.classList.toggle('kp',!!(ko&&(m.ko||m.base)));
 let im=el.querySelector('img');
 if(!u){if(im&&m.base===null&&PMAP[id]&&!/\/[^/]+\.png$/.test(im.getAttribute('src')||''))im.remove();return}
 if(!im){im=document.createElement('img');im.alt='';el.appendChild(im)}
 if(im.getAttribute('src')!==u)im.setAttribute('src',u);
 const h=parseFloat((PROF[id]&&PROF[id].ht)||'')||HT_DEF;
 im.style.transformOrigin='50% 100%';im.style.transform=`scale(${Math.min(1,h/HT_REF).toFixed(3)})`}
function poseRefresh(){poseApply('e');poseApply('p')}
function poseSet(sd,pose,ms){const s=PST[sd];s.pose=pose;s.t=Date.now()+ms;clearTimeout(s.tm);poseApply(sd);s.tm=setTimeout(()=>poseApply(sd),ms+20)}
(function(){const st=document.createElement('style');st.textContent='.pf.ko.kp{opacity:1}.tile img,.pf img,.afull img{image-rendering:pixelated}.cb{width:20%}#eC{right:14.5%}#pC{left:14.5%}.pf{aspect-ratio:1}.afull{top:44%;bottom:auto;height:auto;aspect-ratio:1;transform:translateY(-50%)}';document.head.appendChild(st)})();

const _db19=drawBattle;
drawBattle=function(){PHP.e=null;PHP.p=null;PHP.pid='';_db19();
 if(run){poseLoad(sideId('e'));(run.party||[]).forEach(f=>poseLoad(f.ch.id))}
 poseRefresh()};
const _pi19=paintInfo;
paintInfo=function(s,fl,popv){
 if(PHP.pid!==s.p.id){PHP.pid=s.p.id;PHP.p=null}
 _pi19(s,fl,popv);
 poseLoad(s.p.id);
 if(fl){
  if(PHP.e!==null&&s.e.hp<PHP.e&&s.e.hp>0)poseSet('e','hit',450);
  if(PHP.p!==null&&s.p.hp<PHP.p&&s.p.hp>0)poseSet('p','hit',450)}
 PHP.e=s.e.hp;PHP.p=s.p.hp;
 poseRefresh()};
const _lg19=lunge;
lunge=function(side){_lg19(side);poseSet(side==='p'?'p':'e','atk',500)};
