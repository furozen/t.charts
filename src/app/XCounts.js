export default class XCounts {
  constructor(x) {
    this.x = x;
  }

  get length() {
    return this.x.length;
  }

  getHintFormatedDate(index){
    const options = {weekday:'short', month: 'short', day: 'numeric'};
    return this.getFormattedDate(index, options);
  }

  getShortFormatedDate(index){
    const options = {month: 'short', day: 'numeric'};
    return this.getFormattedDate(index, options);
  }

  getFormattedDate(index, options) {
    const dateTimeFormat = new Intl.DateTimeFormat('en-GB', options);
    return dateTimeFormat.format(new Date(this.x[index]));
  }
}
