
caph.components.codemirror = caph.makePlugin({
  component: ({children, id=null, options={}, unindent=false, class:_class})=>{
    let script = (x=>(Array.isArray(x)?x.join(''):x))(children);
    if(unindent){
      let lines = script.split('\n');
      let n = lines.filter(l=>l.trim().length)
        .map(l=>l.length-l.trimStart().length)
        .reduce((p,c)=>Math.min(c,p), 1000);
      script = lines.map(l=>l.slice(n)).join('\n');
    }
    if(!id) id='codemirror-'+Math.floor(1e12*Math.random());
    preact.useEffect(()=>{ plugin(script, options); }, []);
    const plugin = async(script, options)=>{
      let div = await MyPromise.until(()=>
        document.querySelector(`#${id}`));
      caph.plugins.codemirror.render(div, script, options);
    }
    return html`<div id=${id} class=${_class}/>`;
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
 
