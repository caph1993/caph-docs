
caph.menu = new class{
  options = [];
  constructor(){
    this.elem = MyDocument.createElement('select',{
      id: 'caph-menu',
      classList: ['caph-menu'],
    });
    window.addEventListener('load', ()=>{
      document.body.insertAdjacentElement('afterbegin', this.elem);
    });
    this.pushOption('Default', {
      show:()=>{this.elem.classList.remove('caph-menu-shown'); },
      hide:()=>{this.elem.classList.add('caph-menu-shown'); },
    });
    this.elem.addEventListener('change', (e)=>{
      this.onSelect(this.elem.value);
    });
    this.create_about();
  }

  pushOption(text, {show=()=>null, hide=()=>null}={}){
    let element = MyDocument.createElement('option',{
      text, value:text, parent: this.elem, where: 'beforeend',
    });
    this.options.push({text, show, hide, element});
    if(this.options.length>1){
      this.elem.classList.add('caph-menu-multiple');
    }
    this.onSelect(this.elem.value);
  }

  onSelect(selected='Default'){
    if(!this.elem) return console.warn('Cannot switch. Menu not loaded');
    this.elem.value=selected;
    this.options.forEach(({text, show, hide})=>{
      if(text==selected) show();
      else hide();
    });
  }
  create_about(){
    window.addEventListener('load', ()=>{
      let about = MyDocument.createElement('div',{
        classList: ['fullscreen-layer', 'about-outer' ,'hidden'],
        parent: document.body,
        where: 'afterend',
        html: `
        <div class="box-shadow about-inner">
          <h1>Caph-docs</h1>
          <p>A library for writing HTML documents and slides that look nice, are editable in plain-text and can be exported to standalone HTML files, so that they can be opened in a browser by anyone, anywhere, except IE broswer (LoL).</p>
          <p>It supports several plugins, including math, diagrams, charts, images, code snippets and a whiteboard. We encourage HTML+css over markdown and other document languages because HTML+css is universal and flexible. You will never regret about learning HTML+css.</p>
          <h3>Author</h3>
          <p>This software was developed by Carlos Pinzón (caph1993), Colombia.</p>
          <p>www.caph.info</p>
          <h3>License</h3>
          <p>Will be open source once it's ready...</p>
        </div>
        `
      });
      this.pushOption('About', {
        show:()=>{ about.classList.remove('hidden'); },
        hide:()=>{ about.classList.add('hidden'); },
      });
    });
  }
}
