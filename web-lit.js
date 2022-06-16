var kt=i=>i==null||i===""||Array.isArray(i)&&i.length===0,jt=i=>{let t={};for(let e in i){let s=i[e];kt(s)||(t[e]=s)}return t},It=(i,t,e)=>{let s=t.split("."),r=s.pop();var n=i||{};return s.forEach(o=>{n.hasOwnProperty(o)||(n[o]={}),n=n[o]}),n[r]=e,i},zt=(i,t,e)=>{let s=t.split("."),r=i||{};for(let n of s){if(!r.hasOwnProperty(n))return e;r=r[n]}return r},Vt=(i,t)=>{let e=t.split("."),s=e.pop();var r=i||{};for(let n of e){if(!r.hasOwnProperty(n))return!1;r=r[n]}return delete r[s]},Wt=(i,t)=>{try{return JSON.parse(i)}catch{return t}},z={clean:jt,set:It,get:zt,trim:Vt,parse:Wt},tt=class{constructor(t,e={}){if(!t)throw new Error("store id required");this.id=t,this.value=e}set(t,e){return this.value=z.set(this.value||{},t,e),this}get(t,e){return this.value&&t?z.get(this.value,t,e):this.value}trim(t){return t?z.trim(this.value,t):this.value={},this}save(){return globalThis.sessionStorage.setItem(this.id,JSON.stringify(this.value)),this}load(){let t=window.sessionStorage.getItem(this.id);return this.value=z.parse(t)||{},this}reset(){return this.value={},globalThis.sessionStorage.removeItem(this.id),this}},qt=(i,t)=>{switch(t){case"any":return i;case"text":return i&&i.toString();case"json":return JSON.stringify(i)}throw new Error("unknown request data type")},Kt=(i,t)=>{switch(t){case"arrayBuffer":return i.arrayBuffer();case"blob":return i.blob();case"formData":return i.formData();case"json":return i.json();case"text":return i.text()}throw new Error("unknown response type")};function S({url:i,data:t,input:e=p=>p,output:s=p=>p,headers:r={},body:n,method:o="POST",timeout:h=0,requestType:l="json",responseType:a="json"}={}){if(!i)throw new Error("url required");i=i.indexOf("http")<0&&S.base_href?S.base_href+i:i,t=e(t);let p={method:o,headers:{...S.headers||{},...r}};!(o==="GET"||o==="HEAD")&&(p.body=n||qt(t,l));let d=new AbortController;p.signal=d.signal;let v=new Promise(async(O,w)=>{let X;h&&(X=setTimeout(()=>{d.abort()},h)),p.signal.onabort=()=>{w(new Error("aborted"))};try{let E=await fetch(i,p);if(X&&clearTimeout(X),!E.ok)throw await E.body.cancel(),{[E.status]:E.statusText};let Dt=await Kt(E,a);O(await s(Dt))}catch(E){w(E)}});return v.abort=()=>d.abort(),v}S.base_href="";S.headers={"Content-Type":"application/json"};var Gt=i=>i!==null&&i instanceof Object&&i.constructor===Object,Jt=i=>async t=>{let e=await S({...i,data:{...i.data||{},...t}});if(Gt(e)){let{data:s,errors:r}=e;if(Boolean(s)^Boolean(r)){if(r)throw r;return s}}return e},de={ajax:S,ajaxFn:Jt},et=class{constructor({broadcastChannelId:t}){var e=this;if(e._id=0,e.channels={},t){let s=new BroadcastChannel(t);s.onmessage=r=>{let{channel:n,args:o}=r.data;e.publish_.apply(e,[n].concat(o))},e.broadcastChannel=s}}reset(){this._id=0,this.channels={}}channelId(t){let[e,...s]=(t||"").split(".");return[e,s.join(".")||`_${++this._id}`]}subscribe(t,e,s=!1){let[r,n]=this.channelId(t);if(!r)return;let o=this.channels;o[r]||(o[r]={});let h=o[r];if(h[n]&&!s)throw new Error(`subscribe: ${t} already exists`);return h[n]=e,[r,n].join(".")}unsubscribe(){let t=this;Array.from(arguments).flat().forEach(e=>{let[s,r]=t.channelId(e);if(!s)return;let n=t.channels[s];!n||delete n[r]})}publish_(t,...e){let s=this.channels[t];!s||Object.values(s).forEach(r=>{r.apply(null,e)})}publish(t,...e){let s=t.slice(-1)==="!";return t=s?t.slice(0,-1):t,s&&this.broadcastChannel&&this.broadcastChannel.postMessage({channel:t,args:e}),this.publish_.apply(this,[t].concat(e))}async exec(t,...e){let s=this.channels[t];if(!s)return;let r=Object.values(s).map(o=>o.apply(null,e)),n=await Promise.all(r);return Object.keys(s).reduce((o,h,l)=>(o[h]=n[l],o),{})}},Ft=globalThis.WEB_PUBSUB_BROADCAST_CHANNEL_ID||"web-pubsub-broadcast-channel-id",y=new et({broadcastChannelId:Ft});y.publish.bind(y);y.subscribe.bind(y);y.unsubscribe.bind(y);y.exec.bind(y);var Zt=i=>{let t=0,e={},s=(...r)=>new Promise((n,o)=>{let h=++t;i.postMessage({id:h,args:r}),e[h]={ok:n,err:o}});return i.onmessage=r=>{if(!r)return;let{id:n,data:o,error:h}=r.data||{};if(!n)return;let l=e[n];if(!l)return;delete e[n];let{ok:a,err:p}=l;return h?p(h):a(o)},new Proxy(s,{get(r,n){return(...o)=>new Promise((h,l)=>{let a=++t;i.postMessage({id:a,fn:n,args:o}),e[a]={ok:h,err:l}})}})},Qt=(i,t=null)=>{let e={};if(typeof i=="function")e._=i;else if(i!==null&&i instanceof Object&&i.constructor===Object)e=i;else throw new Error("please pass function/object");globalThis.onmessage=function(s){if(!s)return;let{id:r,fn:n="_",args:o}=s.data||{};(async()=>{var h={id:r};try{if(!e.hasOwnProperty(n))throw new Error("undefined property");let l=e[n],a=typeof l=="function";h.data=a?await l.apply(t||e,o):l,!a&&o.length>0&&(e[n]=o[0])}catch(l){h.error=l}globalThis.postMessage(h)})()}},ue={wrap:Zt,proxy:Qt};var vt=new tt("web-lit");vt.load();globalThis.addEventListener("beforeunload",()=>vt.save());var V=window.ShadowRoot&&(window.ShadyCSS===void 0||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,st=Symbol(),ft=new Map,B=class{constructor(t,e){if(this._$cssResult$=!0,e!==st)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){let t=ft.get(this.cssText);return V&&t===void 0&&(ft.set(this.cssText,t=new CSSStyleSheet),t.replaceSync(this.cssText)),t}toString(){return this.cssText}},$t=i=>new B(typeof i=="string"?i:i+"",st),W=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new B(e,st)},it=(i,t)=>{V?i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet):t.forEach(e=>{let s=document.createElement("style"),r=window.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)})},q=V?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return $t(e)})(i):i;var rt,_t=window.trustedTypes,Yt=_t?_t.emptyScript:"",mt=window.reactiveElementPolyfillSupport,ot={toAttribute(i,t){switch(t){case Boolean:i=i?Yt:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},At=(i,t)=>t!==i&&(t==t||i==i),nt={attribute:!0,type:String,converter:ot,reflect:!1,hasChanged:At},$=class extends HTMLElement{constructor(){super(),this._$Et=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Ei=null,this.o()}static addInitializer(t){var e;(e=this.l)!==null&&e!==void 0||(this.l=[]),this.l.push(t)}static get observedAttributes(){this.finalize();let t=[];return this.elementProperties.forEach((e,s)=>{let r=this._$Eh(s,e);r!==void 0&&(this._$Eu.set(r,s),t.push(r))}),t}static createProperty(t,e=nt){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){let s=typeof t=="symbol"?Symbol():"__"+t,r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Object.defineProperty(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){return{get(){return this[e]},set(r){let n=this[t];this[e]=r,this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||nt}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;let t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Eu=new Map,this.hasOwnProperty("properties")){let e=this.properties,s=[...Object.getOwnPropertyNames(e),...Object.getOwnPropertySymbols(e)];for(let r of s)this.createProperty(r,e[r])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let r of s)e.unshift(q(r))}else t!==void 0&&e.push(q(t));return e}static _$Eh(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}o(){var t;this._$Ep=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$Em(),this.requestUpdate(),(t=this.constructor.l)===null||t===void 0||t.forEach(e=>e(this))}addController(t){var e,s;((e=this._$Eg)!==null&&e!==void 0?e:this._$Eg=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((s=t.hostConnected)===null||s===void 0||s.call(t))}removeController(t){var e;(e=this._$Eg)===null||e===void 0||e.splice(this._$Eg.indexOf(t)>>>0,1)}_$Em(){this.constructor.elementProperties.forEach((t,e)=>{this.hasOwnProperty(e)&&(this._$Et.set(e,this[e]),delete this[e])})}createRenderRoot(){var t;let e=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return it(e,this.constructor.elementStyles),e}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$Eg)===null||t===void 0||t.forEach(e=>{var s;return(s=e.hostConnected)===null||s===void 0?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$Eg)===null||t===void 0||t.forEach(e=>{var s;return(s=e.hostDisconnected)===null||s===void 0?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ES(t,e,s=nt){var r,n;let o=this.constructor._$Eh(t,s);if(o!==void 0&&s.reflect===!0){let h=((n=(r=s.converter)===null||r===void 0?void 0:r.toAttribute)!==null&&n!==void 0?n:ot.toAttribute)(e,s.type);this._$Ei=t,h==null?this.removeAttribute(o):this.setAttribute(o,h),this._$Ei=null}}_$AK(t,e){var s,r,n;let o=this.constructor,h=o._$Eu.get(t);if(h!==void 0&&this._$Ei!==h){let l=o.getPropertyOptions(h),a=l.converter,p=(n=(r=(s=a)===null||s===void 0?void 0:s.fromAttribute)!==null&&r!==void 0?r:typeof a=="function"?a:null)!==null&&n!==void 0?n:ot.fromAttribute;this._$Ei=h,this[h]=p(e,l.type),this._$Ei=null}}requestUpdate(t,e,s){let r=!0;t!==void 0&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||At)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Ei!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,s))):r=!1),!this.isUpdatePending&&r&&(this._$Ep=this._$E_())}async _$E_(){this.isUpdatePending=!0;try{await this._$Ep}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Et&&(this._$Et.forEach((r,n)=>this[n]=r),this._$Et=void 0);let e=!1,s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$Eg)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostUpdate)===null||n===void 0?void 0:n.call(r)}),this.update(s)):this._$EU()}catch(r){throw e=!1,this._$EU(),r}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$Eg)===null||e===void 0||e.forEach(s=>{var r;return(r=s.hostUpdated)===null||r===void 0?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$Ep}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((e,s)=>this._$ES(s,this[s],e)),this._$EC=void 0),this._$EU()}updated(t){}firstUpdated(t){}};$.finalized=!0,$.elementProperties=new Map,$.elementStyles=[],$.shadowRootOptions={mode:"open"},mt?.({ReactiveElement:$}),((rt=globalThis.reactiveElementVersions)!==null&&rt!==void 0?rt:globalThis.reactiveElementVersions=[]).push("1.3.2");var lt,M=globalThis.trustedTypes,yt=M?M.createPolicy("lit-html",{createHTML:i=>i}):void 0,_=`lit$${(Math.random()+"").slice(9)}$`,at="?"+_,Xt=`<${at}>`,N=document,D=(i="")=>N.createComment(i),k=i=>i===null||typeof i!="object"&&typeof i!="function",xt=Array.isArray,Tt=i=>{var t;return xt(i)||typeof((t=i)===null||t===void 0?void 0:t[Symbol.iterator])=="function"},L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,gt=/-->/g,bt=/>/g,C=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,wt=/'/g,Et=/"/g,Ut=/^(?:script|style|textarea|title)$/i,Pt=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),te=Pt(1),ye=Pt(2),f=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),St=new WeakMap,ht=(i,t,e)=>{var s,r;let n=(s=e?.renderBefore)!==null&&s!==void 0?s:t,o=n._$litPart$;if(o===void 0){let h=(r=e?.renderBefore)!==null&&r!==void 0?r:null;n._$litPart$=o=new g(t.insertBefore(D(),h),h,void 0,e??{})}return o._$AI(i),o},H=N.createTreeWalker(N,129,null,!1),Ot=(i,t)=>{let e=i.length-1,s=[],r,n=t===2?"<svg>":"",o=L;for(let l=0;l<e;l++){let a=i[l],p,c,d=-1,v=0;for(;v<a.length&&(o.lastIndex=v,c=o.exec(a),c!==null);)v=o.lastIndex,o===L?c[1]==="!--"?o=gt:c[1]!==void 0?o=bt:c[2]!==void 0?(Ut.test(c[2])&&(r=RegExp("</"+c[2],"g")),o=C):c[3]!==void 0&&(o=C):o===C?c[0]===">"?(o=r??L,d=-1):c[1]===void 0?d=-2:(d=o.lastIndex-c[2].length,p=c[1],o=c[3]===void 0?C:c[3]==='"'?Et:wt):o===Et||o===wt?o=C:o===gt||o===bt?o=L:(o=C,r=void 0);let O=o===C&&i[l+1].startsWith("/>")?" ":"";n+=o===L?a+Xt:d>=0?(s.push(p),a.slice(0,d)+"$lit$"+a.slice(d)+_+O):a+_+(d===-2?(s.push(void 0),l):O)}let h=n+(i[e]||"<?>")+(t===2?"</svg>":"");if(!Array.isArray(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return[yt!==void 0?yt.createHTML(h):h,s]},x=class{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0,h=t.length-1,l=this.parts,[a,p]=Ot(t,e);if(this.el=x.createElement(a,s),H.currentNode=this.el.content,e===2){let c=this.el.content,d=c.firstChild;d.remove(),c.append(...d.childNodes)}for(;(r=H.nextNode())!==null&&l.length<h;){if(r.nodeType===1){if(r.hasAttributes()){let c=[];for(let d of r.getAttributeNames())if(d.endsWith("$lit$")||d.startsWith(_)){let v=p[o++];if(c.push(d),v!==void 0){let O=r.getAttribute(v.toLowerCase()+"$lit$").split(_),w=/([.?@])?(.*)/.exec(v);l.push({type:1,index:n,name:w[2],strings:O,ctor:w[1]==="."?G:w[1]==="?"?J:w[1]==="@"?F:U})}else l.push({type:6,index:n})}for(let d of c)r.removeAttribute(d)}if(Ut.test(r.tagName)){let c=r.textContent.split(_),d=c.length-1;if(d>0){r.textContent=M?M.emptyScript:"";for(let v=0;v<d;v++)r.append(c[v],D()),H.nextNode(),l.push({type:2,index:++n});r.append(c[d],D())}}}else if(r.nodeType===8)if(r.data===at)l.push({type:2,index:n});else{let c=-1;for(;(c=r.data.indexOf(_,c+1))!==-1;)l.push({type:7,index:n}),c+=_.length-1}n++}}static createElement(t,e){let s=N.createElement("template");return s.innerHTML=t,s}};function T(i,t,e=i,s){var r,n,o,h;if(t===f)return t;let l=s!==void 0?(r=e._$Cl)===null||r===void 0?void 0:r[s]:e._$Cu,a=k(t)?void 0:t._$litDirective$;return l?.constructor!==a&&((n=l?._$AO)===null||n===void 0||n.call(l,!1),a===void 0?l=void 0:(l=new a(i),l._$AT(i,e,s)),s!==void 0?((o=(h=e)._$Cl)!==null&&o!==void 0?o:h._$Cl=[])[s]=l:e._$Cu=l),l!==void 0&&(t=T(i,l._$AS(i,t.values),l,s)),t}var K=class{constructor(t,e){this.v=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(t){var e;let{el:{content:s},parts:r}=this._$AD,n=((e=t?.creationScope)!==null&&e!==void 0?e:N).importNode(s,!0);H.currentNode=n;let o=H.nextNode(),h=0,l=0,a=r[0];for(;a!==void 0;){if(h===a.index){let p;a.type===2?p=new g(o,o.nextSibling,this,t):a.type===1?p=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(p=new Z(o,this,t)),this.v.push(p),a=r[++l]}h!==a?.index&&(o=H.nextNode(),h++)}return n}m(t){let e=0;for(let s of this.v)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},g=class{constructor(t,e,s,r){var n;this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cg=(n=r?.isConnected)===null||n===void 0||n}get _$AU(){var t,e;return(e=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&e!==void 0?e:this._$Cg}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=T(this,t,e),k(t)?t===u||t==null||t===""?(this._$AH!==u&&this._$AR(),this._$AH=u):t!==this._$AH&&t!==f&&this.$(t):t._$litType$!==void 0?this.T(t):t.nodeType!==void 0?this.k(t):Tt(t)?this.S(t):this.$(t)}M(t,e=this._$AB){return this._$AA.parentNode.insertBefore(t,e)}k(t){this._$AH!==t&&(this._$AR(),this._$AH=this.M(t))}$(t){this._$AH!==u&&k(this._$AH)?this._$AA.nextSibling.data=t:this.k(N.createTextNode(t)),this._$AH=t}T(t){var e;let{values:s,_$litType$:r}=t,n=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=x.createElement(r.h,this.options)),r);if(((e=this._$AH)===null||e===void 0?void 0:e._$AD)===n)this._$AH.m(s);else{let o=new K(n,this),h=o.p(this.options);o.m(s),this.k(h),this._$AH=o}}_$AC(t){let e=St.get(t.strings);return e===void 0&&St.set(t.strings,e=new x(t)),e}S(t){xt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,r=0;for(let n of t)r===e.length?e.push(s=new g(this.M(D()),this.M(D()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)===null||s===void 0||s.call(this,!1,!0,e);t&&t!==this._$AB;){let r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cg=t,(e=this._$AP)===null||e===void 0||e.call(this,t))}},U=class{constructor(t,e,s,r,n){this.type=1,this._$AH=u,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=u}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,s,r){let n=this.strings,o=!1;if(n===void 0)t=T(this,t,e,0),o=!k(t)||t!==this._$AH&&t!==f,o&&(this._$AH=t);else{let h=t,l,a;for(t=n[0],l=0;l<n.length-1;l++)a=T(this,h[s+l],e,l),a===f&&(a=this._$AH[l]),o||(o=!k(a)||a!==this._$AH[l]),a===u?t=u:t!==u&&(t+=(a??"")+n[l+1]),this._$AH[l]=a}o&&!r&&this.C(t)}C(t){t===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},G=class extends U{constructor(){super(...arguments),this.type=3}C(t){this.element[this.name]=t===u?void 0:t}},ee=M?M.emptyScript:"",J=class extends U{constructor(){super(...arguments),this.type=4}C(t){t&&t!==u?this.element.setAttribute(this.name,ee):this.element.removeAttribute(this.name)}},F=class extends U{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){var s;if((t=(s=T(this,t,e,0))!==null&&s!==void 0?s:u)===f)return;let r=this._$AH,n=t===u&&r!==u||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,o=t!==u&&(r===u||n);n&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,s;typeof this._$AH=="function"?this._$AH.call((s=(e=this.options)===null||e===void 0?void 0:e.host)!==null&&s!==void 0?s:this.element,t):this._$AH.handleEvent(t)}},Z=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){T(this,t)}},Ht={L:"$lit$",P:_,V:at,I:1,N:Ot,R:K,j:Tt,D:T,H:g,F:U,O:J,W:F,B:G,Z},Ct=window.litHtmlPolyfillSupport;Ct?.(x,g),((lt=globalThis.litHtmlVersions)!==null&&lt!==void 0?lt:globalThis.litHtmlVersions=[]).push("2.2.5");var ct,dt;var m=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Dt=void 0}createRenderRoot(){var t,e;let s=super.createRenderRoot();return(t=(e=this.renderOptions).renderBefore)!==null&&t!==void 0||(e.renderBefore=s.firstChild),s}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Dt=ht(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Dt)===null||t===void 0||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Dt)===null||t===void 0||t.setConnected(!1)}render(){return f}};m.finalized=!0,m._$litElement$=!0,(ct=globalThis.litElementHydrateSupport)===null||ct===void 0||ct.call(globalThis,{LitElement:m});var Mt=globalThis.litElementPolyfillSupport;Mt?.({LitElement:m});((dt=globalThis.litElementVersions)!==null&&dt!==void 0?dt:globalThis.litElementVersions=[]).push("3.2.0");var se=()=>{let{cssRules:i}=Array.from(document.styleSheets).filter(e=>e.href.indexOf("web-lit")>=0)[0]||{};return i?[i&&W([Object.values(i).map(e=>e.cssText).join(`
`)])]:[]},Nt=se();var Rt=class extends m{static get styles(){return Nt}};var R={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},A=i=>(...t)=>({_$litDirective$:i,values:t}),b=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var ie=A(class extends b{constructor(i){var t;if(super(i),i.type!==R.ATTRIBUTE||i.name!=="style"||((t=i.strings)===null||t===void 0?void 0:t.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(i){return Object.keys(i).reduce((t,e)=>{let s=i[e];return s==null?t:t+`${e=e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(i,[t]){let{style:e}=i.element;if(this.ct===void 0){this.ct=new Set;for(let s in t)this.ct.add(s);return this.render(t)}this.ct.forEach(s=>{t[s]==null&&(this.ct.delete(s),s.includes("-")?e.removeProperty(s):e[s]="")});for(let s in t){let r=t[s];r!=null&&(this.ct.add(s),s.includes("-")?e.setProperty(s,r):e[s]=r)}return f}});var{H:qe}=Ht;var Bt=i=>i.strings===void 0;var j=(i,t)=>{var e,s;let r=i._$AN;if(r===void 0)return!1;for(let n of r)(s=(e=n)._$AO)===null||s===void 0||s.call(e,t,!1),j(n,t);return!0},Q=i=>{let t,e;do{if((t=i._$AM)===void 0)break;e=t._$AN,e.delete(i),i=t}while(e?.size===0)},Lt=i=>{for(let t;t=i._$AM;i=t){let e=t._$AN;if(e===void 0)t._$AN=e=new Set;else if(e.has(i))break;e.add(i),oe(t)}};function re(i){this._$AN!==void 0?(Q(this),this._$AM=i,Lt(this)):this._$AM=i}function ne(i,t=!1,e=0){let s=this._$AH,r=this._$AN;if(r!==void 0&&r.size!==0)if(t)if(Array.isArray(s))for(let n=e;n<s.length;n++)j(s[n],!1),Q(s[n]);else s!=null&&(j(s,!1),Q(s));else j(this,i)}var oe=i=>{var t,e,s,r;i.type==R.CHILD&&((t=(s=i)._$AP)!==null&&t!==void 0||(s._$AP=ne),(e=(r=i)._$AQ)!==null&&e!==void 0||(r._$AQ=re))},Y=class extends b{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,s){super._$AT(t,e,s),Lt(this),this.isConnected=t._$AU}_$AO(t,e=!0){var s,r;t!==this.isConnected&&(this.isConnected=t,t?(s=this.reconnected)===null||s===void 0||s.call(this):(r=this.disconnected)===null||r===void 0||r.call(this)),e&&(j(this,t),Q(this))}setValue(t){if(Bt(this._$Ct))this._$Ct._$AI(t,this);else{let e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}};var le=()=>new pt,pt=class{},ut=new WeakMap,ae=A(class extends Y{render(i){return u}update(i,[t]){var e;let s=t!==this.U;return s&&this.U!==void 0&&this.ot(void 0),(s||this.rt!==this.lt)&&(this.U=t,this.ht=(e=i.options)===null||e===void 0?void 0:e.host,this.ot(this.lt=i.element)),u}ot(i){var t;if(typeof this.U=="function"){let e=(t=this.ht)!==null&&t!==void 0?t:globalThis,s=ut.get(e);s===void 0&&(s=new WeakMap,ut.set(e,s)),s.get(this.U)!==void 0&&this.U.call(this.ht,void 0),s.set(this.U,i),i!==void 0&&this.U.call(this.ht,i)}else this.U.value=i}get rt(){var i,t,e;return typeof this.U=="function"?(t=ut.get((i=this.ht)!==null&&i!==void 0?i:globalThis))===null||t===void 0?void 0:t.get(this.U):(e=this.U)===null||e===void 0?void 0:e.value}disconnected(){this.rt===this.lt&&this.ot(void 0)}reconnected(){this.ot(this.lt)}});var P=class extends b{constructor(t){if(super(t),this.it=u,t.type!==R.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===u||t==null)return this.ft=void 0,this.it=t;if(t===f)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this.ft;this.it=t;let e=[t];return e.raw=e,this.ft={_$litType$:this.constructor.resultType,strings:e,values:[]}}};P.directiveName="unsafeHTML",P.resultType=1;var he=A(P);var I=class extends P{};I.directiveName="unsafeSVG",I.resultType=2;var ce=A(I);export{de as Ajax,m as LitElement,et as PubSub,tt as Store,Rt as WebElement,le as createRef,W as css,te as html,y as pubsub,ae as ref,ht as render,vt as store,ie as styleMap,he as unsafeHTML,ce as unsafeSVG,Nt as webLitStyles,ue as worker};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
//# sourceMappingURL=web-lit.js.map
