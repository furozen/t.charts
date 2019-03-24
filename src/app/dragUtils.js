import app from "../index";
import {createLogger} from "./Logger";

const logger = createLogger('dragUtil');

const addEventsListener = (element, events, handler) => {
  events.forEach(event => {
    element.addEventListener(event, handler);
  })
}

export const initRangeWindow = (container, overtown) => {
  let active = false;
  let initX;
  let offsetLeft;
  let clientWidth;
  let momentLeft;
  let momentWidth;
  const minWidth = Math.floor(container.clientWidth / 10);

  const dragStart = (event) => {
    if (event.target === overtown) {
      active = true;
      momentLeft = offsetLeft = overtown.offsetLeft;
      momentWidth = clientWidth = overtown.clientWidth;

      initX = event.type === "touchstart" ? event.touches[0].clientX : event.clientX;
      if (initX < offsetLeft + overtown.clientLeft + (overtown.offsetWidth - clientWidth)) {
        active = 'leftBorder';
      } else if (initX > offsetLeft + clientWidth + (overtown.offsetWidth - clientWidth) / 2) {
        active = 'rightBorder';
      }
    }
  };

  const dragEnd = () => {
    active = false;
    logger.debug(`switch auto=false dragEnd `);
  };

  const drag = (event) => {
    if (active) {

      event.preventDefault();

      let offsetOfMove = event.type === "touchmove" ? event.touches[0].clientX - initX : event.clientX - initX;
      if (offsetOfMove !== 0) {
        let left = offsetLeft + offsetOfMove;
        if (left < 0 && active !== 'rightBorder') {
          left = 0;
          active = false;
          logger.debug(`switch auto=false left < 0 && active !== 'rightBorder'`);
        }
        if (left + overtown.offsetWidth < container.clientWidth) {
          let newW;

          if (active === 'leftBorder') {
            if (left < momentLeft) {
              newW = clientWidth + -1 * offsetOfMove;
            } else if (left > momentLeft) {
              newW = clientWidth - offsetOfMove;
            }
          } else if (active === 'rightBorder') {

            if (left > momentLeft) {
              newW = clientWidth + offsetOfMove;
            } else if (left < momentLeft) {
              newW = clientWidth + offsetOfMove;
            }
          }

          if (newW > minWidth) {
            overtown.style.width = newW + "px";
          } else if (newW) { // will not be undefined
            if (active === 'rightBorder') {
              left = offsetLeft; //prevent jump
              initX = event.type === "touchstart" ? event.touches[0].clientX : event.clientX;
            }
            newW = undefined;
            active = true;
            logger.debug(`switch auto=true newW ${newW} > minWidth:${minWidth}`);
          }
          if (active !== 'rightBorder') {
            overtown.style.left = left + "px";
            momentLeft = left;
          }
          logger.debug(`${active} offset:${offsetLeft} offsetOfMove:${offsetOfMove} left:${left} momentLeft:${momentLeft} newW:${newW}  overtown.offsetLeft:${overtown.offsetLeft} `);


          if (newW !== undefined) {
            momentWidth = overtown.clientWidth;
          }
        } else {
          active = false;
        }

        container.dispatchEvent(new Event('OvertownPosChanged'));
      }
    }
  };
  addEventsListener(container, ["touchstart", "mousedown"], dragStart);
  addEventsListener(container, ["touchend", "mouseup"], dragEnd);
  addEventsListener(container, ["touchmove", "mousemove"], drag);

  playground.addEventListener('OvertownPosChanged', (event) => {
    event = event;
  });

};


export const canvasTouch = (canvas, touchCallback) => {
  let active = false;
  const dragStart = (event) => {
    if (event.target === canvas) {
      active = true;

      const rect = canvas.getBoundingClientRect();
      const pageX = event.type === "touchstart" ? event.touches[0].pageX : event.screenX;
      const pageY = event.type === "touchstart" ? event.touches[0].pageY : event.pageY;
      const x = pageX - (rect.left + window.pageXOffset);
      const y = pageY - (rect.top + window.pageYOffset);
      touchCallback({x, y});
    }
  };

  const dragEnd = () => {
    active = false;
    logger.debug(`canvasTouch dragEnd `);
  };

  const drag = (event) => {
    if (active) {
      const rect = canvas.getBoundingClientRect();
      const pageX = event.type === "touchmove" ? event.touches[0].pageX : event.screenX;
      const pageY = event.type === "touchmove" ? event.touches[0].pageY : event.pageY;
      const x = pageX - (rect.left + window.pageXOffset);
      const y = pageY - (rect.top + window.pageYOffset);
      touchCallback({x, y});
    }
  };
  addEventsListener(canvas, ["touchstart", "mousedown"], dragStart);
  addEventsListener(canvas, ["touchend", "mouseup"], dragEnd);
  addEventsListener(canvas, ["touchmove", "mousemove"], drag);

}
