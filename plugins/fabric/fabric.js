caph.plugins.fabric = new class {
  
  async render(canvas, script){
    let fabricCanvas = new fabric.Canvas(canvas);
    canvas.classList.forEach((s)=>
      fabricCanvas.wrapperEl.classList.add(s)
    );
    canvas.nextSibling.oncontextmenu=(ev)=>{
      ev.preventDefault();
      if(confirm('Download picture?')) this.download(canvas);
    };
    try{ var f = eval(script); }
    catch(err){ console.error('INVALID SYNTAX:\n'+script); throw err; }
    await f(fabricCanvas, caph.plugins.fabricDiagram.exposed_args);
    return fabricCanvas;
  }

  serialize(canvas){
    return canvas.toDataURL({
       width: canvas.width, height: canvas.height,
       left: 0, top: 0, format: 'png',
    });
  }

  download(canvas){
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = this.serialize(canvas);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
