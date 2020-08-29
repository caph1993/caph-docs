caph.plugins.document = new class extends caph.Plugin{
  render({children, class:_class, plugins=""}){
    return html`
      ${plugins.split(' ').map(tag=>html`<${caph.Plugin.component(tag)}/>`)}
      <div id="caph-body" class=${_class}>
        ${children}
      </div>`;
  }
  async loader({}){
    await caph.load('caph-docs/plugins/document/document.css');
    caph.loadFont('lmroman');
    return;
  }
  menuSettings(){
    const {addOption, setOption} = preact.useContext(caph.contexts.menu);
    addOption('PDF print', {
      onEnter:()=>{ window.print(); setOption('Default'); },
    });
  }
};
