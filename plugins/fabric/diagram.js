class CaphFabric{}
caph.plugins.fabricDiagram = CaphFabric;

CaphFabric._Base = class{
  container = null;
  async draw_on(canvas, {width, height, top=0, left=0, borders=false}={}){
    assert(width&&height);
    canvas.setHeight(height);
    canvas.setWidth(width);
    //2 pixels padding for seing borders
    height = Math.max(height-2, 0);
    width = Math.max(width-2, 0);
    this._draw_on(canvas, {width, height, top, left, borders});
  }
  make_border(){
    return new fabric.Rect({
      fill: '#eeffdd11', stroke:'black',
      width: this.container.width, height: this.container.height,
      top: this.container.top, left: this.container.left,
      selectable: false,
    });
  }
  get center(){
    return {
      x: this.container.left+this.container.width/2,
      y: this.container.top+this.container.height/2,
    }
  }
}

CaphFabric.Element = class extends CaphFabric._Base{
  element=null;

  _draw_on(canvas, {width, height, top, left, borders}){
    this.container = {width, height, top, left};
    if(borders) canvas.add(this.make_border());
    this.element.set({ // center
      top: top+(height-this.height)/2,
      left: left+(width-this.width)/2
    });
    canvas.add(this.element);
  }
  get width(){
    assert(this.element);
    return this.element.width*this.element.scaleX;
  }
  get height(){
    assert(this.element);
    return this.element.height*this.element.scaleY;
  }
  get left(){
    assert(this.element);
    return this.element.left;
  }
  get top(){
    assert(this.element);
    return this.element.top;
  }
  side_midpoint(side){
    switch (side) {
      case 'top':
        return [this.left+this.width/2, this.top];
      case 'bottom':
        return [this.left+this.width/2, this.top+this.height];
      case 'left':
        return [this.left, this.top+this.height/2];
      case 'right':
        return [this.left+this.width, this.top+this.height/2];
      default:
        throw new Error();
    }
  }
  get center(){
    return [this.left+this.width/2, this.top+this.height/2];
  }
}

CaphFabric.Empty = class extends CaphFabric.Element{
  width=0;
  height=0;
  load_content(canvas){}
  _draw_on(canvas, {width, height, top, left, borders}){
    this.container = {width, height, top, left};
    if(borders) canvas.add(this.make_border());
  }
}

CaphFabric.parse_style=(custom, all, pre_style)=>{
  let style = {};
  for(let k in pre_style) style[k] = MyObject.deep_default(
    pre_style.all||{}, pre_style[k]||{},
    all||{}, custom[k]||{},
  );
  delete style.all;
  for(let k in style) for(let key in style[k]){
    assert(k!='top', 'Invalid style key');
    assert(k!='left', 'Invalid style key');
    assert(k!='width', 'Invalid style key');
    assert(k!='height', 'Invalid style key');
  }
  return style;
}


CaphFabric.Node = class extends CaphFabric.Element{

  constructor(text, style={}){
    super();
    this.text=text;
    this.parse_style(style);
  }

  pre_style={
    box: { fill: '#ffeeaadd', },
    text: {},
    all: { stroke: 'black', }
  }
  parse_style({text, box, ...all}){
    this.style = CaphFabric.parse_style(
      {text, box}, all, this.pre_style);
  }

  async load_svg(svg_string){
    return new Promise((ok, err)=>{
      fabric.loadSVGFromString(svg_string, (objs, opts)=>{
        try{ ok(fabric.util.groupSVGElements(objs, opts));}
        catch(e){ err(e); }
      });
    });
  }

  async load_tex(formula, canvas, {scale=1}={}){
    formula = formula || '';
    // Dont't use canvas.wrapperElem. styles might not be ready
    const options = MathJax.getMetricsFor(document.body, true);
    const e = MathJax.tex2svg(formula, options).firstElementChild;
    const factor = options.em/35*scale;
    ['height', 'width'].forEach((s)=>{
      let v = parseFloat(e.getAttribute(s).replace('ex', ''));
      e.setAttribute(s, (v*factor)+'em');
    });
    return await this.load_svg(e.outerHTML);
  }

  async load_content(canvas){
    let text = await this.load_tex(this.text, canvas);
    this.style.text.fill = this.style.text.stroke;
    text.set(this.style.text);
    let padding=this.style.box.padding;
    if(padding===undefined) padding=null;
    let width = text.width*text.scaleX;
    let height = text.height*text.scaleY;
    if(padding==null){
      padding = 2*Math.log1p(width);
    }
    text.set({top:padding, left:padding});

    let rect = new fabric.Rect({
      left: 0, top:0,
      width: width+2*padding,
      height: height+2*padding,
      ...this.style.box
    });
    let box = new fabric.Group([rect, text]);
    box.set({
      width: rect.width,
      height: rect.height,
    });
    this.element = box;
  }
}

