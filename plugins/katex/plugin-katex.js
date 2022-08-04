caph.plugins.katex = new class extends caph.Plugin {
  loadInline = true;

  render({ children, mode = 'inline' }) {
    let formula = (x => (Array.isArray(x) ? x.join('') : x))(children);
    //console.log(formula);
    const htmlFormula = caph.katex.renderToString(formula, {
      displayMode: mode == 'block',
      throwOnError: false,
    });
    return caph.raw_html([htmlFormula]);
  }
  async loader() {
    await caph.load('caph-docs/libraries/katex/katex.min.js');
    await caph.load('caph-docs/libraries/katex/katex-nofonts.min.css');
    for (const key in caph.mathMacros) {
      caph.katex.__defineMacro(`\\${key}`, caph.mathMacros[key]);
    }
    caph.loadFont('katex');
  }
}