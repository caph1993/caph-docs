let fs = require('fs');
let path = require('path');

let { distPlugins, compressor, compress, decompress } = (()=>{
  const exports = {}
  let f = ''+fs.readFileSync('./src/build-constants.js');
  f = f.replace(/export\s+const\s+(.*?)=/g, 'exports.$1=');
  eval(f);
  return exports;
})();

const lzutf8 = require('./'+compressor.src);

//console.log(distPlugins);

async function main() {
  // Plugins

  // Dependencies
  const tasks = [{dist:compressor.dist, src:compressor.src, lz:false}, ...distPlugins];
  for (let {src} of distPlugins) {
    //if (!src.endsWith('.js')) continue;
    let content = '' + fs.readFileSync(src);
    const reg =/caph\.load\(\s*[\'\"](@dist\/.*?)[\'\"]\s*\/\*(.*?)\*\/\s*\)/g;
    for (let [_, dist, src] of [...content.matchAll(reg)]) tasks.push(
      {dist, src, lz:dist.endsWith('.lz.js')}
    );
  }

  for(let {src, dist} of tasks){
    const tgt = dist.slice(1);
    let text = ''+fs.readFileSync(src);
    const lz = tgt.endsWith('.lz.js');
    if(lz) text = `caph.injectCompressedScript("${dist}", "${compress(lzutf8, text)}")`;
    fs.mkdirSync(path.dirname(tgt), { recursive: true });
    fs.writeFileSync(tgt, text);
  }
}

main();