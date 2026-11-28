/* 39차 수정: 상태이상 알약 - 테두리는 상태별 색, 글씨는 흰색, 배경색 없음 */
(function(){
const s=document.createElement('style');
s.textContent='.sp{background:transparent;color:#fff;box-shadow:inset 0 0 0 1px var(--c)}.sp.dp{background:transparent;box-shadow:inset 0 0 0 1px #2f918a}';
document.head.appendChild(s);
})();
