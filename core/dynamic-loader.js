
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
        for(let k in props) if(k.startsWith('data-')){
          let value = props[k];
          delete props[k];
          props[k.slice(5)] = value.length?value:'true';
        }
        delete props['tag'];
        type = component;
      }
      return preact.h(type, props, children);
    }
    let dataParser = htm.bind(hDataTag);
    let innerHtml = rootElement.innerHTML;
    let vdom = dataParser([innerHtml]);
    preact.render(vdom, rootElement);
    this.setReady();
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
}

window.caph_requirements = window.caph_requirements||[];
var caph = new ResourcesLoader(window.caph_requirements);
delete window.caph_requirements;

caph.components.math = ({children, mode='inline'})=>{
  let script = (x=>(Array.isArray(x)?x.join(''):x))(children);
  let formula = eval(script);
  let s = katex.renderToString(formula, {displayMode: mode=='block'});
  return html([s]);
}