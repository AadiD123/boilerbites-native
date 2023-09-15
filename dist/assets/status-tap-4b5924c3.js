<<<<<<< HEAD:dist/assets/status-tap-4b5924c3.js
import{r as a,f as i,a as c,w as d,s as l}from"./index-4ea6d415.js";/*!
=======
import{r as a,f as i,a as c,w as d,s as l}from"./index-16f81c9f.js";/*!
>>>>>>> 2e31d179ca9050e8e47dd7ecb7606ddf9285f05f:dist/assets/status-tap-09466a5c.js
 * (C) Ionic http://ionicframework.com - MIT License
 */const m=()=>{const e=window;e.addEventListener("statusTap",()=>{a(()=>{const o=e.innerWidth,s=e.innerHeight,n=document.elementFromPoint(o/2,s/2);if(!n)return;const t=i(n);t&&new Promise(r=>c(t,r)).then(()=>{d(async()=>{t.style.setProperty("--overflow","hidden"),await l(t,300),t.style.removeProperty("--overflow")})})})})};export{m as startStatusTap};
