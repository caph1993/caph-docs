//@ts-check
/// <reference path="parser.js" />

//require('../build/build-tools.js');
const window = {};
const fs = require('fs');
eval(fs.readFileSync('./utils.js', 'utf8'));
eval(fs.readFileSync('./parser.js', 'utf8'));

function main(){
  var {parseAst0, parseAst1, parseAst2, parse, parse1, parse2} = __caph_definitions__.NewParser.debugParserFactory(null);

  function assertEq(vDom1, vDom2){
    const out = diff(vDom1, vDom2);
    if(!out) return;
    const [sub1, sub2, why] = out;
    console.error('Difference found');
    console.warn(sub1);
    console.warn(sub2);
    if(!is_string(sub1)&&!is_string(sub2)){
      const [tag1, props1, children1] = sub1;
      const [tag2, props2, children2] = sub2;
      console.log(tag1, props1, children1 && children1.length);
      console.log(tag2, props2, children2 && children2.length);
    }
    throw new Error(`Difference found (${why})`);
  }
  const toEntries = obj => obj && Object.keys(obj).map(k => [k, obj[k]]);
  function diff(vDom1, vDom2){
    if(is_string(vDom1)!=is_string(vDom2)) return [vDom1, vDom2, 'type'];
    const [tag1, props1, children1] = vDom1;
    const [tag2, props2, children2] = vDom2;
    if (tag1 !== tag2) return [vDom1, vDom2, 'tag'];
    if (!!props1 !== !!props2) return [vDom1, vDom2, 'props'];
    if (!!children1 !== !!children2) return [vDom1, vDom2, 'children'];
    if(props1){
      for(let [k, v] of toEntries(props1)){
        if(props1[k] !== v) return [vDom1, vDom2, `prop-${k}`];
      }
      for(let [k, v] of toEntries(props2)){
        if(props2[k] !== v) return [vDom1, vDom2, `prop-${k}`];
      }
    }
    if (!children1) return null;
    if (children1.length !== children2.length) return [vDom1, vDom2, 'children length'];
    for(let i = 0; i < children1.length; i++){
      const out = diff(children1[i], children2[i]);
      if (out) return out;
    }
    return null;
  };
  // assertEq(
  //   parser.parseNoMarkup`hello<div></div>`,
  //   ['hello', ['div', null, []]],
  // );

  function assertTest(node, expected){
    assertEq(node, expected);
    console.log('PASSED');
    console.log('------------------------')
  }

  assertTest(
    parseAst1`<div/>`,
    ['div', null, []],
  );
  assertTest(
    parseAst1`<div></div>`,
    ['div', null, []],
  );
  assertTest(
    parseAst1`<div>  <div> hello </div>  </div>`,
    ['div', null, [['div', null, ['hello']]]],
  );
  assertTest(
    parseAst1`<div><div> </div></div>`,
    ['div', null, [['div', null, []]]],
  );
  assertTest(
    parseAst1`<div><div></div><div></div><div></div></div>`,
    ['div', null, [['div', null, []], ['div', null, []], ['div', null, []]]],
  );
  assertTest(
    parseAst1`<div><A></><B></><C></C></div>`,
    ['div', null, [['A', null, []], ['B', null, []], ['C', null, []]]],
  );
  assertTest(
    parseAst1`<div>hello<div>world</div>!</div>`,
    ['div', null, ['hello', ['div', null, ['world']], '!']],
  );
  assertTest(
    parseAst1`<div><div/><div/><div/></div>`,
    ['div', null, [['div', null, []], ['div', null, []], ['div', null, []]]],
  );
  assertTest(
    parseAst1`<span> </span>`,
    ['span', null, [' ']],
  );
  assertTest(
    parseAst1`<></>`,
    [null, null, []],
  );
  assertTest(
    parseAst1`Fragment without parents. <span bold>I insist!</span>`,
    [null, null, ['Fragment without parents. ', ['span', {bold: true}, ['I insist!']]]],
  );
  assertTest(
    parseAst1`<><>A</><>B</><>C</></>`,
    [null, null, ['A', 'B', 'C']],
  );
  assertTest(
    parseAst1`<><> A </><>B </><> C</></>`,
    [null, null, ['A', 'B', 'C']],
  );
  assertTest(parseAst1`
    <!DOCTYPE html>
    <html lang="en" >
      <head  >
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" >
        <title>Page title</title  >
        <link     
        rel="icon"
        
              type="image/x-icon"
        href="./icons/icon.png"
      
      >

      <!-- Comment -->
      </head>
      <body>
        <div id="root">
          <img class="loading-gif" src="./icons/loading.gif"/>
            Loading page...
        </div>
      </body>
    </html>
    `,
    ['html', {lang:'en'},[
      [
        'head', null, [['meta', {charset:'utf-8'}, []], ['meta', {name:'viewport', content:'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'}, []], ['title', null, ['Page title']], ['link', {rel:'icon', type:'image/x-icon', href:'./icons/icon.png'}, []]]],
      [
        'body', null, [['div', {id:'root'}, [
          ['img', {class:'loading-gif', src:'./icons/loading.gif'}, []],
        'Loading page...',
      ],
    ]]],
  ]]);
  assertTest(parseAst1`
    <math>
      <ms><![CDATA[x<y]]></ms>
      <mo>+</mo>
      <mn>3</mn>
      <mo>=</mo>
      <ms><![CDATA[x<y3]]></ms>
    </math>`,
    ['math', null,
      [
        [ 'ms', null, [] ],
        [ 'mo', null, ['+'] ],
        [ 'mn', null, ['3'] ],
        [ 'mo', null, ['='] ],
        [ 'ms', null, [] ],
      ]
    ],
  );
  assertTest(parseAst1`<div ><!-- awful comment "<>><<" </> <CDATA --></>`,
    ['div', null,[]],
  );
  
  let SomeComponent;

  SomeComponent = ()=>{};
  assertTest(
    parseAst1`<${SomeComponent} />`,
    [SomeComponent, null, []],
  )
  assertTest(
    parseAst1`<div><${SomeComponent} /></div>`,
    ['div', null, [[SomeComponent, null, []]]],
  )

  SomeComponent = ({children, ...props})=>parse`<span ...${props}>Hello world${children}</span>`;
  assertTest(
    parseAst1`<div><${SomeComponent} propX="0" propY=${1}><div/></></div>`,
    ['div', null, [[SomeComponent, {propX:"0", propY:1}, [['div', null, []]]]]],
  );
  assertTest(
    parse1`<div><${SomeComponent} propX="0" propY=${1}><div/></></div>`,
    ['div', null, [['span', {propX:"0", propY:1}, ['Hello world', ['div', null, []]]]]],
  );

  SomeComponent = ({children, ...props})=>parse`<span...${props} propZ="hello">Hello world${children}</span>`;
  assertTest(
    parse1`<div><${SomeComponent} propX="0" propY=${1}><div/></></div>`,
    ['div', null, [['span', {propX:"0", propY:1, propZ:'hello'}, ['Hello world', ['div', null, []]]]]],
  );
  assertTest(
    parse1`$e^2$`,
    ['caph', {plugin:'caph-math'}, ['e^2']],
  );
  assertTest(
    parse1`$$e^2$$`,
    ['caph', {plugin:'caph-math', displayMode:true}, ['e^2']],
  );

  // assertEq(
  //   parser.parse`<div title="10$"><div title="10$"></div></div>`,
  //   ['caph', {plugin:'caph-math'}, ['e^2']],
  // );
}
main();