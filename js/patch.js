/* 3차 수정: 아이콘 · 프로필 · 돌파 탭 이름 */
const BKB2='<rect x="8" y="4" width="16" height="24" rx="1.2" fill="#14161c" stroke="#f0e2ae" stroke-width="1.1"/><path d="M11.2 4.6v22.8" stroke="#f0e2ae" stroke-opacity=".6" stroke-width=".8" stroke-dasharray="1.6 2"/><rect x="14.2" y="8" width="7" height="12" fill="none" stroke="#f0e2ae" stroke-opacity=".8" stroke-width=".8"/><text x="17.7" y="16.6" text-anchor="middle" font-size="6.6" fill="#f0e2ae" font-family="\'Noto Serif CJK KR\',\'Noto Serif KR\',\'Noto Serif CJK JP\',serif">修</text>';
function bkSvg(k){const n={s:1,m:2,l:3}[k[1]]||1;let g='';
 if(k[0]==='l'){const T=n===1?[[0,0,0,1]]:n===2?[[-3.5,1.5,-9,.96],[3,0,4,.96]]:[[-6,2,-14,.9],[6,1,11,.9],[0,-1,0,.94]];
  g=T.map(t=>`<g transform="translate(${t[0]} ${t[1]}) rotate(${t[2]} 16 16) translate(16 16) scale(${t[3]}) translate(-16 -16)">${BKB2}</g>`).join('')}
 else{g=`<circle cx="16" cy="16" r="10.5" fill="#14161c" stroke="#f0e2ae" stroke-width="1.1"/><text x="16" y="21.2" text-anchor="middle" font-size="14" fill="#f0e2ae" font-family="'Noto Serif CJK KR','Noto Serif KR','Noto Serif CJK JP',serif">氣</text>`;
  if(n>=2)g+=`<circle cx="16" cy="16" r="14" fill="none" stroke="#f0e2ae" stroke-opacity=".55" stroke-width=".8"/>`;
  if(n>=3)g+=ELK.map((e,i)=>{const a=(-90+72*i)*Math.PI/180;return `<circle cx="${(16+14*Math.cos(a)).toFixed(2)}" cy="${(16+14*Math.sin(a)).toFixed(2)}" r="1.7" style="fill:var(--${e})" stroke="#0c0d11" stroke-width=".5"/>`}).join('')}
 return `<svg class="si" viewBox="0 0 32 32">${g}</svg>`}
function profHtml(c){const p=PROF[c.id]||{};
 const v=(k,d)=>p[k]||d;
 const cell=(a,b,w)=>b?`<div${w?' class="w"':''}><span>${a}</span><b>${b}</b></div>`:'';
 const grid=cell('소속',v('aff'))+cell('성별',v('sex'))+cell('나이',v('age'))+cell('신체',v('ht'))+cell('종족',v('race',c.race))+cell('주 오행',v('el',c.el))+cell('능력',v('abil'),1);
 const intro=p.intro||LORE[c.id];
 const paras=intro?intro.split(/(?<=[.!?])\s+/).filter(Boolean).map(t=>`<p style="margin:0">${t}</p>`).join(''):'';
 return `<div class="pg">${grid}</div>${paras?`<div class="intro">${paras}</div>`:''}`}
const _detHtml=detHtml;
detHtml=function(id,train){let h=_detHtml(id,train).replace('>BREAKTHROUGH</button>','>VIRTUE</button>');
 const p=PROF[id];if(train&&p&&p.rom){const n=CHM[id].name;h=h.replace(`<div class="nm">${n}</div>`,`<div class="nm">${n}<span class="rom2">${p.rom}</span></div>`)}return h};
const _resolveStar=resolveStar;
resolveStar=function(star){const r=_resolveStar(star);if(r.bt){r.tag=r.tag.replace('BREAKTHROUGH','VIRTUE');r.bt=false}return r};

(function(){const st=document.createElement('style');st.textContent='.rom2{color:var(--dim);font-size:.58em;font-weight:400;margin-left:.9em;letter-spacing:.02em}.ic:has(path[d^="M50 4A46"]){transform:rotate(-90deg) scaleX(-1)}';document.head.appendChild(st)})();

