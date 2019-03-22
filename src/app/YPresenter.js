import {createLogger} from "./Logger";

export default class YPresenter{
  constructor(renderer){
    this.logger = createLogger('YPresenter');
    this.stage = {
      width: 1000,
      height: 1000
    };
    this.renderer = renderer;
    this.renderer.ctx.font = "32px serif";
    this.color = 0x000022;
    this.steps = 5;
  }

  draw(y, value, color){
    if(!color) {
      color = 'black';
    }
    this.renderer.line({x:0,y},{x:1000,y}, color);
    this.renderer.prepToDraw(color);
    this.renderer.ctx.scale(1, -1);
    this.renderer.ctx.fillText(value, 20, -y);
    this.renderer.finishDraw();
    this.logger.debug('y:', y, ' value:', value);
    //this.renderer.fillText(value, 20, y)
  }

  clear(){
    this.renderer.clear();
  }

  finishDraw(gp){
    this.logger.debug('minY:', gp.minY, ' maxY:', gp.maxY);
    let step = (gp.maxY - gp.minY) / this.steps ;
    for( let i=0; i < this.steps; i++ ){
      const value = Math.floor(i * step) + gp.minY;
      let y = gp.getYbyValue(value);
      this.draw(y, value, 'green');
    }
  }
}