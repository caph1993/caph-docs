
class ResourcesLoader{

  plugins = {};
  mathMacros = {};
  components = {};
  loadPlugins = async ()=>console.log('caph.loadPlugins not set. No plugins were loaded');
  _attachments=[];
  _loadStatus = {};

  setPreReady;
  _preReady = new Promise((setter, _)=>this.setPreReady=setter);
  preReady = ()=>this._preReady;
  setReady;
  _ready = new Promise((setter, _)=>this.setReady=setter);
  ready = ()=>this._ready;

  _required = [
    {ref: 'caph-docs/core/core.css',},
    {ref: 'caph-docs/core/menu.js',},
    {ref: 'caph-docs/core/katex.min.js',},
    {ref: 'caph-docs/core/katex-nofonts.min.css',},
  ];
  
  constructor(required_attachments){
    for(let a of required_attachments) this.attach(a);

    this.div = document.getElementById('core-sources');
    if(!this.div){
      this.div = MyDocument.createElement('div', {
        id: 'core-sources',
        parent: document.head,
        where: 'beforeend',
      });
    }
    const metaContent = document.querySelector('meta[content]');
    if(!metaContent) MyDocument.createElement('div', {
      parent: document.head,
      where: 'afterbegin',
      name: 'viewport',
      content: window.innerWidth > 960?
        'width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no'
        : 'width=1024'
    });

    (async()=>{
      for(let s of this._required){
        await this.load(s.ref, {
          parent:this.div,
          afterPreReady: false,
        });
      }
      this.setPreReady();
    })();
  }

  getAttachment(ref){
    for(let e of this._attachments) if(e.ref==ref) return e.content;
    return null;
  }
  attach(...attachments){
    for(let s of attachments){
      if(this.getAttachment(s.ref)===null) this._attachments.push(s);
      else this._attachments.forEach(a=>{
        if(a.ref==s.ref) a.content=s.content;
      });
    }
  }

  async load(ref, {attrs={}, parent=null, where='beforeend',
      auto_attrs=true, afterPreReady=true}={}){
    // Load an external script or style by inserting relative to parent
    if(afterPreReady) await this.preReady();
    if(parent==null) parent=this.div;
    const ext = ref.split('.').pop();
    let tag = ext=='js'? 'script': ext=='css'? 'link' : null;
    if(tag==null) throw new Error('Only .js and .css files can be _sources. Got: '+ext+' '+ref);
    let defaults = {};
    if(auto_attrs && tag=='link') defaults={rel:'stylesheet', type:'text/css'};
    Object.keys(attrs).forEach(k=>defaults[k]=attrs[k]);
    let content = this.getAttachment(ref);
    if(content && tag=='link') tag = 'style';
    attrs = defaults;
    if(content){
      delete attrs.src;
      delete attrs.href;
    } else {
      if(tag=='script') attrs.src = ref;
      if(tag=='link') attrs.href = ref;
    }
    try{
      await this._load_elem(ref, tag, attrs, parent, where, content);
    } catch(err){
      console.log(err);
      throw err;
    }
  }

  async _load_elem(ref, tag, attrs, parent, where, content){
    // Handle concurrent calls to load_elem(...) about the same ref
    if(!this._loadStatus[ref]){
      this._loadStatus[ref]=1;
      try{
        await this.__load_elem(ref, tag, attrs, parent, where, content);
        this._loadStatus[ref]=2;
      } catch(err){
        this._loadStatus[ref]=0;
        throw err;
      }
    }
    while(this._loadStatus[ref]==1){ // If being loaded in other thread...
      await sleep(80);
    }
  }

  __load_elem(ref, tag, attrs, parent, where, content){
    return new Promise((_ok, _err)=>{
      let e = document.createElement(tag);
      let done = false;
      e.onload = ()=>{if(!done){ done=true; _ok(); }};
      e.onerror = (x)=>{if(!done){ done=true; _err(x); }}; // HTTP errors only
      Object.keys(attrs).map(key => e.setAttribute(key, attrs[key]));
      if(content){
        let r = window._loaded_resources||{};
        window._loaded_resources = r;
        r[ref] = false;
        content += `\nwindow._loaded_resources['${ref}']=true;\n`;
        e.innerHTML = content;
        if(tag=='script'){
          (async()=>{
            while(!r[ref]) await sleep(100);
            done=true; _ok();
          })();
        } else if(tag=='style'){
          let ms = 10;
          setTimeout(()=>{done=true, _ok()}, ms);
        }
      }
      parent.insertAdjacentElement(where, e);
      setTimeout(()=>done||_err(['Timeout (5s) loading source:', e]), 5000);
    });
  };

