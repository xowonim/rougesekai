/* 10차 수정: 신 능력치 보정 · 아이템 말풍선 · 강화 화면 개편 */
PROF.kerma.ht='164cm';

/* ---------- 능력치 보정: 음양오행의 신 > 아지태 > 그 외 ★5 ---------- */
const GOD_X={marchen:1.25,otori:1.25,amir:1.25,samael:1.25,anax:1.25,jin:1.1,jung:1.1,azitae:1.12};
const _calc10=calcStats;
calcStats=function(ch,lv,bt){const s=_calc10(ch,lv,bt),x=GOD_X[ch.id];
 if(!x)return s;return{...s,hp:Math.round(s.hp*x),atk:Math.round(s.atk*x),def:Math.round(s.def*x)}};

/* ---------- 말풍선: 수련의 서 · 오행의 기운 ---------- */
const BKTXT={
 l:['타마키 신사 어딘가에 보관되어 있는 서적.<br>이 서적을 통해 캐릭터는 더욱 강해질 수 있다.','이 세상에는 각자의 위치라는 게 있어.','그러니까 그 경계를 함부로 침범하려고 하지마.'],
 s:['\'오덕\'이 형상화되어 있는 기운.<br>이 기운을 통해 캐릭터는 자신의 오덕을 단련할 수 있다.','근원을 잊어버린 자는 껍질만 남은 것과 같아.','너의 중심에는 무엇이 남아있지?']};
const BKN={s:0,m:1,l:2};
(function(){const st=document.createElement('style');st.textContent=`
.bkb{position:absolute;z-index:20;width:22em;max-width:80%;background:var(--pan);border:1px solid var(--fg);padding:.8em 1em;font-size:.8em;line-height:1.6;transform:translate(-50%,-100%);pointer-events:none}
.bkb b{display:block;margin-bottom:.4em}
.bkb p{margin:.35em 0 0}
.bkb.dn:after{bottom:auto;top:-.45em;transform:translateX(-50%) rotate(225deg)}
.bkb:after{content:'';position:absolute;left:var(--tx,50%);bottom:-.45em;width:.8em;height:.8em;background:var(--pan);border:solid var(--fg);border-width:0 1px 1px 0;transform:translateX(-50%) rotate(45deg)}
[data-bk]{cursor:pointer}
.enhbox{background:var(--pan);border:1px solid var(--line);padding:1.2em 1.6em;min-width:26em;display:flex;flex-direction:column;gap:.9em}
.enhbox .eh{display:flex;justify-content:space-between;align-items:baseline;gap:2em}
.enhbox .eh b{font-size:1.15em}
.enhbox .ep{font-size:1.4em;font-weight:300;text-align:center;letter-spacing:.05em}
.enhbox .ep i{color:var(--dim);font-style:normal;margin:0 .5em}
.enhbox .xpb{margin:0}
.enhbox .er{display:grid;grid-template-columns:2.6em 1fr auto auto auto;gap:.8em;align-items:center}
.enhbox .er .own{color:var(--dim);font-size:.8em}
.enhbox .er .qn{min-width:2.2em;text-align:center}
.enhbox .ef{display:flex;justify-content:flex-end;gap:.6em}
.enh{margin-left:auto}
`;document.head.appendChild(st)})();
function closeBk(){const o=document.getElementById('bkb');if(o)o.remove()}
function showBk(el){closeBk();const k=el.dataset.bk,sc=document.getElementById('screen');if(!sc)return;
 const t=BKTXT[k[0]],n=BKN[k[1]],r=el.getBoundingClientRect(),s=sc.getBoundingClientRect();
 const d=document.createElement('div');d.id='bkb';d.className='bkb';
 d.innerHTML=`<b>${BOOK[k].n}</b>`+t.slice(0,n+1).map(x=>`<p>${x}</p>`).join('');
 sc.appendChild(d);
 const cx=r.left+r.width/2-s.left,w=d.offsetWidth,L=Math.max(w/2+8,Math.min(s.width-w/2-8,cx));
 d.style.left=L+'px';d.style.top=(r.top-s.top-8)+'px';d.style.setProperty('--tx',(cx-L+w/2)+'px');
 /* 화면 위쪽으로 넘치면 아래에 표시 */
 if(d.getBoundingClientRect().top<s.top){d.style.top=(r.bottom-s.top+10)+'px';d.style.transform='translate(-50%,0)';d.classList.add('dn')}}
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-bk]');if(t){showBk(t);e.stopPropagation()}else closeBk()},true);
function tagBk(){let n=0;['ls','lm','ll','ss','sm','sl'].forEach((k,i)=>{const e=document.querySelectorAll('.mats .bk')[i];if(e)e.dataset.bk=k})}

