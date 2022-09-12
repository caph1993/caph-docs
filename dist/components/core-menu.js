
caph.defineFileComponent(({ })=>{
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
);
caph.injectStyle(`
#caph-menu{
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0.3rem;
  right: 0.3rem;
  z-index: 10000;
  opacity: 0;
  background-color: #eee;
  padding: 0.1rem;
  border-radius: .3rem;
}
#caph-menu:hover, #caph-menu.shown{
  opacity: 1;
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
} 
@media print {
  #caph-menu{
    display: none;
  }
}`);
// async menuLoader({ addOption }) {
//   const { setItem, getItem } = caph.preact.useContext(caph.contexts.storage);
//   addOption('Day / Night', {
//     onEnter: () => setItem('darkTheme', !getItem('darkTheme')),
//     hold: false,
//   });
// }
