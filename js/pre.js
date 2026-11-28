/* 저장 데이터 보호: game.js가 저장 데이터를 불러오기 전에 실행됨
   - ALIAS: 예전 ID를 새 ID로 이전
   - 현재 목록에 없는 캐릭터는 삭제하지 않고 hold에 보관했다가, 목록에 다시 생기면 복원 */
CHM.ruihu=CHM.luihu;
/* 혼돈: 이미지·저장 ID를 chaos로 변경 (예전 ID honton은 별칭으로 유지) */
(function(){const c=CHM.honton;if(!c)return;c.id='chaos';CHM.chaos=c;
 MAPS.forEach(m=>{m.pool=m.pool.map(x=>x==='honton'?'chaos':x);if(m.boss==='honton')m.boss='chaos'})})();
(function(){const KEY='kamisekai_rogue_v2',ALIAS={luihu:'ruihu',honton:'chaos',merhen:'marchen',anak:'anax',hwanhui:'hwanhee',jeong:'jung'};
 try{const raw=localStorage.getItem(KEY);if(!raw)return;
  const o=JSON.parse(raw);if(!o||typeof o!=='object')return;
  try{const b=JSON.parse(localStorage.getItem(KEY+'_bak')||'null'),n=x=>x&&x.chars?Object.keys(x.chars).length+Object.keys(x.hold||{}).length:0;
   if(n(o)>=n(b))localStorage.setItem(KEY+'_bak',raw)}catch(e){}
  o.chars=o.chars||{};o.hold=o.hold||{};o.holdParty=o.holdParty||[];o.party=o.party||[];
  const known=id=>!!CHM[id]&&id!==ALIAS[id]&&!Object.keys(ALIAS).includes(id);
  const fix=id=>ALIAS[id]||id;
  for(const id of Object.keys(o.chars)){const nid=fix(id);if(nid!==id){o.chars[nid]=o.chars[nid]||o.chars[id];delete o.chars[id]}}
  o.party=o.party.map(fix);
  for(const id of Object.keys(o.chars))if(!CHM[id]||ALIAS[id]){o.hold[id]=o.chars[id];if(o.party.includes(id))o.holdParty.push(id);delete o.chars[id]}
  for(const id of Object.keys(o.hold)){const nid=fix(id);if(CHM[nid]&&!ALIAS[nid]){if(!o.chars[nid])o.chars[nid]=o.hold[id];delete o.hold[id];if(o.holdParty.includes(id)&&!o.party.includes(nid))o.party.push(nid)}}
  if(!o.rec1){o.rec1=1;if(!o.chars.ruihu&&!o.hold.ruihu){o.chars.ruihu={lv:1,exp:0,bt:0,sk:[]};if(o.party.length<3)o.party.unshift('ruihu')}}
  localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}})();
