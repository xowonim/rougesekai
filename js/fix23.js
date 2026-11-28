/* 23차 수정: 더블배틀 */
/* 로직상 모든 아군은 side 'p', 모든 적은 side 'e'로 두고, 화면 위치(pos: p q e f)만 따로 관리한다.
   싱글배틀은 기존 코드를 그대로 지나가고, run.dbl 이 켜진 전투에서만 아래 코드가 동작한다. */
const DBL={rate:.10,from:5};
(function(){const st=document.createElement('style');st.textContent=`
.dbl4 .cb{width:16%}
.dbl4 #pC{left:4%}.dbl4 #qC{left:21%}.dbl4 #eC{right:4%}.dbl4 #fC{right:21%}
.cb.acting .pf{box-shadow:0 0 0 2px var(--fg)}
.cb.tg{cursor:pointer}
.cb.tg .pf{box-shadow:0 0 0 2px #f2d04a;animation:dbltg 1s ease-in-out infinite}
@keyframes dbltg{50%{box-shadow:0 0 0 2px rgba(242,208,74,.3)}}
.dtgm{text-align:center;padding:1.1em 0;letter-spacing:.08em;grid-column:1/-1}
.dselt{text-align:center;margin-bottom:.9em;letter-spacing:.08em}
.prow2.on{outline:1px solid var(--fg);outline-offset:-1px}
.dbd{display:inline-block;min-width:1.6em;text-align:center;border:1px solid var(--fg);border-radius:50%;font-size:.8em;line-height:1.6em;margin-right:.4em}
`;document.head.appendChild(st)})();

const D$=id=>document.getElementById(id);
const dA=()=>run.party[run.pA],dB=()=>run.pB>=0?run.party[run.pB]:null;
const dAllies=()=>[dA(),dB()].filter(Boolean),dFoes=()=>[run.eA||run.enemy,run.enemy2].filter(Boolean);
const dBench=()=>run.party.map((f,i)=>i).filter(i=>run.party[i].hp>0&&i!==run.pA&&i!==run.pB);
function dTag(){if(!run)return;run.party.forEach(f=>{f.pos=null});
 const A=dA(),B=dB();if(A)A.pos='p';if(B)B.pos='q';
 const e=run.eA||run.enemy;if(e)e.pos='e';if(run.enemy2)run.enemy2.pos='f'}
function withActive(idx,fn){const k=run.active;run.active=idx;try{return fn()}finally{run.active=k}}
const dActIdx=()=>{const s=run.dcmd&&run.dcmd.slots[run.dcmd.k];return s===1?run.pB:run.pA};

/* ---------- 스냅샷: p q e f ---------- */
const _snap23=snap;
snap=function(){
 if(!(run&&run.dbl))return _snap23();
 const one=(ally,foe)=>{const k=run.active,ke=run.enemy;run.active=run.party.indexOf(ally);run.enemy=foe;try{return _snap23()}finally{run.active=k;run.enemy=ke}};
 const A=dA(),B=dB(),EA=run.eA||run.enemy,EB=run.enemy2;
 const s=one(A,EA);
 if(B||EB){const s2=one(B||A,EB||EA);s.q=B?s2.p:null;s.f=EB?s2.e:null}else{s.q=null;s.f=null}
 return s};

