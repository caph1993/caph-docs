
caph.attach(...JSON.parse(LZUTF8.decompress("W3sicmVmIjoiY2FwaC1kb2NzL3BsdWdpbnMvZG9jdW1lbnTJCS5jc3MiLCJjb250ZW50IjoiXG4uyDfFIS1wYXJlbnR7XG4gIGJhY2tncm91bmQ6IHZhcigtLcoSLTIpO8QkY29sb3LIH3RleHTGF2ZvbnQtZmFtaWx5OiBzZXJpZsUXcGFkZGluZy1ib3R0b206IGNhbGMoNTB2aCAtIDVlbcY8yCV0b3A6IDNlbTtcbn3wAKflAKDNZUxhdGluIE1vZGVybiBSb21hbiwgQ29tcHV0ZXLPF+oAkPwA4usAyXNpemU6IDEuMnLlAI4gIG1hcmdpbjogYXV0b+wAtDrkAMb4AMXEN3gtd2lkdGg6IDMwxxRib3gtc2hhZG93OiAwcHjFBDHGCMUg5AFULWFsaWduOiBqdXN0aWZ55gERQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAoy2U2MDBweCkg5QEt8wFA6wC3MC7oALnoAN3mALowLjLLGMlZ5QG4MTAwdncgLSAy6AG5fewAmHByaW5023vGZjogaW5pdGlhbMdk6QCRzhfLe84Z7AHBzxrrAVjMGn3yAJLnAvTmAK3aVOYA31xuaDEsIGgye/IC++QDFMQmcHJlxUtkaXNwbGF5xEZsaW5l7wJyLc1AyxhwcmXtAwk6IDBlbeQBiugBo2JvcmRlci1yYWRpdXPqAaR9O+QAni8qLmthdGV4eyBmaWx0ZXI6IOQD7XJhc3QoMTMwJeQAoiovxCl0YWJs5gCo7gHxyGbHFugDq8gZ5QEDxTwgdHI6bnRoLWNoaWxkKGV2ZW4p7wQ36ADjIzjFATEwxkDJPmhvdmVy3jQ0yDRkLmNlbnTHL+wDFcYXxyZo3ybsAIBoz3o6ICNmxQHyBNltYXJwLWJsdecBmesEFTAuOe4BlugBMOQDxHNvbGlkICMwMOUAxSDJemTmAmvaMmRkZMxU5QGabm/lAkPkBQtuby1wYWdlLWJyZWFrxkzKEC1pbnNpZGU6IGF2b2nER8Qy2y9iZWZvcsQvbHdheXPGMGNhbnZhc99Z6QFL3yjEKFxuLmYxe+4BOTjkAlHkAzAuZjLPGzfJGjPPGjXKNTTPGzTJGjXPGuUDOsYbNs8bMcgaaM4aMS4xNzbJN2jOUjEuNDI4Nskd7gCJMS44MTjkA5LGHe4AwcoY7gDzMusApGjuASnkBj3EGFxuIn1d", {inputEncoding: 'Base64'})));
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
