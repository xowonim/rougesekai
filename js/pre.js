/* 저장 데이터 보호: game.js가 저장 데이터를 불러오기 전에 실행됨
   - ALIAS: 예전 ID를 새 ID로 이전
   - 현재 목록에 없는 캐릭터는 삭제하지 않고 hold에 보관했다가, 목록에 다시 생기면 복원 */
CHM.ruihu=CHM.luihu;
(function(){const KEY='kamisekai_rogue_v2',ALIAS={luihu:'ruihu'};
 try{const raw=localStorage.getItem(KEY);if(!raw)return;
  const o=JSON.parse(raw);if(!o||typeof o!=='object')return;
  try{const b=JSON.parse(localStorage.getItem(KEY+'_bak')||'null'),n=x=>x&&x.chars?Object.keys(x.chars).length+Object.keys(x.hold||{}).length:0;
   if(n(o)>=n(b))localStorage.setItem(KEY+'_bak',raw)}catch(e){}
  o.chars=o.chars||{};o.hold=o.hold||{};o.holdParty=o.holdParty||[];o.party=o.party||[];
  const fix=id=>ALIAS[id]||id;
  for(const id of Object.keys(o.chars)){const nid=fix(id);if(nid!==id){o.chars[nid]=o.chars[nid]||o.chars[id];delete o.chars[id]}}
  o.party=o.party.map(fix);
  for(const id of Object.keys(o.chars))if(!CHM[id]||ALIAS[id]){o.hold[id]=o.chars[id];if(o.party.includes(id))o.holdParty.push(id);delete o.chars[id]}
  for(const id of Object.keys(o.hold)){const nid=fix(id);if(CHM[nid]&&!ALIAS[nid]){if(!o.chars[nid])o.chars[nid]=o.hold[id];delete o.hold[id];if(o.holdParty.includes(id)&&!o.party.includes(nid))o.party.push(nid)}}
  localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}})();
