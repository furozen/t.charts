import YData from "./app/YData";
import graphic_data from '../data/chart_data.json';
import RendererCanvas from "./app/RendererCanvas";
import {GraphicsPresenter} from "./app/GraphicsPresenter";
import XCounts from "./app/XCounts";
import YPresenter from "./app/YPresenter";
import XPresenter from "./app/XPresenter";
import {createLogger, LoggerSetting, LogLevel} from "./app/Logger";
import {initRangeWindow} from "./app/dragUtils";


let context = window || global;

let app = context.app;
if (!app) {
  app = context.app = {};
  app.logger = createLogger('app');

  let requestAnimationFrame = window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame;

  window.requestAnimationFrame = requestAnimationFrame;
}


app.prepareAndGetCanvas = function (elementId) {
  let canvas = document.getElementById(elementId);
  let ctx2d = canvas.getContext('2d');
  ctx2d.resetTransform();
  canvas.style.display = 'block';
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  return ctx2d;
};
app.grapicsData = graphic_data;

const createElemenet = function (className, tagName , fragment ) {
  const element = document.createElement(tagName);
  let a = document.createAttribute('class');
  a.value = className;
  element.setAttributeNode(a);
  fragment.appendChild(element);
  return element;
};


app.createPlayground = (index) =>{
  const playground = document.getElementById('playground');
  while (playground.firstChild) {
    playground.removeChild(playground.firstChild);
  }
  const fragment = document.createDocumentFragment();

  const prepareAndGetCtx2d = function (canvas ) {
    let ctx2d = canvas.getContext('2d');
    ctx2d.resetTransform();
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    return ctx2d;
  };

  const descriptionDiv = createElemenet('description', 'div', fragment);
  descriptionDiv.appendChild( document.createTextNode(` graphic data #${index}`));

  const graphCanvas = createElemenet('graphCanvas','canvas', fragment);
  const xCoordCanvas = createElemenet('xCoordCanvas', 'canvas', fragment);
  const yCoordCanvas = createElemenet('yCoordCanvas', 'canvas', fragment);
  const narrowGraphCanvas = createElemenet('narrowGraphCanvas','canvas', fragment);

  const overtownWindow = createElemenet('overtownWindow','div', fragment);

  playground.appendChild(fragment);
  initRangeWindow(playground,overtownWindow);

  playground.addEventListener('OvertownPosChanged', (event) => {
    app.overtownPosChangedHandler(playground, overtownWindow);
  });

  return {
    graphCanvas:{
      canvas:graphCanvas,
      ctx2d:prepareAndGetCtx2d(graphCanvas)
    },
    narrowGraphCanvas:{
      canvas:narrowGraphCanvas,
      ctx2d:prepareAndGetCtx2d(narrowGraphCanvas)
    },
    xCoordCanvas:{
      canvas:xCoordCanvas,
      ctx2d:prepareAndGetCtx2d(xCoordCanvas)
    },
    yCoordCanvas:{
      canvas:yCoordCanvas,
      ctx2d:prepareAndGetCtx2d(yCoordCanvas)
    },
    descriptionDiv:descriptionDiv
  };

};


app.showGraphic = (index) => {
  const p = app.createPlayground(index);


  const renderer = new RendererCanvas(p.graphCanvas.ctx2d, p.graphCanvas.ctx2d.canvas.width, p.graphCanvas.ctx2d.canvas.height, 0, 0);
  const rendererY = new RendererCanvas(p.yCoordCanvas.ctx2d, p.graphCanvas.ctx2d.canvas.width, p.yCoordCanvas.ctx2d.canvas.height, 0, 0);
  const rendererX = new RendererCanvas(p.xCoordCanvas.ctx2d, p.xCoordCanvas.ctx2d.canvas.width, p.graphCanvas.canvas.height, 0, 0);

  let yPresenter = new YPresenter(rendererY);
  let xPresenter = new XPresenter(rendererX);

  let gp = app.gp = new GraphicsPresenter(renderer);
  gp.stage = {width: 1000, height: 900};

  const graphicDatum = graphic_data[index];

  const preparedData = {'graphs':[]};
  graphicDatum['columns'].forEach( (column, i) => {
    const name = column[0];
    const data = column.slice(1);
    const type = graphicDatum['types'][name];
    switch (type) {
      case 'x':
        preparedData['XCount'] = new XCounts(data);
        break;
      case 'line':
      {
        const graphName = graphicDatum['names'][name];
        const graphColor = graphicDatum['colors'][name];
        preparedData['graphs'].push(new YData(data, graphColor, graphName));
        const template = document.getElementById('graphHandlerTemplate');
        const handle = template.cloneNode(true);
        //todo make it wise
        const textEl = handle.lastChild;
        const trigger = handle.firstChild;
        trigger.dataset.graphIndex=preparedData['graphs'].length - 1;
        trigger.style.borderColor = graphColor;
        handle.id=`_gp${graphName}`;
        textEl.innerText = name;
        p['descriptionDiv'].appendChild(handle);
      }


        break;
      default:
        this.logger.warn(` found unsupport type '${type}' for graph data#${index}`);
        break;
    }
  });

  gp.setXCount(preparedData['XCount']);
  preparedData.graphs.forEach( (yData) => {
    gp.addYData(yData);
  });

  gp.setYPresenter(yPresenter);
  gp.setXPresenter(xPresenter);

  let lastIndex = gp.lastXIndex;
  let firstIndex = 0;

  gp.clear();
  gp.setXRange(firstIndex, lastIndex);
  gp.draw();

  //narrow graph
  {

    const ctx2d = p.narrowGraphCanvas.ctx2d;
    const renderer = new RendererCanvas(ctx2d, ctx2d.canvas.width, ctx2d.canvas.height, 0, 0);

    let gp = app.narrowGP = new GraphicsPresenter(renderer);

    gp.setXCount(preparedData['XCount']);
    preparedData.graphs.forEach( (yData) => {
      gp.addYData(yData);
    });

    gp.clear();
    gp.draw();

  }

};



