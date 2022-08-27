//@ts-check
/// <reference path="types.js" />
/// <reference path="utils.js" />
/// <reference path="preact-parser.js" />


__caph_definitions__.preactGlobals = new class {

  parser = __caph_definitions__.preactParser;
  contexts = {};

  constructor(){
    this.contexts['core-menu'] = preact.createContext();
    const parent = this;
    this.menu = new class {
      constructor() {
        this.addOption('Default', { hold: true });
        this.latest = this.option = 'Default';
      }
      options = [];
      onEnter = {};
      onExit = {};
      hold = {};

      /**
       * @param {string} option
       * @param {{
       *  onEnter?:()=>void,
       *  onExit?:()=>void,
       *  hold?:boolean,
       * }} [options]
      */
      addOption(option, { onEnter, onExit, hold } = {}) {
        this.onEnter[option] = onEnter;
        this.onExit[option] = onExit;
        this.hold[option] = hold;
        if (this.options[option]) return;
        this.options.push(option);
        this.options[option] = 1;
        parent.dispatchGlobal('caph-menu-options', Math.random());
      }
      setOption(option) {
        parent.dispatchGlobal('caph-menu-option', Math.random());
        if (this.hold[option]) {
          this.onExit[this.latest] && this.onExit[this.latest]();
          this.latest = this.option;
          this.option = option;
        }
        this.onEnter[option] && this.onEnter[option]();
      }
    };

    async function inject(vDom) {
      // const node = MyDocument.createElement('div', {
      //   parent: document.body,
      //   where: 'afterbegin',
      //   id: 'core-body',
      // })
      const node = document.body;
      preact.render(vDom, node);
    }

    MyPromise.until(() => document.body).then(()=>{
      inject(this.parser.parse`
        <${this.parser.plugin('core-menu')}/>
        <${this.parser.plugin('core-about')}/>
      `);
    });
  }

  /**
   * @param {string} eventName 
   * @param {(data:any)=>void} callback 
   */
  listenToEvent(eventName, callback) {
    preact.useEffect(() => {
      const actualCallback = (/** @type {Event|CustomEvent}*/ e) => {
        //@ts-ignore: event.detail is not defined for non-custom events
        try{callback(e.detail);}
        catch(err){}
      }
      window.addEventListener(eventName, actualCallback);
      return () => {
        window.removeEventListener(eventName, actualCallback);
      }
    }, [eventName, callback]);
  }

  _globals = {};
  dispatchGlobal(eventName, value) {
    this._globals[eventName] = value;
    let event = new CustomEvent(eventName, {detail:value});
    window.dispatchEvent(event);
    return;
  }
  async untilGlobal(eventName) {
    await MyPromise.until(() => this._globals[eventName]);
    await MyPromise.sleep(500);
  }
  listenToGlobal(eventName) {
    const initial = preact.useMemo(()=>this._globals[eventName], [eventName]);
    const [value, setValue] = preact.useState(initial);
    this.listenToEvent(eventName, setValue);
    return value;
  }
}