
class ResourcesLoader {
  preact;
  dist = null;
  mathPlugin = 'katex';
  mathMacros = {};
  plugins = {};
  plugin_loaders = {};
  contexts = {};
  utils = {
    unindent: (text) => {
      let lines = text.split('\n');
      let n = lines.filter(l => l.trim().length)
        .map(l => l.length - l.trimStart().length)
        .reduce((p, c) => Math.min(c, p), 1000);
      return lines.map(l => l.slice(n)).join('\n');
    }
  };
  components = {};
  _attachments = [];
  _loadStatus = {};
  recommended_style = `
  code{
    /*background-color: var(--background-pre);*/
    display: inline;
    padding: 0em 0.25em;
    border-radius: 0.2em;
    font-size: 0.8em;
  };`

  setPreReady;
  _preReady = new Promise((setter, _) => this.setPreReady = setter);
  preReady = () => this._preReady;

  _required = [
    //{ ref: 'caph-docs/core/colors.css', },
    //{ ref: 'caph-docs/core/core.css', },
  ];

  constructor(required_attachments) {
    for (let a of required_attachments) this.attach(a);
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
    const metaContent = document.querySelector('meta[content]');
    if (!metaContent) MyDocument.createElement('div', {
      parent: document.head,
      where: 'afterbegin',
      name: 'viewport',
      content: window.innerWidth > 960 ?
        'width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no'
        : 'width=1024'
    });
    (async () => {
      for (let s of this._required) {
        await this.load(s.ref, {
          parent: this.div,
          afterPreReady: false,
        });
      }
      this.preact = window.preact;
      this.setPreReady();
    })();
  }

  async createElementReplace(rootElement, vDom = null) {
    vDom = vDom || dataParser([`${rootElement.outerHTML}`]);
    const sibling = MyDocument.createElement('div', {
      'parent': rootElement,
      'where': 'afterend',
    });
    rootElement.parentNode.removeChild(rootElement);
    preact.Component(vDom, sibling.parentNode, sibling);
    //this.setReady();
  }

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

