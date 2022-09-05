//@ts-check
let fs = require('fs');
let utils = require('./build-tools.js');

let baseDir = 'caph-docs/';

let sources = {
  'dependencies': [
    'libraries/lzutf8-0.5.5/lzutf8.min.js',
    'libraries/preact-10.4.6/preact.min.js',
    'libraries/preact-10.4.6/hooks.js',
  ],
  'core': [
    'core/utils.js',
    'core/parser.js',
    'core/script-loader.js',
    'core/preact-parser.js',
    'core/preact-globals.js',
    'core/main.js',
  ],
  'dynamic': [
    'core/plugin-loader.css',
  ],
};

function parseContent(path) {
  let text = '' + fs.readFileSync(path);
  if (!path.endsWith('.js')) return text;

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
  let name = path.split('/').slice(-1).join('').split('.').slice(0, 1).join('');
  text = `exports={};\n${text}\n`;
  text += `if(Object.keys(exports).length){window['${name}']=exports;}\nexports={};\n`;

  // Hotfixes
  if (name == 'katex') {
    text += `window.katex=window.katex.katex;\n`;
  } else if (name == 'hooks') {
    text += `for(let key in hooks) preact[key]=hooks[key];\n`;
    text += `delete window.hooks;\n`;
  } else if (name == 'htm') {
    if (path.indexOf('/xhtm') != -1) {
      // text = text.replace(
      //   /function *\(statics\) *{/g,
      //   'function (statics) {\n  statics=[...statics.map(mathString)]; // Math support!',
      // );
    } else {
      text = text.replace(
        /function *\(e\) *{/g,
        'function (e) {\n  e=[...e.map(caph.mathString)]; /* Math support */ ',
      );
    }
  }
  return `//${path}\n${text}`;
}

async function main() {
  
  let code = '';
  for (let path of sources.core) code += parseContent(path) + '\n';

  let dynamicSources = sources.dynamic.map(path => (
    { ref: baseDir + path, content: parseContent(path) }
  ));
  const comment = '// Special comment: inject-requirements (do not delete)';
  if(!code.includes(comment)) throw 'Injection point is missing';
  code = code.replace(
    comment,
    `requirements.push(${utils.lzString(dynamicSources)});`,
  );
  
  code = `${
    sources.dependencies.map(path =>parseContent(path)).join('\n')
  }\n\n\n${
    utils.UniversalModuleDefinition(code, 'caph', 'caph')
  }`;

  fs.writeFileSync('dist/caph-docs.js', code);
}
main();