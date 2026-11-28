/* 37차 수정: 공격 · 방어 · 속도 변화를 상태이상 아래에 삼각형(최대 5개)으로 표시 */
(function(){
const CS={atk:['공격','#e8963a'],def:['방어','#5ab8e8'],spd:['속도','#9bd84a']},DN='#e24a4a';
const s=document.createElement('style');
s.textContent='.stt:empty{display:none}.stm{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:.1em .9em;font-size:.8em;line-height:1.5;min-height:0}.stm:empty{display:none}.stm span{white-space:nowrap}.stm i{font-style:normal;letter-spacing:-.05em;margin-left:.3em}.cb .stm{margin-top:.2em}';
document.head.appendChild(s);
function pct(f,k){
 try{
  let cur;
  if(k==='spd'){const cs=f.csFirst,pd=f.pend;f.csFirst=false;f.pend=null;try{cur=st(f,k)}finally{f.csFirst=cs;f.pend=pd}}
  else cur=st(f,k);
  const base=f[k]*((f.side==='p'&&run&&run.buf)?1+(run.buf[k]||0):1);
  if(!(base>0))return 0;
  return (cur/base-1)*100
 }catch(e){return 0}}
function calc(f){
 if(!f)return null;
 const o={};['atk','def','spd'].forEach(k=>{
  const p=pct(f,k),n=Math.min(5,Math.floor(Math.abs(p)/10+.001));
  o[k]=n>0?(p>0?n:-n):0});
 return o}
const _snap37=snap;
snap=function(){
 const s=_snap37();
 try{
  const add=(o,f)=>{if(!o||!f)return;o.sm=calc(f)};
  if(run.dbl){add(s.p,dA());add(s.e,run.eA||run.enemy);add(s.q,dB());add(s.f,run.enemy2)}
  else{add(s.p,run.party[run.active]);add(s.e,run.enemy)}
 }catch(e){}
 return s};
const _pi37=paintInfo;
paintInfo=function(s,fl,popv){_pi37(s,fl,popv);
 try{document.querySelectorAll('.stt').forEach(e=>{
  const pos=e.id.replace(/St$/,''),m=s&&s[pos]&&s[pos].sm;
  let r=e.nextElementSibling;
  if(!r||!r.classList.contains('stm')){r=document.createElement('div');r.className='stm';e.insertAdjacentElement('afterend',r)}
  let h='';
  if(m)['atk','def','spd'].forEach(k=>{const n=m[k]|0;
   if(!n){h+=`<span>${CS[k][0]}<i style="color:var(--dim)">—</i></span>`;return}
   const up=n>0,c=up?CS[k][1]:DN;
   h+=`<span>${CS[k][0]}<i style="color:${c}">${(up?'▲':'▼').repeat(Math.abs(n))}</i></span>`});
  if(r.innerHTML!==h)r.innerHTML=h})}catch(e){}};
})();
