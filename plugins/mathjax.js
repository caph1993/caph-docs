
caph.pluginDefs[caph.currentSrc] = new class extends caph.Plugin {

  Component({ children }) {
    return html`${children}`;
  }

  async loader() {
    window.MathJax = MyObject.deep_assign({
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        macros: { RR: "{\\mathbb R}", }
      },
      svg: { fontCache: 'local', exFactor: 1.0, scale: 0.9, },
    }, window.MathJax || {});
    this.post_loader();
  }

  async post_loader() {
    if (window.Reveal) await caph.until(() => Reveal.isReady());
    await caph.load('caph-docs/libraries/mathjax2svg/tex-svg.js', {
      id: 'MathJax-script',
    });
  }
}

