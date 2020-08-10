
class ResourcesLoader{

  plugins = {};
  _attachments=[];
  _loadStatus = {};

  setReady;
  _ready = new Promise((setter, _)=>this.setReady=setter);
  ready = ()=>this._ready;

  _required = [
    {ref: 'caph-docs/core/core.css',},
    {ref: 'caph-docs/core/menu.js',},
    {ref: 'caph-docs/core/elements.js',},
    {ref: 'caph-docs/core/document.css',},
    {ref: 'caph-docs/core/marp.css',},
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
          afterReady: false,
        });
      }
      this.setReady();
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
      auto_attrs=true, afterReady=true}={}){
    // Load an external script or style by inserting relative to parent
    if(afterReady) await this.ready();
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
      setTimeout(()=>done||_err(['Timeout (3s) loading source:', e]), 3000);
    });
  };
}

window.caph_requirements = window.caph_requirements||[];
var caph = new ResourcesLoader(window.caph_requirements);
delete window.caph_requirements;

caph.makePlugin = ({component, loader=null, post_loader=null})=>{
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
