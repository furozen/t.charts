import {createLogger} from "./Logger";
import AbstractCoordPresenter from "./AbstractCoordPresenter";

export default class YPresenter extends AbstractCoordPresenter {

  constructor(renderer) {
    super(renderer);
    this.logger = createLogger("YPresenter");
  }

  drawLine(y, value) {
    this._drawLine(0, y, this.stage.width, y);
    this.logger.debug("y:", y, " value:", value);
  }

  drawText(y, value) {
    this._drawText(this.borderLeft, y, this.stage.width, y, value, this.textX, -y);
  }

  finishDraw(gp) {
    const yStepValue = (gp.maxY - gp.minY) / this.steps;
    const origin = gp.minY - yStepValue;
    this.drawSteps(
      origin < 0 ? 0 : origin,
      gp.maxY + yStepValue,
      this.steps + 1,
      gp
    );
  }

  drawSteps(minY, maxY, steps, gp) {
    this.logger.debug("minY:", minY, " maxY:", maxY);
    let step = (maxY - minY) / steps;
    for (let i = 0; i < steps; i++) {
      const value = Math.floor(i * step + minY);
      let y = gp.getYbyValue(value);
      this.drawText(y, value);
    }
  }

}
