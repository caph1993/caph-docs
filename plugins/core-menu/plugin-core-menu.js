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
