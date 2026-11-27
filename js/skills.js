/* 5차 수정: 해경 · 홍련 · 비프 스킬, 봉인/상태이상 해제/잠수, 오행 색상, 파티 화면, 화면 맞춤 */

/* ---------- 스킬 데이터 ---------- */
CHM.haekyung.sk=[
 A('우산','우산을 무기 삼아 휘두른다.',40,{acc:100}),
 H('요리','오토리도 인정한 미슐랭 손으로 HP나 MP를 회복한다.',35,{acc:80,rnd:1,kn:'타인 변화',mp:14}),
 W('기억','상대의 기억을 조작해 마지막으로 쓴 기술을 잊게 한다.',0,{acc:100,seal:1,kn:'타인 변화',mp:12})];
CHM.hongryeon.sk=[
 H('재생','생명력을 불어넣어 상처를 아물게 한다.',40,{acc:100,kn:'타인 변화'}),
 H('다도','따뜻한 차로 몸과 마음의 이상을 가라앉힌다.',0,{acc:80,clean:1,kn:'타인 변화'}),
 W('사랑','무한한 애정으로 상대가 싸울 마음을 잃게 한다.',0,{acc:60,love:1,kn:'타인 변화',mp:12})];
CHM.bif.sk=[
 A('수검','물로 빚은 검으로 벤다.',40,{acc:100}),
 A('잠수','물속으로 잠수했다가 튀어올라 공격한다.',80,{acc:100,dive:1,mp:16}),
 H('정화','깨끗한 물로 몸을 씻어 이상을 없앤다.',0,{acc:60,clean:1,kn:'자기 변화'})];

/* ---------- 스킬 표시 ---------- */
skFace=function(ch,i,s,lv,tag,mp){const c=mp?mpCost(s,i):0;
 const p=Math.round((s.p||0)*skMul(lv)),acc=s.acc!==undefined?s.acc:(s.t==='a'?95:100);
 return `<div class="sf"><span class="a">${i<0?svg('single'):skIcon(ch,i,s)}</span><span class="c">${s.n}${tag||''}${mp?`<small>MP ${c}</small>`:''}</span><span class="r"><span>${s.kn||kindName(s)}</span><span>위력 ${s.t==='a'?p:'-'} / 명중 ${acc}</span></span></div>`};

/* ---------- 전투 상태 ---------- */
const _resetBattleState=resetBattleState;
resetBattleState=function(f){_resetBattleState(f);f.seal=null;f.sealAge=0;f.love=0;f.loveAge=0;f.dive=0;f.pend=null;f.last=null;f.psn=0;f.conf=0;f.confAge=0;f.stk=0;f.stkPerm=false};
const _doTurn=doTurn;
doTurn=function(action){if(action.type==='switch'){const o=run.party[run.active];o.dive=0;o.pend=null}return _doTurn(action)};

const RELEASE=.2,CONF_SELF=.7,CONF_RELEASE=.1;
const FIELD_NM={clear:'청명',rain:'비',snow:'눈',thunder:'낙뢰',hot:'무더위',fog:'안개'};
const FIELD_TXT={clear:'청명한 날씨가 되었다.',rain:'비가 내린다. 모두의 공격력이 10% 줄어든다.',snow:'눈이 내린다. 모두 턴마다 HP를 잃는다.',thunder:'먹구름이 낀다. 낙뢰가 떨어질 것 같다.',hot:'무더위가 찾아왔다. 모두의 공격력이 30% 늘어난다.',fog:'안개가 낀다. 아군의 회피율이 10% 오른다.'};
function cleanse(f){const had=!!(f.dot||f.psn||f.conf||f.shock||f.stun>0||f.d.atk>0||f.d.def>0||f.seal!==null||f.love);
 f.dot=null;f.psn=0;f.conf=0;f.confAge=0;f.shock=false;f.shockT=0;f.stun=0;f.d={atk:0,def:0};f.dT=0;f.seal=null;f.love=0;return had}

