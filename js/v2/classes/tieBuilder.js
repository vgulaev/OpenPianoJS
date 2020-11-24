class TieBuilder {
  constructor(printMachine) {
    this.pm = printMachine;
    this.g = this.pm.sheet.g;
    this.ties = {};
    this.lastTie = {
      x: 0,
      y: 0
    };
  }

  push(note) {
    if (undefined == note.tie) return;
    let key = note.tieKey();
    if (key in this.ties) {
      this.draw(key, note);
      if (2 == note.tie) {
        this.ties[key] = note;
      } else {
        delete this.ties[key];
      }
    } else {
      this.ties[key] = note;
    }
  }

  drawTie(o) {
    let style = {
      stroke: '#000000',
      'stroke-width': '1',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'fill-rule': 'evenodd'
    };
    let k = -1;
    if (this.lastTie.x == o.x2) {
      if (this.lastTie.y - o.y2 < 20) k = 1;
    }

    let y369 = o.y1 - k * ((1 == o.n.stepLine % 2) ? 0 : 6);
    let x687 = o.x1 + 22;
    let x750 = o.x2 - 4;
    let x700 = x687 + (x750 - x687) * (700 - 687) / (750 - 687);
    let x737 = x687 + (x750 - x687) * (737 - 687) / (750 - 687);

    let y361 = y369 - k * 6 * (x750 - x687) / 50;
    let y357 = y361 - k * 2;

    this.lastTie = {x: o.x2, y: o.y2};

    style['d'] = `M${x687},${y369} C${x700},${y357} ${x737},${y357} ${x750},${y369} C${x737},${y361} ${x700},${y361} ${x687},${y369}`;
    let p = SVGBuilder.createSVG('path');
    SVGBuilder.setAttr(p, style);
    return p;
  }

  draw(key, n2) {
    let n1 = this.ties[key];
    // let t = SVGBuilder.line({x1: n1.x, y1: n1.y, x2: n2.x, y2: n2.y, 'stroke-width': 2, stroke: 'black'})
    let t = this.drawTie({x1: n1.x, y1: n1.y, x2: n2.x, y2: n2.y, n: n2})
    this.g.append(t);
  }
}
