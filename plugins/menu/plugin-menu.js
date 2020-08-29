caph.plugins.menu = new class extends caph.Plugin{
  loadInline=false;
  render(){
    const {options, setOption, option} = preact.useContext(caph.contexts.menu);
    const _class = option=='Default'?'':'shown';
    return html`
      <select id="caph-menu" class=${_class} value=${option}
      onchange=${(e)=>setOption(e.target.value)}>
      ${options.map(s=>html`
        <option value=${s}>${s}</option>
      `)}
      </select>`;
  }
  async loader(){
    await caph.load('caph-docs/plugins/menu/menu.css');
  }
  menuSettings(){
    const {setItem, getItem} = preact.useContext(caph.contexts.storage);
    const {addOption} = preact.useContext(caph.contexts.menu);
    addOption('Day / Night', {
      onEnter:()=>setItem('darkTheme', !getItem('darkTheme')),
      hold: false,
    });
  }
}
