
caph.components.fabric = caph.makePlugin({
  component: ({children, id=null, class:_class})=>{
    let script = (x=>(Array.isArray(x)?x.join(''):x))(children);
    //script = script.replace(/\\/g, '\\\\'); // Escape backslash again
    if(!id) id='diagram-'+Math.floor(1e12*Math.random());
    preact.useEffect(()=>{ plugin(script); }, []);

    const plugin = async(script)=>{
      let canvas = await MyPromise.until(()=>
        document.querySelector(`#${id}`));
      caph.plugins.fabric.render(canvas, script);
    }
    return html`
      <canvas id=${id} tabIndex="1" fireRightClick
          class=${_class}>
      </canvas>
    `;
  },
  loader: async()=>{
    await caph.load('caph-docs/libraries/fabric/fabric.js');
    await caph.load('caph-docs/libraries/mathjax2svg/tex-svg.js');
    await caph.load('caph-docs/plugins/fabric/fabric.js');
    await caph.load('caph-docs/plugins/fabric/fabric.css');
    await caph.load('caph-docs/plugins/fabric/diagram.js');
    return;
  },
});