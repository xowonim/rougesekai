/* 7차 수정: 아이콘 · 수 글자 테두리 · 전투 메뉴 배치 · 지도 메커니즘('세상') */

/* ---------- 아이콘 ---------- */
const _bk3=bkSvg;
bkSvg=function(k){
 if(k==='ls'){
  let g='<rect x="9" y="4.5" width="14" height="23" rx="1" fill="#14161c" stroke="#f0e2ae" stroke-width="1.1"/>';
  [[12.8,24],[16,21],[19.2,17.5]].forEach(l=>g+=`<line x1="${l[0]}" y1="8.5" x2="${l[0]}" y2="${l[1]}" stroke="#f0e2ae" stroke-width=".8" stroke-linecap="round" opacity=".75"/>`);
  return `<svg class="si" viewBox="0 0 32 32">${g}</svg>`}
 const s=_bk3(k);
 if(k==='ll'){const C=['#ee5a4c','#efcf4a','#6fc27a','#5b96f0'];let i=0;
  return s.replace(/(<circle cx="20\.6" cy="[^"]*" r="\.95" fill=")#f0e2ae/g,(m,a)=>a+C[i++%4])}
 return s};

/* ---------- 주 오행: 수는 검정 글씨에 회색 얇은 테두리 ---------- */
const _prof3=profHtml;
profHtml=function(c){return _prof3(c).replace(/text-shadow:[^"]*/,'-webkit-text-stroke:.6px #9aa0ac')};

/* ---------- 전투 메뉴: 왼쪽 스킬, 오른쪽 2행 ---------- */
(function(){const st=document.createElement('style');st.textContent=`
#cards{left:3%;right:21%;justify-content:flex-start}
.side{font-size:.8em}
.side.l{display:none}
.side.r{top:auto;bottom:3%;right:3%;width:15.5%;height:14.4%;display:flex;flex-direction:column;gap:.5em}
.side.r button{flex:1;letter-spacing:.1em;padding:0}`;document.head.appendChild(st)})();
const _pm7=paintMenu;
paintMenu=function(){_pm7();
 if(run&&run.phase==='menu'){
  $('sideL').innerHTML='';
  $('sideR').innerHTML=`<button onclick="openParty(false)">파티원</button><button onclick="quitRun()">도망가기</button>`}};

/* ---------- 지도 메커니즘: '세상' (5스테이지마다 지역 이동) ---------- */
CFG.MAP_STAGES=5;
CHM.horus={id:'horus',name:'호루스',el:'？',star:5,race:'—',role:'s',sk:[
 A('부리','날카로운 부리로 쫀다.',45,{acc:100}),
 A('날갯짓','날개를 휘둘러 몰아친다.',60)]};
const REG={
 tamaki:{id:'tamaki',name:'타마키 신사',g:['#7a6a2c','#1a160c'],
  spawn:[[99,{race:['이사야족','사흉','원향족']}],[1,{ids:['otori']}]],
  next:[['anak',1],['iwonhyang',33],['sephirot',33],['glisha',33]]},
 iwonhyang:{id:'iwonhyang',name:'이원향',g:['#5b5f6a','#16171c'],tip:'눈이 내린다. 턴마다 최대 HP의 일부를 잃는다.',
  spawn:[[98,{race:['원향족']}],[2,{ids:['jin']}]],
  next:[['sephirot',50],['glisha',50]]},
 sephirot:{id:'sephirot',name:'세피로트',g:['#3f6e3c','#101a10'],
  spawn:[[90,{race:['이사야족']}],[10,{ids:['marchen','anax']}]],
  next:[['tamaki',1],['iwonhyang',33],['badr',33],['glisha',33]]},
 badr:{id:'badr',name:'바드르 제단',g:['#6e4424','#1a100a'],
  spawn:[[50,{ids:['horus']}],[50,{ids:['amir']}]],
  next:[['sephirot',50],['glisha',50]]},
 glisha:{id:'glisha',name:'글리샬라볼라스',g:['#4c1a16','#140808'],
  spawn:[[99,{race:['사흉']}],[1,{ids:['samael','kuroaka','oscar']}]],
  next:[['sephirot',33],['iwonhyang',33],['badr',33]]},
 anak:{id:'anak',name:'아낙의 고유차원',g:['#2c3254','#0e1018'],tip:'아군의 공격과 방어가 10% 줄어든다.',
  spawn:[[100,{ids:['anax']}]],
  next:[['sephirot',100]]}};
const wpick=l=>{let t=l.reduce((a,b)=>a+b[0],0),r=Math.random()*t;for(const x of l){if((r-=x[0])<0)return x[1]}return l[l.length-1][1]};
function pickEnemy(R){
 const e=wpick(R.spawn);
 if(e.ids)return CHM[rnd(e.ids)];
 const grp=rnd(e.race);return rnd(CH.filter(c=>c.race===grp))}
function nextRegion(prev,met){
 if(prev==='sephirot'&&met)return 'anak';
 return wpick(REG[prev].next.map(n=>[n[1],n[0]]))}
function ensureRegion(b){
 if(!run.regions)run.regions=[];
 while(run.regions.length<=b){const i=run.regions.length;
  run.regions.push(i===0?'tamaki':nextRegion(run.regions[i-1],run.metAnak));run.metAnak=false}}

makeEnemy=function(w){
 const R=MAPS[0],boss=w%CFG.MAP_STAGES===0;
 const ch=pickEnemy(R);if(ch.id==='anax')run.metAnak=true;
 const lv=1+Math.floor((w-1)*1.1)+(boss?2:0);
 const base=Math.min(1.5,.75+.012*(w-1));
 const e=newFighter(ch,lv,0,'e',boss?{hp:base*1.5,atk:base*1.1,def:base*1.1}:{all:base});
 e.boss=boss;return e};
nextBattle=function(){
 const w=run.wave,b=Math.floor((w-1)/CFG.MAP_STAGES);ensureRegion(b);
 const R=REG[run.regions[b]];run.region=R.id;MAPS.length=1;MAPS[0]=R;
 run.enemy=makeEnemy(w);
 run.party.forEach(resetBattleState);
 if(run.party[run.active].hp<=0)run.active=run.party.findIndex(f=>f.hp>0);
 const e=run.enemy;
 run.note=((w-1)%CFG.MAP_STAGES===0?`${R.name}.  ${R.tip?R.tip+'  ':''}`:'')+(e.boss?`${josa(e.ch.name,'이/가')} 모습을 드러냈다.`:`${josa(e.ch.name,'이/가')} 앞을 가로막는다.`);
 run.phase='menu';run.sub='cmd';
 drawBattle()};

/* 아낙의 고유차원: 아군 공격·방어 -10% / 이원향: 눈 (턴마다 최대 HP 일부 감소) */
const _st7=st;
st=function(f,k){let v=_st7(f,k);if(f.side==='p'&&run&&run.region==='anak'&&(k==='atk'||k==='def'))v*=.9;return v};
const SNOW=.03;
const _eot7=endOfTurn;
endOfTurn=function(ev){_eot7(ev);
 if(!run||run.region!=='iwonhyang')return;
 [run.party[run.active],run.enemy].forEach(f=>{
  if(f.hp>1&&!f.dive){const v=Math.max(1,Math.round(f.maxhp*SNOW)),d=Math.min(v,f.hp-1);
   f.hp-=d;ev.push({t:`${f.ch.name} 눈보라 ${d}`,s:snap(),pop:{side:f.side,v:'-'+d,cls:'dot'},sfx:'hit'})}})};
