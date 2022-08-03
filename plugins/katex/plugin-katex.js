caph.plugins.katex = new class extends caph.Plugin {
  loadInline = true;

  render({ children, mode = 'inline' }) {
    const formula = (x => (Array.isArray(x) ? x.join('') : x))(children);
    const htmlFormula = caph.katex.renderToString(formula, {
      displayMode: mode == 'block',
      throwOnError: false,
    });
    return raw_html([caph.replace(htmlFormula)]);
  }
  async loader() {
    await caph.load('caph-docs/core/katex.min.js');
    await caph.load('caph-docs/core/katex-nofonts.min.css');
    for (const key in caph.mathMacros) {
      caph.katex.__defineMacro(`\\${key}`, caph.mathMacros[key]);
    }
    caph.loadFont('katex');
  }
}