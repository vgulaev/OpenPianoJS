import {cconst} from '../../../common/commonConst.js'
import {emm} from '../../../common/glyphName.js'
import {Note} from './note.js';
import {StemBuilder} from './stemBuilder.js'
import {SVGBuilder} from '../svgBuilder.js';

export class TimePoint {
  constructor() {
    this.notes = [];
    this.voices = {};
    this.staff = {'1': [], '2': []};
  }

  push(el) {
    let className = el.constructor.name.toLowerCase();
    if ('function' == typeof this[className]) {
      this[className](el);
    }
  }

  note(el) {
    if (el.grace) {
      if (!this.graces) this.graces = {};
      if (this.graces[el.staff]) {
        this.graces[el.staff].push(el);
      } else {
        this.graces[el.staff] = [el];
      }
      return;
    }
    this.notes.push(el);
    this.staff[el.staff].push(el);
    if (this.voices[el.voice]) {
      this.voices[el.voice].push(el);
    } else {
      this.voices[el.voice] = [el];
    }
  }

  clef(el) {
    if (!this.clefs) {
      this.clefs = {};
    }
    this.clefs[el.number] = el;
  }

  key(el) {
    if (!this.fifths) {
      this.fifths = el;
    }
  }

  time(el) {
    if (!this.timeSignature) {
      this.timeSignature = el;
    }
  }

  drawSignature(pm) {
    if (this.clefs) {
      Object.keys(this.clefs).forEach(c => this.clefs[c].draw(pm));
      pm.cursor += 50;
    }
    if (this.fifths) {
      let g = SVGBuilder.keySignature(pm.drawClefs[1].toS(), pm.drawClefs[2].toS(), this.fifths.fifths, pm.cursor);
      pm.g.append(g);
      pm.cursor += Math.abs(this.fifths.fifths) * 14 + 10;
    }
    if (this.timeSignature) {
      let g = SVGBuilder.setTimeSignature(this.timeSignature['beats'], this.timeSignature['beat-type'], pm.cursor);
      pm.g.append(g);
      pm.cursor += 40;
    }
  }

  pushArpeggiate(pm, x, voice) {
    let edge = voice.sort((a, b) => a.stepLine - b.stepLine);
    let staff = edge[0].staff;
    edge = [edge[0], edge[edge.length - 1]].map(e => e.drawY(pm));

    let g = SVGBuilder.createSVG('g');
    for (let y = edge[0]; y > edge[1]; y -= 14) {
      let a = SVGBuilder.emmentaler({x: x, y: y, text: emm.Script.arpeggio});
      g.append(a);
    }
    pm.g.append(g);
  }

  checkArpeggiate(pm) {
    let voices = Object
      .keys(this.voices)
      .filter(e => this.voices[e][0].notations && this.voices[e][0].notations.arpeggiate);
    if (0 == voices.length) return;
    voices.forEach(e => {
      this.pushArpeggiate(pm, pm.cursor, this.voices[e]);
    });
    pm.cursor += 20;
  }

  drawAccidentalAtStaff(pm, staff) {
    let acc = staff.filter(n => n.accidental).sort((a, b) => a.drawLine(pm) - b.drawLine(pm));
    if (0 == acc.length) return 0;
    let x = 0;
    let lastLine = -100;
    let g = SVGBuilder.createSVG('g');
    let xs = acc.map(n => {
      let dl = n.drawLine(pm);
      if (lastLine == dl) return false;
      if (dl - lastLine < 4 && -x < 2 * cconst.accidentalWidth) {
        x -= cconst.accidentalWidth;
      } else {
        x = 0;
      }
      lastLine = dl;
      return {x: x, y: n.drawY(pm), text: emm.Accidental[n.accidental]};
    }).filter(e => e);
    let minX = Math.min(...(xs.map(e => e.x)));
    xs.forEach(e => {
      e.x = pm.cursor - minX + e.x;
      let a = SVGBuilder.emmentaler(e);
      g.append(a);
    });
    pm.g.append(g);
    return Math.abs(minX) + cconst.accidentalWidth + 4;
  }

  drawAccidental(pm) {
    let dX = ['1', '2'].map( s => this.drawAccidentalAtStaff(pm, this.staff[s]));
    pm.cursor += Math.max(...dX);
  }

  proccessBeforeNotesElements(pm) {
    this.checkArpeggiate(pm);
    this.drawAccidental(pm);
  }

