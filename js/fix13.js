/* 13차 수정: 제드 · 네필레 · 주작 · 보상 즉시 사용 · 희귀도 확률 · 보상 화면 정렬 */

/* ---------- 스킬 ---------- */
CHM.zed.sk=[
 A('카빈','카빈으로 쏜다.',35,{acc:85}),
 Z('승마','말을 타고 달려 회피율을 높인다. 2턴 동안 이어진다.',{acc:100,kn:'자기 변화'}),
 A('이도류','두 자루의 검으로 몰아친다.',10,{acc:95,multi:[2,5],kn:'단일 연속 공격'})];
CHM.nephile.sk=[
 A('발라레','노랫말대로 상황이 전개된다. 적중하면 공격력이 떨어진다.',20,{acc:45,atkDown:1}),
 B('하프 연주','하프 소리가 아군의 발걸음을 가볍게 한다.',0,{acc:95,spdUp:2,kn:'타인 변화'}),
 Object.assign({},CHM.kerma.sk[2])];
CHM.sasin_ju.sk=[
 A('불도깨비','불도깨비를 불러 연달아 공격한다.',10,{acc:85,multi:[2,5],kn:'단일 연속 공격'}),
 H('치유','주작의 힘으로 아주 화끈하게 치유한다.',100,{acc:55,kn:'자기 변화'}),
 W('‘허공’의 소리','‘허공’의 소리로 상대를 혼란에 빠뜨린다.',55,{acc:80,voidConf:1,kn:'타인 변화'})];

Object.assign(PROF,{
 zed:{full:'제드 캘리 산체스',rom:'Zedd Kelly Sánchez / 泽德',aff:'프라니아 제국',sex:'남성',age:'26세',ht:'173cm',race:'인간',el:'火',abil:'—',
  intro:'프라니아 제국 뇌프레테 영지 영주의 동생으로, 친형인 캐넌과 앙숙의 관계를 가지고 있다. 다혈질적이며, 캐넌에게 받은 스트레스를 양동생인 루이스에게 풀고 있다.'},
 nephile:{full:'네필레',rom:'νεφέλη / 彩雲',aff:'덴드론고니아',sex:'여성',age:'약 39만세',ht:'173cm',race:'아르케족',el:'+',abil:'그리움을 다루는 능력',
  intro:'에이레네 학교의 교수. 케르마의 오랜 친구로, 수업이 없는 날이면 자주 케르마의 집무실에 놀러와 노래를 부른다.'},
 sasin_ju:{full:'주작',rom:'Vermilion / 朱雀',aff:'‘규율’의 눈동자',sex:'여성',age:'외관상 38세',ht:'220cm',race:'사신',el:'火',abil:'치유를 다루는 능력',
  intro:'원향족의 주작 가문에게 힘을 빌려주고 있는 사신. 한 때 ‘세상’에 살았으나, 모종의 이유로 ‘허공’에 영원히 머무르게 되었다.'}});

/* ---------- 상태: 속도 상승 · 공격 저하(해제 불가) · 중독 유지 ---------- */
const SPD_STK=.2,ATK_DN=.1;
const _rbs13=resetBattleState;
resetBattleState=function(f){const p=f.psn;_rbs13(f);f.spdStk=0;f.spdT=0;f.dbStk=0;f.psn=(f.hp>0&&f.side==='p'&&p)?p:0};
const _st13=st;
st=function(f,k){let v=_st13(f,k);
 if(k==='spd'&&f.spdStk)v*=1+SPD_STK*f.spdStk;
 if(k==='atk'&&f.dbStk)v*=Math.max(.3,1-ATK_DN*f.dbStk);
 return v};
Object.assign(SVGP,{buff:SVGP.buff||'<path d="M12 20V6M6 12l6-6 6 6"/>'});
const _stIc13=stIc;
stIc=function(f){let h=_stIc13(f);
 if(f.spdStk>0)h+=`<span>${svg('buff')}</span>`;
 if(f.dbStk>0&&!(f.d&&(f.d.atk>0||f.d.def>0)))h+=`<span>${svg('debuff')}</span>`;
 return h};
const _eot13=endOfTurn;
endOfTurn=function(ev){_eot13(ev);
 [run.party[run.active],run.enemy].forEach(f=>{if(f.spdT>0&&--f.spdT<=0)f.spdStk=0})};
