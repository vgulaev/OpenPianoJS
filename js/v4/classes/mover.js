export class Mover {
  constructor(grandStaff) {
    this.use = grandStaff.sheet.use;
    this.curX = 0;
    this.initListeners();
  }

  initListeners() {
    window.addEventListener("keydown", event => {
      if (('ArrowRight' == event.key) || ('ArrowLeft' == event.key) || ('ArrowDown' == event.key)) {
        if ('ArrowRight' == event.key) {
          this.next();
        } else if ('ArrowLeft' == event.key) {
          this.prev();
        }
      }
    });
  }

  setPoint(x) {
    this.curX = x;
    this.use.setAttributeNS(null, "x", 200 - this.curX);
  }

  updateStartPoint() {
    this.setPoint(0);
  }

  startGreenAnimation() {
    var c = this.at[this.curKey].g.getElementsByTagName("animate");
    for (var e of c) {
      e.beginElement();
    }
  }

  next() {
    this.curX += 10;
    this.setPoint(this.curX)
  }

  prev() {
    this.curX -= 10;
    this.setPoint(this.curX)
  }

}