CaphFabric.Arrow = class extends CaphFabric.Element{
  load_content(canvas){}
  constructor(from, to, {text='', sides='auto',
      fromTip=null, toTip='triangle'}={},
      style={}){
    assert(from);
    assert(to);
    super();
    this.sides=sides;
    this.from={node:from, tip:fromTip};
    this.to = {node:to, tip:toTip};
    this.text=text;
    this.parse_style(style);
  }
  pre_style={
    all: { stroke: 'black', },
    line: {},
    from: {tip:null},
    to: {tip:'triangle'},
    text: {}, box: { stroke:'', fill:'#ffffffee', padding:2},
  }
  parse_style({text, box, line, from, to, ...all}){
    this.style = CaphFabric.parse_style(
      {text, box, line, from, to}, all, this.pre_style);
  }
  parse_sides(){
    let sides = this.sides;
    if(sides.length>2){
      sides = sides.split('-').map(s=>s[0]).join('');
      sides = sides.toUpperCase();
    }
    let codes = {L:'left', R:'right', T:'top', B:'bottom'};
    this.from.side = codes[sides[0]];
    this.to.side = codes[sides[1]];
  }

  async draw_on(canvas){
    this.parse_sides();

    this.from.point = ()=>this.from.node.side_midpoint(this.from.side);
    this.to.point = ()=>this.to.node.side_midpoint(this.to.side);

    let [x1,y1] = this.from.point();
    let [x2,y2] = this.to.point();

    let line = new fabric.Line([x1,y1,x2,y2],{
      selectable:false,
      ...this.style.line,
    });

    this.from.node.element.on('moving', (e)=>{
      let [x1,y1] = this.from.point();
      line.set({x1, y1});
    });
    this.to.node.element.on('moving', (e)=>{
      let [x2,y2] = this.to.point();
      line.set({x2, y2});
    });
    canvas.add(line);

    if(this.to.tip=='triangle'){
      let to_tip = new fabric.Triangle({
        ...this.tip_position(true),
        ...this.style.to,
      });
      canvas.add(to_tip);
      this.to.node.element.on('moving', (e)=>{
        to_tip.set(this.tip_position(true));
      });
      this.from.node.element.on('moving', (e)=>{
        to_tip.set(this.tip_position(true));
      });
    }
    if(this.from.tip=='triangle'){
      let from_tip = new fabric.Triangle({
        ...this.tip_position(false),
        ...this.style.from,
      });
      canvas.add(from_tip);
      this.from.node.element.on('moving', (e)=>{
        from_tip.set(this.tip_position(true));
      });
    }
    if(this.text&&this.text.length){
      let text = new CaphFabric.Node(this.text, {
        text: this.style.text,
        box: this.style.box,
      });
      await text.load_content(canvas);
      text._draw_on(canvas, {
        width: Math.abs(x2-x1),
        height: Math.abs(y2-y1),
        left: Math.min(x1,x2),
        top: Math.min(y1,y2),
      });
      this.from.node.element.on('moving', (e)=>{
        text.element.set(this.text_position(text));
      });
      this.to.node.element.on('moving', (e)=>{
        text.element.set(this.text_position(text));
      });
    }
  }
  tip_position(is_to=true, r=4){
    let [x1,y1] = this.from.point();
    let [x2,y2] = this.to.point();
    let originX, originY;
    let angle = Math.atan2((y1-y2),(x1-x2))*180/Math.PI-(is_to?90:270);
    let deltaX=(is_to?1:-1)*r*Math.sin(angle*Math.PI/180);
    let deltaY=(is_to?-1:1)*r*Math.cos(angle*Math.PI/180);
    return {
      left: (is_to?x2:x1) - deltaX,
      top: (is_to?y2:y1) - deltaY,
      originX: 'center',
      originY: 'center',
      selectable: false,
      pointType: 'arrow_start',
      angle: angle,
      width: 2*r, height: 2*r,
    };
  }
  text_position(text){
    let [x1,y1] = this.from.point();
    let [x2,y2] = this.to.point();
    return {
      left: (x1+x2-text.element.width)/2,
      top: (y1+y2-text.element.height)/2,
    }
  }
}

