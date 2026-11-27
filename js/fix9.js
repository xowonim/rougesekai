/* 9차 수정: 클로린스 · 아지태 · 케르마 · 호루스 스킬, 프로필, 중독 · 혼란 · 날씨 · 연속 공격 */

/* ---------- 스킬 ---------- */
CHM.clorins.sk=[
 A('약물 투여','연구소에서 만든 약물을 투여한다.',30,{acc:95,psn:1}),
 B('실험 연구','실험 결과를 공유해 공격력을 끌어올린다.',25,{acc:100,stack:2,kn:'타인 변화'}),
 A('가설 증명','가설을 증명하려 범위째 휩쓴다.',30,{acc:80,sc:'범위',conf:100})];
CHM.azitae.sk=[
 A('여의주','여의주를 자유자재의 무기로 만든다.',70,{acc:80}),
 B('날씨 조종','날씨를 조종한다. 5턴 동안 이어진다.',0,{acc:55,weather:1,kn:'자기 변화'}),
 A('소환주','눈동자가 달린 소환주를 소환해 공격한다.',120,{acc:100,sc:'범위'})];
CHM.kerma.sk=[
 A('차크람','차크람으로 전투에 임한다.',45,{acc:95}),
 A('누르','빛을 무기화해 쏜다.',90,{acc:100,mp:20}),
 A('틴들','능력치를 극단적으로 끌어올려 행동하지 못하게 한다.',120,{acc:100,stun:100,foeBoost:60})];
CHM.horus={id:'horus',name:'호루스',el:'火',star:5,race:'동물',role:'a',sk:[
 A('창','창으로 꿰뚫는다.',55,{acc:100}),
 B('케프리','운명의 해를 떠올려 공격력을 끌어올린다. 해제되지 않는다.',15,{acc:100,stack:3,perm:1,kn:'자기 변화'}),
 A('아툼','운명의 끝을 불러 여러 번 몰아친다.',15,{acc:75,sc:'범위',multi:[2,5],kn:'범위 연속 공격'})]};

/* ---------- 프로필 ---------- */
Object.assign(PROF,{
 haekyung:{full:'해경',rom:'Haegyung / 海卿',aff:'아람길',sex:'남성',age:'29세',ht:'177cm',race:'인간',el:'水',abil:'기억을 다루는 능력',
  intro:'홍련과 함께 제비다방을 운영 중인 의문의 청년. 피곤해 보이는 인상 때문에 차가워 보이지만, 온정이 많고 사리가 어두운 편. 왠지 숨기고 있는 것이 있어 보인다⋯.'},
 hongryeon:{full:'홍련',rom:'Scarlet / 紅蓮',aff:'아람길',sex:'여성',age:'외관상 22세',ht:'160cm',race:'인간?',el:'木',abil:'—',
  intro:'아람길에서 커피와 차를 파는 제비다방의 직원. 자신의 과거에 대해 아무 것도 기억하지 못한 채 해경과 함께 지내고 있다. 겁과 눈물이 많은 편이지만, 세계를 위해서라면 용기를 낼 줄 아는 소녀.'},
 clorins:{full:'클로린스 클라크',rom:'Clark Clorince',aff:'리벤 카르마',sex:'여성',age:'23세',ht:'156cm',race:'인간',el:'木',abil:'—',
  intro:'클라크 연구소의 연구원이었지만, 친오빠 첼린으로부터 소장의 권한을 모두 물려받게 되어 실질적인 연구소 운영 담당을 맡게 되었다. 세이가르트 제국에게 적대적인 마음을 품고 있지만, 첼린을 위해 이를 드러내진 않는다.'},
 bif:{full:'비프',rom:'Bif',aff:'시오야 영지',sex:'여성',age:'48세',ht:'168cm',race:'시오야족',el:'水',abil:'—',
  intro:'시오야 영지의 영주로, 세이가르트 제국을 처단하기 위해 프라니아 제국과 협력하고 있다. 시오야족과 그들이 모시는 신을 위해서라면 어떠한 행동도 마다하지 않는다.'},
 azitae:{full:'아지태',rom:'Ajitae / 阿志泰',aff:'보르네로',sex:'남성',age:'2970세',ht:'195cm',race:'원향족',el:'木',abil:'청룡의 힘을 다루는 능력',
  intro:'세이가르트 군대를 이끄는 대장으로, 원향족의 청룡 가문과 흡사한 외형을 지니고 있다. 그는 사실 천룡의 친형이자, 청룡가문의 대표, 청천월이다. 어떠한 이유에서인지 현재는 반대세력과 함께 행동하고 있다.'},
 kerma:{full:'케르마',rom:'κέρμα / 銅錢',aff:'덴드론고니아',sex:'여성',age:'약 43만세',ht:'',race:'아르케족',el:'+',abil:'빛을 다루는 능력',
  intro:"덴드론고니아의 여제. 파르티으세어 차별당하던 일부 아르케족을 데리고 '우주'로 넘어와 '수의 신' 아낙의 보호 아래서 '규율'과 대적하고 있다. 짜증이 많지만 과일을 먹으면 금방 풀리기에, 샤갈이 케르마에게 자주 살구를 선물하고 있다."},
 horus:{full:'호루스',rom:'Ὧρος / 荷魯斯',aff:'바드르 제단',sex:'남성',age:'외관상 35세',ht:'201cm',race:'동물 (매)',el:'火',abil:'운명을 다루는 능력',intro:''}});

