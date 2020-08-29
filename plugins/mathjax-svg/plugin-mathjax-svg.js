caph.plugins.mathjaxSvg = new class extends caph.Plugin{
  loadInline=true;

  render({children, mode='inline'}){
    const formula = (x=>(Array.isArray(x)?x.join(''):x))(children);
    return html([caph.replace(this.toHtml(formula))]);
  }

  toHtml(formula, scale=1){
    const options = MathJax.getMetricsFor(document.body, true);
    const e = MathJax.tex2svg(formula, options).firstElementChild;
    const factor = options.em/35*scale;
    ['height', 'width'].forEach((s)=>{
      let v = parseFloat(e.getAttribute(s).replace('ex', ''));
      e.setAttribute(s, (v*factor)+'em');
    });
    return e.outerHTML;
  }

  async loader(){
    this.loadMacros();
    await caph.load('caph-docs/libraries/mathjax2svg/tex-svg.js');
  }
  loadMacros(){
    window.MathJax = MyObject.deep_assign({
      tex: {inlineMath: [['$', '$'], ['\\(', '\\)']], macros:{}},
      svg: {fontCache: 'local', exFactor: 1.0, scale: 1.0,},
    }, window.MathJax||{});
    for(const key in caph.mathMacros){
      const s = caph.mathMacros[key];
      let n = 1; while(s.indexOf(`#${n}`)!=-1) n+=1;
      MathJax.tex.macros[key] = n==1?s : [s, n-1];
    }
  }
};