/* 14차 수정: 상태이상 지속 이펙트 (전투 이미지) + 상태 아이콘 전체 표시 */
const _snap14=snap;
snap=function(){const s=_snap14();
 const add=(o,x)=>Object.assign(o.st,{psn:!!x.psn,conf:!!x.conf,dot:!!x.dot,seal:x.seal!==null&&x.seal!==undefined,love:!!x.love,
  dbf:!!((x.d&&(x.d.atk>0||x.d.def>0))||x.dbStk),spd:x.spdStk>0});
 add(s.p,run.party[run.active]);add(s.e,run.enemy);return s};
const FXKEYS=['psn','conf','stun','shock','love'];
const ICKEYS=['psn','conf','stun','shock','seal','love','dot','dbf','spd','ev'];
const STICON={stun:'stun',shock:'shock',ev:'evade',psn:'psn',conf:'conf',dot:'dot',seal:'seal',love:'love',dbf:'debuff',spd:'buff'};
const stHtml14=s=>ICKEYS.filter(k=>s[k]).map(k=>`<span>${svg(STICON[k])}</span>`).join('');
(function(){const st=document.createElement('style');st.textContent=`
.pf .fxs{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.pf .fxs i{position:absolute;top:0;left:0;right:0;bottom:0;display:block}
.sx-psn{background:radial-gradient(circle,rgba(173,143,216,.9) 0 2px,transparent 3px) 0 0/26px 34px,radial-gradient(circle,rgba(200,170,240,.7) 0 3px,transparent 4px) 13px 17px/34px 44px;
 animation:sxpsn 1.6s linear infinite;-webkit-mask-image:linear-gradient(to top,#000 55%,transparent);mask-image:linear-gradient(to top,#000 55%,transparent)}
@keyframes sxpsn{to{background-position:0 -34px,13px -27px}}
.pf .fxs .sx-conf{bottom:auto;left:32%;right:32%;top:4%;height:auto;aspect-ratio:1;border:2px solid #f2d04a;border-top-color:transparent;border-radius:50%;animation:sxspin 1.1s linear infinite}
.pf .fxs .sx-stun{bottom:auto;left:34%;right:34%;top:5%;height:auto;aspect-ratio:1;border:3px dotted #d9dce3;border-radius:50%;animation:sxspin 1s linear infinite}
@keyframes sxspin{to{transform:rotate(360deg)}}
.sx-shock{background:linear-gradient(105deg,transparent 40%,rgba(242,208,74,.55) 48%,transparent 56%);animation:sxshk .5s steps(3) infinite}
@keyframes sxshk{0%{opacity:0;transform:translateX(-30%)}40%{opacity:1}100%{opacity:0;transform:translateX(30%)}}
.sx-love{background:radial-gradient(ellipse at 50% 60%,rgba(230,143,176,.5),transparent 70%);animation:sxpulse 1.6s ease-in-out infinite}
@keyframes sxpulse{50%{opacity:.35}}
.pf.s-psn img,.pf.s-psn b{filter:sepia(.4) hue-rotate(200deg) saturate(1.5)}
.pf.s-shock{animation:sxjit .18s steps(2) infinite}
@keyframes sxjit{50%{transform:translate(1px,-1px)}}
.pf.s-love img,.pf.s-love b{filter:sepia(.5) hue-rotate(290deg) saturate(1.5)}
.pf.s-stun img,.pf.s-stun b{filter:brightness(.85)}
`;document.head.appendChild(st)})();
function paintFx(id,s,ko){
 const pf=$(id);if(!pf)return;
 FXKEYS.forEach(k=>pf.classList.toggle('s-'+k,!ko&&!!s[k]));
 let box=pf.querySelector('.fxs');
 if(!box){box=document.createElement('div');box.className='fxs';pf.appendChild(box)}
 const want=ko?'':FXKEYS.filter(k=>s[k]).join(',');
 if(box.dataset.k!==want){box.dataset.k=want;box.innerHTML=want?want.split(',').map(k=>`<i class="sx-${k}"></i>`).join(''):''}}
const _pi14=paintInfo;
paintInfo=function(s,fl,popv){_pi14(s,fl,popv);
 $('eSt').innerHTML=stHtml14(s.e.st||{});$('pSt').innerHTML=stHtml14(s.p.st||{});
 paintFx('pPF',s.p.st||{},s.p.hp<=0);paintFx('ePF',s.e.st||{},s.e.hp<=0)};

/* 공방 · 공격 · 방어 표기를 공격력 · 방어력으로 */
const NORM=[[/공방 하락/g,'공격력 방어력 하락'],[/공방 DOWN/g,'공격력 방어력 DOWN'],[/공격 상승/g,'공격력 상승'],[/방어 상승/g,'방어력 상승'],[/공격 UP/g,'공격력 UP'],[/방어 UP/g,'방어력 UP'],[/공격 DOWN/g,'공격력 DOWN'],[/공격 저하/g,'공격력 저하']];
const nz=t=>typeof t==='string'?NORM.reduce((x,[r,v])=>x.replace(r,v),t):t;
const _perf14=perform;
perform=function(a,d,i,ev){const n=ev.length;_perf14(a,d,i,ev);
 for(let j=n;j<ev.length;j++){const e=ev[j];e.t=nz(e.t);if(e.pop&&e.pop.v)e.pop.v=nz(e.pop.v)}};
