//@ts-check

/* lzutf8, utils, preact, preact hook are injected above this comment*/

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
/// <reference path="utils.js" />

//@ts-ignore
var /**@type {Preact}*/preact = window.preact;

//@ts-ignore
var /**@type {Window}*/ window = window || {};

const caphPlugin = class {

  async loader() { }

  Component({ children, ...props }) {
    console.error('Override the Component method of this object:', this);
    return caph.parse`<${caph.plugin('core-error')}> Override the Component method</> `;
  }

}

const caphPluginLoader = class extends caphPlugin {

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

  Plugin = caphPlugin;
  PluginLoader = caphPluginLoader;

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

  constructor() {
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
   * }}
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

  // template literal parsers


  parse({ raw: strings }, ...values) {
    return this._parse(true, strings, ...values);
  }

  parseEsc(strings, ...values) {
    return this._parse(true, strings, ...values);
  }

  parseNoMarkup({ raw: strings }, ...values) {
    return this._parse(false, strings, ...values);
  }
  parseNoMarkupEsc(strings, ...values) {
    return this._parse(false, strings, ...values);
  }

  _parse_init() {
    // copied from xhtm
    const empty = {};
    const FIELD = '\ue000';
    const QUOTES = '\ue001';
    const ESCAPED_DOLLAR = '\ue002';
    const SPACE = '\ue003';
    const each_FIELD = new RegExp(FIELD, 'g');
    const each_QUOTES = new RegExp(QUOTES, 'g');
    const each_ESCAPED_DOLLAR = new RegExp(ESCAPED_DOLLAR, 'g');
    const each_SPACE = new RegExp(SPACE, 'g');

    'area base br col command embed hr img input keygen link meta param source track wbr ! !doctype ? ?xml'.split(' ').map(v => empty[v] = empty[v.toUpperCase()] = true)

    // https://html.spec.whatwg.org/multipage/syntax.html#optional-tags
    // closed by the corresponding tag or end of parent content
    const close = {
      'li': '',
      'dt': 'dd',
      'dd': 'dt',
      'p': 'address article aside blockquote details div dl fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 header hgroup hr main menu nav ol pre section table',
      'rt': 'rp',
      'rp': 'rt',
      'optgroup': '',
      'option': 'optgroup',
      'caption': 'tbody thead tfoot tr colgroup',
      'colgroup': 'thead tbody tfoot tr caption',
      'thead': 'tbody tfoot caption',
      'tbody': 'tfoot caption',
      'tfoot': 'caption',
      'tr': 'tbody tfoot',
      'td': 'th tr',
      'th': 'td tr tbody',
    };
    for (let tag in close) {
      [...close[tag].split(' '), tag].map(closer => {
        close[tag] =
          close[tag.toUpperCase()] =
          close[tag + closer] =
          close[tag.toUpperCase() + closer] =
          close[tag + closer.toUpperCase()] =
          close[tag.toUpperCase() + closer.toUpperCase()] =
          true;
      })
    }
    this._parseEnv = { empty, close, FIELD, QUOTES, ESCAPED_DOLLAR, each_FIELD, each_QUOTES, each_ESCAPED_DOLLAR, SPACE, each_SPACE };
  }

  createElement(type, props, ...children) {
    if (type == 'caph') {
      const pluginKey = props && props['plugin'];
      if (pluginKey) type = this.plugin(pluginKey);
      else console.warn('caph tag without plugin attribute');
    }
    children = children.map(
      x => this._is_string(x) ? this._html_safe_undo(x) : x);
    return preact.createElement(type, props, ...children);
  }


  _is_string(obj) {
    return Object.prototype.toString.call(obj) === "[object String]";
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
  _html_is_valid_attr_key(key) {
    return /^[a-zA-Z_:][a-zA-Z0-9_:.-]*$/.test(key);
  }

  Deque = class{
    constructor(arr) {
      this.data = [...(arr||[])];
      this.lr = [0, arr.length];
    }
    get capacity() {
      return this.data.length;
    }
    get length() {
      const [i, j] = this.lr;
      return j >= i? j - i: this.capacity - i + j;
    }
    toArray(){
      const [i, j] = this.lr;
      if(j>=i) return this.data.slice(i,j);
      else return this.data.slice(i).concat(this.data.slice(0,j));
    }
    resize(newLength){
      if(newLength===undefined){
        if(this.length+1 >= this.capacity) this.resize(3*this.length);
        if(this.length-1 <= this.capacity<<2) this.resize(this.length<<1);
        return;
      }
      const arr = this.toArray()
      this.data = [...arr, ...new Array(newLength-arr.length).fill(null)];
      this.lr = [0, arr.length];
    }
    _mod_add(lrIndex, retK, afterK){
      const add = (i, k)=>((i%this.capacity) + k + this.capacity) % this.capacity;
      const out = add(this.lr[lrIndex], retK);
      this.lr[lrIndex] = add(this.lr[lrIndex], afterK);
      return out;
    }
    pushRight(x) {
      this.resize();
      this.data[this._mod_add(1, 0, +1)] = x;
    }
    pushLeft(x) {
      this.resize();
      this.data[this._mod_add(0, -1, -1)] = x;
    }
    popRight() {
      this.resize();
      return this.data[this._mod_add(1, -1, -1)];
    }
    popLeft() {
      this.resize();
      return this.data[this._mod_add(0, 0, +1)];
    }
  }
  _parse(parse_math, strings, ...values) {
    // based on xhtm, which is based on htm. Differences:
    // 1. Replaces html entities
    // 2. Parses math markup.
    // 3. Solves some errors instead of blocking.
    if (this._parseEnv === undefined) this._parse_init();

    //@ts-ignore //https://github.com/microsoft/TypeScript/issues/23405
    const { empty, close, SPACE, each_SPACE, FIELD, QUOTES, ESCAPED_DOLLAR, each_FIELD, each_QUOTES, each_ESCAPED_DOLLAR } = this._parseEnv;

    const fields = new this.Deque(values);
    let prev = 0, args, name, value, quotes = [], quote = 0, last;
    let /** @type {any}*/current = [];

    current.root = true;

    const evaluate = (str, parts = [], raw) => {
      let i = 0;
      str = !raw && str === QUOTES ?
        quotes[quote++].slice(1, -1) :
        str.replace(each_QUOTES, m => quotes[quote++]);
      if (!str) return str;
      str.replace(each_FIELD, (match, idx) => {
        if (idx) parts.push(str.slice(i, idx));
        i = idx + 1;
        return parts.push(fields.popLeft());
      })
      if (i < str.length) parts.push(str.slice(i));
      return parts.length > 1 ? parts : parts[0];
    }
    // close level
    const up = () => {
      [current, last, ...args] = current;
      const elem = this.createElement(last, ...args);
      current.push(elem);
      depth-=1;
    }
    const setAttr = (props, key, value) => {
      if(key=='style' && Array.isArray(value)) value = value.join(' ');
      if (this._html_is_valid_attr_key(key))
        return props[key] = value;
      console.log(props);
      // Fix the error to avoid blocking the whole render process
      const tag = current[1];
      console.error(`Parsing error near <${tag} ... ${key}.`)
      if (key[0] == '<') {
        const newTag = key.slice(1);
        console.warn(`Ignoring <${tag}. Assuming <${newTag}...`);
        current[1] = newTag;
      }
    }
    let s = strings.join(FIELD);
    s = s.replace(/<!--[^]*-->/g, '');
    s = s.replace(/<!\[CDATA\[[^]*\]\]>/g, '');
    s = s.replace(/\s+/g, ' ');
    if (parse_math) {
      s = s.replace(/\\\$/g, ESCAPED_DOLLAR);
      // s = s.replace(/([^\\]|^)\$\$(.*?[^\\])\$\$(.|$)/sg,
      //   (match, before, tex, after) =>
      //     `${before}${parseMath(tex, true, match)}${after}`,
      // );
      // s = s.replace(
      //   /([^\\]|^)\$(.*?[^\\])\$(.|$)/sg,
      //   (match, before, tex, after) =>
      //     `${before}${parseMath(tex, false, match)}${after}`,
      // );
      //
      s = s.replace(/(\$\$|\$)([^\1]*?)\1( ?)/sg, (match, mark, tex, space) => {
        // if (match.search(/\/\>/) != -1) {
        //   match = match.replace(each_ESCAPED_DOLLAR, '\\\$');
        //   console.error('Math parsing error:', match);
        //   const safe = this._html_safe(match);
        //   return `<caph plugin="core-error">${safe}</>`;
        // }
        tex = tex.replace(/\</g, '\\lt ');
        tex = tex.replace(/\>/g, '\\gt ');
        tex = tex.replace(each_ESCAPED_DOLLAR, '\\\$');
        const mode = mark=='$$'?' displayMode':'';
        const end = space.length?`<span children=" "/>`:'';
        return `<caph plugin="${this.mathPlugin}" ${mode}>${tex}</>${end}`;
      });
      s = s.replace(each_ESCAPED_DOLLAR, '$'); // \$ in html becomes $
    }
    // There is a deep error here: they assume arg="..." will never occur in the html unless it
    // is being part of a <tag arg="...">. 
    s = s.replace(/= *('|")([^\1]*?)\1/g, (match,quote,content) => {
      quotes.push(`${quote}${content}${quote}`);
      return `=${QUOTES}`;
    });
    // ...>text<... sequence
    let depth=-1;
    s = s.replace(/(?:^|>)([^<]*)(?:$|<)/g, (match, text, idx, str) => {
      depth+=1;
      let closeTag, tag;
      if (idx) {
        let ss = str.slice(prev, idx);
        // <abc/> → <abc />
        // console.log(`${'|'.repeat(depth)}${ss}. ${text}`);
        ss = ss.replace(/(\S)\/$/, '$1 /');
        ss.split(' ').map((part, i) => {
          // console.log(' '.repeat(depth), i, part);
          if (part[0] === '/') {
            closeTag = tag || part.slice(1) || 1;
            depth-=1;
          }
          else if (!i) {
            tag = evaluate(part);
            // <p>abc<p>def, <tr><td>x<tr>
            while (close[current[1] + tag]) up();
            current = [current, tag, null];
            if (empty[tag]) closeTag = tag;
          }
          else if (part) {
            let props = current[2] || (current[2] = {});
            if (part.slice(0, 3) === '...') {
              const newProps = fields.popLeft();
              for (let key in newProps) {
                setAttr(props, key, newProps[key]);
              }
            }
            else {
              [name, value] = part.split('=');
              setAttr(props, evaluate(name), value ? evaluate(value) : true);
            }
          }
        })
      }
      if (closeTag) {
        up();
        // if last child is closable - closeTag it too
        while (last !== closeTag && close[last]) up();
      }
      prev = idx + match.length;
      if (text && (text !== ' ' || tag=='span')) evaluate((last = 0, text), current, true);
    });
    if (!current.root) up();
    return current.length > 1 ? current : current[0];
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