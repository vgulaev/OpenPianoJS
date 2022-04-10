import {emm} from '../../../common/glyphName.js'
import {SVGBuilder} from '../svgBuilder.js';
import {Ut} from '../ut.js';

export class Note {
  constructor(xml) {
    if (!xml) return;
    this.xml = xml;
    Ut.parseChildren(this, xml);
    if (this.rest) {
      this.stepLine = 0;
    } else {
      this.stepLine = this.setStepLine();
    }
    this.parseBeam();
    this.parseTie();
    this.midiByte = this.setMidiByte();
  }

  setStepLine() {
    return this.pitch.octave * 7 + Note.sToStep[this.pitch.step];
  }

  parseTie() {
    let tie = this.xml.querySelectorAll('tie');
    if (0 == tie.length) return;
    this.tie = [];
    tie.forEach(t => {
      this.tie.push({type: t.getAttributeNS(null, 'type')});
    });
  }

  parseBeam() {
    let beam = this.xml.querySelectorAll('beam');
    if (0 == beam.length) return;
    this.beam = {};
    beam.forEach(b => {
      this.beam[b.getAttribute('number')] = b.innerHTML;
      this.hasHook = (-1 != b.innerHTML.indexOf('hook'));
    });
  }

  tieStatus() {
    if (!this.tie) return;
    if (2 == this.tie.length) {
      return 'continue';
    }
    return this.tie[0].type;
  }

  setMidiByte() {
    let p = this.pitch;
    if ((this.rest) || (-1 != ['continue', 'stop'].indexOf(this.tieStatus()))) return -1;
    return 12 + p.octave * 12 + Note.tones[p.step] + ( p.alter ? p.alter : 0 );
  }

  beamKey() {
    return this.voice.toString();
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

  drawG() {
    let head = 's2';
    if ('whole' == this.type) {
      head = 's0';
    } else if ('half' == this.type) {
      head = 's1';
    }
    let e = SVGBuilder.emmentaler({x: this.x, y: this.y, text: emm.Notehead[head]});
    if (this.grace) {
      e.style.fontSize = '38px';
    }
    return e
  }

  draw(pm) {
    this.g = this.drawG();
    pm.g.append(this.g);
    if (this.notations?.articulations) {
      let symb;
      if (this.notations.articulations.staccato) {
        symb = emm.Articulation.staccato
      } else if (this.notations.articulations.accent) {
        symb = emm.Articulation.accent
      } else if (this.notations.articulations.staccatissimo) {
        symb = emm.Articulation.staccatissimo[this.stem]
      } else {
        console.log(this.notations.articulations, 'should be fixed')
      }
      if (symb) {
        let dy = ('down' == this.stem ? -18 : 18)
        let e = SVGBuilder.emmentaler({x: this.x + 8, y: this.y + dy, text: symb});
        pm.g.append(e);
      }
    }
    if (this.notations?.ornaments) {
      let symb;
      if (this.notations.ornaments['inverted-mordent']) {
        symb = emm.Ornaments['inverted-mordent']
      } else if (this.notations.ornaments['trill-mark']) {
        symb = emm.Ornaments['trill-mark']
      }
      let dy = ('down' == this.stem ? -18 : -60)
      let e = SVGBuilder.emmentaler({x: this.x + 8, y: this.y + dy, text: symb});
      pm.g.append(e);
    }
  }

  drawRest(pm) {
    let head = this.type;
    if (!this.type) head = 'whole';
    let dy = 37;
    if ('whole' == head) dy = 53;
    this.y = Note.baseY[this.staff] - dy;
    let e = SVGBuilder.emmentaler({x: pm.cursor, y: this.y, text: emm.Rest[head]});
    pm.g.append(e);
    this.g = e;
  }

  toS() {
    let s = this.pitch.step + this.pitch.octave;
    if (this.pitch.alter) {
      s += 'a' + this.pitch.alter;
    }
    return s;
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

Note.tones = {
  'C': 0,
  'D': 2,
  'E': 4,
  'F': 5,
  'G': 7,
  'A': 9,
  'B': 11
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
