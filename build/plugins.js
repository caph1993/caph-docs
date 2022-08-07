let fs = require('fs');
let utils = require('./tools.js');

let baseDir = 'caph-docs/';

let plugins = {
  'plugin-main': 'plugins/main/plugin-main.js',
  'plugin-core-menu': 'plugins/core-menu/plugin-core-menu.js',
  'plugin-about': 'plugins/about/plugin-about.js',
  'plugin-katex': 'plugins/katex/plugin-katex.js',
  'plugin-self-closing': 'plugins/self-closing/plugin-self-closing.js',
  'plugin-document': 'plugins/document/plugin-document.js',
  'plugin-slides': 'plugins/slides/plugin-slides.js',
  'plugin-codemirror': 'plugins/codemirror/plugin-codemirror.js',
  'plugin-whiteboard': 'plugins/whiteboard/plugin-whiteboard.js',
  'plugin-mathjax-svg': 'plugins/mathjax-svg/plugin-mathjax-svg.js',
  'plugin-fabric': 'plugins/fabric/plugin-fabric.js',
  'plugin-figure-editor': 'plugins/figure-editor/plugin-figure-editor.js',
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
      caph.attach(...${utils.lzString(dynamic)});
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
      path.endsWith('tex-svg.js') ? console.log('YEAH') || `
${content}
caph.mathjax=MathJax;
`:
        content;

main();