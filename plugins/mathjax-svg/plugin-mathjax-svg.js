
caph.pluginDefs[caph.currentSrc] = (async ()=>{

  await caph.load('caph-docs/libraries/mathjax2svg/tex-svg.js');

  window.MathJax = MyObject.deep_assign({
    tex: { inlineMath: [['$', '$'], ['\\(', '\\)']], macros: {} },
    svg: { fontCache: 'local', exFactor: 1.0, scale: 1.0, },
  }, window.MathJax || {});
  for (const key in caph.mathMacros) {
    const s = caph.mathMacros[key];
    let n = 1; while (s.indexOf(`#${n}`) != -1) n += 1;
    MathJax.tex.macros[key] = n == 1 ? s : [s, n - 1];
  }

  const toHtml = (formula, scale = 1) =>{
    const options = MathJax.getMetricsFor(document.body, true);
    const e = MathJax.tex2svg(formula, options).firstElementChild;
    const factor = options.em / 35 * scale;
    ['height', 'width'].forEach((s) => {
      let v = parseFloat(e.getAttribute(s).replace('ex', ''));
      e.setAttribute(s, (v * factor) + 'em');
    });
    return e.outerHTML;
  }

  return ({ children, mode = 'inline' }) =>{
    const {vNode} = preact.useMemo(()=>{
      const formula = Array.isArray(children) ? children.join('') : children;
      const htmlFormula = toHtml(formula);
      const vNode = caph.parseHtml(vNode)
      return {formula, htmlFormula, vNode};
    }, [children]);
    return vNode;
  }
})();