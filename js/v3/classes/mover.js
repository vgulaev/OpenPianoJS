class Mover {
  constructor(grandStaff) {
    this.use = grandStaff.sheet.use;
    this.curX = 0;
    // this.tm = grandStaff.sheet.timeMachine;
    // this.at = this.tm.arrowOfTime;
    // this.status = 'stay'; //move
    // this.from = 0;
    // this.to = 0;
    // this.v0 = 50 / 1000;
    // this.a = 0;
  }

  setPoint(x) {
    this.curX = x;
    this.use.setAttributeNS(null, "x", 200 - this.curX);
  }

  updateStartPoint() {
    // this.curIndex = 0;
    // this.curKey = this.tm.tickKeys[0];
    // this.setPoint(this.at[this.curKey].x);
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

  moving() {
    let now = performance.now();
    let t = (now - this.lastUpdateTime);

    let x =  Math.floor(this.a * t * t / 2 + t * this.v0 + this.from);

    if (x != this.curX) {
      this.v0 = this.v0 + this.a * t;
      if (this.v0 < 50/1000) {
        this.v0 = 50/1000;
        this.a = 0;
      }
      this.lastUpdateTime = now;
      this.from = x;
      this.setPoint(x);
    }
    if (x > this.to) {
      this.setPoint(this.to);
      this.status = 'stay';
    }
    if ((this.to - this.curX) > 300) {
      this.a = (100/1000 - 50/1000) / 1500;
    }
    if ((this.to - this.curX) < 200) {
      this.a = -(100/1000 - 50/1000) / 1500;
    }

    // console.log(this.curX, x, this.to);
    if ('move' == this.status)
      requestAnimationFrame(() => this.moving());
  }


  startMove() {
    // if ('stay' == this.status) {
    //   this.from = this.curX;
    //   this.lastUpdateTime = performance.now();
    //   this.status = 'move';
    //   this.moving();
    // }
  }

  nextSmooth() {
    this.startGreenAnimation();
    this.curIndex += 1;
    this.curKey = this.tm.tickKeys[this.curIndex];
    this.to = this.at[this.curKey].x;
    this.startMove();
  }
}
