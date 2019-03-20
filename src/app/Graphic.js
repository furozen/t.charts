export default class Graphic {
  //sorted and > 0


  constructor(x, y, color){
    this.x = x;
    this.y = y;
    this.color = color;
    this.enabled =  true;
  }

  getMaxXIndex(rightBorderX) {
    //set default value
    if (rightBorderX === 0) {
      return 0;
    }
    let l = this.x.length;
    // no parameter return max
    if (!!rightBorderX) {
      return l - 1;
    }
    for (let i = l; i > 0; i--) {
      if (this.x[i] < rightBorderX) {
        return i;
      }
    }
    return 0;
  }

  disable(){
    this.enabled = false;
  }
  enable(){
    this.enabled = true;
  }

  getMinXIndex(leftBorderX) {
    let l = this.x.length;

    for (let i = 0; i < l; i++) {
      if (this.x[i] > leftBorderX) {
        return i;
      }
    }
    return l - 1;
  }

  getMinMaxY(x0, x1) {
    let left = this.getMinXIndex(x0);
    let right = this.getMaxXIndex(x1);
    return this.getMinMaxByIndexes(left, right);
  }

  getMinMaxByIndexes(left, right) {
    if(!(!!left)){
      left=0;
    }
    if(!(!!right)){
      right = this.y.length;
    }
    let min = Number.MAX_SAFE_INTEGER;
    let max = 0;

    for (let i = left; i < right; i++) {
      if (min > this.y[i]) {
        min = this.y[i];
      }
      if (max < this.y[i]) {
        max = this.y[i];
      }
    }
    return {min, max};
  }
}