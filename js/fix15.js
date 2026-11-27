/* 15차 수정: 전의 상실 이미지 이펙트 제거 · 재화 설명 말풍선 */
FXKEYS.splice(FXKEYS.indexOf('love'),1);

const CURTXT={
 yin:['음양의 기운','천지만물에게 있어 꼭 필요한 두 가지의 기운.<br>이 기운을 모아 소원을 빌면, 소원이 이루어진다고 하는데⋯ 아마도.'],
 apr:['살구','타마키 오토리가 가장 좋아하는 과일.<br>오토리에게 조공을 바치지 않으면 큰일이 일어날 것이다..!']};
(function(){const st=document.createElement('style');st.textContent='.wallet span{cursor:pointer}';document.head.appendChild(st)})();
function showCur(el,key){closeBk();const sc=document.getElementById('screen');if(!sc)return;
 const t=CURTXT[key],r=el.getBoundingClientRect(),s=sc.getBoundingClientRect();
 const d=document.createElement('div');d.id='bkb';d.className='bkb';
 d.innerHTML=`<b>${t[0]}</b><p>${t[1]}</p>`;
 sc.appendChild(d);
 const cx=r.left+r.width/2-s.left,w=d.offsetWidth,L=Math.max(w/2+8,Math.min(s.width-w/2-8,cx));
 d.style.left=L+'px';d.style.top=(r.top-s.top-8)+'px';d.style.setProperty('--tx',(cx-L+w/2)+'px');
 if(d.getBoundingClientRect().top<s.top){d.style.top=(r.bottom-s.top+10)+'px';d.style.transform='translate(-50%,0)';d.classList.add('dn')}}
document.addEventListener('click',e=>{const w=e.target.closest&&e.target.closest('.wallet span');
 if(!w)return;const sp=[...w.parentNode.children];showCur(w,sp.indexOf(w)===0?'yin':'apr');e.stopPropagation()},true);
