/* 8차 수정: 수 글자 테두리 · 파티원 창(HP/MP/상태이상) · 도망가기 · 아낙 즉시 이동 */
const _prof4=profHtml;
profHtml=function(c){return _prof4(c).replace('#9aa0ac','#5a5e68')};

/* ---------- 상태이상 아이콘 ---------- */
Object.assign(SVGP,{
 seal:'<rect x="5" y="11" width="14" height="9" rx="1"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
 love:'<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
 dot:'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
 dive:'<path d="M2 9c3-3 5 3 8 0s5 3 8 0 3 0 4 0M2 15c3-3 5 3 8 0s5 3 8 0 3 0 4 0"/>'});
const stIc=f=>[f.stun>0&&'stun',f.shock&&'shock',f.evade>0&&'evade',f.dive&&'dive',(f.seal!==null&&f.seal!==undefined)&&'seal',f.love&&'love',f.dot&&'dot',(f.d&&(f.d.atk>0||f.d.def>0))&&'debuff'].filter(Boolean).map(k=>`<span>${svg(k)}</span>`).join('');

(function(){const st=document.createElement('style');st.textContent=`
.plist{display:flex;flex-direction:column;gap:.7em;left:20%;right:20%;top:6%;width:auto;max-height:none;overflow:visible}
.prow2{display:flex;align-items:center;gap:1em;width:100%;background:var(--pan);border:1px solid var(--line);color:var(--fg);font:inherit;padding:.45em .9em;text-align:left;cursor:pointer}
.prow2:hover:not(:disabled){border-color:var(--fg)}
.prow2:disabled{opacity:.4;cursor:default}
.prow2 .tile{width:3em;flex:none;font-size:1em;cursor:inherit}
.prow2 .pi{flex:1;display:flex;flex-direction:column;gap:.15em;min-width:0}
.prow2 .pt{display:flex;justify-content:space-between;align-items:baseline}
.prow2 .pn{font-weight:600}
.prow2 .pt span:last-child{color:var(--dim);font-size:.8em}
.prow2 .pbar{display:grid;grid-template-columns:2em 1fr 6.5em;gap:.6em;align-items:center;font-size:.75em;color:var(--dim)}
.prow2 .pbar .hb{height:.45em;background:rgba(255,255,255,.12)}
.prow2 .pbar .hb i{display:block;height:100%}
.prow2 .pbar .pv{text-align:right;color:var(--fg)}
.prow2 .pst{display:flex;justify-content:flex-end;gap:.4em;min-height:1.1em}
.prow2 .pst .si{width:1.2em;height:1.2em}
.qbox{display:flex;flex-direction:column;align-items:center;gap:1.6em}
.qt{font-size:1.6em;font-weight:300;letter-spacing:.08em}
`;document.head.appendChild(st)})();

openParty=function(forced){
 const rows=run.party.map((f,i)=>{const dead=f.hp<=0,isCur=i===run.active&&!forced,r=Math.max(0,f.hp/f.maxhp),m=Math.max(0,f.mp/f.mpm);
  return `<button class="prow2" ${dead||isCur?'disabled':''} onclick="event.stopPropagation();pickMember(${i})">${tileHtml(f.ch)}<div class="pi"><div class="pt"><span class="pn">${f.ch.name}</span><span>Lv.${f.lv}</span></div>
   <div class="pbar"><span>HP</span><div class="hb"><i style="width:${r*100}%;background:${hpColor(r)}"></i></div><span class="pv">${f.hp}/${f.maxhp}</span></div>
   <div class="pbar"><span>MP</span><div class="hb"><i style="width:${m*100}%;background:#6fa0dc"></i></div><span class="pv">${f.mp}/${f.mpm}</span></div>
   <div class="pst">${stIc(f)}</div></div></button>`}).join('');
 $('ovl').innerHTML=`<div class="ov" ${forced?'':`onclick="document.getElementById('ovl').innerHTML=''"`}><div class="plist">${rows}</div></div>`};

/* ---------- 도망가기 ---------- */
quitRun=function(){if(busy)return;
 $('ovl').innerHTML=`<div class="ov" onclick="document.getElementById('ovl').innerHTML=''"><div class="qbox" onclick="event.stopPropagation()"><div class="qt">어이, 진심이냐?</div><div class="row" style="justify-content:center;gap:2.5em"><button class="tb" onclick="doRetreat()">YES</button><button class="tb" onclick="document.getElementById('ovl').innerHTML=''">NO</button></div></div></div>`};
function doRetreat(){run.note='';run.retreat=true;run.phase='over';paintMenu()}
const _pm8=paintMenu;
paintMenu=function(){_pm8();
 if(run&&run.phase==='over'&&run.retreat){
  $('ovl').innerHTML=`<div class="ov" style="flex-direction:column;gap:1em"><div style="font-size:2.4em;font-weight:200;letter-spacing:.2em;padding-left:.2em">GAME OVER</div><div style="display:flex;align-items:center;gap:.4em">${TG} ${run.gained}</div><button class="tb" style="margin-top:1em" onclick="toTitle()">OK</button></div>`}};

/* ---------- 세피로트에서 아낙을 만나면 즉시 아낙의 고유차원 ---------- */
nextBattle=function(){
 const w=run.wave,b=Math.floor((w-1)/CFG.MAP_STAGES);ensureRegion(b);
 let R=REG[run.regions[b]];run.region=R.id;MAPS.length=1;MAPS[0]=R;
 run.enemy=makeEnemy(w);
 let met='';
 if(R.id==='sephirot'&&run.enemy.ch.id==='anak'){
  run.regions[b]='anak';R=REG.anak;run.region='anak';MAPS[0]=R;met=`아낙을 만났다. ${R.name}.  ${R.tip}  `}
 run.party.forEach(resetBattleState);
 if(run.party[run.active].hp<=0)run.active=run.party.findIndex(f=>f.hp>0);
 const e=run.enemy;
 run.note=(met||((w-1)%CFG.MAP_STAGES===0?`${R.name}.  ${R.tip?R.tip+'  ':''}`:''))+(e.boss?`${josa(e.ch.name,'이/가')} 모습을 드러냈다.`:`${josa(e.ch.name,'이/가')} 앞을 가로막는다.`);
 run.phase='menu';run.sub='cmd';
 drawBattle()};
