//@ts-check
/// <reference path="types.js" />
import { assertNonNull, assert, until, sleep } from './utils.js';
import { BaseParser, NewParser } from './parser.js';
import { load, parseKey, injectStyle } from './script-loader';
import * as preact from 'preact';
import { useMemo, useCallback, useState, useEffect} from 'preact/hooks';

/** @typedef {(props:Object)=>Elem} Component */

export const preactParser = new class {
  
  /** @type {'@katex'|'@mathjax'} */
  mathParser = '@katex';
  codeParser = '@codeFallback';

  _parser = NewParser;

  parseAst = this._parser.parseAst;

  _evalAst = this._parser.evalAstFactory({
    createElement: this.createElement.bind(this),
    FragmentComponent: preact.Fragment,
  })
  /** @type {(literals:TemplateStringsArray, ...values)=>Elem}*/
  parse = this._parser.parserFactory(this._evalAst);
  parseNoMarkup = BaseParser.parserFactory(this._evalAst);

  parseHtml(/** @type {string}*/str){
    //@ts-ignore
    return this._evalAst(this._parser.parseAstHtml(str));
  }

  constructor() {
    this.contexts = {};
    this.contexts['core-menu'] = preact.createContext(null);
  }

  createElement(type, props, ...children) {
    if (props && props.hasOwnProperty('data-caph')) {
      let pluginKey = props['data-caph'];
      if (pluginKey == '@math') pluginKey = this.mathParser;
      if (pluginKey == '@code') pluginKey = this.codeParser;
      if (pluginKey) type = this.plugin(pluginKey);
      else console.warn('caph tag without plugin attribute');
    }
    // if(type=='span' && children.length && is_string(children[0]) && children[0].startsWith('\\Prob')){
    //   console.log(type, props, children);
    // }
    const vDom = preact.createElement(type, props, ...children);
    return vDom;
  }

  /** @type {{[key:string]: Component|Promise<Component>}} */
  pluginDefs = {
    'core-error': (async () => ({ children, tooltip }) => {
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
      return this.parse`
        <a href="./error-help" onclick=${(e) => {
        e.preventDefault();
          help();
        }}>(help?)</a> 
        <code class="caph-flashing caph-error" title=${tooltip}>${children || tooltip || 'Error'}</code>
      `;
    })(),
    '@paragraphs': (async () =>({ children }) => useMemo(
        ()=>this._evalAst([null, null, this._parser.spacingRulesParagraphs(preact.toChildArray(children))]),
        [children],
    ))(),
    '@codeFallback': (async () => ({ children, progLang }) => useMemo(
      ()=>this.parse`<code>${children}</code>`,
      [children],
    ))(),
  };


  /** @type {{[key:string]: Component}} */
  _pluginComponents = {}
  plugin(key) { // key is either a tag or a url
    const cache = this._pluginComponents;
    return cache[key] || (cache[key] = this.componentWrapper(key));
  }

  /** @type {{[key:string]: Component}} */
  _componentWrappers = {};
  componentWrapper(key) {
    const cache = this._componentWrappers;
    return cache[key] || (cache[key] = this.newPluginLoader(key));
  }

  /** @returns {Component} */
  newPluginLoader(/** @type {string}*/ key){
    const pluginDefs = this.pluginDefs;
    const parent = this;
  
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
        return parent.parse`<code class="caph-flashing">${children || '...error...'}</code>`;
      }
    }

    function LoadingComponent({ children }) {
      return parent.parse`
      <code class="caph-flashing" title=${`${key} is loading...`}>${children || '...'}</code>`;
    }

    function LoadErrorComponent({}) {
      return parent.parse`<${parent.plugin('core-error')} tooltip=${loadStatus.error}/>`;
    }

    const {url, proxyKey} = parseKey(key);
    const main = async ()=>{
      // 1. Put the plugin script in the document head and wait for the browser to load the script
      try{
        if (pluginDefs.hasOwnProperty(key)){} // already loaded
        else if (proxyKey) {
          pluginDefs[key] = parent.componentWrapper(proxyKey);
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

  /**
   * @param {string} eventName 
   * @param {(data:any)=>void} callback 
   */
  listenToEvent(eventName, callback) {
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

  _globals = {};
  dispatchGlobal(eventName, value) {
    this._globals[eventName] = value;
    let event = new CustomEvent(eventName, {detail:value});
    window.dispatchEvent(event);
    return;
  }
  async untilGlobal(eventName) {
    await until(() => this._globals[eventName]);
    await sleep(500);
  }
  listenToGlobal(eventName) {
    const initial = useMemo(()=>this._globals[eventName], [eventName]);
    const [value, setValue] = useState(initial);
    this.listenToEvent(eventName, setValue);
    return value;
  }

  // _URL_is_absolute(url) {
  //   //https://stackoverflow.com/q/10687099
  //   return new URL(document.baseURI).origin !== new URL(url, document.baseURI).origin;
  // }

}

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
