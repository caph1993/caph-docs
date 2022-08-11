caph.plugins.document = new class extends caph.Plugin {
  async loader() {
    caph.loadFont('official-lmroman');
    await caph.load('caph-docs/plugins/document/document.css');
    return;
  }

  Component({ children }) {
    preact.useEffect(async () => {
      const menu = await MyPromise.until(() => preact.useContext(caph.contexts['core-menu']));
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
