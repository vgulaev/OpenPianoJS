class TimePoint {
  constructor(timeMachine) {
    this.notes = [];
    this.g = SVGBuilder.createSVG('g');
    timeMachine.sheet.g.append(this.g);
  }

  push(element) {
    if ('note' == element.xml.tagName) {
      this.notes.push(element);
    }
    // console.log('push', element);
  }
}
