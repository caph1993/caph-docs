//@ts-check
/// <reference path="types.js" />
/// <reference path="utils.js" />
/// <reference path="preact-globals.js" />

/* lzutf8, utils, preact, preact hook are injected above this comment*/

// https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html

/** @namespace */
var caph = (() => {
  /** @template {Function} T @param {T} func @param {Object} obj @returns {T} */
  const bind = (func, obj)=>func.bind(obj);
  
  const parseAst = bind(NewParser.parseAst, NewParser);
  const parser = preactParser;
  const pluginDefs = parser.pluginDefs;
  const parse = bind(parser.parse, parser);
  const parseNoMarkup = bind(parser.parseNoMarkup, parser);
  
  const parseHtmlAst = (/** @type {string}*/str)=>{
    return NewParser.parseAstHtml(str);
  }
  const parseHtml = (/** @type {string}*/str)=>{
    //@ts-ignore
    return parser._evalAst(parseHtmlAst(str));
  }
  const parseElem = (/** @type {HTMLElement}*/elem, /** @type {('clear'|'hide'|'remove')?}*/action) => {
    const html = elem.innerHTML;
    if(!action){} // Do nothing
    else if(action=='clear') elem.innerHTML = '';
    else if(action=='remove') elem.remove();
    else if (action=='hide') elem.classList.add('caph-hidden');
    return parseHtml(html);
  }
  const plugin = bind(parser.plugin, parser);
  const scriptLoader = parser.scriptLoader;
  const load = bind(scriptLoader.load, scriptLoader);
  const loadFont = bind(scriptLoader.loadFont, scriptLoader);
  const injectStyle = bind(scriptLoader.injectStyle, scriptLoader);

  const _preactGlobals = preactGlobals;
  const contexts = _preactGlobals.contexts;
  const menu = _preactGlobals.menu;
  const listenToEvent = bind(_preactGlobals.listenToEvent, _preactGlobals);
  const listenToGlobal = bind(_preactGlobals.listenToGlobal, _preactGlobals);
  
  return {
    // Exported utils:
    until: MyPromise.until, assert, sleep, collections: { Queue },
    get currentSrc() {
      const elem = document?.currentScript;
      return /** @type {string}*/(elem&&elem['src']);
    },
    get mathParser(){ return parser.mathParser; },
    mathMacros: {},
    set mathParser(/** @type {'katex'|'mathjax'} */value) {
      parser.mathParser = value;
    },
    parseAst,
    parser,
    pluginDefs,
    parse,
    parseNoMarkup,
    parseHtmlAst,
    parseHtml,
    parseElem,
    plugin,
    scriptLoader,
    load,
    loadFont,
    injectStyle,
    _preactGlobals,
    contexts,
    menu,
    listenToEvent,
    listenToGlobal,
  };
})();


/** @namespace */
var caph = (() => {
  const any = /**@type {any} **/(null);
  /** @typedef {Object} Elem */
  /** @typedef {(props:Object)=>Elem} Component*/
  /** @template T @param {T} value @param {string} valueName  @returns {T extends undefined ? never : T} */ function assertDefined(value, valueName) {return any;}
  /** @template T @param {T} condition @param {any} messages  @returns {T extends false ? never : T extends null ? never: T extends undefined ? never: T extends 0 ? never: void} */ function assert(condition, ...messages){ return any; }
  const sleep = /** @type {(ms:number)=>Promise<void>}*/(any);
  const until = /** @type {(callback:()=>any)=>Promise<void>}*/(any);
  const parse = /** @type {(literals:TemplateStringsArray, ...values)=>Elem}*/(any);
  /** @lends caph */
  let typed = {
    assertDefined, assert, sleep, until,
    parse,
  };
  typed = eval("caph"); // Critical! Facade would replace the module otherwise.
  return typed;
})();



caph.injectStyle(`
div.caph-paragraph + div.caph-paragraph { margin-top: 1em; }
.caph-paragraph h1,h2,h3,h4,h5,h6,ul,ol{ margin:0; }
`);

// tab effects: https://alvarotrigo.com/blog/html-css-tabs/
caph.injectStyle(`
.tabs-header>label>input { display: none; }
.tabs-parent { width: 100%; }
.tabs-header {
  margin-top: 0.1em;
  border-bottom: 1px solid;
}
.tab-label:hover {
  top: -0.25rem;
  transition: top 0.25s;
}
.tabs{
  border: solid 1px;
  border-top: none;
}
.tab-label {
  padding-left: 1em;
  padding-right: 1em;
  border-radius: 0.3em 0.3em 0 0;
  background: unset;
  border: solid 1px;
  white-space:nowrap;
}
/* https://stackoverflow.com/a/10148189/3671939 */
.tab-label { white-space:nowrap; }
.tab-label > span{ white-space: normal; }

.tab-label-true {
  font-weight: bold;
  border-bottom: solid 2px white;
}
.tab-content-false { display:none; }
.tab-content-true {
  display: true;
  opacity: 1;
	animation-name: fadeInOpacity;
	animation-iteration-count: 1;
	animation-timing-function: ease-in;
	animation-duration: 0.15s;
}
@keyframes fadeInOpacity {
	0% { opacity: 0; }
	100% { opacity: 1;}
}
.tab-content-true { padding: 1vw; }
`);
caph.pluginDefs['@tabs'] = ({/** @type {string[]} */ labels, defaultLabel, children})=>{
  const zipped = preact.useMemo(()=>preact.toChildArray(children).map(
    (child,i) => ({label:labels[i]||`Tab ${i+1}`, child})
  ), [labels, children]);
  const [option, setOption] = preact.useState(defaultLabel || zipped[0]?.label);
  return caph.parse`
  <div class="tabs-parent">
    <div class="tabs-header">
      ${labels.map((label)=>caph.parse`
        <label class="tab-label" class=${'tab-label-'+(option==label)}>
          <input type="radio" checked=${option==label} onClick=${()=>setOption(label)}/>
          <span>${label}</>
        </label>`
      )}
    </div>
    <div class="tabs">
      ${zipped.map(({label, child})=>caph.parse`
        <div class=${'tab-content-'+(option==label)}>${child}</>`
      )}
    </div>
  </>`;
}