  async render(){
    await this.preReady();
    let promise;
    await (promise=this.loadPlugins());
    if(Promise.resolve(promise) != promise){
      let msg = 'caph.loadPlugin must be an asynchronous function!';
      window.alert('Error: '+msg);
      throw msg;
    }
    this.loadMathMacros();

    let rootElement = document.querySelector('#caph-root');
    if(rootElement) rootElement.removeAttribute('id');
    else{
      rootElement = document.body;
      console.warn("No element with id 'caph-root'. Using body.");
    }
    function hDataTag(type, props, ...children) {
      let tag = props&&props['data-tag'];
      let component = tag&&caph.components[tag];
      if(tag && !component) console.warn(`Found undefined tag "${tag}".`);
      if(component){
        for(const k in props) if(k.startsWith('data-')){
          const strValue = props[k];
          delete props[k];
          let value = strValue.length?strValue:'true';
          try{ value=eval(`(${value})`); }catch(error){}
          props[k.slice(5)] = value;
        }
        delete props['tag'];
        type = component;
      }
      return preact.h(type, props, children);
    }
    let dataParser = htm.bind(hDataTag);
    let innerHtml = rootElement.innerHTML;
    innerHtml = this.fixSelfClosing(innerHtml);
    let vdom = dataParser([innerHtml]);
    preact.render(vdom, rootElement);
    this.setReady();
  }

  fixSelfClosing(text){
    const tags='area base br col command embed hr img input keygen link meta param source track wbr';
    for(const tag of tags.split(' ')){
      const reg = new RegExp(`<${tag}(.*?)\/?>`, 'g'); 
      text = text.replace(reg, `<div data-tag="selfClosing" data-htmlTag="${tag}" $1></div>`);
    }
    return text;
  }

  loadMathMacros(){
    // Load this.mathMacros to KaTeX.__defineMacro and MathJax.tex.macros
    window.MathJax = MyObject.deep_assign({
      tex: {inlineMath: [['$', '$'], ['\\(', '\\)']], macros:{}},
      svg: {fontCache: 'local', exFactor: 1.0, scale: 1.0,},
    }, window.MathJax||{});
    
    for(let key in this.mathMacros){
      let s = this.mathMacros[key];
      katex.__defineMacro(`\\${key}`, s);
      let n = 1; while(s.indexOf(`#${n}`)!=-1) n+=1;
      window.MathJax.tex.macros[key] = n==1?s : [s, n-1];
    }
  }

  makePlugin({component, loader=null, post_loader=null}){
    return function(){
      const [ready, setReady] = preact.useState(false);
      const [error, setError] = preact.useState(null);
      const _load = async ()=>{
        try{
          if(loader) await loader(...arguments);
          setReady(true);
          if(post_loader) await post_loader(...arguments);
        } catch(err){ setError(err); console.error(err); }
      };
      preact.useEffect(()=>{_load();}, []);
      return html`${
        error? html`<div>Error</div>`
        : (
          ready? component.apply(this, arguments)
          : html`
            <div class="hbox align-center space-around flex"
                style="width:100%;height:100%">
              <div class="plugin-loading"/>
            </div>`
        )
      }`;
    }
  }
  entities = {
    '&nbsp;': '\\ ', '&amp;' :'&', '&gt;' :'>', '&lt;' :'<',
    '&quot;' :'"', '&apos;' :"'",
    '&cent;' :'¢', '&pound;' :'£', '&yen;' :'¥',
    '&euro;' :'€', '&copy;' :'©', '&reg;' :'®',
  };
  replace(s, obj){ // Undo xthm replacements
    if(obj==undefined) obj=this.entities;
    for(const key in obj) s = s.replace(new RegExp(key, 'g'), obj[key]);
    return s;
  }
  mathString(text){
    const regularExpression = /\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$[^\$\\]*(?:\\.[^\$\\]*)*\$/g;
    const latexMatch = text.match(regularExpression);
    
    if(!latexMatch) return text; // no math in text

    const blockRegularExpression = /\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]/g;
    