perform=function(a,d,idx,ev){
 const say=(t,o)=>ev.push({t,s:snap(),...o});
 const me=a.side,you=d.side,tx=(side,v,c)=>({side,v,cls:'tx'+(c?' '+c:'')});
 if(a.rest>0){a.rest--;say(`${josa(a.ch.name,'은/는')} 숨을 고른다.`,{pop:tx(me,'휴식')});return}
 let pend=false;
 if(a.pend!==null&&a.pend!==undefined){idx=a.pend;a.pend=null;pend=true}
 else if(a.stun>0){
  if(Math.random()<CFG.STUN_WAKE){a.stun=0;a.stunImm=1;say(`${josa(a.ch.name,'은/는')} 정신을 차렸다.`,{pop:tx(me,'기상'),sfx:'up'})}
  else{say(`${josa(a.ch.name,'은/는')} 움직이지 못한다.`,{pop:tx(me,'기절'),fx:{side:me,k:'stun'},sfx:'stun'});return}}
 const sk=idx<0?BASIC:a.ch.sk[idx],k=skMul(slv(a,idx));
 if(!pend&&idx>=0&&a.seal===idx){say(`${a.ch.sk[idx].n}은(는) 봉인되어 쓸 수 없다.`,{pop:tx(me,'봉인')});return}
 if(!pend){const cost=mpCost(sk,idx);a.mp=Math.max(0,a.mp-cost);if(cost===0)a.mp=Math.min(a.mpm,a.mp+a.gain);a.last=idx}
 say(pend?`${a.ch.name}, 물 위로 튀어오른다.`:`${a.ch.name}의 ${sk.n}`,{act:{side:me,n:sk.n,k:skKind(sk)},fx:{side:me,k:'charge',c:EC[a.ch.el]},sfx:'cast',lunge:sk.t==='a'&&!(sk.dive&&!pend)?me:null,d:520});
 if(sk.dive&&!pend){a.dive=1;a.pend=idx;say(`${josa(a.ch.name,'은/는')} 물속으로 잠수했다.`,{pop:tx(me,'잠수'),fx:{side:me,k:'up',c:'#6fa0dc'},sfx:'down'});return}
 if(pend)a.dive=0;
 const hostile=sk.t==='a'||sk.t==='w';
 if(hostile&&d.dive>0){say(`${josa(d.ch.name,'은/는')} 물속에 있어 닿지 않는다.`,{pop:tx(you,'MISS'),sfx:'miss'});return}
 /* 공격이 아닌 기술의 명중 */
 if(sk.t!=='a'&&sk.t!=='z'&&sk.acc!==undefined&&Math.random()*100>=sk.acc){say('효과가 없었다.',{pop:tx(hostile?you:me,'실패'),sfx:'miss'});return}
 if(sk.t==='a'){
  if(a.conf&&Math.random()<CONF_SELF){
   const h=hitCalc(a,a,sk,k);a.hp=Math.max(0,a.hp-h.dmg);
   say(`${josa(a.ch.name,'은/는')} 혼란에 빠져 자신을 공격했다. ${h.dmg} 피해`,{pop:{side:me,v:'-'+h.dmg,cls:''},fx:{side:me,k:'slash',c:EC[a.ch.el]},sfx:'hit'});return}
  if(d.evade>0){say(`${josa(d.ch.name,'은/는')} 공격을 피했다.`,{pop:tx(you,'회피'),fx:{side:you,k:'dodge'},sfx:'miss'});return}
  const hits=sk.multi?sk.multi[0]+Math.floor(Math.random()*(sk.multi[1]-sk.multi[0]+1)):1;
  const fog=!!(run&&run.field&&run.field.k==='fog'&&run.field.side===you);
  const area=sk.sc==='범위';let landed=0;
  for(let n=0;n<hits&&d.hp>0;n++){
   const acc=(sk.acc!==undefined?sk.acc:95)-(a.shock?50:0)-(fog?10:0);
   if(Math.random()*100>=acc){say('빗나갔다.',{pop:tx(you,'MISS'),sfx:'miss'});continue}
   landed++;
   const h=hitCalc(a,d,sk,k);
   if(a.love){h.dmg=0;h.crit=false}
   d.hp=Math.max(0,d.hp-h.dmg);
   if(h.dmg===0)say(`${josa(a.ch.name,'은/는')} 싸울 마음이 없다. 피해 0`,{pop:{side:you,v:'0',cls:''},fx:{side:you,k:'slash',c:EC[a.ch.el]},sfx:'hit'});
   else say(`${d.ch.name}에게 ${h.dmg} 피해`+(h.crit?' · 치명타':''),{pop:{side:you,v:'-'+h.dmg,cls:h.crit?'crit':''},fx:{side:you,k:sk.shock?'zap':area?'ring':'slash',c:EC[a.ch.el],big:h.crit},sfx:h.crit?'crit':area?'boom':sk.shock?'zap':'slash',shake:h.crit||area||h.dmg>=d.maxhp*.25});
   if(sk.drain&&a.hp>0&&h.dmg>0){const g=Math.round(h.dmg*.5);a.hp=Math.min(a.maxhp,a.hp+g);say(`${a.ch.name} HP ${g} 흡수`,{pop:{side:me,v:'+'+g,cls:'heal'},fx:{side:me,k:'heal'},sfx:'heal'})}
   if(sk.recoil&&a.hp>0&&h.dmg>0){const r=Math.round(h.dmg*sk.recoil/100);a.hp=Math.max(0,a.hp-r);say(`${a.ch.name} 반동 ${r}`,{pop:{side:me,v:'-'+r,cls:'dot'},sfx:'hit'})}
  }
  if(landed&&d.hp>0&&sk.stun&&d.stun<=0&&(sk.stun>=100||!d.stunImm)&&Math.random()*100<sk.stun){d.stun=1;say(`${josa(d.ch.name,'은/는')} 기절했다.`,{pop:tx(you,'기절'),fx:{side:you,k:'stun'},sfx:'stun'})}
  if(landed&&d.hp>0&&sk.shock&&!d.shock){d.shock=true;d.shockT=0;say(`${josa(d.ch.name,'은/는')} 감전되었다.`,{pop:tx(you,'감전'),sfx:'zap'})}
  if(landed&&d.hp>0&&sk.dot){d.dot={pct:sk.dot,t:3};say(`${josa(d.ch.name,'은/는')} 지속 피해를 입는다.`,{pop:tx(you,'지속'),fx:{side:you,k:'down',c:'#8a6fb8'},sfx:'down'})}
  if(landed&&d.hp>0&&sk.psn&&!d.psn){d.psn=1;say(`${josa(d.ch.name,'은/는')} 중독되었다.`,{pop:tx(you,'중독'),fx:{side:you,k:'down',c:'#7fb06a'},sfx:'down'})}
  if(landed&&d.hp>0&&sk.conf&&!d.conf&&Math.random()*100<sk.conf){d.conf=1;d.confAge=0;say(`${josa(d.ch.name,'은/는')} 혼란에 빠졌다.`,{pop:tx(you,'혼란'),fx:{side:you,k:'down',c:'#d8a85a'},sfx:'down'})}
  if(landed&&d.hp>0&&sk.foeBoost){d.m.atk=Math.max(d.m.atk,sk.foeBoost/100);d.mT=2;say(`${d.ch.name} 공격 상승`,{pop:tx(you,'공격 UP'),fx:{side:you,k:'up',c:EC[a.ch.el]},sfx:'up'})}
  if(sk.selfStun&&a.hp>0&&landed)a.rest=1;
 }else if(sk.t==='h'){
  if(sk.clean){
   const had=cleanse(a);
   say(had?`${a.ch.name}의 이상이 사라졌다.`:'해제할 이상이 없었다.',{pop:tx(me,had?'해제':'변화 없음'),fx:had?{side:me,k:'heal'}:null,sfx:had?'heal':'miss'});
  }
  if(sk.p>0){
   const useMp=sk.rnd&&Math.random()<.5;
   if(useMp){const g=Math.round(a.mpm*sk.p*k/100),b=a.mp;a.mp=Math.min(a.mpm,a.mp+g);
    say(`${a.ch.name} MP ${a.mp-b} 회복`,{pop:{side:me,v:'+'+(a.mp-b)+' MP',cls:'heal'},fx:{side:me,k:'heal'},sfx:'heal'})}
   else{const g=Math.round(a.maxhp*sk.p*k/100),before=a.hp;a.hp=Math.min(a.maxhp,a.hp+g);
    if(!sk.kn){a.d={atk:0,def:0};a.dT=0;a.dot=null}
    say(`${a.ch.name} HP ${a.hp-before} 회복`,{pop:{side:me,v:'+'+(a.hp-before),cls:'heal'},fx:{side:me,k:'heal'},sfx:'heal'})}
  }
 }else if(sk.t==='b'){
  if(sk.weather){
   const W=['clear','rain','snow','thunder','hot','fog'],kk=W[Math.floor(Math.random()*W.length)];
   run.field={k:kk,t:6,side:me,by:a.ch.name};
   say(`${a.ch.name}의 날씨 조종. ${FIELD_TXT[kk]}`,{pop:tx(me,FIELD_NM[kk]),fx:{side:me,k:'up',c:'#9ad0f0'},sfx:'up'});return}
  if(sk.stack){
   a.stk=Math.min(sk.stack,(a.stk||0)+1);a.m.atk=sk.p*k*a.stk/100;
   if(sk.perm)a.stkPerm=true;else a.mT=3;
   say(`${a.ch.name} 공격 상승 (${a.stk}단계)`,{pop:tx(me,'공격 UP x'+a.stk),fx:{side:me,k:'up',c:EC[a.ch.el]},sfx:'up'});return}
  a.m.atk=Math.max(a.m.atk,sk.p*k/100);a.mT=3;say(`${a.ch.name} 공격 상승`,{pop:tx(me,'공격 UP'),fx:{side:me,k:'up',c:EC[a.ch.el]},sfx:'up'})}
 else if(sk.t==='g'){a.m.def=Math.max(a.m.def,sk.p*k/100);a.mT=3;say(`${a.ch.name} 방어 상승`,{pop:tx(me,'방어 UP'),fx:{side:me,k:'up',c:'#6fa0dc'},sfx:'up'})}
 else if(sk.t==='w'){
  if(sk.seal){
   const l=d.last;
   if(l===null||l===undefined||l<0||!d.ch.sk[l]){say('봉인할 기술이 없다.',{pop:tx(you,'실패'),sfx:'miss'});return}
   d.seal=l;d.sealAge=0;
   say(`${d.ch.name}의 ${d.ch.sk[l].n}이(가) 봉인되었다.`,{pop:tx(you,'봉인'),fx:{side:you,k:'down',c:'#ad8fd8'},sfx:'down'});
  }else if(sk.love){
   d.love=1;d.loveAge=0;
   say(`${josa(d.ch.name,'은/는')} 싸울 마음을 잃었다.`,{pop:tx(you,'전의 상실'),fx:{side:you,k:'down',c:'#e68fb0'},sfx:'down'});
  }else{d.d.atk=Math.max(d.d.atk,sk.p*k/100);d.d.def=Math.max(d.d.def,sk.p*k/100);d.dT=3;say(`${d.ch.name} 공방 하락`,{pop:tx(you,'공방 DOWN'),fx:{side:you,k:'down',c:'#ad8fd8'},sfx:'down'})}
 }
 else if(sk.t==='z'){a.evade=2;say(`${josa(a.ch.name,'은/는')} 회피 태세에 들어간다.`,{pop:tx(me,'회피 태세'),fx:{side:me,k:'up',c:'#6fa0dc'},sfx:'up'})}
};

