/* 11차 수정: 탭 · 강화 버튼 스타일, 재료 0개는 말풍선 없음 */
(function(){const st=document.createElement('style');st.textContent=`
.tabs{display:flex;justify-content:center;align-items:center;gap:0;margin:.7em 0 .9em;border-bottom:1px solid var(--line)}
.tabs .mini{border:none;background:none;color:var(--dim);font-size:.85em;letter-spacing:.2em;padding:.7em 1.6em;position:relative;cursor:pointer;flex:none}
.tabs .mini:hover:not(:disabled){color:var(--fg);border:none}
.tabs .mini.on{color:var(--fg);border:none}
.tabs .mini.on:after{content:'';position:absolute;left:1.6em;right:1.2em;bottom:-1px;height:1px;background:var(--fg)}
.tabs .mini+.mini:before{content:'';position:absolute;left:0;top:50%;height:.9em;width:1px;background:var(--line);transform:translateY(-50%)}
.enh,.sk .bt .mini{border:none;border-bottom:1px solid var(--dim);background:none;color:var(--fg);font-size:.8em;letter-spacing:.25em;padding:.25em 0 .25em .3em;cursor:pointer}
.enh:hover,.sk .bt .mini:hover:not(:disabled){border:none;border-bottom:1px solid var(--fg)}
`;document.head.appendChild(st)})();
const _showBk11=showBk;
showBk=function(el){if(!S.mats[el.dataset.bk]||S.mats[el.dataset.bk]<=0){closeBk();return}_showBk11(el)};

/* 오타 정정 */
REG.glisha.name='글리샬라볼라스';
CHM.aledeia.sk[0]=A('염탐','생명체의 몸 속에 깃들어 염탐한다.',40);
