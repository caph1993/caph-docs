////@ts-check
//// <reference path="../../src/index.js" />
/// <reference path="../../libraries/codemirror-5.55.0/lib/codemirror.js" />

caph.defineFileComponent((async ()=>{
  caph.load('@dist/libraries/codemirror-5.55.0/lib/codemirror.lz.js'/*libraries/codemirror-5.55.0/lib/codemirror.js*/);
  await caph.until(()=>window["CodeMirror"]);

  caph.load('@dist/libraries/codemirror-5.55.0/mode/javascript/javascript.lz.js'/*libraries/codemirror-5.55.0/mode/javascript/javascript.js*/);
  caph.load('@dist/libraries/codemirror-5.55.0/mode/python/python.lz.js'/*libraries/codemirror-5.55.0/mode/python/python.js*/);

  caph.load('@dist/libraries/codemirror-5.55.0/mode/xml/xml.lz.js'/*libraries/codemirror-5.55.0/mode/xml/xml.js*/);
  caph.load('@dist/libraries/codemirror-5.55.0/mode/css/css.lz.js'/*libraries/codemirror-5.55.0/mode/css/css.js*/);
  caph.load('@dist/libraries/codemirror-5.55.0/mode/htmlmixed/htmlmixed.lz.js'/*libraries/codemirror-5.55.0/mode/htmlmixed/htmlmixed.js*/);

  caph.load('@dist/libraries/codemirror-5.55.0/addon/search/searchcursor.lz.js'/*libraries/codemirror-5.55.0/addon/search/searchcursor.js*/);
  caph.load('@dist/libraries/codemirror-5.55.0/addon/search/search.lz.js'/*libraries/codemirror-5.55.0/addon/search/search.js*/);
  caph.load('@dist/libraries/codemirror-5.55.0/addon/scroll/scrollpastend.lz.js'/*libraries/codemirror-5.55.0/addon/scroll/scrollpastend.js*/);
  caph.load('@dist/libraries/codemirror-5.55.0/keymap/sublime.lz.js'/*libraries/codemirror-5.55.0/keymap/sublime.js*/);
  caph.load('@dist/libraries/codemirror-5.55.0/addon/display/autorefresh.lz.js'/*libraries/codemirror-5.55.0/addon/display/autorefresh.js*/);
  caph.load('@dist/libraries/codemirror-5.55.0/lib/codemirror.css'/*libraries/codemirror-5.55.0/lib/codemirror.css*/);
  caph.load('@dist/libraries/codemirror-5.55.0/theme/monokai.css'/*libraries/codemirror-5.55.0/theme/monokai.css*/);

  await caph.sleep(500);

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
    onId=(()=>{}),
     ...props }) => {
    let code = (x => (Array.isArray(x) ? x.join('') : x))(children);
    let options = {keyMap, theme, indentUnit, tabSize, lineWrapping, lineNumbers, scrollPastEnd, autoRefresh, ...props };
    // if (unindent) code = caph.unindent(code);
    const id = preact.useMemo(()=>'codemirror-'+(''+Math.random()).slice(2), []);
    preact.useEffect(()=>onId(id), [id]);

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
})());

caph.injectStyle(`
.codemirror-container{
  height: 100%;
}
.codemirror-container .CodeMirror{
  width: 100%;
  height: 100%;
}

.codemirror-container .CodeMirror-line {
  width: unset;
}`)