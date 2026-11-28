/* 34차 수정: 더블 배틀 대상 선택 표시 (대상 위 화살표, 취소 버튼) */
(function(){
const s=document.createElement('style');
s.textContent=`.dtgw{display:flex;align-items:center;justify-content:center;gap:1.6em;width:100%}
.dtgw .dtp{letter-spacing:.06em;font-size:1.1em}.dtgw .dtp b{color:#f2d04a;font-weight:700}.dtgw .dtp i{font-style:normal;color:var(--dim);margin-left:.6em}
.cb.tg .pf{box-shadow:0 0 0 3px #f2d04a,0 0 14px rgba(242,208,74,.55)}
.cb.tg::before{content:'\\25BC';position:absolute;left:50%;top:-1.5em;transform:translateX(-50%);color:#f2d04a;font-size:1.1em;animation:dtgb .9s ease-in-out infinite;pointer-events:none}
@keyframes dtgb{50%{transform:translate(-50%,.25em)}}`;
document.head.appendChild(s);
const _pm34=paintMenu;
paintMenu=function(){
 _pm34();
 try{
  if(!(run&&run.dbl&&run.phase==='menu'&&run.dcmd&&run.dtgt))return;
  const el=document.getElementById('cards');if(!el)return;
  el.innerHTML='<div class="dtgw"><button class="tb" onclick="dblBack()">취소</button></div>';
 }catch(e){}};
})();
