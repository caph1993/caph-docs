//@ts-check
import { MyPromise, sleep, assert, assertNonNull } from "./utils.js";
import * as collections from "./collections.js";
import { createParser as createAstParser } from "./parser.js";
import { parser, pluginDefs, plugin, createPreactParser } from "./preact-parser.js";
import { contexts, menu, listenToEvent, listenToGlobal } from "./preact-globals.js";
import { toChildArray } from "preact";
import { useMemo, useState } from "preact/hooks";
import { load, injectStyle } from "./script-loader.js";
import * as scriptLoader from "./script-loader.js";
import * as preactBase from "preact";
import * as preactHooks from "preact/hooks";
import { compressor, decompress } from "./build-constants.js";
/** @typedef {import("./preact-parser").Component} Component */ 


export const preact = {...preactBase, ...preactHooks};
window["preact"] = preact;

export const libraries = {};
libraries.preact = preact;
(async()=>{ libraries.lzutf8=await MyPromise.until(()=>window['LZUTF8']); })();

export { scriptLoader, load, injectStyle, createAstParser };
export {parser, pluginDefs, plugin, createPreactParser};
export const {parse, parseAst, parseAstHtml, parseHtml} = parser;

const noRulesParser = createPreactParser();
noRulesParser.settings.customRules = [];
export const {parse: parseNoMarkup} = noRulesParser;


export const parseElem = (/** @type {HTMLElement}*/elem, /** @type {('clear'|'hide'|'remove')?}*/action) => {
  const html = elem.innerHTML;
  if(!action){} // Do nothing
  else if(action=='clear') elem.innerHTML = '';
  else if(action=='remove') elem.remove();
  else if (action=='hide') elem.classList.add('caph-hidden');
  return parseHtml(html);
}

export const until = MyPromise.until;
export {assert, sleep};
export { collections };
export {contexts, menu, listenToEvent, listenToGlobal};


/** @param {Component | Promise<Component>} definition */ 
export const defineFileComponent = (definition)=>{
  const elem = assertNonNull(document?.currentScript);
  /** @type {string}*/
  const src = elem.getAttribute('data-original-src')||elem['src'];
  pluginDefs[src] = definition;
}

/** @param {string} dist @param {string} compressedSequence */ 
export const injectCompressedScript = async (dist, compressedSequence)=>{
  /* Used in all compressed plugins. See build-plugins.js */  
  await load(compressor.dist);
  await until(()=>window['LZUTF8']);
  const jsCode = decompress(window["LZUTF8"], compressedSequence);
  const e = document.createElement('script');
  const {url} = scriptLoader.parseKey(dist);
  e.setAttribute('data-original-src', url);
  e.innerHTML = jsCode;
  document.getElementById('core-sources')?.insertAdjacentElement('beforeend', e);
}



export const settings = {
  get mathParser(){ return parser.mathParser; },
  mathMacros: {},
  set mathParser(/** @type {'@katex'|'@mathjax'} */value) {
    parser.mathParser = value;
  }
};

injectStyle(`
div.caph-paragraph + div.caph-paragraph { margin-top: 1em; }
.caph-paragraph h1,h2,h3,h4,h5,h6,ul,ol{ margin:0; }
code {
  padding: 0em 0.2em;
  background-color: #f8f9fa;
  color: #000;
  border: 1px solid #eaecf0;
  border-radius: 2px;
}
`);

// tab effects: https://alvarotrigo.com/blog/html-css-tabs/
injectStyle(`
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
pluginDefs['@tabs'] = ({/** @type {string[]} */ labels, defaultLabel, children})=>{
  const zipped = useMemo(()=>toChildArray(children).map(
    (child,i) => ({label:labels[i]||`Tab ${i+1}`, child})
  ), [labels, children]);
  const [option, setOption] = useState(defaultLabel || zipped[0]?.label);
  return parse`
  <div class="tabs-parent">
    <div class="tabs-header">
      ${labels.map((label)=>parse`
        <label class="tab-label" class=${'tab-label-'+(option==label)}>
          <input type="radio" checked=${option==label} onClick=${()=>setOption(label)}/>
          <span>${label}</>
        </label>`
      )}
    </div>
    <div class="tabs">
      ${zipped.map(({label, child})=>parse`
        <div class=${'tab-content-'+(option==label)}>${child}</>`
      )}
    </div>
  </>`;
}
