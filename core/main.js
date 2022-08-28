//@ts-check
/// <reference path="types.js" />
/// <reference path="utils.js" />
/// <reference path="preact-globals.js" />

/* lzutf8, utils, preact, preact hook are injected above this comment*/

const caph = new class {

  parseAst = __caph_definitions__.NewParser.parseAst.bind(__caph_definitions__.NewParser);
  _parser = __caph_definitions__.preactParser;
  pluginDefs = this._parser.pluginDefs;
  parse = this._parser.parse.bind(this._parser);
  parseNoMarkup = this._parser.parseNoMarkup.bind(this._parser);
  
  parseHtmlAst(/** @type {string}*/str){
    const undoHtml = (str)=>{
      // e.g. converts &lt; into <
      const doc = new DOMParser().parseFromString(str, "text/html");
      const text = doc.documentElement.textContent;
      //if(str!=text) console.log(`Converted ${str} into ${text}`)
      return text;
    }
    const astUndoHtml = (/** @type {AstNode}*/ root) => {
      if (is_string(root)) return undoHtml(root);
      if (!Array.isArray(root)) return root;
      //@ts-ignore
      root[2] = root[2].map(child => astUndoHtml(child));
      return root;
    }
    // Parse html, undoing html safe conversions, and then create element
    let root = caph.parseAst({raw:[str]});
    return astUndoHtml(root);
  }
  parseHtml(/** @type {string}*/str){
    //@ts-ignore
    return this._parser._evalAst(this.parseHtmlAst(str));
  }

  plugin = this._parser.plugin.bind(this._parser);
  
  _scriptLoader = this._parser.scriptLoader;
  load = this._scriptLoader.load.bind(this._scriptLoader);
  loadFont = this._scriptLoader.loadFont.bind(this._scriptLoader);
  injectStyle = this._scriptLoader.injectStyle.bind(this._scriptLoader);

  _preactGlobals = __caph_definitions__.preactGlobals;
  contexts = this._preactGlobals.contexts;
  menu = this._preactGlobals.menu;
  listenToEvent = this._preactGlobals.listenToEvent.bind(this._preactGlobals);
  listenToGlobal = this._preactGlobals.listenToGlobal.bind(this._preactGlobals);

  
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
