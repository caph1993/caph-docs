//@ts-check
/// <reference path="types.js" />
import { isString, assert, assertNonNull } from "./utils.js";

/** @typedef {({children, ...props})=>any} ComponentType*/
/** @typedef {Object} AttributesType*/
/** @typedef {string|ComponentType|null} TagType*/
/**
 * @typedef {(type:any, props:any, ...children)=>(any extends Array? never: any)} CreateElementType
*/
// /** @typedef {(text:string) => AstNode} RuleParser*/
// /** @typedef {{regStart:string, regEnd:string, parser:RuleParser}} CustomRule*/

/** @typedef {{start:RegExp, capture:RegExp, component:string}} ParsingRule*/

/**
 * @typedef {[null, null, AstNodeArray]|[string|ComponentType, AttributesType|null, AstNodeArray]} AstParent
 */
/**
 * @typedef {string|AstParent} AstNode
*/
/** @typedef {AstNode[]} AstNodeArray*/

/** @typedef {'jsx'|'tex'|'raw'|'pre'} SpacingType*/


/**@param {string} str*/
function htmlSafe(str) {
  // e.g. converts < into &lt;
  return new Option(str).innerHTML;
}

const htmlSafeUndo = (/** @type {string} */ str)=>{
  // e.g. converts &lt; into <, etc. Prevents left trim caused by DOMParser
  const [, l, content] = assertNonNull(str.match(/^(\s*)(.*)$/s));
  const doc = new DOMParser().parseFromString(content, "text/html");
  const text = l+(doc.documentElement.textContent || '');
  // if(str!=text) console.log(`Converted ${str} into ${text}`)
  return text;
}


//https://stackoverflow.com/a/70329711

