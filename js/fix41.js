/* 41차 수정: 지역(맵) 전환 시 전환 연출 후 다음 전투 스테이지 표시 */
(function(){
const s=document.createElement('style');
s.textContent=`#trn{position:absolute;inset:0;z-index:300;background:#000;display:flex;align-items:center;justify-content:center;animation:trnb 2.1s ease forwards}
#trn span{font-size:2em;font-weight:200;letter-spacing:.3em;padding-left:.3em;color:#f2f2f0;animation:trnt 2.1s ease forwards}
@keyframes trnb{0%,62%{opacity:1}100%{opacity:0}}
@keyframes trnt{0%{opacity:0}22%,58%{opacity:1}74%,100%{opacity:0}}`;
document.head.appendChild(s);
function show(name){
 const g=document.getElementById('screen')||document.getElementById('game');if(!g)return;
 const o=document.getElementById('trn');if(o)o.remove();
 const d=document.createElement('div');d.id='trn';d.innerHTML=`<span></span>`;d.firstChild.textContent=name;
 g.appendChild(d);setTimeout(()=>{if(d.parentNode)d.remove()},2200)}
const _pm41=paintMenu;
paintMenu=function(){
 _pm41.apply(this,arguments);
 try{
  if(run&&run.phase==='menu'&&run.sub==='cmd'&&run.wave!==run.trnW){
   run.trnW=run.wave;
   if(run.trnR&&run.region&&run.region!==run.trnR){const R=typeof REG!=='undefined'&&REG[run.region];if(R&&R.name)show(R.name)}
   run.trnR=run.region}
 }catch(e){}};
})();
