//@ts-check

/** https://github.com/Microsoft/TypeScript/issues/23405#issuecomment-873331031 */
/** @template T  @param {T} value @param {string} [valueName] @returns {T extends undefined ? never : T} */
export function assertDefined(value, valueName) {
  if (value === undefined) {
    throw new Error(`Encountered unexpected undefined value${valueName? ` for '${valueName}'` : ""}`);
  }
  return /** @type {*} */ (value);
}

/** @template T @param {T} value @returns {T extends null ? never : T} */
export function assertNonNull(value) {
  if (!value && (value===null||value === undefined)) throw new Error(`Encountered unexpected undefined value`);
  return /** @type {*} */ (value);
}

/** @template T @param {T} value @returns {T extends null ? never : T} */
export function nonNull(value) { return /** @type {*} */ (value); }

/** @type {(n: number) => number[]} */
export function range(n) {
  return [...Array(n).fill(0)].map((x,i)=>i);
}

/** @type {(obj: any) => obj is String} */
export function isString(obj) {
  return Object.prototype.toString.call(obj) === "[object String]";
}

export function rand32(){
  return Math.floor(Math.random()*(1<<32))
}

// utils = {
//   unindent: (text) => {
//     let lines = text.split('\n');
//     let n = lines.filter(l => l.trim().length)
//       .map(l => l.length - l.trimStart().length)
//       .reduce((p, c) => Math.min(c, p), 1000);
//     return lines.map(l => l.slice(n)).join('\n');
//   }
// };
// _URL_resolve(url) {
//   return new URL(url, document.baseURI).href;
// }
// // _URL_is_absolute(url) {
// //   //https://stackoverflow.com/q/10687099
// //   return new URL(document.baseURI).origin !== new URL(url, document.baseURI).origin;
// // }

// _html_safe(str) {
//   // e.g. converts < into &lt;
//   return new Option(str).innerHTML;
// }
// _html_safe_undo(str) {
//   // e.g. converts &lt; into <
//   const doc = new DOMParser().parseFromString(str, "text/html");
//   const text = doc.documentElement.textContent;
//   return text;
// }


export function assert(/** @type {boolean|any}*/condition, ...messages) {
  if (condition) return;
  throw new Error(...messages);
}

export function sleep(/** @type {number}*/ms) {
  return new Promise((ok, err) => setTimeout(ok, ms));
}

/** @param {any} first @param {any} second  @param {any[]} more*/
export function assertEq(first, second, ...more) {
  for(let other of [second, ...more]){
    if (first==other) continue;
    if (Array.isArray(first) && Array.isArray(other) && arrayEq(first, other)) continue;
    throw new Error('Elements are different');
  }
}
/** @param {any[]} first @param {any[]} second  @param {any[][]} more*/
export function arrayEq(first, second, ...more) {
  for(let other of [second, ...more]){
    if(first.length != other.length) return false;
    for(let i=0;i<first.length;i++){
      if(first[i]!=other[i]) return false;
    }
  }
  return true;
}

class MyBoolean {
  static assert(condition, ...messages) {
    if (condition) return;
    throw new Error(...messages);
  }
  static all(arr) {
    for (let x of arr) if (!x) return false;
    return true;
  }
  static any(arr) {
    for (let x of arr) if (x) return true;
    return false;
  }
  static assert_all(arr, ...messages) { assert(this.all(arr), ...messages); }
  static assert_any(arr, ...messages) { assert(this.any(arr), ...messages); }
}


class MyArray {
  static any(arr) {
    for (let x of arr) if (x) return true;
    return false;
  }
  static all(arr) {
    for (let x of arr) if (!x) return false;
    return true;
  }
  static sum(arr) {
    return arr.reduce((p, c) => p + c, 0);
  }
  static max(arr, initialValue) {
    initialValue = initialValue || 0;
    return arr.reduce((p, c) => Math.max(p, c), initialValue);
  }
  static min(arr, initialValue) {
    initialValue = initialValue || 1e10;
    return arr.reduce((p, c) => Math.min(p, c), initialValue);
  }
  static zeros(n) {
    const l = [];
    for (let i = 0; i < n; i++)l.push(0);
    return l;
  }
  static arange(n) {
    return MyArray.zeros(n).map((z, i) => i);
  }
  static sEquality(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; ++i) if (a[i] != b[i]) return false;
    return true;
  }
  static hEquality(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; ++i) if (a[i] !== b[i]) return false;
    return true;
  }
}