export const AstParser = (class {

  ESC = '\ue000';
  regESC = new RegExp('\ue000', 'ys')
  SPEC = `https://html.spec.whatwg.org/multipage/syntax.html`;
  DEBUG = false;

  str;
  values;
  pos;
  parsingRules;


  static parseAst(/** @type {TemplateStringsArray} */{raw:strings}, ...values){
    const cls = this;
    return new cls(strings, values).root
  }

  warn(...args){console.warn(...args)}; // Overriden during tests
  error(...args){console.error(...args)}; // Overriden during tests

  /**
   * @param {readonly string[]} strings
   * @param {readonly any[]} values
   * @param {readonly ParsingRule[]} parsingRules
   * @param {0|1|2} debug
  */
  constructor(strings, values, parsingRules=[], debug=0){
    /** @type {typeof AstParser} */ //@ts-ignore
    this.cls = this.constructor;
    let str = strings.join(this.ESC);
    let escaped = {};
    let regEscaped = new RegExp(`${this.ESC}|\\\\"|\\\\'`, 'g');
    str = str.replace(regEscaped, (match, index)=>{
      //console.log(`Escaping ${match} at ${index}`);
      escaped[index] = match;
      return this.ESC;
    });
    this.pos = 0;
    this.str = str;
    this.values = values;
    this.valueIndex = 0;
    this.escaped = escaped;
    this.errorStop = false;
    debug && console.log('PARSING', this.str);
    this.DEBUG = debug==2;

    //console.log(this.cls);
    this.parsingRules = parsingRules;
    /** @type {(tag:TagType)=>(null|string[])} */
    this.optionalClose = this.cls.optionalClose.bind(this.cls);

    this.REG_EXP_TEXT = new RegExp(`.*?(?=${[
      '$', '<', this.ESC,
      ...this.parsingRules.map(({start})=>start.source),
    ].join('|')})`, 'ys');

    /**@type {AstParent} */
    this.parent = [null, null, []];
    /**@type {AstNode} */
    this.root = this.parent;
    this.parseRoot();

    /**@param {CreateElementType} createElement @param {ComponentType} FragmentComponent*/
    this.evalTree = (createElement, FragmentComponent)=>{
      const evalTree = (/** @type {AstNode}*/ root) => {
        if (!Array.isArray(root)) return root;
        let [tag, props, children] = root;
        if(tag=='@injected') return root[2][0];
        assert(Array.isArray(children));
        children = children.map(child =>evalTree(child));
        if(tag==null){
          assert(props==null);
          tag = FragmentComponent;
        }
        return createElement(tag, props, ...children);
      }
      return evalTree(this.root);
    }
    
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
    br: true, '!doctype': true, area: true, base: true, col: true, command: true, embed: true, hr: true,img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true
  };

  // spacePreservingTags = {pre: true, span: true, code: true, p: true, b: true, i: true, a: true, li: true, };

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
    if(!tag || !isString(tag)) return null;
    return this._optionalClose[tag];
  }

  run(/** @type {RegExp}*/regExp){
    // Execute the regular expression on str at pos, and move forward
    const {pos, str} = this;
    regExp.lastIndex = pos;
    const match = regExp.exec(str);
    if(!match) this.throw(`No match for ${regExp}`);
    if(match.index<pos) throw `Regexp must use 'ys' flag. Match for at ${match.index} is before previous match at ${pos}`;
    this.pos += match[0].length;
    return match;
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
    const at = Math.max(0, pos+delta);
    const short = str.slice(at, at+length).replace('\n', '(\\n)');
    return `${at}...${short}...${at+length}`;
  }

  /** @param {SpacingType|null} spacing*/
  parseChildrenAndParentClose(spacing=null){
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
  
      if(this.tryRun(this.regESC)){
        let value = this.values[this.valueIndex++];
        for(value of Array.isArray(value)?value:[value]){
          if(value||value===0) this.children.push(['@injected', null, [value]]);
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
      
      if(this.parsingRules.length){
        const parsedRule = (/**@returns {AstNode?} */()=>{
          for(let {start, capture, component} of this.parsingRules){
            if(!this.tryRun(start)) continue;
            const textStart = this.pos;
            let [_, text] = this.run(capture);
            text = this.replaceText(text, textStart);
            return ['div', {'(component)': component}, [text]];
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
      this.parseParent(grandParent); // this restores parent
      
      if(newParent[0] == null){ // shortcut fragment nieces as siblings
        assert(this.children.pop() === newParent);
        this.children.push(...newParent[2]);
      }
    }

    if(!spacing||spacing=='jsx') this.parent[2] = this.cls.spacingRulesJsx(this.children);
    else if(spacing=='tex') this.parent[2] = this.cls.spacingRulesParagraphs(this.children);
  }

  parseParent(grandParent){
    /*
      Parses an element from the "head" opening (`<div ...>`)
      until the "tail" close  (`</div>` or `</>`). 
      Called just at the beginning of the head opening.
    */
    this.DEBUG && console.log('parseParent ', this.parent, this.debugPosition());

    let reg = new RegExp(`<([^\\s>\\/\\.]*)`, 'ys');
    let _tag = this.run(reg)[1];
    let /** @type {TagType} */ tag;
    if (_tag==this.ESC){
      tag = this.values[this.valueIndex++];
      if(isString(tag)) this.throw(`Tag must be a component, not a string.`);
    }
    else if(!_tag.length) tag = null; //null means fragment
    else if(_tag.match(/[^a-z0-9._-]/i)) this.throw(`Error with tag ${_tag}`);
    else tag = _tag;
    if (tag === undefined) this.throw(`Undefined component`);
    
    this.parent[0] = tag;
    let admitsChildren = !this.childlessTags[(''+tag)?.toLowerCase()];
    let /** @type {SpacingType|null}*/ spacing=null;
    
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
        if(key.endsWith('-eval')){
          key = key.slice(0,-5);
          value = eval(value);
        }
        const prevValue = this.parentProps[key];
        if(key=='class') value = !prevValue?value:prevValue+' '+value;
        else if(key=='style') value = !prevValue?value:prevValue+' '+value;
        else if(prevValue!==undefined) this.warn(`Replacing attribute ${key}.\nPrevious and new values:`, prevValue, value);
        
        if(key.startsWith('(')){
          if(key=='(component)') {} // ?? temporary code
          else if(key=='(spacing)'){
            if(!['jsx', 'pre', 'tex', 'raw'].includes(value)) this.throw(`Invalid spacing mode: ${value}`);
            spacing = value;
            continue;
          } else this.throw(`Invalid attribute: ${key}`);
        }
        this.parentProps[key] = value;
      }
    }

    if(admitsChildren){
      if(tag=='style'){ // Style is closed differently
        let m = this.tryRun(/(.*?)<\/style\s*>/ys);
        if(!m) this.throw(`Style tag not closed properly.`);
        this.parent[2] = [m[1]];
      }
      else if(tag=='script'){ // Script is closed differently
        let m = this.tryRun(/(.*?)<\/script\s*>/ys);
        if(!m) this.throw(`Script tag not closed properly.`);
        let code = m[1];
        if(code.match(/^\s*(String\.raw)?\`(.*)\`\s*$/ys)){
          code = eval(code);
          code = htmlSafe(code);
          this.parent[0] = 'div';
          this.parent[1] = {'(component)':'code', ...this.parentProps};
          this.parent[2] = [code];
        } else{
          this.parent[2] = [code];
        }
      }
      else{
        if(!spacing){
          if(!isString(tag)) spacing = 'jsx';
          else if(tag=='pre' || tag=='textarea') spacing = 'pre';
          else spacing = 'jsx';
        }
        this.parseChildrenAndParentClose(spacing); // (Huge step)
        
      }
    }
    this.parent = grandParent;
  }

  static spacingRulesJsx(children){ // JSX spacing
    // https://reactjs.org/blog/2014/02/20/react-v0.9.html#jsx-whitespace
    // https://www.w3.org/TR/REC-html40/struct/text.html#h-9.1
    // https://stackoverflow.com/q/433493
    /** @param {string} text*/
    function trimText(text){
      // End spaces are preserved only if they are inline
      return text.replace(/^(\s*)(.*?)(\s*)$/s, (_, l, middle, r)=>{
        if(l.includes('\n')) l = '';
        if(r.includes('\n')) r = '';
        return `${l}${middle}${r}`
      });
    }
    const ESC = '\ue000';
    const stack = children.filter(x=>!isString(x)).reverse();
    const text = children.map(x=>isString(x)?x:ESC).join('');
    const newChildren = [];
    text.split(ESC).forEach((str, i)=>{
      if(i) newChildren.push(stack.pop());
      if(str.length) str = trimText(str);
      if(str.length) newChildren.push(str);
    })
    assert(stack.length==0);
    return newChildren;
  }

  // https://html.spec.whatwg.org/multipage/syntax.html#element-restrictions
  static spacingRulesPre(children){
    const first = children[0];
    if(isString(first) && first.startsWith('\n'))
      children[0] = children[0].slice(1);
    return children;
  }

  static spacingRulesParagraphs(children){
    const ESC = '\ue000';
    const stack = children.filter(x=>!isString(x)).reverse();
    const text = children.map(x=>isString(x)?x:ESC).join('');
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
      assert(this.str[posOfText+index] === this.ESC);
      const original = this.escaped[posOfText+index];
      if (original != this.ESC) return original;
      return this.values[this.valueIndex++];
    });
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


const exampleCreateElement = /**@type {CreateElementType} */ (type, props, ...children)=> (!type||isString(type))? {tag:type, props, children} : type({children, ...props});

const exampleFragmentComponent = /**@type {ComponentType} */  (({children})=>({tag:null, props:null, children}));


/** @type {ParsingRule[]} */
const exampleParsingRules = [
  {component: '@mathInline', start: /(?<!\\)\$(?!\$)/y, capture: /(.*?)(?<!\\)\$/y, },
  {component: '@mathDisplay', start: /(?<!\\)\$\$/y, capture: /(.*?)(?<!\\)\$\$/y, },
  {component: '@codeInline', start: /(?<!\\)`(?!``)/y, capture: /(.*?)(?<!\\)`/y, },
  {component: '@codeDisplay', start: /(?<!\\)```/y, capture: /(.*?)(?<!\\)```/y, },
]

// const exampleCustomRules = /** @type {CustomRule[]} */ [
//   {
//     regStart: `(?<!\\\\)\\$\\$`,
//     regEnd: `(?<!\\\\)\\$\\$`,
//     parser: /**@type {RuleParser}*/ ((text)=>['div', {'(component)': '@math', displayMode:true}, [text]]),
//   },
//   {
//     regStart: `(?<!\\\\)\\$`,
//     regEnd: `(?<!\\\\)\\$`,
//     parser: /**@type {RuleParser}*/ ((text)=>['div', {'(component)': '@math', displayMode:false}, [text]]),
//   },
//   {
//     regStart: `(?<!\\\\)\`\`\``,
//     regEnd: `(?<!\\\\)\`\`\``,
//     parser: /**@type {RuleParser}*/ ((text)=>{
//       text = text.replace(/\\\`\`\`/g, '```');
//       let progLang = assertNonNull(text.match(/^[^\n]*/));
//       return ['div', {'(component)': '@code', ...(!progLang.length?{}:{progLang})}, [text]];
//     }),
//   },
//   {
//     regStart: `(?<!\\\\)\``,
//     regEnd: `(?<!\\\\)\``,
//     parser: /**@type {RuleParser}*/ ((text)=>{
//       text = text.replace(/\\\`/g, '`');
//       return ['div', {'(component)': '@code'}, [text]]
//     }),
//   },
// ];



export const createParser = ()=>{

  const settings = {
    createElement: exampleCreateElement,
    FragmentComponent: exampleFragmentComponent,
    parsingRules: exampleParsingRules,
    debug: /** @type {0|1|2}*/(0),
  }
  
  const parseAst = (/** @type {TemplateStringsArray} */ templateString, ...values)=> new AstParser(templateString.raw, values, settings.parsingRules, settings.debug);
  
  const parse = (/** @type {TemplateStringsArray} */ templateString, ...values)=> parseAst(templateString, ...values).evalTree(settings.createElement, settings.FragmentComponent);

  const astUndoHtml = (/** @type {AstNode}*/ root) => {
    if (isString(root)) return htmlSafeUndo(root);
    if (!Array.isArray(root)) return root;
    root[2] = root[2].map(child => astUndoHtml(child));
    return root;
  }
  const parseAstHtml = (/** @type {string}*/str) => {
    // Parse html, undoing html safe conversions, and then create element
    let tmp = /** @type {TemplateStringsArray}*/(/**@type {any}*/({raw:[str]}));
    let ast = parseAst(tmp);
    ast.root = astUndoHtml(ast.root)
    return ast;
  }
  const parseHtml = (/** @type {string}*/str) => parseAstHtml(str).evalTree(settings.createElement, settings.FragmentComponent);

  return { settings, parse, parseAst, parseAstHtml, parseHtml, }
}

