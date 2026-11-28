/* 40차 수정: 연속공격 10회 이상이면 2배 속도 / 피해가 0이면 공격 연출 없이 "아무 일도 일어나지 않았다!" */
(function(){
ITEMS.inv.d='누구를 초대할 수 있는 걸까?';
const NONE=/피해를 줄 수 없다|싸울 마음이 없다|무적 상태라 피해를 받지 않는다/;
const _pe40=playEvents;
playEvents=function(ev,done){
 try{
  /* 피해 0: 공격 연출을 없애고 한 줄 문구로 */
  let lastAct=-1,lastNone=-1;
  for(let i=0;i<ev.length;i++){const e=ev[i];
   if(e.act){lastAct=i;lastNone=-1}
   if(typeof e.t==='string'&&NONE.test(e.t)){
    if(lastAct>=0&&ev[lastAct].lunge)ev[lastAct].lunge=null;
    if(lastNone>=0){ev.splice(i,1);i--;continue}
    e.disp='아무 일도 일어나지 않았다!';e.pop=null;e.fx=null;e.shake=null;e.sfx=null;lastNone=i}}
  /* 연속공격 10회 이상: 타격 간격을 절반으로 */
  let a=0;
  const seg=(from,to)=>{
   let n=0;for(let i=from;i<to;i++)if(typeof ev[i].t==='string'&&/에게 \d+ 피해/.test(ev[i].t))n++;
   if(n>=10)for(let i=from;i<to;i++){if(ev[i].act)continue;ev[i].d=Math.round((ev[i].d||((ev[i].pop||ev[i].fx)?700:450))/2)}};
  for(let i=1;i<ev.length;i++)if(ev[i].act){seg(a,i);a=i}
  seg(a,ev.length)
 }catch(err){}
 return _pe40(ev,done)};
})();
