import {Scene} from "./app/Scene";
import Graphic from "./app/Graphic";
import graphic_data from '../data/chart_data.json';
import RenderCoords from "./app/RenderCoords";
import RendererCanvas from "./app/RendererCanvas";
import {GraphicsPresenter} from "./app/GraphicsPresenter";


let context = window || global;

let app = context.app;
if (!app) {
  app = context.app = {};
}


app.run = () => {
  let requestAnimationFrame = window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame;

  window.requestAnimationFrame = requestAnimationFrame;

  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext('2d');
  ctx.resetTransform();
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  let xColumn = graphic_data[0]['columns'][0].slice(1);
  let yColumn = graphic_data[0]['columns'][1].slice(1);
  let yColumn2 = graphic_data[0]['columns'][2].slice(1);

  let graphic1 = new Graphic(xColumn, yColumn, 'cyan');
  console.log(xColumn.length, xColumn);
  console.log(yColumn.length, yColumn);
  console.log(graphic1.getMinMaxByIndexes(10, 102));

  let graphic2 = new Graphic(xColumn, yColumn2, 'orange');

  console.log('g2',yColumn2.length, yColumn2);
  console.log('g2',graphic2.getMinMaxByIndexes(10, 102));
  console.log('g2',graphic2.getMinMaxY(graphic2.x[10], graphic2.x[102]));




  const stage = {
    width : 1000,
    height:1000
  };
  let step = 50;
  let xsteps = stage.width / step;
  let ysteps = stage.height / step;
  let xstepsOnData = Math.round(xColumn.length / xsteps);
  const g1MinMaxY = graphic1.getMinMaxByIndexes();
  const g2MinMaxY = graphic2.getMinMaxByIndexes();
  console.log('g1MinMaxY', g1MinMaxY, 'g2MinMaxY', g1MinMaxY);
  const yMin = Math.min(g1MinMaxY.min,g2MinMaxY.min);
  const yRange = Math.max(g1MinMaxY.max,g2MinMaxY.max) - yMin;
  let ystepsOnData = Math.round((yRange) / ysteps);

  let xcoords = [], ycoords = [];

  for (let i = 0; i < xColumn.length; i++) {
    if (i % xstepsOnData === 0) {
      xcoords.push(xColumn[i]);
    }
  }

  for (let i = 0; i < yColumn.length; i++) {
    if (i % ystepsOnData === 0) {
      ycoords.push(yColumn[i]);
    }
  }
  console.log(`xcoords xsteps:${xsteps} xstepsOnData:${xstepsOnData}`, xcoords);
  console.log(`ycoords ysteps:${ysteps} ystepsOnData:${ystepsOnData}`, ycoords);
  console.log(`yRange :${yRange} `);

  const renderer = new RendererCanvas(ctx, canvas.width, canvas.height, 0, 0);
  const renderCoord = new RenderCoords(renderer, step);


  renderCoord.draw(0, 0, stage.width, stage.height, xcoords, ycoords);


  const xMult = stage.width / xColumn.length;
  const yMult = stage.height / yRange;
  let draw = function (graphic, color) {
    let x0, y0;
    for (let i = 0; i < graphic.x.length; i++) {
      if (x0 === undefined) {
        x0 = i * xMult;
        y0 = (graphic.y[i] - yMin) * yMult ;
        continue;
      }
      let x = i * xMult;
      let y = (graphic.y[i]-yMin) * yMult;
      renderer.line({x: x0, y: y0}, {x: x, y: y}, color);
      console.log(`x:${x} y:${y}`);
      x0 = x;
      y0 = y;

    }
  };
  draw(graphic1, 'red');
  draw(graphic2, 'blue');


  console.log(`ctx ${ctx}`);
  ctx.beginPath();
  ctx.arc(57, 57, 13, Math.PI / 7, -Math.PI / 7, false);
  ctx.lineTo(51, 57);
  ctx.fill();


  {

    let canvas = document.getElementById("canvas2");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    let ctx = canvas.getContext('2d');
    const stage = {
      width : 1000,
      height:1000
    };
    ctx.resetTransform();

    const renderer = new RendererCanvas(ctx, canvas.width, canvas.height, 0, 0);

    let gp = new GraphicsPresenter(stage,renderer);
    gp.addGraphic(graphic1);
    gp.addGraphic(graphic2);
    const lastIndex = 111;
    let firstIndex = 0;
    const maxFirstIndex = 100;

    const update = ()=>{
      gp.clear();
      gp.setXRange(firstIndex,lastIndex);
      gp.draw();

      requestAnimationFrame(() => {
        if(firstIndex<=maxFirstIndex) {
          update();
        }
        firstIndex+=5;
      });
    };
    update();

  }


  /*let scene = new Scene(ctx, stage);
  scene.update();*/
}

export default app;