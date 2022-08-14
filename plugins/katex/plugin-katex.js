caph.pluginDefs[caph.currentSrc] = new class extends caph.Plugin {

  async loader() {
    await caph.load('caph-docs/libraries/katex/katex.min.js');
    await caph.load('caph-docs/libraries/katex/katex-nofonts.min.css');
    for (const key in caph.mathMacros) {
      caph.katex.__defineMacro(`\\${key}`, caph.mathMacros[key]);
    }
    await caph.load('caph-docs/plugins/katex/katex.css');
    caph.loadFont('katex'); // don't wait
  }

  Component({ children, displayMode=false }) {
    let formula = (x => (Array.isArray(x) ? x.join('') : x))(children);
    displayMode = displayMode!='false' && displayMode!='0' && !!displayMode;
    const htmlFormula = caph.katex.renderToString(formula, {
      displayMode: displayMode,
      throwOnError: false,
    });
    return caph._parse(false, [htmlFormula]);
  }
}

