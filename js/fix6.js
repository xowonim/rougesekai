/* 6차 수정: 종이 아이콘, 오행 글자색, 전투 메뉴(스킬 3개 고정, SWITCH/RETREAT), 음양 에너지 */
const _bk2=bkSvg;
bkSvg=function(k){if(k[0]!=='l'||k[1]!=='s')return _bk2(k);
 let g='<rect x="9" y="4.5" width="14" height="23" rx="1" fill="#14161c" stroke="#f0e2ae" stroke-width="1.1"/>';
 [[12.8,8.5,23],[16,8.5,23.5],[19.2,8.5,22]].forEach(l=>g+=`<line x1="${l[0]}" y1="${l[1]}" x2="${l[0]}" y2="${l[2]}" stroke="#f0e2ae" stroke-width=".8" stroke-linecap="round" opacity=".75"/>`);
 return `<svg class="si" viewBox="0 0 32 32">${g}</svg>`};

const ELT={'木':'#5b96f0','火':'#ee5a4c','土':'#efcf4a','金':'#ffffff','水':'#000000'};
const _prof2=profHtml;
profHtml=function(c){return _prof2(c).replace(/<b><i class="elc"[^>]*>([^<]*)<\/i><\/b>/,(m,v)=>{
 const e=['木','火','土','金','水'].find(x=>v.includes(x));if(!e)return m;
 const sh=e==='水'?';text-shadow:0 0 2px #fff,0 0 2px #fff,0 0 5px #fff':'';
 return `<b style="color:${ELT[e]}${sh}">${v}</b>`})};

(function(){const st=document.createElement('style');st.textContent='.side{top:3.5%;bottom:auto;font-size:.8em}.side button{background:var(--pan);border:1px solid var(--line);color:var(--fg);font:inherit;letter-spacing:.18em;padding:.5em 1.1em;cursor:pointer}.side button:hover{border-color:var(--fg)}';document.head.appendChild(st)})();

paintMenu=function(){
 const P=run.party[run.active],ph=run.phase,cards=$('cards');
 $('ovl').innerHTML='';cards.innerHTML='';$('sideL').innerHTML='';$('sideR').innerHTML='';
 if(ph==='menu'){
  const has=P.pend!==null&&P.pend!==undefined;
  let opts=has?[P.pend]:P.ch.sk.map((s,i)=>i);
  const ok=i=>i<0||(P.mp>=mpCost(P.ch.sk[i],i)&&P.seal!==i);
  if(!has&&!opts.some(ok))opts=[-1];
  cards.innerHTML=opts.map(i=>{const s=i<0?BASIC:P.ch.sk[i],l=i<0?1:slv(P,i),forced=has&&i===P.pend;
   return `<button class="sc" ${(!forced&&!ok(i))?'disabled':''} onclick="act(${i})">${skFace(P.ch,i,s,l,(i>=0&&P.seal===i)?' · 봉인':'',!forced)}</button>`}).join('');
  $('sideL').innerHTML=`<button onclick="openParty(false)">SWITCH</button>`;
  $('sideR').innerHTML=`<button onclick="quitRun()">RETREAT</button>`}
 else if(ph==='forced')openParty(true)
 else if(ph==='reward'){
  $('ovl').innerHTML=`<div class="ov" style="flex-direction:column;gap:1.6em"><div class="gain">${run.note}</div><div class="rrow">${run.cards.map((k,i)=>`<button class="rw" onclick="pickReward(${i})"><b>${k.t}</b><span>${k.d}</span></button>`).join('')}</div></div>`}
 else if(ph==='over'){
  $('ovl').innerHTML=`<div class="ov" style="flex-direction:column;gap:1em"><div style="font-size:2.4em;font-weight:200;letter-spacing:.2em">${run.won}</div><div>${TG} ${run.gained}</div><button class="tb" style="margin-top:1em" onclick="toTitle()">OK</button></div>`}};

const _rc6=rewardCards;
rewardCards=function(){return _rc6().map(c=>c.t==='재물'?{...c,t:'음양 에너지'}:c)};
