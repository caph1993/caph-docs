/* lzutf8, utils, preact, preact hook are injected above this comment*/

const caph = new class {

  mathPlugin = 'katex';
  mathMacros = {};

  officialPlugins = [
    'core-menu',
    'core-about',
    'katex',
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
    const requirements = window.caph_requirements || [];
    window.caph_requirements = requirements;
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
    this.contexts['core-route'] = preact.createContext();
    this.init_route();
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
    // this.contexts['core-storage'] = new class extends this.HeadlessContext {
    //   storage = {}
    //   constructor() {
    //     super();
    //     const st = { ...window.localStorage };
    //     for (let k in st) {
    //       try { this.storage[k] = JSON.parse(st[k]); }
    //       catch (err) { }
    //     }
    //   }
    //   value() {
    //     return {
    //       storage: this.storage,
    //       getItem: this.getItem.bind(this),
    //       setItem: this.setItem.bind(this),
    //     };
    //   }
    //   getItem(key) { return this.storage[key]; }
    //   setItem(key, value) {
    //     this.storage[key] = value;
    //     window.localStorage.setItem(key, JSON.stringify(value));
    //     this.update();
    //   }
    // }

    const menuObject = new class {
      constructor() {
        this.addOption('Default', { hold: true });
        this.latest = this.option = 'Default';
      }

      options = [];
      onEnter = {};
      onExit = {};
      hold = {};
      addOption(option, { onEnter, onExit, hold } = {}) {
        this.onEnter[option] = onEnter;
        this.onExit[option] = onExit;
        this.hold[option] = hold;
        if (this.options[option]) return;
        this.options.push(option);
        this.options[option] = 1;
        if (this.option) this.update();
      }
      setOption(option) {
        if (this.hold[option]) {
          this.onExit[this.latest] && this.onExit[this.latest]();
          this.latest = this.option;
          this.option = option;
          this.update();
        }
        this.onEnter[option] && this.onEnter[option]();
      }
      value() {
        return {
          option: this.option,
          options: this.options,
          addOption: this.addOption.bind(this),
          setOption: this.setOption.bind(this),
        };
      }
    }

    const MenuComponent = ({ }) => {
      const [trigger, setTrigger] = preact.useState(0);
      menuObject.update = () => setTrigger(Math.random());

      const menu = preact.useMemo(() => {
        return menuObject.value();
      }, [trigger]);

      return this.parse`
        <${this.contexts['core-menu'].Provider} value=${menu}>
          <${caph.plugin('core-menu')} />
          <${caph.plugin('core-about')} />
        </>
      `;
    }
    async function inject(vDom) {
      await MyPromise.until(() => document.body);
      // const node = MyDocument.createElement('div', {
      //   parent: document.body,
      //   where: 'afterbegin',
      //   id: 'core-body',
      // })
      const node = document.body;
      preact.render(vDom, node);
    }
    inject(this.parse`<${MenuComponent}/>`);
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

  init_route() {
    this.fileMode = (window.location.protocol == 'file:');

    this.routeProvider = ({ children, baseUrl = '/' }) => {
      const currentRoute = preact.useCallback(() => {
        if (!this.fileMode) {
          const out = location.pathname;
          if (!out.startsWith(baseUrl))
            console.warn(`${out} does not start with ${baseUrl}`);
          return `/${out.slice(baseUrl.length)}`;
        }
        const params = new URLSearchParams(location.search);
        return `/${params.get('') || ''}`;
      }, []);

      const [trigger, setTrigger] = preact.useState(0);

      preact.useEffect(() => { // register back/forward button event listener
        addEventListener('popstate', (event) => {
          setTrigger(Math.random());
        });
      }, []);

      const routeState = preact.useMemo(() => {
        const route = currentRoute();
        const RouteLink = ({ route, text }) => {
          return caph.parse`
            <a href=${this.href(route)} onClick=${() => {
              window.event.preventDefault();
              history.pushState(null, null, this.href(route));
              setTrigger(Math.random());
            }} title=${text}>
              ${text}
            </a >`;
        }
        return { route, RouteLink };
      }, [trigger]);
      return caph.parse`
        <${caph.contexts['core-route'].Provider} value=${routeState}>
          ${children}
        </>`;
    }
  }
  href(route) {
    if (!this.fileMode)
      return this._URL_resolve(route);
    const path = location.pathname;
    const params = new URLSearchParams(location.search);
    const missing = params.get('') || '';
    let base = new URL(route, `file://${path}/${missing}`).href;
    params.delete('');
    params.append('', base.slice(path.length + 8));
    return `${path}?${params.toString()}`;
  };

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

  async load(ref, {
    attrs = {}, parent = null, where = 'beforeend',
    auto_attrs = true
  } = {}) {
    if (parent == null) parent = this.div;
    const ext = ref.split('.').pop();
    let tag = ext == 'js' ? 'script' : ext == 'css' ? 'link' : null;
    if (tag == null) throw new Error('Only .js and .css files can be _sources. Got: ' + ext + ' ' + ref);
    let defaults = {};
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
      console.log(err);
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
  pluginLoader(key) {
    if (key.endsWith('.js')) key = this._URL_resolve(key);
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
      e.onload = () => { if (!done) { done = true; _ok(); } };
      e.onerror = (x) => { if (!done) { done = true; _err(x); } }; // HTTP errors only
      Object.keys(attrs).map(key => e.setAttribute(key, attrs[key]));
      if (content) {
        let r = window._loaded_resources || {};
        window._loaded_resources = r;
        r[ref] = false;
        content += `\nwindow._loaded_resources['${ref}']=true;\n`;
        e.innerHTML = content;
        if (tag == 'script') {
          (async () => {
            while (!r[ref]) await sleep(100);
            done = true; _ok();
          })();
        } else if (tag == 'style') {
          let ms = 10;
          setTimeout(() => { done = true, _ok() }, ms);
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
    const regex_FIELD = new RegExp(FIELD, 'g');
    const regex_QUOTES = new RegExp(QUOTES, 'g');
    const regex_ESCAPED_DOLLAR = new RegExp(ESCAPED_DOLLAR, 'g');

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
    this._parseEnv = { empty, close, FIELD, QUOTES, ESCAPED_DOLLAR, regex_FIELD, regex_QUOTES, regex_ESCAPED_DOLLAR }
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
  _parse(parse_math, strings, ...values) {
    // based on xhtm, which is based on htm. Differences:
    // 1. Replaces html entities
    // 2. Parses math markup.
    // 3. Solves some errors instead of blocking.
    if (this._parseEnv === undefined) this._parse_init();
    const { empty, close, FIELD, QUOTES, ESCAPED_DOLLAR, regex_FIELD, regex_QUOTES, regex_ESCAPED_DOLLAR } = this._parseEnv;
    let prev = 0, current = [], field = 0, args, name, value, quotes = [], quote = 0, last;
    current.root = true;

    const evaluate = (str, parts = [], raw) => {
      let i = 0;
      str = !raw && str === QUOTES ?
        quotes[quote++].slice(1, -1) :
        str.replace(regex_QUOTES, m => quotes[quote++]);
      if (!str) return str;
      str.replace(regex_FIELD, (match, idx) => {
        if (idx) parts.push(str.slice(i, idx));
        i = idx + 1;
        return parts.push(values[field++]);
      })
      if (i < str.length) parts.push(str.slice(i));
      return parts.length > 1 ? parts : parts[0];
    }
    // close level
    const up = () => {
      [current, last, ...args] = current;
      const elem = this.createElement(last, ...args);
      current.push(elem);
    }
    const setAttr = (props, key, value) => {
      if (this._html_is_valid_attr_key(key))
        return props[key] = value;
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
    if (parse_math) {
      s = s.replace(/\\\$/g, ESCAPED_DOLLAR);
      s = s.replace(/([^\\]|^)\$(.*?[^\\])\$/g, (match, p1, p2) => {
        // const i = match.search(/\<|\>/);
        // if (i != -1) {
        //   match = match.replace(regex_ESCAPED_DOLLAR, '\\\$');
        //   console.error('Parsing error:', match);
        //   const safe = this._html_safe(match);
        //   return `<caph plugin="core-error">${safe}</>`;
        // }
        p2 = p2.replace(/\</g, '\\lt ');
        p2 = p2.replace(/\>/g, '\\gt ');
        p2 = p2.replace(regex_ESCAPED_DOLLAR, '\\\$');
        return `${p1}<caph plugin=${this.mathPlugin}>${p2}</>`;
      });
      s = s.replace(regex_ESCAPED_DOLLAR, '$'); // \$ in html becomes $
    }
    s = s.replace(/<!--[^]*-->/g, '');
    s = s.replace(/<!\[CDATA\[[^]*\]\]>/g, '');
    s = s.replace(/('|")[^\1]*?\1/g, match => (quotes.push(match), QUOTES));
    // .replace(/^\s*\n\s*|\s*\n\s*$/g,'')
    s = s.replace(/\s+/g, ' ');
    // ...>text<... sequence
    s = s.replace(/(?:^|>)([^<]*)(?:$|<)/g, (match, text, idx, str) => {
      let closeTag, tag;
      if (idx) {
        let ss = str.slice(prev, idx);
        // <abc/> → <abc />
        ss = ss.replace(/(\S)\/$/, '$1 /');
        ss.split(' ').map((part, i) => {
          if (part[0] === '/') {
            closeTag = tag || part.slice(1) || 1;
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
              const newProps = values[field++];
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
      if (text && text !== ' ') evaluate((last = 0, text), current, true);
    });
    if (!current.root) up();
    return current.length > 1 ? current : current[0];
  }
}


caph.Plugin = class {

  async loader() { }

  Component({ children, ...props }) {
    console.error('Override the Component method of this object:', this);
    return caph.parse`<${caph.plugin('core-error')}> Override the Component method</> `;
  }

}

caph.PluginLoader = class extends caph.Plugin {

  constructor(key) {
    super();
    this.key = key;
    this.loader();
    caph.load('caph-docs/core/plugin-loader.css');
  }

  plugin = null;
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
    if (key.endsWith('.js')) {
      await caph.load(key);
      assert(caph.pluginDefs[key], 'Plugin not declared in file: ' + key);
      return caph.pluginDefs[key];
    }
    if (caph.officialPlugins.includes(key)) {
      const url = `${caph.dist}/plugin-${key}.js`;
      return caph.pluginDefs[key] = caph.pluginLoader(url);
    }
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
      return caph.parse`<code class="flashing">${children}</code>`;
    }
  }

  _loadingComponent({ children }) {
    return caph.parse`
    <code class="caph-flashing" title=${`${this.key} is loading...`}>
      ${children}
    </code>`;
  }

  _loadErrorComponent({ children }) {
    return caph.parse`<${caph.plugin('core-error')} tooltip=${this.error}/>`;
  }
}

caph.pluginDefs['core-error'] = new class extends caph.Plugin {

  Component({ children, tooltip }) {
    const help = preact.useCallback(() => {
      const win = window.open('', '_blank');
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
        window.preventDefault(e);
        help();
      }}>(help?)</a> 
      <code class="caph-flashing caph-error" title=${tooltip}>
        ${children}
      </code>
    `;
  }
}


// caph.contexts['core-route'] = preact.createContext();

// caph.historyTrigger = ({ children }) => {
//   const [trigger, setTrigger] = preact.useState();

//   preact.useEffect(() => { // register event listener
//     const { pushState, replaceState, go } = window.history;
//     window.history.pushState = (...args) => {
//       pushState(...args);
//       setTrigger(Math.random());
//     }
//     window.history.replaceState = (...args) => {
//       replaceState(...args);
//       setTrigger(Math.random());
//     }
//     window.history.go = (...args) => {
//       go(...args);
//       setTrigger(Math.random());
//     }
//     window.history.back = (...args) => {
//       back(...args);
//       setTrigger(Math.random());
//     }
//     window.history.forward = (...args) => {
//       forward(...args);
//       setTrigger(Math.random());
//     }
//   }, []);

//   return caph.parse`
//     <${caph.contexts['core-history-trigger'].Provider} value=${trigger}>
//       ${children}
//     </>`;
// };

