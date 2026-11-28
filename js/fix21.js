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
/* 혼돈 대사 키 이전 */
if(typeof DLG!=='undefined'&&DLG.honton&&!DLG.chaos)DLG.chaos=DLG.honton;

/* 희귀도 색: 4 분홍, 5 금색, 6 빨강 */
const STARCOL={4:'#f08fb8',5:'#f2d04a',6:'#e8473f'};
const rcolor=id=>{const c=CHM[id];return c&&STARCOL[c.star]||null};
const _det21b=detHtml;
detHtml=function(id,train){let h=_det21b(id,train);const C=rcolor(id);if(!C)return h;
 h=h.replace(/<b class="rk">/g,`<b class="rk" style="color:${C};border-color:${C}">`)
  .replace(/<div class="xpb"><i style="/g,`<div class="xpb"><i style="background:${C};`)
  .replace(/<div class="bs on"><i>/g,`<div class="bs on"><i style="background:${C};border-color:${C}">`)
  .replace(/<div class="btsum">.*?<\/div>/s,m=>m.replace(/<b>/g,`<b style="color:${C}">`));
 return h};
const _de21=drawEnh;
drawEnh=function(){_de21();const e=document.getElementById('enh'),C=rcolor(cur);if(e&&C)e.querySelectorAll('.xpb i').forEach(i=>i.style.background=C)};

/* 강화 창 · VIRTUE 모양 */
(function(){const st=document.createElement('style');
 st.textContent='.enhbox .er button{border-color:transparent}.enhbox .ef{justify-content:center;gap:4em;margin-top:.4em}.enhbox .ef button{border-radius:999px;padding:.5em 2.8em;min-width:8em;font-size:1em;letter-spacing:.12em;justify-content:center}.bs i{border-radius:50%;font-size:.75em}.rk{border-width:.5px}';
 document.head.appendChild(st)})();

/* 효과음 */
Object.assign(SFX,{
 enh:()=>{[1319,1568,2093].forEach((f,i)=>tone(f,.16,'triangle',.05,0,i*.055));tone(3136,.14,'sine',.025,0,.17);tone(2637,.1,'sine',.02,0,.2)},
 lvup:()=>{[1047,1319,1568,2093,2637].forEach((f,i)=>{tone(f,.4,'triangle',.06,0,i*.08,{echo:1});tone(f*2,.3,'sine',.02,0,i*.08)});noise(.3,.04,3000,8000,0,'bandpass',2,0)},
 start:()=>{[1319,1568,1976,2637].forEach((f,i)=>{tone(f,.22,'triangle',.055,0,i*.07);tone(f*2,.14,'sine',.02,0,i*.07+.01)});noise(.06,.05,5000,9000,0,'highpass',1,0);noise(.05,.04,6000,10000,.07,'highpass',1,0);noise(.05,.04,6500,10000,.14,'highpass',1,0);tone(3136,.35,'sine',.03,0,.28,{echo:1})}});
const _eg21=enhGo;
enhGo=function(){if(!ENH)return;const o=S.chars[cur],i=ENH.i,ch=ENH.kind==='char',l0=ch?o.lv:o.sk[i].lv;
 _eg21();const o2=S.chars[cur],l1=ch?o2.lv:o2.sk[i].lv;sfx(l1>l0?'lvup':'enh')};
const _sr21=startRun;
startRun=function(ids){sfx('start');_sr21(ids)};

/* 보상 카드 아이콘이 잘리지 않도록 크기 조정 */
(function(){const st=document.createElement('style');
 st.textContent='.rw .ri{height:3.4em;overflow:visible}.rw .ri .sic{font-size:1em}.rw .ri .sic.bk{width:2.6em;height:2.6em;display:flex;align-items:center;justify-content:center}.rw .ri .sic.bk svg{width:100%;height:100%}';
 document.head.appendChild(st)})();

/* 살구 카드 등장 빈도 낮춤 */
ITEMS.apr.w=.2;
