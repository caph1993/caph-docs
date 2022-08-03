# caph-docs

A js library for writing documents, slides and websites easily.

# Documentation for users

You must add the `caph-docs.js` file to the `head` of your `html` document, e.g. `<script src="https://cdn.jsdelivr.net/gh/caph1993/caph-docs@4.1/dist/caph-docs.js"></script>` for version `v4.1`.

This will create several variables in your window environment:
 - `caph` lets you import supported fonts and plugins, and setting math macros.
 - `html` is a literal template tool for writing jsx-like code in js/html files.
 - `preact`, `htm`, `LZUTF8` are also available because they are libraries required by `caph-docs`.

The object `html` allows you to declare components. It is a wrapper of `htm` bound to `preact.createElement` that handles math and objects with data-tag (plugins).

The object `caph` allows you to load packages.

There are two use case patterns: the simple `html` and the flexible `js` patterns.

Html pattern: Fixed code, convert to text and parse with HTML

```html
<div id="root">
  This is some content
  <div data-tag="codemirror">
    This is some code
  </div>
  ...
</div>

<script>

function main(){
  const root_node = document.querySelector('#root');
  const root_component = html`${root_node.html}`;
  root_node.innerHTML = '';
  preact.render(root_component, root_component);
}
main();
</script>
```

JS pattern:

```html
<div id="caph-root"></div>

<script>
function Main({message1, message2, ...props}){
  const some_code = 'This is more code'
  return html`
    <h1>${message1} ${message2}</h1>
    <div data-tag="codemirror">
      This is some code
      ${some_code}
    </div>
  `
}

function main(){
  const s = 'world';
  const root_component = html`<${Main} message1="hello" message2=${s}/>`;
  const root_node = document.querySelector('#root');
  preact.render(root_component, root_node);
}
main();
</script>
```



# Documentation for developers

To build: `cd .../.../caph-docs`

```sh
node build/core.js
node build/fonts.js
node build/plugins.js
node build/tools.js
```

The file `tools.js` provides mainly just `LZUTF8` for compressing the plugins and fonts that can be loaded by `caph`.

The file `fonts.js` creates font-plugins for `caph-docs` that can be loaded by `caph`.
The crucial fonts are `katex`, `lmroman` and `lmsans`, although some icon and emoji fonts are also available.