    const stripDollars = (stringToStrip) =>(
      (stringToStrip[0] === "$" && stringToStrip[1] !== "$")?
        stringToStrip.slice(1, -1)
        : stringToStrip.slice(2, -2)
    );

    const getDisplay = (stringToDisplay) =>(
      stringToDisplay.match(blockRegularExpression) ? "block" : "inline"
    );
    let parser = (formula, mode)=>`
      <script data-tag="math" data-mode="${mode}" type="text/math">
        ${formula}
      </script>`.trim();
    
    let result = [];
    text.split(regularExpression).forEach((s, index) => {
      result.push(caph.replace(s));
      if(latexMatch[index]) {
        const x = latexMatch[index];
        const mode = getDisplay(x);
        let formula = caph.replace(stripDollars(x));
        const block = parser(formula, mode);
        result.push(block);
      }
    });
    return result.join('');
  }
}

window.caph_requirements = window.caph_requirements||[];
var caph = new ResourcesLoader(window.caph_requirements);
delete window.caph_requirements;
window.html = htm.bind(preact.createElement);

caph.components.selfClosing = ({htmlTag, ...props})=>{
  return preact.createElement(htmlTag, props);
};


caph.scroll = new class {
  constructor(){
    // restore previous scroll position if available
    window.addEventListener('keydown', (e)=>{
      if (e.keyCode == 116) this.save_scroll_position(); // F5 key
    });
  }
  save_scroll_position(){
    window.localStorage.setItem('scrollX', ''+window.scrollX);
    window.localStorage.setItem('scrollY', ''+window.scrollY);
  }
  load_scroll_position(){
    let scrollX = parseInt(window.localStorage.getItem('scrollX'));
    let scrollY = parseInt(window.localStorage.getItem('scrollY'));
    window.scrollBy(scrollX-window.scrollX, scrollY-window.scrollY);
  }
  load_href_scroll_position(){
    let href =  window.location.href;
    if (href.indexOf('startAt') != -1 ) {
      let match = href.split('?')[1].split("&")[0].split("=");
      document.getElementsByTagName("body")[0].scrollTop = match[1];
    }
  }
  async initial_scroll(ms=200, ms_stable=3000){
    // scrolls to last saved scroll position every ms until the
    // document height is stable for at least ms_stable
    // fights scroll unstability after each visible plugin loads 
    let t=0, h, prevh, initialh;
    do{
      prevh=initialh=document.body.scrollHeight;
      for(let t=0; t<ms_stable; t+=ms){
        await sleep(ms);
        h = document.body.scrollHeight;
        if(h!=prevh){ prevh=h; this.load_scroll_position();}
      }
    } while(prevh!=initialh);
  }
}

caph.components.math = ({children, mode='inline'})=>{
  const formula = (x=>(Array.isArray(x)?x.join(''):x))(children);
  const htmlFormula = katex.renderToString(formula, {
    displayMode: mode=='block',
    throwOnError: false,
  });
  return html([caph.replace(htmlFormula)]);
};


caph.scroll = new class {
  constructor(){
    // restore previous scroll position if available
    window.addEventListener('keydown', (e)=>{
      if (e.keyCode == 116) this.save_scroll_position(); // F5 key
    });
  }
  save_scroll_position(){
    window.localStorage.setItem('scrollX', ''+window.scrollX);
    window.localStorage.setItem('scrollY', ''+window.scrollY);
  }
  load_scroll_position(){
    let scrollX = parseInt(window.localStorage.getItem('scrollX'));
    let scrollY = parseInt(window.localStorage.getItem('scrollY'));
    window.scrollBy(scrollX-window.scrollX, scrollY-window.scrollY);
  }
  load_href_scroll_position(){
    let href =  window.location.href;
    if (href.indexOf('startAt') != -1 ) {
      let match = href.split('?')[1].split("&")[0].split("=");
      document.getElementsByTagName("body")[0].scrollTop = match[1];
    }
  }
  async initial_scroll(ms=200, ms_stable=3000){
    // scrolls to last saved scroll position every ms until the
    // document height is stable for at least ms_stable
    // fights scroll unstability after each visible plugin loads 
    let t=0, h, prevh, initialh;
    do{
      prevh=initialh=document.body.scrollHeight;
      for(let t=0; t<ms_stable; t+=ms){
        await sleep(ms);
        h = document.body.scrollHeight;
        if(h!=prevh){ prevh=h; this.load_scroll_position();}
      }
    } while(prevh!=initialh);
  }
}