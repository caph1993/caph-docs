// *htm syntax

function Main({}){ return html`
<${PluginWhiteboard}/>
<${PluginFigureEditor}/>
<${CaphDocument}>

<h1>The ethical algorithm</h1>

<h2 class="section nocount">Introduction</h2>

<h3 class="subsection">Algorithmic anxiety</h3>

<p>We must think seriously about algorithms, laws and regulations. 
Several privacy and fairness issues have occurred and they should be prevented in the future.</p>

<h3 class="subsection">Some subsection</h3>

<p>This is because there are some situations in which we need to know the sensible attribute to actually be fair. Specifically, I found an example in talk (see this part of the video) about this book that Catuscia recommended to Frank and me. Basically, the sensible attribute carries information that explains some unfair differences in the 'explainable variables', i.e. the variables that must be taken into account.</p>

<p>Hello everyone.</p>

<p>
  I would like to share three things with you:
</p>
<ol>
  <li>An important conclusion about the first question that Pablo suggested.</li>
  <li>Some questions for Pablo about some statements related to his model and the previous email.</li>
  <li>A diagram that I am picturing in my mind now.</li>
</ol>
<p>
  I am still thinking about the questions that Pablo wrote. These are just some partial claims.
</p>

<${Codemirror}>
<pre>
Large empty code (for scroll testing):




































'end :)'
</pre>
</>

<h3>Part 1.</h3>

<p>
I want to put on the table that our ideal model <b>should</b> take the sensible attribute $A$ into account.
</p>

<p>
This is because there are some situations in which we need to know the sensible attribute to actually be fair. Specifically, I found an example in talk (see <a target="_blank" href="https://www.youtube.com/watch?v=tmC9JdKc3sA&feature=youtu.be&t=1320">this part</a> of the video) about <a target="_blank" href="https://www.amazon.fr/Ethical-Algorithm-Science-Socially-English-ebook/dp/B07XLTXBXV">this book</a> that Catuscia recommended to Frank and me. Basically, the sensible attribute carries information that explains some unfair differences in the 'explainable variables', i.e. the variables that must be taken into account.
</p>

<${Codemirror}>
<pre>
for i in range(0,100, 15):
  print(i)
</pre>
</>

<${FabricDiagram}>
<script class="h6">
async (canvas, {draw, node, arrow, Row, Column})=>{
  let n = {
    X: node('X'),
    PY: node('\\hat Y'),
    Y: node('Y'),
    PYn: node('\\hat{\\tilde Y}'),
    Yn: node('\\tilde{Y}'),
  };
  let arrows = [
    arrow(n.X, n.PY, 'RL'),
    arrow(n.X, n.PYn, 'RL'),
    arrow(n.Y, n.PY, 'LR', {
      text: '\\mathcal L', dashed: true,
    }),
    arrow(n.Yn, n.PYn, 'LR', {
      text:'\\mathcal L', dashed: true,
    }),
  ];
  let layout = Row(
    n.X,
    Column(n.PY, n.PYn),
    Column(n.Y, n.Yn),
  );
  await draw(canvas, {
    nodes:n, arrows, layout,
    width:500, height:150,
    borders: false,
  });
}
</script>
</>

</>`;
}

async function main(){
  //document.documentElement.lang = 'es';
  await caph.ready();
  await Promise.all([
    caph.load('./document.css'),
    caph.load("../dist/font-lmroman.css"),
    caph.load("../dist/font-lmsans.css"),
    caph.load("../dist/font-katex.css"),
    caph.load("../dist/plugin-codemirror.js"),
    caph.load("../dist/plugin-whiteboard.js"),
    caph.load("../dist/plugin-fabric.js"),
    caph.load("../dist/plugin-figure-editor.js"),
  ]);
  preact.render(html`<${Main}/>`, document.body);
};

main();
