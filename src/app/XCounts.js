export default class XCounts{
  constructor(x){
    this.x = x;

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

  getMinXIndex(leftBorderX) {
    let l = this.x.length;

    for (let i = 0; i < l; i++) {
      if (this.x[i] > leftBorderX) {
        return i;
      }
    }
    return l - 1;
  }

}
