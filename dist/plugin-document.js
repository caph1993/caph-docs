
caph._scriptLoader.attach(...JSON.parse(LZUTF8.decompress("W3sicmVmIjoiY2FwaC1kb2NzL3BsdWdpbnMvZG9jdW1lbnTJCS5jc3MiLCJjb250ZW50IjoiXG4uyDfFIS1wYXJlbnR7XG4gIGJhY2tncm91bmQ6IHZhcigtLcoSLTIpO8QkY29sb3LIH3RleHTGF2ZvbnQtZmFtaWx5OiBzZXJpZsUXcGFkZGluZy1ib3R0b206IGNhbGMoNTB2aCAtIDVlbcY8yCV0b3A6IDNlbTtcbn3wAKflAKDNZUxhdGluIE1vZGVybiBSb21hbiwgQ29tcHV0ZXLPF+oAkPwA4usAyXNpemU6IDEuMnLlAI4gIG1hcmdpbjogYXV0b+wAtDrkAMb4AMXEN3gtd2lkdGg6IDMwxxRib3gtc2hhZG93OiAwcHjFBDHGCMUg5AFULWFsaWduOiBqdXN0aWZ55gERQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAoy2U2MDBweCkg5QEt8wFA6wC3MC7oALnoAN3mALowLjLLGMlZ5QG4MTAwdncgLSAy6AG5fewAmHByaW5023vGZjogaW5pdGlhbMdk6QCRzhfLe84Z7AHBzxrrAVjMGn3yAJLnAvTmAK3aVOYA31xuaDEsIGgye/IC++QDFMQmcHJlxUtkaXNwbGF5xEZsaW5l7wJyLc1AyxhwcmUsICNmMMQC7QMSOiAwZW3kAZPoAaxib3JkZXItcmFkaXVz6gGtfTvkAKcvKi5rYXRleHsgZmlsdGVyOiDkA/ZyYXN0KDEzMCXkAKsqL8QpdGFibOYAse4B+shmxxboA7TIGeUBDMU8IHRyOm50aC1jaGlsZChldmVuKe8EQOgA7CM4xQExMMZAyT5ob3Zlct40NMg0ZC5jZW50xy/sAx7GF8cmaN8m7ACAaM96OiAjZsUB8gTibWFycC1ibHXkAaIwMDgwZDnxBCcwLjnuAZ/oATnkA9Zzb2xpZMQ75QDOIOkAg2TmAn3aMmRkZMxU5QGjbm/lAlXkBR1uby1wYWdlLWJyZWFrxkzKEC1pbnNpZGU6IGF2b2nER8Qy2y9iZWZvcsQvbHdheXPGMGNhbnZhc99Z6QFU3yjEKFxuLmYxe+4BOTjkAlrkA0IuZjLPGzfJGjPPGjXKNTTPGzTJGjXPGuUDQ8YbNs8bMcgaaM4aMS4xNzbJN2jOUjEuNDI4Nskd7gCJMS44MTjkA5vGHe4AwcoY7gDzMusApGjuASnkBk/EGFxuIn1d", {inputEncoding: 'Base64'})));
caph.pluginDefs[caph.currentSrc] = new class extends caph.Plugin {
  async loader() {
    caph.loadFont('lmroman');
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
