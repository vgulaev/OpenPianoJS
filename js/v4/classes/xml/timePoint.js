import {emm} from '../../../common/glyphName.js'
import {cconst} from '../../../common/commonConst.js'
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
    for (let y = edge[0]; y > edge[1]; y -= 15) {
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
    return Math.abs(minX) + cconst.accidentalWidth;
  }

  drawAccidental(pm) {
    let dX = ['1', '2'].map( s => this.drawAccidentalAtStaff(pm, this.staff[s]));
    pm.cursor += Math.max(...dX);
  }

  proccessBeforeNotesElements(pm) {
    this.checkArpeggiate(pm);
    this.drawAccidental(pm);
  }

  drawNotes(pm) {

  }

  draw(pm) {
    this.drawSignature(pm);
    this.proccessBeforeNotesElements(pm);
    this.x = pm.cursor;
    this.drawNotes(pm);
    let t = SVGBuilder.text({x: pm.cursor, y: 71, text: 'TP'});
    pm.g.append(t);
    pm.cursor += 30;
  }
}
