/**
 * Runs synchronously in <head>, before first paint and before any React code.
 *
 * 1. Network awareness: reads the Network Information API (Chromium browsers and
 *    Android) and marks <html data-net="lite"> on 2G, 3G or when Data Saver is on.
 *    Lite mode switches to system fonts and drops decorative layers and motion.
 *    Browsers without the API (Safari, Firefox) get the full experience, which is
 *    built to be light by default.
 * 2. Motion: adds `.motion` only when the network is fast and the visitor has not
 *    asked for reduced motion. Without it every element is visible and static.
 * 3. Scroll reveals: one IntersectionObserver for all [data-reveal]/[data-split]
 *    elements, attached by a MutationObserver while the HTML streams in, so
 *    reveals never wait for hydration. The revealed state is a `data-shown`
 *    attribute that React never manages, so re-renders (opening an accordion,
 *    switching a tab) can never hide an element again.
 */
export const BOOT_SCRIPT = `(function(){
var d=document.documentElement,c=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
function slow(){try{return !!(c&&(c.saveData||/2g|3g/.test(c.effectiveType||'')))}catch(e){return false}}
var lite=slow();d.setAttribute('data-net',lite?'lite':'full');
if(c&&c.addEventListener){c.addEventListener('change',function(){d.setAttribute('data-net',slow()?'lite':'full')})}
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
if(lite||reduce||!('IntersectionObserver' in window)||!('MutationObserver' in window))return;
d.classList.add('motion');
var sel='[data-reveal],[data-split]';
var io=new IntersectionObserver(function(es){for(var i=0;i<es.length;i++){var e=es[i];if(e.isIntersecting){e.target.setAttribute('data-shown','');io.unobserve(e.target)}}},{rootMargin:'0px 0px -7% 0px',threshold:0.12});
function add(n){if(n.nodeType!==1)return;if(n.matches(sel))io.observe(n);var l=n.querySelectorAll(sel);for(var i=0;i<l.length;i++)io.observe(l[i])}
new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var a=ms[i].addedNodes;for(var j=0;j<a.length;j++)add(a[j])}}).observe(d,{childList:true,subtree:true});
window.__eamReveal=function(){var l=document.querySelectorAll(sel);for(var i=0;i<l.length;i++)io.observe(l[i])};
})();`;
