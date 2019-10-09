"use strict";function h(e,t){let n=t||{},r=n.key||null,o=[];for(let e=2;e<arguments.length;e++){let t=arguments[e];null==t||!0===t||!1===t||("number"==typeof t||"string"==typeof t?o.push({type:"text",props:{nodeValue:t}}):o.push(t))}return o.length&&(n.children=1===o.length?o[0]:o),delete n.key,{type:e,props:n,key:r}}function updateProperty(e,t,n,r){if("style"===t){for(let o in n)r[o]||(e[t][o]="");for(let n in r)e[t][n]=r[n]}else"o"===t[0]&&"n"===t[1]?(t=t.slice(2).toLowerCase(),n&&e.removeEventListener(t,n),e.addEventListener(t,r)):t in e&&!(e instanceof SVGElement)?e[t]=null==r?"":r:null==r||!1===r?e.removeAttribute(t):e.setAttribute(t,r)}function updateElement(e,t,n){Object.keys(n).filter(isNew(t,n)).forEach(r=>updateProperty(e,r,t[r],n[r]))}function createElement(e){const t="text"===e.type?document.createTextNode(""):e.tag===SVG?document.createElementNS("http://www.w3.org/2000/svg",e.type):document.createElement(e.type);return updateElement(t,[],e.props),t}const isNew=(e,t)=>n=>"children"!==n&&e[n]!==t[n];let cursor=0;function update(e,t,n){const r=this?this:getWIP();n=t?t(r.state[e],n):n,r.state[e]=n,scheduleWork(r,!0)}function resetCursor(){cursor=0}function useState(e){return useReducer(null,e)}function useReducer(e,t){let n=getWIP()||{},r="$"+cursor,o=update.bind(n,r,e);cursor++;let l=n.state||{};return r in l?[l[r],o]:(n.state[r]=t,[t,o])}function useEffect(e,t){let n=getWIP()||{},r="$"+cursor;n.effect=n.effect||{},n.effect[r]=useCallback(e,t),cursor++}function useCallback(e,t){return useMemo(()=>e,t)}function useMemo(e,t){let n=getWIP()||{},r=!t||(n.oldInputs||[]).some((e,n)=>t[n]!==e);return!t||t.length||n.isMounted||(r=!0,n.isMounted=!0),n.oldInputs=t,r||!n.isMounted?n.memo=e():n.memo}function push(e,t){let n=e.length;for(e.push(t);;){let r=Math.floor((n-1)/2),o=e[r];if(!(o&&compare(o,t)>0))return;e[r]=t,e[n]=o,n=r}}function pop(e){let t=e[0];if(t){let n=e.pop();if(t!==n){e[0]=n;let t=0,r=e.length;for(;t<r;){let r=2*(t+1)-1,o=e[r],l=r+1,u=e[l];if(o&&compare(o,n)<0)u&&compare(u,o)<0?(e[t]=u,e[l]=n,t=l):(e[t]=o,e[r]=n,t=r);else{if(!(u&&compare(u,n)<0))return;e[t]=u,e[l]=n,t=l}}}return t}return null}function compare(e,t){return e.dueTime-t.dueTime}function peek(e){return e[0]||null}let taskQueue=[],currentTask=null,currentCallback=null,inMC=!1,frameLength=5,frameDeadline=0;function scheduleCallback(e){const t=getTime();let n={callback:e,startTime:t,dueTime:t+5e3};return push(taskQueue,n),requestHostCallback(flushWork),n}function requestHostCallback(e){currentCallback=e,inMC||(inMC=!0,planWork())}function flushWork(e){try{return workLoop(e)}finally{currentTask=null}}function workLoop(e){let t=e;for(currentTask=peek(taskQueue);currentTask&&!(currentTask.dueTime>t&&shouldYeild());){let e=currentTask.callback;if(e){currentTask.callback=null;let t=e();t?currentTask.callback=t:currentTask===peek(taskQueue)&&pop(taskQueue)}else pop(taskQueue);currentTask=peek(taskQueue)}return!!currentTask}function performWork(){if(currentCallback){let e=getTime();frameDeadline=e+frameLength,currentCallback(e)?planWork():(inMC=!1,currentCallback=null)}else inMC=!1}const planWork=(()=>{if("undefined"!=typeof MessageChannel){const e=new MessageChannel,t=e.port2;return e.port1.onmessage=performWork,()=>t.postMessage(null)}return()=>setTimeout(performWork,0)})();function shouldYeild(){return getTime()>frameDeadline}const getTime=()=>performance.now(),options={},[HOST,HOOK,ROOT,SVG,PLACE,UPDATE,DELETE]=[0,1,2,3,4,5,6];let nextWork=null,pendingCommit=null,currentFiber=null;function render(e,t,n){scheduleWork({tag:ROOT,node:t,props:{children:e},done:n})}function scheduleWork(e,t){e.up=t,nextWork=e,scheduleCallback(performWork$1)}function performWork$1(){for(;nextWork&&!shouldYeild();)nextWork=performNext(nextWork);return pendingCommit?(commitWork(pendingCommit),null):performWork$1.bind(null)}function performNext(e){if(e.parentNode=getParentNode(e),e.patches=e.patches||[],e.tag==HOOK?updateHOOK(e):updateHost(e),e.child)return e.child;for(;e;){if(completeWork(e),e.sibling)return e.sibling;e=e.parent}}function updateHost(e){e.node||("svg"===e.type&&(e.tag=SVG),e.node=createElement(e));let t=e.parentNode||{};e.insertPoint=t.lastFiber||null,t.lastFiber=e,e.node.lastFiber=null,reconcileChildren(e,e.props.children)}function updateHOOK(e){e.props=e.props||{},e.state=e.state||{},currentFiber=e,resetCursor(),reconcileChildren(e,e.type(e.props))}function getParentNode(e){let t=e.parent;if(!t)return e.node;for(;t.tag===HOOK;)t=t.parent;return t.node}function reconcileChildren(e,t){const n=e.kids,r=e.kids=hashfy(t,e.kids);let o={};for(const t in n){let l=r[t],u=n[t];l&&l.type===u.type?o[t]=u:(u.patchTag=DELETE,e.patches.push(u))}let l=null,u=null;for(const t in r){let n=r[t],s=o[t];s?(u=createFiber(s,{patchTag:UPDATE}),n.patchTag=UPDATE,(n=merge(u,n)).alternate=u,shouldPlace(n)&&(n.patchTag=PLACE)):n=createFiber(n,{patchTag:PLACE}),r[t]=n,n.parent=e,l?l.sibling=n:(e.tag===SVG&&(n.tag=SVG),e.child=n),l=n}l&&(l.sibling=null)}function createFiber(e,t){return t.tag="function"==typeof e.type?HOOK:HOST,merge(e,t)}function completeWork(e){e.parent?e.parent.patches=(e.parent.patches||[]).concat(e.patches||[],e.patchTag?[e]:[]):pendingCommit=e}function commitWork(e){e.patches.forEach(e=>{e.patches=e.parent.patches=null,commit(e),traverse(e.effect)}),e.done&&e.done(),nextWork=pendingCommit=null}function traverse(e){for(const t in e){(0,e[t])()}}function shouldPlace(e){let t=e.parent;return!!t&&(t.tag===HOOK?t.key&&!t.up:void 0)}function commit(e){let t=e.patchTag,n=e.parentNode,r=e.node;for(;!r;)r=e.child.node;if(t===DELETE)n.removeChild(r);else if(e.tag===HOOK);else if(t===UPDATE)updateElement(r,e.alternate.props,e.props);else{let t=e.insertPoint?e.insertPoint.node:null,o=t?t.nextSibling:n.firstChild;if(o===r)return;if(null===o&&r===n.lastChild)return;n.insertBefore(r,o)}}function getWIP(){return currentFiber||null}const arrayfy=e=>e?e.pop?e:[e]:[];function hashfy(e){let t={},n=0,r=0;return arrayfy(e).forEach(e=>{e.pop?(e.forEach(e=>{let o=e.key;o?t["."+n+"."+o]=e:(t["."+n+"."+r]=e)&&r++}),n++):(t["."+n]=e)&&n++}),t}function merge(e,t){let n={};for(const t in e)n[t]=e[t];for(const e in t)n[e]=t[e];return n}exports.createElement=h,exports.h=h,exports.options=options,exports.render=render,exports.scheduleWork=scheduleWork,exports.useCallback=useCallback,exports.useEffect=useEffect,exports.useMemo=useMemo,exports.useReducer=useReducer,exports.useState=useState;
//# sourceMappingURL=fre.js.map
