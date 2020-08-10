let fs = require('fs');
let utils = require('./tools.js');

let baseDir = 'caph-docs/';

let plugins = {
  'plugin-codemirror': 'plugins/codemirror/element.js',
  'plugin-whiteboard': 'plugins/whiteboard/element.js',
  'plugin-fabric': 'plugins/fabric/element.js',
  'plugin-figure-editor': 'plugins/figure-editor/element.js',
};


async function main(){
  for(let key in plugins){
    let path=plugins[key], dynamic=[];
    let content = ''+fs.readFileSync(path);
    if(path.endsWith('.js')){
      for(let x of [...content.matchAll(/caph.load\((.*?)\)/g)]){
        let spath = x[1].slice(1,-1);
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