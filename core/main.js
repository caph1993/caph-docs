//@ts-check
/// <reference path="types.js" />
/// <reference path="utils.js" />
/// <reference path="parser.js" />

/* lzutf8, utils, preact, preact hook are injected above this comment*/


__caph_definitions__.Plugin = class {

  async loader() { }

  Component({ children, ...props }) {
    console.error('Override the Component method of this object:', this);
    return caph.parse`<${caph.plugin('core-error')}> Override the Component method</> `;
  }

}

__caph_definitions__.PluginLoader = class extends __caph_definitions__.Plugin {

  constructor(key) {
    super();
    this.key = key;
    this.loader();
    caph.load('caph-docs/core/plugin-loader.css');
  }

  //@ts-ignore
  /** @type {caph.Plugin} */ plugin = null;
  error = null;
  renderReady = false;

  async loader() {
    // 1. Put the plugin script in the document head
    // 2. Wait for the browser to load the script
    this.plugin = await this.loadPlugin();
    // 3. Start but don't wait for the plugin loader
    this.pluginLoader();
  }

  async loadPlugin() {
    const key = this.key;
    if (caph.pluginDefs[key]) {
      return caph.pluginDefs[key]; // already loaded
    }
    if (caph.officialPlugins.includes(key)) {
      const url = `${caph.dist}/plugin-${key}.js`;
      return caph.pluginDefs[key] = caph.pluginLoader(url);
    }
    else if (key.match(/[^#\?]+.js(#.*|\?.*|)$/)) {
      let isOfficial = caph.officialPlugins.map(k => `${caph.dist}/plugin-${k}.js`).includes(key);
      const url = isOfficial ? key : `${key}?${caph._randomSessionSuffix}`;
      await caph.load(url);
      caph.pluginDefs[key] = caph.pluginDefs[key] || caph.pluginDefs[url];
      assert(caph.pluginDefs[key], 'Plugin not declared in file: ' + key);
      if (key != url) delete caph.pluginDefs[url];
      return caph.pluginDefs[key];
    }
    // User plugin
    return await MyPromise.until(() => caph.pluginDefs[key]);
  }

  async pluginLoader() {
    try {
      await this.plugin.loader();
      this.renderReady = true;
    } catch (err) {
      this.error = err || true;
      console.error(err);
    }
  }


  Component({ children, ...props }) {
    // eventually overridden by FinalComponent
    return this.TemporalComponent({ children, ...props });
  }

  TemporalComponent({ children, ...props }) {
    const [_, setTrigger] = preact.useState(0);

    preact.useEffect(async () => {
      await MyPromise.until(() => this.renderReady || this.error);
      setTrigger(Math.random() * 1e12); // refresh this component
    }, []);

    if (this.renderReady) return this.FinalComponent({ children, ...props });
    else if (this.error) return this._loadErrorComponent({ children });
    else return this._loadingComponent({ children });
  }

  FinalComponent({ children, ...props }) {
    this.Component = this.FinalComponent; // override the Component method
    try {
      return this.plugin.Component({ children, ...props });
    } catch (err) {
      console.error(`Rendering error in plugin ${this.key}:`, err);
      return caph.parse`<code class="flashing">${children || '...'}</code>`;
    }
  }

  _loadingComponent({ children }) {
    return caph.parse`
    <code class="caph-flashing" title=${`${this.key} is loading...`}>
      ${children || '...'}
    </code>`;
  }

  _loadErrorComponent({ children }) {
    return caph.parse`<${caph.plugin('core-error')} tooltip=${this.error}/>`;
  }
}



const caph = new class {

  Plugin = __caph_definitions__.Plugin;
  PluginLoader = __caph_definitions__.PluginLoader;

  mathPlugin = 'katex';
  mathMacros = {};

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

  utils = {
    unindent: (text) => {
      let lines = text.split('\n');
      let n = lines.filter(l => l.trim().length)
        .map(l => l.length - l.trimStart().length)
        .reduce((p, c) => Math.min(c, p), 1000);
      return lines.map(l => l.slice(n)).join('\n');
    }
  };


  // template literal parsers


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

    //@ts-ignore
    const requirements = window.caph_requirements || [];
    //@ts-ignore
    window.caph_requirements = requirements;
    //@ts-ignore
    delete window.caph_requirements;
    for (let a of requirements) this.attach(a);
    this.dist = '../dist';
    for (const e of document.querySelectorAll('script')) {
      if (e.src.endsWith('/caph-docs.js'))
        this.dist = e.src.slice(0, -13);
    }

    this.div = document.getElementById('core-sources');
    if (!this.div) {
      this.div = MyDocument.createElement('div', {
        id: 'core-sources',
        parent: document.head,
        where: 'beforeend',
      });
    }
    this.contexts = {};
    this.contexts['core-menu'] = preact.createContext();
    this._loadMenu();

    // this.user = { // Exported functions
    //   core: this,
    //   contexts: this.contexts,
    //   parse: this.parse.bind(this),
    //   plugin: this.plugin.bind(this),
    //   page: this.page.bind(this),
    //   Plugin?
    // };
  }
  get currentSrc() {
    //@ts-ignore
    return document.currentScript.src;
  }

  async injectStyle(styleStr) {
    MyDocument.createElement('style', {
      parent: this.div,
      where: 'beforeend',
      text: styleStr,
    });
    await sleep(10);
  }

  _loadMenu() {
    const caph = this;
    caph.menu = new class {
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
       * @param {{
       *  onEnter?:()=>void,
       *  onExit?:()=>void,
       *  hold?:boolean,
       * }} [options]
      */
      addOption(option, { onEnter, onExit, hold } = {}) {
        this.onEnter[option] = onEnter;
        this.onExit[option] = onExit;
        this.hold[option] = hold;
        if (this.options[option]) return;
        this.options.push(option);
        this.options[option] = 1;
        caph.dispatchGlobal('caph-menu-options', Math.random());
      }
      setOption(option) {
        caph.dispatchGlobal('caph-menu-option', Math.random());
        if (this.hold[option]) {
          this.onExit[this.latest] && this.onExit[this.latest]();
          this.latest = this.option;
          this.option = option;
        }
        this.onEnter[option] && this.onEnter[option]();
      }
    };
    async function inject(vDom) {
      // const node = MyDocument.createElement('div', {
      //   parent: document.body,
      //   where: 'afterbegin',
      //   id: 'core-body',
      // })
      const node = document.body;
      preact.render(vDom, node);
    }
    MyPromise.until(() => document.body && this.PluginLoader).then(()=>{
      inject(this.parse`
        <${this.plugin('core-menu')}/>
        <${this.plugin('core-about')}/>
      `);
    });
  }


  // const metaContent = document.querySelector('meta[content]');
  // if (!metaContent) MyDocument.createElement('div', {
  //   parent: document.head,
  //   where: 'afterbegin',
  //   name: 'viewport',
  //   content: window.innerWidth > 960 ?
  //     'width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no'
  //     : 'width=1024'
  // });

  // async createElementReplace(rootElement, vDom = null) {
  //   vDom = vDom || dataParser([`${rootElement.outerHTML}`]);
  //   const sibling = MyDocument.createElement('div', {
  //     'parent': rootElement,
  //     'where': 'afterend',
  //   });
  //   rootElement.parentNode.removeChild(rootElement);
  //   preact.Component(vDom, sibling.parentNode, sibling);
  //   //this.setReady();
  // }

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

  _attachments = [];
  getAttachment(ref) {
    for (let e of this._attachments) if (e.ref == ref) return e.content;
    return null;
  }
  attach(...attachments) {
    for (let s of attachments) {
      if (this.getAttachment(s.ref) === null) this._attachments.push(s);
      else this._attachments.forEach(a => {
        if (a.ref == s.ref) a.content = s.content;
      });
    }
  }


  /**
   * @param {string} ref 
   * @param {{
   * parent?: HTMLElement|null,
   * where?: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend',
   * attrs?: {[key:string]:string},
   * auto_attrs?: boolean,
   * }} param1
   */
  async load(ref, {
    attrs = {}, parent = null, where = 'beforeend',
    auto_attrs = true
  } = {}) {
    if (parent == null) parent = this.div;
    const ext = ref.split('#')[0].split('?')[0].split('.').pop();
    let tag = ext == 'js' ? 'script' : ext == 'css' ? 'link' : null;
    if (tag == null) throw new Error('Only .js and .css files can be _sources. Got: ' + ext + ' ' + ref);
    let /** @type {{[key:string]:string}}*/ defaults = {};
    if (auto_attrs && tag == 'link') defaults = { rel: 'stylesheet', type: 'text/css' };
    Object.keys(attrs).forEach(k => defaults[k] = attrs[k]);
    let content = this.getAttachment(ref);
    if (content && tag == 'link') tag = 'style';
    attrs = defaults;
    if (content) {
      delete attrs.src;
      delete attrs.href;
    } else {
      if (tag == 'script') attrs.src = ref;
      if (tag == 'link') attrs.href = ref;
    }
    try {
      await this._load_elem(ref, tag, attrs, parent, where, content);
    } catch (err) {
      console.error(err, ref);
      throw err;
    }
  }

  async loadFont(name) {
    return await this.load(`${this.dist}/font-${name}.css`);
  }

  pluginDefs = {};
  _pluginComponents = {}
  plugin(key) {
    // key is either a tag or a url
    let out = this._pluginComponents[key];
    if (out) return out;
    const plugin = this.pluginLoader(key);
    out = plugin.Component.bind(plugin);
    return this._pluginComponents[key] = out;
  }

  _pluginLoaders = {};
  _randomSessionSuffix = ('' + Math.random()).slice(2);
  pluginLoader(key) {
    if (key.match(/[^#\?]*.js(#.*|\?.*|)$/)) key = this._URL_resolve(key);
    let out = this._pluginLoaders[key];
    if (out) return out;
    return this._pluginLoaders[key] = new this.PluginLoader(key);
  }

  _URL_resolve(url) {
    return new URL(url, document.baseURI).href;
  }
  _URL_is_absolute(url) {
    //https://stackoverflow.com/q/10687099
    return new URL(document.baseURI).origin !== new URL(url, document.baseURI).origin;
  }

  _loadStatus = {};
  async _load_elem(ref, tag, attrs, parent, where, content) {
    // Handle concurrent calls to load_elem(...) about the same ref
    if (!this._loadStatus[ref]) {
      this._loadStatus[ref] = 1;
      try {
        await this.__load_elem(ref, tag, attrs, parent, where, content);
        this._loadStatus[ref] = 2;
      } catch (err) {
        this._loadStatus[ref] = 0;
        throw err;
      }
    }
    while (this._loadStatus[ref] == 1) { // If being loaded in other thread...
      await sleep(80);
    }
  }

  __load_elem(ref, tag, attrs, parent, where, content) {
    return new Promise((_ok, _err) => {
      let e = document.createElement(tag);
      let done = false;
      e.onload = () => { if (!done) { done = true; _ok(null); } };
      e.onerror = (x) => { if (!done) { done = true; _err(x); } }; // HTTP errors only
      Object.keys(attrs).map(key => e.setAttribute(key, attrs[key]));
      if (content) {
        //@ts-ignore
        let r = window._loaded_resources || {};
        //@ts-ignore
        window._loaded_resources = r;
        r[ref] = false;
        content += `\nwindow._loaded_resources['${ref}']=true;\n`;
        e.innerHTML = content;
        if (tag == 'script') {
          (async () => {
            while (!r[ref]) await sleep(100);
            done = true; _ok(null);
          })();
        } else if (tag == 'style') {
          let ms = 10;
          setTimeout(() => { done = true, _ok(null) }, ms);
        }
      }
      parent.insertAdjacentElement(where, e);
      setTimeout(() => done || _err(['Timeout (12s) loading source:', e]), 12000);
    });
  };


  createElement(type, props, ...children) {
    if (type == 'caph') {
      let pluginKey = props && props['plugin'];
      if (pluginKey == 'caph-math') pluginKey = this.mathPlugin;
      if (pluginKey) type = this.plugin(pluginKey);
      else console.warn('caph tag without plugin attribute');
    }
    // children = children.map(x => is_string(x) ? this._html_safe_undo(x) : x);
    return preact.createElement(type, props, ...children);
  }

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

caph.pluginDefs['core-error'] = new class extends caph.Plugin {

  Component({ children, tooltip }) {
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
}