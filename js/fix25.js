/* 25차 수정: ③ 스킬은 궁극기. 소모 MP가 ② 스킬보다 항상 8 이상 크게 */
(function(){
 CH.forEach(c=>{const s=c.sk;if(!s||s.length<3)return;
  const m2=mpCost(s[1],1),m3=mpCost(s[2],2),want=m2+8;
  if(m3<want)s[2].mp=want});
})();
