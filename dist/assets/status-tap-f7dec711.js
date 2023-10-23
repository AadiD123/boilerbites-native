<<<<<<< HEAD:dist/assets/status-tap-db09bd6c.js
import{r as a,f as i,a as c,w as d,s as l}from"./index-8ad5d8d6.js";/*!
=======
import{r as a,f as i,a as c,w as d,s as l}from"./index-daa464e2.js";/*!
>>>>>>> 26eddd1f5f3bfd22a7c5fb10afb94a5d943889ea:dist/assets/status-tap-f7dec711.js
 * (C) Ionic http://ionicframework.com - MIT License
 */const m=()=>{const e=window;e.addEventListener("statusTap",()=>{a(()=>{const o=e.innerWidth,s=e.innerHeight,n=document.elementFromPoint(o/2,s/2);if(!n)return;const t=i(n);t&&new Promise(r=>c(t,r)).then(()=>{d(async()=>{t.style.setProperty("--overflow","hidden"),await l(t,300),t.style.removeProperty("--overflow")})})})})};export{m as startStatusTap};
