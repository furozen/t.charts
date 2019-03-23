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
    this.logger.debug("x:", x, " value:", value);
  }

  drawText(x, value) {
    this._drawText(x, this.borderBottom, x, this.stage.height, value, x, this.textY - this.stage.height);
  }

  finishDraw(gp) {

    let fDate = new Date(gp.xCount.x[gp.firstXIndex]);
    const options = {month: 'short', day: 'numeric'};
    const dateTimeFormat = new Intl.DateTimeFormat('en-GB', options);
    let fText = dateTimeFormat.format(fDate);
    const textMeasure = this.renderer.ctx.measureText(fText);
    const maxPos = Math.floor(this.renderer.width / textMeasure.width);
    const steps = Math.ceil(maxPos);

    const step = Math.floor((gp.lastXindex - gp.firstXIndex) / steps);

    for (let i = gp.firstXIndex + 1; i < gp.lastXindex;) {

      fDate = new Date(gp.xCount.x[i]);
      fText = dateTimeFormat.format(fDate);
      this.logger.debug("fDate:", fDate, " fText:", fText);
      let x = gp.getXbyIndex(i);
      this.drawText(x, fText);
      i += step;
    }

    this.logger.debug("fDate:", fDate, " fText:", fText, " textMeasure", textMeasure);
    /* const yStepValue = (gp.maxY - gp.minY) / this.steps;
     const origin = gp.minY - yStepValue;
     this.drawSteps(
         origin < 0 ? 0 : origin,
         gp.maxY + yStepValue,
         this.steps + 1,
         gp
     );*/
  }

}