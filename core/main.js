//@ts-check
/// <reference path="types.js" />
/// <reference path="utils.js" />
/// <reference path="preact-globals.js" />

/* lzutf8, utils, preact, preact hook are injected above this comment*/


/**
 * @template {Function} T 
 * @param {T} func
 * @param {Object} obj
 * @returns {T}
*/
const bind = (func, obj)=>func.bind(obj);


const caph = new class {
  
  // Exported utils:
  until = MyPromise.until;
  assert = assert;
  sleep = sleep;


  parseAst = bind(NewParser.parseAst, NewParser);
  _parser = preactParser;
  pluginDefs = this._parser.pluginDefs;
  parse = bind(this._parser.parse, this._parser);
  parseNoMarkup = bind(this._parser.parseNoMarkup, this._parser);
  
  parseHtmlAst(/** @type {string}*/str){
    return NewParser.parseAstHtml(str);
  }
  parseHtml(/** @type {string}*/str){
    //@ts-ignore
    return this._parser._evalAst(this.parseHtmlAst(str));
  }
  parseElem(/** @type {HTMLElement}*/elem, /** @type {('clear'|'hide'|'remove')?}*/action){
    const html = elem.innerHTML;
    if(!action){} // Do nothing
    else if(action=='clear') elem.innerHTML = '';
    else if(action=='remove') elem.remove();
    else if (action=='hide') elem.classList.add('caph-hidden');
    return this.parseHtml(html);
  }

  plugin = bind(this._parser.plugin, this._parser);
  
  _scriptLoader = this._parser.scriptLoader;
  load = bind(this._scriptLoader.load, this._scriptLoader);
  loadFont = bind(this._scriptLoader.loadFont, this._scriptLoader);
  injectStyle = bind(this._scriptLoader.injectStyle, this._scriptLoader);

  _preactGlobals = preactGlobals;
  contexts = this._preactGlobals.contexts;
  menu = this._preactGlobals.menu;
  listenToEvent = bind(this._preactGlobals.listenToEvent, this._preactGlobals);
  listenToGlobal = bind(this._preactGlobals.listenToGlobal, this._preactGlobals);
  
  constructor() {}

  mathMacros = {};

  set mathParser(/** @type {'katex'|'mathjax'} */value) {
    this._parser.mathParser = value;
  }
  get mathParser(){ return this._parser.mathParser; }

  get currentSrc() {
    //@ts-ignore
    return /** @type {string}*/(document.currentScript.src);
  }
}

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
