// htm syntax

const CaphSlides = caph.makePlugin({
  component: ({children, defaultTheme})=>{
    return html`
    <div class="reveal">
      <div class="slides">
        ${children}
      </div>
    </div>
  `},
  loader: async({defaultTheme})=>{
    await caph.load('caph-docs/reveal.js/dist/reveal.js');
    await caph.load('caph-docs/reveal.js/dist/reveal.css');
    if(defaultTheme) caph.load('caph-docs/core/marp.css');
    await caph.load('caph-docs/reveal.js/plugin/notes/notes.js');
    await caph.load('caph-docs/reveal.js/plugin/markdown/markdown.js');
    await caph.load('caph-docs/reveal.js/plugin/highlight/highlight.js');

    if(!document.getElementById('theme')){
      await caph.load('caph-docs/reveal.js/dist/theme/simple.css', {
        id: 'theme',
        parent: caph.head_sources,
      });
    }
    if(!document.getElementById('highlight-theme')){
      await caph.load('caph-docs/reveal.js/plugin/highlight/monokai.css',{
        id: 'highlight-theme',
        parent: caph.head_sources,
      });
    }
    
    await caph.load('caph-docs/slides-core.css',{
      parent: caph.head_sources,
    });
    return;
  },
  post_loader: async({reveal_options})=>{
    let print = (window.location.href.indexOf('?print-pdf')!=-1);
    let options = MyObject.deep_assign({
      progress: true,
      slideNumber: 'c/t',
      history: true,
      //center: true,
      //width: '100%', height: '100%',
      hash: true,
      transition: 'none', // none/fade/slide/convex/concave/zoom
      //plugins: [ RevealMarkdown, RevealHighlight, RevealNotes ],
      keyboard: {
        // Check codes here https://keycode.info/
        //87: ()=> this.set_menu_option('Whiteboard'),// W key
        //27: ()=> this.set_menu_option('Default'),// esc key
      }
    }, reveal_options);
    if(print){
      options.width=options.height='100%';
      center=true;
    }

    await MyPromise.until(()=>
      document.querySelector('.reveal')
      && document.querySelector('.slides')
    );
    Reveal.initialize(options);
    await MyPromise.until(()=>Reveal.isReady());
    if(print) window.print();
    caph.menu.pushOption('PDF print', {
      show:()=>{
        let loc = window.location;
        open(loc.href.slice(0,-loc.hash.length)+'?print-pdf');
        caph.menu.onSelect();
      },
    });
    return;
  }
});


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

const CaphDocument = caph.makePlugin({
  component: (props)=>{
    return html`
    <div id="caph-body" class=${props.class}>
      ${props.children}
    </div>`
  },
  loader: async({theme})=>{
    await caph.load('caph-docs/core/document.css');
    caph.menu.pushOption('PDF print', {
      show:()=>{window.print(); caph.menu.onSelect();},
    });
    return;
  },
  post_loader: async({theme})=>{
    let main = await MyPromise.until(()=>
      document.querySelector('#caph-body')
    );
    await caph.load('caph-docs/core/hyphenator.min.js');
    caph.scroll.initial_scroll();
    return;
  },
});


const MathJaxSvg = caph.makePlugin({
  component: ({children})=>{
    return html`${children}`;
  },
  loader: async()=>{
    window.MathJax = MyObject.deep_assign({
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        macros:{ RR: "{\\mathbb R}", }
      },
      svg: {fontCache: 'local', exFactor: 1.0, scale: 0.9,},
    }, window.MathJax||{});
  },
  post_loader: async()=>{
    if(window.Reveal) await MyPromise.until(()=>Reveal.isReady());
    await caph.load('caph-docs/libraries/mathjax2svg/tex-svg.js', {
      id: 'MathJax-script',
    });
  },
});

