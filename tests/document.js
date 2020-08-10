// *htm syntax

function Main({}){ return html`
<${PluginWhiteboard}/>
<${PluginFigureEditor}/>
<${CaphDocument} class="hyphenate">

<h1>Caph-docs</h1>

<p>A library for writing HTML documents and slides that look nice, are editable in plain-text and can be exported to standalone HTML files, so that they can be opened in a browser by anyone, anywhere, except IE broswer (LoL).</p>
<p>It supports several plugins, including math, diagrams, charts, images, code snippets and a whiteboard. We encourage HTML+css over markdown and other document languages because HTML+css is universal and flexible. You will never regret about learning HTML+css.</p>

<h2 class="section">Features</h2>

<p>This section uses all the plugins available in caph-docs (except slides mode).</p>

<h3 class="subsection">Math</h3>

<p>KaTeX is used for rendering math. Supporting math formulas is crucial in caph-docs, not only inline math, such as $\\log x := \\int_1^x \\frac 1{x}\\ dx$, but also in display mode $$\\log x := \\int_1^x \\frac 1{x}\\ dx.$$</p>
<p>The formula I like the most is $$e^{i\\pi}+1=0$$ because it joins algebra, geometry, calulus and complex numbers together.</p>

<h3 class="subsection">Code</h3>

<p>Pasting fragments of code is not supported by default, you must load the caph-docs plugin 'codemirror' to get it working. Codemirror is awesome.</p>

<p>The default theme is 'monokai', and the defult hotkeys are 'sublime' (including multiple cursor).  Code is editable live by default but changes are not saved.</p>

<p>Example using python:</p>

<${Codemirror} cm_options=${{mode: 'python'}}>
<pre>
for i in range(0,100, 15):
  print(i)
</pre>
</>

<p>Example using javascript:</p>

<${Codemirror} cm_options=${{mode: 'javascript'}}>
<pre>
async (canvas, {draw, node, arrow, Row, Column})=>{
  let n = { // nodes
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
</pre>
</>

<h3 class="subsection">Diagrams</h3>

<p>Diagrams work using Fabric.js and MathJax-svg. You may use fabric functions to create figures, or our set of layouts/components for making simple graphs with formulas on the nodes and edges.</p>

<p>For example, the code of the previous section produces this:</p>

<${FabricDiagram}>
<script>
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


<h3 class="subsection">Whiteboard</h3>

<p>If you are presenting a document or some slides, you can draw on the screen by placing your mouse on the hidden menu of the top-right corner and clicking 'Whiteboard'.</p>

<p>The whiteboard is based on Fabric.js, and it supports
  <ul>
    <li>Changing color/size</li>
    <li>Changing brush (pencil or spray)</li>
    <li>Undo/Redo with Ctrl-Z/Y</li>
    <li>Selecting (several) strokes with the mouse and moving/deleting them.</li>
  </ul>
</p>

<h3 class="subsection">HTML+js+css</h3>

<p>You can run code, use HTML objects and style them with css. For example, the numbering of this document was achieved using a css file.</p>

<p>This is a simple HTML table styled with the default theme (hover it):</p>

<table class="box-shadow" style="margin:auto">
  <tr><th>Plugin</th><th>Description</th></tr>
  <tr><td>KaTeX</td><td>Math typesetting</td></tr>
  <tr><td>Codemirror</td><td>Show code</td></tr>
  <tr><td>Fabric</td><td>Diagrams (+MathJax math)</td></tr>
  <tr><td>Whiteboard</td><td>Draw on the screen</td></tr>
</table>

<p>You can also load custom fonts. We encourage 'Latin Modern Roman/Sans', as in this document.</p>

<h2 class="section">Usage</h2>

<p>Create a folder, create a new html file with this content:</p>

<${Codemirror} cm_options=${{mode: 'html'}}>
<pre>
${String.raw`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/caph1993/caph-docs@2.4/dist/caph-docs.js"></script>
  </head>
  <body>
    <script src="document.js"></script>
  </body>
</html>`}
</pre>
</>

<p>Create also file named <pre>document.js</pre> with this content:</p>

<${Codemirror} cm_options=${{mode: 'javascript'}}>
<pre>
${String.raw`function MainComponent({}){ return html${'`'}
<${'${PluginWhiteboard}'}/>
<${'${PluginFigureEditor}'}/>
<${'${CaphDocument}'} class="hyphenate">

<h1>Hello world</h1>

<p>This is my first document!</p>

</>${'`'};
}


async function main(){
  //document.documentElement.lang = 'es';
  await caph.ready();
  let url = 'https://cdn.jsdelivr.net/gh/caph1993/caph-docs@2.4/'; // or ../
  await Promise.all([
    caph.load('./document.css'),
    caph.load(url+"dist/font-lmroman.css"),
    caph.load(url+"dist/font-lmsans.css"),
    caph.load(url+"dist/font-katex.css"),
    caph.load(url+"dist/plugin-codemirror.js"),
    caph.load(url+"dist/plugin-whiteboard.js"),
    caph.load(url+"dist/plugin-fabric.js"),
    caph.load(url+"dist/plugin-figure-editor.js"),
  ]);
  preact.render(html${'`'}<${'${MainComponent}'}/>${'`'}, document.body);
};

main();`}
</pre>
</>

<p><i>You should find and install a 'literal-element' syntax plugin for your code editor to highlight the tags in the main component properly.</i></p>

<p>You can write whatever you want in the MainComponent. You can also create more components. Caph-docs uses <pre>preact</pre> and <pre>htm</pre> under the hood.</p>

<p>And a file named <pre>document.css</pre> with this example content that will make the title reddish:</p>

<${Codemirror} cm_options=${{mode: 'css'}}>
<pre>
${String.raw`#caph-body{
  font-family: Latin Modern Roman, serif;
}

h1{
  color: #a64226;
}
`}
</pre>
</>

<h2 class="section">Details</h2>

<p>To be written</p>

</>`;
}

async function main(){
  //document.documentElement.lang = 'es';
  await caph.ready();
  let url = 'https://cdn.jsdelivr.net/gh/caph1993/caph-docs@2.7/';
  //url='../';
  await Promise.all([
    caph.load('./document.css'),
    caph.load(url+"dist/font-lmroman.css"),
    caph.load(url+"dist/font-lmsans.css"),
    caph.load(url+"dist/font-katex.css"),
    caph.load(url+"dist/plugin-codemirror.js"),
    caph.load(url+"dist/plugin-whiteboard.js"),
    caph.load(url+"dist/plugin-fabric.js"),
    caph.load(url+"dist/plugin-figure-editor.js"),
  ]);
  preact.render(html`<${Main}/>`, document.body);
};

main();
