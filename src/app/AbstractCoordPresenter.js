import {createLogger} from "./Logger";

export default class AbstractCoordPresenter {

  constructor(renderer) {
    this.stage = {
      width: 1000,
      height: 1000
    };
    this.steps = 5;
    this.textX = 40;
    this.textY = 40;
    this.borderLeft = 5;
    this.borderBottom = 5;
    this.textLineWidth = 15;
    this.textStrokeStyle = "white";
    this.textFillStyle = "black";
    this.valueLineStokeStyle = "rgba(220,220,220,0.5)";
    this.renderer = renderer;
    this.renderer.font = "32px sans-serif";
    this.renderer.textBaseline = "middle";
  }

  _drawLine(x0, y0, x1, y1) {
    this.renderer.line(
        {x: x0, y: y0},
        {x: x1, y: y1},
        this.valueLineStokeStyle
    );
  }

  _drawText(x0, y0, x1, y1, value, textX, textY) {
    this.renderer.line(
        {x: x0, y: y0},
        {x: x1, y: y1},
        this.textFillStyle
    );
    this.renderer.prepToDraw();
    this.renderer.strokeStyle = this.textStrokeStyle;
    this.renderer.lineWidth = this.textLineWidth;
    this.renderer.fillStyle = this.textFillStyle;
    this.renderer.scale(1, -1);

    this.renderer.strokeText(value, textX, textY);
    this.renderer.fillText(value, textX, textY);
    this.renderer.finishDraw();
  }

  clear() {
    this.renderer.clear();
  }
}
