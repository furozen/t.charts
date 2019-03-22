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
    //this.renderer.ctx.textBaseline = "hanging";
    this.color = 0x000022;
  }

  draw(y, value){
    this.renderer.line({x:0,y},{x:1000,y},this.color);
    this.color += 0x000022;
    this.renderer.prepToDraw('black');
    this.renderer.ctx.scale(1, -1);
    this.renderer.ctx.fillText(value, 20, -y);

    this.logger.debug('y:', y, ' value:', value);
    //this.renderer.fillText(value, 20, y)
  }

  clear(){
    this.renderer.clear();
  }

  finishDraw(gp){
    this.logger.debug('minY:', gp.minY, ' maxY:', gp.maxY);

  }
}