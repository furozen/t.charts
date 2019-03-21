import YData from "./app/YData";
import graphic_data from '../data/chart_data.json';
import RenderCoords from "./app/RenderCoords";
import RendererCanvas from "./app/RendererCanvas";
import {GraphicsPresenter} from "./app/GraphicsPresenter";
import XCounts from "./app/XCounts";


let context = window || global;

let app = context.app;
if (!app) {
  app = context.app = {};
}


app.prepareAndGetCanvas = function (elementId) {
  let canvas = document.getElementById(elementId);
  let ctx2d = canvas.getContext('2d');
  ctx2d.resetTransform();
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  return ctx2d;
};

app.run = () => {
  let requestAnimationFrame = window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame;

  window.requestAnimationFrame = requestAnimationFrame;

  let xColumn = graphic_data[0]['columns'][0].slice(1);
  let yColumn = graphic_data[0]['columns'][1].slice(1);
  let yColumn2 = graphic_data[0]['columns'][2].slice(1);
  console.log(xColumn.length, xColumn);
  console.log(yColumn.length, yColumn);

  let xCounts = new XCounts(xColumn);
  let yData1 = new YData(yColumn, 'cyan');

  console.log(yData1.getMinMaxByIndexes(10, 102));

  let yData2 = new YData(yColumn2, 'orange');
  console.log('g2', yColumn2.length, yColumn2);
  console.log('g2', yData2.getMinMaxByIndexes(10, 102));

  {
    let ctx2d = app.prepareAndGetCanvas("canvas");

    const renderer = new RendererCanvas(ctx2d, ctx2d.canvas.width, ctx2d.canvas.height, 0, 0);

    const stage = {
      width: 1000,
      height: 1000
    };
    let step = 50;
    let xsteps = stage.width / step;
    let ysteps = stage.height / step;
    let xstepsOnData = Math.round(xColumn.length / xsteps);
    const g1MinMaxY = yData1.getMinMaxByIndexes();
    const g2MinMaxY = yData2.getMinMaxByIndexes();
    console.log('g1MinMaxY', g1MinMaxY, 'g2MinMaxY', g1MinMaxY);
    const yMin = Math.min(g1MinMaxY.min, g2MinMaxY.min);
    const yRange = Math.max(g1MinMaxY.max, g2MinMaxY.max) - yMin;
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


    const renderCoord = new RenderCoords(renderer, step);
    renderCoord.draw(0, 0, stage.width, stage.height, xcoords, ycoords);


    const xMult = stage.width / xColumn.length;
    const yMult = stage.height / yRange;

    let draw = function (xCounts, yData, color) {
      let x0, y0;
      for (let i = 0; i < xCounts.x.length; i++) {
        if (x0 === undefined) {
          x0 = i * xMult;
          y0 = (yData.y[i] - yMin) * yMult;
          continue;
        }
        let x = i * xMult;
        let y = (yData.y[i] - yMin) * yMult;
        renderer.line({x: x0, y: y0}, {x: x, y: y}, color);
        console.log(`x:${x} y:${y}`);
        x0 = x;
        y0 = y;

      }
    };
    draw(xCounts, yData1, 'red');
    draw(xCounts, yData2, 'blue');

    {  //draw packman
      ctx2d.beginPath();
      ctx2d.arc(57, 57, 13, Math.PI / 7, -Math.PI / 7, false);
      ctx2d.lineTo(51, 57);
      ctx2d.fill();
    }
  }



  {
    let ctx2d = app.prepareAndGetCanvas("canvas2");
    const renderer = new RendererCanvas(ctx2d, ctx2d.canvas.width, ctx2d.canvas.height, 0, 0);

    let gp = new GraphicsPresenter(renderer);

    gp.setXCount(xCounts);
    gp.addYData(yData1);
    gp.addYData(yData2);

    const lastIndex = 111;
    let firstIndex = 0;
    const maxFirstIndex = 100;

    const update = () => {
      gp.clear();
      gp.setXRange(firstIndex, lastIndex);
      gp.draw();
      let tm = setTimeout(() => {
        requestAnimationFrame(() => {
          if (firstIndex <= maxFirstIndex) {
            update();
          }
          firstIndex += 5;
          if (firstIndex > 50) {
            yData1.disable();
          }
          clearTimeout(tm);
        })
      }, 0);
    };
    update();

  }

  {

    let ctx2d = app.prepareAndGetCanvas("canvasNarrowLong");
    const renderer = new RendererCanvas(ctx2d, ctx2d.canvas.width, ctx2d.canvas.height, 0, 0);

    let gp = new GraphicsPresenter(renderer);

    gp.setXCount(xCounts);
    gp.addYData(yData1);
    gp.addYData(yData2);

    const lastIndex = 111;
    let firstIndex = 0;

    gp.clear();
    //gp.setXRange(firstIndex, lastIndex);
    gp.draw();


  }


  /*let scene = new Scene(ctx, stage);
  scene.update();*/
}

export default app;