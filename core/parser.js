//@ts-check
/// <reference path="types.js" />
/// <reference path="utils.js" />

/** @typedef {({children, ...props})=>any} ComponentType*/
/** @typedef {Object} AttributesType*/
/** @typedef {string|ComponentType|null} TagType*/
/** @typedef {(type:any, props:any, ...children)=>any} CreateElementType*/
/** @typedef {(text:string) => AstNode} RuleParser*/
/** @typedef {{regStart:string, regEnd:string, parser:RuleParser}} CustomRule*/
/**
 * @typedef {string|
 * [string|ComponentType, AttributesType|null, AstNodeArray]|
 * [null, null, AstNodeArray]
 * } AstNode
*/
/** @typedef {AstNode[]} AstNodeArray*/

__caph_definitions__.ConsoleProxy = class{
  log(...args){ console.log(...args);}
  warn(...args){ console.warn(...args);}
  error(...args){ console.error(...args);}
}



__caph_definitions__.BaseParser = class {

  // constructor(newAstNode=null) {
  //   this.newAstNode = newAstNode? newAstNode:((tag, props, ...children) => [tag, props, children]);
  // }

  //console = new __caph_definitions__.ConsoleProxy();

  ESC = '\ue000';
  SPEC = `https://html.spec.whatwg.org/multipage/syntax.html`;
  DEBUG = false;

  /**
   * @param {null|{createElement:CreateElementType, FragmentComponent:ComponentType}} post
  */
  static parserFactory(post=null){
    const cls = this;

    const parse = ({raw:strings}, ...values)=>evalAst(new cls(strings, values).root);
    const parseAst = ({raw:strings}, ...values)=> new cls(strings, values).root;

    const {createElement, FragmentComponent} = post||{
      createElement: (type, props, ...children)=> (!type||is_string(type))?
        [type, props, children] : type({children, ...props}),
      FragmentComponent: ({children})=>[null, null, children],
    };

    const evalAst = (/** @type {AstNode}*/ root)=>{
      if(is_string(root)) return root;
      let [tag, props, children] = root;
      children = children.map(child=>evalAst(child));
      if(tag==null){
        assert(props==null);
        return FragmentComponent({children});
      }
      return createElement(tag, props, ...children);
    }

    return {parse, parseAst, evalAst};
  }

  /**
   * @param {null|{createElement:CreateElementType, FragmentComponent:ComponentType}} post
  */
  static debugParserFactory(post=null){
    const cls = this;
    const {evalAst, parse, parseAst} = this.parserFactory(post);
    const parse1 = ({raw:strings}, ...values)=>evalAst(new cls(strings, values, 1).root);
    const parse2 = ({raw:strings}, ...values)=>evalAst(new cls(strings, values, 2).root);
    const parseAst1 = ({raw:strings}, ...values)=> new cls(strings, values, 1).root;
    const parseAst2 = ({raw:strings}, ...values)=> new cls(strings, values, 2).root;
    return {parse, parse1, parse2, parseAst, parseAst1, parseAst2, evalAst};
  }

  /** @type {CustomRule[]} */
  static customRules = [];

  constructor(/** @type {string[]}*/ strings, values, debug=0){
    let str = strings.join(this.ESC);
    let escaped = {};
    str = str.replace(new RegExp(String.raw`${this.ESC}|\\"|\\'|\\\`|\\$\\$|\\$(?=[^\\$])`), (match, index)=>{
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

    const cls = this.constructor;
    /** @type {CustomRule[]} */ //@ts-ignore
    this.customRules = cls.customRules;
    /** @type {(tag:TagType)=>(null|string[])} */ //@ts-ignore
    this.optionalClose = cls.optionalClose.bind(cls);

    this.REG_EXP_TEXT = new RegExp(`.*?(?=${[
      '$', '<', this.ESC,
      ...this.customRules.map(({regStart})=>regStart),
    ].join('|')})`, 'ys');

    const elems = this.parseSiblings(null, []);
    const /** @type {AstNode} */ root = elems.length==1 ? elems[0] : [null, null, elems];
    if(this.pos!=this.str.length) console.warn(`Not all the string was consumed: ${this.pos}/${this.str.length}`);
    this.root = root;
  }

  childlessTags = {
    br:true, '!doctype': true, area: true, base: true, col: true, command: true, embed: true, hr: true,img: true, input: true,keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true
  };

  spacePreservingTags = {
    'pre': true, 'span':true, 'code':true,
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

  try_run(/** @type {RegExp}*/regExp){
    try{ return this.run(regExp); }
    catch(e){ return null; }
  }
  try_run_undo(/** @type {RegExp}*/regExp){
    const pos = this.pos;
    try{ return this.run(regExp); }
    catch(e){ return null; }
    finally{ this.pos = pos; }
  }

  _currentPos() { // Just for printing debug info
    const {pos, str} = this;
    const short = str.slice(pos, pos+50).replace('\n', '(\\n)');
    return `${pos}...${short}...${pos+50}`;
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
    this.DEBUG && console.log('parseSibling', parentTag, siblings, this._currentPos());
    assert(parentTag!==undefined);
    // Parse text preceeding the first sibling
    let [text] = this.run(this.REG_EXP_TEXT);
    if(text.length) text = this.trimText(parentTag, text);
    if(text.length) siblings.push(text);
    if(this.try_run(new RegExp(`${this.ESC}`, 'ys'))){
      let value = this.values[this.valueIndex++];
      if(Array.isArray(value)) siblings.push(...value);
      else siblings.push(this.replaceText(text, this.pos-1));
      return this.parseSiblings(parentTag, siblings);
    }
    let endReached = this.pos==this.str.length;
    if(endReached){
      if(parentTag && !this.optionalClose(parentTag)){
        console.warn(`Expected closing tag </${parentTag}> or </> after ${text}. Ignoring what follows`);
        this.errorStop = true;
      }
      return siblings;
    }
    if(this.customRules.length){
      for(let {regStart, regEnd, parser} of this.customRules){
        let m = this.try_run(new RegExp(`${regStart}(.*?)${regEnd}`, 'ys'));
        if(m){
          siblings.push(parser(m[1]));
          return this.parseSiblings(parentTag, siblings);
        }
      }
    }

    // Comment, DOCTYPE, or CDATA
    if(this.str.startsWith('<!', this.pos)){
      let result = this.try_run(new RegExp([
        `<!--.*?-->`,
        `<!\\[CDATA\\[.*?\\]\\]>`,
        `<!DOCTYPE\\s*.*?>`,
      ].join('|'), 'iys'));
      if(!result){
        console.error(`Unexpected <! at ${this._currentPos()}\nIgnoring what follows.`);
        this.errorStop = true;
        return siblings;
      }
      let [text] = result;
      if(text.endsWith('/>')) console.warn(`Non compliant tag found.\n${this.SPEC}`);
      this.replaceText(text, this.pos-text.length); // Consume the fields inside, if any
      return this.parseSiblings(parentTag, siblings);
    }
    // Parent close
    let /** @type {TagType} */ tag;
    if(this.try_run(/<\/\s*>/ys)) return siblings;
    if(this.try_run(/<\//ys)){
      let result = this.try_run(new RegExp(`(.*?)\\s*>`, 'ys'));
      if(!result){
        console.error(`Expected close tag for parent ${parentTag||'fragment'} at ${this._currentPos()}\nIgnoring what follows.`);
        this.errorStop = true;
        return siblings;
      }
      let _tag = result[1];
      if (_tag==this.ESC) tag = this.values[this.valueIndex++];
      else tag = _tag;
      if(tag!==parentTag){
        console.error(`Unmatched close tag ${tag}!=${parentTag} at ${this._currentPos()}\nIgnoring what follows.`);
        this.errorStop = true;
      }
      return siblings;
    }
    const optionalClose = this.optionalClose(parentTag);
    if(optionalClose) for(let tag of optionalClose){
      if(this.try_run_undo(new RegExp(`<${tag}(>|\\s)`, 'ys'),)){
        return siblings;
      }
    }
    // Parse the first sibling
    let reg = new RegExp(`<([^\\s>\\/\\.]*)`, 'ys');
    let _tag = this.run(reg)[1];
    if (_tag==this.ESC) tag = this.values[this.valueIndex++];
    else if(!_tag.length) tag = null; //null means fragment
    else if(_tag.match(/[^a-z0-9._-]/i)){
      console.error(`Error with tag ${_tag} before ${this._currentPos()}\nIgnoring what follows.`);
      this.errorStop = true;
      return siblings;
    }
    else tag = _tag;
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
    this.DEBUG && console.log('parseParent ', tag, props, children, this._currentPos());
    if(tag===undefined) throw '';
    this.run(/\s*/ys); // Consume whitespace
    if(this.pos==this.str.length){
      console.warn(`Expected closing end ...> or .../> for tag ${tag}`);
      this.errorStop = true;
      return [tag, props, children];
    }
    let headClosed = !!this.try_run(/>/ys);
    let fullyClosed = (headClosed && !!this.childlessTags[(''+tag)?.toLowerCase()]) ||
      !!this.try_run(/\/>/ys);
    if(fullyClosed) return [tag, props, children];
    if(headClosed){
      children = this.parseSiblings(tag, children);
      return [tag, props, children];
    }
    if(!props) props = {};
    if(this.try_run(new RegExp(`\\.\\.\\.${this.ESC}`, 'ys'))){
      props = {...props, ...this.values[this.valueIndex++]};
    }
    else{
      let [key] = this.run(/.*?(?=\s|>|=)/ys);
      let _value = this.try_run(/=/ys) && this.run(new RegExp(`\\".*?\\"|\\'.*?\\'|${this.ESC}`, 'ys'))[0];
      let value;
      if(!_value) value = true;
      else if(_value==this.ESC) value=this.values[this.valueIndex++];
      else value = this.replaceText(_value.slice(1,-1), this.pos-_value.length+1); // slice for quotes
      props[key] = value;
    }
    return this.parseParent(tag, props, children);
  }

  /**
   * @param {TagType} parentTag
   * @param {string} text
   * @returns {string}*/
  trimText(parentTag, text){
    const spaceMatters = parentTag && this.spacePreservingTags[(''+parentTag).toLocaleLowerCase()];
    // console.log(`REPLACE :|${text}|`);
    if(spaceMatters){
      // Trim multiple spaces to single space. No other modification.
      text = text.replace(/^\s+(.*?)$/, ' $1');
      text = text.replace(/^(.*?)\s+$/, '$1 ');
    } else{
      // Replace multiple spaces with single space everywhere. Trim.
      text = text.replace(/\s+/g, ' ');
      text = text.trim();
    }
    // console.log(`REPLACED:|${text}|`);
    return text;
  }

  /**
   * @param {string} text
   * @param {number} posOfText
   * @returns {string}*/
  replaceText(text, posOfText){
    return text.replace(new RegExp(this.ESC, 'g'), (_, index)=>{
      const original = this.escaped[posOfText+index];
      if(original!=this.ESC) return original;      
      let out = `${this.values[this.valueIndex++]}`;
      if(out=="[object Object]") out = JSON.stringify(out);
      return out;
    });
  }
}

/**
 * TO DO:
 * 1. Implement "close with sibling"
 * 2. Make a new class that inherits from this one and adds math support. It must be extensible.
 * 3. Make a new class that inherits from math and adds code support. It must be extensible.
 * 4. Make a new class that inherits from math and adds paragraphs support. It must be extensible.
 */

 __caph_definitions__.NewParser = class extends __caph_definitions__.BaseParser {
  
  static customRules = [
    ...__caph_definitions__.BaseParser.customRules,
    {
      regStart: `(?<!\\\\)\\$\\$`,
      regEnd: `(?<!\\\\)\\$\\$`,
      parser: /**@type {RuleParser}*/ ((text)=>['caph', {plugin: 'caph-math', displayMode:true}, [text]]),
    },
    {
      regStart: `(?<!\\\\)\\$`,
      regEnd: `(?<!\\\\)\\$`,
      parser: /**@type {RuleParser}*/ ((text)=>['caph', {plugin: 'caph-math'}, [text]]),
    },
  ];

}

//------------------------------------------------------------------------------

__caph_definitions__.Parser = class {
  // /**
  //  * @template T
  //  * @param {string} str
  //  * @param {(type: string, props: (Object|null), ...children: T[])=>string} post 
  //  * @returns {T|string}
  //  * */
  // main(str, post){
  //   const root = this._main(str);
  //   function rec(/** @type {AstNode}*/root){
  //     if(is_string(root)) return root;
      
  //   }
  //   return post(ast);
  // }

  constructor(newAstNode=null) {
    if(newAstNode===null){
      this.newAstNode = (tag, props, ...children) => [tag, props, children];
    } else {
      this.newAstNode = newAstNode;
    }
    // based on xhtm, which is based on htm. Differences:
    // 1. Replaces html entities
    // 2. Parses math markup.
    // 3. Renders errors instead of blocking.

    const empty = {};
    const FIELD = '\ue000';
    const QUOTES = '\ue001';
    const ESCAPED_DOLLAR = '\ue002';
    const SPACE = '\ue003';
    const each_FIELD = new RegExp(FIELD, 'g');
    const each_QUOTES = new RegExp(QUOTES, 'g');
    const each_ESCAPED_DOLLAR = new RegExp(ESCAPED_DOLLAR, 'g');
    const each_SPACE = new RegExp(SPACE, 'g');

    'area base br col command embed hr img input keygen link meta param source track wbr ! !doctype ? ?xml'.split(' ').map(v => empty[v] = empty[v.toUpperCase()] = true)
    // https://html.spec.whatwg.org/multipage/syntax.html#optional-tags
    // closed by the corresponding tag or end of parent content
    const close = {
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
    for (let tag in close) {
      [...close[tag].split(' '), tag].map(closer => {
        close[tag] =
          close[tag.toUpperCase()] =
          close[tag + closer] =
          close[tag.toUpperCase() + closer] =
          close[tag + closer.toUpperCase()] =
          close[tag.toUpperCase() + closer.toUpperCase()] =
          true;
      })
    }
    this._parseEnv = { empty, close, FIELD, QUOTES, ESCAPED_DOLLAR, each_FIELD, each_QUOTES, each_ESCAPED_DOLLAR, SPACE, each_SPACE };
  }

  html_is_valid_attr_key(key) {
    return /^[a-zA-Z_:][a-zA-Z0-9_:.-]*$/.test(key);
  }

  _parse(parse_math, strings, ...values) {
    const { empty, close, SPACE, each_SPACE, FIELD, QUOTES, ESCAPED_DOLLAR, each_FIELD, each_QUOTES, each_ESCAPED_DOLLAR } = this._parseEnv;

    const fields = new __caph_definitions__.Dequeue(values);
    let prev = 0, args, name, value, quotes = [], quote = 0, last;
    let /** @type {any}*/current = [];

    current.root = true;

    const evaluate = (str, parts = [], raw) => {
      let i = 0;
      str = !raw && str === QUOTES ?
        quotes[quote++].slice(1, -1) :
        str.replace(each_QUOTES, m => quotes[quote++]);
      if (!str) return str;
      str.replace(each_FIELD, (match, idx) => {
        if (idx) parts.push(str.slice(i, idx));
        i = idx + 1;
        return parts.push(fields.popLeft());
      })
      if (i < str.length) parts.push(str.slice(i));
      return parts.length > 1 ? parts : parts[0];
    }
    // close level
    const up = () => {
      [current, last, ...args] = current;
      const elem = this.newAstNode(last, ...args);
      current.push(elem);
      depth -= 1;
    }
    const setAttr = (props, key, value) => {
      if (key == 'style' && Array.isArray(value)) value = value.join(' ');
      if (this.html_is_valid_attr_key(key))
        return props[key] = value;
      console.log(props);
      // Fix the error to avoid blocking the whole render process
      const tag = current[1];
      console.error(`Parsing error near <${tag} ... ${key}.`)
      if (key[0] == '<') {
        const newTag = key.slice(1);
        console.warn(`Ignoring <${tag}. Assuming <${newTag}...`);
        current[1] = newTag;
      }
    }
    let s = strings.join(FIELD);
    s = s.replace(/<!--[^]*-->/g, '');
    s = s.replace(/<!\[CDATA\[[^]*?\]\]>/g, '');
    s = s.replace(/\s+/g, ' ');
    if(parse_math){
      s = s.replace(/\\\$/g, ESCAPED_DOLLAR);
      // s = s.replace(/([^\\]|^)\$\$(.*?[^\\])\$\$(.|$)/sg,
      //   (match, before, tex, after) =>
      //     `${before}${parseMath(tex, true, match)}${after}`,
      // );
      // s = s.replace(
      //   /([^\\]|^)\$(.*?[^\\])\$(.|$)/sg,
      //   (match, before, tex, after) =>
      //     `${before}${parseMath(tex, false, match)}${after}`,
      // );
      //
      s = s.replace(/(\$\$|\$)([^\1]*?)\1( ?)/sg, (match, mark, tex, space) => {
        // if (match.search(/\/\>/) != -1) {
        //   match = match.replace(each_ESCAPED_DOLLAR, '\\\$');
        //   console.error('Math parsing error:', match);
        //   const safe = this._html_safe(match);
        //   return `<caph plugin="core-error">${safe}</>`;
        // }
        tex = tex.replace(/\</g, '\\lt ');
        tex = tex.replace(/\>/g, '\\gt ');
        tex = tex.replace(each_ESCAPED_DOLLAR, '\\\$');
        const mode = mark == '$$' ? ' displayMode' : '';
        const end = space.length ? `<span children=" "/>` : '';
        return `<caph plugin="caph-math" ${mode}>${tex}</>${end}`;
      });
      s = s.replace(each_ESCAPED_DOLLAR, '$'); // \$ in html becomes $
    }
    // There is a deep error here: they assume arg="..." will never occur in the html unless it
    // is being part of a <tag arg="...">. 
    s = s.replace(/= *('|")([^\1]*?)\1/g, (match, quote, content) => {
      quotes.push(`${quote}${content}${quote}`);
      return `=${QUOTES}`;
    });
    // ...>text<... sequence
    let depth = -1;
    s = s.replace(/(?:^|>)([^<]*)(?:$|<)/g, (match, text, idx, str) => {
      depth += 1;
      let closeTag, tag;
      if (idx) {
        let ss = str.slice(prev, idx);
        // <abc/> → <abc />
        // console.log(`${'|'.repeat(depth)}${ss}. ${text}`);
        ss = ss.replace(/(\S)\/$/, '$1 /');
        ss.split(' ').map((part, i) => {
          // console.log(' '.repeat(depth), i, part);
          if (part[0] === '/') {
            closeTag = tag || part.slice(1) || 1;
            depth -= 1;
          }
          else if (!i) {
            tag = evaluate(part);
            // <p>abc<p>def, <tr><td>x<tr>
            while (close[current[1] + tag]) up();
            current = [current, tag, null];
            if (empty[tag]) closeTag = tag;
          }
          else if (part) {
            let props = current[2] || (current[2] = {});
            if (part.slice(0, 3) === '...') {
              const newProps = fields.popLeft();
              for (let key in newProps) {
                setAttr(props, key, newProps[key]);
              }
            }
            else {
              [name, value] = part.split('=');
              setAttr(props, evaluate(name), value ? evaluate(value) : true);
            }
          }
        })
      }
      if (closeTag) {
        up();
        // if last child is closable - closeTag it too
        while (last !== closeTag && close[last]) up();
      }
      prev = idx + match.length;
      if (text && (text !== ' ' || tag == 'span')) evaluate((last = 0, text), current, true);
    });
    if (!current.root) up();
    return current.length > 1 ? current : current[0];
  }


  parse({ raw: strings }, ...values) {
    return this._parse(true, strings, ...values);
  }
  parseNoMarkup({ raw: strings }, ...values) {
    return this._parse(false, strings, ...values);
  }

  parseEsc(strings, ...values) {
    return this._parse(true, strings, ...values);
  }
  parseNoMarkupEsc(strings, ...values) {
    return this._parse(false, strings, ...values);
  }
}
