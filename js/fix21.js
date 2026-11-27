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
/* 탭 전환 시 전신·아이콘 테두리와 글자가 깜빡이지 않도록, 이미 불러온 이미지는 즉시 반영 */
const IMGOK=new Set();
document.addEventListener('load',e=>{const t=e.target;if(t&&t.tagName==='IMG'&&t.getAttribute('src'))IMGOK.add(t.getAttribute('src'))},true);
const _da21=drawArc;
drawArc=function(){_da21();document.querySelectorAll('.tile,.afull').forEach(el=>{const im=el.querySelector('img');if(im&&IMGOK.has(im.getAttribute('src')))el.classList.add('hasimg')})};
/* 초기 배포 캐릭터(루이후)는 항상 보유 */
const _nm21=normalize;
normalize=function(){_nm21();if(!S.chars.ruihu){S.chars.ruihu=newChar();ensureChar('ruihu');if(S.party.length<CFG.PARTY_MAX)S.party.unshift('ruihu')}};
normalize();save();
