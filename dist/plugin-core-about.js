
caph._scriptLoader.attach(...JSON.parse(LZUTF8.decompress("W3sicmVmIjoiY2FwaC1kb2NzL3BsdWdpbnMvY29yZS1hYm91dMsLLmNzcyIsImNvbnRlbnQiOiJcbi7FO8UeLW91dGVye1xuICAvKiBiYWNrZ3JvdW5kOiB2YXIoLS3KEi1lbXB0eSk7ICovxC7EGWRyb3AtZmlsdGVyOiBibHVyKDRweCk7xB9wYWRkaW5nOiAzdmggMGVtO1xufc55aW5ux3ltYXgtd2lkdGg6IGNhbGMoODB2dyAtIDJlbcZMxCBoZWlnaHTHITkwdmggLSA1LjXII292ZXJmbG93LXk6IGF1dG/FFWNvbG/lAJlhY2vFEewA33doaXRlx19yZ2luOsk36QC7McRg5ACHIDTGCMZFb3JkZXItcmFkaXVzOiAxxxdmb250LWZhbWlseTogbW9ub3NwYWNlLCBhcmlhbOQA/iJ9XQ==", {inputEncoding: 'Base64'})));
caph.pluginDefs[caph.currentSrc] = async ()=>{

  caph.menu.addOption('About', { hold: true });
  await caph.load('caph-docs/plugins/core-about/core-about.css');

  return ({})=>{
    const [_, setTrigger] = preact.useState(null);
    caph.listenToEvent('caph-menu-option', setTrigger);
    const _class = caph.menu.option == 'About' ? 'caph-fullscreen-layer caph-about-outer' : 'caph-hidden';
    return caph.parse`
      <div class=${_class}>
        <div class="caph-box-shadow caph-about-inner">
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
