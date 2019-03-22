const xMax = 1000;
const yMax = 1000;

export default class RendererCanvas {

  constructor(ctx, width, height, anchorX, anchorY) {
    this.ctx = ctx;
    this.height = height;
    this.width = width;
    this.a = width / xMax;
    this.b = 0;
    this.c = 0;
    this.d = height / yMax;
    this.tx = anchorX * width/ xMax;
    this.ty = anchorY * height / yMax;
  }

  clear(){
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  line(pA, pB, color) {
    this.prepToDraw(color);
    this.moveTo(pA);
    this.lineTo(pB);
    this.finishDraw();
  }

  lineTo(pB) {
    this.ctx.lineTo(pB.x, pB.y);

  }

  moveTo(pA) {
    this.ctx.moveTo(pA.x, pA.y);
  }

  finishDraw() {
    this.ctx.stroke();
    this.ctx.restore();
  }

  prepToDraw(color) {
    this.ctx.resetTransform();
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.transform(this.a, this.b, this.c, -1 * this.d, this.tx, this.ty);
    this.ctx.translate(0, -yMax);
    this.ctx.strokeStyle = color;
  }

}