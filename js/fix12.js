/* 12차 수정: 경험치/레벨업 표시와 능력치 반영 · 아이템 · 보상 개편 */
const RCOL={1:'#f2f2f0',2:'#f08fb8',3:'#f2d04a',4:'#e8473f'};
const OEL={m:['木','#5b96f0','속도'],h:['火','#ee5a4c','공격력'],t:['土','#efcf4a','최대 HP'],g:['金','#ffffff','방어력'],s:['水','#7d8391','명중률']};
const ORB_AMT=.15,ORB_ACC=10,ORB_STG=5,ORB_MAX=25,GODS=['merhen','otori','amir','samael','anak','jin','jeong'];
const ITEMS={
 bul:{n:'불로초',r:3,d:'부활 · HP 50%',w:5},
 hg1:{n:'수은약',r:1,d:'HP 25% 회복',w:10,pct:.25},
 hg2:{n:'고급 수은약',r:2,d:'HP 50% 회복',w:6,pct:.5},
 hg3:{n:'최고급 수은약',r:3,d:'HP 100% 회복',w:3,pct:1},
 ade:{n:'살구에이드',r:3,d:'상태이상 해제',w:4},
 orb_m:{n:'목의 구슬',r:2,d:'속도 상승 · 5스테이지',w:5,orb:'m'},
 orb_h:{n:'화의 구슬',r:2,d:'공격력 상승 · 5스테이지',w:5,orb:'h'},
 orb_t:{n:'토의 구슬',r:2,d:'최대 HP 상승 · 5스테이지',w:5,orb:'t'},
 orb_g:{n:'금의 구슬',r:2,d:'방어력 상승 · 5스테이지',w:5,orb:'g'},
 orb_s:{n:'수의 구슬',r:2,d:'명중률 상승 · 5스테이지',w:5,orb:'s'},
 ls:{n:BOOK.ls.n,r:1,d:'+1',w:8,mat:'ls'},lm:{n:BOOK.lm.n,r:1,d:'+1',w:3,mat:'lm'},ll:{n:BOOK.ll.n,r:1,d:'+1',w:1,mat:'ll'},
 ss:{n:BOOK.ss.n,r:1,d:'+1',w:8,mat:'ss'},sm:{n:BOOK.sm.n,r:1,d:'+1',w:3,mat:'sm'},sl:{n:BOOK.sl.n,r:1,d:'+1',w:1,mat:'sl'},
 yin:{n:'음양의 기운',r:3,d:'',w:5},
 map:{n:'지도',r:4,d:'지역 선택',w:2},
 inv:{n:'초청장',r:4,d:'신과 조우',w:2},
 apr:{n:'살구',r:4,d:'+3',w:3}};
const ITEM_ORDER=['bul','hg1','hg2','hg3','ade','map','inv'];