/* ---------- 화면 갱신 ---------- */
const lastQF={};
const _pi23=paintInfo;
paintInfo=function(s,fl,popv){
 _pi23(s,fl,popv);
 if(!(run&&run.dbl)||s.q===undefined)return;
 ['q','f'].forEach(pos=>{
  const o=s[pos],C=D$(pos+'C');if(!C)return;
  if(!o){C.style.display='none';return}
  C.style.display='';
  const r=Math.max(0,o.hp/o.max),pf=D$(pos+'PF');
  D$(pos+'Bar').style.width=r*100+'%';D$(pos+'Bar').style.background=hpColor(r);
  D$(pos+'Mp').style.width=Math.max(0,o.mp/o.mpm)*100+'%';
  D$(pos+'Hn').textContent=`${o.hp} / ${o.max}  ·  MP ${o.mp}`;
  D$(pos+'St').innerHTML=stHtml14(o.st||{});
  let id,nm,lv;
  if(pos==='q'){id=o.id;nm=o.name;lv=o.lv}else{const E=run.enemy2;id=E.ch.id;nm=E.ch.name;lv=E.lv}
  D$(pos+'Nm').textContent=nm;D$(pos+'Lv').textContent='Lv.'+lv;
  if(pos==='q'&&pf.dataset.id!==id){const c=CHM[id];pf.dataset.id=id;pf.style.setProperty('--c',EC[c.el]);pf.innerHTML=`<b>${c.name[0]}</b>${IMG('battle',c)}`;poseLoad(id);lastQF.q=undefined}
  if(fl&&lastQF[pos]!==undefined&&lastQF[pos]>o.hp){flash(pos+'PF');if(o.hp>0)poseSet(pos,'hit',450)}
  if(fl&&popv&&(popv.side==='q'||popv.side==='f')&&popv.side===pos)pop(popv.side,popv.v,popv.cls);
  pf.classList.toggle('ko',o.hp<=0);
  paintFx(pos+'PF',o.st||{},o.hp<=0);
  lastQF[pos]=o.hp});
 poseRefresh()};

/* ---------- 전투 이미지(q, f) ---------- */
PST.q={pose:'',t:0,tm:0};PST.f={pose:'',t:0,tm:0};
function poseApplyX(sd){
 const el=D$(sd+'PF');if(!el||!run)return;
 const id=sd==='q'?(dB()&&dB().ch.id):(run.enemy2&&run.enemy2.ch.id),m=PMAP[id]||{};
 let pose='base';const ko=el.classList.contains('ko');
 if(ko)pose='ko';else if(PST[sd].pose&&Date.now()<PST[sd].t)pose=PST[sd].pose;
 const u=m[pose]||m.base||null;
 el.classList.toggle('kp',!!(ko&&m.ko));
 let im=el.querySelector('img');
 el.classList.toggle('hasimg',!!(im&&im.complete&&im.naturalWidth));
 el.classList.toggle('noimg',!!(id&&PMAP[id]&&m.base===null));
 if(!u){if(im&&m.base===null&&PMAP[id]&&!/\/[^/]+\.png$/.test(im.getAttribute('src')||''))im.remove();return}
 if(!im){im=document.createElement('img');im.alt='';el.appendChild(im)}
 if(im.getAttribute('src')!==u)im.setAttribute('src',u);
 const h=parseFloat((PROF[id]&&PROF[id].ht)||'')||HT_DEF,k=Math.min(1,h/HT_REF),S=im.style;
 S.inset='auto';S.bottom='0';S.left=(50-k*50)+'%';S.width=S.height=(k*100)+'%';S.transformOrigin='50% 50%';S.transform=sd==='f'?'scaleX(-1)':'none'}
const _pa23=poseApply;
poseApply=function(sd){if(sd==='q'||sd==='f')return poseApplyX(sd);_pa23(sd)};
const _prf23=poseRefresh;
poseRefresh=function(){_prf23();if(run&&run.dbl){poseApply('q');poseApply('f')}};
const _lg23=lunge;
lunge=function(side){if(side==='q'||side==='f'){restart(D$(side+'PF'),'lg');poseSet(side,'atk',500);return}_lg23(side)};

/* ---------- 전투 시작: 더블 여부 결정 ---------- */
const _nb23=nextBattle;
nextBattle=function(){
 run.dbl=false;run.enemy2=null;run.eA=null;run.pB=-1;run.dsel=null;run.dcmd=null;run.dtgt=null;
 const w=run.wave,alive=run.party.filter(f=>f.hp>0).length;
 if(w>=DBL.from&&w%CFG.MAP_STAGES!==0&&alive>=2&&!run.invite&&Math.random()<DBL.rate)run.dbl=true;
 _nb23()};

const GODIDS=['anak','otori','merhen','amir','samael','jin','jeong','aledeia'];
function dMakeFoe2(){
 const first=run.enemy.ch.id,met=run.metAnak;let e=null;
 for(let n=0;n<10;n++){const c=makeEnemy(run.wave);e=c;
  if(c.boss||GODIDS.includes(c.ch.id))continue;
  if(c.ch.id===first&&n<8)continue;
  break}
 run.metAnak=met;return e}