endOfTurn=function(ev){
 const say=(t,pop)=>ev.push({t,s:snap(),pop});
 [run.party[run.active],run.enemy].forEach(f=>{
  if(f.hp>0&&f.dot&&!f.dive){const v=Math.max(1,Math.round(f.maxhp*f.dot.pct/100));f.hp=Math.max(0,f.hp-v);say(`${f.ch.name} 지속 피해 ${v}`,{pop:{side:f.side,v:'-'+v,cls:'dot'},sfx:'hit'});f.dot.t--;if(f.dot.t<=0)f.dot=null}
  if(f.mT>0&&--f.mT<=0)f.m={atk:0,def:0};
  if(f.dT>0&&--f.dT<=0)f.d={atk:0,def:0};
  if(f.evade>0)f.evade--;
  if(f.stunImm>0)f.stunImm--;
  if(f.hp>0&&f.shock){if(f.shockT>=1&&Math.random()<CFG.SHOCK_FREE){f.shock=false;say(`${josa(f.ch.name,'은/는')} 감전에서 풀렸다.`,{pop:{side:f.side,v:'해제',cls:'tx'},sfx:'up'})}f.shockT++}
  if(f.hp>0&&f.seal!==null){f.sealAge++;if(f.sealAge>=2&&Math.random()<RELEASE){const n=f.ch.sk[f.seal]?f.ch.sk[f.seal].n:'기술';f.seal=null;say(`${f.ch.name}의 ${n} 봉인이 풀렸다.`,{pop:{side:f.side,v:'봉인 해제',cls:'tx'},sfx:'up'})}}
  if(f.hp>0&&f.love){f.loveAge++;if(f.loveAge>=2&&Math.random()<RELEASE){f.love=0;say(`${josa(f.ch.name,'은/는')} 정신을 차렸다.`,{pop:{side:f.side,v:'해제',cls:'tx'},sfx:'up'})}}
 })};

