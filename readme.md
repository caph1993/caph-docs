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


# Spacing

The new JSX spacing rules are simple and clear: inline spaces are preserved unless one or more newlines are present, in which case no space is preserved at all.
In other words, for a space string `\s+` occurring between two nodes (tag-tag or text-tag), if it matches `\s*?\n\s*`, it is removed, otherwise, it is replaced with a single space.
In order to force a space or new lines, one can simply inject the desired string, e.g. `...${' '}...${'\n\n'}...`.

However, these rules are not designed for the use pattern of parsing an html node with id, in which string injection is unavailable.
More importantly, in this pattern, it makes more sense to have a tex-like spacing mode in which text chunks are automatically set to `<p>`, converting `\s*?\n\n\s+` into paragraph break and shorter jumps into single space.
This handling inline and display elements separately is complicated, because there is no standard way of inspecting whether an already rendered element is inline or display.
For instance if we run ```caph.parse`hello ${caph.parse`<span>my</span>`} world`;```, the outer parser has to figure out that the inner output is inline, even though the inner element is a `vDom` and not a `AstNode` because it was already parsed by, say, `preact`.


---

I need to make the parser iterative and constructive if I want to simplify the stop-on-error feature.
The constructor will just catch and return the tree constructed so far. 

---



```html
<div data-caph-tex>
Here comes some multi-paragraph text with inline and display formulas such as $2+2=4$ and $$
  3+3=6.
$$
This line is a new paragraph because of the display mode of the preceding formula.

This is also a new paragraph.
It has several phrases in new lines.
These lines are separated by at most one newline character (`\n`) and
  as many
       spaces or tabs as   
    wished.

A custom Figure can be added using a `&lt;div&gt;`.
<div data-caph-plugin="myPlugin"></div>

Depending on the plugin description, it will have inline or display mode behavior.
In any case, it should be invoked with `&lt;div&gt;`, not  `&lt;span&gt;`.

Writing less than, greater than an ampersand in HTML mode is not straightforward.
For formulas, one can simply use $\lt$, $\gt$, etc.
But for code snippets, replacing every occurrence is tedious and makes reading the formulas difficult.
For code, the safest is to use the `script` tag, because all other tags have problems with `&lt;`,
event the `![CDATA[...]]` tag.
The rule will be to use `&lt;script ...&gt;\`...\`&lt;/script&gt;`, possibly with spaces between the tags ends and the open-close backticks, or with `String.raw`, and with the only restriction of not using `&lt;/script&gt;` inside the code itself, which is not a restriction of our parser, but more generally of HTML, as noted in some Firefox tests.

This simplifies the inclusion of <script>`pre-formatted code with < and > symbols`</script>, be it inline or in display mode:
<div><script>`single line pre-formatted code with < and > symbols`</script></div>
or
<div><script>`
pre-formatted multiline
code with < and > symbols
`</script></div>

We could even have <script data-caph-parse>`<!-- JSX code here -->
  <div>Hello <i>JSX</> syntax!</>
`</script>


</div>
```

The proper way to handle the "paragraphs maker" is by means of an attribute.
To avoid cluttering the rules with reserved attribute keywords for ad-hoc purposes, the best is to define it as a plugin `data-caph="@paragraphs"`, whose scope will be local to avoid ambiguity and surprises in deeper levels.
This means that the plugin API will have support for children space parsing before running the component.

Let us summarize what a plugin supports and the use patterns:
 - A component or component promise, with signature `({children, ...props}) => VNode`.
 - In case the component is a promise, a loading component `({children, ...props}) => VNode`.
 - A loading error component, used when the component promise is rejected.
 - An error-handler component, used when the component or the loading component throw an error. This one is always decorated with a default never-failing component that is defaulted when the error-handler component throws an error itself.
 - A space parser that determines how `caph.parse` should proceed when the component is the current `parentTag`.


---

Rejected patterns:

```html
<div data-caph-tex>
Some text ${'some variable'}.
</div>
```