  drawNotesOnStaff(pm, staff) {
    let lastLine = -100;
    let lastHead;
    let notes = staff.sort((a, b) => a.drawLine(pm) - b.drawLine(pm));
    let k = 1;
    let dWidth = 0;
    notes.filter(n => !n.rest).forEach(n => {
      let l = n.drawLine(pm);
      n.y = n.drawY(pm);
      n.x = pm.cursor;
      if (1 == l - lastLine) {
        if (1 == k) {
          n.x = pm.cursor + 17;
          dWidth = 17;
        }
        k *= -1;
      } else {
        k = 1;
      }
      n.draw(pm);
      lastLine = l;
      pm.sb.push(n);
    });
    return dWidth;
  }

  drawRests(pm) {
    [1, 2].forEach(s => {
      if (1 == this.staff[s].length) {
        if (this.staff[s][0].rest) this.staff[s][0].drawRest(pm);
      }
    });
  }

  drawNotes(pm) {
    let dx = [1, 2].map(s => this.drawNotesOnStaff(pm, this.staff[s]));
    this.drawRests(pm);
    pm.cursor += (40 + Math.max(...dx));
  }

  drawAdditionalLineNote(pm, note) {
    let l = note.drawLine(pm);
    let c = Math.floor(Math.abs(l > 0 ? l - 9 : l - 1) / 2);

    let kx = Math.sign(l)
    let key = (1 == kx ? 'yUp' : 'yDown');
    let x1 = pm.cursor - 7;
    let x2 = pm.cursor + 25;

    for (let i = 1; i <= c; i++) {
      let y = cconst.staff[note.staff][key] - kx * 15 * i;
      let e = SVGBuilder.line({x1: x1, y1: y, x2: x2, y2: y});
      pm.g.append(e);
    }
  }

  drawAdditionalLines(pm) {
    [1, 2].forEach(s => {
      let edge = this.staff[s]
        .filter(n => (undefined == n.rest) && (s == n.staff) && (n.drawLine(pm) < 0 || n.drawLine(pm) > 10))
        .sort((a, b) => a.drawLine(pm) - b.drawLine(pm));
      if (0 == edge.length) return;
      if (edge.length > 1) {
        edge = [edge[0], edge[edge.length - 1]];
      }
      edge.forEach(n => {
        this.drawAdditionalLineNote(pm, n);
      });
    });
  }

  drawAugmentationDotesAtStaff(pm, staff) {
    let doted = staff.filter(n => n.dot && !n.rest).sort((a,b)=> (a.y - b.y));
    if (0 == doted.length) return;

    let lastLine = 100;
    let a = doted.map(n => {
      let l = n.drawLine(pm);
      let newL = l;
      if (1 == Math.abs(l) % 2) {
        newL = ((lastLine == l + 1) ? l - 1 : l + 1);
      }
      lastLine = newL;
      return {l: newL, n: n};
    })
    .forEach(el => {
      let y = Note.baseY[el.n.staff] - 7.5 * el.l;
      let e = SVGBuilder.emmentaler({x: pm.cursor - 15, y: y, text: emm.Dot.dot});
      pm.g.append(e);
    });
  }

  drawAugmentationDotes(pm) {
    [1, 2].forEach(s => { this.drawAugmentationDotesAtStaff(pm, this.staff[s]) });
  }

  addNilsAtGraces() {
    let keys = Object.keys(this.graces);
    let gracesLength = Math.max(...keys.map(k => this.graces[k].length));;
    keys.forEach(k => {
      if (gracesLength == this.graces[k].length) return;
      for (var i = this.graces[k].length; i < gracesLength; i++) {
        this.graces[k].unshift(null);
      }
    })
  }

  drawGraces(pm) {
    if (!this.graces) return;
    let sb = new StemBuilder(pm);
    this.addNilsAtGraces();
    let keys = Object.keys(this.graces);
    let x = pm.cursor;
    let dxAcc;
    for (var i = 0; i < this.graces[keys[0]].length; i++) {
      dxAcc = 0;
      keys.forEach(k => {
        let n = this.graces[k][i];
        if (!n) return;
        if (n.accidental) {
          let op = {x : x + 3, y: n.drawY(pm), text: emm.Accidental[n.accidental]};
          let a = SVGBuilder.emmentaler(op);
          a.style.fontSize = '38px';
          pm.g.append(a);
          dxAcc = 15;
        }
        n.x = x + dxAcc;
        n.y = n.drawY(pm);
        n.draw(pm);
        sb.push(n);
      });
      sb.draw();
      x += (15 + dxAcc);
    }
    pm.cursor = x;
  }

  draw(pm) {
    this.drawSignature(pm);
    this.drawGraces(pm);
    this.proccessBeforeNotesElements(pm);
    this.drawAdditionalLines(pm);
    this.x = pm.cursor;
    this.drawNotes(pm);
    this.drawAugmentationDotes(pm);
    pm.sb.draw();
  }
}
