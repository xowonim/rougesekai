/* 4차 수정: 수련의 서(선장본) 아이콘, CAST 버튼 크기 */
const _bkSvg=bkSvg;
bkSvg=function(k){if(k[0]!=='l')return _bkSvg(k);
 const n={s:1,m:2,l:3}[k[1]]||1;let g='';
 for(let i=n-1;i>0;i--)g+=`<rect x="${7.5+i*1.8}" y="${4.5-i*1.4}" width="16" height="22" rx="1" fill="#14161c" stroke="#f0e2ae" stroke-opacity=".5" stroke-width=".8"/>`;
 g+=`<rect x="7.5" y="4.5" width="16" height="22" rx="1" fill="#14161c" stroke="#f0e2ae" stroke-width="1.1"/><rect x="10" y="7.5" width="3.4" height="9" fill="none" stroke="#f0e2ae" stroke-width=".9"/>`;
 [9.5,13.5,17.5,21.5].forEach(y=>g+=`<circle cx="20.6" cy="${y}" r=".95" fill="#f0e2ae"/>`);
 g+=`<line x1="20.6" y1="9.5" x2="20.6" y2="21.5" stroke="#f0e2ae" stroke-width=".5" opacity=".6"/>`;
 return `<svg class="si" viewBox="0 0 32 32">${g}</svg>`};
(function(){const st=document.createElement('style');st.textContent='.pbtns{left:24%;right:24%;bottom:13%}.pbtns button{padding:.5em 1em;font-size:.9em}';document.head.appendChild(st)})();
