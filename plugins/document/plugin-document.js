caph.plugins.document = new class extends caph.Plugin {
  async loader() {
    await caph.load('caph-docs/plugins/document/document.css');
    caph.loadFont('lmroman');
    return;
  }

  Component({ children }) {
    preact.useEffect(() => {
      const menu = preact.useContext(caph.contexts['core-menu']);
      menu.addOption('PDF print', {
        onEnter: () => { window.print(); menu.setOption('Default'); },
      });
    }, [])
    return caph.parse`
      <div class="caph-document-parent">
        <div class="caph-document">
          ${children}
        </div>
      </div>`;
  }
};