CaphFabric.Tree = class extends CaphFabric._Base{
  direction = 'row'; //only row or column

  constructor(...children){
    super();
    this.children = this.validate_trees(children);
  }
  get elements(){
    return this.children.map(x=>x.element);
  }
  validate_trees(trees){
    trees = trees.map(e=>e===null?new CaphFabric.Empty:e);
    for(let e of trees){
      if(e instanceof CaphFabric.Tree) ;
      else if(e instanceof CaphFabric.Node);
      else if(e instanceof CaphFabric.Empty);
      else if(e instanceof CaphFabric.VGrid);
      else{
        console.error(e);
        throw new Error('Object must be Tree or Node');
      }
    }  
    return trees;
  }
  get is_row(){
    if(this.direction=='row') return true;
    else if (this.direction=='column') return false;
    else throw new Error();
  }
  _draw_on(canvas, {width, height, top, left, borders}){
    this.container = {width, height, top, left};
    if(borders) canvas.add(this.make_border());
    let r=this.is_row, n=this.children.length;
    let W = (width-this.width)/(r?n:1);
    let H = (height-this.height)/(r?1:n);
    for(let e of this.children){
      e._draw_on(canvas, {top, left, borders,
        width: r?e.width+W:width,
        height: r?height:e.height+H,
      });
      if(r) left+=e.width+W;
      else top+=e.height+H;
    }
  }
  get widths(){ return this.children.map(e=>e.width); }
  get heights(){ return this.children.map(e=>e.height); }
  get width(){
    let f = {row: MyArray.sum, column: MyArray.max};
    return f[this.direction](this.widths);
  }
  get height(){
    let f = {column: MyArray.sum, row: MyArray.max};
    return f[this.direction](this.heights);
  }
}

CaphFabric.Grid = class extends CaphFabric.Tree{
  direction = 'column'; //only row or column

  constructor(...children){
    super();
    this.children = children.map(row=>this.validate_trees(row));
    this.nrows = children.length;
    this.ncols = children && children[0].length;
    assert(MyBoolean.all(children.map(r=>r.length==this.ncols)),
      'Inconsistent number of grid rows/columns');
  }
  get elements(){ throw new Error('Not Implemented'); }

  _draw_on(canvas, {width, height, top, left, borders}){
    this.container = {width, height, top, left};
    if(borders) canvas.add(this.make_border());
    let W = (width-this.width)/this.ncols;
    let H = (height-this.height)/this.nrows;
    let i=0, left0=left;
    for(let row of this.children){
      left = left0;
      let j=0;
      for(let e of row){
        e._draw_on(canvas, {top: top, left: left, borders,
          width:this.widths[j] + W,
          height:this.heights[i] + H});
        left += this.widths[j] + W;
        j++;
      }
      top += this.heights[i]+H;
      i++;
    }
  }

  get transpose(){
    let t=[];
    for(let c=0; c<this.ncols; c++){
      t[c]=[];
      for(let r=0; r<this.nrows; r++)
        t[c][r] = this.children[r][c];
    }
    return t;
  }

  get heights(){
    return this.children.map(rows=>
      MyArray.max(rows.map(e=>e.height)));
  }
  get widths(){
    return this.transpose.map(rows=>
      MyArray.max(rows.map(e=>e.width)));
  }
  get width(){ return MyArray.sum(this.widths); }
  get height(){ return MyArray.sum(this.heights); }
}
CaphFabric.HTree = CaphFabric.Tree;
CaphFabric.VTree = class extends CaphFabric.Tree{
  direction='column';
}
CaphFabric.VGrid = CaphFabric.Grid;
CaphFabric.HGrid = class extends CaphFabric.Grid{
  direction='row';
}


