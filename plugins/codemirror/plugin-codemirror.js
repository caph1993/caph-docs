//@ts-check
/// <reference path="../../core/main.js" />
/// <reference path="../../libraries/codemirror-5.55.0/lib/codemirror.js" />

caph.pluginDefs[caph.currentSrc] = (async ()=>{
  await caph.load('caph-docs/libraries/codemirror-5.55.0/lib/codemirror.js');

  await caph.load('caph-docs/libraries/codemirror-5.55.0/mode/javascript/javascript.js');
  await caph.load('caph-docs/libraries/codemirror-5.55.0/mode/python/python.js');

  await caph.load('caph-docs/libraries/codemirror-5.55.0/mode/xml/xml.js');
  await caph.load('caph-docs/libraries/codemirror-5.55.0/mode/css/css.js');
  await caph.load('caph-docs/libraries/codemirror-5.55.0/mode/htmlmixed/htmlmixed.js');

  await caph.load('caph-docs/libraries/codemirror-5.55.0/addon/search/searchcursor.js');
  await caph.load('caph-docs/libraries/codemirror-5.55.0/addon/search/search.js');
  await caph.load('caph-docs/libraries/codemirror-5.55.0/addon/scroll/scrollpastend.js');
  await caph.load('caph-docs/libraries/codemirror-5.55.0/keymap/sublime.js');
  await caph.load('caph-docs/libraries/codemirror-5.55.0/addon/display/autorefresh.js');
  await caph.load('caph-docs/libraries/codemirror-5.55.0/lib/codemirror.css');
  await caph.load('caph-docs/libraries/codemirror-5.55.0/theme/monokai.css');
  await caph.load('caph-docs/plugins/codemirror/codemirror.css');

  /** @type {{cm:null|CodeMirror.Editor}}*/
  const thisThis = {cm:null}

  return ({
    unindent=true,
    children,
    keyMap='sublime',
    theme='default',
    indentUnit=2,
    tabSize=2,
    lineWrapping=true,
    lineNumbers=true,
    scrollPastEnd=false,
    autoRefresh=true, // necessary for Reveal.js
     ...props }) => {
    let code = (x => (Array.isArray(x) ? x.join('') : x))(children);
    let options = {keyMap, theme, indentUnit, tabSize, lineWrapping, lineNumbers, scrollPastEnd, autoRefresh, ...props };
    // if (unindent) code = caph.unindent(code);
    const id = preact.useMemo(()=>'codemirror-'+(''+Math.random()).slice(2), []);

    // const { getItem } = preact.useContext(caph.contexts.storage);
    // const darkTheme = getItem('darkTheme');
    // const darkTheme = true;
    // preact.useEffect(async () => {
    //   const cm = await caph.until(() => thisThis.cm);
    //   cm.setOption('theme', darkTheme ? 'monokai' : 'default');
    // }, [darkTheme]);

    preact.useEffect(async () => {
      const div = await caph.until(() => document.querySelector(`#${id}`));
      thisThis.cm = CodeMirror(div, { value: code, ...options });
    }, []);

    return caph.parse`<div id=${id}/>`;
  }
})();