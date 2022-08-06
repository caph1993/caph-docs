caph.plugins.document = new class extends caph.Plugin {
  Component({ children }) {
    return caph.parse`
      <div class="caph-document-parent">
        <div class="caph-document">
          ${children}
        </div>
      </div>`;
  }
  async loader() {
    await caph.load('caph-docs/plugins/document/document.css');
    caph.loadFont('lmroman');
    return;
  }
  menuSettings() {
    const { addOption, setOption } = preact.useContext(caph.contexts.menu);
    addOption('PDF print', {
      onEnter: () => { window.print(); setOption('Default'); },
    });
  }
};
