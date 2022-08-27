//@ts-check
/// <reference path="types.js" />
/// <reference path="utils.js" />
/// <reference path="parser.js" />
/// <reference path="script-loader.js" />

/* lzutf8, utils, preact, preact hook are injected above this comment*/


__caph_definitions__.preactParser = new class {
  
  /** @type {'katex'|'mathjax'} */
  mathParser = 'katex';
  scriptLoader = __caph_definitions__.scriptLoader;

  officialPlugins = [
    'core-menu',
    'core-about',
    'katex',
    'document',
    'whiteboard',
    'hyphenator',
    // 'slides',
    // 'fabric',
    // 'figure-editor',
    // 'mathjax-svg',
  ];


  constructor() {
    
    const { parseAst, parse } = __caph_definitions__.NewParser.parserFactory({
      createElement: this.createElement.bind(this),
      FragmentComponent: preact.Fragment,
    });
    const { parse: parseNoMarkup } = __caph_definitions__.BaseParser.parserFactory({
      createElement: this.createElement.bind(this),
      FragmentComponent: preact.Fragment,
    });

    this.parse = parse;
    this.parseAst = parseAst;
    this.parseNoMarkup = parseNoMarkup;

    this.contexts = {};
    this.contexts['core-menu'] = preact.createContext();
  }

  createElement(type, props, ...children) {
    if (type == 'caph') {
      let pluginKey = props && props['plugin'];
      if (pluginKey == 'caph-math') pluginKey = this.mathParser;
      if (pluginKey) type = this.plugin(pluginKey);
      else console.warn('caph tag without plugin attribute');
    }
    return preact.createElement(type, props, ...children);
  }

  pluginDefs = {
    'core-error': async () => ({ children, tooltip }) => {
      const help = preact.useCallback(() => {
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
      return caph.parse`
        <a href="./error-help" onclick=${(e) => {
        e.preventDefault();
          help();
        }}>(help?)</a> 
        <code class="caph-flashing caph-error" title=${tooltip}>
          ${children || tooltip || 'Error'}
        </code>
      `;
    }
  };


  _pluginComponents = {}
  plugin(key) { // key is either a tag or a url
    const cache = this._pluginComponents;
    return cache[key] || (cache[key] = this.pluginLoader(key));
  }

  _pluginLoaders = {};
  _randomSessionSuffix = ('' + Math.random()).slice(2);
  pluginLoader(key) {
    if (key.match(/[^#\?]*.js(#.*|\?.*|)$/)) key = this._URL_resolve(key);
    const cache = this._pluginLoaders
    return cache[key] || (cache[key] = this.newPluginLoader(key));
  }

  newPluginLoader(/** @type {string}*/ key){
    const scriptLoader = this.scriptLoader;
    const pluginDefs = this.pluginDefs;
    const parent = this;
  
    //scriptLoader.load('caph-docs/core/plugin-loader.css');

    const loadStatus = {
      Component: null,
      error: null,
      renderReady: false,
    }

    const main = async ()=>{
      // 1. Put the plugin script in the document head and wait for the browser to load the script
      const pluginDef = await (async ()=> {
        if (pluginDefs[key]) {
          return pluginDefs[key]; // already loaded
        }
        if (parent.officialPlugins.includes(key)) {
          const url = `${scriptLoader.dist}/plugin-${key}.js`;
          return pluginDefs[key] = parent.pluginLoader(url);
        }
        else if (key.match(/[^#\?]+.js(#.*|\?.*|)$/)) {
          let isOfficial = parent.officialPlugins.map(k => `${scriptLoader.dist}/plugin-${k}.js`).includes(key);
          const url = isOfficial ? key : `${key}?${parent._randomSessionSuffix}`;
          await scriptLoader.load(url);
          pluginDefs[key] = pluginDefs[key] || pluginDefs[url];
          assert(pluginDefs[key], 'Plugin not declared in file: ' + key);
          if (key != url) delete pluginDefs[url];
          return pluginDefs[key];
        }
        // User plugin
        return await MyPromise.until(() => pluginDefs[key]);
      })();

      // 3. Start the plugin promise but don't wait for it
      (async()=>{
        try {
          loadStatus.Component = await pluginDef();
          loadStatus.renderReady = true;
        } catch (err) {
          loadStatus.error = err || true;
          console.error(err);
        }
      })();
    }    

    function FinalComponent({ children, ...props }) {
      try {
        //@ts-ignore
        return loadStatus.Component({ children, ...props });
      } catch (err) {
        console.error(`Rendering error in plugin ${key}:`, err);
        return parent.parse`<code class="flashing">${children || '...'}</code>`;
      }
    }

    function _loadingComponent({ children }) {
      return parent.parse`
      <code class="caph-flashing" title=${`${key} is loading...`}>
        ${children || '...'}
      </code>`;
    }

    function _loadErrorComponent({}) {
      return parent.parse`<${parent.plugin('core-error')} tooltip=${loadStatus.error}/>`;
    }

    main();
    return ({ children, ...props })=>{
      const [_, setTrigger] = preact.useState(0);

      preact.useEffect(async () => {
        await MyPromise.until(() => loadStatus.renderReady || loadStatus.error);
        setTrigger(Math.random() * 1e12); // refresh this component
      }, []);

      if (loadStatus.renderReady) return FinalComponent({ children, ...props });
      else if (loadStatus.error) return _loadErrorComponent({ children });
      else return _loadingComponent({ children });
    };
  }

  /**
   * @param {string} eventName 
   * @param {(data:any)=>void} callback 
   */
  listenToEvent(eventName, callback) {
    preact.useEffect(() => {
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
    await MyPromise.until(() => this._globals[eventName]);
    await MyPromise.sleep(500);
  }
  listenToGlobal(eventName) {
    const initial = preact.useMemo(()=>this._globals[eventName], [eventName]);
    const [value, setValue] = preact.useState(initial);
    this.listenToEvent(eventName, setValue);
    return value;
  }

  _URL_resolve(url) {
    return new URL(url, document.baseURI).href;
  }
  // _URL_is_absolute(url) {
  //   //https://stackoverflow.com/q/10687099
  //   return new URL(document.baseURI).origin !== new URL(url, document.baseURI).origin;
  // }

  _html_safe(str) {
    // e.g. converts < into &lt;
    return new Option(str).innerHTML;
  }
  _html_safe_undo(str) {
    // e.g. converts &lt; into <
    const doc = new DOMParser().parseFromString(str, "text/html");
    const text = doc.documentElement.textContent;
    return text;
  }

}

__caph_definitions__.preactParser.scriptLoader.injectStyle(`
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
