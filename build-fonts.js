let fs = require('fs');
let path = require('path');

let fonts = {
  'font-cmu-serif': [
    {
      'path': 'fonts/computer-modern/cmunrm.ttf',
      'font-family': 'CMU Serif',
    }, {
      'path': 'fonts/computer-modern/cmunbx.ttf',
      'font-family': 'CMU Serif',
      'font-weight': 'bold',
    }, {
      'path': 'fonts/computer-modern/cmunti.ttf',
      'font-family': 'CMU Serif',
      'font-style': 'italic',
    }, {
      'path': 'fonts/computer-modern/cmunbi.ttf',
      'font-family': 'CMU Serif',
      'font-weight': 'bold',
      'font-style': 'italic',
    },
  ],
  'font-lmroman': [
    {
      'path': 'fonts/latin-modern-roman/lmroman10-regular.otf',
      'font-family': 'Latin Modern Roman',
    }, {
      'path': 'fonts/latin-modern-roman/lmroman10-bold.otf',
      'font-family': 'Latin Modern Roman',
      'font-weight': 'bold',
    }, {
      'path': 'fonts/latin-modern-roman/lmroman10-italic.otf',
      'font-family': 'Latin Modern Roman',
      'font-style': 'italic',
    }, {
      'path': 'fonts/latin-modern-roman/lmroman10-bolditalic.otf',
      'font-family': 'Latin Modern Roman',
      'font-weight': 'bold',
      'font-style': 'italic',
    },
  ],
  'font-lmsans': [
    {
      'path': 'fonts/Latin-Modern-Sans/lmsans10-regular.otf',
      'font-family': 'Latin Modern Sans',
    }, {
      'path': 'fonts/Latin-Modern-Sans/lmsans10-bold.otf',
      'font-family': 'Latin Modern Sans',
      'font-weight': 'bold',
    }, {
      'path': 'fonts/Latin-Modern-Sans/lmsans10-oblique.otf',
      'font-family': 'Latin Modern Sans',
      'font-style': 'italic',
    }, {
      'path': 'fonts/Latin-Modern-Sans/lmsans10-boldoblique.otf',
      'font-family': 'Latin Modern Sans',
      'font-weight': 'bold',
      'font-style': 'italic',
    },
  ],
  'font-katex': [
    {
      'font-family': 'KaTeX_AMS',
      'path': 'fonts/katex/KaTeX_AMS-Regular.ttf',
      'font-weight': 'normal',
      'font-style': 'normal',
    }, {
      'font-family': 'KaTeX_Caligraphic',
      'path': 'fonts/katex/KaTeX_Caligraphic-Bold.ttf',
      'font-weight': 'bold',
      'font-style': 'normal',
    }, {
      'font-family': 'KaTeX_Caligraphic',
      'path': 'fonts/katex/KaTeX_Caligraphic-Regular.ttf',
      'font-weight': 'normal',
      'font-style': 'normal',
    }, {
      'font-family': 'KaTeX_Fraktur',
      'path': 'fonts/katex/KaTeX_Fraktur-Bold.ttf',
      'font-weight': 'bold',
      'font-style': 'normal',
    }, {
      'font-family': 'KaTeX_Fraktur',
      'path': 'fonts/katex/KaTeX_Fraktur-Regular.ttf',
      'font-weight': 'normal',
      'font-style': 'normal',
    }, {
      'font-family': 'KaTeX_Main',
      'path': 'fonts/katex/KaTeX_Main-Bold.ttf',
      'font-weight': 'bold',
      'font-style': 'normal',
    }, {
      'font-family': 'KaTeX_Main',
      'path': 'fonts/katex/KaTeX_Main-BoldItalic.ttf',
      'font-weight': 'bold',
      'font-style': 'italic',
    }, {
      'font-family': 'KaTeX_Main',
      'path': 'fonts/katex/KaTeX_Main-Italic.ttf',
      'font-weight': 'normal',
      'font-style': 'italic',
    }, {
      'font-family': 'KaTeX_Main',
      'path': 'fonts/katex/KaTeX_Main-Regular.ttf',
      'font-weight': 'normal',
      'font-style': 'normal',
    }, {
      'font-family': 'KaTeX_Math',
      'path': 'fonts/katex/KaTeX_Math-BoldItalic.ttf',
      'font-weight': 'bold',
      'font-style': 'italic',
    }, {
      'font-family': 'KaTeX_Math',
      'path': 'fonts/katex/KaTeX_Math-Italic.ttf',
      'font-weight': 'normal',
      'font-style': 'italic',
    }, {
      'font-family': 'KaTeX_SansSerif',
      'path': 'fonts/katex/KaTeX_SansSerif-Bold.ttf',
      'font-weight': 'bold',
      'font-style': 'normal',
    }, {
      'font-family': 'KaTeX_SansSerif',
      'path': 'fonts/katex/KaTeX_SansSerif-Italic.ttf',
      'font-weight': 'normal',
      'font-style': 'italic',
    }, {
      'font-family': 'KaTeX_SansSerif',
      'path': 'fonts/katex/KaTeX_SansSerif-Regular.ttf',
      'font-weight': 'normal',
      'font-style': 'normal',
    }, {
      'font-family': 'KaTeX_Script',
      'path': 'fonts/katex/KaTeX_Script-Regular.ttf',
      'font-weight': 'normal',
      'font-style': 'normal',
    }, {
      'font-family': 'KaTeX_Size1',
      'path': 'fonts/katex/KaTeX_Size1-Regular.ttf',
      'font-weight': 'normal',
      'font-style': 'normal',
    }, {
      'font-family': 'KaTeX_Size2',
      'path': 'fonts/katex/KaTeX_Size2-Regular.ttf',
      'font-weight': 'normal',
      'font-style': 'normal',
    }, {
      'font-family': 'KaTeX_Size3',
      'path': 'fonts/katex/KaTeX_Size3-Regular.ttf',
      'font-weight': 'normal',
      'font-style': 'normal',
    }, {
      'font-family': 'KaTeX_Size4',
      'path': 'fonts/katex/KaTeX_Size4-Regular.ttf',
      'font-weight': 'normal',
      'font-style': 'normal',
    }, {
      'font-family': 'KaTeX_Typewriter',
      'path': 'fonts/katex/KaTeX_Typewriter-Regular.ttf',
      'font-weight': 'normal',
      'font-style': 'normal',
    }
  ],
  'font-material-icons': [
    {
      'font-family': 'Material Icons',
      'path': 'fonts/material-icons/material-icons.woff2',
      'font-style': 'normal',
      'font-weight': '400',
    },
    {
      'path': 'fonts/material-icons/material-icons.css',
    }
  ],
  'font-open-sans-emoji': [
    {
      'font-family': 'Open Sans Emoji',
      'path': 'fonts/open-sans-emoji/OpenSansEmoji.otf',
      'font-style': 'normal',
      'font-weight': '400',
    },
  ],
};


