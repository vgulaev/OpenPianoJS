import {Ut} from '../ut.js';

export class Note {
  constructor(xml) {
    this.xml = xml;
    Ut.parseChildren(this, xml);
    if (this.rest) {
      this.stepLine = 0;
    } else {
      this.stepLine = this.pitch.octave * 7 + Note.sToStep[this.pitch.step];
    }
    // if
    // s0: '\u{E192}',
    // s1: '\u{E193}',
    // s2: '\u{E194}'

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
}

Note.clefLine = {
  'G0': 29,
  'G-1': 22,
  'G1': 36,
  'F0': 17
}

Note.sToStep = { 'C': 0,
  'D': 1,
  'E': 2,
  'F': 3,
  'G': 4,
  'A': 5,
  'B': 6
}
