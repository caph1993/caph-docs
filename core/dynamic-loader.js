
class ResourcesLoader {
  dist = null;
  mathTag = 'katex';
  mathMacros = {};
  plugins = {};
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

  setPreReady;
  _preReady = new Promise((setter, _) => this.setPreReady = setter);
  preReady = () => this._preReady;
  // setReady;
  // _ready = new Promise((setter, _) => this.setReady = setter);
  // ready = () => this._ready;

  _required = [
    { ref: 'caph-docs/core/colors.css', },
    { ref: 'caph-docs/core/core.css', },
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
    preact.render(vDom, sibling.parentNode, sibling);
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
    const tag_snake = tag.replace(/[A-Z]/g, (x) => `-${x.toLowerCase()}`);
    return await this.load(`${this.dist}/plugin-${tag_snake}.js`);
  }
  async loadPluginDeep(tag) {
    await this.loadPlugin(tag);
    await this.plugins[tag].loader();
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


  _plugin_components = {};
  plugin_component(tag) {
    // component that renders a plugin, or loading while loading
    const cache = this._plugin_components;
    if (cache[tag]) {
      //Possibly shortcut cache to load directly:
      const plugin = caph.plugins[tag];
      if (plugin && (plugin._loaded || plugin._load_error) && plugin.render) {
        cache[tag] = plugin.render.bind(plugin);
      }
      return cache[tag];
    }
    const this_raw_html = this.raw_html.bind(this);
    cache[tag] = function ({ children, ...props }) {
      const [starting, setStarting] = preact.useState(true);
      const [plugin, setPlugin] = preact.useState(caph.plugins[tag] || null);
      const [ready, setReady] = preact.useState(!!(plugin && plugin._loaded));
      const [error, setError] = preact.useState((plugin && plugin._load_error) || null);
      const [loadInline, setLoadInline] = preact.useState(plugin ? plugin.loadInline : true);
      // load always as inline before plugin is even loaded
      preact.useEffect(async () => {
        await sleep(200);
        setStarting(false);
        const plugin = await MyPromise.until(() => caph.plugins[tag]);
        setPlugin(plugin);
        setLoadInline(plugin.loadInline);
        await MyPromise.until(() => plugin._loaded || plugin._load_error);
        if (plugin._load_error) return setError(plugin._load_error);
        if (plugin._loaded) return setReady(true);
      }, []);

      return this_raw_html`${!error && ready && plugin && plugin.render ?
        plugin.render({ children, ...props })
        :
        !error ?
          this_raw_html`<code class="flashing">${children}</code>`
          :
          this_raw_html`${tag}-error`
        }`
    }
    const load_plugin = async () => {
      await caph.loadPlugin(tag);
      const plugin = await MyPromise.until(() => caph.plugins[tag]);
      try {
        if (!plugin._loaded && plugin.loader) {
          await plugin.loader(plugin);
          plugin._loaded = true;
        }
        if (plugin.post_loader) {
          await plugin.post_loader(plugin);
          plugin._loaded_post = true;
        }
        if (plugin.menuSettings) {
          await plugin.menuSettings(plugin);
          plugin._loaded_menu = true;
        }
      } catch (err) { plugin._load_error = err || true; console.error(err); }
    }
    load_plugin();
    return cache[tag];
  }

  _html_createElement(raw_mode, type, props, ...children) {
    if (!raw_mode) {
      if (type == 'caphMath') {
        props = props || {};
        props['data-tag'] = this.mathTag;
      }
      let tag = props && props['data-tag'];
      if (tag) {
        for (const k in props) if (k.startsWith('data-')) {
          const strValue = props[k];
          delete props[k];
          let value = strValue.length ? strValue : 'true';
          try { value = eval(`(${value})`); } catch (error) { }
          props[k.slice(5)] = value;
        }
        delete props['tag'];
        type = this.plugin_component(tag);
      }
    }
    children = children.map(x => this._is_string(x) ? this._html_replace_entities(x) : x)
    return preact.createElement(type, props, ...children);
  }
  _is_string(obj) {
    return Object.prototype.toString.call(obj) === "[object String]";
  }

  _html_entities = {
    '&nbsp;': '\\ ', '&amp;': '&', '&gt;': '>', '&lt;': '<',
    '&quot;': '"', '&apos;': "'",
    '&cent;': '¢', '&pound;': '£', '&yen;': '¥',
    '&euro;': '€', '&copy;': '©', '&reg;': '®',
  };

  _html_replace_entities(s, obj) {
    if (obj == undefined) obj = this._html_entities;
    for (const key in obj) s = s.replace(new RegExp(key, 'g'), obj[key]);
    return s;
  }

  _html(raw_mode, strings, ...values) {
    // based on xhtm, which is based on htm.
    // fixes issues with html entities and allows for plugin tags. 
    const f = this._html;
    if (f.empty === undefined) this._html_init();
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
      current.push(this._html_createElement(raw_mode, last, ...args));
    }
    let s = strings.join(f.FIELD);
    if (!raw_mode) {
      s = s.replace(/\\\$/g, f.ESCAPED_DOLLAR);
      s = s.replace(/([^\\])\$(.*?[^\\])\$/g, (match, p1, p2) => {
        const i = match.search(/\<|\>/);
        if (i != -1) {
          match = match.replace(f.regex_ESCAPED_DOLLAR, '\\\$');
          match = match.replace(/</gi, '&lt;').replace(/>/gi, '&gt;');
          console.error('KaTeX Can not parse the following:', match);
          return `<span class="tooltip">
            <span>
              Parsed error: <code class="flashing">${match}</code>
            </span>
            <div class="tooltip-text" style="width:30em">
              1. In tex, use \\lt and \\gt instead of &lt; and &gt;.
              <br/>
              2. In html, use \\$ instead of $.
              <br/>
              This prevents any parsing misunderstanding.
            </div>
          </span>`;
        }
        p2 = p2.replace(f.regex_ESCAPED_DOLLAR, '\\\$');
        return `${p1}<caphMath>${p2}</caphMath>`;
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

  html(strings, ...values) {
    return this._html(false, strings, ...values);
  }
  raw_html(strings, ...values) {
    return this._html(true, strings, ...values);
  }

  _html_init() {
    const f = this._html;
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
}

window.caph_requirements = window.caph_requirements || [];
const caph = new ResourcesLoader(window.caph_requirements);
delete window.caph_requirements;
// window.raw_html = htm.bind(preact.createElement);


window.html = caph.html.bind(caph);
window.raw_html = caph.raw_html.bind(caph);

caph.Plugin = class {

  loadInline = false;
  _loaded = false;
  _loaded_post = false;
  _loaded_menu = false;
  _load_error = false;

  loader() { }

  post_loader() { }

  render({ }) {
    console.error('Override the render method of this object:', this);
    return raw_html`<div>Override the render method</div>`;
  }
}