  async load(ref, { attrs = {}, parent = null, where = 'beforeend',
    auto_attrs = true, afterPreReady = true } = {}) {
    // Load an external script or style by inserting relative to parent
    if (afterPreReady) await this.preReady();
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
  async loadPlugin(tag) {
    if (this.plugins[tag]) return; // already loaded
    return await this.load(`${this.dist}/plugin-${tag}.js`);
  }
  async loadFont(name) {
    return await this.load(`${this.dist}/font-${name}.css`);
  }

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
    const f = this._parse;
    f.empty = {}
    f.close = {}
    f.FIELD = '\ue000';
    f.QUOTES = '\ue001';
    f.ESCAPED_DOLLAR = '\ue002';
    f.regex_FIELD = new RegExp(f.FIELD, 'g');
    f.regex_QUOTES = new RegExp(f.QUOTES, 'g');
    f.regex_ESCAPED_DOLLAR = new RegExp(f.ESCAPED_DOLLAR, 'g');

    'area base br col command embed hr img input keygen link meta param source track wbr ! !doctype ? ?xml'.split(' ').map(v => f.empty[v] = f.empty[v.toUpperCase()] = true)

    // https://html.spec.whatwg.org/multipage/syntax.html#optional-tags
    // closed by the corresponding tag or end of parent content
    let close = {
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
        f.close[tag] =
          f.close[tag.toUpperCase()] =
          f.close[tag + closer] =
          f.close[tag.toUpperCase() + closer] =
          f.close[tag + closer.toUpperCase()] =
          f.close[tag.toUpperCase() + closer.toUpperCase()] =
          true;
      })
    }
  }

  plugin(key) {
    if (!this.plugin_loaders[key]) {
      const plugin_loader = new this.PluginLoader(key);
      this.plugin_loaders[key] = plugin_loader.Component.bind(plugin_loader);
    }
    return this.plugin_loaders[key];
  }

  createElement(type, props, ...children) {
    if (type == 'caph-docs') {
      const pluginKey = props && props['plugin'];
      if (pluginKey) type = this.plugin(pluginKey);
      else console.warn('caph-docs tag without plugin attribute');
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

  _parse(parse_math, strings, ...values) {
    // based on xhtm, which is based on htm.
    // fixes issues with html entities and allows for plugin tags.
    const f = this._parse;
    if (f.empty === undefined) this._parse_init();
    let prev = 0, current = [], field = 0, args, name, value, quotes = [], quote = 0, last;
    current.root = true;

    const evaluate = (str, parts = [], raw) => {
      let i = 0;
      str = !raw && str === f.QUOTES ?
        quotes[quote++].slice(1, -1) :
        str.replace(f.regex_QUOTES, m => quotes[quote++]);
      if (!str) return str;
      str.replace(f.regex_FIELD, (match, idx) => {
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
    let s = strings.join(f.FIELD);
    if (parse_math) {
      s = s.replace(/\\\$/g, f.ESCAPED_DOLLAR);
      s = s.replace(/([^\\]|^)\$(.*?[^\\])\$/g, (match, p1, p2) => {
        const i = match.search(/\<|\>/);
        if (i != -1) {
          match = match.replace(f.regex_ESCAPED_DOLLAR, '\\\$');
          console.error('Parsing error:', match);
          const safe = this._html_safe(match);
          return `<caph-docs plugin="parse-error">${safe}</>`;
        }
        p2 = p2.replace(f.regex_ESCAPED_DOLLAR, '\\\$');
        return `${p1}<caph-docs plugin=${this.mathPlugin}>${p2}</>`;
      });
      s = s.replace(f.regex_ESCAPED_DOLLAR, '$'); // \$ in html becomes $
    }
    s = s.replace(/<!--[^]*-->/g, '');
    s = s.replace(/<!\[CDATA\[[^]*\]\]>/g, '');
    s = s.replace(/('|")[^\1]*?\1/g, match => (quotes.push(match), f.QUOTES));
    // .replace(/^\s*\n\s*|\s*\n\s*$/g,'')
    s = s.replace(/\s+/g, ' ');
    // ...>text<... sequence
    s = s.replace(/(?:^|>)([^<]*)(?:$|<)/g, (match, text, idx, str) => {
      let close, tag;
      if (idx) {
        let ss = str.slice(prev, idx);
        // <abc/> → <abc />
        ss = ss.replace(/(\S)\/$/, '$1 /');
        ss.split(' ').map((part, i) => {
          if (part[0] === '/') {
            close = tag || part.slice(1) || 1;
          }
          else if (!i) {
            tag = evaluate(part);
            // <p>abc<p>def, <tr><td>x<tr>
            while (f.close[current[1] + tag]) up();
            current = [current, tag, null];
            if (f.empty[tag]) close = tag;
          }
          else if (part) {
            let props = current[2] || (current[2] = {});
            if (part.slice(0, 3) === '...') {
              Object.assign(props, values[field++]);
            }
            else {
              [name, value] = part.split('=');
              props[evaluate(name)] = value ? evaluate(value) : true;
            }
          }
        })
      }
      if (close) {
        up();
        // if last child is closable - close it too
        while (last !== close && f.close[last]) up();
      }
      prev = idx + match.length;
      if (text && text !== ' ') evaluate((last = 0, text), current, true);
    });
    if (!current.root) up();
    return current.length > 1 ? current : current[0];
  }
}

window.caph_requirements = window.caph_requirements || [];
const caph = new ResourcesLoader(window.caph_requirements);
delete window.caph_requirements;

caph.Plugin = class {

  async loader() { }

  async postLoader() { }

  async menuLoader({ option, options, addOption, setOption }) { }

  Component({ children, ...props }) {
    console.error('Override the Component method of this object:', this);
    return caph.parse`<div> Override the Component method </div> `;
  }
}

caph.PluginLoader = class extends caph.Plugin {

  constructor(key, loadInline = false) {
    super();
    this.key = key;
    this.loadInline = loadInline;
    this.loader().then(() => this.postLoader())
    caph.load('caph-docs/core/plugin-loader.css');
  }

  plugin = null;
  error = null;
  renderReady = false;

  async loader() {
    // 1. Put the plugin script in the document head
    await caph.loadPlugin(this.key);
    // 2. Wait for the browser to load the script
    this.plugin = await MyPromise.until(() => caph.plugins[this.key]);
  }

  async postLoader() {
    // 3. Wait for the plugin to initialize its own dependencies
    try {
      await this.plugin.loader();
      this.renderReady = true;
    } catch (err) {
      this.error = err || true;
      console.error(err);
    }

    // HOTFIX
    this.plugin.postLoader().catch(console.error);
    const ctx = await MyPromise.until(() =>
      caph.contexts.menu && preact.useContext(caph.contexts.menu));
    this.plugin.menuLoader(ctx).catch(console.error);
    // MyPromise.until(() => preact.useContext).then(() =>
    //   this.plugin.menuLoader().catch(console.error));
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
    <code class="caph-docs-flashing" title=${`${this.key} is loading...`}>
      ${children}
    </code>`;
  }

  _loadErrorComponent({ children }) {
    return caph.parse`
      <code class="caph-docs-flashing caph-docs-error"
        title=${caph._html_safe(this.error)}>
        ${children}
      </code>`;
  }
}

caph.plugins.mathParseError = new class extends caph.Plugin {

  Component({ children }) {
    return caph.parse`
    <span class="tooltip">
      <span>
        Parsed error: <code class="flashing">${children}</code>
      </span>
      <!--div class="tooltip-text" style="width:30em">
        1. In tex, use \\lt and \\gt instead of &lt; and &gt;.
        <br/>
        2. In html, use \\$ instead of $.
        <br/>
        This prevents any parsing misunderstanding.
      </div-->
    </span > 
    `;
  }
}

caph.plugins['main'] = new class extends caph.Plugin {
  loadInline = false;

  async loader() {
    caph.contexts = {
      storage: caph.preact.createContext(),
      menu: caph.preact.createContext(),
      darkTheme: caph.preact.createContext(false),
    }
  }

  Component({ children }) {
    const menu = this.Menu;
    const [menuWrapper, setMenu] = caph.preact.useState(menu.exposed());
    menu.update = () => setMenu(menu.exposed());

    const storage = this.Storage;
    const [storageWrapper, setStorage] = caph.preact.useState(storage.exposed());
    storage.update = () => setStorage(storage.exposed());

    return caph.parse`
      <div id="caph-root" data-theme=${storage.getItem('darkTheme') ? 'dark' : 'light'}>
        <${caph.contexts.storage.Provider} value=${storageWrapper}>
          <${caph.contexts.menu.Provider} value=${menuWrapper}>
            <${caph.plugin('menu')}/>
            <${caph.plugin('about')}/>
            ${children}
          </>
        </>
      </div>`;
  }

  Storage = new class {
    storage = {}
    constructor() {
      const st = { ...window.localStorage };
      for (let k in st) {
        try { this.storage[k] = JSON.parse(st[k]); }
        catch (err) { }
      }
    }
    setItem(key, value) {
      this.storage[key] = value;
      window.localStorage.setItem(key, JSON.stringify(value));
      this.update();
    }
    getItem(key) { return this.storage[key]; }
    update() { throw 'Abstract method' }
    exposed() {
      return {
        storage: this.storage,
        getItem: this.getItem.bind(this),
        setItem: this.setItem.bind(this),
      }
    }
  }

  Menu = new class {
    option = null;
    latest = null;
    options = [];
    onEnter = {};
    onExit = {};
    hold = {};
    _options = {};
    constructor() {
      this.addOption('Default', { hold: true });
      this.latest = this.option = 'Default';
    }
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
    update() { throw 'Abstract method' }
    exposed() {
      return {
        option: this.option,
        options: this.options,
        addOption: this.addOption.bind(this),
        setOption: this.setOption.bind(this),
      }
    }
  }
};

