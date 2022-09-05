caph.pluginDefs[caph.currentSrc] = new class extends caph.Plugin {

  Component({ children, class: _class, plugins = "" }) {
    preact.useEffect(async () => {
      const menu = await caph.until(() => preact.useContext(caph.contexts['core-menu']));
      menu.addOption('PDF print', {
        onEnter: () => {
          const loc = window.location;
          let url = loc.href.slice(0, -loc.hash.length);
          open(url + (loc.search.length ? '&' : '?') + 'print-pdf');
          menu.setOption('Default');
        },
      });
    }, []);
    _class = `${_class || ''} reveal`;
    return html`
    ${plugins.split(' ').map(tag => html`<${caph.Plugin.component(tag)}/>`)}
    <div id='caph-body' class=${_class}>
      <div class="slides">
        ${children}
      </div>
    </div>
  `}

  async loader({ marp = true }) {
    await caph.load('caph-docs/libraries/reveal.js-3.6.0/reveal.js');
    await caph.load('caph-docs/libraries/reveal.js/dist/reveal.css');
    if (marp) await caph.load('caph-docs/plugins/slides/marp.css');
    if (marp) caph.loadFont('lmroman'); // don't await
    else await caph.load('caph-docs/libraries/reveal.js/dist/theme/simple.css');
    await caph.load('caph-docs/libraries/reveal.js/plugin/notes/notes.js');
    post_loader();
  }

  async post_loader({ options }) {
    let print = (
      window.location.href.indexOf('?print-pdf') != -1
      || window.location.href.indexOf('&print-pdf') != -1
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
    if (print) {
      options.width = options.height = '100%';
      center = true;
    }

    await caph.until(() =>
      document.querySelector('.reveal')
      && document.querySelector('.slides')
    );

    Reveal.initialize(options);
    await caph.until(() => Reveal.isReady());

    if (print) pdfPrint();
    return;
  }

  async pdfPrint() {
    await caph.ready();

    await caph.sleep(1500); // all plugins

    // Force pages to max height
    await caph.until(() => document.querySelector('.pdf-page'));
    let pageHeight = 1e5, pageWidth = 1e5;
    for (const elem of document.querySelectorAll('.pdf-page')) {
      pageHeight = Math.min(pageHeight, elem.clientHeight);
      pageWidth = Math.min(pageWidth, elem.clientWidth);
    }
    for (const elem of document.querySelectorAll('.pdf-page')) {
      if (elem.clientHeight == pageHeight) continue;
      elem.style.cssText = `height: ${pageHeight}px;`;
      await caph.until(() => elem.clientHeight == pageHeight);
    }

    const maxHeight = pageHeight * 0.9;
    const maxWidth = pageWidth;
    let i = 1;
    for (const section of document.querySelectorAll('section')) {
      let scale = section.getAttribute('data-pdfScale') || 0;
      if (scale == 0) {
        const currHeight = section.scrollHeight;
        const currWidth = section.scrollWidth;
        scale = 1;
        scale = Math.min(scale, maxHeight / currHeight);
        scale = Math.min(scale, maxWidth / currWidth);
      }
      if (scale < 1) {
        console.log(`Slide #${i} scaled by ${scale}.`);
        const top = (maxHeight - section.clientHeight) / 2;
        const left = (maxWidth - section.clientWidth) / 2;
        section.style.transformOrigin = `center`;
        section.style.setProperty('transform', `scale(${scale})`, 'important');
        section.style.cssText += `top: ${top}px;`;
        section.style.cssText += `left: ${left}px;`;
      }
      i++;
    }
    await caph.sleep(100);
    if (confirm('Export as PDF?')) window.print();
  }
};
