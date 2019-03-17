import {createLogger} from "./Logger";

export class GraphicsPresenter{

  constructor(stage, renderer){
    this.logger = createLogger('GraphicsPresenter');
    this.graphics = [];
    this.minY = Number.MAX_SAFE_INTEGER;
    this.maxY = 0;
    this.renderer = renderer;
  }

  //TODO make one x set and interpolate y
  addGraphic(graphic){
    this.graphics.push();
    const g1MinMaxY = graphic.getMinMaxByIndexes();
    this.logger.log('MinMaxY',  g1MinMaxY);
    this.minY = Math.min(g1MinMaxY.min, this.minY);
    this.maxY = Math.max(g1MinMaxY.max,g2MinMaxY.max);

    let ystepsOnData = Math.round((yRange) / ysteps);
  }


  draw() {
    this.graphics.forEach( (graphic) => {
      this.drawGraphic(graphic);
    });
  };

  drawGraphic(graphic) {
    let x0, y0;
    const yRange = this.maxY - this.minY;
    const xColumn = graphic.x;
    const xMult = stage.width / xColumn.length;
    const yMult = stage.height / yRange;

    for (let i = 0; i < graphic.x.length; i++) {
      if (x0 === undefined) {
        x0 = i * xMult;
        y0 = (graphic.y[i] - this.minY) * yMult;
        continue;
      }
      let x = i * xMult;
      let y = (graphic.y[i] - this.minY) * yMult;
      this.renderer.line({x: x0, y: y0}, {x: x, y: y}, graphic.color);
      this.logger.log(`x:${x} y:${y}`);
      x0 = x;
      y0 = y;

    }
  }
}