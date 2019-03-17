import {createLogger} from "./Logger";

export class GraphicsPresenter{

  constructor(stage, renderer){
    this.logger = createLogger('GraphicsPresenter');
    this.graphics = [];
    this.resetMinMax();
    this.renderer = renderer;
    this.stage = stage;
    this.firstXIndex = 0;
    this.lastXindex = undefined;
  }

  resetMinMax() {
    this.minY = Number.MAX_SAFE_INTEGER;
    this.maxY = 0;
  }

//TODO make one x set and interpolate y
  addGraphic(graphic){
    this.graphics.push(graphic);
    if(this.lastXindex === undefined) {
      this.lastXindex = graphic.x.length;
    }
    const gminMaxY = graphic.getMinMaxByIndexes(this.firstXIndex, this.lastXindex);
    this.logger.log('MinMaxY',  gminMaxY);
    this.minY = Math.min(gminMaxY.min, this.minY);
    this.maxY = Math.max(gminMaxY.max, this.maxY);
  }

  clear(){
    this.renderer.clear();
  }

  draw(firstIndex,lastIndex) {
    if(isFinite(firstIndex) || isFinite(lastIndex)) {
      this.setXRange(firstIndex, lastIndex);
    }
    this.graphics.forEach( (graphic) => {
      this.drawGraphic(graphic);
    });
  };


  setXRange(firstIndex, lastIndex) {
    if ((isFinite(firstIndex) && firstIndex !== this.firstXIndex) || (isFinite(lastIndex) && lastIndex !== this.lastXindex)) {
      this.firstXIndex = firstIndex;
      this.lastXindex = lastIndex;
      this.resetMinMax();
      this.graphics.forEach((graphic) => {
        const gminMaxY = graphic.getMinMaxByIndexes(this.firstXIndex, this.lastXindex);
        this.logger.log('MinMaxY', gminMaxY);
        this.minY = Math.min(gminMaxY.min, this.minY);
        this.maxY = Math.max(gminMaxY.max, this.maxY);
      });
    }
  }

  drawGraphic(graphic) {
    let x0, y0;
    const yRange = this.maxY - this.minY;
    const xRange = this.lastXindex - this.firstXIndex;
    const xMult = this.stage.width / xRange;
    const yMult = this.stage.height / yRange;

    for (let i = this.firstXIndex; i < this.lastXindex; i++) {
      if (x0 === undefined) {
        x0 = (i - this.firstXIndex) * xMult;
        y0 = (graphic.y[i] - this.minY) * yMult;
        continue;
      }
      let x = (i - this.firstXIndex)  * xMult;
      let y = (graphic.y[i] - this.minY) * yMult;
      this.renderer.line({x: x0, y: y0}, {x: x, y: y}, graphic.color);
      this.logger.log(`x:${x} y:${y}`);
      x0 = x;
      y0 = y;

    }
  }
}