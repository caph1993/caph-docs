//@ts-check
import { MyDocument, sleep, until } from "./utils";
import {compressor, decompress, distPlugins} from "./build-constants";


const plugins = Object.fromEntries(distPlugins.map(e => [e.key, e]));

export const scriptLoader = (()=>{

  let dist = './dist';
  for (const e of document.querySelectorAll('script')) {
    const m = e.src.match(/^(.*)\/caph-docs\.(?:min\.)?js$/)
    if (m) dist = m[1];
  }
  //console.log(dist);

  const div = document.getElementById('core-sources') || MyDocument.createElement('div', {
    id: 'core-sources',
    parent: document.head,
    where: 'beforeend',
  });


  const _randomSessionSuffix = ('' + Math.random()).slice(2);
  const parseKey = (/** @type {string} */ key)=>{
    // key is like either 'userComponent', './userFileComponent', '@caphPlugin', '@dist/caphPlugin', 'full URL'
    let url = key.replace(/^@dist\/(.*)$/, (_, p)=>`${dist}/${p}`);
    if(url.startsWith('./')) url += `?${_randomSessionSuffix}`;
    url = new URL(url, document.baseURI).href;
    /** @type {string|null} */
    let proxyKey = null;
    if(plugins[key]) ({dist:proxyKey} = plugins[key]);
    return {url, proxyKey};
  }

  /**
   * @param {string} ref 
   * @param {{
   * parent?: HTMLElement|null,
   * where?: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend',
   * attrs?: {[key:string]:string},
   * autoAttrs?: boolean,
   * isCompressed?: boolean|null,
   * msTimeout?: number,
   * }} options
   */
  const load = (ref, { attrs={}, parent=null, where='beforeend', autoAttrs=true} = {})=>{
    ({url:ref} = parseKey(ref)); // especially for plugin loading libraries
    const refBase = ref.split('#')[0].split('?')[0]
    if (parent == null) parent = div;
    const ext = refBase.split('.').pop();
    let tag = ext == 'js' ? 'script' : ext == 'css' ? 'link' : null;
    if (tag == null) throw new Error('Only .js and .css files can be _sources. Got: ' + ext + ' ' + ref);
    let /** @type {{[key:string]:string}}*/ defaults = {};
    if (autoAttrs && tag == 'link') defaults = { rel: 'stylesheet', type: 'text/css' };
    Object.keys(attrs).forEach(k => defaults[k] = attrs[k]);
    attrs = defaults;
    if (tag == 'script') attrs.src = ref;
    if (tag == 'link') attrs.href = ref;
    _load_elem(ref, tag, attrs, parent, where);
  }

  // const loadFont = async(/** @type {string}*/name)=>{
  //   return await load(`${dist}/font-${name}.css`);
  // }
  // async loadPlugin(name) {
  //   return await this.load(`${dist}/plugin-${name}.js`);
  // }

  const status = {};

  const _load_elem = (ref, tag, attrs, parent, where) => new Promise((_ok, _err) => {
    if (status[ref]) return _ok(null); 
    status[ref] = true;
    let e = document.createElement(tag);
    for(let key in attrs) e.setAttribute(key, attrs[key]);
    let done = false;
    e.onload = () => { if (!done) { done = true; _ok(null); } };
    e.onerror = (err) => { if (!done) { done = true; _err(err); } }; // HTTP errors only
    parent.insertAdjacentElement(where, e);
  });

  const injectStyle = (/** @type {string} */ styleStr)=>{
    MyDocument.createElement('style', { parent: div, where: 'beforeend', text: styleStr });
  }
  return {injectStyle, load, div, dist, parseKey};
})();

export const parseKey = scriptLoader.parseKey;
export const injectStyle = scriptLoader.injectStyle;
export const load = scriptLoader.load;
