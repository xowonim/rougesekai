/* 3차 수정: 아이콘 · 프로필 · 돌파 탭 이름 */
const BKB2='<rect x="6.5" y="6" width="19" height="21" rx="1" fill="#e2d8bd" stroke="#1a1814" stroke-width="1"/><path d="M10 6v21" stroke="#8c3b31" stroke-width=".7"/><path d="M6.5 10h3.5M6.5 14h3.5M6.5 18h3.5M6.5 22h3.5" stroke="#8c3b31" stroke-width=".9"/><rect x="14" y="9" width="7" height="9" fill="none" stroke="#1a1814" stroke-width=".8"/><path d="M16 12h3M16 14.5h3M16 17h3" stroke="#1a1814" stroke-width=".7"/>';
function bkSvg(k){const n={s:1,m:2,l:3}[k[1]]||1;let g='';
 if(k[0]==='l'){const T=n===1?[[0,0,0,1]]:n===2?[[-3,1,-8,.95],[3,0,5,.95]]:[[-5,2,-13,.88],[5,1,10,.88],[0,-1,0,.92]];
  g=T.map(t=>`<g transform="translate(${t[0]} ${t[1]}) rotate(${t[2]} 16 16) translate(16 16) scale(${t[3]}) translate(-16 -16)">${BKB2}</g>`).join('')}
 else{const r=n===1?10:11,pt=(a,rad)=>[(16+rad*Math.cos(a*Math.PI/180)).toFixed(2),(16+rad*Math.sin(a*Math.PI/180)).toFixed(2)];
  g=ELK.map((e,i)=>{const a0=-90+72*i,p0=pt(a0,r),p1=pt(a0+72,r);return `<path d="M16 16L${p0[0]} ${p0[1]}A${r} ${r} 0 0 1 ${p1[0]} ${p1[1]}Z" style="fill:var(--${e})"/>`}).join('')
   +`<circle cx="16" cy="16" r="${r}" fill="none" stroke="#0c0d11" stroke-width="1"/><circle cx="16" cy="16" r="3" fill="#0c0d11" fill-opacity=".55"/><ellipse cx="12.5" cy="11.5" rx="2.6" ry="1.5" fill="#fff" fill-opacity=".5" transform="rotate(-35 12.5 11.5)"/>`;
  if(n>=2)g+=`<circle cx="16" cy="16" r="14" fill="none" stroke="#f0e2ae" stroke-opacity=".7" stroke-width=".9"/>`;
  if(n>=3)g+=`<circle cx="16" cy="16" r="15.4" fill="none" stroke="#f0e2ae" stroke-opacity=".45" stroke-width=".6" stroke-dasharray="1.6 1.6"/>`}
 return `<svg class="si" viewBox="0 0 32 32">${g}</svg>`}
function profHtml(c){const p=PROF[c.id]||{};
 const v=(k,d)=>p[k]||d;
 const cell=(a,b,w)=>b?`<div${w?' class="w"':''}><span>${a}</span><b>${b}</b></div>`:'';
 const grid=cell('소속',v('aff'))+cell('성별',v('sex'))+cell('나이',v('age'))+cell('신체',v('ht'))+cell('종족',v('race',c.race))+cell('주 오행',v('el',c.el))+cell('능력',v('abil'),1);
 const intro=p.intro||LORE[c.id];
 const paras=intro?intro.split(/(?<=[.!?])\s+/).filter(Boolean).map(t=>`<p style="margin:0">${t}</p>`).join(''):'';
 return `${p.rom?`<div class="sub">${p.rom}</div>`:''}<div class="pg">${grid}</div>${paras?`<div class="intro">${paras}</div>`:''}`}
const _detHtml=detHtml;
detHtml=function(id,train){return _detHtml(id,train).replace('>BREAKTHROUGH</button>','>Virtue</button>')};
const _resolveStar=resolveStar;
resolveStar=function(star){const r=_resolveStar(star);if(r.bt){r.tag=r.tag.replace('BREAKTHROUGH','Virtue');r.bt=false}return r};
