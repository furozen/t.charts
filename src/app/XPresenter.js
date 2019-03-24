import AbstractCoordPresenter from "./AbstractCoordPresenter";
import {createLogger} from "./Logger";

export default class XPresenter extends AbstractCoordPresenter {

  constructor(renderer) {
    super(renderer);
    this.renderer.font = "32px sans-serif";
    this.renderer.textBaseline = "middle";
    this.renderer.ctx.textAlign = 'center';
    this.logger = createLogger("XPresenter");
  }

  drawLine(x, value) {
    this._drawLine(x, 0, x, this.stage.height);
    this.logger.verbose("x:", x, " value:", value);
  }

  drawText(x, value) {
    this._drawText(x, this.borderBottom, x, this.stage.height, value, x, this.textY - this.stage.height);
  }

  finishDraw(gp) {

    let fText = gp.xCount.getShortFormatedDate(gp.firstXIndex);
    const textMeasure = this.renderer.ctx.measureText(fText);
    const maxPos = Math.floor(this.renderer.width / textMeasure.width);
    const step = Math.floor((gp.lastXIndex - gp.firstXIndex) / Math.ceil(maxPos));

    for (let i = gp.firstXIndex + 1; i < gp.lastXIndex;) {
      fText = gp.xCount.getShortFormatedDate(i);
      const x = gp.getXbyIndex(i);
      this.drawText(x, fText);
      i += step;
    }

    this.logger.verbose(" fText:", fText, " textMeasure", textMeasure);
  }

}