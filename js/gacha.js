/* 가챠 연출: 가는 선이 모였다가 퍼지는 연출 + 결과 칸 순차 등장 */
const GC={3:'#f2f2f0',4:'#f08fb8',5:'#f2d04a',6:'#e8473f'};
(function(){const st=document.createElement('style');st.textContent=`
#gcv{position:absolute;inset:0;width:100%;height:100%}
.rc.r4 .tile{border-color:#f08fb8!important;box-shadow:none!important}
.rc.r5 .tile{border-color:#f2d04a!important;box-shadow:none!important}
.rc.r6 .tile{border-color:#e8473f!important;box-shadow:0 0 .8em #e8473f66!important}
.rc.in{animation:rcin .4s both}
@keyframes rcin{from{opacity:0;transform:translateY(.6em) scale(.9)}to{opacity:1;transform:none}}
`;document.head.appendChild(st)})();
function castFx(col,top,done){
 const ov=$('ovl'),g=document.getElementById('game').getBoundingClientRect();
 ov.innerHTML='<div class="ov" id="gov"><canvas id="gcv"></canvas></div>';
 const cv=document.getElementById('gcv'),dp=Math.min(2,window.devicePixelRatio||1),W=g.width,H=g.height;
 cv.width=W*dp;cv.height=H*dp;const c=cv.getContext('2d');c.scale(dp,dp);
 const cx=W/2,cy=H/2,D=Math.hypot(W,H)/2,N=26+(top-3)*10,dur=top>=5?1500:1050;
 const L=[];for(let i=0;i<N;i++)L.push({a:Math.random()*Math.PI*2,r:D*(.55+Math.random()*.45),l:D*(.12+Math.random()*.2),d:Math.random()*.25});
 const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),[R,G,B]=rgb(col),A=a=>`rgba(${R},${G},${B},${Math.max(0,Math.min(1,a))})`;
 let t0=0,fin=false;
 function end(){if(fin)return;fin=true;done()}
 document.getElementById('gov').onclick=end;
 function fr(ts){if(fin||!cv.isConnected)return;if(!t0)t0=ts;const p=Math.min(1,(ts-t0)/dur);
  c.clearRect(0,0,W,H);c.lineCap='round';c.lineWidth=1.6;
  const gp=Math.min(1,p/.7);
  L.forEach(o=>{const q=Math.max(0,Math.min(1,(gp-o.d)/(1-o.d)));if(q<=0||q>=1)return;const e=q*q,r1=o.r*(1-e),r0=r1+o.l*(1-q);
   c.strokeStyle=A(.35+.65*q);c.beginPath();c.moveTo(cx+Math.cos(o.a)*r0,cy+Math.sin(o.a)*r0);c.lineTo(cx+Math.cos(o.a)*r1,cy+Math.sin(o.a)*r1);c.stroke()});
  if(p>.7){const k=(p-.7)/.3;
   c.strokeStyle=A(1-k);c.lineWidth=2.4*(1-k)+.6;c.beginPath();c.arc(cx,cy,D*.08+D*.5*k,0,Math.PI*2);c.stroke();
   if(top>=5){c.lineWidth=1.2;c.strokeStyle=A((1-k)*.8);c.beginPath();c.arc(cx,cy,D*.04+D*.85*k,0,Math.PI*2);c.stroke()}
   c.lineWidth=1.6;for(let i=0;i<16;i++){const a=i*Math.PI/8,r0=D*.1+D*.4*k,r1=r0+D*.12*(1-k);c.strokeStyle=A((1-k)*.9);c.beginPath();c.moveTo(cx+Math.cos(a)*r0,cy+Math.sin(a)*r0);c.lineTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1);c.stroke()}}
  if(p>=1)end();else requestAnimationFrame(fr)}
 requestAnimationFrame(fr)}
pull=function(n){
 const cost=n===10?CFG.PULL10_COST:CFG.PULL_COST;
 if(S.coin<cost){flashWallet();return}
 S.coin-=cost;const res=pullMany(n);save();
 const top=Math.max(3,...res.map(r=>r.kind==='char'?r.ch.star:3));
 toGacha();sfx(top>=5?'rare':'pull');
 castFx(GC[top]||GC[3],top,()=>{
  const cells=res.map((r,i)=>{const d=`class="rc in${r.kind==='char'?' r'+r.ch.star:''}" style="animation-delay:${i*.1}s"`;
   return r.kind==='mat'
   ?`<div ${d}><div class="tile" style="--c:#c4c9d4">${bookIcon(r.k)}</div>${BOOK[r.k].n}</div>`
   :`<div ${d}><div class="tile" style="--c:${EC[r.ch.el]}"><b>${r.ch.name[0]}</b>${imgTag(r.ch)}</div>${r.ch.name}<small${r.bt?' class="btg"':''}>${r.tag.replace('BREAKTHROUGH','VIRTUE')}</small></div>`}).join('');
  $('ovl').innerHTML=`<div class="ov" onclick="toGacha()"><div class="res" style="${n===1?'grid-template-columns:4.2em':''}">${cells}</div></div>`})};
