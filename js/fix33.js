/* 33차 수정: 상태이상 표시를 HP · MP 바 아래에 나열 / 부조화는 검은 액체가 차오르는 알약 */
(function(){
const WAVE="url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 8' preserveAspectRatio='none'%3E%3Cpath d='M0 4Q10 0 20 4T40 4V8H0Z' fill='%23000'/%3E%3C/svg%3E\")";
const s=document.createElement('style');
s.textContent=`.cb{top:9%}.cb .stt{position:static;margin:.35em 0 0;max-width:100%;justify-content:flex-end;font-size:.62em;gap:.2em;pointer-events:none}
.sp.dp{position:relative;overflow:hidden;background:rgba(255,255,255,.2);box-shadow:inset 0 0 0 1px rgba(255,255,255,.6);isolation:isolate}
.sp.dp .lq{position:absolute;left:0;right:0;bottom:0;height:calc(var(--p)*1%);background:#000;z-index:-1}
.sp.dp .lq::before,.sp.dp .lq::after{content:'';position:absolute;left:0;right:0;top:-.34em;height:.36em;background:${WAVE} repeat-x;background-size:1.7em 100%;animation:dpw 1.5s linear infinite,dpb 2.1s ease-in-out infinite}
.sp.dp .lq::after{top:-.26em;opacity:.55;background-size:2.3em 100%;animation:dpw2 2.3s linear infinite,dpb 1.7s ease-in-out infinite reverse}
@keyframes dpw{to{background-position-x:1.7em}}
@keyframes dpw2{to{background-position-x:-2.3em}}
@keyframes dpb{50%{transform:translateY(.08em)}}
.sp.dp b{font-weight:600;text-shadow:0 0 .2em #000}`;
document.head.appendChild(s);
const DIS='<span class="sp" style="--c:#2f918a">부조화</span>';
const dp=n=>`<span class="sp dp" style="--p:${Math.max(8,Math.min(100,n|0))}"><i class="lq"></i><b>부조화</b></span>`;
const fix=(h,n)=>h&&h.indexOf(DIS)>=0?h.split(DIS).join(dp(n)):h;
const _stIc33=stIc;
stIc=function(f){return fix(_stIc33(f),f.dis)};
const _snap33=snap;
snap=function(){
 const s=_snap33();
 const add=(o,f)=>{if(!o||!f)return;o.st=o.st||{};o.st.disN=f.dis|0};
 try{
  if(run.dbl){add(s.p,dA());add(s.e,run.eA||run.enemy);add(s.q,dB());add(s.f,run.enemy2)}
  else{add(s.p,run.party[run.active]);add(s.e,run.enemy)}
 }catch(e){}
 return s};
const _pi33=paintInfo;
paintInfo=function(s,fl,popv){_pi33(s,fl,popv);
 try{document.querySelectorAll('.stt').forEach(e=>{const pos=e.id.replace(/St$/,''),n=s&&s[pos]&&s[pos].st?s[pos].st.disN:0,h=fix(e.innerHTML,n);if(h!==e.innerHTML)e.innerHTML=h})}catch(e){}};
})();
