caph.defineFileComponent((async ()=>{
  caph.load('@dist/libraries/katex.min.lz.js'/*libraries/katex/katex.min.js*/);
  caph.load('@dist/libraries/katex-nofonts.min.css'/*libraries/katex/katex-nofonts.min.css*/);

  const katex = await caph.until(()=>window["katex"]);
  for (const key in caph.mathMacros) {
    katex.__defineMacro(`\\${key}`, caph.mathMacros[key]);
  }
  caph.load('@dist/fonts/font-katex.css') // request but don't await fonts

  return ({ children, displayMode=false }) => {
    let formula = (x => (Array.isArray(x) ? x.join('') : x))(children);
    //displayMode = displayMode!='false' && displayMode!='0' && !!displayMode;
    if(caph.mathPreprocessor) formula = caph.mathPreprocessor(formula);
    let htmlFormula;
    try{
      htmlFormula = katex.renderToString(formula, {displayMode:false});
    }catch(err){
      console.warn(formula);
      console.error(err);
      htmlFormula = katex.renderToString(formula, {
        displayMode: false,
        throwOnError: false,
      });
    }
    const vNode = caph.parseHtml(htmlFormula);
    if(displayMode) return caph.parse`<div class="caph-katex-display-parent">${vNode}</div>`
    return vNode;
  }
})());
caph.injectStyle(`
span.katex.display.formula{
  text-align: center;
}
span.katex{
  font-size: 1em;
}
.caph-katex-display-parent{
  width:100%;
  text-align:center;
}
`);
