//@ts-check
/// <reference path="../../core/types.js" />
/// <reference path="diagram.js" />

caph.pluginDefs[caph.currentSrc] = (async()=>{

  await caph.load('caph-docs/libraries/fabric/fabric.js');
  await caph.load('caph-docs/plugins/fabric/diagram.js');
  //await caph.load('caph-docs/plugins/mathjax-svg/plugin-mathjax-svg.js');
  caph.plugin('mathjax-svg');
  //await caph.load   ( 'mathjax-svg'); // caph.loadPluginDeep???
  await MyPromise.until(() => caph['mathjax']);

  const evaluate = async(canvas, script)=> {
    let fabricCanvas = new fabric.Canvas(canvas, {
      backgroundColor: '#fff',
    });
    canvas.classList.forEach((s) =>
      fabricCanvas.wrapperEl.classList.add(s)
    );
    canvas.nextSibling.oncontextmenu = (ev) => {
      ev.preventDefault();
      if (confirm('Download picture?')) download(canvas);
    };
    try { var f = eval(script); }
    catch (err) { console.error('INVALID SYNTAX:\n' + script); throw err; }
    await f(fabricCanvas, CaphFabric.exposed_args);
    return fabricCanvas;
  }

  const serialize = (canvas)=> {
    return canvas.toDataURL({
      width: canvas.width, height: canvas.height,
      left: 0, top: 0, format: 'png',
    });
  }

  const download = (canvas)=> {
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = serialize(canvas);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  const baseId = 'diagram-' + Math.floor(1e12 * Math.random());

  return ({ children, id = null, class: _class })=>{
    let script = (x => (Array.isArray(x) ? x.join('') : x))(children);
    //script = script.replace(/\\/g, '\\\\'); // Escape backslash again
    if (!id) id = baseId;
    preact.useEffect(() => { plugin(script); }, []);

    const plugin = async (script) => {
      let canvas = await MyPromise.until(() =>
        document.querySelector(`#${id}`));
      let fabricCanvas = await evaluate(canvas, script);
      window.addEventListener('resize', async () => {
        fabricCanvas.dispose();
        fabricCanvas = await evaluate(canvas, script);
      });
    }
    return caph.parse`
      <div class="auto-dark">
        <canvas id=${id} tabIndex="1" fireRightClick class=${_class}/>
      </div>
    `;
  }
})();
