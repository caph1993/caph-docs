
caph.attach(...JSON.parse(LZUTF8.decompress("W3sicmVmIjoiY2FwaC1kb2NzL3BsdWdpbnMvbWVudcUFLmNzcyIsImNvbnRlbnQiOiIjxS3EG3tcbiAgZGlzcGxheTogZmxleDvEEsQJLWRpcmVjdGlvbjogY29sdW1uxRtwb3NpxhVmaXhlZMUUdG9wOiAwLjNyZW3FEHJpZ2h0zRJ6LWluZGV4OiAxMDAwMMUTb3BhY2l0eTogxg9iYWNrZ3JvdW5kLWNvbG9yOiAjZWVlxnNhZGRpbmfEUTHIUWJvcmRlci1yYWRpdXM6IMhqfVxu6gDdOmhvdmVyLCDKEi5zaG93buUA9cl/McdQeC1zaGFkb3c6IDBweMUENccIcmdiYSgwLMUCLjc1KcRoIFxuXG5AbWVkaWEgcHJpbnQgxVbKa8UP6wFcbm9u5gDOfeUApiJ9XQ==", {inputEncoding: 'Base64'})));
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
