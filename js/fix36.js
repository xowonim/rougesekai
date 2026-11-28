/* 36차 수정: 신은 보스 스테이지가 아니어도 보스와 같은 보정(HP 1.5배, 공격 · 방어 1.1배)을 받는다 */
(function(){
const GODS36=['anax','otori','marchen','amir','samael','jin','jung','aledeia'];
const _me36=makeEnemy;
makeEnemy=function(w){
 const e=_me36(w);
 try{if(e&&!e.boss&&!e.god36&&GODS36.includes(e.ch.id)){
  e.god36=true;e.maxhp=Math.round(e.maxhp*1.5);e.hp=e.maxhp;e.atk*=1.1;e.def*=1.1}}catch(err){}
 return e};
})();
