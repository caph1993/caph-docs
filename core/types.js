/** @typedef {Object} Elem */
/** @typedef {Object} Context */
/** @typedef {Object} Fragment */

/** @namespace */
var preact = (() => {
  const any = /**@type {any} **/(null);
  /** @typedef {()=>(void|Promise<void>)} DismountEffect */
  /** @template T @function @param {T|(()=>T)} initial @returns {[T, ((value:T)=>void)]} */ function useState(initial) { return any; };
  /** @template T @function @param {()=>T} effect @param {any[]?} deps @returns {T} */ function useMemo(effect, deps) { return any; };
  /** @template F @function @param {F} callback @param {any[]?} deps @returns {F} */ function useCallback(callback, deps) { return any; };
  const useEffect = /** @type {(effect: (()=>(void|Promise<void>|DismountEffect)), deps?:any[])=>void}*/(any);
  const render = /** @type {(Elem, HTMLElement)=>void}*/(any);
  const createElement = /** @type {(tag:string, props?, ...children)=>Elem}  */(any);
  const createContext = /** @type {()=>Context} */(any);
  const Fragment = /** @type {Fragment} */(any);
  /** @lends preact */
  let typed = {
    useState, useMemo, useCallback, useEffect,
    render, createElement, createContext, Fragment,
  };
  typed = eval("window.preact"); // Critical!
  return typed;
})();

/** @typedef {Object} FabricLibrary */
//@ts-ignore
var /**@type {Window}*/ window = window || {};

//@ts-ignore
var /**@type {FabricLibrary}*/fabric = window.fabric;