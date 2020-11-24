class Note {
  constructor(xml, bar) {
    this.xml = xml;
    this.bar = bar;
    Ut.parseChildren(this, xml);
    this.parseBeam();
    this.parseTie();
  }

  get stepLine() {
    if (this.rest) return 0;
    return this.pitch.octave * 7 + Note.sToStep[this.pitch.step];
  }

  drawLine(clef) {
    return this.stepLine - Note.clefLine[clef[this.staff].toS()];
  }

  drawY(clef) {
    let baseY = {1: 152, 2: 309.5};
    let r = baseY[this.staff] - 7.5 * this.drawLine(clef);
    if (isNaN(r)) fsdgdsgsdg;
    return r;
  }

  parseTie() {
    let tie = this.xml.querySelectorAll('tie');
    if (0 == tie.length) return;
    this.tie = tie.length;
  }

  parseBeam() {
    let beam = this.xml.querySelectorAll('beam');
    if (0 == beam.length) return;
    this.beam = {};
    beam.forEach(b => {
      this.beam[b.getAttribute('number')] = b.innerHTML;
    });
  }

  beamKey() {
    return this.voice.toString();
  }

  tieKey() {
    return this.voice.toString() + 'n' + this.toString();
  }

  toString() {
    if (this.rest) return 'rest'
    let p = this.pitch;
    return p.step.toString() + ((undefined != p.alter) ? 'a' + p.alter.toString() : '') + 'o' + p.octave.toString();
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
