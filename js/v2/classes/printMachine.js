class PrintMachine {
  constructor(sheet) {
    this.sheet = sheet;
    this.tm = this.sheet.timeMachine;
    this.printClasses = {
      'measure' : 0,
      'clef': 0,
      'note': 0
    }
    this.state = {
      clef: {}
    };
    this.noteIndex = 0;
    this.cursor = 0;
  }

  measure(xml) {
    let e = SVGBuilder.line({x1: this.cursor, y1: 84, x2: this.cursor, y2: 302, 'stroke-width': 2, stroke: 'black'})
    this.sheet.g.append(e);
    this.cursor += 10;
  }

  clef(xml) {
    let c = new Clef(xml);
    this.state.clef[c.number] = c.toS();
    // let o = Ut.clefOffset(c);
    // o.x = this.cursor;
    // let t = SVGBuilder.emmentaler({x: o['x'], y: o['y'], text: emm.Clef[c.toS()]});
    // this.sheet.g.append(t);
  }

  note_y(note) {

  }

  note(xml) {
    let note = this.tm.notes[this.noteIndex];
    let t = SVGBuilder.emmentaler({x: this.cursor, y: 137 - 7.5 * this.noteIndex, text: emm.Notehead.s0});
    this.sheet.g.append(t);
    this.cursor += 40;
    console.log(note.stepLine);
    this.noteIndex += 1;
  }

  print(xml) {
    if (xml.tagName in this.printClasses) {
      this[xml.tagName](xml);
    }
  }
}
