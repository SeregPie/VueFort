!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("vue-demi")):"function"==typeof define&&define.amd?define(["exports","vue-demi"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).VueFort={},e.VueDemi)}(this,(function(e,t){"use strict";function n(e){return"function"==typeof e}function f(){}function r(e){let r,i;return n(e)?(r=e,i=f):({get:r,set:i}=e),t.customRef((()=>({get:r,set:i})))}var i=Object.is;function o(e){return!(!e||!0!==e.$isEffect)}let c,l=new WeakMap;function s(e){return l.has(e)}function u(e){return!!(e&&e.$effectScope&&s(e.$effectScope))}function a(e){if(o(e)){let{stop:t}=e;return t()}if(s(e)){let{stop:t}=l.get(e);return t()}return function(e){return!!(e&&e.$effect&&o(e.$effect))}(e)?a(e.$effect):u(e)?a(e.$effectScope):void 0}function d(e){if(c){let{effects:t}=l.get(c);t.add(e)}else t.getCurrentInstance()&&t.onUnmounted((()=>{a(e)}))}function h(e){let t=[],n=e=>{t.push(e)},f={},r=new Set,i=e=>{if(e){let t=c;c=f;try{Object.assign(f,e(n))}finally{c=t}}return f};return l.set(f,{effects:r,extend:i,stop(){r.forEach((e=>{a(e)})),t.forEach((e=>{e()}))}}),d(f),i(e),f}function p(e,t){if(s(e)){let{extend:n}=l.get(e);return n(t)}if(u(e))return p(e.$effectScope,t)}function y(e,t){return r({get:()=>e[t],set(n){e[t]=n}})}function b(e){if(e){let t=typeof e;return"object"===t||"function"===t}return!1}let R=new WeakMap;function g(e){let n={};if(b(e))if(t.isReactive(e)){let f=R.get(e);f||(f={},R.set(e,f));let r=t.toRaw(e);t.isReadonly(e)?Object.keys(e).forEach((i=>{let o=f[i];if(!o){if(t.isReactive(r))o=t.shallowReadonly(y(e,i));else{let n=r[i];o=t.isRef(n)?t.isReadonly(n)?n:t.shallowReadonly(n):t.shallowReadonly(y(e,i))}f[i]=o}n[i]=o})):Object.keys(e).forEach((i=>{let o=f[i];if(!o){if(t.isReactive(r))o=y(e,i);else{let n=r[i];o=t.isRef(n)?n:y(e,i)}f[i]=o}n[i]=o}))}else t.isReadonly(e)?(e=t.toRaw(e),Object.entries(e).forEach((([e,f])=>{n[e]=t.isRef(f)?t.isReadonly(f)?f:t.shallowReadonly(f):t.shallowReadonly(t.shallowRef(f))}))):Object.entries(e).forEach((([e,f])=>{n[e]=t.isRef(f)?f:t.shallowRef(f)}));return n}var v=Array.isArray;function j(e){return"string"==typeof e}e.createInstance=function({state:e={},getters:o={},watch:c={},methods:l={},bind:y=!0}={}){let R=!1,w=((e,t)=>{if(!0===e)return h(t);if(s(e)||u(e)){let n;return p(e,(()=>{n=h(t)})),n}})(y,(e=>{e((()=>{R=!0}))})),E={};return Object.defineProperties(E,{$effectScope:{value:w},$destroy:{value(){a(w)}},$isDestroyed:{get:()=>R}}),p(w,(()=>{Object.entries(g(t.reactive(e))).forEach((([e,t])=>{Object.defineProperty(E,e,{enumerable:!0,get:()=>t.value,set(e){t.value=e}})})),Object.entries(o).forEach((([e,o])=>{if(n(o)){let c=function(e){let o,c;n(e)?(o=e,c=f):({get:o,set:c}=e);let l,s={$isEffect:!0,stop:f};return d(s),r({get:()=>(l||(s.stop=t.watch(o,(e=>{l?i(l.value,e)||(l.value=e):l=t.shallowRef(e)}),{flush:"sync",immediate:!0})),l.value),set:c})}(o.bind(E));Object.defineProperty(E,e,{enumerable:!0,get:()=>c.value})}})),Object.entries(l).forEach((([e,t])=>{n(t)&&Object.defineProperty(E,e,{enumerable:!0,value:t.bind(E)})})),Object.entries(c).forEach((([e,f])=>{let r=(e=>{let t=e.split(".");return 1===t.length?()=>E[e]:()=>function(e,t){return t.forEach((t=>{e=e[t]})),e}(E,t)})(e),i=e=>{let f,i;j(e)?f=E[e]:n(e)?f=e.bind(E):b(e)&&(({handler:e,...i}=e),j(e)?f=E[e]:n(e)&&(f=e.bind(E))),function(...e){let n=t.watch(...e);d({$isEffect:!0,stop:n})}(r,f,i)};v(f)?f.forEach(i):i(f)}))})),E},e.toRefs=g,Object.defineProperty(e,"__esModule",{value:!0})}));
