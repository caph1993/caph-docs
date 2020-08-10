
caph.plugins.whiteboard = new class{
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
  constructor(){
    this._init();
  }
  async _init(){
    try{
      await this.whiteboard_init();
    } finally{
      this.canvas.setHeight(3*window.innerHeight);
      this.canvas.setWidth(3*window.innerWidth);
    }
  }

  add_alpha(hex_color, opacity){
    const parse = (a,b)=>parseInt(hex_color.slice(a, b), 16);
    const rgb = [[-6, -4], [-4,-2], [-2, hex_color.length]].map(([a,b])=>parse(a,b));
    const rgba = 'rgba('+rgb.join(',')+','+opacity +')';
    return rgba;
  }
  parse_stroke_width(str_width){
    const value = parseInt(str_width, 10)||1;
    const out = Math.floor(value/10 + Math.pow(6, value/50))||1;
    return out;
  }

  history_init(){
    this.history = {stack:[], index:0};
    this.canvas.on('object:added', (e)=>{
      let obj = e.target;
      let h = this.history;
      let redoing = h.index<h.stack.length && h.stack[h.index]==obj;
      if(!redoing){
        while(h.index<h.stack.length) h.stack.pop();
        h.stack.push(obj);
      }
      h.index += 1;
    });
    document.addEventListener('keydown', (e)=>{
      if(e.key=='z' && e.ctrlKey) this.undo();
      else if(e.key=='y' && e.ctrlKey) this.redo();
    });
  }
  undo(){
    let h = this.history;
    if(h.index==0) return;
    this.canvas.remove(h.stack[--h.index]);
  }
  redo(){
    let h = this.history;
    if(h.index>=h.stack.length) return;
    this.canvas.add(h.stack[h.index]); // triggers object:added 
  }

  whiteboard_init() {
    var $ = function(id){ return document.getElementById(id); };

    var canvas = this.canvas = new fabric.Canvas(
      'whiteboard-canvas', {
      isDrawingMode: true
    });
    this.history_init();

    fabric.Object.prototype.transparentCorners = false;

    var drawingModeEl = $('drawing-mode'),
        drawingOptionsEl = $('drawing-mode-options'),
        nonDrawingOptionsEl = $('non-drawing-mode-options'),
        drawingColorEl = $('drawing-color'),
        drawingLineWidthEl = $('drawing-line-width'),
        drawingShadowWidth = $('drawing-shadow-width'),
        clearEl = $('clear-canvas');

    const get_color = (e)=>this.add_alpha(e.value, 0.5);
    const get_width = (e)=>this.parse_stroke_width(e.value);

    clearEl.onclick = function() { canvas.clear() };

    drawingModeEl.onclick = function() {
      canvas.isDrawingMode = !canvas.isDrawingMode;
      if (canvas.isDrawingMode) {
        drawingModeEl.innerHTML = '🖱';
        drawingOptionsEl.style.display = '';
        nonDrawingOptionsEl.style.display = 'none';
      }
      else {
        drawingModeEl.innerHTML = '✏';
        drawingOptionsEl.style.display = 'none';
        nonDrawingOptionsEl.style.display = '';
      }
    };

    if (fabric.PatternBrush) {
      var vLinePatternBrush = new fabric.PatternBrush(canvas);
      vLinePatternBrush.getPatternSrc = function() {

        var patternCanvas = fabric.document.createElement('canvas');
        patternCanvas.width = patternCanvas.height = 10;
        var ctx = patternCanvas.getContext('2d');

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(0, 5);
        ctx.lineTo(10, 5);
        ctx.closePath();
        ctx.stroke();

        return patternCanvas;
      };

      var hLinePatternBrush = new fabric.PatternBrush(canvas);
      hLinePatternBrush.getPatternSrc = function() {

        var patternCanvas = fabric.document.createElement('canvas');
        patternCanvas.width = patternCanvas.height = 10;
        var ctx = patternCanvas.getContext('2d');

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(5, 0);
        ctx.lineTo(5, 10);
        ctx.closePath();
        ctx.stroke();

        return patternCanvas;
      };

      var squarePatternBrush = new fabric.PatternBrush(canvas);
      squarePatternBrush.getPatternSrc = function() {

        var squareWidth = 10, squareDistance = 2;

        var patternCanvas = fabric.document.createElement('canvas');
        patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
        var ctx = patternCanvas.getContext('2d');

        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, squareWidth, squareWidth);

        return patternCanvas;
      };

      var diamondPatternBrush = new fabric.PatternBrush(canvas);
      diamondPatternBrush.getPatternSrc = function() {

        var squareWidth = 10, squareDistance = 5;
        var patternCanvas = fabric.document.createElement('canvas');
        var rect = new fabric.Rect({
          width: squareWidth,
          height: squareWidth,
          angle: 45,
          fill: this.color
        });

        var canvasWidth = rect.getBoundingRect().width;

        patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
        rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

        var ctx = patternCanvas.getContext('2d');
        rect.render(ctx);

        return patternCanvas;
      };
    }

    $('drawing-mode-selector').onchange = function() {

      if (this.value === 'hline') {
        canvas.freeDrawingBrush = vLinePatternBrush;
      }
      else if (this.value === 'vline') {
        canvas.freeDrawingBrush = hLinePatternBrush;
      }
      else if (this.value === 'square') {
        canvas.freeDrawingBrush = squarePatternBrush;
      }
      else if (this.value === 'diamond') {
        canvas.freeDrawingBrush = diamondPatternBrush;
      }
      else {
        let brush = this.value + 'Brush';
        canvas.freeDrawingBrush = new fabric[brush](canvas);
      }

      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = get_color(drawingColorEl);
        canvas.freeDrawingBrush.width = get_width(drawingLineWidthEl);
        canvas.freeDrawingBrush.shadow = new fabric.Shadow({
          blur: parseInt(drawingShadowWidth.value, 10) || 0,
          offsetX: 0,
          offsetY: 0,
          affectStroke: true,
          color: drawingColorEl.value,
        });
      }
    };

    drawingColorEl.onchange = function() {
      canvas.freeDrawingBrush.color = get_color(this);
      canvas.freeDrawingBrush.shadow.color = this.value;
    };
    drawingLineWidthEl.onchange = function() {
      canvas.freeDrawingBrush.width = get_width(this);
    };
    drawingShadowWidth.onchange = function() {
      canvas.freeDrawingBrush.shadow.blur = this.value;
    };

    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = this.add_alpha(drawingColorEl.value, 0.5);
      canvas.freeDrawingBrush.width = this.parse_stroke_width(drawingLineWidthEl.value);
      canvas.freeDrawingBrush.shadow = new fabric.Shadow({
        blur: parseInt(drawingShadowWidth.value, 10) || 0,
        offsetX: 0,
        offsetY: 0,
        affectStroke: true,
        color: drawingColorEl.value,
      });
    }

    document.addEventListener('keydown', (e)=>{
      if(this.hidden) return;
      if(e.keyCode == 46) {
        canvas.getActiveObjects().forEach((obj) => canvas.remove(obj));
        canvas.discardActiveObject().renderAll()
      }
    });

    canvas.non_drawing_tool = 'Select';
    canvas.current_text = null;
    $('non-drawing-mode-selector').onchange = function() {
      canvas.non_drawing_tool = this.value;
      if(this.value=='Select'){
        //canvas.discardActiveObject();
        if(canvas.current_text){
          canvas.current_text.exitEditing();
          canvas.current_text = null;
        }
      }
    }
    canvas.upperCanvasEl.addEventListener('click', (e)=>{
      if(canvas.isDrawingMode) return;
      let tool = canvas.non_drawing_tool;
      return (()=>{ switch(tool){
        case 'Select':
          return;
        case 'Text': 
          var text = canvas.current_text = new fabric.IText('',{
              left: e.offsetX,
              top: e.offsetY
          });
          canvas.add(text);
          text.enterEditing();
          return;
      }})();
    })
    return;
  }
}