const dCard=(sd,inner)=>`<div class="cb" id="${sd}C"><div class="act" id="${sd}Act"></div><div class="pop" id="${sd}Pop"></div>${inner}
  <div class="who"><span id="${sd}Nm"></span><span id="${sd}Lv"></span></div><div class="hpl"><i id="${sd}Bar"></i></div><div class="mpl"><i id="${sd}Mp"></i></div><div class="hn" id="${sd}Hn"></div><div class="stt" id="${sd}St"></div></div>`;

const _db23=drawBattle;
drawBattle=function(){
 if(!(run&&run.dbl)||!run.enemy||run.enemy.boss){if(run)run.dbl=false;_db23();const sc=D$('screen');if(sc)sc.classList.remove('dbl4');return}
 if(!run.enemy2)run.enemy2=dMakeFoe2();
 run.eA=run.enemy;run.pA=run.active;run.pB=-1;run.dsel=[];run.dcmd=null;run.dtgt=null;dTag();
 lastQF.q=undefined;lastQF.f=undefined;
 _db23();
 const E2=run.enemy2;
 D$('screen').classList.add('dbl4');
 D$('cards').insertAdjacentHTML('beforebegin',dCard('q','<div class="pf" id="qPF"></div>')+dCard('f',`<div class="pf" id="fPF" style="--c:${EC[E2.ch.el]}"><b>${E2.ch.name[0]}</b>${IMG('battle',E2.ch)}</div>`));
 const wh=document.querySelector('.where');if(wh)wh.textContent+=' · DOUBLE';
 poseLoad(E2.ch.id);
 run.note=(run.note||'')+`${josa(E2.ch.name,'도/도').replace(/도$/,'')}도 함께 나타났다.`;
 run.phase='dsel';
 paintInfo(snap(),false);paintMenu()};

/* 대사가 끝난 뒤에 출전 선택창을 연다 */
const _ds23=dlgShow;
dlgShow=function(steps,done){_ds23(steps,function(){if(done)done();if(run&&run.dbl&&run.phase==='dsel')paintMenu()})};

/* ---------- 메뉴 ---------- */
const dRow=(f,i,o)=>{const r=Math.max(0,f.hp/f.maxhp),m=Math.max(0,f.mp/f.mpm);
 return `<button class="prow2${o.on?' on':''}" ${o.off?'disabled':''} onclick="event.stopPropagation();${o.fn}(${i})">${tileHtml(f.ch)}<div class="pi"><div class="pt"><span class="pn">${o.badge?`<i class="dbd">${o.badge}</i>`:''}${f.ch.name}</span><span>Lv.${f.lv}</span></div>
  <div class="pbar"><span>HP</span><div class="hb"><i style="width:${r*100}%;background:${hpColor(r)}"></i></div><span class="pv">${f.hp}/${f.maxhp}</span></div>
  <div class="pbar"><span>MP</span><div class="hb"><i style="width:${m*100}%;background:#6fa0dc"></i></div><span class="pv">${f.mp}/${f.mpm}</span></div>
  <div class="pst">${stIc(f)}</div></div></button>`};
function drawSel(){
 if(D$('dlg'))return;
 const sel=run.dsel||[],need=Math.min(2,run.party.filter(f=>f.hp>0).length);
 const rows=run.party.map((f,i)=>dRow(f,i,{off:f.hp<=0,on:sel.includes(i),badge:sel.includes(i)?sel.indexOf(i)+1:0,fn:'dblSelPick'})).join('');
 D$('ovl').innerHTML=`<div class="ov"><div class="plist"><div class="dselt">출전할 캐릭터를 선택하세요 (${sel.length}/${need})</div>${rows}<div style="text-align:center;margin-top:1em"><button class="tb" ${sel.length===need?'':'disabled'} onclick="dblSelOk()">확인</button></div></div></div>`}
