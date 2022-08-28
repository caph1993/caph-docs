caph.pluginDefs[caph.currentSrc] = (async()=>{
  
  await caph.load('caph-docs/libraries/katex/katex.min.js');
  await caph.load('caph-docs/libraries/katex/katex-nofonts.min.css');
  for (const key in caph.mathMacros) {
    caph.katex.__defineMacro(`\\${key}`, caph.mathMacros[key]);
  }
  await caph.load('caph-docs/plugins/katex/katex.css');  
  caph.loadFont('katex'); // request but don't await fonts

  return ({ children, displayMode=false }) => {
    let formula = (x => (Array.isArray(x) ? x.join('') : x))(children);
    displayMode = displayMode!='false' && displayMode!='0' && !!displayMode;
    if(caph.mathPreprocessor) formula = caph.mathPreprocessor(formula);
    let htmlFormula;
    try{
      htmlFormula = caph.katex.renderToString(formula, {displayMode});
    }catch(err){
      console.warn(formula);
      console.error(err);
      htmlFormula = caph.katex.renderToString(formula, {
        displayMode: displayMode,
        throwOnError: false,
      });
    }
    return caph.parseString(htmlFormula, {markUp: false, htmlSafe:false});
  }
})();
