// htm syntax

caph.components.slides = caph.makePlugin({
  component: ({children})=>{
    return html`
    <div class="reveal">
      <div class="slides">
        ${children}
      </div>
    </div>
  `},
  loader: async({options, marp=true})=>{
    await caph.load('caph-docs/libraries/reveal.js/dist/reveal.js');
    await caph.load('caph-docs/libraries/reveal.js/dist/reveal.css');
    if(marp) await caph.load('caph-docs/plugins/slides/marp.css');
    else await caph.load('caph-docs/libraries/reveal.js/dist/theme/simple.css');
    await caph.load('caph-docs/libraries/reveal.js/plugin/notes/notes.js');
    return;
  },
  post_loader: async({options})=>{
    let print = (window.location.href.indexOf('?print-pdf')!=-1);
    options = MyObject.deep_assign({
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
    }, options);
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
    if(print) caph.ready().then(()=>setTimeout(window.print, 1500));
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
