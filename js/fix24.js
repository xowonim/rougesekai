/* 24차 수정: 아낙: 고유차원 · 세피로트에서 타로를 만나면 이동 (초청장으로도 만날 수 있음) / 세피로트에는 타로 어 드바이치 (NPC) */
(function(){
 /* 타로 어 드바이치: 아낙의 차원으로 보내기 위한 NPC. 뽑기 · 아카이브에는 등록하지 않는다(CH에 넣지 않음). */
 CHM.tarot={id:'tarot',name:'타로 어 드바이치',el:'水',star:6,race:'신',role:'a',sk:CHM.anax.sk};
 REG.sephirot.spawn=[[90,{race:['이사야족']}],[10,{ids:['marchen','tarot']}]];

 const _pe24=pickEnemy;
 pickEnemy=function(R){if(run&&run.forceAnak)return CHM.anax;return _pe24(R)};
 const _me24=makeEnemy;
 makeEnemy=function(w){
  let e=_me24(w);
  if(e.ch.id!=='tarot')return e;
  /* 더블배틀에서는 타로가 등장하지 않는다 */
  if(run.dbl){for(let n=0;n<30&&e.ch.id==='tarot';n++)e=_me24(w);return e}
  run.tarotPending=true;run.forceAnak=true;
  try{e=_me24(w)}finally{run.forceAnak=false}
  return e};

 const _db24=drawBattle;
 drawBattle=function(){
  if(run&&run.region==='anak')run.dbl=false;
  const tp=!!(run&&run.tarotPending);if(run)run.tarotPending=false;
  if(tp&&run.enemy&&run.enemy.ch.id==='anax')run.note=`${REG.anak.name}.  ${REG.anak.tip}  아낙이 앞을 가로막는다.`;
  _db24();
  if(!tp||!run||run.phase!=='menu'||!run.enemy||run.enemy.ch.id!=='anax')return;
  const g=DC.g,T='타로 어 드바이치';
  const steps=[
   {who:T,col:g,html:'제 이름은 타로 어 드바이치, ‘세상’과 뜻을 함께 하고 있는 사제입니다.'},
   {who:T,col:g,html:'당신의 이름은 무엇인가요?'},
   {html:`아뿔싸! ${dlgName('타로','g')}에 의해 음양오행의 신, ${dlgName('아낙','g')}이 있는 차원에 오게 되었다!`}];
  run.dlgSeen=run.wave+':anak';
  dlgShow(steps)};
})();