export class MyPromise {
  static async sleep(ms) {
    await new Promise((ok, err) => setTimeout(ok, ms));
  }
  static async finish_all(promises, { debug = false } = {}) {
    // Ensures completion of all promises even if some throw exceptions
    return await new Promise((ok, err) => {
      if (promises.length == 0) return ok([]);
      let any_error = false;
      let cnt = 0;
      let outs = promises.map((p) => null);
      Promise.all(promises.map(async (p, i) => {
        try { outs[i] = await p; }
        catch (e) {
          any_error = true; outs[i] = e;
          if (debug) console.error(...e);
        }
        cnt++;
        if (cnt == promises.length) {
          if (any_error) err(outs);
          else ok(outs);
        }
      }));
    });
  }
  static async finish_all_log(promises) {
    try { var outs = await MyPromise.finish_all(promises); }
    catch (err) {
      var outs = err; console.error(...err);
      err.forEach(e => console.warn(...e));
    }
    return outs;
  }

  static async until(/** @type {()=>any}*/ func, { ms = 200, timeout = 0 } = {}) {
    if (timeout && ms > timeout) ms = timeout / 10;
    let t0 = (new Date()).getTime();
    let value;
    while (!(value = await func())) {
      if (timeout && (new Date()).getTime()-t0 > timeout)
        throw MyPromise.Timeout;
      await sleep(ms);
    }
    return value;
  }
  static Timeout = new Error('Timeout');
  static async timeout(promise, ms) {
    let finished = false;
    let [resp, _] = await Promise.all([
      promise.then(e => { finished = true; return e; }),
      MyPromise.until(() => finished, { timeout: ms })
    ]);
    return resp;
  }
}
export const until=MyPromise.until;


export class MyDocument {

  /**
   * @param {string} tag 
   * @param {{
   *  style?: {[key: string]: string},
   *  id?: string,
   * classList?: string[],
   * text?: string,
   * html?: string,
   * eventListeners?: {[key: string]: (e: Event) => void},
   * parent?: HTMLElement,
   * where?: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend',
   * }} options
   * @returns {HTMLElement}
   */
  static createElement(tag, {
    style = {}, id, classList = [], text, html,
    eventListeners = {}, parent, where, ...attrs } = {}) {
    let e = document.createElement(tag);
    if(id!==undefined) e.setAttribute("id", id);
    classList.forEach(s => e.classList.add(s));
    if (text !==undefined) e.innerText = text;
    if (html !==undefined) e.innerHTML = html;
    if (id !==undefined) e.id = id;
    MyObject.forEach(attrs, (value, key) => e.setAttribute(key, value));
    MyObject.forEach(style, (value, key) => e.style[key] = value);
    MyObject.forEach(eventListeners, (value, key) =>
      e.addEventListener(key, value));
    if (parent || where) {
      parent = parent || document.body;
      where = where || 'beforeend';
      parent.insertAdjacentElement(where, e);
    }
    return e;
  }
  static right_click(element) {
    element.focus();
    if (window.CustomEvent) {
      element.dispatchEvent(new CustomEvent('contextmenu'));
    } else if (document.createEvent) {
      var ev = document.createEvent('HTMLEvents');
      ev.initEvent('contextmenu', true, false);
      element.dispatchEvent(ev);
    } else { // Internet Explorer
      element.fireEvent('oncontextmenu');
    }
    // return;
    // element.focus();
    // let e = element.ownerDocument.createEvent('MouseEvents');
    // e.initMouseEvent('contextmenu', true, true,
    //   element.ownerDocument.defaultView, 1, 0, 0, 0, 0, false,
    //   false, false, false, 2, null);
    // return !element.dispatchEvent(e);
  }
}

class MyObject {

  static indexBy(arr, key) {
    let M = {};
    arr.forEach((obj) => {
      let value = obj[key];
      M[value] = obj;
    });
    return M;
  }

  /** @param {Object} obj */
  /** @param {((value:any, key?:any, obj?:any)=>(any))} func */
  static map(obj, func) {
    return MyObject._object_op('map', obj, func);
  }

