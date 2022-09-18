
// spell-checker: words sampa alveolo postalveolar downstep conv noto pharyngealized rhotacized velarized linguolabial upstep


caph.libraries.phonetics = (()=>{
  const raWiki = [
    ["ɓ", "b_<", "b_<", "voiced bilabial implosive"],
    ["ɖ", "d`", "d`", "voiced retroflex plosive"],
    ["ɗ", "d_<", "d_<", "voiced alveolar implosive"],
    ["ɡ", "g", "g", "voiced velar plosive"],
    ["ɠ", "g_<", "g_<", "voiced velar implosive"],
    ["ɦ", "h\\", "h\\", "voiced glottal fricative"],
    ["ʝ", "j\\", "j\\", "voiced palatal fricative"],
    ["ɭ", "l`", "l`", "retroflex lateral approximant"],
    ["ɺ", "l\\", "l\\", "alveolar lateral flap"],
    ["ɳ", "n`", "n`", "retroflex nasal"],
    ["ɸ", "p\\", "p\\", "voiceless bilabial fricative"],
    ["ɽ", "r`", "r`", "retroflex flap"],
    ["ɹ", "r\\", "r\\", "alveolar approximant"],
    ["ɻ", "r\\`", "r\\`", "retroflex approximant"],
    ["ʂ", "s`", "s`", "voiceless retroflex fricative"],
    ["ɕ", "s\\", "s\\", "voiceless alveolo-palatal fricative"],
    ["ʈ", "t`", "t`", "voiceless retroflex plosive"],
    ["ʋ", "v\\", "v\\", "labiodental approximant"],
    ["ɧ", "x\\", "x\\", "voiceless palatal-velar fricative"],
    ["ʐ", "z`", "z`", "voiced retroflex fricative"],
    ["ʑ", "z\\", "z\\", "voiced alveolo-palatal fricative"],
    ["ʙ", "B\\", "B\\", "bilabial trill"],
    ["ɢ", "G\\", "G\\", "voiced uvular plosive"],
    ["ʛ", "G\\_<", "G\\_<", "voiced uvular implosive"],
    ["ʜ", "H\\", "H\\", "voiceless epiglottal fricative"],
    ["ɨ̞", "I\\", "I\\", "near-close central unrounded vowel"],
    ["ɪ̈", "I\\", "I\\", "near-close central unrounded vowel"],
    ["ɟ", "J\\", "J\\", "voiced palatal plosive"],
    ["ʄ", "J\\_<", "J\\_<", "voiced palatal implosive"],
    ["ɮ", "K\\", "K\\", "voiced alveolar lateral fricative"],
    ["ʟ", "L\\", "L\\", "velar lateral approximant"],
    ["ɰ", "M\\", "M\\", "velar approximant"],
    ["ɴ", "N\\", "N\\", "uvular nasal"],
    ["ʘ", "O\\", "O\\", "bilabial click"],
    ["ʀ", "R\\", "R\\", "uvular trill"],
    ["ʊ̈", "U\\", "U\\", "near-close central rounded vowel"],
    ["ʉ̞", "U\\", "U\\", "near-close central rounded vowel"],
    ["ħ", "X\\", "X\\", "voiceless pharyngeal fricative"],
    ["ˑ", ":\\", ":\\", "half long"],
    ["ɘ", "@\\", "@\\", "close-mid central unrounded vowel"],
    ["ɞ", "3\\", "3\\", "open-mid central rounded vowel"],
    ["ɶ", "&", "&\\", "open front rounded vowel"],
    ["ʕ", "?\\", "?\\", "voiced pharyngeal fricative"],
    ["ʢ", "<\\", "<\\", "voiced epiglottal fricative"],
    ["ʡ", ">\\", ">\\", "epiglottal plosive"],
    ["ǃ", "!\\", "!\\", "postalveolar click"],
    ["ꜜ", "!", "!", "downstep"],
    ["ǁ", "|\\|\\", "|\\|\\", "alveolar lateral click"],
    ["ǀ", "|\\", "|\\", "dental click"],
    ["‖", "||", "||", "major intonation group"],
    ["ǂ", "=\\", "=\\", "palatal click"],
    ["‿", "-\\", "-\\", "linking mark"],
    ["̈", "_\"", "_\"", "centralized"],
    ["̟", "_+", "_+", "advanced"],
    ["̠", "_-", "_-", "retracted"],
    ["̌", "_/", "_/", "rising tone"],
    ["̥", "_0", "_0", "voiceless"],
    ["ʼ", "_>", "_>", "ejective"],
    ["ˤ", "_?\\", "_?\\", "pharyngealized"],
    ["̂", "_\\", "_\\", "falling tone"],
    ["̯", "_^", "_^", "non-syllabic"],
    ["̚", "_}", "_}", "no audible release"],
    ["˞", "`", "`", "rhotacized"],
    ["̃", "~", "~", "nasalized"],
    ["̃", "~", "~", "nasalized"],
    ["̃", "_~", "_~", "nasalized"],
    ["̘", "_A", "_A", "advanced tongue root"],
    ["̺", "_a", "_a", "apical"],
    [" ᷅", "_B_L", "_B_L", "low rising tone"],
    ["̏", "_B", "_B", "extra low tone"],
    ["̜", "_c", "_c", "less rounded"],
    ["̪", "_d", "_d", "dental"],
    ["̴", "_e", "_e", "velarized or pharyngealized; also see 5"],
    ["↘", "<F>", "<F>", "global fall"],
    ["ˠ", "_G", "_G", "velarized"],
    [" ᷄", "_H_T", "_H_T", "high rising tone"],
    ["́", "_H", "_H", "high tone"],
    ["ʰ", "_h", "_h", "aspirated"],
    ["̰", "_k", "_k", "creaky voice"],
    ["̀", "_L", "_L", "low tone"],
    ["ˡ", "_l", "_l", "lateral release"],
    ["̄", "_M", "_M", "mid tone"],
    ["̻", "_m", "_m", "laminal"],
    ["̼", "_N", "_N", "linguolabial"],
    ["ⁿ", "_n", "_n", "nasal release"],
    ["̹", "_O", "_O", "more rounded"],
    ["̞", "_o", "_o", "lowered"],
    ["̙", "_q", "_q", "retracted tongue root"],
    ["↗", "<R>", "<R>", "global rise"],
    [" ᷈", "_R_F", "_R_F", "rising falling tone"],
    ["̌", "_R", "_R", "rising tone"],
    ["̂", "_F", "_F", "falling tone"],
    ["̝", "_r", "_r", "raised"],
    ["̋", "_T", "_T", "extra high tone"],
    ["̤", "_t", "_t", "breathy voice"],
    ["̬", "_v", "_v", "voiced"],
    ["ʷ", "_w", "_w", "labialized"],
    ["̆", "_X", "_X", "extra-short"],
    ["̽", "_x", "_x", "mid-centralized"],
    ["ꜛ", "^", "^", "upstep"],
    ["ː", ":", ":", "long"],
    ["|", "|", "|", "minor (foot) group"],
    ["̩", "=", "=", "syllabic"],
    ["̩", "=", "=", "syllabic"],
    ["ˈ", "\"", "'", "primary stress"],
    ["ˌ", "%", ",", "secondary stress"],
    ["ə", "@", "@", "schwa"],
    ["ʲ", "_j", "_j", "palatalized"],
    ["æ", "{", "&", "near-open front unrounded vowel"],
    ["ʉ", "}", "u\\", "close central rounded vowel"],
    ["ʔ", "?", "?", "glottal stop"],
    ["ɨ", "1", "1", "close central unrounded vowel"],
    ["ø", "2", "2", "close-mid front rounded vowel"],
    ["ɜ", "3", "3", "open-mid central unrounded vowel"],
    ["ɾ", "4", "4", "alveolar flap"],
    ["ɫ", "5", "5", "velarized alveolar lateral approximant; also see _e"],
    ["ɐ", "6", "6", "near-open central vowel"],
    ["ɤ", "7", "7", "close-mid back unrounded vowel"],
    ["ɵ", "8", "8", "close-mid central rounded vowel"],
    ["œ", "9", "9", "open-mid front rounded vowel"],
    ["ɑ", "A", "A", "open back unrounded vowel"],
    ["β", "B", "B", "voiced bilabial fricative"],
    ["ç", "C", "C", "voiceless palatal fricative"],
    ["ð", "D", "D", "voiced dental fricative"],
    ["ɛ", "E", "E", "open-mid front unrounded vowel"],
    ["ɱ", "F", "F", "labiodental nasal"],
    ["ɣ", "G", "G", "voiced velar fricative"],
    ["ɥ", "H", "H", "labial-palatal approximant"],
    ["ɪ", "I", "I", "near-close front unrounded vowel"],
    ["ɲ", "J", "J", "palatal nasal"],
    ["ɬ", "K", "K", "voiceless alveolar lateral fricative"],
    ["ʎ", "L", "L", "palatal lateral approximant"],
    ["ɯ", "M", "M", "close back unrounded vowel"],
    ["ŋ", "N", "N", "velar nasal"],
    ["ɔ", "O", "O", "open-mid back rounded vowel"],
    ["ɒ", "Q", "Q", "open back rounded vowel"],
    ["ʁ", "R", "R", "voiced uvular fricative"],
    ["ʃ", "S", "S", "voiceless postalveolar fricative"],
    ["θ", "T", "T", "voiceless dental fricative"],
    ["ʊ", "U", "U", "near-close back rounded vowel"],
    ["ʌ", "V", "V", "open-mid back unrounded vowel"],
    ["ʍ", "W", "W", "voiceless labial-velar fricative"],
    ["χ", "X", "X", "voiceless uvular fricative"],
    ["ʏ", "Y", "Y", "near-close front rounded vowel"],
    ["ʒ", "Z", "Z", "voiced postalveolar fricative"],
    ["ʋ", "P", "P", "labiodental approximant"],
    ["͡", "_", ")", "affricate tie bar"],
  ];
  const wiki = raWiki.map(([ipa, sampa, csx, name])=>({ipa, sampa, csx, name}));
  const bySampa = Object.fromEntries(wiki.map(e=>[e.sampa, e]));
  const sampaMaxLength = wiki.map(({sampa})=>sampa.length).reduce((a,b)=>Math.max(a,b));
  const sampa2ipa = (sampa)=>{
    const out = [];
    let i = 0;
    while(i < sampa.length){
      let n;
      for(n=sampaMaxLength; n>=1; n--) if(bySampa[sampa.slice(i, i+n)]) break;
      let ipa = bySampa[sampa.slice(i, i+n)]?.ipa;
      if(!ipa) ipa = sampa[i], n = 1;
      out.push(ipa);
      i += n;
    }
    return out.join('');
  };

  const easyScheme = `
  |=,
  p, b, t, d, k, g, t!=tʰ, d!=dʰ, k?=q, g?=ɢ, ?=ʔ,
  m, n, ~n=ñ=ɲ, -ng-=ŋ,
  l, L=ʎ, l?=l̴,
  r=ɾ, rh=ɹ, R=r, R?=ʀ,
  s, z, sh=ʃ, zh=ʒ, f, v, th=θ, dh=ð,
  s!=s̺, z!=z̺, xh=ç, Jh=jh=ʝ,
  h, x, gh=ɣ, X=χ, r?=ʁ, h?=ħ, h,
  ts=t͡s, dz=d͡z, ch=tsh=t͡ʃ, J=dzh=d͡ʒ, dr=d͡ɹ,
  j=i*=j, w=u*=w, y*=ɥ, H?=ʕ,
  a, e, i, o, u, @=ə,
  y=-iu-=ü=y, @@=-oe-=ö=ø,
  E=-ea-=è=ɛ, I=ɪ, O=oh=ɔ, U=uh=ʊ,
  A=ʌ, a?=ɑ, o?=ɒ, -ae-=æ, 3=ɜ, Y=ʏ,
  M=ı=ɯ, -oea-=œ,
  -an-=-a?n-=ɑ̃, -ain-=ɛ̃, -on-=ɔ̃, -un-=œ̃,
  @r=ɚ, 3r=ɝ,
  `.replace(/\s+/sg, ' ');

  const easy2ipaDict = {};
  const ipa2easyDict = {};
  for(let s of easyScheme.split(',')) if(s.trim().length){
    let values = s.trim().split('=');
    const last = values[values.length-1];
    ipa2easyDict[last] = values[0];
    for(let x of values) easy2ipaDict[x] = last;
  }
  const caphMaxLength = Object.keys(easy2ipaDict).map((k)=>k.length).reduce((a,b)=>Math.max(a,b));
  const ipaMaxLength = Object.keys(ipa2easyDict).map((k)=>k.length).reduce((a,b)=>Math.max(a,b));
  const easy2ipa = (easy)=>{
    const out = [];
    let i = 0;
    while(i < easy.length){
      let n;
      for(n=caphMaxLength; n>=1; n--) if(easy2ipaDict[easy.slice(i, i+n)]) break;
      let ipa = easy2ipaDict[easy.slice(i, i+n)];
      if(!ipa) ipa = easy[i], n = 1;
      out.push(ipa);
      i += n;
    }
    return out.join("");
  }
  const ipa2easy = (ipa)=>{
    const out = [];
    let i = 0;
    while(i < ipa.length){
      let n;
      for(n=ipaMaxLength; n>=1; n--) if(ipa2easyDict[ipa.slice(i, i+n)]) break;
      let easy = ipa2easyDict[ipa.slice(i, i+n)];
      if(!easy) easy = ipa[i], n = 1;
      else if(!n) n=1;
      out.push(easy);
      i += n;
    }
    return out.join("");
  }
  return {wiki, sampa2ipa, easy2ipa, ipa2easy, easy2ipaDict, ipa2easyDict};
})();


caph.injectStyle(`
.font-phonetics{ font-family: "Noto Serif", serif; }
`);
caph.defineFileComponent((()=>{
  const {sampa2ipa, easy2ipa} = caph.libraries.phonetics;
  return ({sampa, easy, children})=>{
    if(children) console.warn('unexpected children in phonetics component');
    const ipa = easy?easy2ipa(easy): sampa2ipa(sampa);
    return caph.parse`<code class="font-phonetics">${ipa}</code>`;
  }
})());