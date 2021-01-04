!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("vue-demi")):"function"==typeof define&&define.amd?define(["exports","vue-demi"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).VueFort={},e.VueDemi)}(this,(function(e,t){"use strict";var n=Object.is;function f(e){return"function"==typeof e}function o(){}function r(e){let n,r;return f(e)?(n=e,r=o):({get:n,set:r}=e),t.customRef((()=>({get:n,set:r})))}function i(e){return!(!e||!0!==e.$isEffect)}let s,l=new WeakMap;function u(e){return l.has(e)}function c(e){return!!(e&&e.$effectScope&&u(e.$effectScope))}function a(e){if(i(e)){let{stop:t}=e;return t()}if(u(e)){let{stop:t}=l.get(e);return t()}return function(e){return!!(e&&e.$effect&&i(e.$effect))}(e)?a(e.$effect):c(e)?a(e.$effectScope):void 0}function d(e){if(s){let{effects:t}=l.get(s);t.add(e)}else t.getCurrentInstance()&&t.onUnmounted((()=>{a(e)}))}function h(e){let t=[],n=e=>{t.push(e)},f={},o=new Set,r=e=>{if(e){let t=s;s=f;try{Object.assign(f,e(n))}finally{s=t}}return f};return l.set(f,{effects:o,extend:r,stop(){o.forEach((e=>{a(e)})),t.forEach((e=>{e()}))}}),d(f),r(e),f}function p(e,t){if(u(e)){let{extend:n}=l.get(e);return n(t)}if(c(e))return p(e.$effectScope,t)}function v(e){let i,s;f(e)?(i=e,s=o):({get:i,set:s}=e);let l,u={$isEffect:!0,stop:o};return d(u),r({get:()=>(l||(u.stop=t.watch(i,(e=>{l?n(l.value,e)||(l.value=e):l=t.shallowRef(e)}),{flush:"sync",immediate:!0})),l.value),set:s})}var y=Array.isArray;function b(e){if(e){let t=typeof e;return"object"===t||"function"===t}return!1}function g(e){return"string"==typeof e}function R(e,t){return r({get:()=>e[t],set(n){e[t]=n}})}let j=new WeakMap;function O(e){let n={};if(b(e))if(t.isReactive(e)){let f=j.get(e);f||(f={},j.set(e,f));let o=t.toRaw(e);t.isReadonly(e)?Object.keys(e).forEach((r=>{let i=f[r];if(!i){if(t.isReactive(o))i=t.shallowReadonly(R(e,r));else{let n=o[r];i=t.isRef(n)?t.isReadonly(n)?n:t.shallowReadonly(n):t.shallowReadonly(R(e,r))}f[r]=i}n[r]=i})):Object.keys(e).forEach((r=>{let i=f[r];if(!i){if(t.isReactive(o))i=R(e,r);else{let n=o[r];i=t.isRef(n)?n:R(e,r)}f[r]=i}n[r]=i}))}else t.isReadonly(e)?(e=t.toRaw(e),Object.entries(e).forEach((([e,f])=>{n[e]=t.isRef(f)?t.isReadonly(f)?f:t.shallowReadonly(f):t.shallowReadonly(t.shallowRef(f))}))):Object.entries(e).forEach((([e,f])=>{n[e]=t.isRef(f)?f:t.shallowRef(f)}));return n}function w(e){return e.startsWith("_")}function E(e,t){return function(...n){let f;return p(e,(()=>{f=t.apply(e,n)})),f}}function $(e,n,o){if(y(o))o.forEach((t=>{$(e,n,t)}));else{let r,i;g(o)?r=e[o]:f(o)?r=E(e,o):b(o)&&(({handler:o,...i}=o),g(o)?r=e[o]:f(o)&&(r=E(e,o))),function(...e){let n=t.watch(...e);d({$isEffect:!0,stop:n})}(n,r,i)}}function m(e,n,{bind:f=!0}={}){let r={},i=O(n),s=Object.keys(i);n=t.shallowRef(t.reactive(i));let l=!1,u=function(e,t){if(!0===e)return h(t);let n;return p(e,(()=>{n=h(t)})),n}(f,(e=>{e((()=>{l=!0})),i={},s.forEach((e=>{i[e]=v({get:()=>n.value[e],set(t){n.value[e]=t}})}))}));return Object.defineProperties(r,{$model:{value:e},$effectScope:{value:u},$data:{get:()=>n.value,set(e){n.value=t.reactive(O(e))}},$update:{value(e){Object.assign(r,{$data:e})}},$destroy:{value(){a(u)}},$isDestroyed:{get:()=>l}}),p(u,(()=>{let t={},{options:{state:n=o,getters:f={},watch:s={},methods:l={}}={}}=e;Object.entries({...i,...O(n({...i}))}).forEach((([e,n])=>{t[e]={get:()=>n.value,set(e){n.value=e}}})),Object.entries(f).forEach((([e,n])=>{let f=v(E(r,n));t[e]={get:()=>f.value}})),Object.entries(l).forEach((([e,n])=>{t[e]={value:E(r,n)}})),Object.entries(t).forEach((([e,t])=>{Object.assign(t,{enumerable:!w(e)})})),Object.defineProperties(r,t),Object.entries(s).forEach((([e,t])=>{let n=function(e,t){let n=t.split(".");return 1===n.length?()=>e[t]:()=>function(e,t){return t.forEach((t=>{e=e[t]})),e}(e,n)}(r,e);$(r,n,t)}))})),r}e.c=function(...e){return m(...e)},e.defineModel=function(e){e=t.shallowRef(e);let n=function(...e){return m(n,...e)};return Object.defineProperties(n,{options:{get:()=>e.value,set(t){e.value=t}},update:{value(e){Object.assign(n,{options:e})}}}),n},e.toRefs=O,Object.defineProperty(e,"__esModule",{value:!0})}));
