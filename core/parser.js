//@ts-check
/// <reference path="types.js" />
/// <reference path="utils.js" />

/**
 * @typedef {string|[string, Object|null, AstNodeArray]|[null, null, AstNodeArray]} AstNode
*/
/**
 * @typedef {AstNode[]} AstNodeArray
*/

__caph_definitions__.ConsoleProxy = class{
  log(...args){ console.log(...args);}
  warn(...args){ console.warn(...args);}
  error(...args){ console.error(...args);}
}



__caph_definitions__.Parser = class {

  console = new __caph_definitions__.ConsoleProxy();

  /** @returns {AstNode} */
  _main(/** @type {string}*/ str){
    let pos = 0;
    const FIELD = '\ue000';

    const absorbedTags = {
      '!doctype': true, '![CDATA[': true,
    };
    const childlessTags = {
      br:true, '!doctype': true, '![CDATA[': true,
      hr:true, img:true, input:true, link:true, meta:true, wbr:true,
    };

    const spacePreservingTags = {
      'pre': true, 'span':true,
    };

    function _currentPos() {
      return `${pos}...${str.slice(pos, pos+40).replace('\n', '(\\n)')}...${pos+40}`;
    }

    /**
     * @param {string|null} tag
     * @param {Object|null} props
     * @param {AstNode[]} children
     * @returns {AstNode}*/
    function parseParent(tag, props=null, children=[]){
      /*
        Parses after `<div ` has been consumed 
        or after `<div attr1 attr2="value" ` has been consumed
        Thus, it just checks for more attributes or `>` or `/>`
      */
      //console.log('parseParent', tag, props, children, _currentPos());
      if(tag===undefined) throw '';
      if(tag=='![CDATA['){ // CDATA does not admit attributes nor children
        const [_, CDATA] = run(new RegExp(`(.*?)\\]\\]\\>`, 'ys'));
        return [tag, {CDATA}, []];
      }
      let orCloseHead = `|\\/\\>|\\>`;
      let orAttr = `|([^\\s=\\>]+?)(=\\".*?\\"|=\\'.*?\\'|=${FIELD}|(?=\\>))`;
      let reg = new RegExp(`\\s*($${orCloseHead}${orAttr})`, 'ys');
      let [_, endOrAttr, ..._attr] = run(reg);
      const endReached = !endOrAttr.length;
      if(endReached){
        this.console.warn(`Expected closing end ...> or .../> for tag ${tag}`);
        return [tag, props, children];
      }
      let fullyClosed = endOrAttr == '/>';
      const headClosed = fullyClosed || endOrAttr == '>';
      if(headClosed && childlessTags[tag?.toLowerCase()]) fullyClosed = true;
      if(fullyClosed) return [tag, props, children];
      if(headClosed){
        children = parseSiblings(tag, children);
        return [tag, props, children];
      }
      const [key, _value] = _attr;
      let value;
      if(_value==FIELD){value="SOME FIELD..."}
      else{value=_value.slice(2,-1)} // consume `="` and `"`
      if(!props) props = {};
      props[key] = value;
      return parseParent(tag, props, children);
    }
    
    function run(regExp){
      regExp.lastIndex = pos;
      const match = regExp.exec(str);
      if(!match) throw `No match for ${regExp} with string: ...${str.slice(pos)}`
      if(match.index<pos) throw `Regexp must use 'ys' flags. Match for at ${match.index} is before previous match at ${pos}`;
      const out = [...match];
      pos += out[0].length;
      return out;
    }

    /**
     * @param {string|null} parentTag
     * @param {AstNode[]} siblings
     * @returns {AstNode[]}*/
    function parseSiblings(parentTag, siblings){
      //console.log('sibling', parentTag, siblings, _currentPos());
      assert(parentTag!==undefined);
      // Parse text preceeding the first sibling
      let [text] = run(new RegExp(`[^\\<]*`, 'ys'));
      if(text.length){
        // this.console.log(`REPLACE :|${text}|`);
        if(spacePreservingTags[parentTag?.toLocaleLowerCase()]){
          // Trim multiple spaces to single space. No other modification.
          text = text.replace(/^\s+(.*?)$/, ' $1');
          text = text.replace(/^(.*?)\s+$/, '$1 ');
        } else{
          // Replace multiple spaces with single space everywhere. Trim.
          text = text.replace(/\s+/g, ' ');
          text = text.trim();
        }
        // this.console.log(`REPLACED:|${text}|`);
      }
      //this.console.log('TEXT', text);
      if(text.length) siblings.push(text);
      // Parse the first sibling if it exists
      let orOpenSibling = `|\\<!\\[CDATA\\[|\\<(?=\\>)|\\<([^\\s\\>=\\/]+)`;
      let orCloseParent = `|\\<\\/\\>`+(parentTag?`|\\<\\/${parentTag}\\s*\\>`:'');
      let reg = new RegExp(`$${orOpenSibling}${orCloseParent}`, 'ys');
      let [match, _tag] = run(reg);
      const endReached = !match.length;
      if(endReached && parentTag){
        this.console.warn(`Expected closing tag </${parentTag}> or </> after ${text}`);
      }
      const parentClosed = match.includes('/');
      //console.log('PARENT CLOSED', parentClosed, `|${match}|`);
      if(endReached || parentClosed) return siblings;
      if(match=='<![CDATA[') _tag = '![CDATA[';
      const tag = (_tag&&_tag.length&&_tag) || null; //null means fragment
      //console.log('CAPTURED', match, tag);
      const newSibling = parseParent(tag, null, []);
      const absorb = !!absorbedTags[tag?.toLowerCase()];
      if(absorb){} // Discard newSibling
      else if(tag) siblings.push(newSibling);
      else siblings.push(... newSibling[2]); // shortcut fragment nieces as siblings
      return parseSiblings(parentTag, siblings);
    }
    const elems = parseSiblings(null, []);
    return elems.length==1 ? elems[0] : [null, null, elems];
  }

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
      'li': '',
      'dt': 'dd',
      'dd': 'dt',
      'p': 'address article aside blockquote details div dl fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 header hgroup hr main menu nav ol pre section table',
      'rt': 'rp',
      'rp': 'rt',
      'optgroup': '',
      'option': 'optgroup',
      'caption': 'tbody thead tfoot tr colgroup',
      'colgroup': 'thead tbody tfoot tr caption',
      'thead': 'tbody tfoot caption',
      'tbody': 'tfoot caption',
      'tfoot': 'caption',
      'tr': 'tbody tfoot',
      'td': 'th tr',
      'th': 'td tr tbody',
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
