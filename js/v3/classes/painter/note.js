class Note {
  constructor(xml) {
    this.xml = xml;
    Ut.parseChildren(this, xml);
  }

  get stepLine() {
    if (this.rest) return 0;
    return this.pitch.octave * 7 + Note.sToStep[this.pitch.step];
  }

  drawLine(clef) {
    return this.stepLine - Note.clefLine[clef.toS()];
  }

  drawY(clef) {
    let baseY = {1: 152, 2: 309.5};
    let r = baseY[this.staff] - 7.5 * this.drawLine(clef);
    if (isNaN(r)) fsdgdsgsdg;
    return r;
  }

  draw(pm) {
    if (this.rest) return;
    let nhead = emm.Notehead['s2'];
    if ('whole' == this.type) {
      nhead = emm.Notehead['s0'];
    } else if ('half' == this.type) {
      nhead = emm.Notehead['s1'];
    }
    // this.x = pm.cursor;
    // this.y = this.drawY(pm);
    this.x = pm.cursor;
    this.y = this.drawY(pm.drawClef[this.staff]);

    let t = SVGBuilder.emmentaler({x: this.x, y: this.y, text: nhead});
    pm.tm.arrowOfTime[this.tick].g.append(t);
  }
}

Note.clefLine = {
  'G0': 29,
  'G-1': 22,
  'G1': 36,
  'F0': 17
}

Note.tonesToS = {
  0: 'C',
  2: 'D',
  4: 'E',
  5: 'F',
  7: 'G',
  9: 'A',
  11: 'B'
}

Note.tones = { 'C': 0,
  'D': 2,
  'E': 4,
  'F': 5,
  'G': 7,
  'A': 9,
  'B': 11
}

Note.stepToS = { 0: 'C',
  1: 'D',
  2: 'E',
  3: 'F',
  4: 'G',
  5: 'A',
  6: 'B'
}

Note.sToStep = { 'C': 0,
  'D': 1,
  'E': 2,
  'F': 3,
  'G': 4,
  'A': 5,
  'B': 6
}
