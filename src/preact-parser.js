//@ts-check
/// <reference path="types.js" />
import { assertNonNull, assert, until, sleep } from './utils.js';
import { createParser } from './parser.js';
import { load, parseKey, injectStyle } from './script-loader.js';
import * as preact from 'preact';
import { useMemo, useCallback, useState, useEffect} from 'preact/hooks';

/** @typedef {(props:Object)=>Elem} Component */


export const createPreactParser = ()=>{
  const parser = createParser();
  parser.settings.FragmentComponent = preact.Fragment;
  parser.settings.createElement = (type, props, ...children)=> {
    if (props && props.hasOwnProperty('(component)')) {
      let pluginKey = props['(component)'];
      type = plugin(pluginKey);
      // if (pluginKey) type = plugin(pluginKey);
      // else console.warn('caph tag without plugin attribute');
    }
    const vDom = preact.createElement(type, props, ...children);
    return vDom;
  }
  return parser;
}

export const parser = createPreactParser();

/** @type {{[key:string]: Component|Promise<Component>}} */
export const pluginDefs = {}


/** @type {{[key:string]: Component}} */
const pluginComponents = {}
export const plugin = (/** @type {string} */ key)=>{ // key is either a tag or a url
  const cache = pluginComponents;
  return cache[key] || (cache[key] = componentWrapper(key));
}

/** @type {{[key:string]: Component}} */
const componentWrappers = {};
const componentWrapper = (/** @type {string} */ key)=>{
  const cache = componentWrappers;
  return cache[key] || (cache[key] = newPluginLoader(key));
}

/** @returns {Component} */
const newPluginLoader = (/** @type {string}*/ key)=>{
  //scriptLoader.load('caph-docs/core/plugin-loader.css');

  const loadStatus = {
    Component: /** @type {null|Component}*/(null),
    error: null,
    renderReady: false,
  }

  function FinalComponent({ children, ...props }) {
    try {
      const Component = assertNonNull(loadStatus.Component);
      const out = Component({ children, ...props });
      assert(!out.then, `Your component can not be a promise itself (${key}).
      Maybe you defined pluginDefs[...] = (async ()=>{...}) instead of pluginDefs[...] = (async ()=>{...})()?
      Please follow the IIFE pattern for async promises.`);
      return out;
    } catch (err) {
      console.error(`Rendering error in plugin ${key}:`, err);
      return parser.parse`<code class="caph-flashing">${children || '...error...'}</code>`;
    }
  }

  function LoadingComponent({ children }) {
    return parser.parse`
    <code class="caph-flashing" title=${`${key} is loading...`}>${children || '...'}</code>`;
  }

  function LoadErrorComponent({}) {
    return parser.parse`<${plugin('core-error')} tooltip=${loadStatus.error}/>`;
  }

  const {url, proxyKey} = parseKey(key);
  const main = async ()=>{
    // 1. Put the plugin script in the document head and wait for the browser to load the script
    try{
      if (pluginDefs.hasOwnProperty(key)){} // already loaded
      else if (proxyKey) {
        pluginDefs[key] = componentWrapper(proxyKey);
      } else if(url) {
        load(url);
        await until(() => pluginDefs[url], { timeout: 3800});
        // assert(pluginDefs[url], `Plugin ${key} not declared in file ${url}`);
        pluginDefs[key] = pluginDefs[url];
        if (key != url) delete pluginDefs[url];
      } else {
        await until(() => pluginDefs[key], {timeout: 3800});
      } // User plugin
    } catch(err){
      loadStatus.error = err || true;
      console.error(`Could not load plugin ${key}`, err);
      return;
    }
    // 3. Start the plugin promise but don't wait for it
    (async()=>{
      try {
        loadStatus.Component = await pluginDefs[key];
        loadStatus.renderReady = true;
      } catch (err) {
        loadStatus.error = err || true;
        console.log(pluginDefs[key])
        console.error(`Error while awaiting pluginDefs["${key}"]`, err);
      }
    })();
  }
  main();
  return ({ children, ...props })=>{
    const [trigger, setTrigger] = useState(0);

    const asyncLoad = useCallback(async () => {
      await until(() => loadStatus.renderReady || loadStatus.error);
      setTrigger(Math.random() * 1e12); // refresh this component
    }, []);
    useEffect(()=>{asyncLoad()}, []);
    
    const Component = useMemo(()=>{
      if (loadStatus.renderReady) return FinalComponent;
      else if (loadStatus.error) return LoadErrorComponent;
      else return LoadingComponent;
    }, [trigger]);
    
    return Component({ children, ...props })
  };
}




