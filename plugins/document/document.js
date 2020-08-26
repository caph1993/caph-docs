// htm syntax

caph.components.document = caph.makePlugin({
  component: ({children, class:_class})=>{
    return html`
    <div id="caph-root" class=${_class}>
      ${children}
    </div>`
  },
  loader: async({})=>{
    await caph.load('caph-docs/plugins/document/document.css');
    caph.menu.pushOption('PDF print', {
      show:()=>{window.print(); caph.menu.onSelect();},
    });
    return;
  },
  post_loader: async({})=>{
    let main = await MyPromise.until(()=>
      document.querySelector('#caph-root')
    );
    await caph.load('caph-docs/plugins/document/Hyphenator.min.js');
    caph.scroll.initial_scroll();
    return;
  },
});
