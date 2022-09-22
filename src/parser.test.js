//@ts-check
import {createParser} from "./parser.js";
import {isString} from "./utils.js";

const {parse:parse0, settings:settingsAst0} = createParser();
settingsAst0.debug = 0;
const {parse:parse1, settings:settingsAst1} = createParser();
settingsAst1.debug = 1;
const {parse:parse2, settings:settingsAst2} = createParser();
settingsAst2.debug = 2;


function main(){

  function assertEq(vDom1, vDom2){
    const out = diff(vDom1, vDom2);
    if(!out) return;
    const [sub1, sub2, why] = out;
    console.error('Difference found');
    console.warn(sub1);
    console.warn(sub2);
    if(!isString(sub1)&&!isString(sub2)){
      const {tag:tag1, props:props1, children:children1} = sub1;
      const {tag:tag2, props:props2, children:children2} = sub2;
      console.log(tag1, props1, children1 && children1.length);
      console.log(tag2, props2, children2 && children2.length);
    }
    throw new Error(`Difference found (${why})`);
  }
  const toEntries = obj => obj && Object.keys(obj).map(k => [k, obj[k]]);
  function diff(vDom1, vDom2){
    if(isString(vDom1)!=isString(vDom2)) return [vDom1, vDom2, 'tag'];
    const {tag:tag1, props:props1, children:children1} = vDom1;
    const {tag:tag2, props:props2, children:children2} = vDom2;
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
  //   ['hello', {tag:'div', props:null, children:[]}],
  // );

  function assertTest(node, expected){
    assertEq(node, expected);
    console.log('PASSED');
    console.log('------------------------')
  }

  assertTest(
    parse1`<div/>`,
    {tag:'div', props:null, children:[]},
  );
  assertTest(
    parse1`<div></div>`,
    {tag:'div', props:null, children:[]},
  );
  assertTest(
    parse1`<div></>`,
    {tag:'div', props:null, children:[]},
  );
  assertTest(
    parse1`<div/>`,
    {tag:'div', props:null, children:[]},
  );
  assertTest(
    parse1`<div></div>`,
    {tag:'div', props:null, children:[]},
  );
  assertTest(
    parse1`<div></>`,
    {tag:'div', props:null, children:[]},
  );
  assertTest(
    parse1`<div><div/></>`,
    {tag:'div', props:null, children:[{tag:'div', props:null, children:[]}]},
  );
  assertTest(
    parse1`<p>No space</>`,
    {tag:'p', props:null, children:['No space']},
  );
  assertTest(
    parse1`<p> Left space</>`,
    {tag:'p', props:null, children:[' Left space']},
  );
  assertTest(
    parse1`<p>Right space </>`,
    {tag:'p', props:null, children:['Right space ']},
  );
  assertTest(
    parse1`<p> Both spaces </>`,
    {tag:'p', props:null, children:[' Both spaces ']},
  );
  assertTest(
    parse1`<p>Space <a>after</a> link</>`,
    {tag:'p', props:null, children:['Space ', {tag:'a', props:null, children:['after']}, ' link']},
  );

  assertTest(
    parse1`
      <div>
        <div> hello </div>
      </div>
    `,
    {tag:'div', props:null, children:[{tag:'div', props:null, children:[' hello ']}]},
  );
  assertTest(
    parse1`<div><div> </div></div>`,
    {tag:'div', props:null, children:[{tag:'div', props:null, children:[' ']}]},
  );
  assertTest(
    parse1`<div><div></div><div></div><div></div></div>`,
    {tag:'div', props:null, children:[{tag:'div', props:null, children:[]}, {tag:'div', props:null, children:[]}, {tag:'div', props:null, children:[]}]},
  );
  assertTest(
    parse1`<div><A></><B></><C></C></div>`,
    {tag:'div', props:null, children:[{tag:'A', props:null, children:[]}, {tag:'B', props:null, children:[]}, {tag:'C', props:null, children:[]}]},
  );
  assertTest(
    parse1`<div>hello<div>world</div>!</div>`,
    {tag:'div', props:null, children:['hello', {tag:'div', props:null, children:['world']}, '!']},
  );
  assertTest(
    parse1`<div><div/><div/><div/></div>`,
    {tag:'div', props:null, children:[{tag:'div', props:null, children:[]}, {tag:'div', props:null, children:[]}, {tag:'div', props:null, children:[]}]},
  );
  assertTest(
    parse1`<span> </span>`,
    {tag:'span', props:null, children:[' ']},
  );
  assertTest(
    parse1`<></>`,
    {tag:null, props:null, children: []},
  );
  assertTest(
    parse1`Fragment without parents. <span bold>I insist!</span>`,
    {tag:null, props:null, children: ['Fragment without parents. ', {tag:'span', props:{bold: true}, children:['I insist!']}]},
  );
  assertTest(
    parse1`<><>A</><>B</><>C</></>`,
    // {tag:null, props:null, children: ['A', 'B', 'C']},
    'ABC',
  );
  assertTest(
    parse1`<><> A </><>B </><> C</></>`,
    //{tag:null, props:null, children: [' A ', 'B ', ' C']},
    ' A B  C',
  );
  assertTest(parse1`
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

    {tag:'html', props:{lang:'en'}, children:[
      {tag:'head', props:null, children:[
        {tag:'meta', props:{charset:'utf-8'}, children:[]},
        {tag:'meta', props:{name:'viewport', content:'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'}, children:[]},
        {tag:'title', props:null, children:['Page tiprops:tle']},
        {tag:'link', props:{rel:'icon', type:'image/x-icon', href:'./icons/icon.png'}, children:[]}
      ]},
      {tag:'body', props:null, children:[
        {tag:'div', props:{id:'root'}, children:[
          {tag:'img', props:{class:'loading-gif', src:'./icons/loading.gif'}, children:[]},
          'Loading page...',
        ]}
      ]},
    ]}
  );
  assertTest(parse1`
    <math>
      <ms><![CDATA[x<y]]></ms>
      <mo>+</mo>
      <mn>3</mn>
      <mo>=</mo>
      <ms><![CDATA[x<y3]]></ms>
    </math>`,
    {tag:'math', props:null, children:[
      {tag:'ms', props:null, children: [] },
      {tag:'mo', props:null, children: ['+'] },
      {tag:'mn', props:null, children: ['3'] },
      {tag:'mo', props:null, children: ['='] },
      {tag:'ms', props:null, children: [] },
    ]},
  );
  assertTest(parse1`<div ><!-- awful comment "<>><<" </> <CDATA --></>`,
    {tag:'div', props:null,children:[]},
  );
  
  let SomeComponent;

  SomeComponent = ({props, children})=>{ return [props, children];};
  assertTest(
    parse1`<${SomeComponent} />`,
    [null, []],
  )
  assertTest(
    parse1`<div><${SomeComponent} /></div>`,
    {tag:'div', props:null, children:[[null, []]]},
  )

  assertTest(
    parse1`<div>${parse1`<div/>`}</div>`,
    {tag:'div', props:null, children:[{tag:'div', props:null, children:[]}]},
  );

  
  SomeComponent = ({children,})=>parse0`<div>${children}</div>`;
  assertTest(
    parse1`<div><${SomeComponent} propX="0" propY=${1}><div/></></div>`,
    {tag:'div', props:null, children:[{tag:'span', props:{propX:"0", propY:1}, children:['Hello world', {tag:'div', props:null, children:[]}]}]},
  );

  SomeComponent = ({children, ...props})=>parse0`<span ...${props}>Hello world${children}</span>`;
  assertTest(
    parse1`<div><${SomeComponent} propX="1" propY=${1}><div/></></div>`,
    {tag:'div', props:null, children:[[SomeComponent, {propX:"1", propY:1}, [{tag:'div', props:null, children:[]}]]]},
  );
  assertTest(
    parse1`<div><${SomeComponent} propX="2" propY=${1}><div/></></div>`,
    {tag:'div', props:null, children:[{tag:'span', props:{propX:"2", propY:1}, children:['Hello world', {tag:'div', props:null, children:[]}]}]},
  );

  SomeComponent = ({children, ...props})=>parse0`<span...${props} propZ="hello">Hello world${children}</span>`;
  assertTest(
    parse1`<div><${SomeComponent} propX="3" propY=${1}><div/></></div>`,
    {tag:'div', props:null, children:[{tag:'span', props:{propX:"3", propY:1, propZ:'hello'}, children:['Hello world', {tag:'div', props:null, children:[]}]}]},
  );
  assertTest(
    parse1`$e^2$`,
    ['div', {'data-caph':'@math', displayMode:false}, ['e^2']],
  );
  assertTest(
    parse1`$$e^2$$`,
    ['div', {'data-caph':'@math', displayMode:true}, ['e^2']],
  );
  assertTest(
    parse1`<ul><li>testing<div/><li>auto<li>close</></>`,
    ['ul', null, [['li', null, ['testing', {tag:'div', props:null, children:[]}]],['li', null, ['auto']],['li', null, ['close']]]],
  );
  assertTest(
    parse2`Hello string`,
    'Hello string',
  );
  assertTest(
    parse2`${'Hello injected string'}`,
    {tag:null, props:null, children: 'Hello injected string'},
  );
  assertTest(
    parse1`<ul>${['A', 'B', 'C'].map(s => parse1`<li>${s}</li>`)}</>`,
    ['ul', null, [{tag:'li', props:null, children:['A']}, {tag:'li', props:null, children:['B']}, {tag:'li', props:null, children:['C']}]],
  );

  assertTest(
    parse1`<div>${parse1`<div>${parse1`<div/>`}</div>`}</div>`,
    {tag:'div', props:null, children:[{tag:'div', props:null, children:[{tag:'div', props:null, children:[]}]}]},
  );
  // assertEq(
  //   parser.parse0`<div title="10$"><div title="10$"></div></div>`,
  //   ['caph', {plugin:'caph-math'}, ['e^2']],
  // );
}

main();