  /** @param {Object} obj */
  /** @param {((value:any, key?:any, obj?:any)=>(boolean|any))} func */
  /** @returns {Object} */
  static filter(obj, func) {
    return MyObject._object_op('filter', obj, func);
  }

  /** @param {Object} obj */
  /** @param {((value:any, key?:any, obj?:any)=>(any))} func */
  static apply(obj, func) {
    return MyObject._object_op('apply', obj, func);
  }

  /** @param {Object} obj */
  /** @param {((value:any, key?:any, obj?:any)=>(any))} func */
  static forEach(obj, func) {
    return MyObject._object_op('forEach', obj, func);
  }

  /** @param {Object} src */
  /** @param {'apply'|'filter'|'forEach'|'map'} op*/
  static _object_op(op, src, func) {
    assert(1 <= func.length && func.length <= 3);
    let dest = {};
    for (let key of Object.keys(src)) {
      let value = src[key]
      let result = MyObject._func(func, value, key, src);
      if (op == 'map') dest[key] = result;
      else if (op == 'filter') { if (result) dest[key] = value; }
      else if (op == 'apply') src[key] = result;
      else if (op == 'forEach') 1 == 1;
    }
    return (op == 'map' || op == 'filter') ? dest : null;
  }

  static _func(func, value, key, src) {
    return (
      func.length == 1 ? func(value)
        : func.length == 2 ? func(value, key)
          : func(value, key, src)
    );
  }

  static reduce_dots(obj) {
    // converts {'a.b':1, 'a.c':2, b:3} into {a:{b:1,c:2}, 'b':3}. Returns copy (shallow or deep)
    let dotted = MyObject.filter(obj, (v, k) => k.indexOf('.') >= 0);
    let no_dots = MyObject.filter(obj, (v, k) => k.indexOf('.') == -1);
    if (Object.keys(dotted).length == 0) return no_dots;
    MyObject.forEach(dotted, (v, k) => {
      let start = k.slice(0, k.indexOf('.'));
      let end = k.slice(k.indexOf('.') + 1);
      no_dots[start] = no_dots[start] || {};
      no_dots[start][end] = v;
    });
    return MyObject.reduce_dots(no_dots);
  }

  static deep_assign(obj, ...objs) {
    for (let o of objs) {
      if (!o) continue;
      for (let key of Object.keys(o)) {
        if (obj[key] === undefined || typeof (o[key]) != "object") obj[key] = o[key];
        else MyObject.deep_assign(obj[key], o[key]);
      }
    }
    return obj;
  }

  static deep_copy(obj, ...objs) {
    if (obj === undefined) return undefined;
    if (obj === null) return null;
    if (Array.isArray(obj))
      return obj.map(x => MyObject.deep_copy(x));
    if (typeof (obj) == "object")
      return MyObject.map(obj, value => MyObject.deep_copy(value));
    if (typeof (obj) == "function")
      return obj; // DOES NOT CREATE COPY FOR FUNCTIONS
    return MyObject.deep_assign(obj, ...objs);
  }

  static deep_default(default_obj, ...objs) {
    let obj = MyObject.deep_copy(default_obj);
    return MyObject.deep_assign(obj, ...objs);
  }

  /** @param {((value:any, key?:any, obj?:any)=>(boolean|any))} filter_func */
  static find(obj, filter_func) {
    for (let key in obj)
      if (MyObject._func(filter_func, obj[key], key))
        return key;
    return null;
  }
  static toEntries(obj) {
    return Object.keys(obj).map(k => [k, obj[k]]);
  }
}


class MyDecorators {
  static once(fn) {
    let returnValue, canRun = true;
    return function runOnce() {
      if (canRun) {
        returnValue = fn.apply(this, arguments);
        canRun = false;
      }
      return returnValue;
    }
  }
}


function get_property_handler(object, property) {
  let access, proto = object;
  object._hidden_modified = false;
  while (!access) {
    proto = Object.getPrototypeOf(proto);
    access = Object.getOwnPropertyDescriptor(proto, property);
  }
  return access;
}

function update_property_handler(object, property, create_handler) {
  let prev = get_property_handler(object, property);
  Object.defineProperty(object, property, create_handler(prev));
}
