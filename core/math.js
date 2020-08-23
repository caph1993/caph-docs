const mathString = (text)=>{
  const regularExpression = /\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$[^\$\\]*(?:\\.[^\$\\]*)*\$/g;
  const latexMatch = text.match(regularExpression);
  
  if(!latexMatch) return text; // no math in text

  const blockRegularExpression = /\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]/g;
  
  const stripDollars = (stringToStrip) =>(
    (stringToStrip[0] === "$" && stringToStrip[1] !== "$")?
      stringToStrip.slice(1, -1)
      : stringToStrip.slice(2, -2)
  );

  const getDisplay = (stringToDisplay) =>(
    stringToDisplay.match(blockRegularExpression) ? "block" : "inline"
  );
  let parser = (formula, mode)=>`
    <script data-tag="math" data-mode="${mode}" type="text/math">
      ${formula}
    </script>`.trim();
  
  let result = [];
  text.split(regularExpression).forEach((s, index) => {
    result.push(caph.replace(s));
    if(latexMatch[index]) {
      const x = latexMatch[index];
      const mode = getDisplay(x);
      let formula = caph.replace(stripDollars(x));
      const block = parser(formula, mode);
      result.push(block);
    }
  });
  return result.join('');
}

