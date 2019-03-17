

export class Scene {
  constructor(ctx2d, stageProps) {
    console.log("Hello, CanvasGame");
    this.ctx = ctx2d;
    this.stageProps = stageProps;

  }

  update() {
    this.ctx.clearRect(0, 0, this.stageProps.width, this.stageProps.height);
    //draw


    requestAnimationFrame(() => { this.update(); });
  }
}
