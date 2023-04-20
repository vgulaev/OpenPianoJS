import {emm} from '../../common/glyphName.js'
import {Note} from './xml/note.js';
import {SVGBuilder} from './svgBuilder.js';
import {Ut} from './ut.js';

export class Mover {
  constructor(app) {
    this.app = app;
    this.header = app.grandStaff.header;
    this.g = app.sheet.sheetMusic;
    this.curX = 0;
    this.curV = 200 / 2000;
    this.status = 'stopped';
    this.initListeners();
    Ut.addEvents(this, ['onNext', 'onSheetEnd', 'beforeIndexUpdated', 'afterIndexUpdated', 'onErrorNotePressed']);
    this.debug = document.getElementById('Debug');
  }

  initListeners() {
    window.addEventListener('keydown', event => {
      if (('ArrowRight' == event.key) || ('ArrowLeft' == event.key) || ('ArrowDown' == event.key)) {
        if ('ArrowRight' == event.key) {
          this.next();
        } else if ('ArrowLeft' == event.key) {
          this.prev();
        }
      } else if ('Home' == event.key) {
        this.setCurIndex(0);
      } else if ('End' == event.key) {
        // let x = this.sheet.measures[this.sheet.measures.length - 1].timePoint[0].x;
        // this.curIndex = this.timeArrow.findIndex(e => e.x == x);
        let x = this.cc.items[this.cc.items.length - 1].x;
        this.setPoint(x)
      }
    });

    window.addEventListener('touchstart', event => {
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

  getCurrentCC() {
    return this.cc.items[this.curIndex];
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

  rehide() {
    // return
    if (this.lastReHidded == Math.floor(this.curX / 500)) {
      return
    }
    this.lastReHidded = Math.floor(this.curX / 500)
    // console.log('rehide should apply', this.lastReHidded, this.g)
    const leftX = this.lastReHidded * 500 - 1500
    const rightX = this.lastReHidded * 500 + 1500

    const texts = this.g.querySelectorAll('text')
    texts.forEach(e => {
      const eX = e.getAttributeNS(null, 'x')
      if (leftX < eX && eX < rightX) {
        e.style.display = 'inline'
      } else {
        e.style.display = 'none'
      }
    })
    const lines = this.g.querySelectorAll('line')
    lines.forEach(e => {
      const eX = e.getAttributeNS(null, 'x1')
      if (leftX < eX && eX < rightX) {
        e.style.display = 'inline'
      } else {
        e.style.display = 'none'
      }
    })
  }

  setPoint(x) {
    this.curX = x;
    this.g.setAttributeNS(null, 'transform',`translate(${400 - this.curX})`);
    this.rehide()
  }

  getAnimation(o) {
    let a = ['stroke', 'fill'].map(attr => {
      let e = SVGBuilder.createSVG('animate');
      e.setAttributeNS(null, 'attributeName', attr);
      e.setAttributeNS(null, 'from', 'green');
      e.setAttributeNS(null, 'to', o.to);
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
      let a = this.getAnimation({to: (n.notehead?.color || 'black')});
      a.forEach(e => n.g.append(e));
      a.forEach(e => e.beginElement());
    });
  }

  dXYZ(name, x1, x0) {
    return this.cc.items[x1][name] - this.cc.items[x0][name];
  }

  averageV(dt) {
    if (0 == this.curIndex) return this.curV;
    let index = this.curIndex - 1;
    for (let i = 0; i < 6; i++) {
      if (index < 0) break;
      if (!this.cc.items[index].time) break;
      index -= 1;
    }
    index += 1;
    if (index < 0) return this.curV;
    let v = this.dXYZ('x', this.curIndex - 1, index) / this.dXYZ('time', this.curIndex - 1, index);
    if (!v) return this.curV;
    if (this.moveTo - this.curX > 150) return v *= 1.5;
    v = this.curV + (v - this.curV) / 4000 * dt;

    return Math.max(v, 0.05);
  }

  move() {
    let time = performance.now();
    let dt = (time - this.lastMovedTime);
    let dx = dt * this.curV;
    if (dx > 1) {
      this.lastMovedTime = time;
      this.curV = this.averageV(dt);
      this.curX += dx;
      this.setPoint(Math.floor(this.curX));
    }
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
    this.cc.items[this.curIndex].time = performance.now();
    if (this.cc.items.length - 1 == this.curIndex) return this.dispatchEvent('onSheetEnd');
    this.startGreenAnimation();
    this.dispatchEvent('beforeIndexUpdated');
    this.app.tempoMaster.tick(this.cc.items[this.curIndex]);
    this.curIndex += 1;
    this.dispatchEvent('afterIndexUpdated');
    this.moveTo = this.cc.items[this.curIndex].x;
    this.updateHeader();
    this.startMove();
    this.dispatchEvent('onNext');
    if (0 == this.cc.items[this.curIndex].keys.size) {
      this.next();
    };
    // this.setPoint(this.cc.items[this.curIndex].x);
  }

  prev() {
    if (0 == this.curIndex) return;
    this.curIndex -= 1;
    this.dispatchEvent('afterIndexUpdated');
    let x = this.cc.items[this.curIndex].x;
    this.moveTo = x;
    this.setPoint(x);
    this.updateHeader();
  }

  drawWrongNote(note) {
      let c = this.cc.items[this.curIndex];
      note.stepLine = note.setStepLine();
      note.y = note.drawY({drawClefs: c.tp.headerClefs});
      let g = SVGBuilder.createSVG('g');
      let n = note.drawG(c.tp.headerClefs);
      let acc = {
        '-1': 'flat',
        0: 'natural',
        1: 'sharp'
      }[note.pitch.alter]
      let a = SVGBuilder.emmentaler({x: note.x - 14, y: note.y, text: emm.Accidental[acc]});
      ['stroke', 'fill'].forEach(attr => {
        n.setAttributeNS(null, attr, 'red');
        a.setAttributeNS(null, attr, 'red');
      });
      g.append(n);
      g.append(a);

      this.g.append(g);
      setTimeout(() => g.remove(), 1500);
  }

  drawWrongNotes(pressed) {
    let c = this.cc.items[this.curIndex];
    let wKeys = [...pressed].filter(k => !c.keys.has(k));
    if (0 == wKeys.length) return;
    let noteWithKey = c.notes.map(n => [n, n.midiByte])
    wKeys.forEach(wk => {
      let nearNote = noteWithKey.map(nwk => [nwk[0], Math.abs(nwk[1] - wk)]).sort((a, b) => a[1]-b[1])[0][0];
      let wNote = Object.assign({}, nearNote);
      Object.setPrototypeOf(wNote, new Note());

      let octave = Math.floor((wk - 12) / 12);
      let step = wk - 12 - octave * 12;
      let alter = 0;
      if (!Note.tonesToS[step]) {
        if (c.tp.measure.fifths.fifths < 0) {
          alter = -1;
        } else {
          alter = 1;
        }
        step = step - alter;
      }
      wNote.pitch = {
        octave: octave,
        step: Note.tonesToS[step],
        alter: alter
      };
      this.drawWrongNote(wNote);
    });
  }

  checkNoteCorrectness(midiByte) {
    let c = this.cc.items[this.curIndex];
    if (c.keys.has(midiByte)) return;
    this.app.sheet.errors += 1;
    this.dispatchEvent('onErrorNotePressed');
    this.drawWrongNotes(new Set([midiByte]));
  }

  step(pressed) {
    let c = this.cc.items[this.curIndex];
    let included = true;
    for (let k of [...c.keys]) {
      included &&= pressed.has(k);
      if (!included) break;
    }
    if (included) {
      c.keys.forEach(k => {pressed.delete(k)});
      this.next();
    } else {
      // this.drawWrongNotes(pressed);
    }
  }
}
