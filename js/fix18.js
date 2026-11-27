/* 18차 수정: CPU 대사 */
const DC={y:'#efcf4a',b:'#6fa0dc',r:'#e0705a',s:'#c4c9d4',g:'#6b707c'};
const DLG={};
[
 ['otori','타마키 오토리','y','음양오행의 신, ','가','와',['내 이름은 타마키 오토리⋯.','너같은 녀석들을 족치러 온 신이다.'],'하씨⋯ 살구나 먹으러 가야겠다.','그깟 ‘영원’ 때문에 세계 질서를 어지럽히지 말란 말이야.'],
 ['merhen','메르헨','b','음양오행의 신, ','이','과',['만나서 반가워요.','오늘 하루는⋯ 안녕하셨나요?'],'앞으로의 나날에 행운이 따르길.','당신은 아직 ‘세상’의 질서에 간섭할 이유가 없어요.'],
 ['amir','아미르','r','음양오행의 신, ','가','와',['하⋯⋯ 시끄러워.','너의 행동에 대한 대가를 치러주지.'],'너에게는 이 ‘세상’을 부탁할 수 있겠어⋯.','이것으로 끝이야.'],
 ['samael','사마엘','s','음양오행의 신, ','이','과',['음~ 아리따운 숙녀님인가? 아니면 그냥 청년?','뭐⋯ 아무래도 상관 없으려나.'],'이봐, 이봐. 이거 내가 봐준 거라고? 나한테 고마워 해!','맛있게 잘 먹었습니다~?'],
 ['anak','아낙','g','음양오행의 신, ','이','과',['⋯⋯.'],'젠장, 또 이 눈깔 때문이야⋯⋯!!','크하하하하하!!'],
 ['jin','진','g','음양오행의 신, ','이','과',['이원향을 지금의 상태까지 방치한 건 내 잘못이야.','그러니⋯⋯ 나의 벌을 치르게 해줘.'],'나의 벗, 정아⋯ 미안해⋯⋯.','신이라는 건⋯ 저주와도 같구나⋯⋯.','r'],
 ['cheonryong','청천룡','b','청룡 가문의 마지막 후손, ','이','과',['너⋯ 누구야?','당장 이 곳에서 나가!'],'형아⋯ 보고 싶어⋯⋯.','이 곳에 올 수 있는 건 오직 우리 형아 뿐이야.'],
 ['hwanhui','주환희','r','주작 가문의 대표, ','가','와',['야호~ 안녕!','음? 잠깐, 잠깐. 이 분위기 뭐야? 우리 대화로 해결하자!'],'으으⋯ 나는 이런 거에는 취약하다고!','헉⋯ 괜찮아?!'],
 ['baekdo','백백도','s','백호 가문의 병사, ','가','와',['천룡 씨를 보좌하고 있는 백백도라고 합니다.','임무 수행 중 방해되는 자는 전부 처리하라는 명을 받았습니다.'],'⋯⋯.','임무를 완료했습니다.'],
 ['ganghyeon','강 현','g','현무 가문의 대표, ','이','과',['이 곳에 발을 들인 이상, 당신은 ‘죄인’입니다.','죄인으로써 당신의 바람을 들어줄 수도, 이 곳에서 내보내드릴 수도 없습니다.'],'⋯⋯ 안 돼, 현아. 조금만 더 힘을 내라고, 젠장!','더 이상 ‘규율’을 어기려고 하지 마십쇼.'],
 ['seungah','강승아','g','현무 가문의 대표, ','가','와',['⋯ 인사는 짧게 하지.'],'⋯ 제법 하는데? 즐거웠어.','다음 번에는 ‘친구’로써 만날 수 있을까⋯.'],
 ['anemone','아네모네','r','이사야족 ','가','와',['메르헨 님을 보좌하고 있는 아네모네라고 합니다~?','‘세상’의 안보를 위해 잠시 멈춰주실 수 있을까요~?'],'소녀의 안보가 더 위험해질 것만 같아요⋯?','많이 아프셨다면, 정말 미안해요~?'],
 ['esquel','에스쿠엘','b','세이가르트 군부대, ','이','와',['세이가르트 군 보급부대 준위, 에스쿠엘이라고 해요.','우리 세이가르트 군은⋯ 당신들을 끔찍히 경계하고 있죠.'],'메르헨 님, 죄송합니다⋯⋯.','이 모든 것은 알레⋯⋯ 하, 메르헨 님을 위하여.'],
 ['taote','타오테','b','사흉, ','가','와',['⋯⋯ 뭘 봐?'],'하⋯ 잠이나 잘래.','시시하긴⋯⋯.'],
 ['honton','혼돈','g','사흉, ','이','과',['재미있는 일이 시작되겠군⋯.'],'⋯ 크크, 유쾌한 청년이구먼.','벌써 끝난 겐가~?']
].forEach(a=>{DLG[a[0]]={nm:a[1],c:a[2],tag:a[3],jp:a[4],wp:a[5],pre:a[6],win:a[7],lose:a[8],wc:a[9]||a[2]}});