function dblSelPick(i){
 if(!run||!run.dbl||run.phase!=='dsel'||busy)return;
 const sel=run.dsel=run.dsel||[],need=Math.min(2,run.party.filter(f=>f.hp>0).length);
 const k=sel.indexOf(i);
 if(k>=0)sel.splice(k,1);else if(sel.length<need&&run.party[i].hp>0)sel.push(i);
 paintMenu()}
function dblSelOk(){
 if(!run||!run.dbl||run.phase!=='dsel'||busy)return;
 const sel=run.dsel||[],need=Math.min(2,run.party.filter(f=>f.hp>0).length);
 if(sel.length!==need)return;
 run.pA=sel[0];run.active=sel[0];run.pB=sel.length>1?sel[1]:-1;run.dsel=null;
 dTag();run.note='';dblNextRound()}
function drawForced(){
 const rows=dBench().map(i=>dRow(run.party[i],i,{fn:'pickMember'})).join('');
 D$('ovl').innerHTML=`<div class="ov"><div class="plist"><div class="dselt">교체할 캐릭터를 선택하세요</div>${rows}</div></div>`}

const _pm23=paintMenu;
paintMenu=function(){
 if(!(run&&run.dbl))return _pm23();
 const ph=run.phase;
 if(ph==='menu'&&run.dcmd)withActive(dActIdx(),()=>_pm23());else _pm23();
 ['p','q','e','f'].forEach(pos=>{const c=D$(pos+'C');if(c){c.classList.remove('acting','tg');c.onclick=null}});
 if(ph==='dsel')drawSel();
 else if(ph==='dforced')drawForced();
 else if(ph==='menu'&&run.dcmd){
  const slot=run.dcmd.slots[run.dcmd.k],ac=D$((slot===1?'q':'p')+'C');if(ac)ac.classList.add('acting');
  if(run.dtgt){
   const cand=run.dtgt.kind==='foe1'?dFoes():dAllies();
   cand.filter(f=>f.hp>0).forEach(f=>{const c=D$(f.pos+'C');if(c){c.classList.add('tg');c.onclick=ev=>{ev.stopPropagation();dblTarget(f.pos)}}});
   D$('cards').innerHTML='<div class="dtgm">대상을 선택하세요</div>';
   D$('sideL').innerHTML='<button class="tb" onclick="dblBack()">취소</button>';D$('sideR').innerHTML=''}
  else if(run.dcmd.k>0)D$('sideL').insertAdjacentHTML('beforeend','<button class="tb" onclick="dblBack()">이전</button>')}};

/* ---------- 명령 ---------- */
const _act23=act;
act=function(i){
 if(run&&run.dbl&&run.phase==='menu'&&run.dcmd)return withActive(dActIdx(),()=>_act23(i));
 return _act23(i)};
const _rt23=runTurn;
runTurn=function(a){if(run&&run.dbl&&run.phase==='menu'&&run.dcmd)return dblCmd(a);return _rt23(a)};
const _op23=openParty;
openParty=function(forced){
 if(!(run&&run.dbl))return _op23(forced);
 const taken=new Set();if(run.dcmd)run.dcmd.acts.forEach(a=>{if(a&&a.type==='switch')taken.add(a.to)});
 const rows=run.party.map((f,i)=>dRow(f,i,{off:f.hp<=0||i===run.pA||i===run.pB||taken.has(i),fn:'pickMember'})).join('');
 D$('ovl').innerHTML=`<div class="ov" onclick="document.getElementById('ovl').innerHTML=''"><div class="plist">${rows}</div></div>`};
const _pmb23=pickMember;
pickMember=function(i){
 if(run&&run.dbl){
  if(busy)return;
  if(run.phase==='dforced')return dblForcedPick(i);
  if(run.phase==='menu'&&run.dcmd){D$('ovl').innerHTML='';run.note='';return dRec({type:'switch',to:i})}}
 return _pmb23(i)};

function dKind(sk,team){
 if(!sk)return 'self';
 if(sk.t==='a')return sk.sc==='범위'?'foeAll':'foe1';
 if(sk.t==='w')return 'foe1';
 if(team==='p'&&(sk.t==='h'||sk.t==='b'||sk.t==='g')&&!sk.weather&&!sk.partyHeal&&!sk.dive&&!sk.rnd)return 'ally1';
 return 'self'}
