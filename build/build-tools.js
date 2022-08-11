let lzutf8 = require('../libraries/lzutf8-0.6.3/lzutf8.min.js')

function unindent(s) {
  let lines = s.split('\n');
  let n = lines.filter(l => l.trim().length > 0)
    .map(l => l.length - l.trimLeft().length)
    .reduce((p, c) => Math.min(p, c), 1e12);
  return lines.map(l => l.slice(n)).join('\n');
}

function zipped(content) {
  // https://github.com/rotemdan/lzutf8.js/
  let mode = 'Base64'; // StorageBinaryString used more bytes
  return `
    LZUTF8.decompress("${lzutf8.compress(content, {
    outputEncoding: mode,
  })}", {inputEncoding: '${mode}'})
  `.trim();
}
function lzString(string) {
  return `JSON.parse(${zipped(JSON.stringify(string))})`;
}
module.exports = { unindent, lzString };