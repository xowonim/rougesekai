/* 38차 수정: HP · MP 숫자를 막대 옆으로, 레벨 · 공방속 글씨 축소, 공방속은 한 줄씩 */
(function(){
const s=document.createElement('style');
s.textContent='.hn{display:none}.brow{display:flex;align-items:center;gap:.35em;margin-top:.35em}.brow.mr{margin-top:.2em}.brow .hpl,.brow .mpl{flex:1;margin-top:0}.bn{font-size:.58em;white-space:nowrap;min-width:3.9em;text-align:right;font-variant-numeric:tabular-nums}.who span:last-child{font-size:.62em}.stm{flex-direction:column;align-items:flex-end;flex-wrap:nowrap;gap:0;font-size:.6em;line-height:1.45}.stm i{margin-left:.4em}';
document.head.appendChild(s);
const _pi38=paintInfo;
paintInfo=function(s,fl,popv){_pi38(s,fl,popv);
 try{document.querySelectorAll('.hn').forEach(h=>{
  const pos=h.id.replace(/Hn$/,''),o=s&&s[pos];if(!o)return;
  const c=h.parentElement,hp=c.querySelector('.hpl'),mp=c.querySelector('.mpl');if(!hp||!mp)return;
  const mk=(bar,cls)=>{let r=bar.parentElement;
   if(!r.classList.contains('brow')){r=document.createElement('div');r.className='brow'+(cls==='mn'?' mr':'');
    bar.insertAdjacentElement('beforebegin',r);r.appendChild(bar);const n=document.createElement('span');n.className='bn '+cls;r.appendChild(n)}
   return r.querySelector('.bn')};
  const a=mk(hp,'hn2'),b=mk(mp,'mn');
  a.textContent=`${o.hp}/${o.max}`;b.textContent=`${o.mp}/${o.mpm||100}`;
  const col=el=>{const i=el.querySelector('i');return i?getComputedStyle(i).backgroundColor:''};
  a.style.color=col(hp)||'#a6d68a';b.style.color=col(mp)||'#6f94d8'})}catch(e){}};
})();
