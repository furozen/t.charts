import {createLogger} from "./Logger";

export default class YPresenter{
  constructor(renderer){
    this.logger = createLogger('YPresenter');
    this.stage = {
      width: 1000,
      height: 1000
    };
    this.renderer = renderer;
    this.renderer.ctx.font = "32px sans-serif";
    this.color = 0x000022;
    this.steps = 5;
  }

  drawLine(y, value, color){
    if(!color) {
      color = 'black';
    }
    this.renderer.line({x:0,y},{x:1000,y}, color);
    this.logger.debug('y:', y, ' value:', value);
  }

  drawText(y, value, color) {
    this.renderer.prepToDraw(color);
    this.renderer.ctx.scale(1, -1);
    this.renderer.ctx.fillText(value, 20, -y);
    this.renderer.finishDraw();
  }

  clear(){
    this.renderer.clear();

  }

  finishDraw(gp){
    const minY = gp.minY;
    const maxY = gp.maxY;
    const steps = this.steps;
    const yStepValue = (maxY - minY)/ steps;
    this.drawSteps((minY-yStepValue)<0?0:(minY-yStepValue) , maxY + yStepValue, steps+1, gp );
    //this.drawSteps(minY, maxY, steps, gp);
  }

  drawSteps(minY, maxY, steps, gp) {
    this.logger.debug('minY:', minY, ' maxY:', maxY);
    let step = (maxY - minY) / steps;
    for (let i = 0; i < steps; i++) {
      const value = Math.floor(i * step + minY);
      let y = gp.getYbyValue(value);

      const textColor = 'green';
      const color = 'gray';
      this.drawText(y, value, textColor);
      this.drawLine(y, value, color)
    }
  }
}