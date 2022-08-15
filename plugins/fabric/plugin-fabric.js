

caph.pluginDefs[caph.currentSrc] = new class extends caph.Plugin {

  async loader() {
    await caph.load('caph-docs/libraries/fabric/fabric.js');
    await caph.load('caph-docs/plugins/fabric/diagram.js');
    await caph.loadPluginDeep('mathjaxSvg');
    await MyPromise.until(() => caph.mathjax);
    return;
  }

  Component({ children, id = null, class: _class }) {
    let script = (x => (Array.isArray(x) ? x.join('') : x))(children);
    //script = script.replace(/\\/g, '\\\\'); // Escape backslash again
    if (!id) id = 'diagram-' + Math.floor(1e12 * Math.random());
    preact.useEffect(() => { plugin(script); }, []);

    const plugin = async (script) => {
      let canvas = await MyPromise.until(() =>
        document.querySelector(`#${id}`));
      let fabricCanvas = await this.evaluate(canvas, script);
      window.addEventListener('resize', async () => {
        fabricCanvas.dispose();
        fabricCanvas = await this.evaluate(canvas, script);
      });
    }
    return caph.parse`
      <div class="auto-dark">
        <canvas id=${id} tabIndex="1" fireRightClick class=${_class}/>
      </div>
    `;
  }

  async evaluate(canvas, script) {
    let fabricCanvas = new fabric.Canvas(canvas, {
      backgroundColor: '#fff',
    });
    canvas.classList.forEach((s) =>
      fabricCanvas.wrapperEl.classList.add(s)
    );
    canvas.nextSibling.oncontextmenu = (ev) => {
      ev.preventDefault();
      if (confirm('Download picture?')) this.download(canvas);
    };
    try { var f = eval(script); }
    catch (err) { console.error('INVALID SYNTAX:\n' + script); throw err; }
    await f(fabricCanvas, CaphFabric.exposed_args);
    return fabricCanvas;
  }

  serialize(canvas) {
    return canvas.toDataURL({
      width: canvas.width, height: canvas.height,
      left: 0, top: 0, format: 'png',
    });
  }

  download(canvas) {
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = this.serialize(canvas);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
