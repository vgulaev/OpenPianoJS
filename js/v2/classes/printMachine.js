class PrintMachine {
  constructor(sheet) {
    this.sheet = sheet;
    this.tm = this.sheet.timeMachine;
    this.at = this.tm.arrowOfTime;
    this.ticks = Object.keys(this.tm.arrowOfTime).map(e => parseInt(e));
    this.printClasses = {
      'measure' : 0,
      'clef': 0,
      'note': 0
    }
    this.state = {
      clef: {}
    };
    this.noteIndex = 0;
    this.measureIndex = 0;
    this.cursor = 0;
    this.assignToNextTick = [];
    this.restYOffset = {
      1: 112,
      2: 270
    }
  }

  measure(xml) {
    let e = SVGBuilder.line({x1: this.cursor, y1: 84, x2: this.cursor, y2: 302, 'stroke-width': 2, stroke: 'black'})
    let t = SVGBuilder.text({x: this.cursor - 5, y: 71, text: xml.getAttribute('number')});
    this.sheet.g.append(t);
    this.sheet.g.append(e);
    this.cursor += 10;
  }

  clef(xml) {
    let c = new Clef(xml);
    this.state.clef[c.number] = c.toS();
    this.assignToNextTick.push(c);
  }

  note_y(note) {

  }

  note(xml) {
    let note = this.tm.notes[this.noteIndex];
    let tick = this.at[note.tick];
    note.drawState = this.state;
    if (0 < this.assignToNextTick.length) {
      tick.clef = this.assignToNextTick.slice();
      this.assignToNextTick = [];
    }
    this.noteIndex += 1;
  }

  startPrint(xml) {
    if (xml.tagName in this.printClasses) {
      this[xml.tagName](xml);
    }
  }

  drawTick(tick) {
    if (tick.clef instanceof Array) {
      tick.clef.forEach(c => {
        let o = Ut.clefOffset(c);
        o.x = this.cursor;
        let t = SVGBuilder.emmentaler({x: o['x'], y: o['y'], text: emm.Clef[c.toS()]});
        this.sheet.g.append(t);
      });
      this.cursor += 50;
    }

    tick.chord.forEach(n => {
      if (n.rest) {
        let t = SVGBuilder.emmentaler({x: this.cursor, y: this.restYOffset[n.staff], text: emm.Rest[n.type]});
        tick.g.append(t);
      }
    });
    this.cursor += 40;
    // console.log('hello');
  }

  drawTicksInMeasure() {
    let m = this.sheet.bars[this.measureIndex];

    if (null != m.fifths) {
      let g = SVGBuilder.keySignature(this.state.clef[1], this.state.clef[2], m.fifths, this.cursor);
      this.sheet.g.append(g);
      this.cursor += 100;
    }

    let from = m.from;
    if (from == 0) from = -10;
    let ticks = this.ticks.filter(e => from <= e && e < m.to).sort((a,b) => a - b);
    ticks.forEach(t => this.drawTick(this.at[t]));
    // this.drawTick(this.at[ticks[0]]);
  }

  finishPrint(xml) {
    if ('measure' == xml.tagName) {
      this.drawTicksInMeasure();
      this.measureIndex += 1;
    }
  }
}
