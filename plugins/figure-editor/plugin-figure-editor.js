

caph.pluginDefs[caph.currentSrc] = new class extends caph.Plugin {

  Component() {
    const { option } = preact.useContext(caph.contexts.menu);
    const _class = option != 'Figure Editor' ? 'hidden' : 'vbox fullscreen-layer';
    return html`
      <div id="fabric-editor-main" class=${_class}>
        <div id="fabric-editor-header" class="hbox space-between">
          <button onclick=${() => caph.plugins.figureEditor.run()}>
            Run (ctrl+enter)
          </button>
          <div class="hbox align-center">
            <select onchange=${(e) =>
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
                  onchange=${(e) => caph.plugins.figureEditor.rescale(e)}/>
            </div>
            <div id="fabric-editor-footer-canvas" class="flex vbox"/>
            <div id="fabric-editor-footer-code" class="flex"/>
          </div>
        </div>
      </div>
    `;
  }
  async loader() {
    await caph.loadPluginDeep('fabric');
    await caph.loadPluginDeep('codemirror');

    await caph.load('caph-docs/libraries/split/split.js');
    await caph.load('caph-docs/libraries/split/split.css');

    await caph.load('caph-docs/plugins/figure-editor/figure-editor.js');
    await caph.load('caph-docs/plugins/figure-editor/figure-editor.css');
    (async () => {
      let load = async (id) => caph.until(() =>
        document.querySelector(`#${id}`));
      let main = await load('fabric-editor-main');
      await this.init();
    })();
    this.menuSettings();
    return;
  }
  menuSettings() {

    const { addOption, setOption } = preact.useContext(caph.contexts.menu);
    addOption('Figure Editor', { hold: true });
  }


  loaded = {};
  async init() {
    let load = async (id) => await caph.until(() =>
      document.querySelector(`#${id}`));
    let [body, body_cm, footer, footer_canvas, footer_cm] = await Promise.all([
      'fabric-editor-body',
      'fabric-editor-body-code',
      'fabric-editor-footer',
      'fabric-editor-footer-canvas',
      'fabric-editor-footer-code'
    ].map(load));

    Split([body, footer], { direction: 'horizontal' });
    let cm_options = {
      theme: 'monokai',
      indentUnit: 2,
      tabSize: 2,
      lineWrapping: true,
      lineNumbers: true,
      keyMap: 'sublime',
      scrollPastEnd: true,
    }
    this.cm = CodeMirror(body_cm, {
      value: this.getTemplate('none'),
      mode: 'javascript',
      extraKeys: {
        'Ctrl-Enter': (cm) => this.run(),
      },
      ...cm_options,
    });
    this.cm_footer = CodeMirror(footer_cm, {
      value: 'Select an element to see its properties...',
      mode: 'json',
      ...cm_options,
    });
    this.canvas_div = footer_canvas;
  }
  refresh() {
    this.cm.refresh();
    this.cm_footer.refresh();
    this.run();
  }
  rescale(e) {
    let value = e.srcElement.value / 100;
    this.canvas_div.style.transform = `scale(${value})`;
    this.canvas_div.style.transformOrigin = 'top left';
  }

  setTemplate(option) {
    let code = this.getTemplate(option);
    this.cm.setValue(code);
    this.refresh();
  }
  getTemplate(option) {
    let tmp = this.templates[option];
    let noindent = tmp.split('\n').map(
      s => s.slice(4, s.length)
    ).join('\n').trim();
    return noindent + '\n';
  }

  async run() {
    this.canvas_div.innerHTML = '';
    let canvas = MyDocument.createElement('canvas', {
      parent: this.canvas_div,
    });
    let code = this.cm.getValue();
    code = code.replace(/\\/g, '\\\\');
    let fabric_canvas = new fabric.Canvas(canvas);
    fabric_canvas.on('object:modified', (ev) => this.on_canvas_event(ev));
    //fabric_canvas.on('selection:created', (ev)=>this.on_canvas_event(ev));
    fabric_canvas.on('selection:updated', (ev) => this.on_canvas_event(ev));
    this.cm_footer.setValue('');
    let diagramArgs = caph.plugins.fabricDiagram.exposed_args;
    try { await eval(code)(fabric_canvas, diagramArgs); }
    catch (err) { this.cm_footer.setValue('' + err); }
    canvas.nextSibling.oncontextmenu = (ev) => {
      ev.preventDefault();
      if (confirm('Download picture?')) this.download(canvas);
    };
  }
  on_canvas_event(ev) {
    let obj = ev.target;
    let s = JSON.stringify(obj, null, '  ');
    this.cm_footer.setValue(s);
  }
  download(canvas) {
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = this.serialize(canvas);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  serialize(canvas) {
    return canvas.toDataURL({
      width: canvas.width, height: canvas.height,
      left: 0, top: 0, format: 'png',
    });
  }

  templates = {
    none: `
    async (canvas, {})=>{
      // code goes here
    }`,
    diagram: `
    async (canvas, {draw, node, arrow, Row, Column})=>{
      let n = {
        X: node('X'),
        PY: node('\\hat Y'),
        Y: node('Y'),
        PYn: node('\\hat{\\tilde Y}'),
        Yn: node('\\tilde{Y}'),
      };
      let arrows = [
        arrow(n.X, n.PY, 'RL'),
        arrow(n.X, n.PYn, 'RL'),
        arrow(n.Y, n.PY, 'LR', {
          text: '\\mathcal L', dashed: true,
        }),
        arrow(n.Yn, n.PYn, 'LR', {
          text:'\\mathcal L', dashed: true,
        }),
      ];
      let layout = Row(
        n.X,
        Column(n.PY, n.PYn),
        Column(n.Y, n.Yn),
      );
      await draw(canvas, {
        nodes:n, arrows, layout,
        width:500, height:150,
        borders: false,
      });
    }`,
    figure: `
    (canvas)=>{
      let elems = [
        new fabric.Ellipse({
        left: 10, top: 10, fill: 'red', stroke: 'black',
        opacity: 0.5, rx: 150, ry: 80,
        }),
          new fabric.Ellipse({
          left: 70, top: 70, fill: 'green', stroke: 'black',
          opacity: 0.5, rx: 150, ry: 80,
        }),
        new fabric.Text('Truth', { left: 103, top: 24 }),
        new fabric.Text('Knowledge', { left: 90, top: 100 }),
        new fabric.Text('Belief', { left: 200, top: 180 }),
      ];
      elems.forEach(e=>canvas.add(e));
      canvas.setHeight(280);
      canvas.setWidth(400);
    }`,
  };
}