/* 11차 수정: 탭 · 강화 버튼 스타일, 재료 0개는 말풍선 없음 */
(function(){const st=document.createElement('style');st.textContent=`
.tabs{display:flex;justify-content:center;align-items:center;gap:0;margin:.7em 0 .9em;border-bottom:1px solid var(--line)}
.tabs .mini{border:none;background:none;color:var(--dim);font-size:.85em;letter-spacing:.2em;padding:.7em 1.6em;position:relative;cursor:pointer;flex:none}
.tabs .mini:hover:not(:disabled){color:var(--fg);border:none}
.tabs .mini.on{color:var(--fg);border:none}
.tabs .mini.on:after{content:'';position:absolute;left:1.6em;right:1.2em;bottom:-1px;height:1px;background:var(--fg)}
.tabs .mini+.mini:before{content:'';position:absolute;left:0;top:50%;height:.9em;width:1px;background:var(--line);transform:translateY(-50%)}
.enh,.sk .bt .mini{border:1px solid var(--dim);border-radius:999px;background:none;color:var(--fg);font-size:.78em;letter-spacing:.15em;padding:.3em 1.1em .3em 1.25em;cursor:pointer;transition:background .15s,color .15s}
.enh:hover,.sk .bt .mini:hover:not(:disabled){border:1px solid var(--fg);background:var(--fg);color:var(--bg,#0c0d11)}
`;document.head.appendChild(st)})();
const _showBk11=showBk;
showBk=function(el){if(!S.mats[el.dataset.bk]||S.mats[el.dataset.bk]<=0){closeBk();return}_showBk11(el)};

/* 오타 정정 */
REG.glisha.name='글리샬라볼라스';
CHM.aledeia.sk[0]=A('염탐','생명체의 몸 속에 깃들어 염탐한다.',40);

/* 캐릭터 창 순서: 이름·기본정보 → 경험치바 → INFO | VIRTUE | PROFILE → 내용 */
const _det12=detHtml;
detHtml=function(id,train){let h=_det12(id,train);if(!train)return h;
 const tm=h.match(/<div class="tabs">.*?<\/div>/s);if(!tm)return h;
 const o=S.chars[id];
 h=h.replace(/<div class="xpb">.*?<\/div>/s,'');
 const bar=o?`<div class="xpb"><i style="width:${o.lv>=CFG.LV_MAX?100:Math.round(o.exp/expNeed(o.lv)*100)}%"></i></div>`:'';
 return h.replace(tm[0],bar+tm[0])};