function dblCmd(a){
 if(busy)return;
 const c=run.dcmd,slot=c.slots[c.k],F=slot===1?dB():dA();
 if(a.type==='skill'){
  const pend=F.pend!==null&&F.pend!==undefined;
  const sk=a.i<0?BASIC:F.ch.sk[a.i],kind=pend?'foe1':dKind(sk,'p');
  if(kind==='foe1'||kind==='ally1'){
   const cand=(kind==='foe1'?dFoes():dAllies()).filter(f=>f.hp>0);
   if(cand.length>1&&!pend){run.dtgt={kind,a};paintMenu();return}
   return dRec({type:'skill',i:a.i,tgt:cand[0]?cand[0].pos:null})}
  return dRec({type:'skill',i:a.i,tgt:null})}
 dRec(a)}
function dblTarget(pos){
 const t=run.dtgt;if(!t||busy)return;
 run.dtgt=null;dRec({type:'skill',i:t.a.i,tgt:pos})}
function dRec(a){
 const c=run.dcmd;c.acts[c.slots[c.k]]=a;c.k++;
 if(c.k<c.slots.length){paintMenu();return}
 dblRun()}
function dblBack(){
 if(busy||!run||!run.dcmd)return;
 if(run.dtgt)run.dtgt=null;
 else if(run.dcmd.k>0){run.dcmd.k--;run.dcmd.acts[run.dcmd.slots[run.dcmd.k]]=null}
 paintMenu()}

/* ---------- 턴 진행 ---------- */
function dRemap(ev,n,mp){
 const m=s=>mp[s]||s;
 for(let j=n;j<ev.length;j++){const e=ev[j];
  if(e.pop&&e.pop.side)e.pop={...e.pop,side:m(e.pop.side)};
  if(e.fx&&e.fx.side)e.fx={...e.fx,side:m(e.fx.side)};
  if(e.act&&e.act.side)e.act={...e.act,side:m(e.act.side)};
  if(e.lunge)e.lunge=m(e.lunge)}}
function dOne(a,d,idx,ev){
 const n=ev.length,mp={};mp[a.side]=a.pos||a.side;if(d&&d.side!==a.side)mp[d.side]=d.pos||d.side;
 perform(a,d,idx,ev);dRemap(ev,n,mp)}
function dArea(a,list,first,idx,ev){
 const n=ev.length;dOne(a,first,idx,ev);
 if(!ev.slice(n).some(e=>e.act))return;
 list.forEach(o=>{
  if(o===first||o.hp<=0||a.hp<=0)return;
  const m=a.mp,l=a.last,k=ev.length;
  dOne(a,o,idx,ev);a.mp=m;a.last=l;
  const ci=ev.findIndex((e,j)=>j>=k&&e.act);if(ci>=0)ev.splice(ci,1)})}
const CASTER=['ch','sl','mp','mpm','gain','pow','lv','last','pend','dive','rest','stun','stunImm','seal','sealAge'];
function dCast(C,T,foe,idx,ev){
 const sk=idx<0?BASIC:C.ch.sk[idx],ti=run.party.indexOf(T);
 if(T===C||ti<0||C.rest>0||C.stun>0||(idx>=0&&C.seal===idx)||(C.pend!==null&&C.pend!==undefined))return dOne(C,foe,idx,ev);
 const sv={stun:T.stun,stunImm:T.stunImm,seal:T.seal,sealAge:T.sealAge};
 const H={...T};CASTER.forEach(k=>{H[k]=C[k]});H.stun=0;H.stunImm=0;
 run.party[ti]=H;
 try{dOne(H,foe,idx,ev)}finally{run.party[ti]=T}
 Object.keys(H).forEach(k=>{if(!CASTER.includes(k))T[k]=H[k]});
 Object.assign(T,sv);if(sk&&sk.clean){cleanse(T)}
 C.mp=H.mp;C.last=H.last}
