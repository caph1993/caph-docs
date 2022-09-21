import fs from 'fs';
import LZUTF8 from 'lzutf8';
import path from 'path';
import { distPlugins, compressor, compress, decompress } from './src/build-constants.js';

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
    if(lz) text = `caph.injectCompressedScript("${dist}", "${compress(LZUTF8, text)}")`;
    fs.mkdirSync(path.dirname(tgt), { recursive: true });
    fs.writeFileSync(tgt, text);
  }
}

main();