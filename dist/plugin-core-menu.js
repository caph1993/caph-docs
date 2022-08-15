
caph.attach(...JSON.parse(LZUTF8.decompress("W3sicmVmIjoiY2FwaC1kb2NzL3BsdWdpbnMvY29yZS1tZW51ygouY3NzIiwiY29udGVudCI6IiPFN8Qbe1xuICBkaXNwbGF5OiBmbGV4O8QSxAktZGlyZWN0aW9uOiBjb2x1bW7FG3Bvc2nGFWZpeGVkxRR0b3A6IDAuM3JlbcUQcmlnaHTNEnotaW5kZXg6IDEwMDAwxRNvcGFjaXR5OiDGD2JhY2tncm91bmQtY29sb3I6ICNlZWXGc2FkZGluZ8RRMchRYm9yZGVyLXJhZGl1czogyGp9XG7qAN06aG92ZXIsIMoSLnNob3du5QD1yX8xx1B4LXNoYWRvdzogMHB4xQQ1xwhyZ2JhKDAsxQIuNzUpxGggXG5cbkBtZWRpYSBwcmludCDFVsprxQ/rAVxub27mAM595QCmIn1d", {inputEncoding: 'Base64'})));
caph.pluginDefs[caph.currentSrc] = new class extends caph.Plugin {

  async loader() {
    await caph.load('caph-docs/plugins/core-menu/core-menu.css');
  }

  Component({ }) {
    const [_, setTrigger] = preact.useState(null);
    caph.listenToGlobal('caph-menu-option', setTrigger);
    caph.listenToGlobal('caph-menu-options', setTrigger);
    const _class = caph.menu.option == 'Default' ? '' : 'shown';
    return caph.parse`
      <select id="caph-menu" class=${_class} value=${caph.menu.option}
        onchange=${(e) => caph.menu.setOption(e.target.value)}>
        ${caph.menu.options.map(s => caph.parse`
          <option value=${s}>${s}</option>
        `)}
      </select>`;
  }

  // async menuLoader({ addOption }) {
  //   const { setItem, getItem } = caph.preact.useContext(caph.contexts.storage);
  //   addOption('Day / Night', {
  //     onEnter: () => setItem('darkTheme', !getItem('darkTheme')),
  //     hold: false,
  //   });
  // }

}
