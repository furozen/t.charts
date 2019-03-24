import {createLogger} from "./Logger";

const xMax = 1000;
const yMax = 1000;


export default class RendererCanvas {
  get font() {
    return this.ctx.font;
  }

  set font(value) {
    this.ctx.font = value;
  }

  get textBaseline() {
    return this.ctx.textBaseline;
  }

  set textBaseline(value) {
    this.ctx.textBaseline = value;
  }

  get lineWidth() {
    return this.ctx.lineWidth;
  }

  set lineWidth(value) {
    this.ctx.lineWidth = value;
  }

  get fillStyle() {
    return this.ctx.fillStyle;
  }

  set fillStyle(value) {
    this.ctx.fillStyle = value;
  }

  get strokeStyle() {
    return this.ctx.strokeStyle;
  }

  set strokeStyle(value) {
    this.ctx.strokeStyle = value;
  }

  constructor(ctx, width, height, anchorX, anchorY) {
    this.ctx = ctx;
    this.height = height;
    this.width = width;
    this.a = width / xMax;
    this.b = 0;
    this.c = 0;
    this.d = height / yMax;
    this.tx = (anchorX * width) / xMax;
    this.ty = (anchorY * height) / yMax;
    this.logger = createLogger('Render:');
  }

  scale(dx, dy) {
    this.ctx.scale(dx, dy);
  }

  strokeText(text, x, y, maxWidth) {
    this.ctx.strokeText(text, x, y, maxWidth);
  }

  fillText(text, x, y, maxWidth) {
    this.ctx.fillText(text, x, y, maxWidth);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
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

  circle(pA,radius){
    this.ctx.arc(pA.x, pA.y,radius,0,Math.PI*2);
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
    this.ctx.fillStyle = color;
  }

  getTransformMatrix(){
    //TODO polifyll
    this.ctx.save();
    this.ctx.transform(this.a, this.b, this.c, -1 * this.d, this.tx, this.ty);
    this.ctx.translate(0, -yMax);
    let transform = this.ctx.getTransform();
    this.ctx.restore();
    return transform;
  }

  getWorldCoordinates(tx,ty){

    let invMat = this.getTransformMatrix().inverse();
    let wX = tx * invMat.a + ty * invMat.c + invMat.e;
    let wY = tx * invMat.b + ty * invMat.d + invMat.f;
    return {x:wX, y:wY};
  }

}
