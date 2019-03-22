import {createLogger} from "./Logger";

export default class YPresenter {
  constructor(renderer) {
    this.logger = createLogger("YPresenter");
    this.stage = {
      width: 1000,
      height: 1000
    };
    this.steps = 5;
    this.textX = 40;
    this.borderLeft = 5;
    this.textLineWidth = 15;
    this.textStrokeStyle = "white";
    this.textFillStyle = "black";
    this.valueLineStokeStyle = "rgba(220,220,220,0.5)";
    this.renderer = renderer;
    this.renderer.font = "32px sans-serif";
    this.renderer.textBaseline = "middle";
  }

  drawLine(y, value, color) {
    this.renderer.line(
      { x: 0, y },
      { x: this.stage.width, y: y },
      this.valueLineStokeStyle
    );
    this.logger.debug("y:", y, " value:", value);
  }

  drawText(y, value) {
    this.renderer.line(
      { x: this.borderLeft, y },
      { x: this.stage.width, y: y },
      this.textFillStyle
    );
    this.renderer.prepToDraw();
    this.renderer.strokeStyle = this.textStrokeStyle;
    this.renderer.lineWidth = this.textLineWidth;
    this.renderer.fillStyle = this.textFillStyle;
    this.renderer.scale(1, -1);
    this.renderer.strokeText(value, this.textX, -y);
    this.renderer.fillText(value, this.textX, -y);
    this.renderer.finishDraw();
  }

  clear() {
    this.renderer.clear();
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