function parseFont(font){
  let ext = [
    {ext: 'otf', name: 'opentype'},
    {ext: 'ttf', name: 'truetype'},
    {ext: 'woff', name: 'woff'},
    {ext: 'woff2', name: 'woff2'},
    {ext: 'css', name: 'css'},
  ].find(e=>font.path.endsWith(e.ext));
  if(!ext) throw `Unknown font extension of: ${font.path}`;
  
  if(ext=='css') return `/*${font.path}*/\n${fs.readFileSync(font.path)}\n`;
  let b64 = fs.readFileSync(font.path).toString('base64');
  let f = {...font};
  delete f.path;
  return `
@font-face {
  ${Object.keys(f).map(k=>`${k}: ${f[k]};`).join('\n  ')}
  src:
    url(data:font/${ext.name};base64,${b64})
    format('${ext.name}');
  -fs-pdf-font-embed: embed;
  -fs-pdf-font-encoding: Identity-H;
  font-display: block;
}
`;
}

async function main(){
  for(let key in fonts){
    let buff = '';
    for(let font of fonts[key]){
      buff += parseFont(font);
    }
    const tgt = `dist/fonts/${key}.css`;
    fs.mkdirSync(path.dirname(tgt), { recursive: true });
    fs.writeFileSync(tgt, buff);
  }
}
main();