aiPick=function(e,p){
 if(e.pend!==null&&e.pend!==undefined)return e.pend;
 const cand=[];
 e.ch.sk.forEach((s,i)=>{
  if(e.mp<mpCost(s,i))return;
  if(e.seal===i)return;
  if(s.t==='b'){
   if(s.weather){if(run.field)return}
   else if(s.stack){if((e.stk||0)>=s.stack&&(s.perm||e.mT>1))return}
   else if(e.m.atk>0)return}
  if(s.t==='g'&&e.m.def>0)return;
  if(s.t==='w'){
   if(s.seal){if(p.last===null||p.last===undefined||p.last<0||p.seal!==null)return}
   else if(s.love){if(p.love)return}
   else if(p.d.atk>0)return}
  if(s.t==='z'&&e.evade>0)return;
  if(s.t==='h'){
   if(s.clean){if(!(e.dot||e.shock||e.d.atk>0||e.seal!==null||e.love))return}
   else if(s.rnd){if(e.hp>e.maxhp*.7&&e.mp>e.mpm*.5)return}
   else if(e.hp>e.maxhp*.7)return}
  if(s.t==='a'&&p.dive)return;
  cand.push(i)});
 if(e.hp<e.maxhp*.4){const h=cand.find(i=>{const s=e.ch.sk[i];return s.t==='h'&&s.p>0});if(h!==undefined&&Math.random()<.75)return h}
 if(cand.length&&Math.random()<.7)return rnd(cand);
 return (e.ch.sk[0]&&e.ch.sk[0].t==='a'&&e.seal!==0)?0:-1};

