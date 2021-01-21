import {SVGBuilder} from './svgBuilder.js';

export class Mover {
  constructor(app) {
    this.app = app;
    this.header = app.grandStaff.header;
    this.g = app.sheet.g;
    this.curX = 0;
    this.curV = 0;
    this.status = 'stopped';
    this.initListeners();
    this.events = {
      onNext: [],
      onSheetEnd: []
    };
  }

  addEventListener(eventName, callBack) {
    this.events[eventName].push(callBack);
  }

  dispatchEvent(eventName) {
    this.events[eventName].forEach(e => e.call(null, this));
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

    window.addEventListener("touchend", event => {
      let changedTouches = event.changedTouches;
      if (0 == changedTouches.length) return;
      if (changedTouches[0].pageY < this.app.ui.UIHeader.getBoundingClientRect().bottom * 1.1) return;
      let board = document.body.offsetWidth / 2;
      if (changedTouches[0].pageX < board) {
        this.prev();
      } else {
        this.next();
      }
    });
  }

  assign(cc) {
    this.cc = cc;
    this.setCurIndex(0);
  }

  setCurIndex(index) {
    this.curIndex = index;
    this.moveTo = this.cc.items[this.curIndex].x;
    this.setPoint(this.moveTo);
    this.updateHeader();
  }

  updateHeader() {
    let tp = this.cc.items[this.curIndex].tp;
    let clefs = tp.headerClefs;
    this.header.setClef(clefs[1]);
    this.header.setClef(clefs[2]);
    this.header.setKeySignature(tp.measure.fifths.fifths);
    this.header.setKeySignature(tp.measure.fifths.fifths);
    this.header.setTimeSignature(tp.measure.timeSignature);
  }

  setPoint(x) {
    this.curX = x;
    this.g.setAttributeNS(null, 'transform',`translate(${400 - this.curX})`);
  }

  getAnimation() {
    let a = ['stroke', 'fill'].map(attr => {
      let e = SVGBuilder.createSVG('animate');
      e.setAttributeNS(null, 'attributeName', attr);
      e.setAttributeNS(null, 'from', 'green');
      e.setAttributeNS(null, 'to', 'black');
      e.setAttributeNS(null, 'dur', '2s');
      e.addEventListener('endEvent', () => {
        setTimeout(() => e.remove(), 2000);
      });
      return e;
    });
    return a;
  }

  startGreenAnimation() {
    let c = this.cc.items[this.curIndex];

    c.notes.forEach(n => {
      let a = this.getAnimation();
      a.forEach(e => n.g.append(e));
      a.forEach(e => e.beginElement());
    });
  }

  averageV() {
    let startIndex = this.curIndex - 1;
    if (startIndex < 1) return 0;
    if (!this.cc.items[startIndex].time) return 0;
    let s = this.cc.items[startIndex].time
    let endIndex = -1;
    for (let i = 1; i < 6; i++) {
      endIndex = startIndex - i;
      if (endIndex < 0) break;
      if (!this.cc.items[startIndex].time) break;
    }
    if (!e) return 0;

  }

  move() {
    let time = performance.now();
    // let dx = (time - this.lastMovedTime) *
    this.curX += 1;
    this.setPoint(this.curX);
    if (this.curX < this.moveTo) {
      requestAnimationFrame(() => this.move());
    } else {
      this.curX = this.moveTo;
      this.status = 'stopped';
    }
  }

  startMove() {
    if ('stopped' == this.status) {
      this.status = 'move';
      this.lastMovedTime = performance.now();
      this.move();
    }
  }

  next() {
    if (this.cc.items.length - 1 == this.curIndex) return this.dispatchEvent('onSheetEnd');
    this.startGreenAnimation();
    this.cc.items[this.curIndex].time = performance.now();
    this.curIndex += 1;
    this.moveTo = this.cc.items[this.curIndex].x;
    this.updateHeader();
    this.startMove();
    this.dispatchEvent('onNext');
    // this.setPoint(this.cc.items[this.curIndex].x);
  }

  prev() {
    if (0 == this.curIndex) return;
    this.curIndex -= 1;
    let x = this.cc.items[this.curIndex].x;
    this.moveTo = x;
    this.setPoint(x);
    this.updateHeader();
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
