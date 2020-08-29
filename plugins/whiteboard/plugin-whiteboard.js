
/* IDEAS
next-version:
  Undo
  Fix mouse issue
  Insert math
next-version:
  Single class (Box) that is a resizable rectangle
  with text and formulas inside
  toolbar: mouse, pencil, box
next-version:
  arrows between Boxes
  border-radius, trapezoidal and other
  rectangular-like shapes
*/


caph.plugins.whiteboard = new class extends caph.Plugin {

  canvas = null;
  hidden = true;

  render({children}){
    if(children&&children.length) throw 'Unexpected children';
    const [event, setEvent] = preact.useState(null);
    const [ready, setReady] = preact.useState(false);
    const [canvas, setCanvas] = preact.useState(false);
    const [background, setBackground] = preact.useState(false);
    const [tool, setTool_] = preact.useState({
      brush:'pencil', width: 6, shadow: 0, color: '#005E7A88',
      rgbColor:'#005E7A', alpha: 0.7,
    });

    const setTool=(tool, canvas=null)=>{
      canvas = canvas||this.canvas;
      canvas.freeDrawingBrush.color = tool.color;
      canvas.freeDrawingBrush.shadow.color = tool.color;
      canvas.freeDrawingBrush.width = tool.width;
      canvas.freeDrawingBrush.shadow.blur = tool.shadow;
      canvas.isDrawingMode = 'pointer text'.split(' ').indexOf(tool.brush)==-1;
      setTool_({...tool});
    }

    preact.useEffect(async ()=>{
      const domCanvas = await MyPromise.until(()=>
        document.querySelector('#whiteboard-canvas'));
      const canvas = new fabric.Canvas(domCanvas, {isDrawingMode: true});
      canvas.freeDrawingBrush = new fabric['PencilBrush'](canvas);
      canvas.freeDrawingBrush.shadow = new fabric.Shadow({
        blur: tool.shadow, offsetX: 0, offsetY: 0,
        affectStroke: true, color: tool.color,
      });
      canvas.setHeight(3*window.innerHeight);
      canvas.setWidth(3*window.innerWidth);
      fabric.Object.prototype.transparentCorners = false; //??
      document.addEventListener('keydown', (e)=>{
        if(e.keyCode == 27) this.onKey('escape', tool, setTool);
        if(e.keyCode == 46) this.onKey('delete', tool, setTool);
      });
      canvas.upperCanvasEl.addEventListener('click', (e)=>setEvent(e));
      this.history_init(canvas);
      setTool(tool, canvas);
      setCanvas(this.canvas=canvas);
    }, []);

    preact.useEffect(()=>{
      this.onClickCanvas(event, tool);
    }, [event]);

    const {option} = preact.useContext(caph.contexts.menu);
    this.hidden = option!='Whiteboard';
    const _class = this.hidden?'hidden':'fullscreen-layer';
    return html`
    <div id="whiteboard-main" class=${_class}>
      <canvas id="whiteboard-canvas" class="whiteboard-canvas" />
      <div class="whiteboard-background" hidden=${!background} />
      <${canvas && this.mainMenu} canvas=${canvas}
      setTool=${(e)=>setTool(e)} tool=${tool}
      setBackground=${setBackground} background=${background}/>
    </div>`;
  }

  async loader({theme}){
    await caph.load('caph-docs/libraries/fabric/fabric.js');
    await caph.load('caph-docs/plugins/whiteboard/whiteboard.css');
    return;
  }

  async menuSettings({}){
    let main = await MyPromise.until(()=>
      document.querySelector('#whiteboard-main')
    );
    const {addOption} = preact.useContext(caph.contexts.menu);
    addOption('Whiteboard', {hold:true});
    window.addEventListener('keydown', (e)=>{
      if(event.isComposing || event.keyCode === 229)return;
      if(e.keyCode==87) this.toggle(); // W key
      if(!this.hidden&&e.keyCode==66) this.toggleBackground(); // B key
    });
    //caph.menu.onSelect('Whiteboard'); //for testing
    return;
  }
  toggle(){
    const {setOption} = preact.useContext(caph.contexts.menu);
    return setOption(this.hidden?'Whiteboard':'Default');
  }
  toggleBackground(){
    console.warn('Not yet implemented');
  }

  exitText(){
    const text=this.canvas.currentText;
    if(!text) return;
    if(text.isEditing){
      text.exitEditing();
      if(text.text=='') this.canvas.remove(text);
    }
    this.canvas.currentText=null;
  }

  onClickCanvas(event, tool){
    const canvas=this.canvas;
    switch(tool.brush){
      case 'pointer':
      this.exitText();
      break;
      case 'text':
      if(canvas.currentText) this.exitText();
      const text = canvas.currentText = new fabric.IText('',{
        top: event.offsetY,
        left: event.offsetX,
        fill: tool.color,
      });
      canvas.add(text);
      text.enterEditing();
      break;
      default:
      //console.log(tool);
    };
  }

  mainMenu({canvas, setTool, tool, background, setBackground}){
    const brushes = [
      {name:'pointer', icon:'🖱'},
      {name:'text', icon:'T'},
      {name:'pencil', icon:'✏'},
    ];
    const colors = [
      '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#000000', '#ffffff',
    ];
    const widths = [3, 6, 10, 20,];
    const addAlpha=(hex_color, opacity)=>{
      const parse = (a,b)=>parseInt(hex_color.slice(a, b), 16);
      const rgb = [[-6, -4], [-4,-2], [-2, hex_color.length]].map(([a,b])=>parse(a,b));
      const rgba = 'rgba('+rgb.join(',')+','+opacity +')';
      return rgba;
    };
    return html`
    <style>
      .whiteboard-controls>div,
      .whiteboard-controls>div button{
        height:100%;
      }
      .whiteboard-controls>div input{
        height: 1.5rem;
        vertical-align: top;
      }
    </style>
    <div class="whiteboard-controls hbox space-around">
      <div>
        <input type="number" value=${tool.width} onchange=${(e)=>
            setTool({...tool, width:parseFloat(e.target.value)})}
          onblur=${(e)=>
            setTool({...tool, width:parseFloat(e.target.value)})}
          style="width:3em"/>
        ${widths.map(w=>({w: w, ww: 0.1+Math.log(1+w/6)/2})).map(e=>html`
          <button onclick=${()=>setTool({...tool, width:e.w,})}
          style="border-radius:2rem; height:2rem; width:2rem;
            background-color: white;">
            <div style="
              background-color: #000;
              width: ${e.ww}rem;
              height: ${e.ww}rem;
              border-radius: ${e.ww}rem;
              "/>
          </button>
        `)}
      </div>
      <div>
        ${colors.map(e=>html`
          <button onclick=${()=>
            setTool({...tool, color:addAlpha(e, tool.alpha), rgbColor:e,
          })}
          style="background-color:${e}; border-radius:1rem;
            height:1.5rem; width:1.5rem;"/>
        `)}
        <input type="color" value=${tool.rgbColor} onchange="${(e)=>
          setTool({...tool, color: addAlpha(e.target.value, tool.alpha),
            rgbColor: e.target.value})}" />
      </div>
      <div>
        <button onclick=${()=>setBackground(!background)}
        style="background-color: ${background?'88':'00'}; margin:2px;
        height: calc(100% - 4px)">
          B
        </button>
      </div>
      <div>
        ${brushes.map(e=>html`
          <button onclick=${()=>setTool({...tool, brush:e.name})}
          style="background-color: #888888${e.name==tool.brush?'88':'00'}; margin:2px;
          height: calc(100% - 4px)">
            ${e.icon}
          </button>
        `)}
        <button onclick=${()=>canvas.clear()}>
          Clear
        </button>
      </div>
      <div style="padding:1.5rem;"/>
    </div>`;
  }

  onKey(key, tool, setTool){
    if(key=='escape'){
      setTool({...tool, brush:'pointer'});
      this.exitText();
    } else if(key=='delete'){
      this.canvas.getActiveObjects().forEach((obj)=>
        this.canvas.remove(obj));
      this.canvas.discardActiveObject().renderAll(); 
    }
  }

  history_init(canvas){
    const h = {stack:[], index:0};
    canvas.on('object:added', (e)=>{
      let obj = e.target;
      let redoing = h.index<h.stack.length && h.stack[h.index]==obj;
      if(!redoing){
        while(h.index<h.stack.length) h.stack.pop();
        h.stack.push(obj);
      }
      h.index += 1;
    });
    document.addEventListener('keydown', (e)=>{
      if(e.key=='z' && e.ctrlKey) this.undo(canvas, h);
      else if(e.key=='y' && e.ctrlKey) this.redo(canvas, h);
    });
  }
  undo(canvas, h){
    if(h.index==0) return;
    canvas.remove(h.stack[--h.index]);
  }
  redo(canvas, h){
    if(h.index>=h.stack.length) return;
    canvas.add(h.stack[h.index]); // triggers object:added 
  }
};