/* ---------- 메뉴: 봉인 / 잠수 후 반드시 공격 ---------- */
paintMenu=function(){
 const P=run.party[run.active],ph=run.phase,cards=$('cards');
 $('ovl').innerHTML='';cards.innerHTML='';$('sideL').innerHTML='';$('sideR').innerHTML='';
 if(ph==='menu'){
  let opts=[];
  if(P.pend!==null&&P.pend!==undefined)opts=[P.pend];
  else{if(!(P.ch.sk[0]&&P.ch.sk[0].t==='a')||P.seal===0)opts.push(-1);P.ch.sk.forEach((s,i)=>opts.push(i))}
  cards.innerHTML=opts.map(i=>{const s=i<0?BASIC:P.ch.sk[i],l=i<0?1:slv(P,i),forced=i===P.pend&&P.pend!==null&&P.pend!==undefined;
   const off=!forced&&(P.mp<mpCost(s,i)||(i>=0&&P.seal===i));
   return `<button class="sc" ${off?'disabled':''} onclick="act(${i})">${skFace(P.ch,i,s,l,(i>=0&&P.seal===i)?' · 봉인':'',!forced)}</button>`}).join('');
  $('sideL').innerHTML=`<button class="tb" onclick="openParty(false)">교체</button>`;
  $('sideR').innerHTML=`<button class="tb" onclick="quitRun()">철수</button>`}
 else if(ph==='forced')openParty(true)
 else if(ph==='reward'){
  $('ovl').innerHTML=`<div class="ov" style="flex-direction:column;gap:1.6em"><div class="gain">${run.note}</div><div class="rrow">${run.cards.map((k,i)=>`<button class="rw" onclick="pickReward(${i})"><b>${k.t}</b><span>${k.d}</span></button>`).join('')}</div></div>`}
 else if(ph==='over'){
  $('ovl').innerHTML=`<div class="ov" style="flex-direction:column;gap:1em"><div style="font-size:2.4em;font-weight:200;letter-spacing:.2em">${run.won}</div><div>${TG} ${run.gained}</div><button class="tb" style="margin-top:1em" onclick="toTitle()">OK</button></div>`}};
