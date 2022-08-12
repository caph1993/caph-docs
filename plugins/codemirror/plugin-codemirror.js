
caph.pluginDefs[caph.currentSrc] = new class extends caph.Plugin {

  cm = null;

  Component({ children, autoId, id, options = {}, unindent = true, class: _class }) {
    let code = (x => (Array.isArray(x) ? x.join('') : x))(children);
    if (unindent) code = caph.utils.unindent(code);
    id = id || autoId;

    const { getItem } = preact.useContext(caph.contexts.storage);
    const darkTheme = getItem('darkTheme');

    const cmOptions = MyObject.deep_assign({
      theme: darkTheme ? 'monokai' : 'default',
      indentUnit: 2,
      tabSize: 2,
      lineWrapping: true,
      lineNumbers: true,
      keyMap: 'sublime',
      scrollPastEnd: false,
      autoRefresh: true, // necessary for Reveal.js
    }, options);

    preact.useEffect(async () => {
      const div = await MyPromise.until(() => document.querySelector(`#${id}`));
      this.cm = CodeMirror(div, { value: code, ...cmOptions });
    }, []);

    preact.useEffect(async () => {
      const cm = await MyPromise.until(() => this.cm);
      cm.setOption('theme', darkTheme ? 'monokai' : 'default');
    }, [darkTheme]);

    return html`
    <div id=${id} class=${_class + ' codemirror-container'}/>`;
  }

  async loader() {
    await caph.load('caph-docs/libraries/codemirror-5.55.0/lib/codemirror.js');
    await caph.load('caph-docs/libraries/codemirror-5.55.0/mode/javascript/javascript.js');
    await caph.load('caph-docs/libraries/codemirror-5.55.0/mode/python/python.js');
    await caph.load('caph-docs/libraries/codemirror-5.55.0/addon/search/searchcursor.js');
    await caph.load('caph-docs/libraries/codemirror-5.55.0/addon/search/search.js');
    await caph.load('caph-docs/libraries/codemirror-5.55.0/addon/scroll/scrollpastend.js');
    await caph.load('caph-docs/libraries/codemirror-5.55.0/keymap/sublime.js');
    await caph.load('caph-docs/libraries/codemirror-5.55.0/addon/display/autorefresh.js');
    await caph.load('caph-docs/libraries/codemirror-5.55.0/lib/codemirror.css');
    await caph.load('caph-docs/libraries/codemirror-5.55.0/theme/monokai.css');
    await caph.load('caph-docs/plugins/codemirror/codemirror.css');
    return;
  }

  cmRender({ div, code, cmOptions, darkTheme = false }) {

  }
};