const _perf13=perform;
perform=function(a,d,idx,ev){
 const sk=idx<0?BASIC:a.ch.sk[idx];
 if(!sk||!(sk.spdUp||sk.voidConf||sk.atkDown))return _perf13(a,d,idx,ev);
 const n0=ev.length,hp0=d.hp,ot=sk.t,op=sk.p,me=a.side,you=d.side;
 const say=(t,o)=>ev.push({t,s:snap(),...o}),tx=(side,v)=>({side,v,cls:'tx'});
 if(sk.spdUp||sk.voidConf){sk.t='h';sk.p=0}
 try{_perf13(a,d,idx,ev)}finally{sk.t=ot;sk.p=op}
 const mine=ev.slice(n0),cast=mine.some(e=>e.t===`${a.ch.name}의 ${sk.n}`),fail=mine.some(e=>e.t==='효과가 없었다.');
 if(!cast||fail)return;
 if(sk.spdUp){const T=me==='p'?run.party.filter(f=>f.hp>0):[a];
  T.forEach(f=>{f.spdStk=Math.min(sk.spdUp,(f.spdStk||0)+1);f.spdT=3});
  say(`아군의 속도가 오른다. (${a.spdStk}단계)`,{pop:tx(me,'속도 UP x'+a.spdStk),fx:{side:me,k:'up',c:'#9ad0f0'},sfx:'up'})}
 if(sk.voidConf){
  if(d.hp>0&&!d.conf){d.conf=1;d.confAge=0;say(`${josa(d.ch.name,'은/는')} 혼란에 빠졌다.`,{pop:tx(you,'혼란'),fx:{side:you,k:'down',c:'#d8a85a'},sfx:'down'})}
  else if(d.hp>0)say('이미 혼란 상태다.',{pop:tx(you,'변화 없음'),sfx:'miss'})}
 if(sk.atkDown&&d.hp>0&&d.hp<hp0){d.dbStk=Math.min(5,(d.dbStk||0)+1);
  say(`${d.ch.name} 공격 저하 (${d.dbStk}단계)`,{pop:tx(you,'공격 DOWN x'+d.dbStk),fx:{side:you,k:'down',c:'#ad8fd8'},sfx:'down'})}};
const _ai13=aiPick;
aiPick=function(e,p){const r=_ai13(e,p);
 if(r>=0){const s=e.ch.sk[r];
  if(s&&((s.spdUp&&e.spdStk>=s.spdUp)||(s.voidConf&&p.conf)))return 0}
 return r};

/* ---------- 보상: 희귀도 먼저, 그 안에서 아이템 ---------- */
ITEMS.orb_m.d='속도 상승\n(5스테이지)';ITEMS.orb_h.d='공격력 상승\n(5스테이지)';ITEMS.orb_t.d='최대 HP 상승\n(5스테이지)';
ITEMS.orb_g.d='방어력 상승\n(5스테이지)';ITEMS.orb_s.d='명중률 상승\n(5스테이지)';
ITEMS.apr.d='+1';ITEMS.bul.d='부활\nHP 50%';ITEMS.map.d='다음 지역 선택';
const RPROB={1:52,2:30,3:15,4:3};
rewardCards=function(){
 const al=run.party.filter(f=>f.hp>0),down=run.party.some(f=>f.hp<=0),dmg=al.some(f=>f.hp<f.maxhp),psn=al.some(f=>f.psn);
 const ok=id=>{const it=ITEMS[id];
  if(id==='bul')return down;if(it.pct)return dmg;if(id==='ade')return psn;
  if(it.orb)return (OB()[it.orb]||0)<ORB_MAX;return true};
 const pool=Object.keys(ITEMS).filter(ok),out=[];
 while(out.length<3&&pool.length){
  const tiers=[1,2,3,4].filter(r=>pool.some(id=>ITEMS[id].r===r));
  const t=tiers.reduce((a,r)=>a+RPROB[r],0);let x=Math.random()*t,r=tiers[0];
  for(const q of tiers){if((x-=RPROB[q])<0){r=q;break}}
  const L=pool.filter(id=>ITEMS[id].r===r),tw=L.reduce((a,id)=>a+ITEMS[id].w,0);let y=Math.random()*tw,pick=L[0];
  for(const id of L){if((y-=ITEMS[id].w)<0){pick=id;break}}
  out.push({id:pick});pool.splice(pool.indexOf(pick),1)}
 return out};

/* ---------- 선택 즉시 사용 ---------- */
function finishReward(){
 run.party.forEach(f=>{if(f.hp>0)f.hp=Math.min(f.maxhp,f.hp+Math.round(f.maxhp*CFG.REGEN))});
 save();run.wave++;nextBattle()}
function rewardTarget(id){
 const rows=run.party.map((f,i)=>{
  const okk=id==='bul'?f.hp<=0:id==='ade'?(f.hp>0&&!!f.psn):(f.hp>0&&f.hp<f.maxhp),r=Math.max(0,f.hp/f.maxhp),mp=Math.max(0,f.mp/f.mpm);
  return `<button class="prow2" ${okk?'':'disabled'} onclick="event.stopPropagation();rewardUse('${id}',${i})">${tileHtml(f.ch)}<div class="pi"><div class="pt"><span class="pn">${f.ch.name}</span><span>Lv.${f.lv}</span></div>
   <div class="pbar"><span>HP</span><div class="hb"><i style="width:${r*100}%;background:${hpColor(r)}"></i></div><span class="pv">${f.hp}/${f.maxhp}</span></div>
   <div class="pbar"><span>MP</span><div class="hb"><i style="width:${mp*100}%;background:#6fa0dc"></i></div><span class="pv">${f.mp}/${f.mpm}</span></div>
   <div class="pst">${stIc(f)}</div></div></button>`}).join('');
 $('ovl').innerHTML=`<div class="ov"><div class="plist">${rows}</div></div>`}
