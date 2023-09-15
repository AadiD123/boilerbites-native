<<<<<<< HEAD:dist/assets/status-tap-legacy-5724e981.js
System.register(["./index-legacy-65c47dca.js"],(function(e,t){"use strict";var n,r,s,o,i;return{setters:[e=>{n=e.r,r=e.f,s=e.a,o=e.w,i=e.s}],execute:function(){
=======
System.register(["./index-legacy-b06a98db.js"],(function(e,t){"use strict";var n,r,s,o,i;return{setters:[e=>{n=e.r,r=e.f,s=e.a,o=e.w,i=e.s}],execute:function(){
>>>>>>> 2e31d179ca9050e8e47dd7ecb7606ddf9285f05f:dist/assets/status-tap-legacy-7d8780a9.js
/*!
       * (C) Ionic http://ionicframework.com - MIT License
       */
e("startStatusTap",(()=>{const e=window;e.addEventListener("statusTap",(()=>{n((()=>{const t=e.innerWidth,n=e.innerHeight,a=document.elementFromPoint(t/2,n/2);if(!a)return;const c=r(a);c&&new Promise((e=>s(c,e))).then((()=>{o((async()=>{c.style.setProperty("--overflow","hidden"),await i(c,300),c.style.removeProperty("--overflow")}))}))}))}))}))}}}));
