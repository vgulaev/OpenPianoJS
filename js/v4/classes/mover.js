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

  assign(cc) {
    this.cc = cc;
    // let x = this.sheet.measures[11].timePoint[0].x;
    // this.curIndex = this.timeArrow.findIndex(e => e.x == x);
    // this.setPoint(x)
    this.curIndex = 0;
    this.setPoint(this.cc.items[this.curIndex].x);
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
    if (this.cc.items.length - 1 == this.curIndex) return;
    this.curIndex += 1;
    this.setPoint(this.cc.items[this.curIndex].x);
  }

  prev() {
    if (0 == this.curIndex) return;
    this.curIndex -= 1;
    this.setPoint(this.cc.items[this.curIndex].x);
  }

  step(pressed) {
    let c = this.cc.items[this.curIndex];
    let included = true;
    for (let k of [...c.keys]) {
      included &&= pressed.has(k);
      if (!included) break;
    }
    if (included) {
      this.next();
    } else {
      console.log(c.keys, pressed);
    }
    // console.log(included);
  }
}