app.handleTrigger = (event) => {
  const element = event.currentTarget;
  event.stopImmediatePropagation();
  event.preventDefault();
  element.classList.toggle('on');
  const index = parseInt(element.dataset.graphIndex);

  if(index!== undefined){
    if(element.classList.value.indexOf('on') !== -1){
      app.gp.yDatas[index].enable();
      app.narrowGP.yDatas[index].enable();
    } else {
      app.gp.yDatas[index].disable();
      app.narrowGP.yDatas[index].disable();
    }
    app.gp.redraw();
    app.narrowGP.redraw();
  }
};

app.handlerClick = (event) => {
  const element = event.currentTarget;
  element.classList.toggle('on');
  const index = parseInt(element.firstChild.dataset.graphIndex);

  if(index!== undefined){

    app.gp.yDatas[index].shadowLines = element.classList.value.indexOf('on') !== -1;

    app.gp.redraw();
    app.narrowGP.redraw();
  }
};

app.overtownPosChangedHandler = (playground, overtownWindow) => {
  let leftIndex = Math.floor(app.gp.maxXIndex * overtownWindow.offsetLeft / playground.clientWidth);
  let rightIndex = Math.ceil(app.gp.maxXIndex * (overtownWindow.offsetLeft + overtownWindow.offsetWidth) / playground.clientWidth);
  window.requestAnimationFrame(() => {
    app.gp.clear();
    app.gp.setXRange(leftIndex, rightIndex);
    app.gp.draw();

  })
};