pluginDefs['core-error'] = (async () => ({ children, tooltip }) => {
  const help = useCallback(() => {
    const win = window.open('', '_blank');
    if (!win) throw new Error('Popup blocked');
    win.document.write(`
      <div>
        1. In tex, use \\lt and \\gt instead of &lt; and &gt;.
        <br/>
        2. In html, use \\$ instead of $.
        <br/>
        This prevents any parsing misunderstanding.
      </div>
    `);
  }, []);
  return parser.parse`
    <a href="./error-help" onclick=${(e) => {
    e.preventDefault();
      help();
    }}>(help?)</a> 
    <code class="caph-flashing caph-error" title=${tooltip}>${children || tooltip || 'Error'}</code>
  `;
})();

// pluginDefs['@paragraphs'] = (async () =>({ children }) => useMemo(
//     ()=>this._evalAst([null, null, parser.spacingRulesParagraphs(preact.toChildArray(children))]),
//     [children],
// ))();

// pluginDefs['code'] = (async () => ({ children, progLang }) => useMemo(
//   ()=>parser..parse`<code>${children}</code>`,
//   [children],
// ))(),


parser.settings.parsingRules = [
  {component: '@mathInline', start: /(?<!\\)\$(?!\$)/y, capture: /(.*?)(?<!\\)\$/ys, },
  {component: '@mathDisplay', start: /(?<!\\)\$\$/y, capture: /(.*?)(?<!\\)\$\$/ys, },
  {component: '@codeInline', start: /(?<!\\)`(?!``)/y, capture: /(.*?)(?<!\\)`/ys, },
  {component: '@codeDisplay', start: /(?<!\\)```/y, capture: /(.*?)(?<!\\)```/ys, },
]
pluginDefs['@mathInline'] = ({ children}) => parser.parse`
  <div (component)="@katex" displayMode=${false}>${children}</div>
`;
pluginDefs['@mathDisplay'] = ({ children}) => parser.parse`
  <div (component)="@katex" displayMode=${true}>${children}</div>
`;
pluginDefs['@codeInline'] = ({ children}) => parser.parse`
  <code>${children}</code>
`;
pluginDefs['@codeDisplay'] = ({ children}) => parser.parse`
  <div><code>${children}</code></div>
`;


injectStyle(`
.caph-error{
  color: #ce1111;
}
.caph-flashing{
  -webkit-animation: caphFlashingAnimation 1s linear infinite;
  animation: caphFlashingAnimation 1s linear infinite;
}
@keyframes caphFlashingAnimation {
  0% { opacity: 0.3; }
  100% { opacity: 1; }
}

.caph-hidden{
  display: none;
}

.caph-box-shadow{
  box-shadow: 0px 0px 0.3rem 0.05rem var(--box-shadow);
}
.caph-box-shadow:hover{
  box-shadow: 0px 0px 0.3rem 0.2rem var(--box-shadow);
}
.caph-fullscreen-layer{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}
.caph-hbox{ display: flex; }
.caph-vbox{ display: flex; flex-direction: column; }
.caph-boxcenter{ justify-content: center; }
.caph-space-around{ justify-content: space-around; }
.caph-space-between{ justify-content: space-between; }
.caph-flex{ flex: 1; }
.caph-hidden{ display:none; }
.caph-plugin-hidden{ display:none; }
.caph-border{
  border: solid 2px var(--text-strong);
}`)
