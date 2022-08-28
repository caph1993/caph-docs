//@ts-check
/// <reference path="types.js" />
/// <reference path="utils.js" />

/** @typedef {({children, ...props})=>any} ComponentType*/
/** @typedef {Object} AttributesType*/
/** @typedef {string|ComponentType|null} TagType*/
/** @typedef {(type:any, props:any, ...children)=>any} CreateElementType*/
/** @typedef {(text:string) => AstNode} RuleParser*/
/** @typedef {{regStart:string, regEnd:string, parser:RuleParser}} CustomRule*/

/** @typedef {'pre'|'jsx'|'tex'|'tex-shallow'|'jsx-shallow'|'pre-shallow'} SpacingMode*/
/**
 * @typedef {string|
 * [string|ComponentType, AttributesType|null, AstNodeArray]|
 * [null, null, AstNodeArray]
 * } AstNode
*/
/** @typedef {AstNode[]} AstNodeArray*/

__caph_definitions__.ConsoleProxy = class{
  log(...args){ console.log(...args);}
  warn(...args){ this.warn(...args);}
  error(...args){ this.error(...args);}
}


//https://stackoverflow.com/a/70329711

__caph_definitions__.BaseParser = (class {

  ESC = '\ue000';
  SPEC = `https://html.spec.whatwg.org/multipage/syntax.html`;
  DEBUG = false;

  static parseAst(/** @type {TemplateStringsArray} */{raw:strings}, ...values){
    const cls = this;
    return new cls(strings, values).root
  }

  /**
   * @param {null|{createElement:CreateElementType, FragmentComponent:ComponentType}} post
  */
  static evalAstFactory(post=null){
    const {createElement, FragmentComponent} = post||{
      createElement: (type, props, ...children)=> (!type||is_string(type))?
        [type, props, children] : type({children, ...props}),
      FragmentComponent: ({children})=>[null, null, children],
    };

    const evalAst = (/** @type {AstNode}*/ root) => {
      if(is_string(root)) return root;
      // HOTFIX: when there is a children list inside the preact parser,
      // it will not be an AstNode!
      if (!Array.isArray(root)) return root;
      let [tag, props, children] = root;
      assert(Array.isArray(children), root.toString());
      children = children.map(child => evalAst(child));
      if(tag==null){
        assert(props==null);
        tag = FragmentComponent;
      }
      return createElement(tag, props, ...children);
    }
    return evalAst;
  }

   static parserFactory(evalAst){
    const cls = this;
    return (/** @type {TemplateStringsArray} */ strings, ...values)=>(
      evalAst(cls.parseAst(strings, ...values))
    );
  }

  /**
   * @param {null|{createElement:CreateElementType, FragmentComponent:ComponentType}} post
  */
  static debugParserFactory(post=null){
    const cls = this;
    const evalAst = cls.evalAstFactory(post);
    const parse = cls.parserFactory(evalAst);
    const parse1 = ({raw:strings}, ...values)=>evalAst(new cls(strings, values, 1).root);
    const parse2 = ({raw:strings}, ...values)=>evalAst(new cls(strings, values, 2).root);
    const parseAst1 = ({raw:strings}, ...values)=> new cls(strings, values, 1).root;
    const parseAst2 = ({raw:strings}, ...values)=> new cls(strings, values, 2).root;
    return {parse, parse1, parse2, parseAst1, parseAst2, evalAst};
  }

  /** @type {CustomRule[]} */
  static customRules = [];

  warn(...args){console.warn(...args)}; // Overriden during tests
  error(...args){console.error(...args)}; // Overriden during tests

  constructor(/** @type {readonly string[]}*/ strings, values, debug=0){
    let str = strings.join(this.ESC);
    let escaped = {};
    let regEscaped = new RegExp(`${this.ESC}|\\\\"|\\\\'|\\\\$\\\\$|\\\\$(?=[^\\\\$])`);
    str = str.replace(regEscaped, (match, index)=>{
      //console.log(`Escaping ${match} at ${index}`);
      escaped[index] = match;
      return this.ESC;
    });
    this.pos = 0;
    this.str = str;
    /** @type {SpacingMode}*/
    this.spacing = 'jsx';
    this.values = values;
    this.valueIndex = 0;
    this.escaped = escaped;
    this.errorStop = false;
    debug && console.log('PARSING', this.str);
    this.DEBUG = debug==2;

    /** @type {CustomRule[]} */ //@ts-ignore
    this.customRules = this.constructor.customRules;
    /** @type {(tag:TagType)=>(null|string[])} */ //@ts-ignore
    this.optionalClose = this.constructor.optionalClose.bind(this.constructor);

    this.REG_EXP_TEXT = new RegExp(`.*?(?=${[
      '$', '<', this.ESC,
      ...this.customRules.map(({regStart})=>regStart),
    ].join('|')})`, 'ys');

    const elems = this.parseSiblings(null, []);
    /** @type {AstNode} */
    const root = elems.length==1 ? elems[0] : [null, null, elems];
    if(this.pos!=this.str.length) this.warn(`Not all the string was consumed: ${this.pos}/${this.str.length}`);
    this.root = root;
  }

  childlessTags = {
    br:true, '!doctype': true, area: true, base: true, col: true, command: true, embed: true, hr: true,img: true, input: true,keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true
  };

  spacePreservingTags = {
    pre: true, span: true, code: true, p: true, b: true, i: true,
    a: true, li: true,
  };


  // https://html.spec.whatwg.org/multipage/syntax.html#optional-tags
  /** @type {{[key:string]:string[]}}*/
  static _optionalClose = {
    'li': ['li'],
    'dt': ['dt', 'dd'],
    'dd': ['dd', 'dt'],
    'p': ['p', 'address', 'article', 'aside', 'blockquote', 'details', 'div', 'dl', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'main', 'menu', 'nav', 'ol', 'pre', 'section', 'table'],
    'rt': ['rt', 'rp'],
    'rp': ['rp', 'rt'],
    'optgroup': ['optgroup'],
    'option': ['option', 'optgroup'],
    //'caption': [], // Disabled rule
    //'colgroup': [], // Disabled rule
    'thead': ['tbody','tfoot'],
    'tbody': ['tbody', 'tfoot'],
    'tfoot': [],
    'tr': ['tr'],
    'td': ['td', 'th'],
    'th': ['th', 'td'],
  };

  static optionalClose(/** @type {TagType}*/ tag){
    if(!tag || !is_string(tag)) return null;
    return this._optionalClose[/** @type {string} tag */(tag)];
  }

  run(/** @type {RegExp}*/regExp){
    // Execute the regular expression on str at pos, and move forward
    const {pos, str} = this;
    regExp.lastIndex = pos;
    const match = regExp.exec(str);
    if(!match) throw `No match for ${regExp} with string: ...${str.slice(pos)}`
    if(match.index<pos) throw `Regexp must use 'ys' flag. Match for at ${match.index} is before previous match at ${pos}`;
    const out = [...match];
    this.pos += out[0].length;
    return out;
  }

  tryRun(/** @type {RegExp}*/regExp){
    try{ return this.run(regExp); }
    catch(e){ return null; }
  }
  tryRunUndo(/** @type {RegExp}*/regExp){
    const pos = this.pos;
    try{ return this.run(regExp); }
    catch(e){ return null; }
    finally{ this.pos = pos; }
  }

  debugPosition(delta=0, length=50){ // Just for printing debug info
    const {pos, str} = this;
    const at = Math.max(0, pos+delta)
    const short = str.slice(at, at+length).replace('\n', '(\\n)');
    return `${at}...${short}...${at+length}`;
  }

  /**
   * @param {TagType} parentTag
   * @param {AstNode[]} siblings
   * @returns {AstNode[]}*/
  parseSiblings(parentTag, siblings){
    /*
      Parses the children of a parent tag or fragment.
      Called (i) from the root level,
      or (ii) after a parent "head" (`<div ...>`) has been consumed,
      or (iii) after a sibling has been consumed entirely.
     */
    this.DEBUG && console.log('parseSibling', parentTag, siblings, this.debugPosition());
    assert(parentTag!==undefined);
    // Parse text preceeding the first sibling
    let [text] = this.run(this.REG_EXP_TEXT);
    if(text.length) text = this.trimText(text);
    if(text.length) siblings.push(text);

    if(this.tryRun(new RegExp(`${this.ESC}`, 'ys'))){
      let value = this.values[this.valueIndex++];
      if (Array.isArray(value)) siblings.push(...value);
      else siblings.push(value);
      return this.parseSiblings(parentTag, siblings);
    }

    let endReached = this.pos==this.str.length;
    if(endReached){
      if(parentTag && !this.optionalClose(parentTag)){
        this.warn(`Expected closing tag </${parentTag}> or </> after ${text}. Ignoring what follows`);
        this.errorStop = true;
      }
      return siblings;
    }
    if(this.customRules.length){
      for(let {regStart, regEnd, parser} of this.customRules){
        let m = this.tryRun(new RegExp(`${regStart}(.*?)${regEnd}`, 'ys'));
        if(m){
          siblings.push(parser(this.replaceText(m[1], this.pos-regEnd.length-m[1].length)));
          return this.parseSiblings(parentTag, siblings);
        }
      }
    }
    // Comment, DOCTYPE, or CDATA
    if(this.str.startsWith('<!', this.pos)){
      const regComment = new RegExp(
        [`<!--.*?-->`, `<!\\[CDATA\\[.*?\\]\\]>`, `<!DOCTYPE\\s*.*?>`,].join('|'),
        'iys',
      );
      let result = this.tryRun(regComment);
      if(!result){
        this.error(`Unexpected <! around ${this.debugPosition(-5)}\nIgnoring what follows.`);
        this.errorStop = true;
        return siblings;
      }
      let [text] = result;
      if(text.endsWith('/>')) this.warn(`Non compliant tag found.\n${this.SPEC}`);
      this.replaceText(text, this.pos-text.length); // Consume the fields inside, if any
      return this.parseSiblings(parentTag, siblings);
    }
    // Parent close
    let /** @type {TagType} */ tag;
    if(this.tryRun(/<\/\s*>/ys)) return siblings;
    if(this.tryRun(/<\//ys)){
      let result = this.tryRun(new RegExp(`([^>\\s]+)\\s*>`, 'ys'));
      if(!result){
        this.error(`Expected close tag for parent ${parentTag||'fragment'} at ${this.debugPosition()}\nIgnoring what follows.`);
        this.errorStop = true;
        return siblings;
      }
      let _tag = result[1];
      if (_tag==this.ESC) tag = this.values[this.valueIndex++];
      else tag = _tag;
      if(tag!==parentTag){
        this.error(`Unmatched close tag ${tag}!=${parentTag} at ${this.debugPosition()}\nIgnoring what follows.`);
        this.errorStop = true;
      }
      return siblings;
    }
    const optionalClose = this.optionalClose(parentTag);
    if(optionalClose) for(let tag of optionalClose){
      if(this.tryRunUndo(new RegExp(`<${tag}(>|\\s)`, 'ys'),)){
        return siblings;
      }
    }
    // Parse the first sibling
    let reg = new RegExp(`<([^\\s>\\/\\.]*)`, 'ys');
    let _tag = this.run(reg)[1];
    if (_tag==this.ESC){
      tag = this.values[this.valueIndex++];
      if(is_string(tag)){
        this.error(`Tag must be a component, not a string. Error around ${this.debugPosition(-5)}\nIgnoring what follows.`);
        this.errorStop = true;
        return siblings;
      }
    }
    else if(!_tag.length) tag = null; //null means fragment
    else if(_tag.match(/[^a-z0-9._-]/i)){
      this.error(`Error with tag ${_tag} around ${this.debugPosition(-_tag.length-5)}\nIgnoring what follows.`);
      this.errorStop = true;
      return siblings;
    }
    else tag = _tag;
    if (tag === undefined) tag = null, this.error(`Undefined component around ${this.debugPosition(-5)}`);
    const newSibling = this.parseParent(tag, null, []);
    if(tag) siblings.push(newSibling);
    else siblings.push(... newSibling[2]); // shortcut fragment nieces as siblings
    if(this.errorStop) return siblings;
    return this.parseSiblings(parentTag, siblings);
  }

  /**
   * @param {TagType} tag
   * @param {Object|null} props
   * @param {AstNode[]} children
   * @returns {AstNode}*/
  parseParent(tag, props=null, children=[]){
    /*
      Parses after `<div ` has been consumed
      or after `<div attr1 attr2="value" ` has been consumed
      Thus, it just checks for more attributes or `>` or `/>`
    */
    this.DEBUG && console.log('parseParent ', tag, props, children, this.debugPosition());
    //assertDefined(tag);
    this.run(/\s*/ys); // Consume whitespace
    if(this.pos==this.str.length){
      this.warn(`Expected closing end ...> or .../> for tag ${tag}`);
      this.errorStop = true;
      return [tag, props, children];
    }
    let headClosed = !!this.tryRun(/>/ys);
    let fullyClosed = (headClosed && !!this.childlessTags[(''+tag)?.toLowerCase()]) ||
      !!this.tryRun(/\/>/ys);
    if(fullyClosed) return [tag, props, children];
    if(headClosed){
      if(tag=='script'){ // Script is closed differently
        let m = this.tryRun(/(.*?)<\/script\s*>/ys);
        if(!m){
          this.error(`Script tag not closed properly. Ignoring what follows.`);
          this.errorStop = true;
          return [tag, props, children];
        }
        let code = m[1];
        m = code.match(/^\s*\`(.*)\`\s*$/ys)
        if(m){
          code = m[1];
          return ['div', {'data-caph':'@code', ...props}, [code]]
        }
        return [tag, props, children];
      }
      children = this.parseSiblings(tag, children);
      return [tag, props, children];
    }
    if(!props) props = {};
    if(this.tryRun(new RegExp(`\\.\\.\\.${this.ESC}`, 'ys'))){
      props = {...props, ...this.values[this.valueIndex++]};
    }
    else{
      let [key] = this.run(/.*?(?=\s|>|=)/ys);
      let _value = this.tryRun(/=/ys) && this.run(new RegExp(`\\".*?\\"|\\'.*?\\'|${this.ESC}`, 'ys'))[0];
      let value;
      if(!_value) value = true;
      else if(_value==this.ESC) value=this.values[this.valueIndex++];
      else value = this.replaceText(_value.slice(1,-1), this.pos-_value.length+1); // slice for quotes
      props[key] = value;
    }
    return this.parseParent(tag, props, children);
  }

  /**
   * @param {string} text
   * @returns {string}*/
  trimText(text){
    // End spaces are preserved only if they are inline
    // https://reactjs.org/blog/2014/02/20/react-v0.9.html#jsx-whitespace
    // https://www.w3.org/TR/REC-html40/struct/text.html#h-9.1
    // https://stackoverflow.com/q/433493
    return text.replace(/^(\s*)(.*?)(\s*)$/s, (_, l, middle, r)=>{
      if(l.includes('\n')) l='';
      if(r.includes('\n')) r='';
      return `${l}${middle}${r}`
    });
  }

  /**
   * @param {string} text
   * @param {number} posOfText
   * @returns {string}*/
  replaceText(text, posOfText){
    return text.replace(new RegExp(this.ESC, 'g'), (_, index)=>{
      const original = this.escaped[posOfText+index];
      if (original != this.ESC) return original;
      return this.values[this.valueIndex++];
    });
  }

  asString(obj) {
    let out = `${obj}`;
    if (out == "[object Object]") {
      // let seen = [];
      // out = JSON.stringify(obj, function (key, val) {
      //   if (val != null && typeof val == "object") {
      //     if (seen.indexOf(val) >= 0) return;
      //     seen.push(val);
      //   }
      //   return val; // https://stackoverflow.com/q/9382167
      // });
      out = obj; //PROBLEM
    }
    return out;
  }

});

/**
 * TO DO:
 * 1. Implement "close with sibling"
 * 2. Make a new class that inherits from this one and adds math support. It must be extensible.
 * 3. Make a new class that inherits from math and adds code support. It must be extensible.
 * 4. Make a new class that inherits from math and adds paragraphs support. It must be extensible.
*/

__caph_definitions__.NewParser = class extends __caph_definitions__.BaseParser {

  static customRules = [
    ...super.customRules,
    {
      regStart: `(?<!\\\\)\\$\\$`,
      regEnd: `(?<!\\\\)\\$\\$`,
      parser: /**@type {RuleParser}*/ ((text)=>['div', {'data-caph': '@math', displayMode:true}, [text]]),
    },
    {
      regStart: `(?<!\\\\)\\$`,
      regEnd: `(?<!\\\\)\\$`,
      parser: /**@type {RuleParser}*/ ((text)=>['div', {'data-caph': '@math', displayMode:false}, [text]]),
      inline: true,
    },
    {
      regStart: `(?<!\\\\)\`\`\``,
      regEnd: `(?<!\\\\)\`\`\``,
      parser: /**@type {RuleParser}*/ ((text)=>['div', {'data-caph': '@code'}, [text]]),
    },
    {
      regStart: `(?<!\\\\)\``,
      regEnd: `(?<!\\\\)\``,
      parser: /**@type {RuleParser}*/ ((text)=>{
        return ['div', {'data-caph': '@code'}, [text.replace(/\\\`/g, '`')]]
      }),
      inline: true,
    },
  ];

}
