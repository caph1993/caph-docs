caph.plugins['katex'] = new class extends caph.Plugin {

  async loader() {
    await caph.load('caph-docs/libraries/katex/katex.min.js');
    await caph.load('caph-docs/libraries/katex/katex-nofonts.min.css');
    for (const key in caph.mathMacros) {
      caph.katex.__defineMacro(`\\${key}`, caph.mathMacros[key]);
    }
    await caph.load('caph-docs/plugins/katex/katex.css');
  }

  async postLoader() {
    caph.loadFont('katex');
  }

  Component({ children, mode = 'inline' }) {
    let formula = (x => (Array.isArray(x) ? x.join('') : x))(children);
    const htmlFormula = caph.katex.renderToString(formula, {
      displayMode: mode != 'inline',
      throwOnError: false,
    });
    return caph._parse(false, [htmlFormula]);
  }
}