(function(){const st=document.createElement('style');st.textContent=`
#dlg{position:absolute;inset:0;z-index:90;cursor:pointer}
#dlg .dbox{position:absolute;left:7%;right:7%;bottom:7%;padding:1.1em 1.4em 1.2em;background:rgba(8,9,12,.92);border:1px solid var(--line)}
#dlg .dn{font-size:.85em;font-weight:500;letter-spacing:.06em;margin-bottom:.55em}
#dlg .dt{line-height:1.75;min-height:1.75em}
#dlg .dh{position:absolute;right:1em;bottom:.8em;width:0;height:0;border-left:.35em solid transparent;border-right:.35em solid transparent;border-top:.5em solid var(--dim);animation:dlgb 1s infinite}
@keyframes dlgb{50%{opacity:.25}}
`;document.head.appendChild(st)})();

function dlgShow(steps,done){
 const old=document.getElementById('dlg');if(old)old.remove();
 const g=document.getElementById('screen');if(!g||!steps.length){done&&done();return}
 const d=document.createElement('div');d.id='dlg';let i=0;
 const paint=()=>{const s=steps[i];d.innerHTML=`<div class="dbox">${s.who?`<div class="dn" style="color:${s.col}">${s.who}</div>`:''}<div class="dt">${s.html}</div><i class="dh"></i></div>`};
 d.addEventListener('click',e=>{e.stopPropagation();if(typeof sfx==='function')sfx('tap');i++;if(i>=steps.length){d.remove();done&&done()}else paint()});
 g.appendChild(d);paint()}
const dlgName=(t,c)=>`<b style="color:${DC[c]};font-weight:600">${t}</b>`;

const _db18=drawBattle;
drawBattle=function(){_db18();
 if(!run||run.phase!=='menu')return;
 const e=run.enemy,D=e&&DLG[e.ch.id];if(!D)return;
 const key=run.wave+':'+e.ch.id;if(run.dlgSeen===key)return;run.dlgSeen=key;
 const steps=D.pre.map(t=>({who:D.nm,col:DC[D.c],html:t}));
 steps.push({html:`${D.tag}${dlgName(D.nm,D.c)}${D.jp} 전투를 위해 찾아왔다!`});
 dlgShow(steps)};
const _wb18=winBattle;
winBattle=function(){const e=run.enemy,had=run.party.some(f=>f.hp>0);_wb18();
 if(had&&e&&DLG[e.ch.id])run.pend={k:'win',id:e.ch.id}};
const _lr18=loseRun;
loseRun=function(){const e=run&&run.enemy;_lr18();
 if(e&&DLG[e.ch.id])run.pend={k:'lose',id:e.ch.id}};
const _pm18=paintMenu;
paintMenu=function(){_pm18();
 if(!run||!run.pend)return;
 const p=run.pend,D=DLG[p.id];
 if(p.k==='win'&&run.phase==='reward'){run.pend=null;
  dlgShow([{who:D.nm,col:DC[D.c],html:D.win},{html:`${dlgName(D.nm,D.wc)}${D.wp}의 전투에서 승리했다!`}])}
 else if(p.k==='lose'&&run.phase==='over'){run.pend=null;
  dlgShow([{who:D.nm,col:DC[D.c],html:D.lose}])}};

/* 정: 뽑기와 CPU에서 제외, 아카이브에만 기록 */
if(GODS.indexOf('jeong')>=0)GODS.splice(GODS.indexOf('jeong'),1);
resolveStar=function(star){
 if(!star){const k=rollMat();S.mats[k]++;return{kind:'mat',k}}
 const ch=rnd(CH.filter(c=>c.star===star&&c.id!=='jeong'));
 if(!S.chars[ch.id]){S.chars[ch.id]=newChar();ensureChar(ch.id);return{kind:'char',ch,tag:'NEW'}}
 const o=S.chars[ch.id];
 if(o.bt<CFG.BT_MAX){o.bt++;return{kind:'char',ch,tag:`BREAKTHROUGH ${o.bt}`,bt:true}}
 const v=CFG.AP_DUP[ch.star]||1;S.ap+=v;return{kind:'char',ch,tag:`살구 ${v}`}};
