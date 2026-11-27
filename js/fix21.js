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
/* 이미지 영역: 이미지가 없다고 확인되기 전까지 글자·테두리는 숨김 (깜빡임 방지) */
(function(){const st=document.createElement('style');
 st.textContent='.tile:not(.noimg)>b,.afull:not(.noimg)>b,.pf:not(.noimg)>b{visibility:hidden}.afull:not(.noimg),.pf:not(.noimg){border-color:transparent;background:none}';
 document.head.appendChild(st)})();
const IMGBAD=new Set(),SEL='.tile,.afull,.pf';
const markBad=el=>{const im=el.querySelector(':scope>img');if(im&&IMGBAD.has(im.getAttribute('src').split('?')[0]))el.classList.add('noimg')};
document.addEventListener('error',e=>{const t=e.target;if(t&&t.tagName==='IMG'&&t.getAttribute('src')){IMGBAD.add(t.getAttribute('src').split('?')[0]);const p=t.parentElement;if(p&&p.matches(SEL))p.classList.add('noimg')}},true);
new MutationObserver(ms=>{ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType!==1)return;if(n.matches(SEL))markBad(n);n.querySelectorAll(SEL).forEach(markBad)}))}).observe(document.body,{childList:true,subtree:true});
const _pa21=poseApply;
poseApply=function(sd){_pa21(sd);const el=document.getElementById(sd+'PF'),id=sideId(sd),m=id&&PMAP[id];if(el&&m)el.classList.toggle('noimg',m.base===null)};
setInterval(()=>{if(typeof run!=='undefined'&&run&&document.getElementById('ePF'))poseRefresh()},250);
/* 이미지 캐시 갱신: 홈 화면 앱 등에서 예전 이미지가 계속 보이는 문제 방지 */
const IMGV=Date.now();
const bust=im=>{const s=im.getAttribute('src');if(s&&/^chars\//.test(s)&&s.indexOf('?')<0)im.setAttribute('src',s+'?v='+IMGV)};
new MutationObserver(ms=>{ms.forEach(m=>{if(m.type==='attributes'){if(m.target.tagName==='IMG')bust(m.target);return}m.addedNodes.forEach(n=>{if(n.nodeType!==1)return;if(n.tagName==='IMG')bust(n);n.querySelectorAll&&n.querySelectorAll('img').forEach(bust)})})}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});

/* 아카이브·파티 편집 순서: 오토리를 맨 앞에 */
(function(){const i=CH.findIndex(c=>c.id==='otori');if(i>0)CH.unshift(CH.splice(i,1)[0])})();
/* 파티가 비었을 때 보유 중인 첫 캐릭터로 대체 */
toPrep=function(){mode='start';party=S.party.filter(id=>S.chars[id]).slice(0,CFG.PARTY_MAX);
 if(!party.length){const f=CH.find(c=>S.chars[c.id]);party=f?[f.id]:[]}
 cur=party[0]||(CH.find(c=>S.chars[c.id])||CH[0]).id;drawPrep()};