app.run = () => {

  let requestAnimationFrame = window.requestAnimationFrame;

  for(let i = 0; i < graphic_data.length; i++) {

  }

  let xColumn = graphic_data[0]['columns'][0].slice(1);
  let yColumn = graphic_data[0]['columns'][1].slice(1);
  let yColumn2 = graphic_data[0]['columns'][2].slice(1);
  console.log(xColumn.length, xColumn);
  console.log(yColumn.length, yColumn);


  let xColumn4 = graphic_data[4]['columns'][0].slice(1);
  let yColumn40 = graphic_data[4]['columns'][1].slice(1);
  let yColumn41 = graphic_data[4]['columns'][2].slice(1);
  let yColumn42 = graphic_data[4]['columns'][3].slice(1);
  let yColumn43 = graphic_data[4]['columns'][4].slice(1);

  let xCounts = new XCounts(xColumn);
  let yData1 = new YData(yColumn, 'cyan');
  let yData2 = new YData(yColumn2, 'orange');
  console.log('g2', yColumn2.length, yColumn2);
  console.log('g2', yData2.getMinMaxByIndexes(10, 102));
  console.log(yData1.getMinMaxByIndexes(10, 102));

  let xCounts4 = new XCounts(xColumn4);
  let yData40 = new YData(yColumn40, 'cyan');
  let yData41 = new YData(yColumn41, 'green');
  let yData42 = new YData(yColumn42, 'red');
  let yData43 = new YData(yColumn43, 'blue');

  /* {
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
     renderCoord.drawLine(0, 0, stage.width, stage.height, xcoords, ycoords);


     const xMult = stage.width / xColumn.length;
     const yMult = stage.height / yRange;

     let drawLine = function (xCounts, yData, color) {
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
     drawLine(xCounts, yData1, 'red');
     drawLine(xCounts, yData2, 'blue');

     {  //drawLine packman
       ctx2d.beginPath();
       ctx2d.arc(57, 57, 13, Math.PI / 7, -Math.PI / 7, false);
       ctx2d.lineTo(51, 57);
       ctx2d.fill();
     }
   }*/

/*
  {
    let ctx2d = app.prepareAndGetCanvas("canvas2");
    const renderer = new RendererCanvas(ctx2d, ctx2d.canvas.width, ctx2d.canvas.height, 50, -500);

    let gp = new GraphicsPresenter(renderer);
    gp.stage = {width: 950, height: 500}
    gp.setXCount(xCounts);
    gp.addYData(yData1);
    gp.addYData(yData2);

    const lastIndex = xCounts.length - 1;
    let firstIndex = 0;
    const maxFirstIndex = 100;

    const update = () => {
      gp.clear();
      gp.setXRange(firstIndex, lastIndex);
      gp.draw();
      /!*      let tm = setTimeout(() => {
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
            }, 0);*!/
    };
    update();

  }*/

  {

    let ctx2d = app.prepareAndGetCanvas("canvasNarrowLong");
    const renderer = new RendererCanvas(ctx2d, ctx2d.canvas.width, ctx2d.canvas.height, 0, 0);

    let gp = new GraphicsPresenter(renderer);

    gp.setXCount(xCounts);
    gp.addYData(yData1);
    gp.addYData(yData2);

    const lastIndex = xCounts.length - 1;
    let firstIndex = 0;

    gp.clear();
    //gp.setXRange(firstIndex, lastIndex);
    gp.draw();


  }

   /*{
     document.getElementById('gp3').style.display = 'block';
     let ctx2d = app.prepareAndGetCanvas("canvas3");

     const renderer = new RendererCanvas(ctx2d, ctx2d.canvas.width, ctx2d.canvas.height, 0, -50);

     let ctxY2d = app.prepareAndGetCanvas("yCoords3");
     const rendererY = new RendererCanvas(ctxY2d, ctx2d.canvas.width, ctxY2d.canvas.height, 0, -50);
     let yPresenter = new YPresenter(rendererY);

     let ctxX2d = app.prepareAndGetCanvas("xCoords3");
     const rendererX = new RendererCanvas(ctxX2d, ctxX2d.canvas.width, ctx2d.canvas.height, 0, 0);
     let xPresenter = new XPresenter(rendererX);


     let gp = new GraphicsPresenter(renderer);
     gp.stage ={ width:1000, height:900}
     gp.setXCount(xCounts);
     gp.addYData(yData1);
     gp.addYData(yData2);

     const minY = gp.minY;
     const maxY = gp.maxY;
     const steps = 5;
     const yStepValue = (maxY - minY)/ steps;

     //yPresenter.drawSteps((minY-yStepValue)<0?0:(minY-yStepValue) , maxY + yStepValue, steps+1, gp );

     gp.setYPresenter(yPresenter);
     gp.setXPresenter(xPresenter);

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
       }, 20);
     };
     update();

   }*/

  /*{
    document.getElementById('gp4').style.display = 'block';
    let ctx2d = app.prepareAndGetCanvas("canvas4");
    const renderer = new RendererCanvas(ctx2d, ctx2d.canvas.width, ctx2d.canvas.height, 0, 0);

    let ctxY2d = app.prepareAndGetCanvas("yCoords4");
    const rendererY = new RendererCanvas(ctxY2d, ctx2d.canvas.width, ctxY2d.canvas.height, 0, 0);
    let yPresenter = new YPresenter(rendererY);

    let ctxX2d = app.prepareAndGetCanvas("xCoords4");
    const rendererX = new RendererCanvas(ctxX2d, ctxX2d.canvas.width, ctx2d.canvas.height, 0, 0);
    let xPresenter = new XPresenter(rendererX);


    let gp = new GraphicsPresenter(renderer);
    gp.stage = {width: 1000, height: 900}
    gp.setXCount(xCounts4);
    gp.addYData(yData40);
    gp.addYData(yData41);
    gp.addYData(yData42);
    gp.addYData(yData43);

    const minY = gp.minY;
    const maxY = gp.maxY;
    const steps = 5;
    const yStepValue = (maxY - minY) / steps;

    //yPresenter.drawSteps((minY-yStepValue)<0?0:(minY-yStepValue) , maxY + yStepValue, steps+1, gp );

    gp.setYPresenter(yPresenter);
    gp.setXPresenter(xPresenter);

    const lastIndex = 111;
    let firstIndex = 100;
    const maxFirstIndex = 100;

    gp.clear();
    gp.setXRange(firstIndex, lastIndex);
    gp.draw();


  }*/



};

export default app;