function rewardUse(id,i){const f=run.party[i],m=ITEMS[id];
 if(id==='bul'){f.hp=Math.round(f.maxhp*.5);resetBattleState(f)}
 else if(id==='ade'){cleanse(f);f.psn=0}
 else f.hp=Math.min(f.maxhp,f.hp+Math.round(f.maxhp*m.pct));
 $('ovl').innerHTML='';finishReward()}
function rewardMap(){
 const b=Math.floor((run.wave-1)/CFG.MAP_STAGES)+1;
 $('ovl').innerHTML=`<div class="ov"><div class="qbox"><div class="qt">지도</div><div class="mapl">${['tamaki','iwonhyang','sephirot','badr','glisha'].map(id=>`<button class="tb" onclick="rewardMapGo('${id}',${b})">${REG[id].name}</button>`).join('')}</div></div></div>`}
function rewardMapGo(id,b){ensureRegion(b);run.regions[b]=id;$('ovl').innerHTML='';finishReward()}
pickReward=function(i){
 const c=run.cards[i];if(!c)return;const id=c.id,it=ITEMS[id];
 if(id==='bul'||id==='ade'||it.pct){rewardTarget(id);return}
 if(id==='map'){rewardMap();return}
 if(it.orb)addOrb(it.orb);
 else if(it.mat)S.mats[it.mat]++;
 else if(id==='yin'){const v=60+run.wave*4;S.coin+=v;run.gained+=v}
 else if(id==='apr')S.ap+=1;
 else if(id==='inv')run.invite=true;
 finishReward()};

/* ---------- 화면 ---------- */
(function(){const st=document.createElement('style');st.textContent=`
.xrow{display:grid;grid-template-columns:repeat(3,22%);gap:2%;justify-content:center;width:100%}
.xc{font-size:.8em;min-width:0}
.xn{gap:.6em}
.xn span{white-space:nowrap}
.xn span:first-child{overflow:hidden;text-overflow:ellipsis;min-width:0}
.rw{flex:0 0 22%;justify-content:flex-start;gap:.5em;min-height:11.5em}
.rw .ri{height:3.2em;overflow:hidden}
.rw .ri .sic.bk{width:2.6em;height:2.6em}
.rw .ri .si{width:2.8em;height:2.8em}
.rw .ri .ic{width:2.6em;height:2.6em}
.rw .ds{font-size:.85em;color:var(--dim);line-height:1.5;min-height:3em}
`;document.head.appendChild(st)})();
const _pm13=paintMenu;
paintMenu=function(){_pm13();
 if(!run)return;
 if(run.phase==='menu'){$('sideR').innerHTML=`<button onclick="openParty(false)">파티원</button><button onclick="quitRun()">도망가기</button>`}
 else if(run.phase==='reward'&&run.cards&&!document.querySelector('#ovl .plist,#ovl .mapl')){
  const ex=(run.exp||[]).map(e=>{const f=run.party[e.i],up=e.l1>e.l0;
   return `<div class="xc"><div class="xn"><span>${f.ch.name}</span><span>${up?`Lv.${e.l0} → Lv.${e.l1}`:`Lv.${e.l1}`}</span></div><div class="xb"><i style="width:${e.pct}%"></i></div><div class="xg"><span>+${e.g} EXP</span>${up?'<b>LEVEL UP</b>':''}</div></div>`}).join('');
  const cards=run.cards.map((c,i)=>{const m=ITEMS[c.id],col=RCOL[m.r],d=c.id==='yin'?'+'+(60+run.wave*4):m.d;
   return `<button class="rw" style="--rc:${col}" onclick="pickReward(${i})"><span class="ri">${itemIcon(c.id,col)}</span><b>${m.n}</b><span class="ds">${d.replace(/\n/g,'<br>')}</span></button>`}).join('');
  $('ovl').innerHTML=`<div class="ov" style="flex-direction:column;gap:1.3em"><div class="gain">${run.note}</div><div class="xrow">${ex}</div><div class="rrow">${cards}</div></div>`}};

const _sf13=skFace;
skFace=function(ch,i,s,lv,tag,mp){const h=_sf13(ch,i,s,lv,tag,mp);
 return s&&s.voidConf?h.replace('위력 -','위력 '+Math.round((s.p||0)*skMul(lv))):h};
