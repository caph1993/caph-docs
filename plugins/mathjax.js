
const MathJaxSvg = caph.makePlugin({
  component: ({children})=>{
    return html`${children}`;
  },
  loader: async()=>{
    window.MathJax = MyObject.deep_assign({
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        macros:{ RR: "{\\mathbb R}", }
      },
      svg: {fontCache: 'local', exFactor: 1.0, scale: 0.9,},
    }, window.MathJax||{});
  },
  post_loader: async()=>{
    if(window.Reveal) await MyPromise.until(()=>Reveal.isReady());
    await caph.load('caph-docs/libraries/mathjax2svg/tex-svg.js', {
      id: 'MathJax-script',
    });
  },
});

