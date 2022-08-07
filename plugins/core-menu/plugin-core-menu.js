caph.plugins['core-menu'] = new class extends caph.Plugin {

  async loader() {
    await caph.load('caph-docs/plugins/core-menu/core-menu.css');
  }

  Component({ }) {
    const menu = preact.useContext(caph.contexts['core-menu']);
    const _class = menu.option == 'Default' ? '' : 'shown';
    return caph.parse`
      <select id="caph-menu" class=${_class} value=${menu.option}
        onchange=${(e) => menu.setOption(e.target.value)}>
        ${menu.options.map(s => caph.parse`
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
