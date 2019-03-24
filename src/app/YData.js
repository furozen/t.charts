export default class YData {
  constructor(y, color, name, shadowLines = false) {
    this.y = y;
    this.color = color;
    this.enabled = true;
    this.name = name;
    this.shadowLines = shadowLines;
  }

  disable() {
    this.enabled = false;
  }

  enable() {
    this.enabled = true;
  }

  getMinMaxByIndexes(left, right) {
    if (!!!left) {
      left = 0;
    }
    if (!!!right) {
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
