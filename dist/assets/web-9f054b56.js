<<<<<<< HEAD:dist/assets/web-9f054b56.js
import{W as a,I as i,N as r}from"./index-4ea6d415.js";class o extends a{constructor(){super(...arguments),this.selectionStarted=!1}async impact(t){const e=this.patternForImpact(t==null?void 0:t.style);this.vibrateWithPattern(e)}async notification(t){const e=this.patternForNotification(t==null?void 0:t.type);this.vibrateWithPattern(e)}async vibrate(t){const e=(t==null?void 0:t.duration)||300;this.vibrateWithPattern([e])}async selectionStart(){this.selectionStarted=!0}async selectionChanged(){this.selectionStarted&&this.vibrateWithPattern([70])}async selectionEnd(){this.selectionStarted=!1}patternForImpact(t=i.Heavy){return t===i.Medium?[43]:t===i.Light?[20]:[61]}patternForNotification(t=r.Success){return t===r.Warning?[30,40,30,50,60]:t===r.Error?[27,45,50]:[35,65,21]}vibrateWithPattern(t){if(navigator.vibrate)navigator.vibrate(t);else throw this.unavailable("Browser does not support the vibrate API")}}export{o as HapticsWeb};
=======
import{W as a,I as i,N as r}from"./index-16f81c9f.js";class o extends a{constructor(){super(...arguments),this.selectionStarted=!1}async impact(t){const e=this.patternForImpact(t==null?void 0:t.style);this.vibrateWithPattern(e)}async notification(t){const e=this.patternForNotification(t==null?void 0:t.type);this.vibrateWithPattern(e)}async vibrate(t){const e=(t==null?void 0:t.duration)||300;this.vibrateWithPattern([e])}async selectionStart(){this.selectionStarted=!0}async selectionChanged(){this.selectionStarted&&this.vibrateWithPattern([70])}async selectionEnd(){this.selectionStarted=!1}patternForImpact(t=i.Heavy){return t===i.Medium?[43]:t===i.Light?[20]:[61]}patternForNotification(t=r.Success){return t===r.Warning?[30,40,30,50,60]:t===r.Error?[27,45,50]:[35,65,21]}vibrateWithPattern(t){if(navigator.vibrate)navigator.vibrate(t);else throw this.unavailable("Browser does not support the vibrate API")}}export{o as HapticsWeb};
>>>>>>> 2e31d179ca9050e8e47dd7ecb7606ddf9285f05f:dist/assets/web-eb78d3f7.js
