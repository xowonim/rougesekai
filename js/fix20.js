/* 20차 수정: 송 루이후 ID를 ruihu로 변경 (기존 저장 데이터 이전 포함) */
(function(){
 const L=CHM.luihu;if(!L)return;
 L.id='ruihu';CHM.ruihu=L;PROF.ruihu=PROF.luihu;
 const mig=o=>{if(!o)return o;
  if(o.chars&&o.chars.luihu){o.chars.ruihu=o.chars.ruihu||o.chars.luihu;delete o.chars.luihu}
  if(Array.isArray(o.party))o.party=o.party.map(x=>x==='luihu'?'ruihu':x);return o};
 mig(S);if(typeof cur!=='undefined'&&cur==='luihu')cur='ruihu';
 if(Array.isArray(party))party=party.map(x=>x==='luihu'?'ruihu':x);
 const _fs=freshSave;freshSave=function(){return mig(_fs())};
 const _nm=normalize;normalize=function(){mig(S);_nm()};
 save()})();
