
//https://stackoverflow.com/a/70329711

__caph_definitions__.BaseParser = (class MY_CLASS{

  static getClass(){ return this; }

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

    const parse = ({raw:strings}, ...values)=>evalAst(new cls(strings, values).root);
    const parseAst = ({raw:strings}, ...values)=> new cls(strings, values).root;

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


  warn(...args){console.warn(...args)}; // Overriden during tests
  error(...args){console.error(...args)}; // Overriden during tests

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


    const cls = /** @typeof MY_CLASS} */(this.constructor);
    this.customRules = cls.customRules;
    /** @type {(tag:TagType)=>(null|string[])} */ //@ts-ignore
    this.optionalClose = cls.optionalClose.bind(cls);

    this.REG_EXP_TEXT = new RegExp(`.*?(?=${[
      '$', '<', this.ESC,
      ...this.customRules.map(({regStart})=>regStart),
    ].join('|')})`, 'ys');

    const elems = this.parseSiblings(null, []);
    /** @type {AstNode} */
    const root = elems.length==1 ? elems[0] : [null, null, elems];
    if(this.pos!=this.str.length) console.warn(`Not all the string was consumed: ${this.pos}/${this.str.length}`);
    this.root = root;
  }