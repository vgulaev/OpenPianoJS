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
      } else if ('Home' == event.key) {
        this.curIndex = 0;
        this.setPoint(this.timeArrow[this.curIndex].x);
      } else if ('End' == event.key) {
        let x = this.sheet.measures[this.sheet.measures.length - 1].timePoint[0].x;
        this.curIndex = this.timeArrow.findIndex(e => e.x == x);
        this.setPoint(x)
      }
    });
  }

  assign(sheet) {
    this.sheet = sheet;
    this.timeArrow = sheet
      .measures
      .map((m, i) => Object
                      .keys(m.timePoint)
                      .sort((a, b) => a-b)
                      .map(t => ({m: i, t: t, x: m.timePoint[t].x})))
      .flat();
    // let x = this.sheet.measures[11].timePoint[0].x;
    // this.curIndex = this.timeArrow.findIndex(e => e.x == x);
    // this.setPoint(x)
    this.curIndex = 0;
    this.setPoint(this.timeArrow[this.curIndex].x);
  }

  setPoint(x) {
    this.curX = x;
    this.use.setAttributeNS(null, "x", 400 - this.curX);
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
    if (this.timeArrow.length - 1 == this.curIndex) return;
    this.curIndex += 1;
    this.setPoint(this.timeArrow[this.curIndex].x);
    // this.curX += 10;
    // this.setPoint(this.curX)
  }

  prev() {
    if (0 == this.curIndex) return;
    this.curIndex -= 1;
    this.setPoint(this.timeArrow[this.curIndex].x);
    // this.curX -= 10;
    // this.setPoint(this.curX)
  }

}