/* 게임 내 강화는 이번 플레이에서만: 전투 승리 경험치와 수련 카드를 제거 */
winBattle=function(){
 if(!run.party.some(f=>f.hp>0)){run.note='';loseRun();return}
 const w=run.wave,boss=run.enemy.boss;
 const coin=12+3*w+(boss?80+2*w:0);
 S.coin+=coin;run.gained+=coin;run.won=w;
 run.party.forEach(f=>{if(f.hp>0)f.mp=Math.min(f.mpm,f.mp+MP_WIN)});
 if(S.best<w)S.best=w;
 save();
 run.note=`${TG} ${coin}`;
 run.phase='reward';run.cards=rewardCards()};
const _rewardCards=rewardCards;
rewardCards=function(){for(let i=0;i<20;i++){const c=_rewardCards();if(!c.some(x=>x.k==='exp'))return c}return _rewardCards().filter(x=>x.k!=='exp')};

/* ---- 새 이펙트: 먹선처럼 가는 선만 사용 ---- */
const FX2=(()=>{
 let cv=null,c=null,W=0,H=0,dp=1,L=[],raf=0,lt=0;const cc={};
 const R=(a,b)=>a+Math.random()*(b-a),TAU=Math.PI*2;
 function rgb(col){if(cc[col])return cc[col];let s=col||'#f2f2f0';const m=/var\((--[^)]+)\)/.exec(s);
  if(m)s=getComputedStyle(document.documentElement).getPropertyValue(m[1]).trim()||'#f2f2f0';
  let h=s.replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');
  const v=[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];return cc[col]=v.some(isNaN)?[242,242,240]:v}
 const A=(col,a)=>{const v=rgb(col);return `rgba(${v[0]},${v[1]},${v[2]},${Math.max(0,Math.min(1,a))})`};
 function init(){cv=document.getElementById('fxc');if(!cv)return false;const g=document.getElementById('game').getBoundingClientRect();dp=Math.min(2,window.devicePixelRatio||1);W=g.width;H=g.height;
  const w=Math.round(W*dp),h=Math.round(H*dp);if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h}c=cv.getContext('2d');return true}
 function box(side){const el=document.getElementById(side+'C'),g=document.getElementById('game').getBoundingClientRect();if(!el)return null;const r=el.getBoundingClientRect(),w=r.width,h=w*4/3;return{x:r.left-g.left+w/2,y:r.top-g.top+h/2,w,h}}
 function loop(ts){raf=0;if(!cv||!cv.isConnected){L=[];return}
  const dt=Math.min(.05,(ts-lt)/1000||.016);lt=ts;c.setTransform(dp,0,0,dp,0,0);c.clearRect(0,0,W,H);
  L=L.filter(o=>{o.age+=dt;if(o.age<0)return true;const p=o.age/o.dur;if(p>=1)return false;c.save();c.lineCap='round';c.lineJoin='round';o.fn(p);c.restore();return true});
  if(L.length)raf=requestAnimationFrame(loop);else c.clearRect(0,0,W,H)}
 function add(fn,dur,delay){L.push({fn,dur,age:-(delay||0)});if(!raf){lt=performance.now();raf=requestAnimationFrame(loop)}}
 const line=(x0,y0,x1,y1)=>{c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke()};
 const circ=(x,y,r)=>{c.beginPath();c.arc(x,y,r,0,TAU);c.stroke()};
 /* 붓 자국처럼 가운데가 굵은 선 */
 function brush(x0,y0,x1,y1,th,col,delay,curve){const dx=x1-x0,dy=y1-y0,len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len;
  add(p=>{const hp=Math.min(1,p/.4),tp=Math.max(0,(p-.15)/.85),N=16,fade=1-Math.max(0,p-.5)/.5;if(hp<=tp)return;const pts=[];
   for(let i=0;i<=N;i++){const t=tp+(hp-tp)*i/N;pts.push([x0+dx*t+nx*Math.sin(t*Math.PI)*curve,y0+dy*t+ny*Math.sin(t*Math.PI)*curve,Math.sin(i/N*Math.PI)])}
   c.fillStyle=A(col,fade);c.beginPath();pts.forEach((q,i)=>c[i?'lineTo':'moveTo'](q[0]+nx*q[2]*th/2,q[1]+ny*q[2]*th/2));
   for(let i=N;i>=0;i--){const q=pts[i];c.lineTo(q[0]-nx*q[2]*th/2,q[1]-ny*q[2]*th/2)}c.closePath();c.fill()},.3,delay)}
 function ticks(b,n,r0,r1,col,delay,dur){const as=[];for(let i=0;i<n;i++)as.push(i*TAU/n+R(-.2,.2));
  add(p=>{c.strokeStyle=A(col,1-p);c.lineWidth=1.6;const e=1-Math.pow(1-p,2);as.forEach(a=>line(b.x+Math.cos(a)*(r0+(r1-r0)*e*.6),b.y+Math.sin(a)*(r0+(r1-r0)*e*.6),b.x+Math.cos(a)*(r0+(r1-r0)*e),b.y+Math.sin(a)*(r0+(r1-r0)*e)))},dur||.3,delay)}
 const chev=(b,col,up,delay)=>add(p=>{const y=up?b.y+b.h*.3-p*b.h*.7:b.y-b.h*.4+p*b.h*.7,w=b.w*.28,al=Math.sin(p*Math.PI),d=up?1:-1;
   c.strokeStyle=A(col,al);c.lineWidth=2;c.beginPath();c.moveTo(b.x-w,y+d*w*.55);c.lineTo(b.x,y-d*w*.2);c.lineTo(b.x+w,y+d*w*.55);c.stroke()},.7,delay);
 const FXS={
  slash(b,col,big){const t=b.w*.1*big;
   brush(b.x+b.w*.5,b.y-b.h*.4,b.x-b.w*.5,b.y+b.h*.38,t,'#f2f2f0',0,b.w*.1);
   brush(b.x-b.w*.5,b.y-b.h*.15,b.x+b.w*.5,b.y+b.h*.3,t*.55,col,.1,-b.w*.08);
   ticks(b,7,b.w*.12,b.w*.4*big,'#f2f2f0',.14,.28)},
  ring(b,col){
   add(p=>{c.strokeStyle=A(col,1-p);c.lineWidth=2.4*(1-p)+.6;circ(b.x,b.y,b.w*(.1+.8*Math.pow(p,.55)))},.5);
   add(p=>{c.strokeStyle=A('#f2f2f0',(1-p)*.9);c.lineWidth=1.2;circ(b.x,b.y,b.w*(.05+.55*Math.pow(p,.6)))},.4,.06);
   ticks(b,10,b.w*.2,b.w*.7,'#f2f2f0',.02,.4)},
  zap(b,col){const top=b.y-b.h*.7,mk=sx=>{const P=[[sx,top]];for(let i=1;i<8;i++){const t=i/8;P.push([sx+(b.x-sx)*t+R(-1,1)*b.w*.14,top+(b.y-top)*t])}P.push([b.x,b.y]);return P};
   [0,.1,.22].forEach(d=>{const P=mk(b.x+R(-.35,.35)*b.w);add(p=>{c.strokeStyle=A('#f7ecaa',(Math.floor(p*5)%2?.5:1));c.lineWidth=2;c.beginPath();P.forEach((q,i)=>c[i?'lineTo':'moveTo'](q[0],q[1]));c.stroke()},.12,d)});
   ticks(b,8,b.w*.08,b.w*.35,'#f7ecaa',.04,.3)},
  heal(b){const col='#8fd49b';
   for(let i=0;i<9;i++){const x0=b.x+R(-.4,.4)*b.w,y0=b.y+R(.1,.4)*b.h,sp=R(.35,.65)*b.h,r=R(2.5,5),ph=R(0,TAU),dl=R(0,.4);
    add(p=>{c.strokeStyle=A(col,Math.sin(p*Math.PI));c.lineWidth=1.4;circ(x0+Math.sin(ph+p*5)*b.w*.03,y0-sp*p,r)},.8,dl)}
   [0,.25].forEach(d=>{const x0=b.x+R(-.25,.25)*b.w,y0=b.y+b.h*.2;add(p=>{c.strokeStyle=A('#d8ffe0',Math.sin(p*Math.PI));c.lineWidth=1.8;const s=b.w*.05,x=x0,y=y0-b.h*.5*p;line(x-s,y,x+s,y);line(x,y-s,x,y+s)},.8,d)})},
  up(b,col){for(let k=0;k<3;k++)chev(b,col,true,k*.13)},
  down(b,col){for(let k=0;k<3;k++)chev(b,col||'#ad8fd8',false,k*.13)},
  stun(b){const cx=b.x,cy=b.y-b.h*.4,rx=b.w*.38,ry=b.w*.1;
   add(p=>{const al=p<.8?1:(1-p)/.2;c.strokeStyle=A('#f6e38a',al);c.lineWidth=1.6;
    for(let i=0;i<3;i++){const a=p*TAU*2+i*TAU/3,x=cx+Math.cos(a)*rx,y=cy+Math.sin(a)*ry,r=b.w*.055;c.beginPath();for(let j=0;j<8;j++){const aa=p*5+j*Math.PI/4,rr=j%2?r*.35:r;c[j?'lineTo':'moveTo'](x+Math.cos(aa)*rr,y+Math.sin(aa)*rr)}c.closePath();c.stroke()}},1.1)},
  dodge(b){for(let i=0;i<3;i++){const y=b.y+R(-.3,.3)*b.h;add(p=>{c.strokeStyle=A('#f2f2f0',Math.sin(p*Math.PI)*.7);c.lineWidth=1.4;const x=b.x-b.w*.6+p*b.w*1.2;line(x-b.w*.3,y,x,y)},.35,i*.05)}},
  charge(b,col){const as=[];for(let i=0;i<8;i++)as.push(i*TAU/8+R(-.2,.2));
   add(p=>{c.strokeStyle=A(col,Math.min(1,p*3)*(1-p*.5));c.lineWidth=1.6;as.forEach(a=>{const r0=b.w*(1-p*.9),r1=r0+b.w*.2*(1-p);line(b.x+Math.cos(a)*r0,b.y+Math.sin(a)*r0*1.2,b.x+Math.cos(a)*r1,b.y+Math.sin(a)*r1*1.2)})},.4)}
 };
 return{clear(){L=[]},play(f){if(!init())return;const b=box(f.side);if(!b||!FXS[f.k])return;FXS[f.k](b,f.c||'#f2f2f0',f.big?1.4:1)}}})();
