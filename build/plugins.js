let fs = require('fs');
let utils = require('./tools.js');

let baseDir = 'caph-docs/';

let plugins = {
  'plugin-document':      'plugins/document/plugin-document.js',
  'plugin-slides':        'plugins/slides/plugin-slides.js',
  'plugin-codemirror':    'plugins/codemirror/plugin-codemirror.js',
  'plugin-whiteboard':    'plugins/whiteboard/plugin-whiteboard.js',
  'plugin-fabric':        'plugins/fabric/plugin-fabric.js',
  'plugin-figure-editor': 'plugins/figure-editor/plugin-figure-editor.js',
};


async function main(){
  for(let key in plugins){
    console.log(key);
    let path=plugins[key], dynamic=[];
    let content = ''+fs.readFileSync(path);
    if(path.endsWith('.js')){
      for(let x of [...content.matchAll(/caph.load\((.*?)\)/g)]){
        let spath = x[1].slice(1,-1);
        console.log(' ', spath);
        let scontent = ''+fs.readFileSync(spath.slice(baseDir.length));
        dynamic.push({ref:spath, content:scontent});
      }
    }
    fs.writeFileSync(`dist/${key}.js`, utils.unindent(`
      caph.attach(...${utils.lzString(dynamic)});
    `)+content);
  }

}
main();