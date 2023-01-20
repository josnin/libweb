var D=Object.defineProperty;var L=(o,t,e)=>t in o?D(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var m=(o,t,e)=>(L(o,typeof t!="symbol"?t+"":t,e),e);var p=()=>crypto.randomUUID().split("-")[0],A=o=>o.replace(/[A-Z]/g,t=>`-${t.toLowerCase()}`),b=o=>o.replace(/-./g,t=>t[1].toUpperCase());function S(o){let t=!1;for(let e of f.reg)t=e.call(this,o);return!0}var g=class{static define(t){g.reg.push(t)}},f=g;m(f,"reg",[]);var d={},y=class extends HTMLElement{};customElements.get("in-watch")||customElements.define("in-watch",y);var G=(o,t)=>{let e=document.createElement("in-watch"),s=p();for(let i of o)Object.hasOwn(d,i)||(d[i]={}),d[i][s]=t;return e.dataset.watch__=s,e.outerHTML};function C(o){let t=b(o),e=!1;if(Object.hasOwn(d,t)){for(let s of Object.keys(d[t]))if(this.shadowRoot){let i=this.shadowRoot.querySelector(`[data-watch__="${s}"]`);i&&(i.innerHTML=d[t][s]?d[t][s].call(this):this[t],e=!0)}}return e}f.define(C);var E=[],u;(function(o){o[o.ADD=0]="ADD",o[o.REMOVE=1]="REMOVE"})(u||(u={}));var X=(o,t)=>{let e=p();return E.push([o,t,e]),`data-evt__=${e}`};function Y(o,t,e){let s={detail:t,composed:!0},i=new CustomEvent(o,{...s,...e});this.shadowRoot&&this.shadowRoot.dispatchEvent(i)}function O(o){for(let t of E){let[e,s,i]=t;if(this.shadowRoot){let n=this.shadowRoot.querySelector(`[data-evt__="${i}"]`);n&&(o===u.ADD?n.addEventListener(e,s):n.removeEventListener(e,s))}}}function U(){O.call(this,u.ADD)}function R(){O.call(this,u.REMOVE)}var w={},j=(o,t,e,s)=>{let i=document.createElement(t),n=p();for(let a of o)Object.hasOwn(w,a)||(w[a]={}),w[a][n]=e;if(s){let{id:a,style:h,class:r}=s;a&&i.setAttribute("id",a),r&&i.setAttribute("class",r),h&&i.setAttribute("style",h)}return i.dataset.id__=n,i},T={},k=["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","head","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","label","legend","li","link","main","map","mark","menu","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","slot","small","source","span","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr"];for(let o of k)T[o]=(t,e,s)=>j(t,o,e,s).outerHTML;function $(o,t){for(let e of l.reg)e.call(this,o,t)}var x=class{static define(t){x.reg.push(t)}},l=x;m(l,"reg",[]);var I=["^class$","^style$","^className$","^classList$","^id$","^dataset$","^data-","^aria-"],v=["disabled"],M=o=>{let t=!0;for(let e of I){let s=new RegExp(e,"g");if(o.match(s)){t=!1,console.error(`Please remove attribute '${o}' in the observedAttributes, 
          DOM already provided built-in props reflection for this attribute.`);break}}return t};function P(o,t){if(t===void 0||t.name!="propReflect")return;let{type:e,value:s,serializerFn:i,deserializerFn:n}=t,a=this.constructor.observedAttributes,h=b(o),r=A(o);if(a===void 0||!a.includes(r)){console.error(`Unable to apply propReflect '${h}' for attribute '${r}', 
        Please add '${r}' in the observedAttributes of ${this.constructor.name} component`);return}!M(r)||Object.defineProperty(this,h,{configurable:!0,set(c){if(n)return n.call(this,r,e,s,c);(e===Boolean||typeof c=="boolean"||v.includes(r))&&c===!0?this.setAttribute(r,""):(e===Boolean||v.includes(r))&&c===!1?this.removeAttribute(r):([Object,Array].includes(e)||["object","array"].includes(typeof c))&&c?this.setAttribute(r,JSON.stringify(c)):([String,Number].includes(e)||["string","number"].includes(typeof c))&&c?this.setAttribute(r,c):this.removeAttribute(r)},get(){if(i)return i.call(this,r,e,s);if(r in v||e===Boolean||typeof s=="boolean")return this.hasAttribute(r);if(([String,Array,Object].includes(e)||["string","array","object"].includes(typeof s))&&!this.hasAttribute(r))return s;if((e===String||typeof s=="string")&&this.hasAttribute(r))return this.getAttribute(r);if((e===Number||typeof s=="number")&&this.hasAttribute(r))return Number(this.getAttribute(r));if(([Array,Object].includes(e)||["array","object"].includes(typeof s))&&this.hasAttribute(r))return JSON.parse(this.getAttribute(r))}})}function ft(o,t){return{value:o,...t,name:"propReflect"}}l.define(P);function q(o,t){if(t===void 0||t.name!="getset")return;let{value:e,forWatch:s}=t;this[`#${o}`]=e,Object.defineProperty(this,o,{configurable:!0,set(i){this[`#${o}`]=i,s&&this.updateContents(o)},get(){return this[`#${o}`]}})}function mt(o,t){return{value:o,...{forWatch:!0},...t,name:"getset"}}l.define(q);var B={mode:"open",delegatesFocus:!0},N=[],H=[` /* Custom elements are display: inline by default, 
     * so setting their width or height will have no effect 
    */
    :host { display: block; }
  `],_=class extends HTMLElement{constructor(){super(),this.attachShadow(B)}connectedCallback(){this._onInit(),this._onDoUpdate()}attributeChangedCallback(t,e,s){if(e===s)return;this.updateContents(t)&&this._onUpdated()}disconnectedCallback(){R.call(this)}updateContents(t){return S.call(this,t)}setEventListeners(){U.call(this)}setPropsBehavior(){let t=Object.getOwnPropertyNames(this);for(let e of t){let s=this[e];$.call(this,e,s)}}getStyles(t){let e=[],s=[],i=this.shadowRoot?.adoptedStyleSheets;for(let n of t)if(n.startsWith("<link"))e.push(n);else if(n.startsWith("@import")||!i){let a=document.createElement("style");a.innerHTML=n,e.push(a.outerHTML)}else{let a=new CSSStyleSheet;a.replaceSync(n),s.push(a)}return this.shadowRoot&&s.length>0&&(this.shadowRoot.adoptedStyleSheets=s),e.join("")}_onInit(){this.setPropsBehavior(),this.shadowRoot&&(this.shadowRoot.innerHTML=`
      ${this.getStyles(N)} 
      ${this.getStyles(H)} 
      ${this.getStyles(this.styles)} 
      ${this.render()}
      `),this.onInit()}_onDoUpdate(){let t=Object.getOwnPropertyNames(this);for(let e of t)this.updateContents(e)&&this._onUpdated();this.onDoUpdate()}_onUpdated(){this.setEventListeners(),this.onUpdated()}onInit(){}onDoUpdate(){}onUpdated(){}styles=[];render(){return""}};export{_ as RedGin,S as applyDirectives,U as applyEventListeners,$ as applyPropsBehavior,B as attachShadow,f as customDirectives,l as customPropsBehavior,H as defaultStyles,Y as emit,X as event,mt as getset,N as injectStyles,ft as propReflect,R as removeEventListeners,T as tags,G as watch,C as watchFn};
//# sourceMappingURL=redgin.js.map
