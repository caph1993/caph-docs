caph.plugins['menu'] = new class extends caph.Plugin {
  Component({ }) {
    const { options, setOption, option } = preact.useContext(caph.contexts.menu);
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
  menuLoader() {
    const { setItem, getItem } = preact.useContext(caph.contexts.storage);
    const { addOption } = preact.useContext(caph.contexts.menu);
    console.log(addOption)
    addOption('Day / Night', {
      onEnter: () => setItem('darkTheme', !getItem('darkTheme')),
      hold: false,
    });
  }
}
