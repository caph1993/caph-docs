//@ts-check
/// <reference path="types.js" />
/// <reference path="utils.js" />
/// <reference path="preact-globals.js" />

/* lzutf8, utils, preact, preact hook are injected above this comment*/

const caph = new class {

  _parser = __caph_definitions__.preactParser;
  pluginDefs = this._parser.pluginDefs;
  parse = this._parser.parse.bind(this._parser);
  parseAst = this._parser.parseAst.bind(this._parser);
  parseNoMarkup = this._parser.parseNoMarkup.bind(this._parser);
  plugin = this._parser.plugin.bind(this._parser);
  
  _scriptLoader = this._parser.scriptLoader;
  load = this._scriptLoader.load.bind(this._scriptLoader);
  loadFont = this._scriptLoader.loadFont.bind(this._scriptLoader);
  injectStyle = this._scriptLoader.injectStyle.bind(this._scriptLoader);

  _preactGlobals = __caph_definitions__.preactGlobals;
  contexts = this._preactGlobals.contexts;
  menu = this._preactGlobals.menu;
  listenToEvent = this._preactGlobals.listenToEvent.bind(this._preactGlobals);

  
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
