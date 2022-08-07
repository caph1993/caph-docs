caph.plugins.about = new class extends caph.Plugin {

  async loader() {
    await caph.load('caph-docs/plugins/core-about/core-about.css');
  }

  Component() {
    preact.useEffect(() => {
      const { addOption } = preact.useContext(caph.contexts['core-menu']);
      addOption('About', { hold: true });
    }, [])

    const { option } = preact.useContext(caph.contexts['core-menu']);
    const _class = option == 'About' ? 'fullscreen-layer caph-about-outer' : 'hidden';
    return caph.parse`
      <div class=${_class}>
        <div class="box-shadow caph-about-inner">
          <h1>Caph-docs</h1>
          <p>A library for writing HTML documents and slides that look nice, are editable in plain-text and can be exported to standalone HTML files, so that they can be opened in a browser by anyone, anywhere, except IE broswer (LoL).</p>
          <p>It supports several plugins, including math, diagrams, charts, images, code snippets and a whiteboard. We encourage HTML+css over markdown and other document languages because HTML+css is universal and flexible. You will never regret about learning HTML+css.</p>
          <h3>Author</h3>
          <p>This software was developed by Carlos Pinzón (caph1993), Colombia.</p>
          <p>www.caph.info</p>
          <h3>License</h3>
          <p>Will be open source once it's ready...</p>
        </div>
      </div>`;
  }

}