function dItem(a,say){
 const f=run.party[a.to],m=ITEMS[a.id];if(!f||!m||(IT()[a.id]||0)<=0)return;
 IT()[a.id]--;
 const pos=f.pos,fx=pos?{side:pos,k:'heal'}:undefined,pp=(v,c)=>pos?{side:pos,v,cls:c}:undefined;
 say(`${m.n} 사용. ${f.ch.name}`,{sfx:'tap'});
 if(a.id==='bul'){f.hp=Math.round(f.maxhp*.5);resetBattleState(f);say(`${josa(f.ch.name,'이/가')} 되살아났다.`,{pop:pp('부활','heal'),fx,sfx:'heal'})}
 else if(a.id==='ade'){const had=cleanse(f);say(had?`${f.ch.name}의 이상이 사라졌다.`:'해제할 이상이 없었다.',{pop:pp(had?'해제':'변화 없음','tx'),fx:had?fx:undefined,sfx:had?'heal':'miss'})}
 else{const g=Math.round(f.maxhp*m.pct),b=f.hp;f.hp=Math.min(f.maxhp,f.hp+g);say(`${f.ch.name} HP ${f.hp-b} 회복`,{pop:pp('+'+(f.hp-b),'heal'),fx,sfx:'heal'})}}
function dEnd(ev){
 const A=dA(),B=dB(),EA=run.eA||run.enemy,EB=run.enemy2,F0=run.field;
 const pair=(al,fo,mp,tmp)=>{const k=run.active,ke=run.enemy;
  if(tmp)run.party.push(al);
  run.active=run.party.indexOf(al);run.enemy=fo;const n=ev.length;
  try{endOfTurn(ev)}finally{run.active=k;run.enemy=ke;if(tmp)run.party.pop()}
  dRemap(ev,n,mp)};
 pair(A,EA,{p:'p',e:'e'});
 if(B||EB){
  const keep=run.field;
  const dm=src=>({...src,hp:0,dot:null,mT:0,dT:0,evade:0,stunImm:0,stun:0,shock:false,seal:null,love:0,dive:0,psn:0,conf:0,inv:0,slowT:0,spdBT:0,spdT:0});
  run.field=(F0&&F0.k==='snow')?{...F0,t:99}:null;
  try{pair(B||dm(A),EB||dm(EA),{p:B?'q':'p',e:EB?'f':'e'},!B)}finally{run.field=keep}}}
function dblTurn(acts){
 const ev=[],say=(t,o)=>ev.push({t,s:snap(),...o});
 const foesAlive=()=>dFoes().filter(f=>f.hp>0),alliesAlive=()=>dAllies().filter(f=>f.hp>0);
 const koSet=new Set();[...dAllies(),...dFoes()].forEach(f=>{if(f.hp<=0)koSet.add(f)});
 const koCheck=()=>{[...dAllies(),...dFoes()].forEach(f=>{if(f.hp<=0&&!koSet.has(f)){koSet.add(f);
  say(f.side==='p'?`${josa(f.ch.name,'은/는')} 쓰러졌다.`:`${josa(f.ch.name,'을/를')} 쓰러뜨렸다.`,{sfx:'ko'})}})};
 [0,1].forEach(slot=>{const a=acts[slot];if(!a)return;
  if(a.type==='switch'){
   const old=slot?dB():dA(),nw=run.party[a.to];
   if(!old||!nw||nw.hp<=0||a.to===run.pA||a.to===run.pB)return;
   old.dive=0;old.pend=null;
   if(slot===0){run.pA=a.to;run.active=a.to}else run.pB=a.to;
   dTag();say(`${old.ch.name}, 교대. ${nw.ch.name}`,{sfx:'tap'})}
  else if(a.type==='item')dItem(a,say)});
 const ents=[];
 [0,1].forEach(slot=>{const F=slot?dB():dA(),a=acts[slot];if(F&&F.hp>0&&a&&a.type==='skill'&&!(a.sw))ents.push({f:F,team:'p',a})});
 dFoes().forEach(e=>{if(e.hp>0)ents.push({f:e,team:'e'})});
 const key=x=>st(x.f,'spd')-(x.f.shock?1000:0)+Math.random()*.001;
 ents.sort((x,y)=>key(y)-key(x));
 const pick=(list,pos)=>list.find(q=>q.pos===pos&&q.hp>0)||list.find(q=>q.hp>0)||null;
 for(const x of ents){
  if(!foesAlive().length||!alliesAlive().length)break;
  const f=x.f;if(f.hp<=0)continue;
  const mine=x.team==='p'?alliesAlive():foesAlive(),opp=x.team==='p'?foesAlive():alliesAlive();
  let idx,tgtPos=null;
  if(x.team==='e'){const t=opp[Math.floor(Math.random()*opp.length)];idx=aiPick(f,t);tgtPos=t.pos}
  else{idx=x.a.i;tgtPos=x.a.tgt}
  const sk=idx<0?BASIC:f.ch.sk[idx],pending=f.pend!==null&&f.pend!==undefined;
  const kind=pending?'foe1':dKind(sk,x.team),foe=pick(opp,tgtPos);
  if(kind==='foeAll')dArea(f,opp,foe,idx,ev);
  else if(kind==='ally1')dCast(f,pick(mine,tgtPos)||f,foe,idx,ev);
  else dOne(f,foe,idx,ev);
  koCheck()}
 if(foesAlive().length&&alliesAlive().length){dEnd(ev);koCheck()}
 let result='cont';
 if(!foesAlive().length){result='win';ev.push({t:'승리',s:snap(),sfx:'win'})}
 else if(!alliesAlive().length&&!dBench().length)result='lose';
 else if(((dA().hp<=0)||(dB()&&dB().hp<=0))&&dBench().length)result='forced';
 return{ev,result}}
