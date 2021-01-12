import {emm} from '../../../common/glyphName.js'
import {SVGBuilder} from '../svgBuilder.js';
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

  drawLine(pm) {
    let clef = pm.drawClefs[this.staff];
    return this.stepLine - Note.clefLine[clef.toS()];
  }

  drawY(pm) {
    let clef = pm.drawClefs[this.staff];
    let r = Note.baseY[this.staff] - 7.5 * this.drawLine(pm);
    if (isNaN(r)) fsdgdsgsdg;
    return r;
  }

  draw(pm) {
    let head = 's2';
    if ('whole' == this.type) {
      head = 's0';
    } else if ('half' == this.type) {
      head = 's1';
    }
    let e = SVGBuilder.emmentaler({x: this.x, y: this.y, text: emm.Notehead[head]});
    pm.g.append(e);
    this.g = e;
  }

  drawRest(pm) {
    let head = this.type;
    if (!this.type) head = 'whole';
    let dy = 37;
    if ('whole' == head) dy = 53;
    let e = SVGBuilder.emmentaler({x: pm.cursor, y: Note.baseY[this.staff] - dy, text: emm.Rest[head]});
    pm.g.append(e);
    this.g = e;
  }
}

Note.baseY = {
  1: 152,
  2: 309.5
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
