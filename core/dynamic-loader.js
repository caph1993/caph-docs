
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
  setReady;
  _ready = new Promise((setter, _) => this.setReady = setter);
  ready = () => this._ready;

  _required = [
    { ref: 'caph-docs/core/colors.css', },
    { ref: 'caph-docs/core/core.css', },
    //{ ref: 'caph-docs/core/katex.min.js', },
    //{ ref: 'caph-docs/core/katex-nofonts.min.css', },
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
    window.onload = () => this.loadRoot();
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


  async loadRoot() {
    await this.preReady();
    const rootElements = [
      ...document.querySelectorAll('[data-tag="document"]'),
      ...document.querySelectorAll('[data-tag="slides"]'),
    ];
    if (rootElements.length == 0)
      console.warn('Caph-docs was loaded but not used: No element found with data-tag="document" or data-tag="slides".');
    else {
      if (rootElements.length > 1)
        console.warn("Several root elements for caph-docs. Using the first one.");
      await this._loadRoot(rootElements[0]);
    }
  }
  async _loadRoot(rootElement) {

    function tagToComponent(type, props, ...children) {
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
        type = caph.Plugin.component(tag);
      }
      return preact.h(type, props, children);
    }

    const dataParser = htm.bind(tagToComponent);
    const vDom = dataParser([`
      <div data-tag="main">
        ${this.fixSelfClosing(rootElement.outerHTML)}
      </div>
    `]);
    const sibling = MyDocument.createElement('div', {
      'parent': rootElement,
      'where': 'afterend',
    });
    rootElement.parentNode.removeChild(rootElement);
    preact.render(vDom, sibling.parentNode, sibling);
    this.setReady();
  }

  fixSelfClosing(text) {
    // parse html before feeding to htm
    // because htm does not support self-closing tags by default
    // Convert self-closing tags to temporary divs
    const tags = 'area base br col command embed hr img input keygen link meta param source track wbr';
    for (const tag of tags.split(' ')) {
      const reg = new RegExp(`<${tag}(.*?)\/?>`, 'g');
      text = text.replace(reg, `<div data-tag="selfClosing" data-htmlTag="${tag}" $1></div>`);
    }
    return text;
  }


  entities = {
    '&nbsp;': '\\ ', '&amp;': '&', '&gt;': '>', '&lt;': '<',
    '&quot;': '"', '&apos;': "'",
    '&cent;': '¢', '&pound;': '£', '&yen;': '¥',
    '&euro;': '€', '&copy;': '©', '&reg;': '®',
  };
  replace(s, obj) { // Undo xhtm replacements
    if (obj == undefined) obj = this.entities;
    for (const key in obj) s = s.replace(new RegExp(key, 'g'), obj[key]);
    return s;
  }
  mathString(text) {
    const regularExpression = /\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$[^\$\\]*(?:\\.[^\$\\]*)*\$/g;
    const latexMatch = text.match(regularExpression);

    if (!latexMatch) return text; // no math in text

    const blockRegularExpression = /\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]/g;

    const stripDollars = (stringToStrip) => (
      (stringToStrip[0] === "$" && stringToStrip[1] !== "$") ?
        stringToStrip.slice(1, -1)
        : stringToStrip.slice(2, -2)
    );

    const getDisplay = (stringToDisplay) => (
      stringToDisplay.match(blockRegularExpression) ? "block" : "inline"
    );
    let parser = (formula, mode) => `
      <script data-tag="${caph.mathTag}" data-mode="${mode}" type="text/math">
        ${formula}
      </script>`.trim();

    let result = [];
    text.split(regularExpression).forEach((s, index) => {
      result.push(caph.replace(s));
      if (latexMatch[index]) {
        const x = latexMatch[index];
        const mode = getDisplay(x);
        let formula = caph.replace(stripDollars(x));
        const block = parser(formula, mode);
        result.push(block);
      }
    });
    return result.join('');
  }


}

window.caph_requirements = window.caph_requirements || [];
var caph = new ResourcesLoader(window.caph_requirements);
delete window.caph_requirements;
window.raw_html = htm.bind(preact.createElement);

COUNTER = 0

function tagToComponent(type, props, ...children) {
  if (type == 'math') {
    props = props || {};
    props['data-tag'] = caph.mathTag;
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
    type = caph.Plugin.component(tag);
    console.log(COUNTER++);
  }
  return preact.h(type, props, children);
}
window.html = htm.bind(tagToComponent);


caph.Plugin = class {

  loadInline = false;
  _loaded = false;

  loader() { }

  post_loader() { }

  render({ }) {
    console.error('Override the render method of this object:', this);
    return raw_html`<div>Override the render method</div>`;
  }

  static component(tag) {
    return function () {
      const [starting, setStarting] = preact.useState(true);
      const [plugin, setPlugin] = preact.useState(null);
      const [ready, setReady] = preact.useState(false);
      const [error, setError] = preact.useState(null);
      const [loadInline, setLoadInline] = preact.useState(true);
      // load as inline before plugin is even loaded
      preact.useEffect(async () => {
        await sleep(200); setStarting(false);
      }, []);

      preact.useEffect(async () => {
        await caph.loadPlugin(tag);
        const plugin = await MyPromise.until(() => caph.plugins[tag]);
        setPlugin(() => plugin);
        setLoadInline(plugin.loadInline);
        try {
          if (!plugin._loaded && plugin.loader) {
            await plugin.loader(plugin, ...arguments);
            plugin._loaded = true;
          }
          setReady(true);
          if (plugin.post_loader) await plugin.post_loader(plugin, ...arguments);
          if (plugin.menuSettings) await plugin.menuSettings(plugin, ...arguments);
        } catch (err) { setError(err); console.error(err); }
      }, []);

      arguments[0].autoId = (arguments.id || arguments.autoId ||
        tag + '-' + Math.floor(1e12 * Math.random()));
      //console.log(tag, arguments);
      return raw_html`${!error && ready && plugin && plugin.render ?
        plugin.render.apply(plugin, arguments)
        :
        starting ? raw_html`` : raw_html`
          <div style="display:${loadInline ? 'inline' : 'block'}"
              class="hbox align-center space-around flex plugin-loading-container">
            ${error ? `${tag}-error` : raw_html`
              <span>${tag}</span> <div class="plugin-loading"/>`}
          </div>
      `}`;
    }
  }
}

