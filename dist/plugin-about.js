
caph.attach(...JSON.parse(LZUTF8.decompress("W3sicmVmIjoiY2FwaC1kb2NzL3BsdWdpbnMvYWJvdXTGBi5jc3MiLCJjb250ZW50IjoiXG4uxTHFHi1vdXRlcntcbiAgYmFja2dyb3VuZDogdmFyKC0tyhItZW1wdHkpO8goZHJvcC1maWx0ZXI6IGJsdXIoNHB4xh9wYWRkaW5nOiAzdmggMGVtO1xufc5zaW5ux3NtYXgtd2lkdGg6IGNhbGMoODB2dyAtIDJlbcZMxCBoZWlnaHTHITkwdmggLSA1LjXII292ZXJmbG93LXk6IGF1dG/FFWNvbG9y6ADGdGV4dOoAuvgA4shxcmdpbjrJSekAzTHEcuQAmSA0xgjGUW9yZGVyLXJhZGl1czogMccXZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgYXJpYWzkARAifV0=", {inputEncoding: 'Base64'})));
caph.plugins.about = new class extends caph.Plugin {
  Component() {
    const { option } = preact.useContext(caph.contexts.menu);
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
  async loader() {
    await caph.load('caph-docs/plugins/about/about.css');
  }
  menuSettings() {
    const { addOption } = preact.useContext(caph.contexts.menu);
    addOption('About', { hold: true });
  }
}