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
    this.tx = anchorX;
    this.ty = anchorY;
  }

  transform(p) {
    const x = this.a * p.x + this.c * p.y + this.tx;
    const y = this.b * p.x + this.d * p.y + this.ty;
    //this.ctx.setTransform(this.a, this.b, this.c, this.d, this.tx, this.ty);
    return {x, y};
  }

  clear(){
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  line(pA, pB, color) {
    this.ctx.resetTransform();
    /*   this.ctx.save();                  // Save the current state
       this.ctx.resetTransform();
       this.ctx.beginPath();
       const pFrom = this.transform(pA);
       console.log('pa:', pA, ' pFrom:', pFrom);
       this.ctx.moveTo(pFrom.x, pFrom.y);
       const pTo = this.transform(pB);
       console.log('pb:', pB, ' pTo:', pTo);
       this.ctx.lineTo(pTo.x, pTo.y);
       this.ctx.closePath();
       this.ctx.stroke();
       this.ctx.restore();*/

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.transform(this.a, this.b, this.c, -1 * this.d, this.tx, this.ty);
    this.ctx.translate(0, -yMax);
    this.ctx.strokeStyle = color;
    this.ctx.moveTo(pA.x, pA.y);
    this.ctx.lineTo(pB.x, pB.y);

    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.restore();
  }

}