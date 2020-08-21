
caph.components.whiteboard = caph.makePlugin({
  component: ({children})=>{
    if(children&&children.length) throw 'Unexpected children';
    return html`
<div id="whiteboard-main" class="fullscreen-layer hidden">
  <canvas id="whiteboard-canvas" class="whiteboard-canvas" />
  <div id="whiteboard-background" class="whiteboard-background" />
  <div id="whiteboard-controls" class="whiteboard-controls hbox">
    <button id="clear-canvas" class="btn btn-info">Clear</button>
    <button id="drawing-mode" class="btn btn-info">🖱</button>
    <div id="drawing-mode-options" class="hbox">
      <select id="drawing-mode-selector">
        <option>Pencil</option>
        <option>Spray</option>
        <option>Circle</option>
        <option>Pattern</option>
        <option>hline</option>
        <option>vline</option>
        <option>square</option>
        <option>diamond</option>
      </select>
      <input type="color" value="#005E7A" id="drawing-color" />
      <input type="range" value="50" min="0" max="150" id="drawing-line-width" />
      ❏
      <input type="range" value="10" min="2" max="50" id="drawing-shadow-width" />
    </div>
    <div id="non-drawing-mode-options" class="hbox">
      <select id="non-drawing-mode-selector" value="Select">
        <option>Select</option>
        <option>Text</option>
        <option>Pointer</option>
        <option>Math?</option>
      </select>
    </div>
  </div>
</div>`;
  },
  loader: async({theme})=>{
    await caph.load('caph-docs/libraries/fabric/fabric.js');
    await caph.load('caph-docs/plugins/whiteboard/whiteboard.css');
    return;
  },
  post_loader: async({theme})=>{
    await caph.load('caph-docs/plugins/whiteboard/whiteboard.js');
    let main = await MyPromise.until(()=>
      document.querySelector('#whiteboard-main')
    );
    caph.menu.pushOption('Whiteboard', {
      show:()=>{main.classList.remove('hidden');main.hidden=false; },
      hide:()=>{main.classList.add('hidden');main.hidden=true; },
    });
    return;
  },
});
