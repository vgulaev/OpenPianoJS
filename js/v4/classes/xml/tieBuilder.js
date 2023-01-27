import {SVGBuilder} from '../svgBuilder.js';

export class TieBuilder {
  constructor(printMachine) {
    this.pm = printMachine;
    this.ties = {1: {}, 2: {}};
    this.slur = {1: {}, 2: {}};
  }

  pushTie(note) {
    let status = note.tieStatus();
    let key = note.drawLine(this.pm);
    if ('start' == status) {
      this.ties[note.staff][key] = {
        start: note
      }
    } else {
      this.ties[note.staff][key]['end'] = note;
    }
  }

  pushSlur(note) {
    let slur = note.notations.slur;
    if (!this.slur[note.staff][slur.number]) {
      this.slur[note.staff][slur.number] = {};
    }
    this.slur[note.staff][slur.number][slur.type] = note;
  }

  push(note) {
    if (note.tie) this.pushTie(note);
    if (note.notations && note.notations.slur) this.pushSlur(note);
  }

  drawPath(path) {
    let style = {
      stroke: '#000000',
      'stroke-width': '1',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'fill-rule': 'evenodd',
    };
    style['d'] = path;

    let p = SVGBuilder.createSVG('path');
    SVGBuilder.setAttr(p, style);
    this.pm.g.append(p);
  }

  drawTie(o) {
    let k = o.k;

    let y369 = o.y1 - k * ((1 == o.n.stepLine % 2) ? 0 : 6);
    let x687 = o.x1 + 22;
    let x750 = o.x2 - 4;
    let x700 = x687 + (x750 - x687) * (700 - 687) / (750 - 687);
    let x737 = x687 + (x750 - x687) * (737 - 687) / (750 - 687);

    let y361 = y369 - k * 6 * (x750 - x687) / 50;
    let y357 = y361 - k * 2;

    let d = `M${x687},${y369} C${x700},${y357} ${x737},${y357} ${x750},${y369 + (o.y2 - o.y1)} C${x737},${y361} ${x700},${y361} ${x687},${y369}`;

    this.drawPath(d);

  }

  drawSlur(o) {
    let ys = o.y1 - 10;
    let xs = o.x1 + 9;
    let ye = o.y2 - 10;

    let kk = (ye - ys) / (o.x2 - xs);
    let x1 = (o.x2 - xs) * 0.20 + xs;
    let y1 = ys + (x1 - xs) * kk;
    let x2 = (o.x2 - xs) * 0.80 + xs;
    let y2 = ys + (x1 - xs) * kk;

    let d = `M${xs},${ys} C${x1},${y1 - 10} ${x2},${y2 + (ye - ys) * 2} ${o.x2},${ye} C${x2},${y2 + (ye - ys) * 2 - 7} ${x1},${y1 - 7} ${xs},${ys}`;

    this.drawPath(d);
  }

  drawTieAtStaff(tieAtStaff) {
    let keys = Object.keys(tieAtStaff).sort((a, b) => a - b).filter(k => tieAtStaff[k].end);
    if (0 == keys.length) return;
    keys.forEach((key, i) => {
      let t = tieAtStaff[key];
      let k = 1;
      if (1 == keys.length) {
        if ('up' == t.start.stem) {
          k = -1;
        }
      } else if (2 == keys.length) {
        if (0 == i) {
          k = -1;
        }
      } else if (4 == keys.length) {
        if (i < 2) {
          k = -1;
        }
      }
      let op = {x1: t.start.x, y1: t.start.y, x2: t.end.x, y2: t.end.y, k: k, n: t.start};
      this.drawTie(op);
      let status = t.end.tieStatus();
      if ('stop' == status) {
        delete tieAtStaff[key];
      } else if ('continue' == status) {
        t.start = t.end;
      }
    });
  }

  drawSlurAtStaff(slurAtStaff) {
    let keys = Object.keys(slurAtStaff).sort((a, b) => a - b).filter(k => slurAtStaff[k].stop);
    if (0 == keys.length) return;
    keys.forEach((key, i) => {
      let t = slurAtStaff[key];
      let k = 1;
      let op = {x1: t.start.x, y1: t.start.y, x2: t.stop.x, y2: t.stop.y, k: k, n: t.start};
      this.drawSlur(op);
      delete slurAtStaff[key];
    });
  }

  draw() {
    [1, 2].forEach(s => this.drawTieAtStaff(this.ties[s]));
    // [1, 2].forEach(s => this.drawSlurAtStaff(this.slur[s]));
  }
}
