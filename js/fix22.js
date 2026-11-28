/* 22차 수정 */
/* 전투 캐릭터 위치를 조금 아래로 */
(function(){const st=document.createElement('style');st.textContent='.cb{top:16%}';document.head.appendChild(st)})();

/* 음양오행의 신 전원 ★6 (능력치도 ★6 기준), ★6 살구 구매 150 */
const GOD6=['otori','marchen','amir','samael','anax','aledeia'];
GOD6.forEach(id=>{if(CHM[id])CHM[id].star=6});
CFG.AP_CHAR[6]=150;
/* ★6 신 전원(오토리 · 메르헨 · 아미르 · 사마엘 · 아낙 · 진 · 정 · 알레데이아) 능력치 동일: 역할/신 보정 없음 */
const SAME6=GOD6.concat(['jin','jung']);
SAME6.forEach(id=>{delete GOD_X[id]});
const _calc22=calcStats;
calcStats=function(ch,lv,bt){return _calc22(SAME6.includes(ch.id)?{...ch,role:'m'}:ch,lv,bt)};
const _det22=detHtml;
detHtml=function(id,train){let h=_det22(id,train);
 if(id==='jung')h=h.replace(/<div class="row"><button class="mini"[^>]*buyChar.*?<\/div>/s,'');return h};
const _buy22=buyChar;
buyChar=function(id){if(id==='jung')return;_buy22(id)};

/* ★6 확률 0.6% -> 0.5% (줄어든 몫은 재료로) */
RATE[6]=.5;
