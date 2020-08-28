caph.plugins.slides = new class extends caph.Plugin {
  render({children, options}){
    return html`
    <div class="reveal">
      <div class="slides">
        ${children}
      </div>
    </div>
  `}

  async loader({marp=true}){
    await caph.load('caph-docs/libraries/reveal.js/dist/reveal.js');
    await caph.load('caph-docs/libraries/reveal.js/dist/reveal.css');
    if(marp) await caph.load('caph-docs/plugins/slides/marp.css');
    else await caph.load('caph-docs/libraries/reveal.js/dist/theme/simple.css');
    await caph.load('caph-docs/libraries/reveal.js/plugin/notes/notes.js');
    return;
  }

  async post_loader({options}){
    let print = (
      window.location.href.indexOf('?print-pdf')!=-1
      || window.location.href.indexOf('&print-pdf')!=-1
    );
    options = MyObject.deep_assign({
      progress: true,
      slideNumber: 'c/t',
      history: true,
      //center: true,
      //width: '100%',
      height: '100%',
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

    if(print)(async ()=>{
      await caph.ready();

      await sleep(1500); // all plugins

      // Force pages to max height
      await MyPromise.until(()=>document.querySelector('.pdf-page'));
      let pageHeight = 1e5, pageWidth = 1e5;
      for(const elem of document.querySelectorAll('.pdf-page')){
        pageHeight = Math.min(pageHeight, elem.clientHeight);
        pageWidth = Math.min(pageWidth, elem.clientWidth);
      }
      for(const elem of document.querySelectorAll('.pdf-page')){
        if(elem.clientHeight==pageHeight) continue;
        elem.style.cssText = `height: ${pageHeight}px;`;
        await MyPromise.until(()=>elem.clientHeight==pageHeight);
      }

      const maxHeight=pageHeight*0.9;
      const maxWidth=pageWidth;
      let i=1;
      for(const section of document.querySelectorAll('section')){
        let scale = section.getAttribute('data-pdfScale')||0;
        if(scale==0){
          const currHeight=section.scrollHeight;
          const currWidth=section.scrollWidth;
          scale = 1;
          scale = Math.min(scale, maxHeight/currHeight);
          scale = Math.min(scale, maxWidth/currWidth);
        }  
        if(scale < 1){
          console.log(`Slide #${i} scaled by ${scale}.`);
          const top = (maxHeight-section.clientHeight)/2;
          const left = (maxWidth-section.clientWidth)/2;
          section.style.transformOrigin = `center`;
          section.style.setProperty('transform', `scale(${scale})`, 'important');
          section.style.cssText += `top: ${top}px;`;
          section.style.cssText += `left: ${left}px;`;
        }
        i++;
      }
      caph.scroll.initial_scroll();
      await sleep(100);
      if(confirm('Export as PDF?'))window.print();
    })();
    caph.menu.pushOption('PDF print', {
      show:()=>{
        const loc = window.location;
        let url = loc.href.slice(0,-loc.hash.length);
        open(url+(loc.search.length?'&':'?')+'print-pdf');
        caph.menu.onSelect();
      },
    });
    return;
  }
};
