// htm syntax

caph.plugins.document = new class extends caph.Plugin{
  render({children, class:_class}){
    return html`
    <div id="caph-root" class=${_class}>
      ${children}
    </div>`
  }
  async loader({}){
    await caph.load('caph-docs/plugins/document/document.css');
    caph.menu.pushOption('Dark / Light', {
      show:()=>{ caph.setTheme(); caph.menu.onSelect(); },
    });
    caph.menu.pushOption('PDF print', {
      show:()=>{ window.print(); caph.menu.onSelect(); },
    });
    return;
  }
  async post_loader({}){
    let main = await MyPromise.until(()=>
      document.querySelector('#caph-root')
    );
    await caph.load('caph-docs/libraries/Hyphenator-5.3.0/Hyphenator.min.js');
    caph.scroll.initial_scroll();
    return;
  }
};
