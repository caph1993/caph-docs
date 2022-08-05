
class ResourcesLoader {
  dist = null;
  mathTag = 'katex';
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


  make_parsers(config) {
    const raw = (strings, ...values) => this._html(config, strings, ...values);
    const non_raw = ({ raw: strings }, ...values) => this._html(config, strings, ...values);
    return [raw, non_raw];
  }
  html({ raw: strings }, ...values) {
    const config = { parse_math: true, parse_components: true, unescape_html: true };
    return this._html(config, strings, ...values);
  }

  html_alt(strings, ...values) {
    const config = { parse_math: true, parse_components: true, unescape_html: true };
    return this._html(config, strings, ...values);
  }

  html_plain({ raw: strings }, ...values) {
    const config = { parse_math: false, parse_components: true };
    return this._html(config, strings, ...values);
  }
  html_plain_unescape(strings, ...values) {
    const config = { parse_math: false, parse_components: false };
    return this._html(config, strings, ...values);
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

  _html_createElement({ parse_math, parse_components, unescape_html }, type, props, ...children) {
    if (parse_math && type == 'caphMath') {
      props = props || {};
      props['data-tag'] = this.mathTag;
    }
    if (parse_components) {
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
        if (!this.plugin_loaders[tag]) {
          const plugin_loader = new this.PluginLoader(tag);
          this.plugin_loaders[tag] = plugin_loader.render.bind(plugin_loader);
        }
        type = this.plugin_loaders[tag];
      }
      // children = children.map(x => this._is_string(x) ? this._html_safe(x) : x);
    }
    if (unescape_html) {
      children = children.map(x => this._is_string(x) ? this._html_safe_undo(x) : x);
    }
    return preact.createElement(type, props, ...children);
  }

  _html_safe(str) {
    // converts < into &lt
    return new Option(str).innerHTML;
  }
  _html_safe_undo(str) {
    // converts &lt into <
    const doc = new DOMParser().parseFromString(str, "text/html");
    const text = doc.documentElement.textContent;
    return text;
  }

  _parse_html_string(str_html) {
    const config = {
      parse_math: false,
      parse_components: false,
      unescape_html: true,
    };
    return this._html(config, [str_html]);
  }

  _is_string(obj) {
    return Object.prototype.toString.call(obj) === "[object String]";
  }

  _html(config, strings, ...values) {
    const { parse_math, parse_components, unescape_html } = config;
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
      const elem = this._html_createElement(config, last, ...args);
      current.push(elem);
    }
    let s = strings.join(f.FIELD);
    if (parse_math) {
      s = s.replace(/\\\$/g, f.ESCAPED_DOLLAR);
      s = s.replace(/([^\\]|^)\$(.*?[^\\])\$/g, (match, p1, p2) => {
        const i = match.search(/\<|\>/);
        if (i != -1) {
          match = match.replace(f.regex_ESCAPED_DOLLAR, '\\\$');
          console.error('Math parsing error for the following string:', match);
          return this.html`< span class="tooltip" >
            <span>
              Parsed error: <code class="flashing">${this._html_safe(match)}</code>
            </span>
            <div class="tooltip-text" style="width:30em">
              1. In tex, use \\lt and \\gt instead of &lt; and &gt;.
              <br/>
              2. In html, use \\$ instead of $.
              <br/>
              This prevents any parsing misunderstanding.
            </div>
          </span > `;
        }
        p2 = p2.replace(f.regex_ESCAPED_DOLLAR, '\\\$');
        return `${p1} <caphMath>${p2}</caphMath>`;
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

window.html = caph.html.bind(caph);

caph.Plugin = class {

  loadInline = false;

  async loader() { }

  async post_loader() { }

  async menuSettings() { }

  render({ children, ...props }) {
    console.error('Override the render method of this object:', this);
    return html_plain`< div > Override the render method</div > `;
  }
}

caph.PluginLoader = class extends caph.Plugin {

  constructor(tag, loadInline = false) {
    super();
    this.tag = tag;
    this.loadInline = loadInline;
    this.loader().then(() => this.post_loader())
  }

  plugin = null;
  error = null;
  render_ready = false;

  async loader() {
    // 1. Put the plugin script in the document head
    await caph.loadPlugin(this.tag);
    // 2. Wait for the browser to load the script
    this.plugin = await MyPromise.until(() => caph.plugins[this.tag]);
  }

  async post_loader() {
    // 3. Wait for the plugin to initialize its own dependencies
    try {
      await this.plugin.loader();
      this.render_ready = true;
    } catch (err) {
      this.error = err || true;
      console.error(err);
    }
    await this.plugin.post_loader().catch(console.error);
    await this.plugin.menuSettings().catch(console.error);
  }

  render({ children, ...props }) {
    return this.temporal_render({ children, ...props });
  }

  temporal_render({ children, ...props }) {
    const [_, setTrigger] = preact.useState(0);

    preact.useEffect(async () => {
      await MyPromise.until(() => this.render_ready || this.error);
      setTrigger(Math.random() * 1e12); // refresh the component
    }, []);


    if (this.render_ready) {
      return this.final_render({ children, ...props });
    }
    if (this.error) {
      return caph.html_plain`
        <code class="caph-docs-flashing caph-docs-error"
          title=${caph._html_safe(this.error)}>
          ${children}
        </code>`;
    }
    return caph.html_plain`
        <code class="caph-docs-flashing" title=${`${this.tag} is loading...`}>
          ${children}
        </code>
      `;
  }

  final_render({ children, ...props }) {
    this.render = this.final_render; // override the render method
    try {
      return this.plugin.render({ children, ...props });
    } catch (err) {
      console.error(`Rendering error in plugin ${this.tag}:`, err);
      return caph.html`<code class="flashing">${children}</code>`;
    }
  }
}

