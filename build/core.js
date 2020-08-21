let fs = require('fs');
let utils = require('./tools.js');

let baseDir = 'caph-docs/';

let sources = {
  'static': [
    'core/lzutf8.min.js',
    'core/utils.js',
    'core/htm-math.js',
    'core/htm-preact.js',
  ],
  'loader': 'core/dynamic-loader.js',
  'dynamic': [
    'core/core.css',
    'core/menu.js',
    'core/katex.min.js',
    'core/katex-nofonts.min.css',
  ],
};

async function main(){
  let static = '';
  for(let path of sources.static) static+=''+fs.readFileSync(path);
  let loader = ''+fs.readFileSync(sources.loader);
  
  let dynamic = sources.dynamic.map(path=>(
    {ref: baseDir+path, content: ''+fs.readFileSync(path)}
  ));
  dynamic = `window.caph_requirements = ${utils.lzString(dynamic)};\n`;
  let code = static+'\n\n\n'+dynamic+'\n\n'+loader;
  fs.writeFileSync('dist/caph-docs.js', code);
}
main();