<<<<<<< HEAD:dist/assets/status-tap-legacy-0488e087.js
System.register(["./index-legacy-f2b0f64b.js"],(function(e,t){"use strict";var n,r,s,o,i;return{setters:[e=>{n=e.r,r=e.f,s=e.a,o=e.w,i=e.s}],execute:function(){
=======
System.register(["./index-legacy-5a09d5c9.js"],(function(e,t){"use strict";var n,r,s,o,i;return{setters:[e=>{n=e.r,r=e.f,s=e.a,o=e.w,i=e.s}],execute:function(){
>>>>>>> 26eddd1f5f3bfd22a7c5fb10afb94a5d943889ea:dist/assets/status-tap-legacy-3b0f4b76.js
/*!
       * (C) Ionic http://ionicframework.com - MIT License
       */
e("startStatusTap",(()=>{const e=window;e.addEventListener("statusTap",(()=>{n((()=>{const t=e.innerWidth,n=e.innerHeight,a=document.elementFromPoint(t/2,n/2);if(!a)return;const c=r(a);c&&new Promise((e=>s(c,e))).then((()=>{o((async()=>{c.style.setProperty("--overflow","hidden"),await i(c,300),c.style.removeProperty("--overflow")}))}))}))}))}))}}}));
