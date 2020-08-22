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
  let parser;
  if(window.katex)
    parser=(formula, mode)=>katex.renderToString(formula, {
      displayMode: mode=='block'});
  else if((window.MathJax||{}).tex2svg)
    parser = (formula, mode)=>(mode=='inline'?
      MathJax.tex2svg(formula).innerHTML
      :MathJax.tex2svg(formula).outerHTML
    );
  else{
    console.warn('No math parser loaded for html`..$..$..`');
    parser = (formula, mode)=>`<span class="math-${mode}"> ${formula} </span>`;
  }
  
  let result = [];
  text.split(regularExpression).forEach((s, index) => {
    result.push(s);
    if(latexMatch[index]) {
      let x = latexMatch[index];
      let formula = stripDollars(x);
      let mode = getDisplay(x);
      let block = parser(formula, mode);
      result.push(block);
    }
  });
  return result.join('');
}

