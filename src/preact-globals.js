//@ts-check
import { MyPromise } from "./utils";
import { parser, plugin } from "./preact-parser";
import { createContext, render } from "preact";
import {useMemo, useCallback, useState, useEffect} from 'preact/hooks';

export const contexts = {};
contexts['core-menu'] = createContext(null);

export const _globals = {};
export function dispatchGlobal(eventName, value) {
  //console.log('Dispatch', eventName, value);
  _globals[eventName] = value;
  let event = new CustomEvent(eventName, {detail:value});
  window.dispatchEvent(event);
  return;
}
export async function untilGlobal(eventName) {
  await MyPromise.until(() => _globals[eventName]);
  await MyPromise.sleep(500);
}
export function listenToGlobal(eventName) {
  const initial = useMemo(()=>_globals[eventName], [eventName]);
  const [value, setValue] = useState(initial);
  listenToEvent(eventName, setValue);
  return value;
}

export const menu = new class {
  constructor() {
    this.addOption('Default', { hold: true });
    this.latest = this.option = 'Default';
  }
  options = [];
  onEnter = {};
  onExit = {};
  hold = {};

  /**
   * @param {string} option
   * @param {{onEnter?:()=>void, onExit?:()=>void, hold?:boolean}} options
  */
  addOption(option, { onEnter, onExit, hold } = {}) {
    this.onEnter[option] = onEnter;
    this.onExit[option] = onExit;
    this.hold[option] = hold;
    if (this.options[option]) return;
    this.options.push(option);
    this.options[option] = 1;
    dispatchGlobal('caph-menu-options', Math.random());
  }
  setOption(option) {
    dispatchGlobal('caph-menu-option', Math.random());
    if (this.hold[option]) {
      this.onExit[this.latest] && this.onExit[this.latest]();
      this.latest = this.option;
      this.option = option;
    }
    this.onEnter[option] && this.onEnter[option]();
  }
};

export async function inject(vDom) {
  // const node = MyDocument.createElement('div', {
  //   parent: document.body,
  //   where: 'afterbegin',
  //   id: 'core-body',
  // })
  const node = document.body;
  render(vDom, node);
}

MyPromise.until(() => document.body).then(()=>{
  inject(parser.parse`
    <${plugin('@core-menu')}/>
    <${plugin('@core-about')}/>
  `);
});

/**
 * @param {string} eventName 
 * @param {(data:any)=>void} callback 
 */
export function listenToEvent(eventName, callback) {
  useEffect(() => {
    const actualCallback = (/** @type {Event|CustomEvent}*/ e) => {
      //@ts-ignore: event.detail is not defined for non-custom events
      try{callback(e.detail);}
      catch(err){}
    }
    window.addEventListener(eventName, actualCallback);
    return () => {
      window.removeEventListener(eventName, actualCallback);
    }
  }, [eventName, callback]);
}

