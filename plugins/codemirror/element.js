
const Codemirror = caph.makePlugin({
  component: ({children, id=null, cm_options={}})=>{
    assert(children&&children.props&&children.props.children);
    let script = (x=>(Array.isArray(x)?x.join(''):x))(
      children.props.children
    );
    let classString = children.props.class||"";
    if(!id) id='codemirror-'+Math.floor(1e12*Math.random());
    preact.useEffect(()=>{ plugin(script, cm_options); }, []);

    const plugin = async(script, cm_options)=>{
      let div = await MyPromise.until(()=>
        document.querySelector(`#${id}`));
      caph.plugins.codemirror.render(div, script, cm_options);
    }
    return html`<div id=${id} class=${classString}/>`;
  },
  loader: async()=>{
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
    await caph.load('caph-docs/plugins/codemirror/codemirror.css');
    await caph.load('caph-docs/plugins/codemirror/codemirror.js');
    return;
  },
});
 