CaphFabric.exposed_args = {
  Row: (...args)=>new CaphFabric.HTree(...args),
  Column: (...args)=>new CaphFabric.VTree(...args),
  VGrid: (...args)=>new CaphFabric.VGrid(...args),
  HGrid: (...args)=>new CaphFabric.HGrid(...args),
  Node: (...args)=>new CaphFabric.Node(...args),
  Arrow: (...args)=>new CaphFabric.Arrow(...args),
  draw: async function (canvas, {layout, width, height, maxVWidth=1, maxVHeight=1,
      nodes={}, arrows=[], borders=false}={}){
    width = width || 500;
    height = height || width;
    const scale = Math.min(1,
      (window.innerWidth*maxVWidth)/width,
      (window.innerHeight*maxVHeight)/height,
    );
    width = Math.floor(scale*width);
    height = Math.floor(scale*height);
    let lnodes = Object.values(nodes);
    layout = layout || new CaphFabric.Tree(lnodes);
    for(let u of lnodes) await u.load_content(canvas);
    for(let a of arrows) await a.load_content(canvas);
    await layout.draw_on(canvas, {width, height, borders});
    for(let a of arrows) await a.draw_on(canvas);
    // Force size again (hotfix for small devices)
  },
  light_palette:{
    white: '#fffd', gold: '#fe6d',
    yellow: '#ff0d', orange: '#fc0d', green: '#bf9d',
    blue: '#6afd', red: '#faad', cyan: '#aefd',
    pink: '#faed', violet: '#cafd',
  },
  dark_palette:{
    green: '#160',
  },
  node:(text, color)=>{
    let self = CaphFabric.exposed_args;
    color = color&&(self.light_palette[color]||color);
    let style={};
    if(color) style.fill=color;
    return self.Node(text, style);
  },
  arrow:(from, to, sides, {color, text, dashed}={})=>{
    let self = CaphFabric.exposed_args;
    color = color&&(self.dark_palette[color]||color);
    let style={line:{}};
    if(color){
      style.to=self.from={fill:color, stroke:color};
      style.line={stroke:color};
    }
    if(dashed) style.line.strokeDashArray=[5, 5];
    return self.Arrow(from, to,
      {sides, text}, style);
  },
  line:(from, to, sides, {color, text, dashed}={})=>{
    let self = CaphFabric.exposed_args;
    color = color&&(self.dark_palette[color]||color); 
    let style={line:{}};
    if(color){
      style.to=self.from={fill:color, stroke:color};
      style.line={stroke:color};
    }
    if(dashed) style.line.strokeDashArray=[5, 5];
    return self.Arrow(from, to,
      {sides, text, toTip:null}, style);
  },
  double_arrow:(from, to, sides, {color, text, dashed}={})=>{
    let self = CaphFabric.exposed_args;
    color = color&&(self.dark_palette[color]||color); 
    let style={line:{}};
    if(color){
      style.to=self.from={fill:color, stroke:color};
      style.line={stroke:color};
    }
    if(dashed) style.line.strokeDashArray=[5, 5];
    return self.Arrow(from, to,
      {sides, text, fromTip:'triangle'}, style);
  },
}

