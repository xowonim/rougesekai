/* 28차 수정: 기존 캐릭터 ② 스킬 MP를 캐릭터마다 다르게 */
(function(){
const SKIP=['samael','hyun','seunga','anemone','esquel','taotie','chaos'];
const BASE={a:{lo:8,mid:12,hi:16,top:24}};
const tier=s=>s.t==='a'?(s.p<50?8:s.p<70?12:s.p<100?16:24):s.t==='h'?14:10;
let k=0;
CH.forEach(c=>{
 const s=c.sk;if(!s||s.length<2||SKIP.includes(c.id))return;
 const a=s[1];
 if(a.hpPct||a.needBrand||a.needDis||a.bkUlt||a.mp===0)return;
 k++;
 const m2=Math.max(4,tier(a)+((k*3)%7)-3);
 a.mp=m2;
 if(s[2]){const b=s[2],m3=mpCost(b,2);
  if(m3<9999&&!(b.hpPct||b.needBrand||b.needDis||b.bkUlt)&&m3<m2+8)b.mp=m2+8}});
})();