playFx=function(f){FX2.play(f);if(f.k==='dodge')restart(document.getElementById(f.side+'PF'),'dg')};
const _drawBattle=drawBattle;drawBattle=function(){_drawBattle();FX2.clear()};

/* ---- 새 효과음: 짧고 건조하게, 울림 없이 ---- */
Object.assign(SFX,{
 tap:()=>tone(1000,.03,'sine',.04),
 cast:()=>noise(.22,.05,600,1800,0,'bandpass',1),
 slash:()=>{noise(.1,.1,3200,1200,0,'bandpass',1);tone(170,.1,'sine',.17,70,.04)},
 hit:()=>{noise(.06,.08,1800,600,0,'lowpass',.7);tone(170,.1,'sine',.17,70)},
 crit:()=>{noise(.1,.1,3200,1200,0,'bandpass',1);tone(150,.14,'sine',.22,60,.04);tone(1200,.22,'sine',.045,0,.05)},
 boom:()=>{tone(95,.45,'sine',.28,40);noise(.4,.16,900,150,0,'lowpass',.8)},
 zap:()=>{noise(.16,.09,4200,2000,0,'bandpass',2);tone(1500,.1,'sine',.06,400);tone(1200,.08,'sine',.05,300,.1)},
 miss:()=>noise(.18,.05,2500,900,0,'bandpass',1),
 heal:()=>{tone(659,.35,'sine',.06);tone(988,.45,'sine',.05,0,.12)},
 up:()=>tone(440,.22,'sine',.06,660),
 down:()=>tone(440,.28,'sine',.06,290),
 stun:()=>{tone(330,.12,'sine',.1);tone(260,.12,'sine',.08,0,.12);tone(200,.18,'sine',.07,0,.24)},
 ko:()=>tone(220,.45,'sine',.1,60),
 win:()=>[523,659,784].forEach((f,i)=>tone(f,.3,'sine',.06,0,i*.1)),
 lose:()=>[392,330,262].forEach((f,i)=>tone(f,.4,'sine',.06,0,i*.16)),
 pull:()=>{noise(.4,.06,600,3500,0,'bandpass',1.5);tone(500,.35,'sine',.05,900)},
 rare:()=>{[784,988,1175,1568].forEach((f,i)=>tone(f,.45,'sine',.05,0,.1+i*.1))}});
