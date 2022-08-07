caph.plugins['menu'] = new class extends caph.Plugin {
  Component({ }) {
    const { options, setOption, option } = caph.preact.useContext(caph.contexts.menu);
    const _class = option == 'Default' ? '' : 'shown';
    return caph.parse`
      <select id="caph-menu" class=${_class} value=${option}
        onchange=${(e) => setOption(e.target.value)}>
        ${options.map(s => caph.parse`
          <option value=${s}>${s}</option>
        `)}
      </select>`;
  }

  async loader() {
    await caph.load('caph-docs/plugins/menu/menu.css');
  }

  async menuLoader({ addOption }) {
    const { setItem, getItem } = caph.preact.useContext(caph.contexts.storage);
    addOption('Day / Night', {
      onEnter: () => setItem('darkTheme', !getItem('darkTheme')),
      hold: false,
    });
  }

}
