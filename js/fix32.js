/* 32차 수정: 메인 화면 항목을 누를 때도 시작 효과음 재생 */
(function(){
let mute=false;
const _sfx32=sfx;
sfx=function(k){if(mute&&k==='tap')return;return _sfx32(k)};
document.addEventListener('click',e=>{
 const b=e.target.closest&&e.target.closest('.menu .tb');
 if(!b||!document.querySelector('#game .logo'))return;
 mute=true;setTimeout(()=>{mute=false},0);
 _sfx32('start')},true);
})();
