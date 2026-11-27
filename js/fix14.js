/* 14차 수정: 상태이상 지속 이펙트 (전투 이미지) + 상태 아이콘 전체 표시 */
const _snap14=snap;
snap=function(){const s=_snap14();
 const add=(o,x)=>Object.assign(o.st,{psn:!!x.psn,conf:!!x.conf,dot:!!x.dot,seal:x.seal!==null&&x.seal!==undefined,love:!!x.love,
  dbf:!!((x.d&&(x.d.atk>0||x.d.def>0))||x.dbStk),spd:x.spdStk>0});
 add(s.p,run.party[run.active]);add(s.e,run.enemy);return s};
const FXKEYS=['psn','conf','stun','shock','seal','love','dot','dbf','spd','ev'];
const STICON={stun:'stun',shock:'shock',ev:'evade',psn:'psn',conf:'conf',dot:'dot',seal:'seal',love:'love',dbf:'debuff',spd:'buff'};
const stHtml14=s=>FXKEYS.filter(k=>s[k]).map(k=>`<span>${svg(STICON[k])}</span>`).join('');
(function(){const st=document.createElement('style');st.textContent=`
.pf .fxs{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.pf .fxs i{position:absolute;top:0;left:0;right:0;bottom:0;display:block}
.sx-psn{background:radial-gradient(circle,rgba(127,176,106,.9) 0 2px,transparent 3px) 0 0/26px 34px,radial-gradient(circle,rgba(160,210,130,.7) 0 3px,transparent 4px) 13px 17px/34px 44px;
 animation:sxpsn 1.6s linear infinite;-webkit-mask-image:linear-gradient(to top,#000 55%,transparent);mask-image:linear-gradient(to top,#000 55%,transparent)}
@keyframes sxpsn{to{background-position:0 -34px,13px -27px}}
.pf .fxs .sx-conf{bottom:auto;left:18%;right:18%;top:2%;height:16%;border:2px dashed #d8a85a;border-radius:50%;animation:sxspin 1.4s linear infinite}
.pf .fxs .sx-stun{bottom:auto;left:22%;right:22%;top:3%;height:14%;border:3px dotted #f2d04a;border-radius:50%;animation:sxspin 1s linear infinite}
@keyframes sxspin{to{transform:rotate(360deg)}}
.sx-shock{background:linear-gradient(105deg,transparent 40%,rgba(242,208,74,.55) 48%,transparent 56%);animation:sxshk .5s steps(3) infinite}
@keyframes sxshk{0%{opacity:0;transform:translateX(-30%)}40%{opacity:1}100%{opacity:0;transform:translateX(30%)}}
.sx-seal{background:repeating-linear-gradient(45deg,rgba(173,143,216,.0) 0 9px,rgba(173,143,216,.55) 9px 11px);box-shadow:inset 0 0 1.2em rgba(173,143,216,.7)}
.sx-love{background:radial-gradient(ellipse at 50% 60%,rgba(230,143,176,.5),transparent 70%);animation:sxpulse 1.6s ease-in-out infinite}
@keyframes sxpulse{50%{opacity:.35}}
.sx-dot{background:linear-gradient(to bottom,rgba(138,111,184,.65),transparent 55%);animation:sxpulse 1.2s ease-in-out infinite}
.sx-dbf{background:repeating-linear-gradient(to bottom,transparent 0 14px,rgba(173,143,216,.28) 14px 16px);animation:sxdown 1.2s linear infinite}
@keyframes sxdown{to{background-position:0 16px}}
.sx-spd{background:linear-gradient(to right,rgba(154,208,240,.28),transparent 40%)}
.sx-ev{background:linear-gradient(to left,rgba(111,160,220,.22),transparent 45%)}
.pf.s-psn img,.pf.s-psn b{filter:sepia(.5) hue-rotate(60deg) saturate(1.6)}
.pf.s-conf img,.pf.s-conf b{animation:sxwob 1.3s ease-in-out infinite}
@keyframes sxwob{0%,100%{transform:rotate(-3deg) translateX(-2%)}50%{transform:rotate(3deg) translateX(2%)}}
.pf.s-shock{animation:sxjit .18s steps(2) infinite}
@keyframes sxjit{50%{transform:translate(1px,-1px)}}
.pf.s-seal img,.pf.s-seal b{filter:grayscale(.6) brightness(.85)}
.pf.s-love img,.pf.s-love b{filter:sepia(.5) hue-rotate(290deg) saturate(1.5)}
.pf.s-dbf img,.pf.s-dbf b{filter:grayscale(.55) brightness(.9)}
.pf.s-spd img,.pf.s-spd b,.pf.s-ev img,.pf.s-ev b{filter:drop-shadow(-.35em 0 0 rgba(154,208,240,.35)) drop-shadow(-.7em 0 0 rgba(154,208,240,.16))}
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