/* 주 오행: 수는 어두운 회색 글씨(테두리 없음), 양(+)은 노랑 */
const _prof9=profHtml;
profHtml=function(c){return _prof9(c)
 .replace(/color:#000000;-webkit-text-stroke:[^"]*/,'color:#6b707c')
 .replace(/(<span>주 오행<\/span>)<b>\+<\/b>/,'$1<b style="color:#efcf4a">+</b>')};

/* ---------- 아지태는 '세상'에서 적으로 나오지 않는다 ---------- */
const NOENEMY=['azitae'];
pickEnemy=function(R){
 const e=wpick(R.spawn);
 if(e.ids)return CHM[rnd(e.ids)];
 const grp=rnd(e.race);return rnd(CH.filter(c=>c.race===grp&&!NOENEMY.includes(c.id)))};

/* ---------- 상태이상 아이콘: 중독 · 혼란 ---------- */
Object.assign(SVGP,{
 psn:'<path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z"/><path d="M9.5 14.5h5"/>',
 conf:'<path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0M12 12a3 3 0 1 1 3 3 6 6 0 1 1-6-6"/>'});
stIc=f=>[f.stun>0&&'stun',f.shock&&'shock',f.evade>0&&'evade',f.dive&&'dive',(f.seal!==null&&f.seal!==undefined)&&'seal',f.love&&'love',f.conf&&'conf',f.psn&&'psn',f.dot&&'dot',(f.d&&(f.d.atk>0||f.d.def>0))&&'debuff'].filter(Boolean).map(k=>`<span>${svg(k)}</span>`).join('');

/* ---------- 날씨 · 중독 · 혼란 · 중첩 ---------- */
const _st9=st;
st=function(f,k){let v=_st9(f,k);
 if(k==='atk'&&run&&run.field){if(run.field.k==='rain')v*=.9;else if(run.field.k==='hot')v*=1.3}
 return v};
const FLD_NM={clear:'청명',rain:'비',snow:'눈',thunder:'낙뢰',hot:'무더위',fog:'안개'};
const _eot9=endOfTurn;
endOfTurn=function(ev){_eot9(ev);
 const say=(t,o)=>ev.push({t,s:snap(),...o});
 const P=run.party[run.active],E=run.enemy;
 [P,E].forEach(f=>{
  if(f.hp>1&&f.psn&&!f.dive){const v=Math.max(1,Math.round(f.maxhp*.05)),d=Math.min(v,f.hp-1);f.hp-=d;
   say(`${f.ch.name} 중독 ${d}`,{pop:{side:f.side,v:'-'+d,cls:'dot'},sfx:'hit'})}
  if(f.hp>0&&f.conf){f.confAge++;if(f.confAge>=2&&Math.random()<CONF_RELEASE){f.conf=0;
   say(`${josa(f.ch.name,'은/는')} 혼란에서 벗어났다.`,{pop:{side:f.side,v:'해제',cls:'tx'},sfx:'up'})}}
  if(f.stk&&!f.stkPerm&&!(f.mT>0))f.stk=0});
 const F=run.field;if(!F)return;
 if(F.k==='snow')[P,E].forEach(f=>{if(f.hp>1&&!f.dive){const d=Math.min(Math.max(1,Math.round(f.maxhp*.03)),f.hp-1);f.hp-=d;
  say(`${f.ch.name} 눈보라 ${d}`,{pop:{side:f.side,v:'-'+d,cls:'dot'},sfx:'hit'})}});
 if(F.k==='thunder'&&Math.random()<.5){
  const o=F.side==='p'?P:E,t=F.side==='p'?E:P;
  if(o.hp>0&&t.hp>0&&!t.dive){const h=hitCalc(o,t,{p:40},1);t.hp=Math.max(0,t.hp-h.dmg);
   say(`낙뢰가 ${t.ch.name}에게 떨어졌다. ${h.dmg} 피해`,{pop:{side:t.side,v:'-'+h.dmg,cls:''},fx:{side:t.side,k:'zap',c:'#f2d04a'},sfx:'zap',shake:true})}}
 if(--F.t<=0){run.field=null;say('날씨가 원래대로 돌아왔다.',{pop:{side:'p',v:'날씨 해제',cls:'tx'},sfx:'up'})}};

const _nb9=nextBattle;
nextBattle=function(){run.field=null;_nb9()};

/* 날씨 표시 */
(function(){const st=document.createElement('style');st.textContent='#fld{position:absolute;top:12%;left:50%;transform:translateX(-50%);font-size:.75em;letter-spacing:.12em;color:var(--dim);border:1px solid var(--line);background:var(--pan);padding:.25em .9em;z-index:5;pointer-events:none}';document.head.appendChild(st)})();
const _pm9=paintMenu;
paintMenu=function(){_pm9();
 const old=document.getElementById('fld');if(old)old.remove();
 if(run&&run.field&&run.phase!=='over'){const g=document.getElementById('game'),d=document.createElement('div');d.id='fld';d.textContent=`${FLD_NM[run.field.k]} · ${run.field.t}`;g.appendChild(d)}};