/* ---------- 강화 화면 ---------- */
const ENHK={char:['ls','lm','ll'],sk:['ss','sm','sl']};
let ENH=null;
const _det10=detHtml;
detHtml=function(id,train){let h=_det10(id,train);
 if(!train||!S.chars[id]||arcTab!=='info')return h;
 h=h.replace(/<div class="row">(?:(?!<\/div>).)*useBook(?:(?!<\/div>).)*<\/div>/s,'');
 h=h.replace('</div></div></div>',`</div></div><button class="mini enh" onclick="openEnh('char',0)">강화</button></div>`);
 h=h.replace(/<div class="bt">(?:(?!<\/div>).)*?useSk\('[^']+',(\d+),'ss'\)(?:(?!<\/div>).)*?<\/div>/gs,(m,i)=>`<div class="bt"><button class="mini" onclick="openEnh('sk',${i})">강화</button></div>`);
 return h};
function enhState(){const o=S.chars[cur];let lv,ex,mx,need,x=0;
 const ks=ENHK[ENH.kind];ks.forEach(k=>x+=BOOK[k].x*ENH.n[k]);
 if(ENH.kind==='char'){lv=o.lv;ex=o.exp;mx=CFG.LV_MAX;need=expNeed}else{const s=o.sk[ENH.i];lv=s.lv;ex=s.exp;mx=CFG.SK_MAX;need=skNeed}
 const l0=lv;ex+=x;while(lv<mx&&ex>=need(lv)){ex-=need(lv);lv++}
 if(lv>=mx)ex=0;
 return{l0,lv,mx,pct:lv>=mx?100:Math.round(ex/need(lv)*100),full:l0>=mx}}
function openEnh(kind,i){ENH={kind,i,n:{ls:0,lm:0,ll:0,ss:0,sm:0,sl:0}};drawEnh()}
function closeEnh(){ENH=null;const e=document.getElementById('enh');if(e)e.remove()}
function enhAdj(k,d){if(!ENH)return;const n=ENH.n[k]+d;if(n<0||n>S.mats[k])return;
 if(d>0&&enhState().lv>=enhState().mx)return;ENH.n[k]=n;drawEnh()}
function enhMax(){if(!ENH)return;const ks=ENHK[ENH.kind];
 for(const k of ['ll','lm','ls','sl','sm','ss']){if(!ks.includes(k))continue;
  while(ENH.n[k]<S.mats[k]&&enhState().lv<enhState().mx)ENH.n[k]++}
 /* 마지막 한 장 초과분 되돌리기 */
 [...ks].sort((a,b)=>BOOK[a].x-BOOK[b].x).forEach(k=>{while(ENH.n[k]>0){ENH.n[k]--;if(enhState().lv<enhState().mx){ENH.n[k]++;break}}});
 drawEnh()}
function enhGo(){if(!ENH)return;const o=S.chars[cur],ks=ENHK[ENH.kind];let x=0;
 ks.forEach(k=>{const n=Math.min(ENH.n[k],S.mats[k]);S.mats[k]-=n;x+=BOOK[k].x*n});
 if(x<=0)return;
 if(ENH.kind==='char')addExp(cur,x);else addSkExp(cur,ENH.i,x);
 save();closeEnh();drawArc()}
function drawEnh(){const sc=document.getElementById('screen');if(!sc||!ENH)return;
 let e=document.getElementById('enh');if(!e){e=document.createElement('div');e.id='enh';e.className='ov';e.onclick=closeEnh;sc.appendChild(e)}
 const c=CHM[cur],ks=ENHK[ENH.kind],st=enhState(),tot=ks.reduce((a,k)=>a+ENH.n[k],0);
 const nm=ENH.kind==='char'?c.name:c.sk[ENH.i].n;
 e.innerHTML=`<div class="enhbox" onclick="event.stopPropagation()">
 <div class="eh"><b>${nm}</b><span>${ENH.kind==='char'?'':c.name}</span></div>
 <div class="ep">Lv.${st.l0}<i>→</i>Lv.${st.lv}${st.lv>=st.mx?' MAX':''}</div>
 <div class="xpb"><i style="width:${st.pct}%"></i></div>
 ${ks.map(k=>`<div class="er"><span>${bookIcon(k)}</span><span class="own">+${BOOK[k].x} · ${S.mats[k]}</span>
  <button class="mini" ${ENH.n[k]>0?'':'disabled'} onclick="enhAdj('${k}',-1)">-</button><span class="qn">${ENH.n[k]}</span>
  <button class="mini" ${ENH.n[k]<S.mats[k]&&st.lv<st.mx?'':'disabled'} onclick="enhAdj('${k}',1)">+</button></div>`).join('')}
 <div class="ef"><button class="mini" onclick="enhMax()">MAX</button><button class="mini" ${tot>0?'':'disabled'} onclick="enhGo()">강화</button></div></div>`;
 e.querySelectorAll('.bk').forEach((b,i)=>b.dataset.bk=ks[i])}

const _arc10=drawArc;
drawArc=function(){closeBk();_arc10();tagBk()};
const _arcPick10=arcPick;
arcPick=function(id){closeEnh();_arcPick10(id)};

/* ---------- 전투 경험치: 싸운 캐릭터 100%, 대기 파티원 40% ---------- */
winBattle=function(){
 if(!run.party.some(f=>f.hp>0)){run.note='';loseRun();return}
 const w=run.wave,boss=run.enemy.boss;
 const coin=12+3*w+(boss?80+2*w:0),xp=12+3*w;
 S.coin+=coin;run.gained+=coin;run.won=w;
 run.party.forEach((f,i)=>{
  if(f.hp>0)f.mp=Math.min(f.mpm,f.mp+MP_WIN);
  if(S.chars[f.ch.id])addExp(f.ch.id,i===run.active?xp:Math.round(xp*.4))});
 if(S.best<w)S.best=w;
 save();
 run.note=`${TG} ${coin}  EXP ${xp}`;
 run.phase='reward';run.cards=rewardCards()};