function dCollapse(){
 if(dBench().length)return;
 if(dA().hp<=0&&dB()&&dB().hp>0){run.pA=run.pB;run.pB=-1;run.active=run.pA}
 else if(dB()&&dB().hp<=0)run.pB=-1;
 dTag()}
function dblRun(){
 const acts=run.dcmd.acts;run.dcmd=null;run.dtgt=null;
 busy=true;run.phase='play';paintMenu();
 const r=dblTurn(acts);
 playEvents(r.ev,()=>{
  busy=false;skipFn=null;run.active=run.pA;
  if(r.result==='win'){winBattle();paintInfo(snap(),false);paintMenu()}
  else if(r.result==='lose'){loseRun();paintMenu()}
  else if(r.result==='forced'){run.phase='dforced';paintInfo(snap(),false);paintMenu()}
  else dblNextRound()})}
function dblNextRound(){
 dCollapse();dTag();
 const slots=[0];if(dB()&&dB().hp>0)slots.push(1);
 run.dcmd={slots,k:0,acts:[]};run.dtgt=null;run.phase='menu';run.active=run.pA;
 paintInfo(snap(),false);paintMenu()}
function dblForcedPick(i){
 if(!dBench().includes(i))return;
 if(dA().hp<=0){run.pA=i;run.active=i}else run.pB=i;
 dTag();paintInfo(snap(),false);
 const dead=(dA().hp<=0)||(dB()&&dB().hp<=0);
 if(dead&&dBench().length){paintMenu();return}
 dblNextRound()}

/* ---------- 승리 보상: 두 마리 몫 ---------- */
const _wb23=winBattle;
winBattle=function(){
 if(!(run&&run.dbl&&run.enemy2))return _wb23();
 run.active=run.pA;
 const c0=S.coin;
 _wb23();
 if(run.phase!=='reward')return;
 const got=S.coin-c0;
 if(got>0){S.coin+=got;run.gained+=got;run.note=`${TG} ${got*2}`}
 const ex=run.exp||[],eA=ex.find(x=>x.i===run.pA),eB=run.pB>=0?ex.find(x=>x.i===run.pB):null;
 if(eA&&eB&&eA.g>eB.g){
  const f=run.party[run.pB],o=S.chars[f.ch.id],add=eA.g-eB.g;
  if(o){const l1=o.lv;addExp(f.ch.id,add);if(o.lv>l1)rescaleFighter(f,l1,o.lv,o.bt);
   eB.g+=add;eB.l1=o.lv;eB.pct=o.lv>=CFG.LV_MAX?100:Math.round(o.exp/expNeed(o.lv)*100)}}
 save()};
