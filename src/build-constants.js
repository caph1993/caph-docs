//@ts-check

const compressed = [];
export const distPlugins = [
  'core-menu',
  'core-about',
  'katex',
  'codemirror',
  'phonetics',
  // 'fabric.lz.js',
  // 'mathjax-svg',
  // // 'gtag',
  // 'document',
  // 'slides',
  // 'whiteboard',
  // //'figure-editor',
  // 'hyphenator',
  // 'auto-scroll',
].map(name=>({
  key: `@${name}`,
  dist: `@dist/components/${name}${compressed.includes(name)?'.lz':''}.js`,
  src: `plugins/${name}/plugin-${name}.js`,
}));

export const compressor = {
  dist: '@dist/lzutf8.min.js',
  src: 'libraries/lzutf8-0.6.3/lzutf8.min.js',
};

/**@param {any} compressor @param {string} text @returns {string}*/
export const compress = (compressor, text)=> compressor.compress(text, {outputEncoding: 'Base64'});

/**@param {any} compressor @param {string} text @returns {string}*/
export const decompress = (compressor, text)=> compressor.decompress(text, {inputEncoding: 'Base64'});

