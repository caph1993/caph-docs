
caph.attach(...JSON.parse(LZUTF8.decompress("W3sicmVmIjoiY2FwaC1kb2NzL3BsdWdpbnMvZG9jdW1lbnTJCS5jc3MiLCJjb250ZW50IjoiXG4jxTdyb290e1xuICBiYWNrZ3JvdW5kOiB2YXIoLS3KEi0yKTvEJGNvbG9yyB90ZXh0xhdmb250LWZhbWlseTogc2VyaWbFF3BhZGRpbmctYm90dG9tOiBjYWxjKDUwdmggLSA1ZW3GPMgldG9wOiAzZW07XG596ACcYm9keeUAnM1hTGF0aW4gTW9kZXJuIFJvbWFuLCBDb21wdXRlcs8X6gCM/ADe6wDFc2l6ZTogMS4ycuUAiiAgbWFyZ2luOiBhdXRv7ACwOuQAwvgAwcQ3eC13aWR0aDogMzDHFGJveC1zaGFkb3c6IDBweMUEMcYIxSDkAVAtYWxpZ246IGp1c3RpZnnmAQ1AbWVkaWEgb25seSBzY3JlZW4gYW5kICjLZTYwMHB4KSDlAS3vATzrALMwLugAtegA2eYAtjAuMssYyVXlAbAxMDB2dyAtIDLoAbF97ACUcHJpbnTXd8ZiOiBpbml0aWFsx2DpAI3OF8t3zhnsAbnPGusBUMwafeoAjuQC3eYAntpJ5gDQXG5oMSwgaDJ78gLk5AL9xCZwcmXFS2Rpc3BsYXnERmxpbmXvAl8tzUDLGHByZe0C8jogMGVt5AF76AGUYm9yZGVyLXJhZGl1c+oBlX075ACec3Bhbi5rYXRleC7nAIAuZm9ybXVsYeUAlOwCPGNlbnRlcsQ6zDfqA0jnAuTGXVxuLyrHISBmaWx0ZXI6IOQEJXJhc3QoMTMwJeQA/Cov5ACDdGFibOYBAu4CPOgAwMcW6APuyBnlAV3FPCB0cjpudGgtY2hpbGQoZXZlbinvBHroAT0jOMUBMTDGQMk+aG92ZXLeNDTINGQu5gEJ/QEgdGjfJuwAgGjPejogI2bFAfIFHG1hcnAtYmx15wHz6wF4MC457gHw6AEw5AQLc29saWQgIzAw5QDFIMl6ZOYCxdoyZGRkzFTlAZpub+UCnX1cbi5uby1wYWdlLWJyZWFrxkzKEC1pbnNpZGU6IGF2b2nER8Qy2y9iZWZvcsQvbHdheXPGMGNhbnZhc99Z6QFL3yjEKFxuLmYxe+4BOTjkAlHkA4ouZjLPGzfJGjPPGjXKNTTPGzTJGjXPGuUDlMYbNs8b5AM4xRpozhoxLjE3Nsk3aM5SMS40Mjg2yR3uAIkxLjgxOOQD7MYd7gDByhjuAPMy6wCkaO4BKeQGhMQYXG4ifV0=", {inputEncoding: 'Base64'})));
caph.plugins.document = new class extends caph.Plugin{
  render({children, class:_class, plugins=""}){
    return html`
      ${plugins.split(' ').map(tag=>html`<${caph.Plugin.component(tag)}/>`)}
      <div id="caph-body" class=${_class}>
        ${children}
      </div>`;
  }
  async loader({}){
    await caph.load('caph-docs/plugins/document/document.css');
    caph.loadFont('lmroman');
    return;
  }
  menuSettings(){
    const {addOption, setOption} = preact.useContext(caph.contexts.menu);
    addOption('PDF print', {
      onEnter:()=>{ window.print(); setOption('Default'); },
    });
  }
};
