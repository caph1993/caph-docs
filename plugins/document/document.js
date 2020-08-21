// htm syntax

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

caph.components.document = caph.makePlugin({
  component: (props)=>{
    return html`
    <div id="caph-root" class=${props.class}>
      ${props.children}
    </div>`
  },
  loader: async({theme})=>{
    await caph.load('caph-docs/plugins/document/document.css');
    caph.menu.pushOption('PDF print', {
      show:()=>{window.print(); caph.menu.onSelect();},
    });
    return;
  },
  post_loader: async({theme})=>{
    let main = await MyPromise.until(()=>
      document.querySelector('#caph-root')
    );
    await caph.load('caph-docs/plugins/document/Hyphenator.min.js');
    caph.scroll.initial_scroll();
    return;
  },
});
