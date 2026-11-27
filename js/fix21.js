/* 21차 수정: 미보유 캐릭터는 PROFILE의 기본 항목만 공개 (INFO · VIRTUE · 소개는 비공개) */
const _prof21=profHtml;
profHtml=function(c){let h=_prof21(c);if(!S.chars[c.id])h=h.replace(/<div class="intro">.*?<\/div>/s,'');return h};
const _det21=detHtml;
detHtml=function(id,train){const h=_det21(id,train);
 if(!train||S.chars[id])return h;
 const a=h.indexOf('<div class="tabs">');if(a<0)return h;
 const e=h.indexOf('</div>',a)+6,top=h.slice(0,e),rest=h.slice(e);
 if(arcTab==='lore')return h;
 if(arcTab==='bt')return top;
 const m=rest.match(/<div class="row"><button class="mini"[^>]*buyChar.*?<\/div>/s);
 return top+(m?m[0]:'')};
const _ta21=toArc;
toArc=function(){if(!S.chars[cur])cur='ruihu';_ta21()};
