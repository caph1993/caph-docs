let fs = require('fs');
let utils = require('./build-tools.js');

let baseDir = 'caph-docs/';

let plugins = {
  'plugin-core-menu': 'plugins/core-menu/plugin-core-menu.js',
  'plugin-core-about': 'plugins/core-about/plugin-core-about.js',
  'plugin-katex': 'plugins/katex/plugin-katex.js',
  // 'plugin-gtag': 'plugins/gtag/plugin-gtag.js',
  'plugin-document': 'plugins/document/plugin-document.js',
  'plugin-slides': 'plugins/slides/plugin-slides.js',
  'plugin-codemirror': 'plugins/codemirror/plugin-codemirror.js',
  'plugin-whiteboard': 'plugins/whiteboard/plugin-whiteboard.js',
  'plugin-mathjax-svg': 'plugins/mathjax-svg/plugin-mathjax-svg.js',
  'plugin-fabric': 'plugins/fabric/plugin-fabric.js',
  //'plugin-figure-editor': 'plugins/figure-editor/plugin-figure-editor.js',
  'plugin-hyphenator': 'plugins/hyphenator/plugin-hyphenator.js',
  'plugin-auto-scroll': 'plugins/auto-scroll/plugin-auto-scroll.js',
};


async function main() {
  for (let key in plugins) {
    console.log(key);
    let path = plugins[key], dynamic = [];
    let content = '' + fs.readFileSync(path);
    if (path.endsWith('.js')) {
      for (let x of [...content.matchAll(/caph.load\((.*?)\)/g)]) {
        let spath = x[1].slice(1, -1);
        console.log(' ', spath);
        let scontent = '' + fs.readFileSync(spath.slice(baseDir.length));
        dynamic.push({ ref: spath, content: hotFix(spath, scontent) });
      }
    }
    fs.writeFileSync(`dist/${key}.js`, utils.unindent(`
      caph._scriptLoader.attach(...${utils.lzString(dynamic)});
    `) + content);
  }
}

const hotFix = (path, content) =>
  path.endsWith('katex.min.js') ? `
exports={};
${content}
katex=caph.katex=exports.katex;
delete window.exports;
`:
    path.endsWith('reveal.js') ? `
module={exports:{}};
${content}
Reveal=caph.reveal=module.exports;
delete window.module;
`:
      path.endsWith('tex-svg.js') ? `
${content}
caph.mathjax=MathJax;
`:
        content;

main();