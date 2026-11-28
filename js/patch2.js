/* 4차 수정: 수련의 서 아이콘(종이 / 선장본 / 격친 책), CAST 레이아웃, 파비콘, 추가 스크립트 로드 */
const _bkSvg=bkSvg;
bkSvg=function(k){if(k[0]!=='l')return _bkSvg(k);
 const n={s:1,m:2,l:3}[k[1]]||1;let g='';
 if(n===1){g=`<path d="M9 4.5H20L24 8.5V27.5H9Z" fill="#14161c" stroke="#f0e2ae" stroke-width="1.1" stroke-linejoin="round"/><path d="M20 4.5V8.5H24" fill="none" stroke="#f0e2ae" stroke-width=".8" stroke-linejoin="round"/>`;
  [13,17,21,25].forEach(y=>g+=`<line x1="12" y1="${y}" x2="21" y2="${y}" stroke="#f0e2ae" stroke-width=".8" stroke-linecap="round" opacity=".7"/>`)}
 else{
  if(n>=3)g+=`<rect x="10.6" y="3.1" width="16" height="22" rx="1" fill="#14161c" stroke="#f0e2ae" stroke-opacity=".5" stroke-width=".8"/>`;
  g+=`<rect x="7.5" y="4.5" width="16" height="22" rx="1" fill="#14161c" stroke="#f0e2ae" stroke-width="1.1"/><rect x="10" y="7.5" width="3.4" height="9" fill="none" stroke="#f0e2ae" stroke-width=".9"/>`;
  [9.5,13.5,17.5,21.5].forEach(y=>g+=`<circle cx="20.6" cy="${y}" r=".95" fill="#f0e2ae"/>`);
  g+=`<line x1="20.6" y1="9.5" x2="20.6" y2="21.5" stroke="#f0e2ae" stroke-width=".5" opacity=".6"/>`}
 return `<svg class="si" viewBox="0 0 32 32">${g}</svg>`};
(function(){const st=document.createElement('style');st.textContent='.banner{top:14%;bottom:38%}.pbtns{left:24%;right:24%;bottom:26%}.pbtns button{padding:.5em 1em;font-size:.9em}';document.head.appendChild(st);
 const l=document.createElement('link');l.rel='icon';l.type='image/svg+xml';l.href='img/favicon.svg?v='+Date.now();document.head.appendChild(l);
 ['gacha','skills','fix6','fix7','fix8','fix9','fix10','fix11','fix12','fix13','fix14','fix15','fix16','fix17','fix18','fix19','fix20','fix21','fix22','fix23','fix24','fix25','fix26','fix27','fix28','fix29','fix30','fix31','fix32','fix33','fix34'].forEach(n=>{const s=document.createElement('script');s.async=false;s.src='js/'+n+'.js?t='+Date.now();document.body.appendChild(s)})})();
