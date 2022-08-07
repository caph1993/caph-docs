
caph.attach(...JSON.parse(LZUTF8.decompress("W3sicmVmIjoiY2FwaC1kb2NzL3BsdWdpbnMvY29yZS1hYm91dMsLLmNzcyIsImNvbnRlbnQiOiJcbi7FO8UeLW91dGVye1xuICBiYWNrZ3JvdW5kOiB2YXIoLS3KEi1lbXB0eSk7yChkcm9wLWZpbHRlcjogYmx1cig0cHjGH3BhZGRpbmc6IDN2aCAwZW07XG59znNpbm7Hc21heC13aWR0aDogY2FsYyg4MHZ3IC0gMmVtxkzEIGhlaWdodMchOTB2aCAtIDUuNcgjb3ZlcmZsb3cteTogYXV0b8UVY29sb3LoAMZ0ZXh06gC6+ADiyHFyZ2luOslJ6QDNMcRy5ACZIDTGCMZRb3JkZXItcmFkaXVzOiAxxxdmb250LWZhbWlseTogbW9ub3NwYWNlLCBhcmlhbOcBEGhpZGRlbuUBBmRpc3BsYXk6IG5vbmXGH1xuLmJveC1zaGFkb3fFJcoPOiAwcHjGBC4zcmVtIDAuMDXECOcA08kp5ADTxGvLO2jkAS/fUCAwLjLcT2Z1bGxzY3JlZW4tbGF5x0/nAcYxMDAl5QED6AG2yRFwb3NpdGlvbjogZml4ZWTFFHRvcDogMMULbGVmdMgMei1pbmRleMU9xnRcbi8qIC5oYm94e+oBLmZsZXg7IOQAknbUGcQGLWRpcmVjxndjb2x1bW7GMWJveGNlbuQC+SBqdXN0aWZ5LecDIDogxhnGKOUBuC1h5QIh0yvMH8wxYmV0d2VlbtkyxyDGM+QAqHvlAK46IDHGE+cCHOkA0uUCGMUa5gPqLdoh5gKS5wHixAs6IHNvbGlkIDJweOsDEC1zdHJvbmflAdMgKi8ifV0=", {inputEncoding: 'Base64'})));
caph.plugins['core-about'] = new class extends caph.Plugin {

  async loader() {
    await caph.load('caph-docs/plugins/core-about/core-about.css');
  }

  Component() {
    preact.useEffect(async () => {
      const menu = await MyPromise.until(() => preact.useContext(caph.contexts['core-menu']));
      menu.addOption('About', { hold: true });
    }, []);

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