function itemIcon(id,col){const it=ITEMS[id];
 if(it.mat)return bookIcon(it.mat);if(id==='yin')return TG;if(id==='apr')return AP;
 const sv=(p,c)=>`<svg class="si" viewBox="0 0 24 24" fill="none" stroke="${c||col}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
 const flask='<path d="M9 3h6M10 3v6l-5 9.5A1.7 1.7 0 0 0 6.5 21h11a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/>';
 if(id==='bul')return sv('<path d="M12 21V10"/><path d="M12 15c-4 0-6-3-6-6.5 4 0 6 2.5 6 6.5z"/><path d="M12 11.5c0-4.5 2-7.5 6-7.5 0 4.5-2 7.5-6 7.5z"/>');
 if(id==='hg1')return sv(flask+'<path d="M7.6 16h8.8"/>');
 if(id==='hg2')return sv(flask+'<path d="M7.6 14.5h8.8M8.6 17.5h6.8"/>');
 if(id==='hg3')return sv(flask+'<path d="M7.1 14.5h9.8l1.4 4.2a1 1 0 0 1-1 1.3H6.7a1 1 0 0 1-1-1.3z" fill="'+col+'" fill-opacity=".4"/>');
 if(id==='ade')return sv('<path d="M6 8h12l-1.4 12H7.4z"/><path d="M13.5 3.5 12 8"/><circle cx="12" cy="14" r="2.3"/>');
 if(it.orb){const o=OEL[it.orb];return sv(`<circle cx="12" cy="12" r="9" stroke="${o[1]}"/><text x="12" y="16.2" text-anchor="middle" font-size="11" fill="${o[1]}" stroke="none" font-family="'Noto Serif CJK KR','Noto Serif KR',serif">${o[0]}</text>`,o[1])}
 if(id==='map')return sv('<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>');
 if(id==='inv')return sv('<rect x="3" y="6" width="18" height="12" rx="1"/><path d="M3 7l9 7 9-7"/>');
 return ''}

const IT=()=>run.items||(run.items={}),OB=()=>run.orbs||(run.orbs={m:0,h:0,t:0,g:0,s:0});

/* ---------- 레벨업 능력치 반영 ---------- */
function rescaleFighter(f,l0,l1,bt){
 const a=calcStats(f.ch,l0,bt),b=calcStats(f.ch,l1,bt),n=Math.round(f.maxhp*b.hp/a.hp);
 if(f.hp>0)f.hp+=n-f.maxhp;f.maxhp=n;f.atk*=b.atk/a.atk;f.def*=b.def/a.def;f.spd=b.spd;f.lv=l1}

/* ---------- 구슬 ---------- */
function addOrb(k){const O=OB(),was=O[k]||0;O[k]=Math.min(ORB_MAX,was+ORB_STG);
 if(k==='t'&&was<=0)run.party.forEach(f=>{const n=Math.round(f.maxhp*(1+ORB_AMT));if(f.hp>0)f.hp+=n-f.maxhp;f.maxhp=n})}
function tickOrbs(){const O=OB();Object.keys(O).forEach(k=>{if(O[k]>0){O[k]--;
 if(O[k]<=0&&k==='t')run.party.forEach(f=>{const n=Math.max(1,Math.round(f.maxhp/(1+ORB_AMT)));f.maxhp=n;if(f.hp>n)f.hp=n})}})}
const _st12=st;
st=function(f,k){let v=_st12(f,k);
 if(f.side==='p'&&run&&run.orbs){const O=run.orbs;
  if(k==='spd'&&O.m>0)v*=1+ORB_AMT;if(k==='atk'&&O.h>0)v*=1+ORB_AMT;if(k==='def'&&O.g>0)v*=1+ORB_AMT}
 return v};
const _perf12=perform;
perform=function(a,d,idx,ev){
 if(a.side==='p'&&run&&run.orbs&&run.orbs.s>0){const sk=idx<0?BASIC:a.ch.sk[idx];
  if(sk){const o=sk.acc;sk.acc=(o!==undefined?o:(sk.t==='a'?95:100))+ORB_ACC;
   try{return _perf12(a,d,idx,ev)}finally{if(o===undefined)delete sk.acc;else sk.acc=o}}}
 return _perf12(a,d,idx,ev)};

/* ---------- 전투 승리: 경험치 · 레벨업 ---------- */
winBattle=function(){
 if(!run.party.some(f=>f.hp>0)){run.note='';loseRun();return}
 const w=run.wave,boss=run.enemy.boss;
 const coin=12+3*w+(boss?80+2*w:0),xp=12+3*w;
 S.coin+=coin;run.gained+=coin;run.won=w;
 run.exp=[];
 run.party.forEach((f,i)=>{
  if(f.hp>0)f.mp=Math.min(f.mpm,f.mp+MP_WIN);
  const o=S.chars[f.ch.id];if(!o)return;
  const g=i===run.active?xp:Math.round(xp*.4),l0=o.lv;
  addExp(f.ch.id,g);
  if(o.lv>l0)rescaleFighter(f,l0,o.lv,o.bt);
  run.exp.push({i,g,l0,l1:o.lv,pct:o.lv>=CFG.LV_MAX?100:Math.round(o.exp/expNeed(o.lv)*100)})});
 tickOrbs();
 if(S.best<w)S.best=w;
 save();
 run.note=`${TG} ${coin}`;
 run.phase='reward';run.cards=rewardCards()};

/* ---------- 보상 ---------- */
rewardCards=function(){
 const down=run.party.some(f=>f.hp<=0),dmg=run.party.some(f=>f.hp>0&&f.hp<f.maxhp*.8),pool=[];
 Object.keys(ITEMS).forEach(id=>{const it=ITEMS[id];let wt=it.w;
  if(id==='bul')wt=down?5:1.2;
  else if(it.pct||id==='ade'){if(!dmg)wt*=.4}
  if(id==='inv'&&((IT().inv||0)>=1))wt=0;
  if(it.orb&&(OB()[it.orb]||0)>=ORB_MAX)wt=0;
  if(wt>0)pool.push([id,wt])});
 const out=[];
 while(out.length<3&&pool.length){const t=pool.reduce((a,b)=>a+b[1],0);let r=Math.random()*t,i=0;
  for(;i<pool.length;i++){if((r-=pool[i][1])<0)break}
  i=Math.min(i,pool.length-1);out.push({id:pool[i][0]});pool.splice(i,1)}
 return out};
function applyReward(id){const it=ITEMS[id];
 if(it.orb)addOrb(it.orb);
 else if(it.mat){S.mats[it.mat]++}
 else if(id==='yin'){const v=60+run.wave*4;S.coin+=v;run.gained+=v}
 else if(id==='apr'){S.ap+=3}
 else if(id==='inv'){IT().inv=Math.min(1,(IT().inv||0)+1)}
 else IT()[id]=(IT()[id]||0)+1}
pickReward=function(i){
 const c=run.cards[i];if(!c)return;applyReward(c.id);
 run.party.forEach(f=>{if(f.hp>0)f.hp=Math.min(f.maxhp,f.hp+Math.round(f.maxhp*CFG.REGEN))});
 save();run.wave++;nextBattle()};

/* ---------- 지도 · 초청장 ---------- */
const _pe12=pickEnemy;
pickEnemy=function(R){if(run&&run.invite){run.invite=false;return CHM[rnd(GODS)]}return _pe12(R)};
const _nb12=nextBattle;
nextBattle=function(){
 IT();OB();
 const w=run.wave,b=Math.floor((w-1)/CFG.MAP_STAGES);
 if(w>1&&(w-1)%CFG.MAP_STAGES===0&&(IT().map||0)>0&&run.mapAsked!==b){
  run.mapAsked=b;ensureRegion(b);
  window.__mapGo=function(id){$('ovl').innerHTML='';if(id){IT().map--;run.regions[b]=id}_nb12()};
  $('ovl').innerHTML=`<div class="ov" onclick="__mapGo(null)"><div class="qbox" onclick="event.stopPropagation()"><div class="qt">지도</div><div class="mapl">${['tamaki','iwonhyang','sephirot','badr','glisha'].map(id=>`<button class="tb" onclick="__mapGo('${id}')">${REG[id].name}</button>`).join('')}</div></div></div>`;
  return}
 _nb12()};

/* ---------- 아이템 사용 ---------- */
const closeOvl=()=>{$('ovl').innerHTML=''};
function openItems(){if(busy||run.phase!=='menu')return;
 const it=IT(),rows=ITEM_ORDER.filter(id=>(it[id]||0)>0).map(id=>{const m=ITEMS[id],col=RCOL[m.r],dis=id==='map'||(id==='inv'&&run.invite);
  return `<button class="irow" style="--rc:${col}" ${dis?'disabled':''} onclick="itemPick('${id}')"><span class="ii">${itemIcon(id,col)}</span><span class="in"><b>${m.n}</b><small>${m.d}</small></span><span class="iq">x${it[id]}</span></button>`}).join('');
 $('ovl').innerHTML=`<div class="ov" onclick="closeOvl()"><div class="ilist" onclick="event.stopPropagation()">${rows||'<div class="iem">-</div>'}</div></div>`}
function itemPick(id){
 if(id==='inv'){IT().inv--;run.invite=true;closeOvl();run.note='초청장을 사용했다. 다음 스테이지에서 신을 만난다.';paintInfo(snap(),false);paintMenu();return}
 const m=ITEMS[id];
 const rows=run.party.map((f,i)=>{const ok=id==='bul'?f.hp<=0:f.hp>0,r=Math.max(0,f.hp/f.maxhp),mp=Math.max(0,f.mp/f.mpm);
  return `<button class="prow2" ${ok?'':'disabled'} onclick="event.stopPropagation();itemUse('${id}',${i})">${tileHtml(f.ch)}<div class="pi"><div class="pt"><span class="pn">${f.ch.name}</span><span>Lv.${f.lv}</span></div>
   <div class="pbar"><span>HP</span><div class="hb"><i style="width:${r*100}%;background:${hpColor(r)}"></i></div><span class="pv">${f.hp}/${f.maxhp}</span></div>
   <div class="pbar"><span>MP</span><div class="hb"><i style="width:${mp*100}%;background:#6fa0dc"></i></div><span class="pv">${f.mp}/${f.mpm}</span></div>
   <div class="pst">${stIc(f)}</div></div></button>`}).join('');
 $('ovl').innerHTML=`<div class="ov" onclick="closeOvl()"><div class="plist">${rows}</div></div>`}
function itemUse(id,i){if(busy||run.phase!=='menu')return;closeOvl();run.note='';runTurn({type:'item',id,to:i})}
const _doTurn12=doTurn;
doTurn=function(action){
 if(action.type!=='item')return _doTurn12(action);
 const ev=[],say=(t,o)=>ev.push({t,s:snap(),...o});
 const f=run.party[action.to],m=ITEMS[action.id],act=f===run.party[run.active],E=run.enemy,P=()=>run.party[run.active];
 const fx=act?{side:'p',k:'heal'}:undefined;
 IT()[action.id]--;
 say(`${m.n} 사용. ${f.ch.name}`,{sfx:'tap'});
 if(action.id==='bul'){f.hp=Math.round(f.maxhp*.5);resetBattleState(f);say(`${josa(f.ch.name,'이/가')} 되살아났다.`,{pop:act?{side:'p',v:'부활',cls:'heal'}:undefined,fx,sfx:'heal'})}
 else if(action.id==='ade'){const had=cleanse(f);say(had?`${f.ch.name}의 이상이 사라졌다.`:'해제할 이상이 없었다.',{pop:act?{side:'p',v:had?'해제':'변화 없음',cls:'tx'}:undefined,fx:had?fx:undefined,sfx:had?'heal':'miss'})}
 else{const g=Math.round(f.maxhp*m.pct),b=f.hp;f.hp=Math.min(f.maxhp,f.hp+g);say(`${f.ch.name} HP ${f.hp-b} 회복`,{pop:act?{side:'p',v:'+'+(f.hp-b),cls:'heal'}:undefined,fx,sfx:'heal'})}
 perform(E,P(),aiPick(E,P()),ev);
 let result='cont';
 if(P().hp<=0){say(`${josa(P().ch.name,'은/는')} 쓰러졌다.`,{sfx:'ko'});result=run.party.some(x=>x.hp>0)?'forced':'lose'}
 else{if(E.hp>0)endOfTurn(ev);if(E.hp<=0)result='win'}
 if(result==='win')say(`${josa(E.ch.name,'을/를')} 쓰러뜨렸다.`,{sfx:'win'});
 return{ev,result}};

/* ---------- 화면 ---------- */
(function(){const st=document.createElement('style');st.textContent=`
.rw{border-color:var(--rc,var(--line));gap:.5em}
.rw:hover{border-color:var(--rc,var(--fg))}
.rw .ri{display:flex;justify-content:center;align-items:center;height:2.8em}
.rw .ri .si{width:2.6em;height:2.6em}
.rw .ri .ic{width:2.4em;height:2.4em}
.rw .ri .sic{font-size:1.9em}
.xrow{display:grid;grid-template-columns:repeat(3,1fr);gap:1.4em;width:64%}
.xc{display:flex;flex-direction:column;gap:.35em;font-size:.8em}
.xn{display:flex;justify-content:space-between}
.xn span:first-child{font-weight:600}
.xb{height:.35em;background:rgba(255,255,255,.14)}
.xb i{display:block;height:100%;background:var(--fg)}
.xg{display:flex;justify-content:space-between;color:var(--dim);font-size:.9em;min-height:1.2em}
.xg b{color:#f2d04a;letter-spacing:.1em;font-weight:600}
.ilist{display:flex;flex-direction:column;gap:.5em;width:42%}
.irow{display:grid;grid-template-columns:2.8em 1fr auto;gap:1em;align-items:center;background:var(--pan);border:1px solid var(--line);border-left:3px solid var(--rc);color:var(--fg);font:inherit;padding:.5em 1em;text-align:left;cursor:pointer}
.irow:hover:not(:disabled){border-color:var(--rc)}
.irow:disabled{opacity:.4;cursor:default}
.irow .ii{display:flex;justify-content:center}
.irow .ii .si{width:2em;height:2em}
.irow .ii .sic{font-size:1.5em}
.irow .in{display:flex;flex-direction:column}
.irow small{color:var(--dim);font-size:.75em}
.irow .iq{color:var(--dim)}
.iem{text-align:center;color:var(--dim)}
.mapl{display:flex;flex-direction:column;gap:.6em;min-width:14em}
#orbh{position:absolute;top:3%;left:2%;display:flex;gap:.5em;z-index:5;pointer-events:none;font-size:.75em}
#orbh span{display:flex;align-items:center;gap:.3em;border:1px solid;border-radius:999px;padding:.1em .6em .1em .3em}
#orbh i{font-style:normal;width:1.5em;height:1.5em;border-radius:50%;border:1px solid;display:flex;align-items:center;justify-content:center;font-size:.9em}
`;document.head.appendChild(st)})();
const _pm12=paintMenu;
paintMenu=function(){_pm12();
 const oh=document.getElementById('orbh');if(oh)oh.remove();
 if(!run)return;
 if(run.phase==='menu'){
  const P=run.party[run.active],pend=P.pend!==null&&P.pend!==undefined;
  $('sideR').innerHTML=`<button onclick="openParty(false)">파티원</button><button onclick="openItems()" ${pend?'disabled':''}>아이템</button><button onclick="quitRun()">도망가기</button>`}
 else if(run.phase==='reward'&&run.cards){
  const ex=(run.exp||[]).map(e=>{const f=run.party[e.i],up=e.l1>e.l0;
   return `<div class="xc"><div class="xn"><span>${f.ch.name}</span><span>${up?`Lv.${e.l0} → Lv.${e.l1}`:`Lv.${e.l1}`}</span></div><div class="xb"><i style="width:${e.pct}%"></i></div><div class="xg"><span>+${e.g} EXP</span>${up?'<b>LEVEL UP</b>':''}</div></div>`}).join('');
  const cards=run.cards.map((c,i)=>{const m=ITEMS[c.id],col=RCOL[m.r],d=c.id==='yin'?'+'+(60+run.wave*4):m.d;
   return `<button class="rw" style="--rc:${col}" onclick="pickReward(${i})"><span class="ri">${itemIcon(c.id,col)}</span><b>${m.n}</b><span>${d}</span></button>`}).join('');
  $('ovl').innerHTML=`<div class="ov" style="flex-direction:column;gap:1.3em"><div class="gain">${run.note}</div><div class="xrow">${ex}</div><div class="rrow">${cards}</div></div>`}
 const O=run.orbs;
 if(O&&run.phase!=='over'){const act=Object.keys(O).filter(k=>O[k]>0);
  if(act.length){const d=document.createElement('div');d.id='orbh';
   d.innerHTML=act.map(k=>`<span style="color:${OEL[k][1]};border-color:${OEL[k][1]}66"><i style="border-color:${OEL[k][1]}">${OEL[k][0]}</i>${O[k]}</span>`).join('');
   document.getElementById('game').appendChild(d)}}};
