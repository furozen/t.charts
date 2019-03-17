export default class RenderCoords {

  constructor(renderer, step ) {
    this.renderer = renderer;
    this.step = step;
  }

  draw(x, y, w, h, xcoords, ycoords) {

    for (let i = 0; i < ycoords.length; i++) {
      let y1 = i * this.step;
      this.renderer.line({x,y:y1}, {x:w,y:y1},`rgb(0, ${(i*10)%255}, 0)`);
    }
    for (let i = 0; i < xcoords.length; i++) {
      let x1 = i * this.step;
      this.renderer.line({x:x1,y}, {x:x1,y:h},`rgb(
        0,
        ${Math.floor(255 - 42.5 * i)},
        ${Math.floor(255)})`);
    }
  }
}