caph.plugins.selfClosing = new class extends caph.Plugin{
  loadInline=false;
  render({htmlTag, ...props}){
    return preact.createElement(htmlTag, props);
  }
};