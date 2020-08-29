
caph.attach(...JSON.parse(LZUTF8.decompress("W10=", {inputEncoding: 'Base64'})));
caph.plugins.selfClosing = new class extends caph.Plugin{
  loadInline=false;
  render({htmlTag, ...props}){
    return preact.createElement(htmlTag, props);
  }
};