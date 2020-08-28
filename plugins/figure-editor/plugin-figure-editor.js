
caph.plugins.figureEditor = new class extends caph.Plugin {
  
  render(){
    return html`
      <div id="fabric-editor-main" class="vbox fullscreen-layer hidden">
        <div id="fabric-editor-header" class="hbox space-between">
          <button onclick=${()=>caph.plugins.figureEditor.run()}>
            Run (ctrl+enter)
          </button>
          <div class="hbox align-center">
            <select onchange=${(e)=>
                caph.plugins.figureEditor.setTemplate(e.target.value)}>
              <option value="none">Load Template</option>
              <option value="figure">Figure</option>
              <option value="diagram">Diagram</option>
            </select>
          </div>
          <div/>
        </div>
        <div class="flex hbox" style="max-height: calc(100% - 2rem)">
          <div id="fabric-editor-body" class="vbox">
            <div id="fabric-editor-body-code" class="flex"/>
          </div>
          <div id="fabric-editor-footer" class="vbox">
            <div class="hbox align-center">
              <span>Scale figure:</span>
              <input type='range' value='100' min='10' max='100'
                  onchange=${(e)=>caph.plugins.figureEditor.rescale(e)}/>
            </div>
            <div id="fabric-editor-footer-canvas" class="flex vbox"/>
            <div id="fabric-editor-footer-code" class="flex"/>
          </div>
        </div>
      </div>
    `;
  }
  async loader(){
    await caph.load('caph-docs/libraries/fabric/fabric.js');
    await caph.load('caph-docs/libraries/mathjax2svg/tex-svg.js');
    await caph.load('caph-docs/libraries/split/split.js');
    await caph.load('caph-docs/libraries/split/split.css');
    
    await caph.load('caph-docs/plugins/fabric/diagram.js');
    await caph.load('caph-docs/plugins/fabric/plugin-fabric.js');

    await caph.load('caph-docs/plugins/figure-editor/figure-editor.js');
    await caph.load('caph-docs/plugins/figure-editor/figure-editor.css');
    await caph.load('caph-docs/libraries/codemirror-5.55.0/lib/codemirror.js');
    await caph.load('caph-docs/libraries/codemirror-5.55.0/mode/javascript/javascript.js');
    await caph.load('caph-docs/libraries/codemirror-5.55.0/mode/python/python.js');
    await caph.load('caph-docs/libraries/codemirror-5.55.0/addon/search/searchcursor.js');
    await caph.load('caph-docs/libraries/codemirror-5.55.0/addon/search/search.js');
    await caph.load('caph-docs/libraries/codemirror-5.55.0/addon/scroll/scrollpastend.js');
    await caph.load('caph-docs/libraries/codemirror-5.55.0/keymap/sublime.js');
    await caph.load('caph-docs/libraries/codemirror-5.55.0/addon/display/autorefresh.js');
    await caph.load('caph-docs/libraries/codemirror-5.55.0/lib/codemirror.css');
    await caph.load('caph-docs/libraries/codemirror-5.55.0/theme/monokai.css');
    return;
  }
  async post_loader(){
    let load = async (id)=>MyPromise.until(()=>
      document.querySelector(`#${id}`));
    let main = await load('fabric-editor-main');
    await caph.plugins.figureEditor.init();
    caph.menu.pushOption('Figure Editor', {
      show:()=>{
        main.classList.remove('hidden');
        caph.plugins.figureEditor.refresh();
      },
      hide:()=>{main.classList.add('hidden'); },
    });
  }
};
