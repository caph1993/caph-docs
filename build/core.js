let fs = require('fs');
let utils = require('./tools.js');

let baseDir = 'caph-docs/';

let sources = {
  'static': [
    'libraries/lzutf8-0.5.5/lzutf8.min.js',
    'core/utils.js',
    'core/math.js',
    'libraries/preact-10.4.6/preact.min.js',
    'libraries/preact-10.4.6/hooks.js',
    'libraries/xhtm-1.5.3/htm.js',
    'libraries/xhtm-1.5.3/index.js',
  ],
  'loader': 'core/dynamic-loader.js',
  'dynamic': [
    'core/core.css',
    'core/menu.js',
    'core/katex.min.js',
    'core/katex-nofonts.min.css',
  ],
};

function parseContent(path){
  let text = ''+fs.readFileSync(path);
  if(!path.endsWith('.js')) return text;
  
  // Manual conversion of module to script
  text = text.replace(
    /export( +| +default +)function +(\w+)/g,
    'window.$2 = function'
  );
  text = text.replace(/export +default +(\w+)/g, 'window.$1 = $1;');
  text = text.replace(/export +(\w+)/g, 'window.$1 = $1;');
  text = text.replace(/import +(\w+) +from .*/g, '$1 = window.$1;');
  text = text.replace(/require *\((\'|\"|\`)(\w+)(\'|\"|\`)\)/g, 'window.$2');
  text = text.replace(/\/\/# +sourceMappingURL *=.*\n/g, '')
  let name = path.split('/').slice(-1).join('').split('.').slice(0,1).join('');
  text = `exports={};\n${text}\n`;
  text += `if(Object.keys(exports).length){window['${name}']=exports;}\nexports={};\n`;

  // Hotfixes
  if(name=='katex'){
    text += `window.katex=window.katex.katex;\n`;
  } else if(name=='hooks'){
    text +=`for(let key in hooks) preact[key]=hooks[key];\n`;
    text +=`delete window.hooks;\n`;
  } else if(name=='htm'){
    text = text.replace(
      /function *\(statics\) *{/g,
      'function (statics) {\n  statics=[...statics.map(mathString)]; // Math support!',
    );
  }
  return `//${path}\n${text}`;
}

async function main(){
  let static = '';
  for(let path of sources.static) static+=parseContent(path)+'\n';
  static += `window.html = htm.bind(preact.createElement);\n`;
  let loader = ''+fs.readFileSync(sources.loader);
  
  let dynamic = sources.dynamic.map(path=>(
    {ref: baseDir+path, content: parseContent(path)}
  ));
  dynamic = `window.caph_requirements = ${utils.lzString(dynamic)};\n`;
  let code = static+'\n\n\n'+dynamic+'\n\n'+loader;
  fs.writeFileSync('dist/caph-docs.js', code);
}
main();