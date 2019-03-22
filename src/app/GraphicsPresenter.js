import { createLogger } from "./Logger";

export class GraphicsPresenter {
  constructor(renderer) {
    this.logger = createLogger("GraphicsPresenter");
    this.yDatas = [];
    this.resetMinMax();
    this.stage = {
      width: 1000,
      height: 1000
    };
    this.firstXIndex = 0;
    this.lastXindex = undefined;
    this.renderer = renderer;
  }

  setYPresenter(yPresenter) {
    this.yPresenter = yPresenter;
  }

  setXPresenter(xPresenter) {
    this.xPresenter = xPresenter;
  }

  resetMinMax() {
    this.minY = Number.MAX_SAFE_INTEGER;
    this.maxY = 0;
  }

  setXCount(xCount) {
    this.xCount = xCount;
    this.lastXindex = xCount.x.length - 1;
  }

  addYData(yData) {
    this.yDatas.push(yData);

    const gminMaxY = yData.getMinMaxByIndexes(
      this.firstXIndex,
      this.lastXindex
    );
    this.logger.log("MinMaxY", gminMaxY);
    this.minY = Math.min(gminMaxY.min, this.minY);
    this.maxY = Math.max(gminMaxY.max, this.maxY);
  }

  clear() {
    this.renderer.clear();
    if (this.yPresenter) {
      this.yPresenter.clear();
    }
    if (this.xPresenter) {
      this.xPresenter.clear();
    }
  }

  draw(firstIndex, lastIndex) {
    if (isFinite(firstIndex) || isFinite(lastIndex)) {
      this.setXRange(firstIndex, lastIndex);
    }
    this.yDatas.forEach(yData => {
      if (yData.enabled) {
        this.drawGraphic(yData);
      }
    });
  }

  setXRange(firstIndex, lastIndex) {
    if (
      (isFinite(firstIndex) && firstIndex !== this.firstXIndex) ||
      (isFinite(lastIndex) && lastIndex !== this.lastXindex)
    ) {
      this.firstXIndex = firstIndex;
      this.lastXindex = lastIndex;
      this.resetMinMax();
      this.yDatas.forEach(yData => {
        if (yData.enabled) {
          const gminMaxY = yData.getMinMaxByIndexes(
            this.firstXIndex,
            this.lastXindex
          );
          this.logger.log("MinMaxY", gminMaxY);
          this.minY = Math.min(gminMaxY.min, this.minY);
          this.maxY = Math.max(gminMaxY.max, this.maxY);
        }
      });
    }
  }

  getYbyValue(value) {
    return (value - this.minY) * (this.stage.height / (this.maxY - this.minY));
  }

  getXbyIndex(index) {
    const xRange = this.lastXindex - this.firstXIndex;
    const xMult = this.stage.width / xRange;
    let x = (index - this.firstXIndex) * xMult;
    return x;
  }



  //TODO try Path2D
  drawGraphic(yData) {
    const yRange = this.maxY - this.minY;
    const xRange = this.lastXindex - this.firstXIndex;
    const xMult = this.stage.width / xRange;
    const yMult = this.stage.height / yRange;

    this.renderer.prepToDraw(yData.color);
    for (let i = this.firstXIndex; i <= this.lastXindex; i++) {
      let x = (i - this.firstXIndex) * xMult;
      let y = (yData.y[i] - this.minY) * yMult;
      if (i === this.firstXIndex) {
        this.renderer.moveTo({ x, y });
        this.logger.log(`m x:${x} y:${y}`);
      } else {
        this.renderer.lineTo({ x, y });
        this.logger.log(`x:${x} y:${y}`);
      }
      if (this.yPresenter) {
        this.yPresenter.drawLine(y, yData.y[i]);
      }
      if (this.xPresenter) {
        this.xPresenter.drawLine(x, this.xCount.x[i]);
      }
    }

    this.renderer.finishDraw();
    if (this.yPresenter) {
      this.yPresenter.finishDraw(this);
    }
    if (this.xPresenter) {
      this.xPresenter.finishDraw(this);
    }
  }
}
