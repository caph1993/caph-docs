/**
 * @typedef {Object} T_PreactVDomElement
*/
/**
 * @typedef {Object} T_PreactContext
*/
/**
 * @typedef {Object} T_PreactFragment
*/
/**
 * @template T
 * @typedef {Object} Preact<T>
 * @property {(initial:T|(()=>T))=>[T, ((T)=>void)]} useState
 * @property {(effect:(()=>void)|(()=>(()=>void)), deps?)=>void} useEffect
 * @property {(effect:(()=>T), deps?)=> T} useMemo
 * @property {(T_PreactVDomElement, HTMLElement)=>void} render
 * @property {(tag:string, props?, ...children)=>T_PreactVDomElement} createElement
 * @property {()=>T_PreactContext} createContext
 * @property {T_PreactFragment} Fragment
*/

//@ts-ignore
var /**@type {Preact}*/preact = window.preact;

//@ts-ignore
var /**@type {Window}*/ window = window || {};
