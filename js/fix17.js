/* 17차 수정: 전투 승리 재화 조정 */
const _win17=winBattle;
winBattle=function(){
 const alive=run.party.some(f=>f.hp>0),w=run.wave,boss=run.enemy&&run.enemy.boss;
 const c0=S.coin,g0=run.gained;
 _win17();
 if(!alive)return;
 const oldv=12+3*w+(boss?80+2*w:0),newv=2+2*w+(boss?30:0),d=newv-oldv;
 if(S.coin-c0===oldv){S.coin+=d;run.gained+=d;save()}
};
