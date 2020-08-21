
caph.plugins.codemirror = new class{

  async render(div, code, cm_options={}){
    cm_options = MyObject.deep_assign({
      theme: 'default',
      indentUnit: 2,
      tabSize: 2,
      lineWrapping: true,
      lineNumbers: true,
      keyMap: 'sublime',
      scrollPastEnd: false,
      autoRefresh: true, // necessary for Reveal.js
    }, cm_options);
    
    div.classList.add('codemirror-container');
    const cm = CodeMirror(div, {
      value: code,
      ...cm_options,
    });
  }
}