act=function(i){
 if(busy||run.phase!=='menu')return;
 const P=run.party[run.active];
 if(P.pend!==null&&P.pend!==undefined){run.note='';runTurn({type:'skill',i:P.pend});return}
 const sk=i<0?BASIC:P.ch.sk[i];if(P.mp<mpCost(sk,i)||(i>=0&&P.seal===i))return;
 run.note='';runTurn({type:'skill',i})};

/* ---------- 주 오행 색상 ---------- */
const ELC={'木':['#4f86e0','#fff','#4f86e0'],'火':['#d8493e','#fff','#d8493e'],'土':['#e0c040','#1b1608','#e0c040'],'金':['#f2f2f0','#14161c','#f2f2f0'],'水':['#050507','#f2f2f0','#6a6e78']};
const _profHtml=profHtml;
profHtml=function(c){return _profHtml(c).replace(/<span>주 오행<\/span><b>([^<]*)<\/b>/,(m,v)=>{
 const e=['木','火','土','金','水'].find(x=>v.includes(x));if(!e)return m;const q=ELC[e];
 return `<span>주 오행</span><b><i class="elc" style="background:${q[0]};color:${q[1]};border-color:${q[2]}">${v}</i></b>`})};
(function(){const st=document.createElement('style');st.textContent='.elc{font-style:normal;display:inline-block;padding:0 .7em;border:1px solid;border-radius:.2em;line-height:1.5}';document.head.appendChild(st)})();

/* ---------- 파티 꾸리기: 보유 캐릭터만 ---------- */
drawPrep=function(){
 const gs=$('pgrid')?$('pgrid').scrollTop:0;
 const own=CH.filter(c=>S.chars[c.id]);
 const tiles=own.map(c=>{const i=party.indexOf(c.id);
  return `<div class="tile ${i>=0?'in':''} ${cur===c.id?'sel':''}" style="--c:${EC[c.el]}" onmouseenter="hov('${c.id}')" onclick="pick('${c.id}')"><b>${c.name[0]}</b>${imgTag(c)}${i>=0?`<em>${i+1}</em>`:''}</div>`}).join('');
 const slots=[0,1,2].map(i=>{const c=party[i]&&CHM[party[i]];
  return `<div class="slot" onclick="drop(${i})">${c?`${tileHtml(c)}<span>${c.name}</span>`:''}</div>`}).join('');
 show(`<div class="bg dark"></div><div class="tiles" id="pgrid">${tiles}</div><div class="det" id="pdet"></div>
 <div class="bar">${slots}<div class="sp"></div><button class="tb" ${party.length?'':'disabled'} onclick="start()">START</button><button class="tb" onclick="toTitle()">BACK</button></div>`);
 $('pgrid').scrollTop=gs;$('pdet').innerHTML=detHtml(cur,false)};
hov=function(id){cur=id;const d=$('pdet');if(d)d.innerHTML=detHtml(id,false);const own=CH.filter(c=>S.chars[c.id]);document.querySelectorAll('#pgrid .tile').forEach((t,i)=>t.classList.toggle('sel',own[i]&&own[i].id===id))};

/* ---------- 화면 맞춤 (아이패드 크기 조절 · 주소창) ---------- */
(function(){
 const st=document.createElement('style');st.textContent='html,body{height:var(--vh,100%)}body{position:fixed;inset:0 auto auto 0;width:100%;height:var(--vh,100%)}';document.head.appendChild(st);
 function fit(){const v=window.visualViewport,w=v?v.width:innerWidth,h=v?v.height:innerHeight;
  document.documentElement.style.setProperty('--vh',h+'px');
  const g=document.getElementById('game');if(g)g.style.width=Math.floor(Math.min(w,h*16/9))+'px'}
 addEventListener('resize',fit);addEventListener('orientationchange',()=>setTimeout(fit,200));
 if(window.visualViewport)visualViewport.addEventListener('resize',fit);
 fit()})();
