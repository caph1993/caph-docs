
caph.attach(...JSON.parse(LZUTF8.decompress("W10=", {inputEncoding: 'Base64'})));

caph.plugins.main = new class extends caph.Plugin{
  loadInline=false;

  loader(){
    caph.contexts={
      storage: preact.createContext({}),
      menu: preact.createContext({menu:null}),
      darkTheme: preact.createContext(false),
    }
  }

  render({children}){
    const menu = this.Menu;
    const [menuWrapper, setMenu] = preact.useState(menu.exposed());
    menu.update=()=>setMenu(menu.exposed());

    const storage = this.Storage;
    const [storageWrapper, setStorage] = preact.useState(storage.exposed());
    storage.update=()=>setStorage(storage.exposed());
    
    return html`
      <div id="caph-root" data-theme=${storage.getItem('darkTheme')?'dark':'light'}>
        <${caph.contexts.storage.Provider} value=${storageWrapper}>
          <${caph.contexts.menu.Provider} value=${menuWrapper}>
            <${caph.Plugin.component('menu')}/>
            <${caph.Plugin.component('about')}/>
            ${children}
          </>
        </>
      </div>`;
  }

  Storage=new class{
    storage={}
    constructor(){
      const st = {...window.localStorage};
      for(let k in st){
        try{ this.storage[k] = JSON.parse(st[k]);}
        catch(err){ }
      }
    }
    setItem(key, value){
      this.storage[key]=value;
      window.localStorage.setItem(key, JSON.stringify(value));
      this.update();
    }
    getItem(key){ return this.storage[key]; }
    update(){throw 'Abstract method'}
    exposed(){
      return {
        storage: this.storage,
        getItem: this.getItem.bind(this),
        setItem: this.setItem.bind(this),
      }
    }
  }
  
  Menu=new class{
    option=null;
    latest=null;
    options=[];
    onEnter={};
    onExit={};
    hold={};
    _options={};
    constructor(){
      this.addOption('Default', {hold:true});
      this.latest=this.option='Default';
    }
    addOption(option, {onEnter, onExit, hold}={}){
      this.onEnter[option]=onEnter;
      this.onExit[option]=onExit;
      this.hold[option]=hold;
      if(this.options[option]) return;
      this.options.push(option);
      this.options[option]=1;
      if(this.option) this.update();
    }
    setOption(option){
      if(this.hold[option]){
        this.onExit[this.latest]&&this.onExit[this.latest]();
        this.latest=this.option;
        this.option=option;
        this.update();
      }
      this.onEnter[option]&&this.onEnter[option]();
    }
    update(){throw 'Abstract method'}
    exposed(){
      return {
        option: this.option,
        options: this.options,
        addOption: this.addOption.bind(this),
        setOption: this.setOption.bind(this),
      }
    }
  }
};
