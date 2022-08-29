//@ts-check
/// <reference path="types.js" />
/// <reference path="utils.js" />

/** @typedef {({children, ...props})=>any} ComponentType*/
/** @typedef {Object} AttributesType*/
/** @typedef {string|ComponentType|null} TagType*/
/**
 * @typedef {(type:any, props:any, ...children)=>(any extends Array? never: any)} CreateElementType
*/
/** @typedef {(text:string) => AstNode} RuleParser*/
/** @typedef {{regStart:string, regEnd:string, parser:RuleParser}} CustomRule*/

/**
 * @typedef {[null, null, AstNodeArray]|[string|ComponentType, AttributesType|null, AstNodeArray]} AstParent
 */
/**
 * @typedef {string|AstParent} AstNode
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
  /** @type {CustomRule[]} */
  static customRules = [];

  warn(...args){console.warn(...args)}; // Overriden during tests
  error(...args){console.error(...args)}; // Overriden during tests


  /**
   * @param {readonly string[]} strings
   * @param {0|1|2} debug
  */
  constructor(strings, values, debug=0){
    /** @type {typeof __caph_definitions__.BaseParser} */ //@ts-ignore
    this.cls = this.constructor;
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
    // /** @type {SpacingMode}*/
    // this.spacing = 'jsx';
    this.values = values;
    this.valueIndex = 0;
    this.escaped = escaped;
    this.errorStop = false;
    debug && console.log('PARSING', this.str);
    this.DEBUG = debug==2;

    /** @type {CustomRule[]} */
    this.customRules = this.cls.customRules;
    /** @type {(tag:TagType)=>(null|string[])} */
    this.optionalClose = this.cls.optionalClose.bind(this.cls);

    this.REG_EXP_TEXT = new RegExp(`.*?(?=${[
      '$', '<', this.ESC,
      ...this.customRules.map(({regStart})=>regStart),
    ].join('|')})`, 'ys');

    /**@type {AstParent} */
    this.parent = [null, null, []];
    /**@type {AstNode} */
    this.root = this.parent;
    this.parseRoot();
  }
  
  parseRoot(){
    try{
      this.parseChildrenAndParentClose();
      assert(this.parent===this.root);
    } catch (error){
      console.log(error);
      if(error.name !== 'caph-parser-error') throw error;
      if(this.pos==this.str.length && this.parent===this.root){
        // Pass. Safe error: expected </> at end because we simulate a fragment root
      } else{ this.error(error)}
    }
    if(this.parent===this.root && this.root[2].length == 1) this.root = this.root[2][0];
  }

  get parentTag(){ return this.parent[0]; }
  get parentProps(){ return this.parent[1]; }
  get children(){ return this.parent[2]; }


  childlessTags = {
    br:true, '!doctype': true, area: true, base: true, col: true, command: true, embed: true, hr: true,img: true, input: true,keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true
  };

  // spacePreservingTags = {
  //   pre: true, span: true, code: true, p: true, b: true, i: true,
  //   a: true, li: true,
  // };


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
    if(!match) this.throw(`No match for ${regExp}`);
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

  parseChildrenAndParentClose(){
    /*
      Parses the children of a parent tag or fragment.
      Called (i) from the root level,
      or (ii) after a parent "head" (`<div ...>`) has been consumed,
      or (iii) after a sibling has been consumed entirely.
     */
    while(true){ // capture children until parent close tag is found or end is reached
      this.DEBUG && console.log('parseSibling', this.parent, this.debugPosition());
      // Parse text preceeding the first sibling
      let [text] = this.run(this.REG_EXP_TEXT);
      if(text.length) this.children.push(text);
  
      if(this.tryRun(new RegExp(`${this.ESC}`, 'ys'))){
        let value = this.values[this.valueIndex++];
        for(value of Array.isArray(value)?value:[value]){
          if(value) this.children.push(['@injected', null, [value]]);
        }
        continue;
      }

      // Comment, DOCTYPE, or CDATA
      if(this.str.startsWith('<!', this.pos)){
        this.consumeComment();
        continue;
      }

      let endReached = this.pos==this.str.length;
      if(endReached && this.parentTag && !this.optionalClose(this.parentTag))
          this.throw(`Expected closing tag </${this.parentTag}> or </>`);
      if(endReached) break;
      
      if(this.customRules.length){
        const parsedRule = (()=>{
          for(let {regStart, regEnd, parser} of this.customRules){
            let m = this.tryRun(new RegExp(`${regStart}(.*?)${regEnd}`, 'ys'));
            if(m) return parser(this.replaceText(m[1], this.pos-regEnd.length-m[1].length));
          }
          return null;
        })();
        if(parsedRule){
          this.children.push(parsedRule);
          continue;
        }
      }

      // Parent close
      let /** @type {TagType} */ tag;
      if(this.tryRun(/<\/\s*>/ys)) break;
      if(this.tryRun(/<\//ys)){
        let result = this.tryRun(new RegExp(`([^>\\s]+)\\s*>`, 'ys'));
        if(!result) this.throw(`Expected close tag for parent ${this.parentTag||'fragment'}`);
        let _tag = result[1];
        if (_tag==this.ESC) tag = this.values[this.valueIndex++];
        else tag = _tag;
        if(tag!==this.parentTag) this.throw(`Unmatched close tag ${tag}!=${this.parentTag}`);
        break;
      }

      const optionalClose = this.optionalClose(this.parentTag);
      if(optionalClose){
        if((()=>{
          for(let tag of optionalClose){
            if(this.tryRunUndo(new RegExp(`<${tag}(>|\\s)`, 'ys'),)){
              return true;
            }
          }
        })()) break;
      }

      const /** @type {AstParent} */ newParent = [null, null, []];
      this.children.push(newParent);

      const grandParent = this.parent;
      this.parent = newParent; // change parent temporarily
      this.parseParent2(grandParent); // this restores parent
      
      if(newParent[0] == null){ // shortcut fragment nieces as siblings
        assert(this.children.pop() === newParent);
        console.log('SHORTCUT')
        this.children.push(...newParent[2]);
      }
    }
  }

  parseParent2(grandParent){
    /*

    */
    this.DEBUG && console.log('parseParent ', this.parent, this.debugPosition());

    // Parse the first sibling
    let reg = new RegExp(`<([^\\s>\\/\\.]*)`, 'ys');
    let _tag = this.run(reg)[1];
    let /** @type {TagType} */ tag;
    if (_tag==this.ESC){
      tag = this.values[this.valueIndex++];
      if(is_string(tag)) this.throw(`Tag must be a component, not a string.`);
    }
    else if(!_tag.length) tag = null; //null means fragment
    else if(_tag.match(/[^a-z0-9._-]/i)) this.throw(`Error with tag ${_tag}`);
    else tag = _tag;
    if (tag === undefined) this.throw(`Undefined component`);
    
    this.parent[0] = tag;
    let admitsChildren = !this.childlessTags[(''+tag)?.toLowerCase()];

    while(true){ // While attributes

      this.run(/\s*/ys); // Consume whitespace after `<div` or after attribute value
      const endReached = this.pos==this.str.length;
      if(endReached) this.throw(`Expected closing end ...> or .../> for tag ${tag}`);
      
      // Handle head close
      if(this.tryRun(/\/>/ys)){ admitsChildren = false; break; }
      else if(this.tryRun(/>/ys)) break;

      // Read next attribute
      if(!this.parentProps) this.parent[1] = {};
      if(this.tryRun(new RegExp(`\\.\\.\\.${this.ESC}`, 'ys'))){
        this.parent[1] = {...this.parentProps, ...this.values[this.valueIndex++]};
      }
      else{
        let [key] = this.run(/.*?(?=\s|>|=)/ys);
        let _value = this.tryRun(/=/ys) && this.run(new RegExp(`\\".*?\\"|\\'.*?\\'|${this.ESC}`, 'ys'))[0];
        let value;
        // .innerHTML may transform `<div attr >` into `< attr="" >`
        if(!_value || _value=="''"||_value=='""') value = true; 
        else if(_value==this.ESC) value = this.values[this.valueIndex++];
        else value = this.replaceText(_value.slice(1,-1), this.pos-_value.length+1); // slice for quotes
        this.parentProps[key] = value;
      }
    }

    if(admitsChildren && tag=='script'){ // Script is closed differently
      let m = this.tryRun(/(.*?)<\/script\s*>/ys);
      if(!m)this.throw(`Script tag not closed properly. Ignoring what follows.`);
      let code = m[1];
      if(code.match(/^\s*\`(String\.raw)?(.*)\`\s*$/ys)){
        code = eval(code);
        code = this.cls.htmlSafe(code);
        this.parent[0] = 'div';
        this.parent[1] = {'data-caph':'@code', ...this.parentProps};
        this.parent[2] = [code];
      }
    }
    else if(admitsChildren){
      this.parseChildrenAndParentClose();
      this.parent[2] = this.cls.spacingRulesJsx(this.children, this.parentTag);
    }
    this.parent = grandParent;
  }

  static spacingRulesJsx(children, tag){ // JSX spacing
    // https://reactjs.org/blog/2014/02/20/react-v0.9.html#jsx-whitespace
    // https://www.w3.org/TR/REC-html40/struct/text.html#h-9.1
    // https://stackoverflow.com/q/433493
    
    // Unique rule that differs with JSX. Leave untouched!
    // It's the only way to disable trimming from HTML, e.g. `<pre data-caph="@paragraphs">`
    if(tag&&is_string(tag)&&(tag==='pre'||tag=='code')) return children;
    
    function trimText(text){
      // End spaces are preserved only if they are inline
      return text.replace(/^(\s*)(.*?)(\s*)$/s, (_, l, middle, r)=>{
        if(l.includes('\n')) l='';
        if(r.includes('\n')) r='';
        return `${l}${middle}${r}`
      });
    }
    const ESC = '\ue000';
    const stack = children.filter(x=>!is_string(x)).reverse();
    const text = children.map(x=>is_string(x)?x:ESC).join('');
    const newChildren = [];
    text.split(ESC).forEach((str, i)=>{
      if(i) newChildren.push(stack.pop());
      if(str.length) str = trimText(str);
      if(str.length) newChildren.push(str);
    })
    assert(stack.length==0);
    return newChildren;
  }

  static spacingRulesParagraphs(children){ // Paragraph spacing. Exported. 
    const ESC = '\ue000';
    const stack = children.filter(x=>!is_string(x)).reverse();
    const text = children.map(x=>is_string(x)?x:ESC).join('');
    /** @type {AstNode[]}*/
    const newChildren = text.split(/\s*?\n\s*?\n\s*/s).map(text=>{
      const elems = [];
      text.split(ESC).forEach((str, i)=>{
        if(i) elems.push(stack.pop());
        if(str.length) elems.push(str);
      })
      return ['div', {'class':"caph-paragraph"}, elems];
    });
    assert(stack.length==0);
    return newChildren;
  }

  /** @type {(reason:string)=>never}*/
  throw(reason){
    const error = new Error(`${reason}
      Ignoring what follows.
      Error occurred here:
      ${this.debugPosition(-5)}
    `);
    error.name = 'caph-parser-error';
    throw error;
  }

  consumeComment(){
    const regComment = new RegExp(
      [`<!--.*?-->`, `<!\\[CDATA\\[.*?\\]\\]>`, `<!DOCTYPE\\s*.*?>`,].join('|'),
      'iys',
    );
    let result = this.tryRun(regComment);
    if(!result) this.throw(`Unexpected <!`);
    let [text] = result;
    if(text.endsWith('/>')) this.warn(`Non compliant tag found.\n${this.SPEC}`);
    this.replaceText(text, this.pos-text.length); // Consume the fields inside, if any
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


  static htmlSafe(str) {
    // e.g. converts < into &lt;
    return new Option(str).innerHTML;
  }

  static htmlSafeUndo = (str)=>{
    // e.g. converts &lt; into <, etc. Prevents left trim caused by DOMParser
    const [, l, content] = assertNonNull(str.match(/^(\s*)(.*)$/s));
    const doc = new DOMParser().parseFromString(content, "text/html");
    const text = l+(doc.documentElement.textContent || '');
    //if(str!=text) console.log(`Converted ${str} into ${text}`)
    return text;
  }
  static parseAstHtml(/** @type {string}*/str){
    const astUndoHtml = (/** @type {AstNode}*/ root) => {
      if (is_string(root)) return this.htmlSafeUndo(root);
      if (!Array.isArray(root)) return root;
      //@ts-ignore
      root[2] = root[2].map(child => astUndoHtml(child));
      return root;
    }
    // Parse html, undoing html safe conversions, and then create element
    /** @type {TemplateStringsArray}*/ //@ts-ignore
    let tmp = {raw:[str]};
    let root = this.parseAst(tmp);
    return astUndoHtml(root);
  }

  /**
   * @param {null|{createElement:CreateElementType, FragmentComponent:ComponentType}} post
  */
  static evalAstFactory(post=null){
    const {createElement, FragmentComponent} = post||{
      createElement: (type, props, ...children)=> (!type||is_string(type))?
        {tag:type, props, children} : type({children, ...props}),
      FragmentComponent: ({children})=>({tag:null, props:null, children}),
    };

    const createTree = (/** @type {AstNode}*/ root) => {
      if (!Array.isArray(root)) return root;
      let [tag, props, children] = root;
      if(tag=='@injected') return root[2][0];
      assert(Array.isArray(children));
      children = children.map(child =>createTree(child));
      if(tag==null){
        assert(props==null);
        tag = FragmentComponent;
      }
      return createElement(tag, props, ...children);
    }
    return createTree;
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


  // asString(obj) {
  //   let out = `${obj}`;
  //   if (out == "[object Object]") {
  //     // let seen = [];
  //     // out = JSON.stringify(obj, function (key, val) {
  //     //   if (val != null && typeof val == "object") {
  //     //     if (seen.indexOf(val) >= 0) return;
  //     //     seen.push(val);
  //     //   }
  //     //   return val; // https://stackoverflow.com/q/9382167
  //     // });
  //     out = obj; //PROBLEM
  //   }
  //   return out;
  // }

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
      parser: /**@type {RuleParser}*/ ((text)=>{
        text = text.replace(/\\\`\`\`/g, '```');
        let progLang = assertNonNull(text.match(/^[^\n]*/));
        return ['div', {'data-caph': '@code', ...(!progLang.length?{}:{progLang})}, [text]];
      }),
    },
    {
      regStart: `(?<!\\\\)\``,
      regEnd: `(?<!\\\\)\``,
      parser: /**@type {RuleParser}*/ ((text)=>{
        text = text.replace(/\\\`/g, '`');
        return ['div', {'data-caph': '@code'}, [text]]
      }),
      inline: true,
    },
  ];

}
